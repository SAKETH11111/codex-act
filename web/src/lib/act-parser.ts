import type {
  ExamBlueprint,
  ExamQuestion,
  ExamSection,
  ParsedExamPayload,
  ParsedExamWarning,
  QuestionKind,
} from "@/types/exam";

const SECTION_DEFINITIONS = [
  { id: "english", name: "English", aliases: ["english test", "english section"] },
  { id: "math", name: "Math", aliases: ["math test", "mathematics"] },
  { id: "reading", name: "Reading", aliases: ["reading test", "reading passage"] },
  { id: "science", name: "Science", aliases: ["science test", "science reasoning"] },
  { id: "writing", name: "Writing", aliases: ["writing test", "writing prompt"] },
];

const SKILL_INFERENCES: { pattern: RegExp; tag: string }[] = [
  { pattern: /verb|subject|agreement/i, tag: "Grammar::Subject-Verb Agreement" },
  { pattern: /comb(ine|ination)|sentence/i, tag: "Rhetoric::Sentence Combining" },
  { pattern: /function|f\(x\)|evaluate/i, tag: "Functions::Evaluation" },
  { pattern: /solve|equation|linear/i, tag: "Algebra::Linear Equations" },
  { pattern: /tone|attitude|narrator/i, tag: "Reading::Tone" },
  { pattern: /experiment|data|graph|table|variable/i, tag: "Science::Data Interpretation" },
  { pattern: /geometry|triangle|angle/i, tag: "Math::Geometry" },
  { pattern: /probability|percent|ratio/i, tag: "Math::Probability" },
  { pattern: /passage|author|main idea/i, tag: "Reading::Main Ideas" },
];

const GRID_IN_HINTS = /grid\s*-?in|record your answer|enter your answer/i;

function normalize(text: string): string {
  return text.replace(/\r/g, "").replace(/[ \t]+$/gm, "");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractAnswerKeyMap(text: string) {
  const answerKeySectionIndex = text.search(/answer\s*key|key\s*to\s*the\s*test/i);
  const portion = answerKeySectionIndex >= 0 ? text.slice(answerKeySectionIndex) : text;
  const answerMap = new Map<number, string>();

  const answerRegex = /(\d{1,3})\s*(?:[.:]\s*|\s+)([A-JF]|\d{1,4}|Yes|No)/gi;
  let match: RegExpExecArray | null;
  while ((match = answerRegex.exec(portion)) !== null) {
    const questionNumber = Number.parseInt(match[1] ?? "0", 10);
    if (!Number.isNaN(questionNumber)) {
      answerMap.set(questionNumber, match[2]?.trim() ?? "");
    }
  }

  return answerMap;
}

function inferKind(sectionId: string, questionBody: string, choiceCount: number): QuestionKind {
  if (choiceCount >= 4) {
    return "multiple-choice";
  }

  if (GRID_IN_HINTS.test(questionBody) || sectionId === "math") {
    return "grid-in";
  }

  return "multiple-choice";
}

function inferSkillTags(sectionId: string, stem: string): string[] {
  const tags = new Set<string>();

  for (const inference of SKILL_INFERENCES) {
    if (inference.pattern.test(stem)) {
      tags.add(inference.tag);
    }
  }

  if (tags.size === 0) {
    if (sectionId === "english") tags.add("English::Conventions");
    if (sectionId === "math") tags.add("Math::General");
    if (sectionId === "reading") tags.add("Reading::Comprehension");
    if (sectionId === "science") tags.add("Science::Reasoning");
  }

  return Array.from(tags);
}

function parseSection(
  sectionId: string,
  sectionName: string,
  order: number,
  content: string,
  answerMap: Map<number, string>,
): { section: ExamSection; warnings: ParsedExamWarning[] } {
  const questions: ExamQuestion[] = [];
  const warnings: ParsedExamWarning[] = [];

  const normalized = normalize(content);
  const questionRegex = /(\n|^)(\d{1,3})[.)]\s+/g;
  const matches = Array.from(normalized.matchAll(questionRegex));

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const questionNumber = Number.parseInt(match[2] ?? "0", 10);
    if (Number.isNaN(questionNumber)) continue;
    const startIndex = (match.index ?? 0) + match[0].length;
    const endIndex = index + 1 < matches.length ? matches[index + 1].index ?? normalized.length : normalized.length;
    const segment = normalized.slice(startIndex, endIndex).trim();

    const lines = segment.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const stemParts: string[] = [];
    const choices: { label: string; text: string }[] = [];

    let currentChoice: { label: string; text: string } | null = null;

    for (const rawLine of lines) {
      const choiceMatch = rawLine.match(/^([A-HJF])[).\-]?\s*(.*)$/i);
      if (choiceMatch && choiceMatch[1]) {
        if (currentChoice) {
          choices.push(currentChoice);
        }
        currentChoice = {
          label: choiceMatch[1].toUpperCase(),
          text: choiceMatch[2]?.trim() ?? "",
        };
      } else if (currentChoice) {
        currentChoice.text = `${currentChoice.text} ${rawLine}`.trim();
      } else {
        stemParts.push(rawLine);
      }
    }

    if (currentChoice) {
      choices.push(currentChoice);
    }

    const stem = stemParts.join(" ").replace(/\s+/g, " ").trim();

    if (!stem) {
      warnings.push({
        message: `Question ${questionNumber} stem could not be parsed`,
        context: sectionName,
        severity: "warning",
      });
    }

    const kind = inferKind(sectionId, `${stem} ${segment}`, choices.length);
    const answerKey = answerMap.get(questionNumber);

    const question: ExamQuestion = {
      id: `${sectionId}-${questionNumber}`,
      order: questionNumber,
      kind,
      stem: stem || `Question ${questionNumber}`,
      choices:
        choices.length > 0
          ? choices.map((choice, idx) => ({
              id: `${sectionId}-${questionNumber}-${choice.label}-${idx}`,
              label: choice.label,
              text: choice.text,
            }))
          : undefined,
      answerKey: answerKey ?? undefined,
      skillTags: inferSkillTags(sectionId, stem),
      metadata: {
        confidence: choices.length > 0 ? 0.9 : 0.7,
      },
    };

    questions.push(question);
  }

  if (questions.length === 0) {
    warnings.push({
      message: `No questions detected in ${sectionName} section`,
      severity: "warning",
      context: sectionName,
    });
  }

  return {
    section: {
      id: sectionId,
      name: sectionName,
      description: `${sectionName} section parsed from PDF`,
      order,
      timeLimitMinutes: sectionId === "english" ? 45 : sectionId === "math" ? 60 : 35,
      instructions: [
        "Review the auto-detected questions and confirm accuracy.",
        "Use the editor to adjust passages, diagrams, or answer options if needed.",
      ],
      calculatorAllowed: sectionId === "math",
      questions,
    },
    warnings,
  };
}

