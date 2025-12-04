import AmrutaHappyBirthday from "@/components/birthday";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/amruta-birthday/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AmrutaHappyBirthday />
    </div>
  );
}
