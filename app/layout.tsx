import type { Metadata, Viewport } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import localFont from "next/font/local";
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

const hokusai = localFont({
  src: "./fonts/HokusaiPersonalUseRegular.ttf",
  variable: "--font-hokusai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "eyes.on.batumi",
  description: "ქუჩის პორტრეტები ბათუმში",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#F7F2EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ka"
      className={`${notoSans.variable} ${notoSerif.variable} ${hokusai.variable} h-full antialiased`}
    >
      <body className="relative min-h-full text-navy">
        <SceneBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
