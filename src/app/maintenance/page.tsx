import type { Metadata } from "next";
import { MaintenancePage } from "@/components/layout/maintenance-page";

export const metadata: Metadata = {
  title: "Website Under Development | Advaya College",
  robots: { index: false, follow: false },
};

export default function MaintenanceRoute() {
  return <MaintenancePage />;
}