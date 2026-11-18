"use client"

import { useTheme } from "next-themes"
import { Toaster } from "sonner"

function AppToaster() {
  const { resolvedTheme } = useTheme()
  const theme =
    resolvedTheme === "dark"
      ? "dark"
      : resolvedTheme === "light"
        ? "light"
        : "system"

  return (
    <Toaster
      position="top-right"
      theme={theme}
      richColors
      closeButton
      toastOptions={{
        className: "font-sans",
      }}
    />
  )
}

export { AppToaster }
