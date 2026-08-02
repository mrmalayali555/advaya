import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import RegistrationForm from "./registration-form";
import { AlertCircleIcon } from "lucide-react";
import { Metadata } from "next";
import { formatDateTime } from "@/lib/utils";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const form = await db.registrationForm.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!form) return { title: "Not Found" };

  const title = `${form.title} — Registration | ADVAYA TDMC Alappuzha`;
  const description = form.description?.slice(0, 160) || `Register online for ${form.title} at ADVAYA — Government TD Medical College Alappuzha.`;
  const url = `${SITE.url}/registration/${slug}`;

  return {
    title,
    description,
    keywords: [
      form.title,
      `${form.title} registration`,
      "Advaya Fest",
      "Advaya Registration",
      "ADVAYA TDMC Alappuzha",
      "Government TD Medical College Alappuzha",
      "TDMC Alappuzha Events",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      images: [{ url: "/og.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function RegistrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const form = await db.registrationForm.findUnique({
    where: { slug },
    include: {
      fields: { orderBy: { order: "asc" } },
      event: { select: { slug: true, status: true } }
    },
  });

  if (!form || !form.published) {
    notFound();
  }

  const isClosed = (form.deadline && new Date() > new Date(form.deadline)) || form.event?.status === "completed";

  return (
    <div className="min-h-screen bg-ink-50 pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold text-ink-900 md:text-5xl mb-4">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-lg text-ink-600 max-w-2xl mx-auto whitespace-pre-wrap">
              {form.description}
            </p>
          )}
        </div>

        {isClosed ? (
          <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-soft border border-ink-100 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6">
              <AlertCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">Registration Closed</h2>
            <p className="text-ink-600">
              {form.event?.status === "completed" 
                ? "This event has already been completed, so registrations are now closed." 
                : `The deadline for this registration was ${formatDateTime(form.deadline!)}. `
              } 
              We are no longer accepting submissions.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-soft border border-ink-100">
            <RegistrationForm 
              formId={form.id} 
              fields={form.fields} 
              title={form.title}
              eventSlug={form.event?.slug}
            />
          </div>
        )}
      </div>
    </div>
  );
}
