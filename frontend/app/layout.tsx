import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import UniversalModal from "./components/UniversalModal";

export const metadata: Metadata = {
  title: "Career Assistant",
  description: "A career assistant app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem={true}
        >
          <Header />
          {children}
          <Footer />
          <UniversalModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
