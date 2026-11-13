/**
 * 9th class (PTB) Smart Syllabus exclusions for the current session (2026-27).
 *
 * IMPORTANT: The excluded topics are intentionally NOT removed from
 * nineTopicChapters.json. They stay in the syllabus data so they can be used again
 * next year. This file only marks them as unavailable for the current session.
 *
 * Behaviour driven by this list:
 * - group/topic names get a red strike-through in the chapter picker
 * - their checkboxes are disabled
 * - "Select All Chapters" and whole-chapter selection skip them
 * - they are stripped from saved-paper restores and question-bank requests
 */

import type { ChapterGroup } from "./subjectData";

type SubjectExclusion = {
  /** Entire chapter groups that are out of syllabus this year. */
  groups?: string[];
  /** Individual topics that are out of syllabus inside otherwise available groups. */
  topics?: string[];
};

// NEXT YEAR: empty this object (or remove the relevant entries) to make every topic
// selectable again. Do not remove topics from nineTopicChapters.json.
const EXCLUSIONS: Record<string, SubjectExclusion> = {
  "اسلامیات لازمی-9TH-PTB": {
    groups: [
      "باب ہفتم: اسلامی تعلیمات اور عصر حاضر کے تقاضے",
    ],
    topics: [
      "4.3 اخلاص و تقوی",
      "4.4 پردہ پوشی",
      "4.7 جھوٹ",
      "4.8 غیبت اور بہتان",
      "4.9 جادو،فال اور توہم پرستی",
      "5.1 قسم کے احکام و مسائل",
      "5.5 اسلامی ریاست",
      "6.4 حضرت عبداللہ بن عمروبن العاص رضی اللہ تعالیٰ عنھما",
      "6.5 حضرت عمرو بن امیہ رضی اللہ تعالیٰ عنہ",
      "6.7 حضرت جابر بن عبداللہ رضی اللہ تعالیٰ عنہ",
    ],
  },
  "English-9TH-PTB": {
    groups: [
      "UNIT 5: Women Empowerment through Entrepreneurship",
      "UNIT 8: Globalisation's Impact on Culture and Economy",
      "UNIT 10: The Silent Predator and the Majestic Prey-Snow Leopard and Markhor",
    ],
  },
  "اردو لازمی-9TH-PTB": {
    groups: [
      "نثر نمبر 7: ابتدائی حساب",
      "نثر نمبر 9: بھیڑیا",
      "نظم نمبر 6: کرکٹ اور مشاعرہ",
      "غزل نمبر 2: سن تو سہی جہاں میں ہے تیرا افسانہ کیا",
    ],
  },
  "Mathematics-9TH-PTB": {
    groups: [
      "UNIT 8: Logic",
    ],
    topics: [
      "Exercise 1.3",
      "Exercise 2.4",
      "Exercise 3.3",
      "Exercise 4.4",
      "Exercise 5.2",
      "Exercise 6.6",
      "Exercise 7.3",
      "Exercise 9.4",
      "Exercise 10.2",
      "Exercise 11.2",
    ],
  },
  "Biology-9TH-PTB": {
    groups: [
      "CHAP 11: Biostatistics",
    ],
    topics: [
      "1.2 Relation of Biology With Other Sciences",
      "1.3 Careers in Biology",
      "1.5 Science as a Collaborative Field",
      "1.8 Malaria-An Example of Biological Method",
      "4.4 Comparison between Meiosis and Mitosis",
      "3.3 STRUCTURAL ADVANTAGES OF PLANT AND ANIMAL CELLS",
    ],
  },
  "Physics-9TH-PTB": {
    topics: [
      "1.6 Mass Measuring Instruments",
      "1.7 Time Measuring Instruments",
      "1.8 Volume Measuring Instruments",
      "1.10 Uncertainity in a Measurement",
      "1.12 Precision and Accuracy",
      "2.3 Types of Motion",
      "2.8 Gradient of a Distance-Time Graph",
      "2.10 Gradient of a Speed-Time Graph",
      "3.2 Fundamental Forces",
      "3.3 Forces in a Free- Body Diagram",
      "3.5 Limitations of Newton’s Laws of Motion",
      "3.7 Mechanical and Electronic Balances",
      "4.7 Centre of Gravity and Centre of Mass",
      "4.11 Improvement of Stability",
      "5.4 Sources of Energy",
      "5.6 The Advantages and Disadvantages of methods of Energy production",
      "6.7 Measurement of Atmospheric Pressure",
      "6.8 Measurement of Pressure by Manometer",
      "7.1 Kinetic Molecular Theory of Matter",
      "7.4 Sensitivity, Range and Linearity of Thermometers",
      "7.5 Structure of A Liquid-in-Glass Thermometer",
      "8.8 Domain Theory of Magnetism",
      "8.10 Applications of Magnets in Recording Technology",
      "8.11 Soft Iron as Magnetic Shield",
      "9.4 Interdisciplinary Research",
      "9.6 Scientific Base of Technology and Engineering",
    ],
  },
  "Chemistry-9TH-PTB": {
    groups: [
      "CHAP 12: Empirical Data Collection and Analysis",
      "CHAP 13: Laboratory and Practical Skills",
    ],
    topics: [
      "1.2 States of Matter",
      "1.4 Allotropic Forms of Substances",
      "1.8 Effect of Temperature on the Solubility of Solutes",
      "2.3 Isotopes and their Masses",
      "2.3.1 Radioactive Isotopes",
      "2.3.2 Applications of Radioactive Isotopes",
      "2.3.3 Ionization of Atom By a Radioactive Source",
      "3.6 Compare the properties of ionic and covalent compounds",
      "3.8 Nature of Bonding and Properties",
      "6.3 Changes the Physical Conditions of a Chemical Reaction",
      "7.5 Acid Rain and its Effects",
      "8.5 Metallic Character and Reactivity",
      "9.5 Physical Properties of Metals and Non-metals",
      "10.4 Global Warming (Greenhouse Effect)",
      "10.5 Strategies to Reduce Environmental Issues",
      "11.4 Important Reactions",
    ],
  },
};

