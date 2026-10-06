import { notFound } from "next/navigation";
import { TestRunner } from "@/components/TestRunner";
import { getSubject, subjects } from "@/questions";

export function generateStaticParams() {
  return subjects.map((subject) => ({ subjectId: subject.id }));
}

export default async function SubjectTestPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  if (!getSubject(subjectId)) notFound();
  return <TestRunner subjectId={subjectId} />;
}
