import { notFound } from "next/navigation";
import { TestRunner } from "@/components/TestRunner";
import { getSubject, subjects } from "@/questions";

export function generateStaticParams() {
  return [{ scope: "all" }, ...subjects.map((subject) => ({ scope: subject.id }))];
}

export default async function PracticePage({ params }: { params: Promise<{ scope: string }> }) {
  const { scope } = await params;
  if (scope !== "all" && !getSubject(scope)) notFound();
  return <TestRunner kind="practice" scope={scope} />;
}
