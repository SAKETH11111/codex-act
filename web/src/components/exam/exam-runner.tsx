"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ExamBlueprint, ExamQuestion } from "@/types/exam";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flag,
  Pause,
  Play,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { toast } from "sonner";

interface ExamRunnerProps {
  exam: ExamBlueprint;
}

type ViewMode = "question" | "review" | "summary";

type QuestionStatus = "unseen" | "answered" | "flagged" | "current";

function formatTime(seconds: number) {
  const mins = Math.max(Math.floor(seconds / 60), 0);
  const secs = Math.max(seconds % 60, 0);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getQuestionStatus(
  question: ExamQuestion,
  isCurrent: boolean,
  isFlagged: boolean,
  answer?: string,
): QuestionStatus {
  if (isCurrent) return "current";
  if (isFlagged) return "flagged";
  if (answer) return "answered";
  return "unseen";
}

export function ExamRunner({ exam }: ExamRunnerProps) {
  const sections = useMemo(
    () => [...exam.sections].sort((a, b) => a.order - b.order),
    [exam.sections],
  );

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [view, setView] = useState<ViewMode>("question");
  const [isPaused, setIsPaused] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>(() => ({}));
  const [flagged, setFlagged] = useState<Set<string>>(() => new Set());
  const [elapsedBySection, setElapsedBySection] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const section of sections) {
      initial[section.id] = 0;
    }
    return initial;
  });

  const activeSection = sections[activeSectionIndex];
  const activeQuestion = activeSection?.questions[activeQuestionIndex];
  const timeLimitSeconds = (activeSection?.timeLimitMinutes ?? 0) * 60;
  const elapsed = elapsedBySection[activeSection?.id ?? ""] ?? 0;
  const remaining = Math.max(timeLimitSeconds - elapsed, 0);

  useEffect(() => {
    if (!activeSection || view !== "question" || isPaused) {
      return undefined;
    }

    if (remaining <= 0) {
      setView("review");
      setIsPaused(true);
      toast.info(`${activeSection.name} time is up`, {
        description: "Review your responses or continue to the next section.",
      });
      return undefined;
    }

    const interval = window.setInterval(() => {
      setElapsedBySection((prev) => {
        const current = prev[activeSection.id] ?? 0;
        if (current >= timeLimitSeconds) {
          window.clearInterval(interval);
          setView("review");
          setIsPaused(true);
          toast.info(`${activeSection.name} time is up`, {
            description: "Review your responses or continue to the next section.",
          });
          return prev;
        }
        return {
          ...prev,
          [activeSection.id]: current + 1,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeSection, timeLimitSeconds, view, isPaused, remaining]);

  useEffect(() => {
    setActiveQuestionIndex(0);
  }, [activeSectionIndex]);

  const sectionProgress = useMemo(() => {
    if (!activeSection) return 0;
    const answeredCount = activeSection.questions.filter((question) => answers[question.id]).length;
    return Math.round((answeredCount / Math.max(activeSection.questions.length, 1)) * 100);
  }, [activeSection, answers]);

  const sectionResults = useMemo(() =>
    sections.map((section) => {
      const total = section.questions.length;
      let correct = 0;
      let flaggedCount = 0;
      for (const question of section.questions) {
        const response = answers[question.id];
        if (response && question.answerKey) {
          if (Array.isArray(question.answerKey)) {
            if (question.answerKey.includes(response)) correct += 1;
          } else if (response.trim().toUpperCase() === String(question.answerKey).trim().toUpperCase()) {
            correct += 1;
          }
        }
        if (flagged.has(question.id)) flaggedCount += 1;
      }
      return {
        section,
        accuracy: total ? correct / total : 0,
        flagged: flaggedCount,
        correct,
        total,
      };
    }),
  [sections, answers, flagged]);

  const goToQuestion = (index: number) => {
    setActiveQuestionIndex(index);
    setView("question");
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const moveToAdjacentQuestion = (direction: "next" | "prev") => {
    if (!activeSection) return;
    if (direction === "next") {
      if (activeQuestionIndex < activeSection.questions.length - 1) {
        setActiveQuestionIndex((prev) => prev + 1);
      } else {
        toast.message("End of section", {
          description: "Review your responses before moving on.",
        });
        setView("review");
      }
    } else if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    }
  };

  const finalizeSection = () => {
    if (activeSectionIndex < sections.length - 1) {
      setActiveSectionIndex((prev) => prev + 1);
      setView("question");
      setIsPaused(false);
      toast.success(`Moved to ${sections[activeSectionIndex + 1].name}`);
    } else {
      setView("summary");
      setIsPaused(true);
      toast.success("Exam simulation complete", {
        description: "Review analytics and recommended next steps.",
      });
    }
  };

  const unansweredInSection = activeSection?.questions.filter((question) => !answers[question.id]).length ?? 0;
  const flaggedInSection = activeSection?.questions.filter((question) => flagged.has(question.id)).length ?? 0;
  const totalQuestionsInSection = activeSection?.questions.length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-50">
      <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Catalyst Simulation</p>
              <p className="text-sm font-semibold text-neutral-100">{exam.title}</p>
            </div>
          </div>
          {activeSection && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Current Section</p>
                <p className="text-sm font-semibold text-neutral-100">{activeSection.name}</p>
              </div>
              <Separator orientation="vertical" className="h-10 bg-white/10" />
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Time Remaining</p>
                <p
                  className={cn(
                    "text-lg font-semibold",
                    remaining < 60 ? "text-amber-300" : "text-emerald-300",
                  )}
                >
                  {formatTime(remaining)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 border border-white/20 text-neutral-100"
                      onClick={() => setIsPaused((prev) => !prev)}
                    >
                      {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isPaused ? "Resume" : "Pause"} timer</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 border border-white/20 text-neutral-100"
                      onClick={() => {
                        setElapsedBySection((prev) => ({
                          ...prev,
                          [activeSection.id]: 0,
                        }));
                        setIsPaused(false);
                        toast.success("Timer reset", {
                          description: `Restarted the ${activeSection.name} section timer.`,
                        });
                      }}
                    >
                      <TimerReset className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset section timer</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-1 gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <aside className="hidden w-64 flex-none rounded-2xl border border-white/10 bg-neutral-900/60 p-4 shadow-2xl shadow-black/30 lg:block">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Sections</p>
                <div className="mt-3 space-y-2">
                  {sections.map((section, index) => {
                    const isActive = index === activeSectionIndex;
                    const completed = section.questions.every((question) => answers[question.id]);
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => {
                          setActiveSectionIndex(index);
                          setView("question");
                          setIsPaused(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left text-sm transition",
                          isActive ? "bg-primary text-primary-foreground" : "bg-neutral-900 text-neutral-200 hover:border-white/20",
                        )}
                      >
                        <span>{section.name}</span>
                        {completed && <CheckCircle2 className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Question Navigator</p>
                <ScrollArea className="mt-3 h-[420px] rounded-xl border border-white/10 bg-neutral-950/50 p-3">
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {activeSection?.questions.map((question, index) => {
                      const status = getQuestionStatus(
                        question,
                        index === activeQuestionIndex,
                        flagged.has(question.id),
                        answers[question.id],
                      );
                      return (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => goToQuestion(index)}
                          className={cn(
                            "flex h-9 items-center justify-center rounded-lg border text-xs font-medium transition",
                            status === "current" && "border-primary bg-primary/20 text-primary",
                            status === "answered" && "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
                            status === "flagged" && "border-amber-400/60 bg-amber-500/10 text-amber-200",
                            status === "unseen" && "border-white/10 bg-neutral-900 text-neutral-300",
                          )}
                        >
                          {question.order}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-950/50 p-4 text-xs text-neutral-300">
                <p className="font-semibold text-neutral-100">Section stats</p>
                <div className="mt-2 space-y-1">
                  <p>Answered: {totalQuestionsInSection - unansweredInSection}</p>
                  <p>Unanswered: {unansweredInSection}</p>
                  <p>Flagged: {flaggedInSection}</p>
                </div>
                <Progress className="mt-3 h-2" value={sectionProgress} />
                <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-neutral-400">Completion</p>
              </div>
            </div>
          </aside>

          <main className="flex flex-1 flex-col gap-4">
            {view === "question" && activeQuestion && (
              <Card className="flex-1 border border-white/10 bg-neutral-900/70 p-6 text-neutral-100 shadow-2xl shadow-black/30">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Badge variant="outline" className="border-primary/60 text-primary">
                      Question {activeQuestion.order}
                    </Badge>
                    <h2 className="mt-3 text-lg font-semibold leading-7 text-neutral-50">
                      {activeQuestion.stem}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-primary/80">
                      {activeQuestion.skillTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-primary/40 text-primary/90">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant={flagged.has(activeQuestion.id) ? "secondary" : "outline"}
                    size="sm"
                    className={cn(
                      "gap-2 border border-white/20 text-xs uppercase tracking-[0.3em]",
                      flagged.has(activeQuestion.id) && "border-amber-400/60 text-amber-200",
                    )}
                    onClick={() => toggleFlag(activeQuestion.id)}
                  >
                    <Flag className="h-4 w-4" /> {flagged.has(activeQuestion.id) ? "Unflag" : "Flag"}
                  </Button>
                </div>

                <Separator className="my-6 border-white/10" />

                {activeQuestion.kind === "multiple-choice" && activeQuestion.choices ? (
                  <RadioGroup
                    value={answers[activeQuestion.id] ?? ""}
                    onValueChange={(value) => handleAnswerChange(activeQuestion.id, value)}
                    className="space-y-3"
                  >
                    {activeQuestion.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-neutral-950/40 p-4 transition hover:border-primary/60",
                          answers[activeQuestion.id] === choice.label && "border-primary bg-primary/20 text-primary",
                        )}
                      >
                        <RadioGroupItem value={choice.label} className="mt-1" />
                        <div>
                          <p className="font-semibold">{choice.label}</p>
                          <p className="text-sm text-neutral-200">{choice.text}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-200">
                      Enter your response exactly as required. Grid-in supports fractions, decimals, and integers.
                    </p>
                    <Input
                      inputMode="decimal"
                      placeholder="Type answer"
                      value={answers[activeQuestion.id] ?? ""}
                      onChange={(event) => handleAnswerChange(activeQuestion.id, event.target.value)}
                      className="max-w-xs border-white/20 bg-neutral-950/40 text-neutral-100"
                    />
                  </div>
                )}

                <div className="mt-auto flex flex-wrap justify-between gap-2 pt-6">
                  <Button
                    variant="ghost"
                    className="gap-2 border border-white/10 bg-neutral-950/40 text-neutral-100"
                    onClick={() => moveToAdjacentQuestion("prev")}
                    disabled={activeQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <span>{sectionProgress}% complete</span>
                    <span>•</span>
                    <span>{formatTime(elapsed)}</span>
                  </div>
                  <Button
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => moveToAdjacentQuestion("next")}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}

            {view === "review" && activeSection && (
              <Card className="flex-1 border border-primary/40 bg-primary/10 p-6 text-neutral-900">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold text-primary">Review {activeSection.name}</h2>
                    <p className="text-sm text-primary/80">
                      {unansweredInSection} unanswered • {flaggedInSection} flagged
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-primary/30 bg-white/70 p-4">
                    <p className="text-sm font-semibold text-primary">Unanswered</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeSection.questions
                        .filter((question) => !answers[question.id])
                        .map((question) => (
                          <Button
                            key={question.id}
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActiveQuestionIndex(activeSection.questions.indexOf(question));
                              setView("question");
                              setIsPaused(false);
                            }}
                          >
                            Q{question.order}
                          </Button>
                        ))}
                      {unansweredInSection === 0 && (
                        <p className="text-xs text-primary/60">All questions answered.</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-primary/30 bg-white/70 p-4">
                    <p className="text-sm font-semibold text-primary">Flagged</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeSection.questions
                        .filter((question) => flagged.has(question.id))
                        .map((question) => (
                          <Button
                            key={question.id}
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActiveQuestionIndex(activeSection.questions.indexOf(question));
                              setView("question");
                              setIsPaused(false);
                            }}
                          >
                            Q{question.order}
                          </Button>
                        ))}
                      {flaggedInSection === 0 && (
                        <p className="text-xs text-primary/60">No flagged questions.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  <Button variant="outline" onClick={() => setView("question")}>Return to section</Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={finalizeSection}>
                    {activeSectionIndex === sections.length - 1 ? "Submit exam" : "Continue to next section"}
                  </Button>
                </div>
              </Card>
            )}

            {view === "summary" && (
              <Card className="flex-1 border border-emerald-400/50 bg-emerald-500/15 p-6 text-emerald-900">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6" />
                  <div>
                    <h2 className="text-lg font-semibold">Simulation summary</h2>
                    <p className="text-sm text-emerald-800">
                      Review your performance analytics and recommended next steps.
                    </p>
                  </div>
                </div>

                <Table className="mt-6 text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Flagged</TableHead>
                      <TableHead>Time Spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionResults.map((result) => (
                      <TableRow key={result.section.id}>
                        <TableCell>{result.section.name}</TableCell>
                        <TableCell>{Math.round(result.accuracy * 100)}%</TableCell>
                        <TableCell>{result.flagged}</TableCell>
                        <TableCell>{formatTime(elapsedBySection[result.section.id] ?? 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 rounded-2xl border border-emerald-400/60 bg-white/70 p-5 text-sm text-emerald-900">
                  <p className="font-semibold">Adaptive next steps</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    <li>Launch targeted drill sets for flagged skill tags.</li>
                    <li>Invite teacher review by sharing the session analytics export.</li>
                    <li>Schedule a pacing clinic focusing on sections above 60% time usage.</li>
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a href="/analytics">Open analytics dashboard</a>
                  </Button>
                  <Button variant="secondary" asChild>
                    <a href="/ingest">Ingest another PDF</a>
                  </Button>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
