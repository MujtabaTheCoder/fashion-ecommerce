import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} · Haute Couture & 3D Interactive Fashion`,
    template: `%s · ${BRAND_NAME}`,
  },
  description: BRAND_TAGLINE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans bg-background text-ink selection:bg-ink selection:text-background">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
