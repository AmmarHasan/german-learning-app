import {
  chapter1Data,
  chapter2Data,
  chapter3Data,
  chapter4Data,
  chapter5Data,
  chapter6Data,
  chapter7Data,
  chapter8Data,
  chapter9Data,
  chapter10Data,
  chapter11Data,
  chapter12Data,
} from "./all_chapters_combined";

export type Word = {
  id: string;
  german: string;
  english: string;
  article?: "der" | "die" | "das";
  pos: "noun" | "verb" | "adjective" | "phrase" | "other";
  exampleGerman?: string;
  exampleEnglish?: string;
};

export type Chapter = {
  id: string;
  title: string;
  words: Word[];
};

export const chapters: Chapter[] = [
  chapter1Data,
  chapter2Data,
  chapter3Data,
  chapter4Data,
  chapter5Data,
  chapter6Data,
  chapter7Data,
  chapter8Data,
  chapter9Data,
  chapter10Data,
  chapter11Data,
  chapter12Data,
];
