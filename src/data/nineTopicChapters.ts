import type { ChapterGroup } from "./subjectData";
import topicData from "./nineTopicChapters.json";

const nineTopicChaptersMap = topicData as Record<string, ChapterGroup[]>;

const SYLLABUS_ALIASES: Record<string, string> = {
  "Civics-9TH-PTB": "علم شہریت-9TH-PTB",
};

export const getNineTopicChapters = (
  subject: string,
  className: string,
  board: string,
): ChapterGroup[] | null => {
  if (className !== "9TH" || board !== "PTB") return null;
  const key = `${subject}-${className}-${board}`;
  const resolvedKey = SYLLABUS_ALIASES[key] || key;
  const groups = nineTopicChaptersMap[resolvedKey];
  return groups && groups.length > 0 ? groups : null;
};

export default nineTopicChaptersMap;
