import type { Metadata, Viewport } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import { SceneBackground } from "@/components/SceneBackground";
import "./globals.css";

const notoSans = Noto_Sans_Georgian({
  variable: "--font-noto-sans",
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600"],
});

const notoSerif = Noto_Serif_Georgian({
  variable: "--font-noto-serif",
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "eyes.on.batumi",
  description: "ქუჩის პორტრეტები ბათუმში",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#16202A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ka"
      className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-navy text-cream">
        <SceneBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
