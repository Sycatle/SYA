import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import en from "@web/languages/english.json";

export const metadata: Metadata = {
        title: en.metadata.title,
        description: en.metadata.description,
};

export default function RootLayout({
        children,
}: {
        children: React.ReactNode;
}) {

        return (
                <html lang="en">
                        <body className="antialiased transition-colors">
                                <Providers>{children}</Providers>
                        </body>
                </html>
        );
}
