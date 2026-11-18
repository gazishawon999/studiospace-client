"use client"

import * as React from "react"
import { AlertTriangle, HelpCircle, LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  pendingLabel?: string
  cancelLabel?: string
  tone?: "default" | "destructive"
  onConfirm: () => void | Promise<void>
  onError?: (error: unknown) => void
}

/**
 * Accessible custom confirmation modal. Never use window.confirm().
 * The dialog stays open while an async action is pending and only closes on
 * success, so destructive requests cannot be submitted twice.
 */
function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  pendingLabel = "Working…",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  onError,
}: ConfirmationDialogProps) {
  const [pending, setPending] = React.useState(false)
  const destructive = tone === "destructive"

  const handleConfirm = async () => {
    setPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      if (onError) {
        onError(error)
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "The action could not be completed. Please try again.",
        )
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              destructive
                ? "bg-destructive-soft text-destructive"
                : "bg-primary-soft text-accent-foreground"
            }
          >
            {destructive ? (
              <AlertTriangle aria-hidden="true" />
            ) : (
              <HelpCircle aria-hidden="true" />
            )}
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <Button
            type="button"
            variant={destructive ? "destructive" : "default"}
            onClick={() => void handleConfirm()}
            disabled={pending}
          >
            {pending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : null}
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmationDialog }
