import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = {
  title: "Quiz — reconnaissez-vous les clubs de Ligue 1 tunisienne ?",
  description:
    "Dix écussons, dix questions : saurez-vous reconnaître les seize clubs de la Ligue Professionnelle 1 tunisienne ?",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <>
      <SiteHeader active="/quiz" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
          Connaissez-vous vos clubs ?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[15px] leading-relaxed text-mute">
          Dix écussons tirés au hasard parmi les seize clubs de Ligue Professionnelle 1.
        </p>

        <div className="mt-8">
          <Quiz />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
