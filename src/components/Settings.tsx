import React, { useState, useEffect } from "react";
import { resetAllProgress } from "../lib/storage";
import { Sun, Moon, RotateCcw, ShieldAlert, PlayCircle } from "lucide-react";

export function Settings({ onShowTutorial }: { onShowTutorial?: () => void }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleReset = () => {
    resetAllProgress();
    window.location.reload(); // Reload to refresh all data
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Personalize your experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-medium text-slate-900 dark:text-white">Dark Mode</span>
              <span className="text-sm text-slate-500">Toggle dark and light themes</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
            </button>
          </div>
        </section>

        {/* Tutorial Section */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Help & Tutorial</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-medium text-slate-900 dark:text-white">Watch Tutorial</span>
              <span className="text-sm text-slate-500">Learn how to use flashcards</span>
            </div>
            <button
              onClick={onShowTutorial}
              className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-xl transition-colors font-medium"
            >
              <PlayCircle size={24} />
            </button>
          </div>
        </section>

        {/* Data Section */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Data Management</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-medium text-slate-900 dark:text-white">Reset Progress</span>
                <span className="text-sm text-slate-500">This will clear all your learning data</span>
              </div>
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30 px-4 py-2.5 rounded-xl font-semibold transition-all"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-rose-600 text-white hover:bg-rose-700 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
                  >
                    Confirm Reset
                  </button>
                </div>
              )}
            </div>

            {showConfirmReset && (
              <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                <ShieldAlert className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Are you sure? This action cannot be undone. All mastered words and progress scores will be removed.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