export async function parseActPdf(buffer: Buffer, fileName?: string): Promise<ParsedExamPayload> {
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(buffer);
  const text = normalize(result.text ?? "");

  if (!text) {
    return {
      exam: {
        id: slugify(fileName ?? `exam-${Date.now()}`),
        title: fileName ?? "ACT Practice Exam",
        metadata: {
          examFamily: "ACT",
          version: "unknown",
          sourcePdfName: fileName,
          ingestionConfidence: 0.3,
          createdAt: new Date().toISOString(),
        },
        sections: [],
      },
      warnings: [
        {
          message: "The PDF did not contain extractable text. Attempt OCR or upload a clearer scan.",
          severity: "error",
        },
      ],
    };
  }

  const answerMap = extractAnswerKeyMap(text);

  const sectionMatches = SECTION_DEFINITIONS.map((section) => {
    const indices = section.aliases
      .map((alias) => ({ alias, index: text.toLowerCase().indexOf(alias) }))
      .filter((candidate) => candidate.index >= 0)
      .sort((a, b) => a.index - b.index);
    const index = indices[0]?.index ?? -1;
    return { ...section, index };
  })
    .filter((section) => section.index >= 0)
    .sort((a, b) => a.index - b.index);

  const sections: ExamSection[] = [];
  const warnings: ParsedExamWarning[] = [];

  for (let i = 0; i < sectionMatches.length; i += 1) {
    const current = sectionMatches[i];
    const next = sectionMatches[i + 1];
    const start = current.index;
    const end = next ? next.index : text.length;
    const block = text.slice(start, end);
    const { section, warnings: sectionWarnings } = parseSection(
      current.id,
      current.name,
      i + 1,
      block,
      answerMap,
    );
    sections.push(section);
    warnings.push(...sectionWarnings);
  }

  if (sections.length === 0) {
    warnings.push({
      message: "No ACT-style sections were detected. Confirm the PDF is a full practice test.",
      severity: "warning",
    });
  }

  const questionCount = sections.reduce((total, section) => total + section.questions.length, 0);
  const averageConfidence =
    sections.length > 0
      ? sections.reduce((sum, section) => {
          const sectionConfidence =
            section.questions.reduce((acc, question) => acc + (Number(question.metadata?.confidence) || 0.6), 0) /
            Math.max(section.questions.length, 1);
          return sum + sectionConfidence;
        }, 0) / sections.length
      : 0;

  const blueprint: ExamBlueprint = {
    id: slugify(fileName ?? `exam-${Date.now()}`),
    title: fileName ? fileName.replace(/\.pdf$/i, "") : "ACT Practice Exam",
    synopsis: `Auto-generated from ${fileName ?? "uploaded PDF"} with ${questionCount} detected questions.`,
    metadata: {
      examFamily: "ACT",
      version: result.info?.Title ?? "unlabeled",
      sourcePdfName: fileName,
      ingestionConfidence: Number.isFinite(averageConfidence) ? averageConfidence : 0.5,
      createdAt: new Date().toISOString(),
      author: result.info?.Author ?? undefined,
      notes: `Detected ${sections.length} sections and ${questionCount} questions via Catalyst parser.`,
    },
    sections,
  };

  return {
    exam: blueprint,
    warnings,
    rawText: text.slice(0, 25_000),
  };
}
