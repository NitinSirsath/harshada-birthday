import { createFileRoute } from "@tanstack/react-router";
import BirthdayPage from "@/components/harshada-birthday";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BirthdayPage />;
}
