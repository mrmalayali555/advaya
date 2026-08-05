"use client";

import React from "react";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";
import {
  RichTextData,
  ButtonData,
  NoticeBoardData,
  FileDownloadsData,
  FaqData,
  PeopleData,
  StatsData,
  LinksData,
  VideoData,
  QuoteData,
  DividerData,
  ScheduleData,
  CountdownData,
  ContactData,
  TimelineData,
  DutyRosterData,
  GalleryData,
  QuickActionsData,
  AnnouncementData,
} from "@/lib/page-builder-types";

// Shared classes
const inputClass = "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-indigo-500 focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-ink-600";
const addBtnClass = "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink-300 py-2 text-sm font-medium text-ink-500 hover:border-indigo-400 hover:text-indigo-600";
const delBtnClass = "text-ink-400 hover:text-red-600 p-1";
const cardClass = "rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-soft)]";

/* ─── RichTextEditor ─── */
export function RichTextEditor({ data, onChange }: { data: RichTextData; onChange: (data: RichTextData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Content (HTML allowed)</label>
        <textarea
          className={inputClass}
          rows={6}
          value={data.html}
          onChange={(e) => onChange({ ...data, html: e.target.value })}
          placeholder="<p>Write your content here...</p>"
        />
      </div>
    </div>
  );
}

/* ─── ButtonEditor ─── */
export function ButtonEditor({ data, onChange }: { data: ButtonData; onChange: (data: ButtonData) => void }) {
  const addButton = () => {
    onChange({
      ...data,
      buttons: [...data.buttons, { id: nanoid(6), label: "New Button", url: "", style: "primary", openInNewTab: false }],
    });
  };

  const updateButton = (id: string, updates: Partial<ButtonData["buttons"][0]>) => {
    onChange({
      ...data,
      buttons: data.buttons.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    });
  };

  const removeButton = (id: string) => {
    onChange({ ...data, buttons: data.buttons.filter((b) => b.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className={labelClass}>Alignment</label>
          <select
            className={inputClass}
            value={data.alignment}
            onChange={(e) => onChange({ ...data, alignment: e.target.value as "left" | "center" | "right" })}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {data.buttons.map((btn) => (
          <div key={btn.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4 sm:flex-row sm:items-start">
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Label</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={btn.label}
                    onChange={(e) => updateButton(btn.id, { label: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Style</label>
                  <select
                    className={inputClass}
                    value={btn.style}
                    onChange={(e) => updateButton(btn.id, { style: e.target.value as any })}
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>URL</label>
                <input
                  type="text"
                  className={inputClass}
                  value={btn.url}
                  onChange={(e) => updateButton(btn.id, { url: e.target.value })}
                  placeholder="Paste any URL here — copy PDF links from Media Library"
                />
                <p className="mt-1 text-xs text-ink-500">Paste any URL here — copy PDF links from Media Library</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`new-tab-${btn.id}`}
                  checked={btn.openInNewTab}
                  onChange={(e) => updateButton(btn.id, { openInNewTab: e.target.checked })}
                  className="rounded border-ink-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`new-tab-${btn.id}`} className="text-sm text-ink-700">Open in new tab</label>
              </div>
            </div>
            <button type="button" onClick={() => removeButton(btn.id)} className={delBtnClass}>
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addButton} className={addBtnClass}>
        <Plus className="h-4 w-4" /> Add Button
      </button>
    </div>
  );
}

/* ─── NoticeBoardEditor ─── */
export function NoticeBoardEditor({ data, onChange }: { data: NoticeBoardData; onChange: (data: NoticeBoardData) => void }) {
  const addNotice = () => {
    onChange({
      ...data,
      notices: [...data.notices, { id: nanoid(6), title: "", body: "", date: new Date().toISOString().split("T")[0], priority: "info" }],
    });
  };

  const updateNotice = (id: string, updates: Partial<NoticeBoardData["notices"][0]>) => {
    onChange({
      ...data,
      notices: data.notices.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    });
  };

  const removeNotice = (id: string) => {
    onChange({ ...data, notices: data.notices.filter((n) => n.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.notices.map((notice) => (
          <div key={notice.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4">
            <div className="absolute right-2 top-2">
              <button type="button" onClick={() => removeNotice(notice.id)} className={delBtnClass}>
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 pr-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Title</label>
                <input type="text" className={inputClass} value={notice.title} onChange={(e) => updateNotice(notice.id, { title: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Body</label>
                <textarea className={inputClass} rows={3} value={notice.body} onChange={(e) => updateNotice(notice.id, { body: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input type="date" className={inputClass} value={notice.date} onChange={(e) => updateNotice(notice.id, { date: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Priority</label>
                <select className={inputClass} value={notice.priority} onChange={(e) => updateNotice(notice.id, { priority: e.target.value as any })}>
                  <option value="urgent">Urgent</option>
                  <option value="new">New</option>
                  <option value="info">Info</option>
                  <option value="pinned">Pinned</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Expiry Date (Optional)</label>
                <input type="date" className={inputClass} value={notice.expiryDate || ""} onChange={(e) => updateNotice(notice.id, { expiryDate: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Attachment URL</label>
                <input type="text" className={inputClass} value={notice.attachmentUrl || ""} onChange={(e) => updateNotice(notice.id, { attachmentUrl: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Attachment Name</label>
                <input type="text" className={inputClass} value={notice.attachmentName || ""} onChange={(e) => updateNotice(notice.id, { attachmentName: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addNotice} className={addBtnClass}>
        <Plus className="h-4 w-4" /> Add Notice
      </button>
    </div>
  );
}

/* ─── FileDownloadsEditor ─── */
export function FileDownloadsEditor({ data, onChange }: { data: FileDownloadsData; onChange: (data: FileDownloadsData) => void }) {
  const addFile = () => {
    onChange({
      ...data,
      files: [...data.files, { id: nanoid(6), name: "", url: "", category: "Syllabus" }],
    });
  };

  const updateFile = (id: string, updates: Partial<FileDownloadsData["files"][0]>) => {
    onChange({
      ...data,
      files: data.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  const removeFile = (id: string) => {
    onChange({ ...data, files: data.files.filter((f) => f.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.files.map((file) => (
          <div key={file.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4">
            <div className="absolute right-2 top-2">
              <button type="button" onClick={() => removeFile(file.id)} className={delBtnClass}>
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 pr-8 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Name</label>
                <input type="text" className={inputClass} value={file.name} onChange={(e) => updateFile(file.id, { name: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select className={inputClass} value={file.category} onChange={(e) => updateFile(file.id, { category: e.target.value })}>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Timetable">Timetable</option>
                  <option value="Circular">Circular</option>
                  <option value="Form">Form</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>URL</label>
                <input type="text" className={inputClass} value={file.url} onChange={(e) => updateFile(file.id, { url: e.target.value })} placeholder="Paste from media library" />
                <p className="mt-1 text-xs text-ink-500">Paste URL from media library</p>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <input type="text" className={inputClass} value={file.description || ""} onChange={(e) => updateFile(file.id, { description: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addFile} className={addBtnClass}>
        <Plus className="h-4 w-4" /> Add File
      </button>
    </div>
  );
}

/* ─── FaqEditor ─── */
export function FaqEditor({ data, onChange }: { data: FaqData; onChange: (data: FaqData) => void }) {
  const addFaq = () => {
    onChange({
      ...data,
      items: [...data.items, { id: nanoid(6), question: "", answer: "" }],
    });
  };

  const updateFaq = (id: string, updates: Partial<FaqData["items"][0]>) => {
    onChange({
      ...data,
      items: data.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    });
  };

  const removeFaq = (id: string) => {
    onChange({ ...data, items: data.items.filter((i) => i.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4">
            <div className="absolute right-2 top-2">
              <button type="button" onClick={() => removeFaq(item.id)} className={delBtnClass}>
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="pr-8 space-y-4">
              <div>
                <label className={labelClass}>Question</label>
                <input type="text" className={inputClass} value={item.question} onChange={(e) => updateFaq(item.id, { question: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Answer</label>
                <textarea className={inputClass} rows={3} value={item.answer} onChange={(e) => updateFaq(item.id, { answer: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addFaq} className={addBtnClass}>
        <Plus className="h-4 w-4" /> Add FAQ Pair
      </button>
    </div>
  );
}

/* ─── PeopleEditor ─── */
export function PeopleEditor({ data, onChange }: { data: PeopleData; onChange: (data: PeopleData) => void }) {
  const addPerson = () => {
    onChange({
      ...data,
      people: [...data.people, { id: nanoid(6), name: "", role: "" }],
    });
  };

  const updatePerson = (id: string, updates: Partial<PeopleData["people"][0]>) => {
    onChange({
      ...data,
      people: data.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const removePerson = (id: string) => {
    onChange({ ...data, people: data.people.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Layout</label>
        <select className={inputClass} value={data.layout} onChange={(e) => onChange({ ...data, layout: e.target.value as "grid" | "list" })}>
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </div>
      <div className="space-y-4">
        {data.people.map((person) => (
          <div key={person.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4">
            <div className="absolute right-2 top-2">
              <button type="button" onClick={() => removePerson(person.id)} className={delBtnClass}>
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 pr-8 sm:grid-cols-2">
              <div><label className={labelClass}>Name</label><input type="text" className={inputClass} value={person.name} onChange={(e) => updatePerson(person.id, { name: e.target.value })} /></div>
              <div><label className={labelClass}>Role</label><input type="text" className={inputClass} value={person.role} onChange={(e) => updatePerson(person.id, { role: e.target.value })} /></div>
              <div><label className={labelClass}>Group</label><input type="text" className={inputClass} value={person.group || ""} onChange={(e) => updatePerson(person.id, { group: e.target.value })} /></div>
              <div><label className={labelClass}>Phone</label><input type="text" className={inputClass} value={person.phone || ""} onChange={(e) => updatePerson(person.id, { phone: e.target.value })} /></div>
              <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={person.email || ""} onChange={(e) => updatePerson(person.id, { email: e.target.value })} /></div>
              <div><label className={labelClass}>Photo URL</label><input type="text" className={inputClass} value={person.photoUrl || ""} onChange={(e) => updatePerson(person.id, { photoUrl: e.target.value })} /></div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addPerson} className={addBtnClass}>
        <Plus className="h-4 w-4" /> Add Person
      </button>
    </div>
  );
}

/* ─── StatsEditor ─── */
export function StatsEditor({ data, onChange }: { data: StatsData; onChange: (data: StatsData) => void }) {
  const addStat = () => {
    onChange({ ...data, items: [...data.items, { id: nanoid(6), label: "", value: "" }] });
  };
  const updateStat = (id: string, updates: Partial<StatsData["items"][0]>) => {
    onChange({ ...data, items: data.items.map((i) => (i.id === id ? { ...i, ...updates } : i)) });
  };
  const removeStat = (id: string) => {
    onChange({ ...data, items: data.items.filter((i) => i.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4 sm:flex-row sm:items-start">
            <div className="grid flex-1 gap-4 sm:grid-cols-3">
              <div><label className={labelClass}>Label</label><input type="text" className={inputClass} value={item.label} onChange={(e) => updateStat(item.id, { label: e.target.value })} /></div>
              <div><label className={labelClass}>Value</label><input type="text" className={inputClass} value={item.value} onChange={(e) => updateStat(item.id, { value: e.target.value })} /></div>
              <div><label className={labelClass}>Icon</label><input type="text" className={inputClass} value={item.icon || ""} onChange={(e) => updateStat(item.id, { icon: e.target.value })} /></div>
            </div>
            <button type="button" onClick={() => removeStat(item.id)} className={delBtnClass}><Trash2 className="h-5 w-5" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addStat} className={addBtnClass}><Plus className="h-4 w-4" /> Add Stat</button>
    </div>
  );
}

/* ─── LinksEditor ─── */
export function LinksEditor({ data, onChange }: { data: LinksData; onChange: (data: LinksData) => void }) {
  const addLink = () => onChange({ ...data, links: [...data.links, { id: nanoid(6), title: "", url: "" }] });
  const updateLink = (id: string, updates: Partial<LinksData["links"][0]>) => onChange({ ...data, links: data.links.map((l) => (l.id === id ? { ...l, ...updates } : l)) });
  const removeLink = (id: string) => onChange({ ...data, links: data.links.filter((l) => l.id !== id) });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.links.map((link) => (
          <div key={link.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4">
             <div className="absolute right-2 top-2">
              <button type="button" onClick={() => removeLink(link.id)} className={delBtnClass}><Trash2 className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 pr-8 sm:grid-cols-2">
              <div><label className={labelClass}>Title</label><input type="text" className={inputClass} value={link.title} onChange={(e) => updateLink(link.id, { title: e.target.value })} /></div>
              <div><label className={labelClass}>URL</label><input type="text" className={inputClass} value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })} /></div>
              <div><label className={labelClass}>Description</label><input type="text" className={inputClass} value={link.description || ""} onChange={(e) => updateLink(link.id, { description: e.target.value })} /></div>
              <div><label className={labelClass}>Icon</label><input type="text" className={inputClass} value={link.icon || ""} onChange={(e) => updateLink(link.id, { icon: e.target.value })} /></div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addLink} className={addBtnClass}><Plus className="h-4 w-4" /> Add Link</button>
    </div>
  );
}

/* ─── VideoEditor ─── */
export function VideoEditor({ data, onChange }: { data: VideoData; onChange: (data: VideoData) => void }) {
  return (
    <div className="space-y-4">
      <div><label className={labelClass}>Video URL (YouTube/Vimeo)</label><input type="text" className={inputClass} value={data.url} onChange={(e) => onChange({ ...data, url: e.target.value })} /></div>
      <div><label className={labelClass}>Title</label><input type="text" className={inputClass} value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })} /></div>
      <div><label className={labelClass}>Description</label><textarea className={inputClass} rows={3} value={data.description || ""} onChange={(e) => onChange({ ...data, description: e.target.value })} /></div>
    </div>
  );
}

/* ─── QuoteEditor ─── */
export function QuoteEditor({ data, onChange }: { data: QuoteData; onChange: (data: QuoteData) => void }) {
  return (
    <div className="space-y-4">
      <div><label className={labelClass}>Quote Text</label><textarea className={inputClass} rows={4} value={data.text} onChange={(e) => onChange({ ...data, text: e.target.value })} /></div>
      <div><label className={labelClass}>Author</label><input type="text" className={inputClass} value={data.author} onChange={(e) => onChange({ ...data, author: e.target.value })} /></div>
      <div><label className={labelClass}>Role</label><input type="text" className={inputClass} value={data.role || ""} onChange={(e) => onChange({ ...data, role: e.target.value })} /></div>
    </div>
  );
}

/* ─── DividerEditor ─── */
export function DividerEditor({ data, onChange }: { data: DividerData; onChange: (data: DividerData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Style</label>
        <select className={inputClass} value={data.style} onChange={(e) => onChange({ ...data, style: e.target.value as any })}>
          <option value="line">Line</option>
          <option value="dotted">Dotted</option>
          <option value="space">Space</option>
          <option value="gradient">Gradient</option>
        </select>
      </div>
    </div>
  );
}

/* ─── ScheduleEditor ─── */
export function ScheduleEditor({ data, onChange }: { data: ScheduleData; onChange: (data: ScheduleData) => void }) {
  const addDay = () => onChange({ ...data, days: [...data.days, { day: "", slots: [] }] });
  const updateDayName = (idx: number, dayName: string) => {
    const newDays = [...data.days];
    newDays[idx].day = dayName;
    onChange({ ...data, days: newDays });
  };
  const removeDay = (idx: number) => {
    const newDays = [...data.days];
    newDays.splice(idx, 1);
    onChange({ ...data, days: newDays });
  };
  const addSlot = (dayIdx: number) => {
    const newDays = [...data.days];
    newDays[dayIdx].slots.push({ time: "", content: "" });
    onChange({ ...data, days: newDays });
  };
  const updateSlot = (dayIdx: number, slotIdx: number, updates: Partial<ScheduleData["days"][0]["slots"][0]>) => {
    const newDays = [...data.days];
    newDays[dayIdx].slots[slotIdx] = { ...newDays[dayIdx].slots[slotIdx], ...updates };
    onChange({ ...data, days: newDays });
  };
  const removeSlot = (dayIdx: number, slotIdx: number) => {
    const newDays = [...data.days];
    newDays[dayIdx].slots.splice(slotIdx, 1);
    onChange({ ...data, days: newDays });
  };

  return (
    <div className="space-y-6">
      <div><label className={labelClass}>Caption</label><input type="text" className={inputClass} value={data.caption || ""} onChange={(e) => onChange({ ...data, caption: e.target.value })} /></div>
      <div className="space-y-4">
        {data.days.map((day, dIdx) => (
          <div key={dIdx} className="rounded-lg border border-ink-100 bg-ink-50 p-4 space-y-4">
            <div className="flex items-center gap-4">
              <input type="text" className={inputClass} placeholder="Day Name" value={day.day} onChange={(e) => updateDayName(dIdx, e.target.value)} />
              <button type="button" onClick={() => removeDay(dIdx)} className={delBtnClass}><Trash2 className="h-5 w-5" /></button>
            </div>
            <div className="pl-4 space-y-2">
              {day.slots.map((slot, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2">
                  <input type="text" className={inputClass} placeholder="Time" value={slot.time} onChange={(e) => updateSlot(dIdx, sIdx, { time: e.target.value })} />
                  <input type="text" className={inputClass} placeholder="Content" value={slot.content} onChange={(e) => updateSlot(dIdx, sIdx, { content: e.target.value })} />
                  <button type="button" onClick={() => removeSlot(dIdx, sIdx)} className={delBtnClass}><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addSlot(dIdx)} className="text-xs text-indigo-600 font-medium hover:underline">+ Add Slot</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addDay} className={addBtnClass}><Plus className="h-4 w-4" /> Add Day</button>
    </div>
  );
}

/* ─── CountdownEditor ─── */
export function CountdownEditor({ data, onChange }: { data: CountdownData; onChange: (data: CountdownData) => void }) {
  // datetime-local input needs YYYY-MM-DDThh:mm format
  const dateValue = data.targetDate ? new Date(data.targetDate).toISOString().slice(0, 16) : "";
  return (
    <div className="space-y-4">
      <div><label className={labelClass}>Target Date & Time</label><input type="datetime-local" className={inputClass} value={dateValue} onChange={(e) => onChange({ ...data, targetDate: new Date(e.target.value).toISOString() })} /></div>
      <div><label className={labelClass}>Label</label><input type="text" className={inputClass} value={data.label} onChange={(e) => onChange({ ...data, label: e.target.value })} /></div>
      <div><label className={labelClass}>Description</label><input type="text" className={inputClass} value={data.description || ""} onChange={(e) => onChange({ ...data, description: e.target.value })} /></div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="hideAfterExpiry" checked={data.hideAfterExpiry} onChange={(e) => onChange({ ...data, hideAfterExpiry: e.target.checked })} className="rounded border-ink-300 text-indigo-600 focus:ring-indigo-500" />
        <label htmlFor="hideAfterExpiry" className="text-sm text-ink-700">Hide after expiry</label>
      </div>
    </div>
  );
}

/* ─── ContactEditor ─── */
export function ContactEditor({ data, onChange }: { data: ContactData; onChange: (data: ContactData) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className={labelClass}>Phone</label><input type="text" className={inputClass} value={data.phone || ""} onChange={(e) => onChange({ ...data, phone: e.target.value })} /></div>
      <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={data.email || ""} onChange={(e) => onChange({ ...data, email: e.target.value })} /></div>
      <div><label className={labelClass}>Location</label><input type="text" className={inputClass} value={data.location || ""} onChange={(e) => onChange({ ...data, location: e.target.value })} /></div>
      <div><label className={labelClass}>Hours</label><input type="text" className={inputClass} value={data.hours || ""} onChange={(e) => onChange({ ...data, hours: e.target.value })} /></div>
      <div><label className={labelClass}>WhatsApp</label><input type="text" className={inputClass} value={data.whatsapp || ""} onChange={(e) => onChange({ ...data, whatsapp: e.target.value })} /></div>
    </div>
  );
}

/* ─── TimelineEditor ─── */
export function TimelineEditor({ data, onChange }: { data: TimelineData; onChange: (data: TimelineData) => void }) {
  const addItem = () => onChange({ ...data, items: [...data.items, { id: nanoid(6), date: "", title: "" }] });
  const updateItem = (id: string, updates: Partial<TimelineData["items"][0]>) => onChange({ ...data, items: data.items.map((i) => (i.id === id ? { ...i, ...updates } : i)) });
  const removeItem = (id: string) => onChange({ ...data, items: data.items.filter((i) => i.id !== id) });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4">
            <div className="absolute right-2 top-2">
              <button type="button" onClick={() => removeItem(item.id)} className={delBtnClass}><Trash2 className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 pr-8 sm:grid-cols-2">
              <div><label className={labelClass}>Date</label><input type="text" className={inputClass} value={item.date} onChange={(e) => updateItem(item.id, { date: e.target.value })} /></div>
              <div><label className={labelClass}>Title</label><input type="text" className={inputClass} value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Description</label><textarea className={inputClass} rows={2} value={item.description || ""} onChange={(e) => updateItem(item.id, { description: e.target.value })} /></div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className={addBtnClass}><Plus className="h-4 w-4" /> Add Timeline Item</button>
    </div>
  );
}

/* ─── DutyRosterEditor ─── */
export function DutyRosterEditor({ data, onChange }: { data: DutyRosterData; onChange: (data: DutyRosterData) => void }) {
  const addDay = () => onChange({ ...data, days: [...data.days, { day: "", shifts: [] }] });
  const updateDayName = (idx: number, dayName: string) => {
    const newDays = [...data.days];
    newDays[idx].day = dayName;
    onChange({ ...data, days: newDays });
  };
  const removeDay = (idx: number) => {
    const newDays = [...data.days];
    newDays.splice(idx, 1);
    onChange({ ...data, days: newDays });
  };
  const addShift = (dayIdx: number) => {
    const newDays = [...data.days];
    newDays[dayIdx].shifts.push({ time: "", names: "" });
    onChange({ ...data, days: newDays });
  };
  const updateShift = (dayIdx: number, shiftIdx: number, updates: Partial<DutyRosterData["days"][0]["shifts"][0]>) => {
    const newDays = [...data.days];
    newDays[dayIdx].shifts[shiftIdx] = { ...newDays[dayIdx].shifts[shiftIdx], ...updates };
    onChange({ ...data, days: newDays });
  };
  const removeShift = (dayIdx: number, shiftIdx: number) => {
    const newDays = [...data.days];
    newDays[dayIdx].shifts.splice(shiftIdx, 1);
    onChange({ ...data, days: newDays });
  };
  const addContact = () => onChange({ ...data, contacts: [...data.contacts, { name: "", phone: "" }] });
  const updateContact = (idx: number, updates: Partial<{ name: string; phone: string }>) => {
    const newContacts = [...data.contacts];
    newContacts[idx] = { ...newContacts[idx], ...updates };
    onChange({ ...data, contacts: newContacts });
  };
  const removeContact = (idx: number) => {
    const newContacts = [...data.contacts];
    newContacts.splice(idx, 1);
    onChange({ ...data, contacts: newContacts });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-ink-900 text-sm">Days & Shifts</h3>
        {data.days.map((day, dIdx) => (
          <div key={dIdx} className="rounded-lg border border-ink-100 bg-ink-50 p-4 space-y-4">
            <div className="flex items-center gap-4">
              <input type="text" className={inputClass} placeholder="Day Name" value={day.day} onChange={(e) => updateDayName(dIdx, e.target.value)} />
              <button type="button" onClick={() => removeDay(dIdx)} className={delBtnClass}><Trash2 className="h-5 w-5" /></button>
            </div>
            <div className="pl-4 space-y-2">
              {day.shifts.map((shift, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2">
                  <input type="text" className={inputClass} placeholder="Time" value={shift.time} onChange={(e) => updateShift(dIdx, sIdx, { time: e.target.value })} />
                  <input type="text" className={inputClass} placeholder="Names" value={shift.names} onChange={(e) => updateShift(dIdx, sIdx, { names: e.target.value })} />
                  <button type="button" onClick={() => removeShift(dIdx, sIdx)} className={delBtnClass}><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addShift(dIdx)} className="text-xs text-indigo-600 font-medium hover:underline">+ Add Shift</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addDay} className={addBtnClass}><Plus className="h-4 w-4" /> Add Day</button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-ink-900 text-sm">Contacts</h3>
        {data.contacts.map((contact, cIdx) => (
          <div key={cIdx} className="flex items-center gap-4">
            <input type="text" className={inputClass} placeholder="Name" value={contact.name} onChange={(e) => updateContact(cIdx, { name: e.target.value })} />
            <input type="text" className={inputClass} placeholder="Phone" value={contact.phone} onChange={(e) => updateContact(cIdx, { phone: e.target.value })} />
            <button type="button" onClick={() => removeContact(cIdx)} className={delBtnClass}><Trash2 className="h-5 w-5" /></button>
          </div>
        ))}
        <button type="button" onClick={addContact} className={addBtnClass}><Plus className="h-4 w-4" /> Add Contact</button>
      </div>
    </div>
  );
}

/* ─── GalleryEditor ─── */
export function GalleryEditor({ data, onChange }: { data: GalleryData; onChange: (data: GalleryData) => void }) {
  const addImage = () => onChange({ ...data, images: [...data.images, { id: nanoid(6), url: "" }] });
  const updateImage = (id: string, updates: Partial<GalleryData["images"][0]>) => onChange({ ...data, images: data.images.map((i) => (i.id === id ? { ...i, ...updates } : i)) });
  const removeImage = (id: string) => onChange({ ...data, images: data.images.filter((i) => i.id !== id) });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Layout</label>
          <select className={inputClass} value={data.layout} onChange={(e) => onChange({ ...data, layout: e.target.value as any })}>
            <option value="grid">Grid</option>
            <option value="masonry">Masonry</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Columns</label>
          <input type="number" min="1" max="6" className={inputClass} value={data.columns} onChange={(e) => onChange({ ...data, columns: parseInt(e.target.value) || 3 })} />
        </div>
      </div>
      <div className="space-y-4">
        {data.images.map((img) => (
          <div key={img.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4 sm:flex-row sm:items-start">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div><label className={labelClass}>Image URL</label><input type="text" className={inputClass} value={img.url} onChange={(e) => updateImage(img.id, { url: e.target.value })} /></div>
              <div><label className={labelClass}>Caption</label><input type="text" className={inputClass} value={img.caption || ""} onChange={(e) => updateImage(img.id, { caption: e.target.value })} /></div>
            </div>
            <button type="button" onClick={() => removeImage(img.id)} className={delBtnClass}><Trash2 className="h-5 w-5" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addImage} className={addBtnClass}><Plus className="h-4 w-4" /> Add Image</button>
    </div>
  );
}

/* ─── QuickActionsEditor ─── */
export function QuickActionsEditor({ data, onChange }: { data: QuickActionsData; onChange: (data: QuickActionsData) => void }) {
  const addAction = () => onChange({ ...data, actions: [...data.actions, { id: nanoid(6), label: "", url: "", icon: "" }] });
  const updateAction = (id: string, updates: Partial<QuickActionsData["actions"][0]>) => onChange({ ...data, actions: data.actions.map((a) => (a.id === id ? { ...a, ...updates } : a)) });
  const removeAction = (id: string) => onChange({ ...data, actions: data.actions.filter((a) => a.id !== id) });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.actions.map((action) => (
          <div key={action.id} className="relative flex flex-col gap-4 rounded-lg border border-ink-100 bg-ink-50 p-4">
             <div className="absolute right-2 top-2">
              <button type="button" onClick={() => removeAction(action.id)} className={delBtnClass}><Trash2 className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 pr-8 sm:grid-cols-2">
              <div><label className={labelClass}>Label</label><input type="text" className={inputClass} value={action.label} onChange={(e) => updateAction(action.id, { label: e.target.value })} /></div>
              <div><label className={labelClass}>URL</label><input type="text" className={inputClass} value={action.url} onChange={(e) => updateAction(action.id, { url: e.target.value })} /></div>
              <div><label className={labelClass}>Icon</label><input type="text" className={inputClass} value={action.icon} onChange={(e) => updateAction(action.id, { icon: e.target.value })} /></div>
              <div><label className={labelClass}>Color (optional)</label><input type="text" className={inputClass} value={action.color || ""} onChange={(e) => updateAction(action.id, { color: e.target.value })} /></div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addAction} className={addBtnClass}><Plus className="h-4 w-4" /> Add Action</button>
    </div>
  );
}

/* ─── AnnouncementEditor ─── */
export function AnnouncementEditor({ data, onChange }: { data: AnnouncementData; onChange: (data: AnnouncementData) => void }) {
  return (
    <div className="space-y-4">
      <div><label className={labelClass}>Text</label><textarea className={inputClass} rows={2} value={data.text} onChange={(e) => onChange({ ...data, text: e.target.value })} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Type</label>
          <select className={inputClass} value={data.type} onChange={(e) => onChange({ ...data, type: e.target.value as any })}>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input type="checkbox" id="dismissible" checked={data.dismissible} onChange={(e) => onChange({ ...data, dismissible: e.target.checked })} className="rounded border-ink-300 text-indigo-600 focus:ring-indigo-500" />
          <label htmlFor="dismissible" className="text-sm text-ink-700">Dismissible</label>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelClass}>Link URL</label><input type="text" className={inputClass} value={data.linkUrl || ""} onChange={(e) => onChange({ ...data, linkUrl: e.target.value })} /></div>
        <div><label className={labelClass}>Link Text</label><input type="text" className={inputClass} value={data.linkText || ""} onChange={(e) => onChange({ ...data, linkText: e.target.value })} /></div>
      </div>
    </div>
  );
}
