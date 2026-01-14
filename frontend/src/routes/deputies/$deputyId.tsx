import { createFileRoute } from "@tanstack/react-router";
import { DeputyDetailPage } from "@/features/deputies/pages/DeputyDetailPage";

export const Route = createFileRoute("/deputies/$deputyId")({
  component: DeputyDetailPage,
});
