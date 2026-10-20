export const MAINTENANCE_ANIMATIONS = [
  { value: "orbital", label: "Orbital" },
  { value: "pulse", label: "Pulse" },
  { value: "shimmer", label: "Shimmer" },
  { value: "drift", label: "Drift" },
  { value: "radar", label: "Radar" },
  { value: "breathe", label: "Breathe" },
  { value: "scan", label: "Scan" },
] as const;

export type MaintenanceAnimation = (typeof MAINTENANCE_ANIMATIONS)[number]["value"];

export type MaintenanceSettings = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  message: string;
  status: string;
  footer: string;
  animation: MaintenanceAnimation;
};

export const DEFAULT_MAINTENANCE_SETTINGS: MaintenanceSettings = {
  enabled: false,
  eyebrow: "We're improving your experience",
  title: "We're Building Something Better",
  message:
    "The ADVAYA College Union website is temporarily under maintenance while we make it clearer, faster, and more useful. We'll return soon.",
  status: "Scheduled Maintenance",
  footer: "ADVAYA College Union",
  animation: "orbital",
};

export function isMaintenanceAnimation(value: string): value is MaintenanceAnimation {
  return MAINTENANCE_ANIMATIONS.some((animation) => animation.value === value);
}

export function parseMaintenanceSettings(value?: string | null): MaintenanceSettings {
  if (!value) return DEFAULT_MAINTENANCE_SETTINGS;

  try {
    const parsed = JSON.parse(value) as Partial<MaintenanceSettings>;
    const text = (candidate: unknown, fallback: string) =>
      typeof candidate === "string" && candidate.trim() ? candidate : fallback;
    const animation = String(parsed.animation);
    return {
      enabled: parsed.enabled === true,
      eyebrow: text(parsed.eyebrow, DEFAULT_MAINTENANCE_SETTINGS.eyebrow),
      title: text(parsed.title, DEFAULT_MAINTENANCE_SETTINGS.title),
      message: text(parsed.message, DEFAULT_MAINTENANCE_SETTINGS.message),
      status: text(parsed.status, DEFAULT_MAINTENANCE_SETTINGS.status),
      footer: text(parsed.footer, DEFAULT_MAINTENANCE_SETTINGS.footer),
      animation: isMaintenanceAnimation(animation)
        ? animation
        : DEFAULT_MAINTENANCE_SETTINGS.animation,
    };
  } catch {
    return DEFAULT_MAINTENANCE_SETTINGS;
  }
}
