import type { ChapterGroup } from "./subjectData";
import topicData from "./oneToEightTopicChapters.json";

const oneToEightMap = topicData as Record<string, ChapterGroup[]>;

const ONE_TO_EIGHT_CLASSES = new Set(["ONE", "TWO", "THREE", "FOUR", "5TH", "6TH", "7TH", "8TH"]);

export const getOneToEightChapters = (
  subject: string,
  className: string,
  board: string,
): ChapterGroup[] | null => {
  if (board !== "PTB" || !ONE_TO_EIGHT_CLASSES.has(className)) return null;
  const key = `${subject}-${className}-PTB`;
  const groups = oneToEightMap[key];
  return groups && groups.length > 0 ? groups : null;
};
