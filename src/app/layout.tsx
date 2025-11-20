import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { getConfig } from "@/lib/microcms";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: `Portfolio | ${config.siteName}`,
    description: "Portfolio of a contemporary artist.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getConfig();
  
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${notoSerifJP.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header siteName={config.siteName} />
        <main className="flex-grow">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
