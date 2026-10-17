import { createFileRoute } from "@tanstack/react-router";
import DipaliiBirthdayPage from "@/components/harshada-birthday";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DipaliiBirthdayPage />;
}
