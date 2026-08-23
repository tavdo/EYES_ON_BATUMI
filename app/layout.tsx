import type { Metadata, Viewport } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import localFont from "next/font/local";
import { SceneBackground } from "@/components/SceneBackground";
import { SEO, SITE_NAME } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";
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
  metadataBase: new URL(siteUrl()),
  title: {
    default: SEO.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: SEO.description,
  keywords: SEO.keywords,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: siteUrl() }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ka_GE",
    alternateLocale: ["en_US", "ru_RU"],
    url: siteUrl(),
    siteName: SITE_NAME,
    title: SEO.title,
    description: SEO.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
  },
  category: "photography",
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
