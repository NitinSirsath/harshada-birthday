import { createFileRoute } from "@tanstack/react-router";
import HarshadaBirthdayPage from "@/components/harshada-birthday";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HarshadaBirthdayPage />;
}
