import type { Metadata, Viewport } from "next";
import { Chakra_Petch, IBM_Plex_Mono, IBM_Plex_Sans, Josefin_Sans } from "next/font/google";
import { SideProvider } from "@/components/side/SideProvider";
import { pt } from "@/content/pt";
import { ENTRY_SCRIPT } from "@/lib/entry-script";
import { siteUrl } from "@/lib/site";
import "@/styles/globals.css";

const darkDisplay = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const lightDisplay = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-josefin",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const site = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: pt.meta.title,
    template: `%s // ${pt.meta.short}`,
  },
  description: pt.meta.description,
  applicationName: pt.meta.short,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site,
    siteName: pt.meta.short,
    title: pt.meta.title,
    description: pt.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: pt.meta.title,
    description: pt.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07080A",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Esaú Santana",
  jobTitle: pt.meta.jobTitle,
  url: site,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santa Fé do Sul",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  sameAs: ["https://www.twitch.tv/taldosatis"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${darkDisplay.variable} ${lightDisplay.variable} ${mono.variable} ${body.variable} h-full`}
    >
      <body className="min-h-dvh bg-bg font-sans text-text antialiased">
        <script dangerouslySetInnerHTML={{ __html: ENTRY_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SideProvider>{children}</SideProvider>
      </body>
    </html>
  );
}
