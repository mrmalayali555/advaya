import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { Field, Select, TextArea, UploadField, SubmitBtn, DeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { createFinance, deleteFinance, saveFinanceConfig } from "@/lib/actions/finance";
import { getFinanceConfig } from "@/lib/finance";

export default async function AdminFinancePage() {
  const [entries, config] = await Promise.all([
    db.financeEntry.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }] }),
    getFinanceConfig(),
  ]);
  const totalIncome = entries.filter((e) => e.kind === "income").reduce((s, e) => s + e.amount, 0);
  const totalExp = entries.filter((e) => e.kind === "expenditure").reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <AdminHeader title={config.title} description="Configure the public account labels, then record every income and expenditure entry." />

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminCard><div className="text-xs text-ink-400">Income</div><div className="mt-1 text-2xl font-bold text-emerald-600">₹{totalIncome.toLocaleString("en-IN")}</div></AdminCard>
        <AdminCard><div className="text-xs text-ink-400">Expenditure</div><div className="mt-1 text-2xl font-bold text-red-600">₹{totalExp.toLocaleString("en-IN")}</div></AdminCard>
        <AdminCard><div className="text-xs text-ink-400">Balance</div><div className="mt-1 text-2xl font-bold text-purple-700">₹{(totalIncome - totalExp).toLocaleString("en-IN")}</div></AdminCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <AdminCard>
          <h3 className="mb-4 font-semibold text-ink-900">Add entry</h3>
          <form action={createFinance} className="grid gap-4">
            <Select label="Type" name="kind" options={[{ value: "income", label: "Income" }, { value: "expenditure", label: "Expenditure" }]} />
            <Field label="Category" name="category" placeholder={config.unionFundLabel} list="finance-categories" hint="Choose an existing category or type a new one." />
            <datalist id="finance-categories">
              {config.categories.map((category) => <option key={category} value={category} />)}
            </datalist>
            <Field label="Label" name="label" required placeholder="Annual union fund collection" />
            <Field label="Amount (₹)" name="amount" type="number" required placeholder="480000" />
            <Field label="Date (optional)" name="date" type="date" hint="Leave blank to use today." />
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
                <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-[var(--shadow-soft)]">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-900 break-words">{e.label}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                      <span className="rounded-full bg-ink-100 px-2 py-0.5">{e.category}</span>
                      <span>{formatDate(e.date)}</span>
                    </div>

                    <AdminCard className="mt-6">
                      <h3 className="font-semibold text-ink-900">Public account settings</h3>
                      <p className="mt-1 text-sm text-ink-500">Change the wording shown in the navigation and on the public finance page.</p>
                      <form action={saveFinanceConfig} className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Field label="Public page title" name="title" defaultValue={config.title} required />
                        <Field label="Eyebrow" name="eyebrow" defaultValue={config.eyebrow} required />
                        <Field label="Income label" name="incomeLabel" defaultValue={config.incomeLabel} required />
                        <Field label="Expenditure label" name="expenditureLabel" defaultValue={config.expenditureLabel} required />
                        <Field label="Union fund label" name="unionFundLabel" defaultValue={config.unionFundLabel} required />
                        <Field label="Other income label" name="otherIncomeLabel" defaultValue={config.otherIncomeLabel} required />
                        <div className="sm:col-span-2">
                          <TextArea label="Public page description" name="description" defaultValue={config.description} rows={2} required />
                        </div>
                        <div className="sm:col-span-2">
                          <TextArea label="Income categories" name="categories" defaultValue={config.categories.join("\n")} rows={4} hint="One category per line. For example: Union Fund, Sponsorship, Coupon Sale." />
                        </div>
                        <div className="sm:col-span-2"><SubmitBtn>Save account settings</SubmitBtn></div>
                      </form>
                    </AdminCard>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t border-ink-100 pt-2 sm:border-t-0 sm:pt-0">
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
