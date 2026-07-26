import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { Field, Select, TextArea, UploadField, SubmitBtn, DeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { createFinance, deleteFinance } from "@/lib/actions/finance";

export default async function AdminFinancePage() {
  const entries = await db.financeEntry.findMany({ orderBy: { date: "desc" } });
  const totalIncome = entries.filter((e) => e.kind === "income").reduce((s, e) => s + e.amount, 0);
  const totalExp = entries.filter((e) => e.kind === "expenditure").reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <AdminHeader title="Finance" description="Record income and expenditure. Totals update automatically." />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <AdminCard><div className="text-xs text-ink-400">Income</div><div className="mt-1 text-2xl font-bold text-emerald-600">₹{totalIncome.toLocaleString("en-IN")}</div></AdminCard>
        <AdminCard><div className="text-xs text-ink-400">Expenditure</div><div className="mt-1 text-2xl font-bold text-red-600">₹{totalExp.toLocaleString("en-IN")}</div></AdminCard>
        <AdminCard><div className="text-xs text-ink-400">Balance</div><div className="mt-1 text-2xl font-bold text-purple-700">₹{(totalIncome - totalExp).toLocaleString("en-IN")}</div></AdminCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <AdminCard>
          <h3 className="mb-4 font-semibold text-ink-900">Add entry</h3>
          <form action={createFinance} className="grid gap-4">
            <Select label="Type" name="kind" options={[{ value: "income", label: "Income" }, { value: "expenditure", label: "Expenditure" }]} />
            <Field label="Category" name="category" placeholder="Union Fund" />
            <Field label="Label" name="label" required placeholder="Annual union fund collection" />
            <Field label="Amount (₹)" name="amount" type="number" required placeholder="480000" />
            <TextArea label="Note (optional)" name="note" rows={2} />
            <UploadField label="Receipt (optional)" name="receiptUrl" accept="application/pdf,image/*" hint="PDF or image" />
            <SubmitBtn>Add entry</SubmitBtn>
          </form>
        </AdminCard>

        <div>
          {entries.length === 0 ? (
            <EmptyRow>No finance entries yet.</EmptyRow>
          ) : (
            <div className="space-y-3">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-[var(--shadow-soft)]">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-900">{e.label}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-400">
                      <span className="rounded-full bg-ink-100 px-2 py-0.5">{e.category}</span>
                      <span>{formatDate(e.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${e.kind === "income" ? "text-emerald-600" : "text-red-600"}`}>
                      {e.kind === "income" ? "+" : "−"}₹{e.amount.toLocaleString("en-IN")}
                    </span>
                    <form action={deleteFinance.bind(null, e.id)}>
                      <DeleteBtn label="" />
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

