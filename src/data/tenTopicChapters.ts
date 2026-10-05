import type { ChapterGroup } from "./subjectData";

import tenTopicChaptersMapData from "./tenTopicChapters.json";

const tenTopicChaptersMap: Record<string, ChapterGroup[]> | null = tenTopicChaptersMapData as unknown as Record<string, ChapterGroup[]>;

const SYLLABUS_ALIASES: Record<string, string> = {
  "Civics-10TH-PTB": "Civics-10TH-PTB",
};

export const getTenTopicChapters = (
  subject: string,
  className: string,
  board: string,
): ChapterGroup[] | null => {
  if (className !== "10TH" || board !== "PTB") return null;
  const key = `${subject}-${className}-${board}`;
  const resolvedKey = SYLLABUS_ALIASES[key] || key;
  const groups = tenTopicChaptersMap?.[resolvedKey];
  return groups && groups.length > 0 ? groups : null;
};
