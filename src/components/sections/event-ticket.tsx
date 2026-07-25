import Link from "next/link";
import styles from "./event-ticket.module.css";
import { LogoMark } from "@/components/ui/logo";
import { formatDate } from "@/lib/utils";

function daysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((d.getTime() - now.getTime()) / 86_400_000));
}

export function EventTicket({
  event,
}: {
  event: {
    title: string;
    slug: string;
    date: Date;
    time: string | null;
    venue: string | null;
    status: string;
  };
}) {
  const dLeft = daysUntil(event.date);
  const shortId = event.slug.slice(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, "");

  return (
    <div className={styles.wrapper}>
      <Link href={`/events/${event.slug}`} className={styles.link} aria-label={event.title}>
        <div className={styles.ticket}>
          <div className={styles.main}>
            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.logo}>
                  <LogoMark variant="dark" className="h-[1.6em] w-[1.6em]" />
                  ADVAYA
                </div>
                <div className={styles.type}>{event.status} · Event Pass</div>
              </div>

              <div className={styles.title}>{event.title}</div>
              <div className={styles.subtitle}>Alappuzha Medical College Union</div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Date</span>
                  <span className={styles.value}>{formatDate(event.date)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Time</span>
                  <span className={styles.value}>{event.time || "TBA"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Venue</span>
                  <span className={styles.value}>{event.venue || "TBA"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Entry</span>
                  <span className={styles.value}>All Students</span>
                </div>
              </div>
            </div>

            <div className={styles.perforation}>
              <div className={styles.perfLine} />
            </div>
          </div>

          <div className={styles.stub}>
            <div className={styles.barcodeContainer}>
              <div className={styles.barcode} />
              <div className={styles.barcodeId}>ADV-{shortId || "EVENT"}</div>
            </div>
            <div className={styles.admit}>
              <div className={styles.admitText}>{dLeft === 0 ? "Today" : "Days to go"}</div>
              <div className={styles.admitNum}>{dLeft === 0 ? "★" : dLeft}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
