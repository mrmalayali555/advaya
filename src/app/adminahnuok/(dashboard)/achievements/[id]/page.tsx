import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { AchievementForm } from "@/components/admin/achievement-form";
import { db } from "@/lib/db";
import { updateAchievement, deleteAchievement } from "@/lib/actions/achievements";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await db.achievement.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <>
      <AdminHeader title="Edit achievement" description={item.title} />
      <AchievementForm
        item={item}
        action={updateAchievement.bind(null, id)}
        deleteAction={deleteAchievement.bind(null, id)}
      />
    </>
  );
}
