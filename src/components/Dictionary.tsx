import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { chapters, Word } from "../data/chapters";
import { getProgress, WordProgress, WordStatus, setWordStatus } from "../lib/storage";
import { Search, GraduationCap, EyeOff, Filter } from "lucide-react";

export function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<WordStatus | "All">("All");
  const [chapterFilter, setChapterFilter] = useState<string>("All");
  const [progressData, setProgressData] = useState<Record<string, WordProgress>>({});
  const [limit, setLimit] = useState(50);
  
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProgressData(getProgress());
  }, []);

  const allWords = useMemo(() => {
    const list: {word: Word, chapterTitle: string}[] = [];
    chapters.forEach(ch => {
      ch.words.forEach(w => {
        list.push({ word: w, chapterTitle: ch.title });
      });
    });
    return list;
  }, []);

  const chapterTitles = useMemo(() => {
    return chapters.map(ch => ch.title);
  }, []);

  const filteredWords = useMemo(() => {
    let result = allWords;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.word.german.toLowerCase().includes(lower) || 
        item.word.english.toLowerCase().includes(lower) ||
        (item.word.article && item.word.article.toLowerCase().includes(lower))
      );
    }

    if (chapterFilter !== "All") {
      result = result.filter(item => item.chapterTitle === chapterFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter(item => {
        const prog = progressData[item.word.id];
        const status = prog?.status || "New";
        return status === statusFilter;
      });
    }

    return result;
  }, [allWords, searchTerm, chapterFilter, statusFilter, progressData]);

  // Reset limit when changing filters or search
  useEffect(() => {
    setLimit(50);
  }, [searchTerm, chapterFilter, statusFilter]);

  // Infinite Scroll functionality
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setLimit(prev => Math.min(prev + 50, filteredWords.length));
    }
  }, [filteredWords.length]);

  const handleStatusChange = (wordId: string, newStatus: WordStatus) => {
    setWordStatus(wordId, newStatus);
    setProgressData(getProgress());
  };

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver, limit]); // Re-attach if limit changes and we still have more elements


  return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
            Dictionary
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Browse and search your vocabulary
          </p>
        </div>

        <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text"
                placeholder="Search German or English words..."
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="mb-8 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Word Status</label>
            <div className="flex flex-wrap gap-2">
              {["All", "New", "Learning", "Review", "Mastered", "Skipped"].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Chapter</label>
            <select 
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Chapters</option>
              {chapterTitles.map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 pb-24">
            {filteredWords.slice(0, limit).map(({word, chapterTitle}) => {
                const prog = progressData[word.id];
                const status = prog?.status || "New";
                return (
                    <div key={word.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white text-lg">
                                {word.german} 
                                {word.article ? <span className="ml-2 text-sm text-slate-500 font-normal">{word.article}</span> : null}
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">{word.english}</span>
                            <span className="text-xs text-slate-400 mt-1">{chapterTitle}</span>
                        </div>
                        <div className="flex items-center justify-center min-w-[80px] relative group/status">
                           {status === "Skipped" ? (
                               <div className="flex flex-col items-center text-slate-400">
                                   <EyeOff size={18} />
                                   <span className="text-[10px] uppercase font-bold mt-1">Skipped</span>
                               </div>
                           ) : status === "Mastered" ? (
                               <div className="flex flex-col items-center text-emerald-500">
                                   <GraduationCap size={18} />
                                   <span className="text-[10px] uppercase font-bold mt-1">Mastered</span>
                               </div>
                           ) : status === "Learning" || status === "Review" ? (
                               <div className="flex flex-col items-center text-blue-500">
                                   <div className="text-sm font-bold">{prog?.mastery_score || 0}%</div>
                                   <span className="text-[10px] uppercase font-bold text-blue-500/70">{status}</span>
                               </div>
                           ) : (
                               <div className="flex flex-col items-center text-slate-300 dark:text-slate-600">
                                   <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mb-1.5 animate-pulse"></span>
                                   <span className="text-[10px] uppercase font-bold">New</span>
                               </div>
                           )}

                           <select 
                            value={status}
                            onChange={(e) => handleStatusChange(word.id, e.target.value as WordStatus)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10"
                            title="Change status"
                           >
                              <option value="New">New</option>
                              <option value="Learning">Learning</option>
                              <option value="Review">Review</option>
                              <option value="Mastered">Mastered</option>
                              <option value="Skipped">Skipped (Never show)</option>
                           </select>

                           <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center opacity-0 group-hover/status:opacity-100 transition-opacity border border-slate-200 dark:border-slate-700">
                              <span className="text-[8px] text-slate-400">▼</span>
                           </div>
                        </div>
                    </div>
                );
            })}
            
            {filteredWords.length > limit && (
               <div ref={loaderRef} className="py-8 flex justify-center text-slate-400">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                 </div>
               </div>
            )}

            {filteredWords.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    No words found. Try adjusting your filters.
                </div>
            )}

            {filteredWords.length > 0 && limit >= filteredWords.length && (
                <div className="text-center py-6 text-sm text-slate-500 font-medium">
                    Showing all {filteredWords.length} words.
                </div>
            )}
        </div>
      </div>
  );
}
