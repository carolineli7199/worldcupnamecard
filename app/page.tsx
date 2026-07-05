import { Metadata } from "next";
import FlashcardApp from "@/components/FlashcardApp";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="flex flex-col flex-1 min-h-dvh overflow-x-hidden">
      <FlashcardApp />
    </main>
  );
}
