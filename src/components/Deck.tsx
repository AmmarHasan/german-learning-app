import React, { useState, useEffect } from "react";
import { Chapter, Word } from "../data/chapters";
import { Flashcard } from "./Flashcard";
import { ArrowLeft, Check, RotateCcw, X, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getProgress, updateWordProgress } from "../lib/storage";

type DeckProps = {
  chapter: Chapter;
  onBack: () => void;
};

export function Deck({ chapter, onBack }: DeckProps) {
  const [remainingWords, setRemainingWords] = useState<Word[]>([]);
  const [knownCount, setKnownCount] = useState(0);
  const [learningCount, setLearningCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [totalToLearn, setTotalToLearn] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadDeck();
  }, [chapter]);

  const loadDeck = () => {
    const progress = getProgress();
    // Only study words that are not mastered and not skipped
    const toLearn = chapter.words.filter(w => {
      const status = progress[w.id]?.status;
      return status !== "Mastered" && status !== "Skipped";
    });
    
    setRemainingWords(toLearn);
    setTotalToLearn(toLearn.length);
    setKnownCount(0);
    setLearningCount(0);
    setFinished(toLearn.length === 0);
    setIsLoaded(true);
  };

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (remainingWords.length === 0) return;
    
    const currentWord = remainingWords[0];
    let action: "correct" | "incorrect" | "skip" = "correct";
    if (direction === "left") action = "incorrect";
    if (direction === "up") action = "skip";
    
    // Update data persistence
    updateWordProgress(currentWord.id, action);

    if (action === "correct") {
      setKnownCount((prev) => prev + 1);
    } else if (action === "incorrect") {
      setLearningCount((prev) => prev + 1);
    } else {
      // Let's count a skipped word as "known" for the sake of the summary
      setKnownCount((prev) => prev + 1);
    }

    setRemainingWords((prev) => {
      const newRemaining = [...prev];
      newRemaining.shift(); // Remove the top card
      if (newRemaining.length === 0) setFinished(true);
      return newRemaining;
    });
  };

  if (!isLoaded) return null;

  const progress = totalToLearn > 0 ? ((totalToLearn - remainingWords.length) / totalToLearn) * 100 : 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center pt-8 px-4 font-sans">
      <div className="w-full max-w-xl flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {chapter.title}
        </span>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      {!finished && totalToLearn > 0 && (
        <div className="w-full max-w-sm mb-12">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            <span>Progress</span>
            <span>{totalToLearn - remainingWords.length} / {totalToLearn}</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      )}

      <div className="relative w-full max-w-sm h-[400px] sm:h-[480px] perspective-[1000px] flex justify-center mt-4">
        {finished ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center"
          >
            {totalToLearn === 0 ? (
              <>
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center rounded-full mb-6">
                  <Target size={32} strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Fully Mastered!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[250px]">
                  You have already mastered all {chapter.words.length} words in this chapter. 
                </p>
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm"
                >
                  <ArrowLeft size={18} />
                  Back to Chapters
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center rounded-full mb-6">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Session Complete!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[250px]">
                  You swiped right on {knownCount} words and left on {learningCount} words. Progress has been saved!
                </p>
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm"
                >
                  <ArrowLeft size={18} />
                  Back to Chapters
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            {/* Render cards in reverse order so the first is on top */}
            {remainingWords.slice(0, 3).reverse().map((word, index, arr) => {
              const activeIndex = arr.length - 1 - index;
              return (
                <Flashcard
                  key={word.id}
                  word={word}
                  index={activeIndex} // 0 is top
                  active={activeIndex === 0}
                  onSwipe={handleSwipe}
                />
              );
            })}
          </AnimatePresence>
        )}
      </div>
      
      {!finished && totalToLearn > 0 && (
        <div className="mt-16 sm:mt-24 w-full flex flex-col items-center gap-4 max-w-sm text-slate-400 text-sm font-medium">
          <div className="w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <X size={16} className="text-rose-400" /> Swipe Left to Learn
            </span>
            <span className="flex items-center gap-2">
              Swipe Right if Known <Check size={16} className="text-green-400" />
            </span>
          </div>
          <span className="text-xs text-slate-400/80 uppercase tracking-widest font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1">
            Swipe Up to Skip
          </span>
        </div>
      )}
    </div>
  );
}
