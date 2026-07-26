"use client";

import Link from "next/link";
import { Field, TextArea, Select, Toggle, UploadField, SubmitBtn, DeleteBtn } from "./form-fields";

type Data = {
  title: string;
  category: string;
  description: string;
  date: Date;
  coverImage: string | null;
  published: boolean;
};

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export function AchievementForm({
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
            <Field label="Title" name="title" defaultValue={item?.title} required placeholder="Inter-Medical Football Championship 2026" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Category"
                name="category"
                defaultValue={item?.category ?? "sports"}
                options={[
                  { value: "sports", label: "Sports" },
                  { value: "arts", label: "Arts" },
                  { value: "academics", label: "Academics" },
                ]}
              />
              <Field label="Date" name="date" type="date" defaultValue={item ? toDateInput(item.date) : new Date().toISOString().slice(0, 10)} required />
            </div>
            <TextArea label="Description" name="description" defaultValue={item?.description} required rows={5} />
            <UploadField label="Cover image" name="coverImage" defaultUrl={item?.coverImage} accept="image/*" hint="JPG, PNG, WebP up to 8MB" />
            <Toggle label="Published" name="published" defaultChecked={item?.published ?? true} hint="Show on the public site" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SubmitBtn>{item ? "Save changes" : "Create achievement"}</SubmitBtn>
          <Link href="/adminahnuok/achievements" className="text-sm font-medium text-ink-500 hover:text-ink-800">Cancel</Link>
        </div>
      </form>
      {item && deleteAction && (
        <form action={deleteAction} className="border-t border-ink-100 pt-6">
          <DeleteBtn label="Delete achievement" />
        </form>
      )}
    </div>
  );
}

