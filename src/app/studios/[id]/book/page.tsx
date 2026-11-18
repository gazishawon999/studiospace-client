import { redirect } from "next/navigation";

interface BookWorkspacePageProps {
  params: Promise<{ id: string }>;
}

// Booking flow now opens as a modal on the Studio Details page for authenticated
// users. This route preserves older return URLs by forwarding to that flow.
export default async function BookWorkspacePage({ params }: BookWorkspacePageProps) {
  const { id } = await params;
  redirect(`/studios/${id}?book=1`);
}