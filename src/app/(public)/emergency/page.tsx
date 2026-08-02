import { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { EmergencyDirectory } from "@/components/emergency/emergency-directory";
import { getEmergencyContacts, getEmergencyPdf } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Emergency Registry",
  description:
    "Important emergency contacts — ambulance, hospital, college union, hostels, watchmen, police and auto drivers.",
};

export default async function EmergencyPage() {
  const [contacts, pdfData] = await Promise.all([
    getEmergencyContacts(),
    getEmergencyPdf(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Campus & Essential Helplines"
        title="Emergency Registry"
        description="Quick access to essential contacts across campus, hostels, medical services, and emergency helplines. In an emergency, every second counts."
        breadcrumb={[{ label: "Emergency" }]}
      />
      <section className="py-10 sm:py-16">
        <Container>
          <EmergencyDirectory contacts={contacts} pdfData={pdfData} />
        </Container>
      </section>
    </>
  );
}


