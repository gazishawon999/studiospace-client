import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        outline:
          "border-border bg-background/60 text-foreground [a]:hover:bg-muted",
        soft: "bg-primary-soft text-accent-foreground",
        success: "bg-success-soft text-success ring-1 ring-success/15",
        warning: "bg-warning-soft text-warning ring-1 ring-warning/15",
        info: "bg-info-soft text-info ring-1 ring-info/15",
        destructive:
          "bg-destructive-soft text-destructive ring-1 ring-destructive/15 [a]:hover:bg-destructive-soft/80",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-5 px-2 text-[0.6875rem]",
        default: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-[0.8125rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Badge({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  })
}

export { Badge, badgeVariants }
