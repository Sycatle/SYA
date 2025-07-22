import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil - SYA",
};

export default function Page() {
	redirect("/chat");
	return null;
}
