import { notFound } from "next/navigation";
import { ResultsView } from "@/components/ResultsView";
import { getSubject, subjects } from "@/questions";

export function generateStaticParams() {
  return subjects.map((subject) => ({ subjectId: subject.id }));
}

export default async function ResultsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  if (!getSubject(subjectId)) notFound();
  return <ResultsView kind="subject" scope={subjectId} />;
}
