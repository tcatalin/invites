import HeaderAuth from "@/components/header-auth";
import { BrandingConstants } from "@/lib/branding";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { MailIcon } from "lucide-react";
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  metadataBase: new URL(BrandingConstants.URL),
  title: BrandingConstants.PRODUCT_NAME,
  description: BrandingConstants.PRODUCT_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>
                      <div className="flex items-center gap-1 text-xl">
                        <MailIcon size="24" strokeWidth={2} /> {BrandingConstants.PRODUCT_NAME}
                      </div>
                    </Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <p>
                  {BrandingConstants.PRODUCT_NAME} &copy; {new Date().getFullYear()}
                </p>
                <Link href="/terms-of-service">Termeni și condiții</Link>
              </footer>
            </div>
          </main>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