// Ignore diacritics, punctuation and spacing so minor spelling/spacing differences
// between this list and the syllabus data still match.
const normalizeExclusionKey = (value: string): string =>
  (value || "")
    .normalize("NFC")
    .replace(/[\p{M}\p{Cf}]/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .toLowerCase();

const toKeySet = (values?: string[]): Set<string> =>
  new Set((values ?? []).map(normalizeExclusionKey).filter(Boolean));

const getSubjectExclusions = (
  subject: string,
  className: string,
  board: string,
): SubjectExclusion | null => {
  if (className !== "9TH" || board !== "PTB") return null;
  const actualSubject = (subject || "").split("||")[0].trim();
  return EXCLUSIONS[`${actualSubject}-${className}-${board}`] ?? null;
};

const makeSelectionKey = (groupName: string, chapter: string) => `${groupName}::${chapter}`;

export type SmartSyllabusGroupInfo = {
  /** The whole group/chapter is out of syllabus. */
  groupExcluded: boolean;
  /** The group itself or at least one of its topics is out of syllabus. */
  hasExclusions: boolean;
  /** Topics that may still be selected in this group. */
  selectableChapters: string[];
  /** True when a specific topic is unavailable. */
  isChapterExcluded: (chapter: string) => boolean;
};

export const getSmartSyllabusGroupInfo = (
  subject: string,
  className: string,
  board: string,
  group: ChapterGroup,
): SmartSyllabusGroupInfo => {
  const exclusions = getSubjectExclusions(subject, className, board);
  if (!exclusions) {
    return {
      groupExcluded: false,
      hasExclusions: false,
      selectableChapters: [...group.chapters],
      isChapterExcluded: () => false,
    };
  }

  const excludedGroups = toKeySet(exclusions.groups);
  const excludedTopics = toKeySet(exclusions.topics);
  const groupExcluded = excludedGroups.has(normalizeExclusionKey(group.name));

  const isChapterExcluded = (chapter: string) =>
    groupExcluded || excludedTopics.has(normalizeExclusionKey(chapter));

  const selectableChapters = group.chapters.filter((chapter) => !isChapterExcluded(chapter));

  return {
    groupExcluded,
    hasExclusions: groupExcluded || selectableChapters.length !== group.chapters.length,
    selectableChapters,
    isChapterExcluded,
  };
};

/**
 * Every selection key that is allowed for the subject. Used by "Select All Chapters"
 * and when opening a saved paper so unavailable topics can never be included.
 */
export const getSelectableSelectionKeys = (
  subject: string,
  className: string,
  board: string,
  groups: ChapterGroup[],
): string[] => {
  const result: string[] = [];
  const seen = new Set<string>();
  const add = (value: string) => {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  };

  groups.forEach((group) => {
    const info = getSmartSyllabusGroupInfo(subject, className, board, group);
    if (info.groupExcluded) return;

    if (group.chapters.length === 0) {
      add(group.name);
      return;
    }

    if (info.hasExclusions) {
      // A partially excluded group cannot use the group header alone -- the backend
      // would treat that as "fetch the whole chapter" and include excluded topics.
      info.selectableChapters.forEach((chapter) => add(makeSelectionKey(group.name, chapter)));
      return;
    }

    add(group.name);
    group.chapters.forEach((chapter) => add(makeSelectionKey(group.name, chapter)));
  });

  return result;
};

/**
 * Removes/strips unavailable topics from an arbitrary selection list. This is the
 * final safety net for saved papers, old state and any other code path.
 */
export const sanitizeChapterSelections = (
  subject: string,
  className: string,
  board: string,
  groups: ChapterGroup[],
  selections: string[],
): string[] => {
  const exclusions = getSubjectExclusions(subject, className, board);
  if (!exclusions || groups.length === 0 || selections.length === 0) {
    return [...selections];
  }

  const groupInfos = groups.map((group) => ({
    group,
    info: getSmartSyllabusGroupInfo(subject, className, board, group),
  }));

  const findGroupByName = (name: string) =>
    groupInfos.find(({ group }) => group.name === name) ??
    groupInfos.find(({ group }) => normalizeExclusionKey(group.name) === normalizeExclusionKey(name));

  const findGroupForChapter = (chapter: string) =>
    groupInfos.find(({ group }) => group.chapters.includes(chapter)) ??
    groupInfos.find(({ group }) =>
      group.chapters.some((item) => normalizeExclusionKey(item) === normalizeExclusionKey(chapter)),
    );

  const result: string[] = [];
  const seen = new Set<string>();
  const add = (value: string) => {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  };

  selections.forEach((selection) => {
    if (!selection) return;

    const directGroup = findGroupByName(selection);
    if (directGroup) {
      const { group, info } = directGroup;
      if (info.groupExcluded) return;

      if (group.chapters.length === 0) {
        add(group.name);
        return;
      }

      if (info.hasExclusions) {
        info.selectableChapters.forEach((chapter) => add(makeSelectionKey(group.name, chapter)));
        return;
      }

      add(group.name);
      group.chapters.forEach((chapter) => add(makeSelectionKey(group.name, chapter)));
      return;
    }

    const separator = selection.indexOf("::");
    if (separator >= 0) {
      const groupName = selection.slice(0, separator);
      const chapter = selection.slice(separator + 2);
      const target = findGroupByName(groupName);
      if (!target) {
        add(selection);
        return;
      }
      if (target.info.groupExcluded || target.info.isChapterExcluded(chapter)) return;
      add(makeSelectionKey(target.group.name, chapter));
      return;
    }

    const bareGroup = findGroupForChapter(selection);
    if (!bareGroup) {
      add(selection);
      return;
    }
    if (bareGroup.info.groupExcluded || bareGroup.info.isChapterExcluded(selection)) return;
    add(makeSelectionKey(bareGroup.group.name, selection));
  });

  return result;
};
