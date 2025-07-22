import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversations - SYA",
};

export default function Page() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      Sélectionnez une conversation
    </div>
  );
}
