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
    "Advaya Fest",
    "Advaya TDMC",
    "Advaya Alappuzha",
    "TDMC Alappuzha",
    "TD Medical College Alappuzha",
    "Government TD Medical College Alappuzha",
    "TDMC College Union",
    "Alappuzha Medical College Union",
    "Medical College Union",
    "student union",
    "TDMC Arts Fest",
    "TDMC Sports Fest",
    "Kerala Medical College Union",
    "Kerala Medical College Fest",
    "advaya college",
    "advaya tdmc alappuzha",
    "college union events",
    "medical college fests kerala",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE.name} — TDMC Alappuzha` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        "@id": "https://advaya.college/#college",
        "name": "Government TD Medical College Alappuzha",
        "alternateName": "TDMC Alappuzha",
        "url": "https://advaya.college",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Alappuzha",
          "addressRegion": "Kerala",
          "postalCode": "688005",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://advaya.college/#organization",
        "name": "ADVAYA College Union",
        "alternateName": "ADVAYA — TDMC Alappuzha College Union",
        "url": "https://advaya.college",
        "logo": "https://advaya.college/icon.svg",
        "parentOrganization": {
          "@id": "https://advaya.college/#college"
        },
        "description": "Official student union of Government TD Medical College Alappuzha, organising fests, cultural events, sports tournaments, and student advocacy."
      },
      {
        "@type": "WebSite",
        "@id": "https://advaya.college/#website",
        "url": "https://advaya.college",
        "name": "ADVAYA College Union — TDMC Alappuzha",
        "publisher": {
          "@id": "https://advaya.college/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://advaya.college/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
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
