"use client";

import Link from "next/link";
import { Field, TextArea, Toggle, UploadField, SubmitBtn, DeleteBtn } from "./form-fields";

type Data = {
  title: string;
  description: string;
  date: Date;
  image: string | null;
  pdfUrl: string | null;
  published: boolean;
};

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export function NotificationForm({
  item,
  action,
  deleteAction,
}: {
  item?: Data;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
  return (
    <div className="space-y-6">
      <form action={action} className="space-y-6">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="grid gap-5">
            <Field label="Title" name="title" defaultValue={item?.title} required placeholder="Holiday declared on 15 October" />
            <TextArea label="Description" name="description" defaultValue={item?.description} required rows={5} />
            <Field label="Date" name="date" type="date" defaultValue={item ? toDateInput(item.date) : new Date().toISOString().slice(0, 10)} required />
            <UploadField label="Image (optional)" name="image" defaultUrl={item?.image} accept="image/*" hint="JPG, PNG, WebP up to 8MB" />
            <UploadField label="PDF attachment (optional)" name="pdfUrl" defaultUrl={item?.pdfUrl} accept="application/pdf" hint="PDF up to 20MB" />
            <Toggle label="Published" name="published" defaultChecked={item?.published ?? true} hint="Show on the public site" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SubmitBtn>{item ? "Save changes" : "Create notification"}</SubmitBtn>
          <Link href="/admin/notifications" className="text-sm font-medium text-ink-500 hover:text-ink-800">Cancel</Link>
        </div>
      </form>
      {item && deleteAction && (
        <form action={deleteAction} className="border-t border-ink-100 pt-6">
          <DeleteBtn label="Delete notification" />
        </form>
      )}
    </div>
  );
}
