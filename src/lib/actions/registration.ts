"use server";

import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRegistrationForm(formData: FormData) {
  await requireAdmin();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const deadlineStr = formData.get("deadline") as string;
  const eventId = formData.get("eventId") as string | null;

  const form = await db.registrationForm.create({
    data: {
      title,
      slug,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
      eventId: eventId || null,
      published: true,
    },
  });

  revalidatePath("/adminahnuok/registrations");
  redirect(`/adminahnuok/registrations/${form.id}`);
}

export async function updateRegistrationForm(id: string, formData: FormData) {
  await requireAdmin();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const deadlineStr = formData.get("deadline") as string;
  const published = formData.get("published") === "on";

  await db.registrationForm.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
      published,
    },
  });

  revalidatePath("/adminahnuok/registrations");
  revalidatePath(`/adminahnuok/registrations/${id}`);
}

export async function deleteRegistrationForm(id: string) {
  await requireAdmin();
  
  await db.registrationForm.delete({
    where: { id },
  });

  revalidatePath("/adminahnuok/registrations");
  redirect("/adminahnuok/registrations");
}

export async function addRegistrationField(formId: string, formData: FormData) {
  await requireAdmin();
  
  const label = formData.get("label") as string;
  const type = formData.get("type") as string;
  const required = formData.get("required") === "on";
  const placeholder = formData.get("placeholder") as string;
  const options = formData.get("options") as string;

  // Get current max order
  const maxOrderField = await db.registrationField.findFirst({
    where: { formId },
    orderBy: { order: "desc" },
  });
  
  const order = maxOrderField ? maxOrderField.order + 1 : 0;

  await db.registrationField.create({
    data: {
      formId,
      label,
      type,
      required,
      placeholder,
      options,
      order,
    },
  });

  revalidatePath(`/adminahnuok/registrations/${formId}`);
}

export async function updateRegistrationField(fieldId: string, formData: FormData) {
  await requireAdmin();
  
  const label = formData.get("label") as string;
  const type = formData.get("type") as string;
  const required = formData.get("required") === "on";
  const placeholder = formData.get("placeholder") as string;
  const options = formData.get("options") as string;

  const field = await db.registrationField.update({
    where: { id: fieldId },
    data: {
      label,
      type,
      required,
      placeholder,
      options,
    },
  });

  revalidatePath(`/adminahnuok/registrations/${field.formId}`);
}

export async function removeRegistrationField(fieldId: string) {
  await requireAdmin();
  
  const field = await db.registrationField.delete({
    where: { id: fieldId },
  });

  revalidatePath(`/adminahnuok/registrations/${field.formId}`);
}

export async function reorderRegistrationFields(formId: string, fieldIds: string[]) {
  await requireAdmin();
  
  await db.$transaction(
    fieldIds.map((id, index) =>
      db.registrationField.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  revalidatePath(`/adminahnuok/registrations/${formId}`);
}
