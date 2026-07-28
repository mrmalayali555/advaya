import Image from "next/image";
import { FileText, Film, Trash2 } from "lucide-react";
import { AdminHeader, EmptyRow } from "@/components/admin/admin-ui";
import { MediaUploader } from "@/components/admin/media-uploader";
import { IconDeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { deleteMedia } from "@/lib/actions/media";

export default async function AdminMediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <AdminHeader title="Media Library" description="Upload and manage images, videos and PDFs." />

      <div className="mb-8">
        <MediaUploader />
      </div>

      {media.length === 0 ? (
        <EmptyRow>No media uploaded yet.</EmptyRow>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[var(--shadow-soft)]">
              <div className="relative aspect-square bg-ink-50">
                {m.type === "image" ? (
                  <Image src={m.url} alt={m.name} fill className="object-cover" sizes="200px" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-ink-400">
                    {m.type === "video" ? <Film className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                    <span className="mt-2 px-2 text-center text-[10px]">{m.type.toUpperCase()}</span>
                  </div>
                )}
                <form action={deleteMedia.bind(null, m.id)} className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <IconDeleteBtn />
                </form>
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-ink-700">{m.name}</p>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="mt-0.5 block truncate text-[11px] text-purple-500 hover:underline">
                  {m.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

