import type { Metadata, Viewport } from "next";
import { Anybody, Hanken_Grotesk, Permanent_Marker } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE } from "@/lib/site";

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const brush = Permanent_Marker({
  variable: "--font-brush",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Advaya",
    "Alappuzha Medical College",
    "College Union",
    "Medical College Union",
    "student union",
    "achievements",
    "events",
    "notifications",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
  icons: { icon: "/icon.svg" },
  generator: "Next.js",
  publisher: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#5b2a86",
  width: "device-width",
  initialScale: 1,
};


import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentBenefitsService",
    "name": "ADVAYA College Union",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Government TD Medical College Alappuzha",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Alappuzha",
        "addressRegion": "Kerala",
        "postalCode": "688005",
        "addressCountry": "IN"
      }
    },
    "url": "https://advaya.college"
  };

  return (
    <html 
      lang="en" 
      className={`dark ${anybody.variable} ${hanken.variable} ${brush.variable} scroll-smooth antialiased selection:bg-purple-500/30 selection:text-purple-200`}
    >
      <body className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">

        <NextTopLoader color="#5b2a86" showSpinner={false} />
        {/* Gallery-only fonts — load non-blocking after page paint */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Cedarville+Cursive&family=Playfair+Display:wght@700&display=swap"
          media="print"
          // @ts-expect-error onload trick for non-blocking font load
          onLoad="this.media='all'"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xtfty27try");
          `}
        </Script>

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W11DDRZ1R7" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W11DDRZ1R7');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
