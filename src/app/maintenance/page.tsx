import type { Metadata } from "next";
import { LogoMark } from "@/components/ui/logo";
import styles from "./maintenance.module.css";

export const metadata: Metadata = {
  title: "Website Under Development",
  description: "The ADVAYA College Union website is being improved.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.brand}>
          <LogoMark className="h-12 w-auto sm:h-14" variant="dark" />
          <span>ADVAYA</span>
        </div>

        <div className={styles.layout}>
          <section className={styles.copy} aria-labelledby="maintenance-title">
            <p className={styles.eyebrow}>We&apos;re improving your experience</p>
            <h1 id="maintenance-title" className={styles.title}>
              We&apos;re Building Something Better
            </h1>
            <p className={styles.message}>
              The ADVAYA College Union website is temporarily under maintenance
              while we make it clearer, faster, and more useful. We&apos;ll
              return soon.
            </p>
            <div className={styles.status} role="status">
              <span className={styles.statusDot} aria-hidden="true" />
              <span>Scheduled Maintenance</span>
            </div>
          </section>

          <div className={styles.illustration} aria-hidden="true">
            <div className={`${styles.orbit} ${styles.orbitOne}`} />
            <div className={`${styles.orbit} ${styles.orbitTwo}`} />
            <div className={styles.sun} />
            <div className={`${styles.spark} ${styles.sparkOne}`} />
            <div className={`${styles.spark} ${styles.sparkTwo}`} />
            <svg className={styles.arch} viewBox="0 0 360 300" fill="none">
              <path
                d="M49 254V144c0-72 58-130 131-130s131 58 131 130v110"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M83 254V149c0-53 43-96 97-96s97 43 97 96v105"
                stroke="currentColor"
                strokeOpacity=".45"
                strokeWidth="1.5"
              />
              <path
                d="M25 254h310"
                stroke="currentColor"
                strokeOpacity=".65"
                strokeWidth="2"
              />
              <path d="M117 254v-59h126v59" stroke="currentColor" strokeWidth="2" />
              <path d="M143 254v-34h74v34" stroke="currentColor" strokeOpacity=".55" />
              <circle cx="180" cy="78" r="9" fill="currentColor" fillOpacity=".9" />
              <path d="M180 87v46M156 111h48" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className={styles.illustrationLabel}>BUILDING THE NEXT CHAPTER</span>
          </div>
        </div>

        <footer className={styles.footer}>
          <span>ADVAYA College Union</span>
          <span className={styles.footerRule} aria-hidden="true" />
          <span>Govt. TD Medical College, Alappuzha</span>
        </footer>
      </div>
    </main>
  );
}
