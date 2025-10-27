export type ExamFamily = "ACT" | "SAT";

export type QuestionKind =
  | "multiple-choice"
  | "grid-in"
  | "multi-select"
  | "essay";

export interface QuestionChoice {
  id: string;
  label: string;
  text: string;
  rationale?: string;
}

export interface QuestionResource {
  type: "image" | "table" | "audio" | "html";
  src: string;
  description?: string;
  altText?: string;
}

export interface ExamQuestion {
  id: string;
  order: number;
  kind: QuestionKind;
  stem: string;
  promptRichText?: string;
  answerKey?: string | string[];
  choices?: QuestionChoice[];
  gridTemplate?: string;
  resources?: QuestionResource[];
  skillTags: string[];
  difficulty?: number;
  estimatedTimeSeconds?: number;
  metadata?: Record<string, unknown>;
}

export interface ExamSection {
  id: string;
  name: string;
  description?: string;
  order: number;
  timeLimitMinutes: number;
  instructions: string[];
  calculatorAllowed?: boolean;
  questions: ExamQuestion[];
}

export interface ExamBlueprintMetadata {
  examFamily: ExamFamily;
  version?: string;
  sourcePdfName?: string;
  ingestionConfidence?: number;
  createdAt: string;
  author?: string;
  notes?: string;
}

export interface ExamBlueprint {
  id: string;
  title: string;
  synopsis?: string;
  metadata: ExamBlueprintMetadata;
  sections: ExamSection[];
}

export interface ParsedExamWarning {
  message: string;
  context?: string;
  severity: "info" | "warning" | "error";
}

export interface ParsedExamPayload {
  exam: ExamBlueprint;
  warnings: ParsedExamWarning[];
  rawText?: string;
}

export type AssessmentMode = "simulation" | "practice" | "challenge";

export interface ExamAttempt {
  id: string;
  examId: string;
  mode: AssessmentMode;
  startedAt: string;
  updatedAt: string;
  answers: Record<string, string>;
  flaggedQuestions: string[];
  elapsedBySection: Record<string, number>; // seconds
}

export interface SectionAnalyticsSummary {
  sectionId: string;
  accuracy: number;
  scoreScaled?: number;
  timePerQuestionSeconds: number;
  strengths: string[];
  focusSkills: string[];
}

export interface ExamAnalyticsSnapshot {
  attemptId: string;
  compositeScore?: number;
  sections: SectionAnalyticsSummary[];
  recommendedNextActions: {
    label: string;
    description: string;
    href?: string;
  }[];
}
