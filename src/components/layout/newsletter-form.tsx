"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function NewsletterForm() {
  const [email, setEmail] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()

    if (!EMAIL_PATTERN.test(value)) {
      toast.error("Enter a valid email address to continue.")
      return
    }

    // There is no newsletter backend yet. Be explicit instead of pretending
    // the address was stored.
    toast.info("Newsletter signup is not connected yet.", {
      description:
        "This form validates your email locally and does not store it. A mailing-list integration will be added in a later phase.",
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <Label htmlFor="newsletter-email" className="sr-only">
        Email address
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby="newsletter-note"
          className="bg-background"
        />
        <Button type="submit" className="shrink-0">
          Subscribe
        </Button>
      </div>
      <p id="newsletter-note" className="text-xs leading-relaxed text-muted-foreground">
        Newsletter delivery is not connected yet. This form only validates your
        address locally and never sends it.
      </p>
    </form>
  )
}

export { NewsletterForm }
