import React, { useEffect, useState } from "react";
import { Chapter } from "../data/chapters";
import { BookOpen, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { getProgress, WordProgress } from "../lib/storage";

type ChapterListProps = {
  chapters: Chapter[];
  onSelect: (chapter: Chapter) => void;
};

export function ChapterList({ chapters, onSelect }: ChapterListProps) {
  const [progressData, setProgressData] = useState<Record<string, WordProgress>>({});

  useEffect(() => {
    setProgressData(getProgress());
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
          <BookOpen strokeWidth={1.5} size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          German A1 Vocabulary
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mx-auto">
          Master the vocabulary chapter by chapter using spaced repetition flashcards.
        </p>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter, index) => {
          const masteredCount = chapter.words.filter(w => {
            const status = progressData[w.id]?.status;
            return status === "Mastered" || status === "Skipped";
          }).length;
          const total = chapter.words.length;
          const progressPercent = total > 0 ? (masteredCount / total) * 100 : 0;

          return (
            <motion.button
              key={chapter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(chapter)}
              className="w-full flex flex-col p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group overflow-hidden relative"
            >
              <div className="w-full flex items-center justify-between mb-3 z-10">
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {chapter.title}
                  </h3>
                  <span className="text-sm text-slate-400 font-medium">
                    {masteredCount} / {total} mastered
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden z-10">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
