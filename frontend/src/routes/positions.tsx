import { createFileRoute } from "@tanstack/react-router";
import { PositionsPage } from "@/features/positions/pages/PositionsPage";

export const Route = createFileRoute("/positions")({
  component: PositionsPage,
});
