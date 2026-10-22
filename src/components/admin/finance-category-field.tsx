"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-800 outline-none transition-colors focus:border-purple-400 focus:ring-2 focus:ring-purple-100";
const CUSTOM_VALUE = "__custom__";

export function FinanceCategoryField({
  categories,
  defaultValue,
}: {
  categories: string[];
  defaultValue?: string;
}) {
  const isKnownCategory = Boolean(defaultValue && categories.includes(defaultValue));
  const [selection, setSelection] = useState(isKnownCategory ? defaultValue! : defaultValue ? CUSTOM_VALUE : categories[0] || "");
  const [customCategory, setCustomCategory] = useState(isKnownCategory ? "" : defaultValue || "");
  const isCustom = selection === CUSTOM_VALUE;
  const value = isCustom ? customCategory : selection;

  return (
    <div>
      <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink-700">
        Category <span className="text-red-500">*</span>
      </label>
      <select
        id="category"
        value={selection}
        onChange={(event) => setSelection(event.target.value)}
        className={inputClass}
        aria-describedby="category-hint"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        <option value={CUSTOM_VALUE}>＋ Add new category</option>
      </select>
      {isCustom && (
        <input
          name="category"
          value={customCategory}
          onChange={(event) => setCustomCategory(event.target.value)}
          placeholder="e.g. Fundraising"
          required
          className={`${inputClass} mt-2`}
          autoFocus
        />
      )}
      {!isCustom && <input type="hidden" name="category" value={value} />}
      <p id="category-hint" className="mt-1 text-xs text-ink-400">
        Select an existing category or add a new one.
      </p>
    </div>
  );
}
