import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      narrow: "max-w-3xl px-4 sm:px-6",
      default: "max-w-7xl px-4 sm:px-6 lg:px-8",
      wide: "max-w-[90rem] px-4 sm:px-6 lg:px-8",
      full: "max-w-none px-4 sm:px-6 lg:px-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface ContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof containerVariants> {}

function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  )
}

export { Container, containerVariants }
