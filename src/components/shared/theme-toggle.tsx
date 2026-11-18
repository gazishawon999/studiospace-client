"use client"

import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Only the menu contents depend on the stored preference. The trigger icon
  // is switched with CSS `.dark` variants so the server and client render the
  // same markup (next-themes resolves the system theme before hydration).
  const activeTheme = theme ?? "system"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Change theme"
            title="Change theme"
          />
        }
      >
        <Sun
          className="size-[1.15rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0"
          aria-hidden="true"
        />
        <Moon
          className="absolute size-[1.15rem] -rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          aria-hidden="true"
        />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon
            const isActive = activeTheme === option.value
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setTheme(option.value)}
                className="gap-2.5"
              >
                <Icon aria-hidden="true" />
                <span>{option.label}</span>
                {isActive ? (
                  <Check className="ml-auto text-primary" aria-hidden="true" />
                ) : null}
                {isActive ? <span className="sr-only">Selected</span> : null}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ThemeToggle }
