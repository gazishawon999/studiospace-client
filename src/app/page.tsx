"use client";

import { useEffect, useState } from "react";
import {
  Aperture,
  CheckCircle2,
  Database,
  RefreshCw,
  Server,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { HealthCheckResponse } from "@/types";
import { Button } from "@/components/ui/button";

export default function PhaseOneStatusPage() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkBackendHealth = async (showToast = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<HealthCheckResponse>("/health");
      setHealth(response);
      if (showToast) {
        toast.success(
          `Connected to ${response.database.name} (${response.database.latencyMs}ms)`,
        );
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not reach studiospace-server. Ensure it is running on port 5000.";
      setError(message);
      if (showToast) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth(false);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-2xl w-full rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Aperture className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Phase 01 • Foundation Ready
              </span>
              <h1 className="text-2xl font-bold tracking-tight">
                StudioSpace Architecture Check
              </h1>
            </div>
          </div>
          <Button
            onClick={() => checkBackendHealth(true)}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Ping API
          </Button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Validating connectivity between{" "}
          <strong className="text-foreground">studiospace-client</strong>{" "}
          (Next.js App Router + TypeScript) and{" "}
          <strong className="text-foreground">studiospace-server</strong>{" "}
          (Express.js + MongoDB Atlas).
        </p>

        {loading ? (
          <div className="rounded-xl border border-border bg-muted/40 p-6 flex items-center gap-3 text-sm text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            Checking Express REST API & MongoDB Atlas connection...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5 space-y-2">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertCircle className="h-5 w-5" />
              Backend Connection Error
            </div>
            <p className="text-xs text-muted-foreground font-mono">{error}</p>
          </div>
        ) : health ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground">
                <Server className="h-4 w-4 text-primary" />
                Express API Status
              </div>
              <p className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                {health.status.toUpperCase()} ({health.environment})
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Uptime: {health.uptimeSeconds}s
              </p>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground">
                <Database className="h-4 w-4 text-primary" />
                MongoDB Atlas
              </div>
              <p className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                {health.database.name}
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Ping Latency: {health.database.latencyMs}ms
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
