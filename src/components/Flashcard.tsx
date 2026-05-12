import { motion, useMotionValue, useTransform, useAnimation } from "motion/react";
import React, { useState, useEffect } from "react";
import { Word } from "../data/chapters";
import { cn } from "../lib/utils";
import { RotateCw, Check, X, GraduationCap, EyeOff } from "lucide-react";
import { getWordProgress, WordProgress } from "../lib/storage";

type FlashcardProps = {
  word: Word;
  active: boolean;
  onSwipe: (dir: "left" | "right" | "up") => void;
  index: number;
};

export function Flashcard({ word, active, onSwipe, index }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<WordProgress | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  // Visual cues for swipe
  const knowOpacity = useTransform(x, [50, 150], [0, 1]);
  const learnOpacity = useTransform(x, [-50, -150], [0, 1]);
  const skipOpacity = useTransform(y, [-50, -150], [0, 1]);

  useEffect(() => {
    // Reset state when word changes
    setFlipped(false);
    setProgress(getWordProgress(word.id));
    x.set(0);
    y.set(0);
    controls.set({ opacity: 1, x: 0, y: 0 });
  }, [word, x, y, controls]);

  const handleDragEnd = async (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.y < -threshold) {
      // Swipe Up
      await controls.start({ y: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("up");
    } else if (info.offset.x > threshold) {
      // Swipe Right
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("right");
    } else if (info.offset.x < -threshold) {
      // Swipe Left
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("left");
    } else {
      // Reset
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  function getArticleColor() {
    switch (word.article) {
      case "der": return "text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800";
      case "die": return "text-pink-600 bg-pink-100 border-pink-200 dark:text-pink-400 dark:bg-pink-900/30 dark:border-pink-800";
      case "das": return "text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-800";
      default: return "text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700";
    }
  }

  return (
    <motion.div
      className={cn(
        "absolute w-full h-[400px] sm:h-[480px] max-w-sm cursor-grab active:cursor-grabbing",
        active ? "z-10" : "z-0"
      )}
      style={{
        x,
        rotate,
        scale: active ? 1 : 1 - index * 0.05,
        y: active ? y : index * 10,
      }}
      drag={active ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={controls}
      onClick={() => active && setFlipped(!flipped)}
    >
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="w-full h-full absolute inset-0 rounded-3xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center backface-hidden">
          {active && (
            <>
              <motion.div 
                className="absolute top-8 left-8 text-rose-500 flex flex-col items-center bg-rose-100 dark:bg-rose-900/40 p-3 rounded-full"
                style={{ opacity: learnOpacity }}
              >
                <X size={32} strokeWidth={3} />
              </motion.div>
              <motion.div 
                className="absolute top-8 right-8 text-green-500 flex flex-col items-center bg-green-100 dark:bg-green-900/40 p-3 rounded-full"
                style={{ opacity: knowOpacity }}
              >
                <Check size={32} strokeWidth={3} />
              </motion.div>
              <motion.div 
                className="absolute bottom-16 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center bg-slate-100 dark:bg-slate-800 p-3 rounded-full"
                style={{ opacity: skipOpacity }}
              >
                <EyeOff size={32} strokeWidth={3} />
              </motion.div>
            </>
          )}

          {word.pos === "noun" && word.article && (
            <span className={cn("px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 border", getArticleColor())}>
              {word.article}
            </span>
          )}
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {word.german}
          </h2>
          <div className="mt-8 text-slate-400 flex items-center gap-2">
            <RotateCw size={18} />
            <span className="text-sm">Tap to flip</span>
          </div>
        </div>

        <div className="w-full h-full absolute inset-0 rounded-3xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center backface-hidden [transform:rotateY(180deg)]">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-6">
            {word.pos}
          </span>
          <h3 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
            {word.english}
          </h3>
          
          {word.exampleGerman && (
            <div className="mt-6 w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
              <p className="text-slate-800 dark:text-slate-200 font-medium mb-1">
                "{word.exampleGerman}"
              </p>
              {word.exampleEnglish && (
                <p className="text-slate-500 dark:text-slate-400 italic text-sm">
                  "{word.exampleEnglish}"
                </p>
              )}
            </div>
          )}

          {progress && (
            <div className="absolute bottom-8 w-full px-8 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={14} /> Mastery
                </span>
                <span>{progress.mastery_score} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${progress.mastery_score}%` }} 
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
