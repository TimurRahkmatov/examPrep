import { notFound } from "next/navigation";
import { ResultsView } from "@/components/ResultsView";
import { getSubject, subjects } from "@/questions";

export function generateStaticParams() {
  return [{ scope: "all" }, ...subjects.map((subject) => ({ scope: subject.id }))];
}

export default async function PracticeResultsPage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (scope !== "all" && !getSubject(scope)) notFound();
  return <ResultsView kind="practice" scope={scope} />;
}
