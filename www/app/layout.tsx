import localFont from "next/font/local";

import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/theme-provider";
export { metadata, viewport } from "@/lib/metadata";

const fontSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const fontMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          "bg-[#FDFDFC] dark:bg-[#111110] antialiased font-sans"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="theme"
          disableTransitionOnChange
        >
          <div className="py-14 sm:py-24 px-6 xs:px-10 sm:px-20 max-w-3xl mx-auto">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
