"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Search, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StudioCard } from "@/components/shared/studio-card";
import { getStudios } from "@/lib/studios";
import { resolveStudioCategory, toCategorySlug } from "@/lib/studio-categories";
import { STUDIO_CATEGORIES, type IStudio } from "@/types";

type SortValue = "newest" | "price-asc" | "price-desc" | "rating";

interface FilterState {
  q: string;
  category: string;
  minHourlyRate: string;
  maxHourlyRate: string;
  maxCapacity: string;
  sort: SortValue;
}

const DEFAULT_FILTERS: FilterState = {
  q: "",
  category: "",
  minHourlyRate: "",
  maxHourlyRate: "",
  maxCapacity: "",
  sort: "newest",
};

function parseSort(value: string | null): SortValue {
  if (
    value === "newest" ||
    value === "price-asc" ||
    value === "price-desc" ||
    value === "rating"
  ) {
    return value;
  }
  return "newest";
}

function filtersFromSearchParams(
  searchParams: URLSearchParams | { toString(): string; get(name: string): string | null },
): FilterState {
  const resolvedCategory = resolveStudioCategory(searchParams.get("category"));

  return {
    q: searchParams.get("q") || searchParams.get("search") || "",
    category: resolvedCategory || "",
    minHourlyRate: searchParams.get("minHourlyRate") || "",
    maxHourlyRate: searchParams.get("maxHourlyRate") || "",
    maxCapacity: searchParams.get("maxCapacity") || "",
    sort: parseSort(searchParams.get("sort")),
  };
}

function toQueryString(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.category) params.set("category", toCategorySlug(filters.category));
  if (filters.minHourlyRate) params.set("minHourlyRate", filters.minHourlyRate);
  if (filters.maxHourlyRate) params.set("maxHourlyRate", filters.maxHourlyRate);
  if (filters.maxCapacity) params.set("maxCapacity", filters.maxCapacity);
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  return params.toString();
}

function areFiltersEqual(a: FilterState, b: FilterState): boolean {
  return (
    a.q === b.q &&
    a.category === b.category &&
    a.minHourlyRate === b.minHourlyRate &&
    a.maxHourlyRate === b.maxHourlyRate &&
    a.maxCapacity === b.maxCapacity &&
    a.sort === b.sort
  );
}

interface ExploreStudiosClientProps {
  searchParamsString: string;
}

