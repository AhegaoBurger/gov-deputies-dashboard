import { createFileRoute } from "@tanstack/react-router";
import { BenefitsPage } from "@/features/benefits/pages/BenefitsPage";

export const Route = createFileRoute("/benefits")({
  component: BenefitsPage,
});
