import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MarqueeBar } from "@/components/layout/marquee-bar";
import { getMarquee } from "@/lib/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const marquee = await getMarquee();

  return (
    <>
      <Navbar />
      {marquee && (
        <div className="sticky top-[64px] z-30">
          <MarqueeBar
            text={marquee.text}
            buttonText={marquee.buttonText}
            buttonUrl={marquee.buttonUrl}
          />
        </div>
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
