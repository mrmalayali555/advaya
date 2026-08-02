"use client";

import { useState } from "react";
import { Shield, Clock, Phone, Plus, Trash2, Save, RotateCcw, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { updateWatchmenSchedule } from "@/lib/actions/emergency";
import { WatchmenScheduleData, DEFAULT_WATCHMEN_SCHEDULE, WatchmenDaySchedule, WatchmanContact } from "@/lib/watchmen-schedule";

export function WatchmenRosterEditor({ initialSchedule }: { initialSchedule: WatchmenScheduleData | null }) {
  const [data, setData] = useState<WatchmenScheduleData>(
    initialSchedule && initialSchedule.schedule && initialSchedule.schedule.length === 7
      ? initialSchedule
      : DEFAULT_WATCHMEN_SCHEDULE
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleShiftChange = (dayIndex: number, shiftIndex: number, field: "time" | "names", value: string) => {
    const next = { ...data, schedule: [...data.schedule] };
    const day = { ...next.schedule[dayIndex], shifts: [...next.schedule[dayIndex].shifts] };
    day.shifts[shiftIndex] = { ...day.shifts[shiftIndex], [field]: value };
    next.schedule[dayIndex] = day;
    setData(next);
  };

  const handleContactChange = (index: number, field: "name" | "phone", value: string) => {
    const next = { ...data, contacts: [...data.contacts] };
    next.contacts[index] = { ...next.contacts[index], [field]: value };
    setData(next);
  };

  const handleAddContact = () => {
    setData({
      ...data,
      contacts: [...data.contacts, { name: "", phone: "" }],
    });
  };

  const handleRemoveContact = (index: number) => {
    const nextContacts = data.contacts.filter((_, i) => i !== index);
    setData({ ...data, contacts: nextContacts });
  };

  const handleResetToDefault = () => {
    if (confirm("Reset watchmen roster to the official PDF default schedule?")) {
      setData(DEFAULT_WATCHMEN_SCHEDULE);
      setMessage({ type: "success", text: "Reset to default PDF schedule. Click 'Save Roster Changes' to publish." });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await updateWatchmenSchedule(data);
      setMessage({ type: "success", text: "Campus watchmen duty roster updated successfully!" });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to update watchmen schedule." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-soft)] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-ink-900 text-sm">Campus Watchmen Weekly Duty Roster</h3>
            <p className="text-xs text-ink-500">
              Manage the 3 daily shifts (6AM-2PM, 2PM-10PM, 10PM-6AM) & watchmen phone numbers
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100 transition-colors"
        >
          {isOpen ? (
            <>
              <span>Hide Roster Editor</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Edit Weekly Roster</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {isOpen && (
        <div className="space-y-6 pt-3 border-t border-ink-100">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-ink-50/70 p-3 rounded-xl border border-ink-200/60">
            <span className="text-xs font-medium text-ink-600">
              All changes apply instantly to the public Emergency page when saved.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-100 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to PDF Default</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : "Save Roster Changes"}</span>
              </button>
            </div>
          </div>

          {/* 7-Day Schedule Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500">
              Weekly Shift Schedule (7 Days)
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {data.schedule.map((dayItem, dIdx) => (
                <div
                  key={dayItem.day}
                  className="rounded-xl border border-ink-200 bg-ink-50/30 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                      {dayItem.day}
                    </span>
                    <span className="text-[11px] text-ink-400 font-medium">3 Shifts</span>
                  </div>
                  <div className="space-y-2">
                    {dayItem.shifts.map((shift, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-[110px_1fr] gap-2 items-center">
                        <input
                          type="text"
                          value={shift.time}
                          onChange={(e) => handleShiftChange(dIdx, sIdx, "time", e.target.value)}
                          className="rounded-lg border border-ink-200 bg-white px-2 py-1 text-xs font-medium text-ink-700 focus:border-indigo-500 focus:outline-none"
                          placeholder="6 AM to 2 PM"
                        />
                        <input
                          type="text"
                          value={shift.names}
                          onChange={(e) => handleShiftChange(dIdx, sIdx, "names", e.target.value)}
                          className="rounded-lg border border-ink-200 bg-white px-2.5 py-1 text-xs text-ink-900 focus:border-indigo-500 focus:outline-none"
                          placeholder="e.g. Mr. KRISHNA KUMAR, Mr. HARIKRISHNAN"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Numbers Directory */}
          <div className="space-y-3 pt-4 border-t border-ink-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500">
                  Watchmen Contact Numbers
                </h4>
                <p className="text-xs text-ink-500">
                  Phone numbers linked to names for quick tap-to-call on the emergency directory
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddContact}
                className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Contact</span>
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {data.contacts.map((contact, cIdx) => (
                <div
                  key={cIdx}
                  className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-2 shadow-sm"
                >
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleContactChange(cIdx, "name", e.target.value)}
                    placeholder="Watchman Name"
                    className="w-full rounded-lg border border-ink-200 px-2 py-1 text-xs font-medium text-ink-900 focus:border-indigo-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(cIdx, "phone", e.target.value)}
                    placeholder="Phone No."
                    className="w-32 rounded-lg border border-ink-200 px-2 py-1 text-xs font-mono text-ink-700 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(cIdx)}
                    className="p-1 text-ink-400 hover:text-red-600 transition-colors rounded"
                    title="Remove contact"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving..." : "Save Roster Changes"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
