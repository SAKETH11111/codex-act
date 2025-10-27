import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamRunner } from "@/components/exam/exam-runner";
import { sampleExam } from "@/data/sample-exam";

const examRegistry = {
  sample: sampleExam,
};

export const metadata: Metadata = {
  title: "Simulation",
};

export default function SimulationPage({ params }: { params: { examId: string } }) {
  const examId = params.examId;
  const exam = examRegistry[examId as keyof typeof examRegistry];

  if (!exam) {
    notFound();
  }

  return <ExamRunner exam={exam} />;
}
