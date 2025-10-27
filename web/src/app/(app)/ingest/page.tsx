"use client";

import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, UploadCloud } from "lucide-react";
import { ExamBlueprint, ParsedExamPayload } from "@/types/exam";
import { sampleExam } from "@/data/sample-exam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function IngestPage() {
  const [selectedExam, setSelectedExam] = useState<ExamBlueprint | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const ingestMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to ingest PDF");
      }

      const payload = (await response.json()) as ParsedExamPayload;
      return payload;
    },
    onSuccess: (payload) => {
      setSelectedExam(payload.exam);
      toast.success("PDF ingested successfully", {
        description: "Review the parsed structure and launch a simulation.",
      });
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Ingestion failed", {
        description:
          error instanceof Error ? error.message : "Check the PDF and try again.",
      });
    },
  });

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Unsupported file", {
        description: "Please upload a PDF document.",
      });
      return;
    }

    setFileName(file.name);
    ingestMutation.mutate(file);
  };

  const isParsing = ingestMutation.isPending;
  const parsedExam = selectedExam ?? sampleExam;
  const warnings = ingestMutation.data?.warnings ?? [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <Badge variant="outline" className="w-fit text-sm">
          Intelligent ingestion pipeline
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Upload any ACT/SAT PDF and generate a structured, review-ready simulation.
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Catalyst leverages hybrid OCR, layout understanding, and sequence modeling to detect sections, questions, answer keys, and skill tags. Review the auto-generated blueprint, adjust if needed, and push directly into a live exam session.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.6fr_1.4fr]">
        <Card className="h-fit border-dashed border-primary/40">
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>
              Drop an ACT or SAT practice test. Mixed layouts, rotations, and scan artifacts are automatically normalized.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <label
              htmlFor="pdf-upload"
              className={cn(
                "group flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/50 bg-muted/50 transition hover:border-primary hover:bg-muted",
                isParsing && "pointer-events-none opacity-70",
              )}
            >
              <UploadCloud className="h-10 w-10 text-primary" />
              <div className="text-center">
                <p className="font-semibold text-foreground">Click or drag to upload</p>
                <p className="text-sm text-muted-foreground">
                  Supports multi-section booklets, scanned files, and answer key appendices.
                </p>
              </div>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={handleFileSelect}
              />
            </label>

            {fileName && (
              <p className="text-xs text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{fileName}</span>
              </p>
            )}

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setSelectedExam(sampleExam)}
              disabled={isParsing}
            >
              Load sample blueprint
            </Button>

            {isParsing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Parsing PDF…
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Running OCR, aligning answer keys, and tagging skills.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl">{parsedExam.title}</CardTitle>
              <CardDescription>
                {parsedExam.synopsis ?? "Structured blueprint generated from the ingestion pipeline."}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{parsedExam.metadata.examFamily}</Badge>
              {parsedExam.metadata.version && (
                <Badge variant="outline">Form {parsedExam.metadata.version}</Badge>
              )}
              {typeof parsedExam.metadata.ingestionConfidence === "number" && (
                <Badge variant="outline" className="font-mono">
                  Confidence {Math.round(parsedExam.metadata.ingestionConfidence * 100)}%
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {parsedExam.sections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-foreground">{section.name}</p>
                  <p className="text-xs text-muted-foreground">{section.questions.length} questions • {section.timeLimitMinutes} min</p>
                  <Separator className="my-3" />
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {section.instructions[0]}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <ScrollArea className="h-72 rounded-xl border border-border/60 bg-background/60">
              <div className="space-y-6 p-4 text-sm">
                {parsedExam.sections.flatMap((section) => (
                  <div key={section.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        {section.name} • {section.questions.length} items
                      </h3>
                      <Badge variant="outline" className="font-mono">
                        {section.timeLimitMinutes} min
                      </Badge>
                    </div>
                    <div className="space-y-3 rounded-lg border border-border/60 bg-muted/40 p-3">
                      {section.questions.map((question) => (
                        <div key={question.id} className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            {question.order}. {question.stem}
                          </p>
                          {question.kind === "multiple-choice" && question.choices && (
                            <ul className="grid gap-1 text-xs text-muted-foreground">
                              {question.choices.map((choice) => (
                                <li key={choice.id} className="rounded-md bg-background/60 px-3 py-1">
                                  <span className="font-semibold text-foreground">{choice.label}.</span> {" "}
                                  {choice.text}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {question.skillTags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[10px]">
                                {tag}
                              </Badge>
                            ))}
                            {question.kind === "grid-in" && (
                              <Badge variant="secondary" className="text-[10px]">
                                Grid-in
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {warnings.length > 0 && (
              <div className="rounded-xl border border-amber-300/70 bg-amber-100/80 p-4 text-sm text-amber-900">
                <p className="font-medium">Warnings</p>
                <ul className="mt-2 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={`${warning.message}-${index}`}>
                      <span className="font-semibold uppercase text-[11px] tracking-wide">
                        {warning.severity}
                      </span>{" "}
                      {warning.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-4 rounded-xl border border-border/60 bg-muted/40 p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Looks good?</p>
                <p className="text-xs text-muted-foreground">
                  Launch an interactive simulation or open in the human-in-the-loop editor for fine tuning.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/editor">Open verification editor</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/simulate/sample">Launch simulation</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
