import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/integration")({
  beforeLoad: () => {
    throw redirect({
      to: "/data",
    });
  },
});
