import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { notFound, redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { createGallery } from "@/lib/actions/gallery";

export default async function GalleryThemeSelectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: { gallery: true },
  });

  if (!event) notFound();

  if (event.gallery) {
    redirect(`/adminahnuok/events/${event.id}/gallery/customize`);
  }

  const themes = [
    {
      id: "bohemian",
      name: "Bohemian",
      description:
        "Scattered polaroids around center text on a warm, organic background. Handwritten-style captions.",
      color: "bg-[#f9f7f4]",
      accent: "border-[#e2c4b8]",
      preview: "🎨",
    },
    {
      id: "scrapbook",
      name: "Scrapbook",
      description:
        "Polaroids with colorful washi tape on a textured paper background. Playful and layered.",
      color: "bg-[#e8e4de]",
      accent: "border-[#a6b8c7]",
      preview: "📎",
    },
    {
      id: "corkboard",
      name: "Cork Board",
      description:
        "Photos pinned to a wood board with handwritten cursive captions. Hover to zoom.",
      color: "bg-[#8B6914]",
      accent: "border-[#c4a962]",
      preview: "📌",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Photo Gallery: ${event.title}`}
        description="Select a theme for this event's photo gallery."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-card)]"
          >
            {/* Preview area */}
            <div
              className={`flex h-36 items-center justify-center ${theme.color} relative overflow-hidden p-4`}
            >
              {/* Fake polaroid previews */}
              <div className="absolute left-4 top-4 h-16 w-12 rotate-[-8deg] rounded-sm bg-white p-1 shadow-md">
                <div className={`h-9 w-full ${theme.color === "bg-[#8B6914]" ? "bg-amber-200" : "bg-ink-200"}`} />
              </div>
              <div className="absolute right-6 top-6 h-16 w-12 rotate-[5deg] rounded-sm bg-white p-1 shadow-md">
                <div className={`h-9 w-full ${theme.color === "bg-[#8B6914]" ? "bg-amber-300" : "bg-ink-300"}`} />
              </div>
              <div className="absolute bottom-4 left-1/2 h-16 w-12 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-white p-1 shadow-md">
                <div className={`h-9 w-full ${theme.color === "bg-[#8B6914]" ? "bg-amber-100" : "bg-ink-100"}`} />
              </div>
              <span className="relative z-10 text-4xl">{theme.preview}</span>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold text-ink-800">{theme.name}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">
                {theme.description}
              </p>

              <form
                action={async () => {
                  "use server";
                  await createGallery(event.id, theme.id);
                }}
                className="mt-4"
              >
                <button
                  type="submit"
                  className="w-full rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(91,42,134,0.39)] transition-all hover:-translate-y-0.5 hover:bg-purple-700"
                >
                  Select {theme.name}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