export function ExploreStudiosClient({ searchParamsString }: ExploreStudiosClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const appliedFilters = filtersFromSearchParams(new URLSearchParams(searchParamsString));

  const [draft, setDraft] = useState<FilterState>(appliedFilters);
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  async function load(targetPage: number, append: boolean) {
    const requestId = ++requestIdRef.current;
    setError(null);
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const result = await getStudios({
        q: appliedFilters.q || undefined,
        category: appliedFilters.category || undefined,
        minHourlyRate: appliedFilters.minHourlyRate || undefined,
        maxHourlyRate: appliedFilters.maxHourlyRate || undefined,
        maxCapacity: appliedFilters.maxCapacity || undefined,
        sort: appliedFilters.sort,
        page: targetPage,
        limit: 12,
      });

      if (requestId !== requestIdRef.current) return;

      setStudios((prev) => (append ? [...prev, ...result.studios] : result.studios));
      setPage(result.pagination.page);
      setHasMore(result.pagination.hasMore);
      setTotal(result.pagination.total);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(
        err instanceof Error
          ? err.message
          : "We could not load studios right now.",
      );
      if (!append) {
        setStudios([]);
        setHasMore(false);
        setTotal(0);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    async function run() {
      try {
        const result = await getStudios({
          q: appliedFilters.q || undefined,
          category: appliedFilters.category || undefined,
          minHourlyRate: appliedFilters.minHourlyRate || undefined,
          maxHourlyRate: appliedFilters.maxHourlyRate || undefined,
          maxCapacity: appliedFilters.maxCapacity || undefined,
          sort: appliedFilters.sort,
          page: 1,
          limit: 12,
        });

        if (cancelled || requestId !== requestIdRef.current) return;
        setStudios(result.studios);
        setPage(result.pagination.page);
        setHasMore(result.pagination.hasMore);
        setTotal(result.pagination.total);
      } catch (err) {
        if (cancelled || requestId !== requestIdRef.current) return;
        setError(
          err instanceof Error
            ? err.message
            : "We could not load studios right now.",
        );
        setStudios([]);
        setHasMore(false);
        setTotal(0);
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
    // Component is remounted (keyed) when URL query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  function applyFilters(next: FilterState) {
    const query = toQueryString(next);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  // Debounce text search to avoid excessive URL/fetch churn while typing.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (draft.q === appliedFilters.q) return;
      applyFilters({ ...draft, q: draft.q.trimStart() });
    }, 350);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.q, appliedFilters.q]);

  const hasActiveFilters = !areFiltersEqual(appliedFilters, DEFAULT_FILTERS);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters({ ...draft, q: draft.q.trim() });
  }

  function clearFilters() {
    setDraft(DEFAULT_FILTERS);
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="mt-8 space-y-6">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="studio-search">Search</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="studio-search"
                value={draft.q}
                onChange={(e) => setDraft((prev) => ({ ...prev, q: e.target.value }))}
                placeholder="Search by title or location"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-category-filter">Category</Label>
            <Select
              value={draft.category || "all"}
              onValueChange={(value) => {
                const next = {
                  ...draft,
                  category: !value || value === "all" ? "" : value,
                };
                setDraft(next);
                applyFilters(next);
              }}
            >
              <SelectTrigger id="studio-category-filter" className="w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {STUDIO_CATEGORIES.filter(
                  (item) => item.value !== "Sound Stage" && item.value !== "Art Workshop",
                ).map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
                {appliedFilters.category &&
                !STUDIO_CATEGORIES.some(
                  (item) =>
                    item.value === appliedFilters.category &&
                    item.value !== "Sound Stage" &&
                    item.value !== "Art Workshop",
                ) ? (
                  <SelectItem value={appliedFilters.category}>
                    {appliedFilters.category}
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-sort">Sort by</Label>
            <Select
              value={draft.sort}
              onValueChange={(value) => {
                const next = { ...draft, sort: parseSort(value) };
                setDraft(next);
                applyFilters(next);
              }}
            >
              <SelectTrigger id="studio-sort" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Lowest price</SelectItem>
                <SelectItem value="price-desc">Highest price</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-max-capacity">Max capacity</Label>
            <Input
              id="studio-max-capacity"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={draft.maxCapacity}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, maxCapacity: e.target.value }))
              }
              placeholder="Any"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-min-rate">Min hourly rate ($)</Label>
            <Input
              id="studio-min-rate"
              type="number"
              min={0}
              step="1"
              inputMode="decimal"
              value={draft.minHourlyRate}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, minHourlyRate: e.target.value }))
              }
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio-max-rate">Max hourly rate ($)</Label>
            <Input
              id="studio-max-rate"
              type="number"
              min={0}
              step="1"
              inputMode="decimal"
              value={draft.maxHourlyRate}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, maxHourlyRate: e.target.value }))
              }
              placeholder="Any"
            />
          </div>

          <div className="flex items-end gap-2 lg:col-span-2">
            <Button type="submit" className="flex-1 sm:flex-none">
              <SlidersHorizontal aria-hidden="true" />
              Apply filters
            </Button>
            {hasActiveFilters ? (
              <Button type="button" variant="outline" onClick={clearFilters}>
                <X aria-hidden="true" />
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {appliedFilters.q ? <Badge variant="soft">Search: {appliedFilters.q}</Badge> : null}
            {appliedFilters.category ? (
              <Badge variant="soft">Category: {appliedFilters.category}</Badge>
            ) : null}
            {appliedFilters.minHourlyRate ? (
              <Badge variant="soft">Min ${appliedFilters.minHourlyRate}/hr</Badge>
            ) : null}
            {appliedFilters.maxHourlyRate ? (
              <Badge variant="soft">Max ${appliedFilters.maxHourlyRate}/hr</Badge>
            ) : null}
            {appliedFilters.maxCapacity ? (
              <Badge variant="soft">Up to {appliedFilters.maxCapacity} people</Badge>
            ) : null}
            {appliedFilters.sort === "rating" ? (
              <Badge variant="soft">Top rated (real reviews)</Badge>
            ) : null}
          </div>
        ) : null}
      </form>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          {loading ? "Loading studios…" : `${total} studio${total === 1 ? "" : "s"} found`}
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton variant="studio-card" count={6} />
      ) : error ? (
        <ErrorState
          title="Could not load studios"
          description={error}
          action={
            <Button type="button" onClick={() => void load(1, false)}>
              Try again
            </Button>
          }
        />
      ) : studios.length === 0 ? (
        <EmptyState
          icon={Compass}
          title={hasActiveFilters ? "No studios match your search" : "No studios available yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search, filters, or sorting to see more workspaces."
              : "Studios listed by hosts will appear here once they are published."
          }
          action={
            hasActiveFilters ? (
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <ul className="grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <li key={studio._id} className="h-full">
                <StudioCard studio={studio} />
              </li>
            ))}
          </ul>

          {hasMore ? (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => void load(page + 1, true)}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading more…" : "Load more studios"}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}