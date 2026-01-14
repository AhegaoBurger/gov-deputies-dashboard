import { createFileRoute } from "@tanstack/react-router";
import { ShareholdingsPage } from "@/features/shareholdings/pages/ShareholdingsPage";

export const Route = createFileRoute("/shareholdings")({
  component: ShareholdingsPage,
});
