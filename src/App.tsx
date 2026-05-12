import { useState } from 'react';
import { Chapter, chapters } from './data/chapters';
import { ChapterList } from './components/ChapterList';
import { Deck } from './components/Deck';
import { Dictionary } from './components/Dictionary';
import { BookOpen, Search } from 'lucide-react';

export default function App() {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<"chapters" | "dictionary">("chapters");

  if (selectedChapter) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
        <Deck 
          chapter={selectedChapter} 
          onBack={() => setSelectedChapter(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 relative">
      <div className="flex-1 overflow-auto">
        {activeTab === "chapters" ? (
          <ChapterList 
            chapters={chapters} 
            onSelect={setSelectedChapter} 
          />
        ) : (
          <Dictionary />
        )}
      </div>

      <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto flex">
          <button 
            onClick={() => setActiveTab("chapters")}
            className={`flex-1 py-3.5 flex flex-col items-center gap-1.5 text-xs font-semibold transition-colors ${activeTab === "chapters" ? "text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"}`}
          >
            <BookOpen size={20} />
            Chapters
          </button>
          <button 
            onClick={() => setActiveTab("dictionary")}
            className={`flex-1 py-3.5 flex flex-col items-center gap-1.5 text-xs font-semibold transition-colors ${activeTab === "dictionary" ? "text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"}`}
          >
            <Search size={20} />
            Dictionary
          </button>
        </div>
      </div>
    </div>
  );
}
