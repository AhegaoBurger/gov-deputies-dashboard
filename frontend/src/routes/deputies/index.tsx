import { createFileRoute } from "@tanstack/react-router";
import { DeputiesPage } from "@/features/deputies/pages/DeputiesPage";

export const Route = createFileRoute("/deputies/")({
  component: DeputiesPage,
});
