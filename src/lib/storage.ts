import { Word } from "../data/chapters";

export type WordStatus = "New" | "Learning" | "Review" | "Mastered" | "Skipped";

export interface WordProgress {
  word_id: string;
  status: WordStatus;
  last_reviewed: number;
  interval: number;
  mastery_score: number;
}

const STORAGE_KEY = "vocab_progress";

export function getProgress(): Record<string, WordProgress> {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, WordProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getWordProgress(wordId: string): WordProgress {
  const allProgress = getProgress();
  if (allProgress[wordId]) {
    return allProgress[wordId];
  }
  return {
    word_id: wordId,
    status: "New",
    last_reviewed: 0,
    interval: 0,
    mastery_score: 0,
  };
}

export function updateWordProgress(wordId: string, action: "correct" | "incorrect" | "skip") {
  const allProgress = getProgress();
  const prog = allProgress[wordId] || {
    word_id: wordId,
    status: "New",
    last_reviewed: 0,
    interval: 0,
    mastery_score: 0,
  };

  if (action === "correct") {
    prog.mastery_score = Math.min(100, prog.mastery_score + 20);
  } else if (action === "incorrect") {
    prog.mastery_score = Math.max(0, prog.mastery_score - 20);
  } else if (action === "skip") {
    prog.mastery_score = 100;
  }

  prog.last_reviewed = Date.now();

  // Determine status
  if (action === "skip") {
    prog.status = "Skipped";
  } else {
    if (prog.mastery_score >= 100) {
      prog.status = "Mastered";
    } else if (prog.mastery_score >= 50) {
      prog.status = "Review";
    } else if (prog.mastery_score > 0) {
      prog.status = "Learning";
    } else {
      prog.status = "New";
    }
  }

  allProgress[wordId] = prog;
  saveProgress(allProgress);
  return prog;
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
export function setWordStatus(wordId: string, status: WordStatus) {
  const allProgress = getProgress();
  const prog = allProgress[wordId] || {
    word_id: wordId,
    status: "New",
    last_reviewed: 0,
    interval: 0,
    mastery_score: 0,
  };

  prog.status = status;
  prog.last_reviewed = Date.now();
  
  if (status === "Mastered" || status === "Skipped") {
    prog.mastery_score = 100;
  } else if (status === "New") {
    prog.mastery_score = 0;
  } else if (status === "Learning") {
    prog.mastery_score = 25;
  } else if (status === "Review") {
    prog.mastery_score = 75;
  }

  allProgress[wordId] = prog;
  saveProgress(allProgress);
  return prog;
}
