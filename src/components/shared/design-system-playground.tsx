"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { Button } from "@/components/ui/button"

type DialogKind = "default" | "destructive" | null

function DesignSystemPlayground() {
  const [dialog, setDialog] = useState<DialogKind>(null)

  const handleConfirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    toast.success("Preview complete — no data was changed.", {
      description:
        "In a later phase this modal will wrap the real delete request.",
    })
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={() => setDialog("default")}>
          Open confirmation modal
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => setDialog("destructive")}
        >
          Delete a preview listing
        </Button>
      </div>

      <ConfirmationDialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        title={
          dialog === "destructive"
            ? "Delete this preview listing?"
            : "Publish this preview?"
        }
        description={
          dialog === "destructive"
            ? "This demonstrates the destructive confirmation pattern. No studio record exists and nothing will be deleted."
            : "This demonstrates the async confirmation pattern. The confirm button stays in a pending state until the action resolves."
        }
        confirmLabel={
          dialog === "destructive" ? "Delete listing" : "Confirm action"
        }
        pendingLabel="Working…"
        tone={dialog === "destructive" ? "destructive" : "default"}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export { DesignSystemPlayground }
