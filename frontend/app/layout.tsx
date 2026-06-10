import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import UniversalModal from "./components/UniversalModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/lib/provider";

export const metadata: Metadata = {
    title: "Career Assistant",
    description: "A career assistant app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const queryClient = new QueryClient();
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
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
                </Providers>
            </body>
        </html>
    );
}
