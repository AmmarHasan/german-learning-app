export type Word = {
  id: string;
  german: string;
  english: string;
  article?: 'der' | 'die' | 'das';
  pos: 'noun' | 'verb' | 'adjective' | 'phrase' | 'other';
  exampleGerman?: string;
  exampleEnglish?: string;
};

export type Chapter = {
  id: string;
  title: string;
  words: Word[];
};

export type CompactWord = [
  string, // german
  string, // english
  string, // pos: n (noun), v (verb), a (adj), p (phrase), o (other)
  string, // article: der, die, das (or empty)
  string, // example german
  string  // example english
];

export function buildChapter(id: string, title: string, compactWords: CompactWord[]): Chapter {
  return {
    id,
    title,
    words: compactWords.map((cw, i) => {
      let pos: Word['pos'] = 'other';
      if (cw[2] === 'n') pos = 'noun';
      if (cw[2] === 'v') pos = 'verb';
      if (cw[2] === 'a') pos = 'adjective';
      if (cw[2] === 'p') pos = 'phrase';

      let article: Word['article'] = undefined;
      if (cw[3] === 'der' || cw[3] === 'die' || cw[3] === 'das') {
        article = cw[3] as Word['article'];
      }

      return {
        id: `${id}-${i}`,
        german: cw[0],
        english: cw[1],
        pos,
        article,
        exampleGerman: cw[4] || undefined,
        exampleEnglish: cw[5] || undefined,
      };
    }),
  };
}
