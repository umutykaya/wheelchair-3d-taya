import { createFileRoute } from "@tanstack/react-router";
import { ConfiguratorLayout } from "@/components/Configurator/ConfiguratorLayout";
import "@/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <ConfiguratorLayout />;
}

