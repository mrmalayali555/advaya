import {
  Bell,
  CalendarDays,
  Trophy,
  MessageSquareWarning,
  Wallet,
  Siren,
  Users,
  Mail,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Bell,
  CalendarDays,
  Trophy,
  MessageSquareWarning,
  Wallet,
  Siren,
  Users,
  Mail,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = map[name] ?? Bell;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
