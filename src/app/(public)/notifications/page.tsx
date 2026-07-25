import { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { NotificationRow } from "@/components/cards/content-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { getNotifications } from "@/lib/queries";
import { Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Official notices and announcements from the ADVAYA union.",
};

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <>
      <PageHeader
        eyebrow="Stay Informed"
        title="Notifications"
        description="Official notices and announcements, newest first."
        breadcrumb={[{ label: "Notifications" }]}
      />
      <section className="py-14 sm:py-20">
        <Container size="narrow">
          {notifications.length === 0 ? (
            <EmptyState
              title="No notifications yet."
              icon={<Bell className="h-7 w-7" strokeWidth={1.5} />}
            />
          ) : (
            <RevealGroup className="space-y-4">
              {notifications.map((n) => (
                <RevealItem key={n.id}>
                  <NotificationRow notification={n} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </Container>
      </section>
    </>
  );
}
