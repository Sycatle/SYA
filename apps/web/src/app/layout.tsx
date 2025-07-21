import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@hooks/use-theme";

export const metadata: Metadata = {
	title: "SYA, votre assistant web",
	description:
		"SYA est un assistant web qui vous aide à naviguer sur Internet.",
};

export default function RootLayout({
        children,
}: {
        children: React.ReactNode;
}) {

        return (
                <html lang="fr">
                        <body className="antialiased transition-colors">
                                <ThemeProvider>{children}</ThemeProvider>
                        </body>
                </html>
        );
}
