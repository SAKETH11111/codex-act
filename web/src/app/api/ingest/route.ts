import { NextResponse } from "next/server";
import { parseActPdf } from "@/lib/act-parser";
import { sampleExam } from "@/data/sample-exam";
import type { ParsedExamPayload } from "@/types/exam";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ message: "A PDF file is required." }, { status: 400 });
  }

  if (file.type && file.type !== "application/pdf") {
    return NextResponse.json({ message: "Unsupported file type. Please upload a PDF." }, { status: 415 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parseActPdf(buffer, (file as File).name);
    return NextResponse.json(parsed satisfies ParsedExamPayload);
  } catch (error) {
    console.error("PDF ingestion failed", error);
    return NextResponse.json(
      {
        message: "Parser encountered an error. Loading fallback sample exam.",
        fallback: {
          exam: sampleExam,
          warnings: [
            {
              message: "An error occurred during parsing. Sample data returned instead.",
              severity: "error" as const,
            },
          ],
        },
      },
      { status: 500 },
    );
  }
}
