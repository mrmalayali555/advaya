export type ContentLayoutSettings = {
  events: 1 | 2 | 3;
  achievements: 1 | 2 | 3;
  interventions: 1 | 2 | 3;
};

export const DEFAULT_CONTENT_LAYOUT: ContentLayoutSettings = {
  events: 1,
  achievements: 1,
  interventions: 1,
};

function columnCount(value: unknown): 1 | 2 | 3 {
  return value === 2 || value === 3 ? value : 1;
}

export function parseContentLayout(value?: string | null): ContentLayoutSettings {
  if (!value) return DEFAULT_CONTENT_LAYOUT;
  try {
    const parsed = JSON.parse(value) as Partial<ContentLayoutSettings>;
    return {
      events: columnCount(parsed.events),
      achievements: columnCount(parsed.achievements),
      interventions: columnCount(parsed.interventions),
    };
  } catch {
    return DEFAULT_CONTENT_LAYOUT;
  }
}

export function responsiveGridClass(columns: 1 | 2 | 3): string {
  if (columns === 3) return "grid-cols-3 sm:grid-cols-2 lg:grid-cols-3";
  if (columns === 2) return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}
