/**
 * 9th class and INTER-I (11th / Part 1) PTB Smart Syllabus exclusions for the
 * current session (2026-27).
 *
 * IMPORTANT: The excluded topics are intentionally NOT removed from the syllabus
 * data (nineTopicChapters.json / subjectData.ts). They stay there so they can be
 * used again next year. This file only marks them as unavailable for the current
 * session.
 *
 * Behaviour driven by this list:
 * - group/topic names get a red strike-through in the chapter picker
 * - their checkboxes are disabled
 * - "Select All Chapters" and whole-chapter selection skip them
 * - they are stripped from saved-paper restores and question-bank requests
 * - a per-paper "Enable All (Full Syllabus)" toggle bypasses every cut above
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
  "اردو لازمی-INTER-I-PTB": {
    groups: [
      "نثر نمبر5: چار پائی",
      "نثر نمبر10: پاکستانی زبانیں اور ان کا باہمی رشتہ",
      "غزل نمبر1: پتا پتا بُو ٹا بُوٹا حال ہمارا جانے ہے",
      "نظم نمبر7: کھڑا ڈنر",
    ],
  },
  "English-INTER-I-PTB": {
    groups: [
      "UNIT 4: Team Moon",
      "UNIT 7: What You Do is What You Are",
      "UNIT 9: Freedom (Poem)",
      "UNIT 12: The Impact of AI on Society, Human Relationships, and Ethics",
    ],
  },
  "Physics-INTER-I-PTB": {
    topics: [
      "1.1 Physical Quantities And Their Units",
      "1.2 International System Of Units",
      "2.1 Scalars",
      "2.10 Elastic Collision In Two Dimensions",
      "2.11 Inelastic Collision In Two Dimensions",
      "4.1 Work Done by a Constant Force",
      "4.5 Energy",
      "5.1 Classification of Solids",
      "5.4 Determination of Young's Modulus of a Wire",
      "5.10 Increase in Flow Velocity",
      "5.15 Real Fluids are Viscous Fluids",
      "5.16 Superfluids",
      "6.1 Assumptions of the Kinetic Theory of Gases",
      "6.6 Heat Engine",
      "7.1 Waves",
      "7.4 Stationary Waves & Their Formation",
      "8.2 Types of Polarization",
      "9.7 Motion of Charged Particles in A Uniform Electric Field",
      "9.8 Path of a Charged Particle",
      "9.9 Shielding From External Electric Field",
      "9.19 Use of Galvanometer",
      "10.3 Magnetic Flux Linkage",
      "10.5 Velocity Selector",
      "10.7 Lenz's Law And Direction of Induced EMF",
      "11.5 Space-time in Relativity",
      "12.8 Conservation Laws",
      "12.10 Most of the Matter in the Observable Universe in Plasma",
      "12.11 The Theories about the Forces between the Masses of Particles",
      "12.12 The Standard Model",
    ],
  },
  "Chemistry-INTER-I-PTB": {
    groups: [
      "CHAP 15: Basic Separation Techniques",
      "CHAP 16: Lab Safety and Practical Skills",
    ],
    topics: [
      "1.1 Historical Background",
      "1.2 Modern Periodic Table - Main Features",
      "1.4 Blocks In Periodic Table",
      "1.5 Families In Periodic-Table",
      "2.7 Electronic Configuration And The Periodic Table",
      "2.8 Electronic Configuration Of Ions And Free Radicals",
      "2.9 Electronic Configuration And The Formation Of Semiconductors",
      "3.1 Types Of Bonding",
      "3.4 Bond Energy And Bond Length",
      "3.5 A Comparison Among Ionic, Covalent, Metallic Bonds And Intermolecular Forces",
      "4.7 Limiting and Excess Reactant",
      "4.9 Importance Of Stoichiometry In Production And Dosage Of Medicine",
      "5.10 Energetics of Phase Changes",
      "5.11 Solids",
      "6.11 Entropy",
      "6.12 The Free Energy Change,△G",
      "7.5 Determination of Rate Constant",
      "7.6 Reaction Mechanism",
      "8.3 Relation Between Macroscopic And Microscopic Events",
      "8.4 Dynamic Equilibrium Between Two Physical States",
      "8.5 Conditions for Equilibrium",
      "8.9 Relationship Between Various Equilibrium Constant",
      "8.16 Industrial Application of Chemical Equilibrium",
      "9.1 Bronsted-Lowry Concept",
      "9.2 Lewis Concept of Acids And Bases",
      "9.9 Salt Hydrolysis",
      "9.10 Acid-Base Indicators",
      "10.8 Mass of a Substance Deposited During Electrolysis",
      "10.9 Amount of Substance Produced During Electrolysis",
      "10.10 Avogadro's Constant By The Electrolytic Method",
      "10.16 Applications of E Values",
      "10.17 Variation of E With Ion Concentration",
      "10.18 Nernst Equation",
      "10.19 Activity Series of Metals",
      "10.20 Feasibility of Redox Reactions From Activity Series or Reaction data",
      "10.22 Winkler Method, BOD And Do",
      "11.9 Conjugated Dienes",
      "11.10 Isomerism",
      "11.11 Organic Redox Reaction",
      "12.12 Role of Sulfur in Organic Synthesis",
      "12.13 Sulfuric Acid",
      "13.6 Relative Thermal Stabilities of Hydrogen Halides in Terms of Their Bond Strength",
      "13.7 Relative Reacitivity of Halide Ions As Reducing Agents",
      "13.8 Reactions of Halides With Aqueous Silver Ion Followed By Aqueous Ammonia",
      "13.9 Reactions of Halides (x) With Concentrated Sulfuric Acid",
      "13.10 Reactions of Chlorine With Cold And Hot Aqueous Sodium Hydroxide",
      "14.7 Greenhouse Effect and Global Warming",
      "14.8 Air Quality",
      "14.9 Air Quality And Human Health",
      "14.10 Air Pollution and Health Risk",
      "14.11 Methods & Techniques To Measure & Monitor Air Quality",
      "14.12 Experiments And Data Collection To Test Hypothesis About Air Quality",
      "14.13 Analyze Data And Interpret Air Quality",
      "14.14 Strategies Used to Reduce Air Pollution",
      "14.15 Laws and Regulations Related To Atmosphere",
      "14.16 Economic, Social & Political Issues",
    ],
  },
  "Biology-INTER-I-PTB": {
    groups: [
      "CHAP 7: Structural Biology",
    ],
    topics: [
      "1.2 Taxonomi Hierarchy",
      "1.5 Classification Of Vertebrates",
      "1.6 Classification Of Viruses",
      "1.7 Biodiversity",
      "1.8 Species And Speciation",
      "2.3 Motility In Bacteria",
      "2.5 Bacteria: Ecology And Diversity",
      "2.6 Importance Of Bacteria",
      "3.1 Cells-the Basic unit of Life",
      "3.2 Cell Theory",
      "3.3 Microscopy",
      "4.1 Biological Molecules",
      "4.2 Types of Bonds in Biology",
      "4.3 Condensation (Synthesis) and Hydrolysis",
      "5.4 Factors Affecting the Rate of Enzyme Action",
      "6.3 Photorespiration",
      "8.1 Nutrition In Plants",
      "8.3 Support in Plants",
      "8.4 Water Potential",
      "9.1.9 Storage and Metabolic Role of the Liver",
      "10.2 Transport of Gases",
      "11.2 Blood Vessels",
      "11.4 Cardiovascular Disorders",
      "12.2 Disorders of Skeletal System",
    ],
  },
  "Computer-INTER-I-PTB": {
    topics: [
      "1.5 Graphical-Representation of Software Systems",
      "2.8 Object-Oriented Programming in Python",
      "2.9 Advanced Python Concepts",
      "2.10 Testing and Debugging in Python",
      "5.3 Building Statistical Models",
      "6.4 Introduction to Blockchain Technology",
      "6.5 Applications and Implications of Blockchain",
      "7.3 The Digital Divide and Its Impacts",
      "9.5 Financial Concepts for Business",
    ],
  },
  "Mathematics-INTER-I-PTB": {
    groups: [
      "UNIT 8: Mathematical induction and Binomial Theorem",
    ],
    topics: [
      "E.x: 6.8",
      "E.x: 6.11",
      "E.x: 11.2",
      "E.x: 12.3",
      "E.x: 13.3",
      "E.x: 14.4",
      // The DB chapter list names the same topics "Exercise X.Y"; keep both spellings
      // so the exclusion works whether the picker is showing DB or static chapters.
      "Exercise 6.8",
      "Exercise 6.11",
      "Exercise 11.2",
      "Exercise 12.3",
      "Exercise 13.3",
      "Exercise 14.4",
    ],
  },
  "اسلامیات لازمی-INTER-I-PTB": {
    topics: [
      "4.3 معاشرتی تعلقات کے اخلاقی وآداب",
      "5.2 وراثت کی اسلامی تعلیمات",
      "6.3 صوفیہ کرامؒ(پیر سید علی شاہؒ، میاں شیر محمد شرقپوریؒ)",
      "7.2 نظام اسلام کی نشاۃ ثانیہ اور مسلمانوں کی ذمہ داریاں",
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

// Classes that follow the current session's Smart Syllabus (9th + INTER-I/11th).
const SMART_SYLLABUS_CLASSES = new Set(["9TH", "INTER-I"]);

const getSubjectExclusions = (
  subject: string,
  className: string,
  board: string,
): SubjectExclusion | null => {
  if (!SMART_SYLLABUS_CLASSES.has(className) || board !== "PTB") return null;
  const actualSubject = (subject || "").split("||")[0].trim();
  return EXCLUSIONS[`${actualSubject}-${className}-${board}`] ?? null;
};

/**
 * True when this subject/class/board has any Smart Syllabus cut. The chapter picker
 * uses this to decide whether the "Enable All (Full Syllabus)" toggle is worth
 * showing at all.
 */
export const hasSmartSyllabusExclusions = (
  subject: string,
  className: string,
  board: string,
): boolean => {
  const exclusions = getSubjectExclusions(subject, className, board);
  return Boolean(
    exclusions &&
      ((exclusions.groups?.length ?? 0) > 0 || (exclusions.topics?.length ?? 0) > 0),
  );
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
  includeExcluded = false,
): SmartSyllabusGroupInfo => {
  const exclusions = getSubjectExclusions(subject, className, board);
  if (includeExcluded || !exclusions) {
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
  includeExcluded = false,
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
    const info = getSmartSyllabusGroupInfo(subject, className, board, group, includeExcluded);
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
  includeExcluded = false,
): string[] => {
  const exclusions = getSubjectExclusions(subject, className, board);
  if (includeExcluded || !exclusions || groups.length === 0 || selections.length === 0) {
    return [...selections];
  }

  const groupInfos = groups.map((group) => ({
    group,
    info: getSmartSyllabusGroupInfo(subject, className, board, group, includeExcluded),
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
