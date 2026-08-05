"use client";

import React, { useState } from "react";
import { 
  PageContent, 
  PageSection, 
  SectionType, 
  createEmptySection, 
  SECTION_META 
} from "@/lib/page-builder-types";
import { savePageSections } from "@/lib/actions/content";
import { SectionPicker } from "./section-picker";
import * as Editors from "./section-editors";
import { 
  Plus, Save, ChevronDown, ChevronUp, GripVertical, 
  Eye, EyeOff, Copy, Trash2, Settings 
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { nanoid } from "nanoid";

interface PageBuilderProps {
  pageKey: string;
  initialTitle: string;
  initialContent: PageContent;
}

const inputClass = "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-indigo-500 focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-ink-600";

export function PageBuilder({ pageKey, initialTitle, initialContent }: PageBuilderProps) {
  const [title, setTitle] = useState(initialTitle);
  const [settings, setSettings] = useState(initialContent.settings || {});
  const [sections, setSections] = useState<PageSection[]>(initialContent.sections || []);
  
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [expandedSettings, setExpandedSettings] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const contentToSave: PageContent = {
        settings,
        sections,
      };
      // Assume action signature is (pageKey, title, content)
      await savePageSections(pageKey, title, contentToSave);
      showToast("Changes saved successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type: SectionType) => {
    const newSection = createEmptySection(type, sections.length);
    setSections([...sections, newSection]);
    setExpandedSections({ ...expandedSections, [newSection.id]: true });
    setIsPickerOpen(false);
  };

  const updateSection = (id: string, updates: Partial<PageSection>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const updateSectionData = (id: string, data: any) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, data } : s)));
  };

  const removeSection = (id: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setSections(sections.filter((s) => s.id !== id));
    }
  };

  const duplicateSection = (id: string) => {
    const sectionToDuplicate = sections.find((s) => s.id === id);
    if (sectionToDuplicate) {
      const newSection = {
        ...JSON.parse(JSON.stringify(sectionToDuplicate)),
        id: nanoid(8),
      };
      const index = sections.findIndex((s) => s.id === id);
      const newSections = [...sections];
      newSections.splice(index + 1, 0, newSection);
      // Reassign order
      newSections.forEach((s, i) => (s.order = i));
      setSections(newSections);
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === sections.length - 1)) return;
    
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    
    // Reassign order
    newSections.forEach((s, i) => (s.order = i));
    setSections(newSections);
  };

  const toggleSectionExpanded = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderEditor = (section: PageSection) => {
    switch (section.type) {
      case "rich-text": return <Editors.RichTextEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "button": return <Editors.ButtonEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "notice-board": return <Editors.NoticeBoardEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "file-downloads": return <Editors.FileDownloadsEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "faq": return <Editors.FaqEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "people": return <Editors.PeopleEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "stats": return <Editors.StatsEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "links": return <Editors.LinksEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "video": return <Editors.VideoEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "quote": return <Editors.QuoteEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "divider": return <Editors.DividerEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "schedule": return <Editors.ScheduleEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "countdown": return <Editors.CountdownEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "contact": return <Editors.ContactEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "timeline": return <Editors.TimelineEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "duty-roster": return <Editors.DutyRosterEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "gallery": return <Editors.GalleryEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "quick-actions": return <Editors.QuickActionsEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      case "announcement": return <Editors.AnnouncementEditor data={section.data as any} onChange={(data) => updateSectionData(section.id, data)} />;
      default: return <div className="text-sm text-ink-500">Editor for {section.type} not found.</div>;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-24">
      {/* Header / Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Page Builder</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Page Title & Settings */}
      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-soft)] space-y-4">
        <div>
          <label className={labelClass}>Page Title</label>
          <input
            type="text"
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setExpandedSettings(!expandedSettings)}
            className="flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            <Settings className="h-4 w-4" />
            Page Settings
            {expandedSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {expandedSettings && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 rounded-lg border border-ink-100 bg-ink-50 p-4">
              <div><label className={labelClass}>Eyebrow</label><input type="text" className={inputClass} value={settings.eyebrow || ""} onChange={(e) => setSettings({ ...settings, eyebrow: e.target.value })} /></div>
              <div><label className={labelClass}>Icon (Lucide)</label><input type="text" className={inputClass} value={settings.icon || ""} onChange={(e) => setSettings({ ...settings, icon: e.target.value })} /></div>
              <div><label className={labelClass}>Theme Color</label><input type="text" className={inputClass} value={settings.themeColor || ""} onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })} /></div>
              <div><label className={labelClass}>Meta Description</label><textarea className={inputClass} rows={2} value={settings.metaDescription || ""} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} /></div>
            </div>
          )}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const meta = SECTION_META.find((m) => m.type === section.type);
          const isExpanded = expandedSections[section.id];
          const Icon = meta ? ((LucideIcons as any)[meta.icon] || LucideIcons.Layout) : LucideIcons.Layout;

          return (
            <div key={section.id} className="rounded-2xl border border-ink-100 bg-white shadow-[var(--shadow-soft)] transition-all hover:border-indigo-200">
              {/* Section Header */}
              <div className="flex items-center gap-4 border-b border-ink-100 p-4">
                <div className="flex cursor-move flex-col items-center gap-1 text-ink-300">
                  <button onClick={() => moveSection(index, "up")} disabled={index === 0} className="hover:text-ink-900 disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => moveSection(index, "down")} disabled={index === sections.length - 1} className="hover:text-ink-900 disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
                </div>
                
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink-900 truncate">{meta?.label || section.type}</h3>
                    {!section.visible && <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-600 uppercase">Hidden</span>}
                  </div>
                  <input
                    type="text"
                    placeholder="Optional internal label..."
                    className="mt-1 w-full bg-transparent text-xs text-ink-500 focus:outline-none"
                    value={section.title || ""}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  />
                </div>
                
                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                  <button onClick={() => updateSection(section.id, { visible: !section.visible })} className="p-2 text-ink-400 hover:text-ink-900" title={section.visible ? "Hide on page" : "Show on page"}>
                    {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => duplicateSection(section.id)} className="hidden p-2 text-ink-400 hover:text-indigo-600 sm:block" title="Duplicate">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeSection(section.id)} className="p-2 text-ink-400 hover:text-red-600" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="h-6 w-px bg-ink-200 mx-1"></div>
                  <button onClick={() => toggleSectionExpanded(section.id)} className="p-2 text-ink-500 hover:text-ink-900">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Section Editor */}
              {isExpanded && (
                <div className="p-5 bg-ink-50/50">
                  <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className={labelClass}>Background</label>
                      <select className={inputClass} value={section.background || "transparent"} onChange={(e) => updateSection(section.id, { background: e.target.value as any })}>
                        <option value="transparent">Transparent</option>
                        <option value="glass">Glass</option>
                        <option value="subtle">Subtle</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Width</label>
                      <select className={inputClass} value={section.width || "normal"} onChange={(e) => updateSection(section.id, { width: e.target.value as any })}>
                        <option value="narrow">Narrow</option>
                        <option value="normal">Normal</option>
                        <option value="wide">Wide</option>
                      </select>
                    </div>
                  </div>
                  <div className="border-t border-ink-100 pt-6">
                    {renderEditor(section)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Section Button */}
      <button
        onClick={() => setIsPickerOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-white p-6 text-sm font-medium text-ink-500 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600"
      >
        <Plus className="h-5 w-5" />
        Add New Section
      </button>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Section Picker Modal */}
      <SectionPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={addSection}
      />
    </div>
  );
}
