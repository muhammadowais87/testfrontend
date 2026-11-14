import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addSavedPaper, getSavedPaperById, type SavedPaperRecord } from "@/lib/savedPapers";
import { Menu, X, Home, LogOut, ChevronLeft, GraduationCap, List, PencilLine, Save, Printer, Shuffle, Trash2, ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useIsMobile, isMobileViewport } from "@/hooks/use-mobile";
import {
  fetchChapterGroupsForSelection,
  fetchQuestionsForSelection,
  fetchAvailableQuestionTypes,
  type PaperQuestion,
  type QuestionContentType,
  type QuestionTypeOption,
  buildPriorityOptions,
} from "@/lib/questionBank";
import { useTeacherSessionStore } from "@/stores/teacherSessionStore";
import {
  afaqCards, boardClassMap, boardCards, boardSubjectsMap, getChaptersForSubject, type ChapterGroup,
} from "@/data/subjectData";
import { getNineTopicChapters } from "@/data/nineTopicChapters";
import {
  getSelectableSelectionKeys,
  getSmartSyllabusGroupInfo,
  hasSmartSyllabusExclusions,
  sanitizeChapterSelections,
} from "@/data/nineSmartSyllabusExclusions";
import { getOneToEightChapters } from "@/data/oneToEightChapters";
import { getAvailableQuestionTypesForTopics } from "@/data/topicQuestionTypes";
import SubjectButton from "@/components/SubjectButton";
import DualMediumQuestion from "@/components/DualMediumQuestion";
import { getQuestionStems, mergeMcqOptions, sanitizeOptionValue, splitVerseText, isComprehensionType, groupComprehensionSets } from "@/lib/questionDisplay";

const isUrdu = (text: string) => /[\u0600-\u06FF]/.test(text);
// Strip a leading "<number>. " or "<number>۔ " prefix embedded in stored question text.
// Requires an actual punctuation mark AND a trailing space after the digits, so genuine
// numeric content at the start of a sentence is left alone: "186000 seconds..." has no
// punctuation after the number, and a decimal like "2574.32 kg" has the period
// immediately followed by more digits, not a space.
const stripLeadingNumber = (text: string) => text.replace(/^\d+[.。،۔]\s+/, "").trim();

const defaultQuestionTypeOptions: QuestionTypeOption[] = [
  { value: "mcq", label: "Multiple Option (متعدد انتخابی)" },
  { value: "short", label: "Short Questions (مختصر سوالات)" },
  { value: "long", label: "Long Questions (تفصیلی سوالات)" },
];
const english10thQuestionTypeOptions: QuestionTypeOption[] = [
  { value: "questions_answers", label: "Questions and answers" },
  { value: "tick_correct_grammar", label: "Tick correct according to grammer" },
  { value: "tick_correct_spelling", label: "Tick correct spelling" },
  { value: "correct_meaning_underlined", label: "correct meaning of underlined word" },
  { value: "translate_urdu_paragraph", label: "translate into urdu paragraph" },
];
const allPossibleQuestionTypeOptions: QuestionTypeOption[] = [
  // Basic types
  { value: "mcq", label: "Multiple Option (متعدد انتخابی)" },
  { value: "short", label: "Short Questions (مختصر سوالات)" },
  { value: "long", label: "Long Questions (تفصیلی سوالات)" },
  // Grammar & Language
  { value: "grammar", label: "Grammar (گرائمر)" },
  { value: "ilfaz_ko_jumlo_mein_istamal", label: "Idioms in Sentences (محاورات / الفاظ کا جملوں میں استعمال)" },
  { value: "words_into_sentences", label: "Use Words in Sentences (الفاظ کا جملوں میں استعمال)" },
  { value: "words_meanings", label: "Words Meanings (الفاظ و معنی)" },
  { value: "ilfaz_maani", label: "Words Meanings / Ilfaz Maani (الفاظ و معنی)" },
  { value: "jumlo_ki_darustagi", label: "Correction of Sentences (جملوں کی درستگی)" },
  { value: "jumlo_ki_takmeel", label: "Completion of Sentences (جملوں کی تکمیل)" },
  { value: "wahid_jama", label: "Singular / Plural (واحد / جمع)" },
  { value: "muzakir_monas", label: "Masculine / Feminine (مذکر / مونث)" },
  { value: "ilfaz_mutazad", label: "Antonyms (الفاظ / متضاد)" },
  { value: "ilfaz_mutaradif", label: "Synonyms (الفاظ / مترادف)" },
  { value: "araab_lagaein", label: "Put Araab (اعراب لگائیں)" },
  { value: "fill_in_tha_blanks", label: "Fill in the Blanks (خالی جگہ پر کریں)" },
  { value: "khali_jaga_pur_karein", label: "Fill in the Blanks / Khali Jaga (خالی جگہ پُر کریں)" },
  { value: "ideoms", label: "Idioms (محاورات)" },
  // English-specific types
  { value: "tick_correct_spellings", label: "Tick Correct Spellings (درست ہجے کا انتخاب)" },
  { value: "correct_meaning_of_underline_word", label: "Correct Meaning of Underlined Word (خط کشیدہ الفاظ کے درست معنی)" },
  { value: "tick_correct_form_of_verb", label: "Tick Correct Form of Verb (فعل کی درست حالت کا انتخاب)" },
  { value: "tick_correct_according_to_grammer", label: "Tick Correct According to Grammar (گرائمر کے مطابق درست انتخاب)" },
  { value: "active_and_passive_voice", label: "Active & Passive Voice (فعال اور مجہول آواز)" },
  { value: "direct_and_indirect", label: "Direct & Indirect (بلاواسطہ اور بالواسطہ)" },
  { value: "pair_of_words", label: "Pair of Words (الفاظ کے جوڑے)" },
  { value: "punctuate_the_paragraph", label: "Punctuate the Paragraph (رموزِ اوقاف)" },
  // Writing & Composition
  { value: "letters", label: "Letters (خطوط)" },
  { value: "stories", label: "Stories (کہانیاں)" },
  { value: "summary", label: "Summary (خلاصہ)" },
  { value: "dialoges", label: "Dialogues (مکالمے)" },
  { value: "mukalmy", label: "Mukalmy / Dialogues (مکالمے)" },
  { value: "darkhaastein", label: "Applications (درخواستیں)" },
  { value: "writing_paragraphs", label: "Writing Paragraphs (پیراگراف نویسی)" },
  // Reading Comprehension
  { value: "comprehension_paragraph", label: "Comprehension Paragraph (تفہیمی پیرا گراف)" },
  { value: "tafheem_ibarat", label: "Comprehension of Passage (تفہیم عبارت)" },
  // Poetry & Literature
  { value: "ashaar_ki_tashreeh", label: "Explanation of Verses (اشعار کی تشریح)" },
  { value: "ashar_ki_tashreeh", label: "Explanation of Verses / Ashar (اشعار کی تشریح)" },
  { value: "paragraph_ki_tashreeh", label: "Explanation of Paragraph (پیراگراف کی تشریح)" },
  { value: "poem_stanzas", label: "Poem Stanzas (نظم کے بند)" },
  { value: "markazi_khayal", label: "Central Idea (مرکزی خیال)" },
  // Translation
  { value: "farsi_tarjuma", label: "Translation (ترجمہ)" },
  { value: "translate_into_urdu_paragraph", label: "Translate into Urdu Paragraph (اردو میں ترجمہ)" },
  { value: "translate_into_english_paragraphs", label: "Translate into English Paragraphs (انگریزی میں ترجمہ)" },
  { value: "tenses_translation", label: "Translate into English (انگریزی میں ترجمہ)" },
  // Q&A
  { value: "questions_answers", label: "Questions & Answers (سوالات و جوابات)" },
  // Classes 1-8 specific types
  { value: "essays", label: "Essay Writing (مضمون نویسی)" },
  { value: "match_columns", label: "Match Columns (کالم ملائیں)" },
  { value: "true_false_statements", label: "True / False Statements (صحیح / غلط)" },
  { value: "pointing", label: "Pointing (اشارہ)" },
  { value: "homophones", label: "Homophones (ہم آواز الفاظ)" },
  { value: "genders", label: "Genders (مذکر / مونث)" },
  { value: "sabqe_lahqe", label: "Sabqe Lahqe (سابقے لاحقے)" },
  { value: "missing_letters", label: "Missing Letters (خالی حروف)" },
  { value: "translate_into_urdu_sentences", label: "Translate into Urdu Sentences (جملوں کا ترجمہ)" },
  { value: "zarb_ul_imsal", label: "Zarb ul Imsal (ضرب الامثال)" },
  { value: "zarb_ul_misaal", label: "Zarb ul Misaal (ضرب المثال)" },
  // Islamic Studies
  { value: "ayaat", label: "Ayat (آیاتِ مبارکہ)" },
  { value: "hadith", label: "Hadith (حدیث مبارکہ)" },
  { value: "ahadees", label: "Ahadees (احادیث مبارکہ)" },
  { value: "shakhsiyat", label: "Personalities (شخصیات)" },
  { value: "shakhsiyaat", label: "Personalities / Shakhsiyaat (شخصیات)" },
  // 1st year Urdu specific types
  { value: "takhlees_ibarat", label: "Takhlees Ibarat / Summary of Passage (تلخیص عبارت)" },
  { value: "history", label: "Reports / Essays (رداد و مضامین)" },
  { value: "receipt", label: "Receipts (رسیدیں)" },
  { value: "newsletters", label: "Newsletters / Diaries (روزنامچے)" },
  // 1st year English specific types
  { value: "tick_correct_synonyms", label: "Tick Correct Synonyms (درست مترادف کا انتخاب)" },
  { value: "vitals", label: "Vitals / Poet-Chapter Pairs (شخصیات)" },
];
type WorkspaceQuestionType = "mcq" | "short" | "long";
type EditedQuestion = { text: string; urdu: string; contentType?: WorkspaceQuestionType; chapterPart?: string | null };
const inferContentType = (id: number, text: string): WorkspaceQuestionType => {
  const normalized = Math.abs(id) % 100000;
  if (normalized >= 10000 && normalized < 20000) return "mcq";
  if (normalized >= 20000 && normalized < 30000) return "short";
  if (normalized >= 30000 && normalized < 40000) return "long";
  if (id >= 100 && id < 200) return "mcq";
  if (id >= 200) return "long";
  return /\([A-D]\)/.test(text) ? "mcq" : "short";
};

// "Each Q Marks" needs fractional marks (0.5, 1.5) -- keep one decimal point and
// at most two decimal places, while still rejecting letters and extra dots.
const sanitizeDecimalInput = (value: string): string => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  const singleDot = firstDot === -1
    ? cleaned
    : cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
  const withLeadingZero = singleDot.startsWith(".") ? `0${singleDot}` : singleDot;
  const [whole, fraction] = withLeadingZero.split(".");
  return fraction === undefined ? whole : `${whole}.${fraction.slice(0, 2)}`;
};

// Avoid floating-point noise in totals (e.g. 0.1 * 3 = 0.30000000000000004).
const roundMarks = (value: number): number => Math.round(value * 100) / 100;
const formatMarks = (value: number): string => String(roundMarks(value));

// PTB 9th, 10th and 1st Year -- these use the DB's per-topic data as the source of truth
// for the question-type dropdown.
const isTopicScopedPtbClass = (board: string | null, level: string | null) =>
  board === "PTB" && ["9TH", "10TH", "INTER-I", "INTER-II"].includes(level || "");

const getProfessionalQuestionTypeLabel = (value: string, fallbackLabel: string): string => {
  const normalizedValue = value.toLowerCase().trim();
  const labelMap: Record<string, string> = {
    mcq: "Multiple Option (متعدد انتخابی)",
    mcqs: "Multiple Option (متعدد انتخابی)",
    short: "Short Questions (مختصر سوالات)",
    long: "Long Questions (تفصیلی سوالات)",
    question_and_answers: "Questions & Answers (سوالات و جوابات)",
    questions_answers: "Questions & Answers (سوالات و جوابات)",
    tick_correct_spellings: "Tick Correct Spellings (درست ہجے کا انتخاب)",
    tick_correct_spelling: "Tick Correct Spellings (درست ہجے کا انتخاب)",
    correct_meaning_of_underline_word: "Correct Meaning of Underlined Word (خط کشیدہ الفاظ کے درست معنی)",
    correct_meaning_underlined: "Correct Meaning of Underlined Word (خط کشیدہ الفاظ کے درست معنی)",
    tick_correct_form_of_verb: "Tick Correct Form of Verb (فعل کی درست حالت کا انتخاب)",
    tick_correct_according_to_grammer: "Tick Correct According to Grammar (گرائمر کے مطابق درست انتخاب)",
    tick_correct_grammar: "Tick Correct According to Grammar (گرائمر کے مطابق درست انتخاب)",
    letters: "Letters (خطوط)",
    active_and_passive_voice: "Active & Passive Voice (فعال اور مجہول آواز)",
    stories: "Stories (کہانیاں)",
    summary: "Summary (خلاصہ)",
    dialoges: "Dialogues (مکالمے)",
    translate_into_urdu_paragraph: "Translate into Urdu Paragraph (اردو میں ترجمہ)",
    translate_urdu_paragraph: "Translate into Urdu Paragraph (اردو میں ترجمہ)",
    translate_into_english_paragraphs: "Translate into English Paragraphs (انگریزی میں ترجمہ)",
    tenses_translation: "Translate into English (انگریزی میں ترجمہ)",
    comprehension_paragraph: "Comprehension Paragraph (تفہیمی پیرا گراف)",
    poem_stanzas: "Poem Stanzas (نظم کے بند)",
    ideoms: "Idioms (محاورات)",
    words_meanings: "Words Meanings (الفاظ و معنی)",
    fill_in_tha_blanks: "Fill in the Blanks (خالی جگہ پر کریں)",
    direct_and_indirect: "Direct & Indirect (بلاواسطہ اور بالواسطہ)",
    pair_of_words: "Pair of Words (الفاظ کے جوڑے)",
    punctuate_the_paragraph: "Punctuate the Paragraph (رموزِ اوقاف)",
    writing_paragraphs: "Writing Paragraphs (پیراگراف نویسی)",
    mukalmy: "Dialogues (مکالمے)",
    ilfaz_ko_jumlo_mein_istamal: "Idioms in Sentences (محاورات / الفاظ کا جملوں میں استعمال)",
    ashaar_ki_tashreeh: "Explanation of Verses (اشعار کی تشریح)",
    ashar_ki_tashreeh: "Explanation of Verses (اشعار کی تشریح)",
    jumlo_ki_darustagi: "Correction of Sentences (جملوں کی درستگی)",
    jumlo_ki_takmeel: "Completion of Sentences (جملوں کی تکمیل)",
    markazi_khayal: "Central Idea (مرکزی خیال)",
    paragraph_ki_tashreeh: "Explanation of Paragraph (پیراگراف کی تشریح)",
    darkhaastein: "Applications (درخواستیں)",
    ilfaz_maani: "Words Meanings (الفاظ و معنی)",
    khali_jaga_pur_karein: "Fill in the Blanks (خالی جگہ پر کریں)",
    wahid_jama: "Singular / Plural (واحد / جمع)",
    muzakir_monas: "Masculine / Feminine (مذکر / مونث)",
    ilfaz_mutazad: "Antonyms (الفاظ / متضاد)",
    ilfaz_mutaradif: "Synonyms (الفاظ / مترادف)",
    araab_lagaein: "Put Araab (اعراب لگائیں)",
    hadith: "Hadith (حدیث مبارکہ)",
    ahadees: "Ahadees (احادیث مبارکہ)",
    shakhsiyat: "Personalities (شخصیات)",
    shakhsiyaat: "Personalities (شخصیات)",
    tafheem_ibarat: "Comprehension of Passage (تفہیم عبارت)",
    words_into_sentences: "Use Words in Sentences (الفاظ کا جملوں میں استعمال)",
    ayaat: "Ayat (آیاتِ مبارکہ)",
    essays: "Essay Writing (مضمون نویسی)",
    match_columns: "Match Columns (کالم ملائیں)",
    true_false_statements: "True / False Statements (صحیح / غلط)",
    pointing: "Pointing (اشارہ)",
    homophones: "Homophones (ہم آواز الفاظ)",
    genders: "Genders (مذکر / مونث)",
    sabqe_lahqe: "Sabqe Lahqe (سابقے لاحقے)",
    missing_letters: "Missing Letters (خالی حروف)",
    translate_into_urdu_sentences: "Translate into Urdu Sentences (جملوں کا ترجمہ)",
    zarb_ul_imsal: "Zarb ul Imsal (ضرب الامثال)",
    zarb_ul_misaal: "Zarb ul Misaal (ضرب المثال)",
    takhlees_ibarat: "Takhlees Ibarat / Summary of Passage (تلخیص عبارت)",
    history: "Reports / Essays (رداد و مضامین)",
    receipt: "Receipts (رسیدیں)",
    newsletters: "Newsletters / Diaries (روزنامچے)",
  };

  return labelMap[normalizedValue] || fallbackLabel;
};

const makeChapterKey = (groupName: string, chapter: string) => `${groupName}::${chapter}`;


const TeacherGeneratePaper = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const session = useTeacherSessionStore((s) => s.session);
  const logout = useTeacherSessionStore((s) => s.logout);
  const isSubUserPortal = session?.portalType === "sub-user";
  const basePath = isSubUserPortal ? "/sub-user" : "/teacher";
  const loginPath = "/teacher/login";
  // Desktop starts with its sidebar showing; on a phone the sidebar is an overlay and stays closed until the hamburger is tapped.
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobileViewport());
  // The page re-opens the sidebar after some actions (add to paper, cancel, ...). That is right on desktop,
  // but on a phone it would pop the overlay over the page, so there it only opens from the hamburger.
  const openSidebarOnDesktop = () => {
    if (!isMobileViewport()) setSidebarOpen(true);
  };
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  // When true, the chapter picker ignores the 9th-class Smart Syllabus cuts and
  // shows/selects every topic from the full syllabus. Off by default.
  const [enableFullSyllabus, setEnableFullSyllabus] = useState(false);
  const lastInitializedRef = useRef<{ key: string; isDb: boolean; isTopicsFile?: boolean } | null>(null);
  const [showQuestionSelection, setShowQuestionSelection] = useState(false);
  const [showPaperWorkspace, setShowPaperWorkspace] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [appliedQuestionType, setAppliedQuestionType] = useState("");
  const [dualMedium, setDualMedium] = useState("");
  const [appliedDualMedium, setAppliedDualMedium] = useState("dual");
  const [requiredQuestions, setRequiredQuestions] = useState("");
  const [eachQMarks, setEachQMarks] = useState("");
  const [ignoreQuestions, setIgnoreQuestions] = useState("");
  const [blankLines, setBlankLines] = useState("");
  const [blankLineType, setBlankLineType] = useState("1 LINE");
  const [questionPriorities, setQuestionPriorities] = useState<string[]>([]);
  const [twoQuestionsPerLine, setTwoQuestionsPerLine] = useState(false);
  const [appliedTwoQuestionsPerLine, setAppliedTwoQuestionsPerLine] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectionError, setSelectionError] = useState("");
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [availableDbTypes, setAvailableDbTypes] = useState<string[] | null>(null);
  const [editedQuestions, setEditedQuestions] = useState<Record<number, EditedQuestion>>({});
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  // Tracks which "add questions" action a question came from, so two separate adds of
  // the same type (e.g. MCQs added twice) get their own section/heading instead of
  // merging into one.
  const [questionBatch, setQuestionBatch] = useState<Record<number, number>>({});
  const nextBatchIdRef = useRef(0);
  // "Ignore Questions" count per batch -- not required; when set for a batch, that
  // section's heading on the generated paper shows "(Any N)" where N = that batch's
  // selected count minus the ignore count (e.g. 5 selected, ignore 2 -> "Any 3").
  const [ignoreCountByBatch, setIgnoreCountByBatch] = useState<Record<number, number>>({});
  // "Each Q Marks" per batch -- a later add with different marks must not change the
  // "NxM=T" figure of sections that were added earlier.
  const [marksByBatch, setMarksByBatch] = useState<Record<number, number>>({});
  // Last total auto-filled into the Save dialog, so it can follow questions added since
  // without overwriting a total the user typed in themselves.
  const autoTotalMarksRef = useRef("");
  // Tracks the Dual Medium setting each question was added with, so a later add with a
  // different medium (English/Urdu/Dual) doesn't change previously-added questions.
  const [questionMedium, setQuestionMedium] = useState<Record<number, string>>({});
  // Tracks the "2 Questions Per Line" setting each question was added with, so a later
  // add with a different setting doesn't change previously-added questions.
  const [questionTwoPerLine, setQuestionTwoPerLine] = useState<Record<number, boolean>>({});
  const [showSavePaperDialog, setShowSavePaperDialog] = useState(false);
  const [paperName, setPaperName] = useState("");
  const [paperCategory, setPaperCategory] = useState("");
  const [timeAllowed, setTimeAllowed] = useState("");
  const [paperDate, setPaperDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("0");
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [allQuestions, setAllQuestions] = useState<PaperQuestion[]>([]);
  const [isSearchingQuestions, setIsSearchingQuestions] = useState(false);
  const [dbChapterGroups, setDbChapterGroups] = useState<ChapterGroup[] | null>(null);
  const [dbQuestionTypes, setDbQuestionTypes] = useState<QuestionTypeOption[] | null>(null);
  const [showRestrictedDialog, setShowRestrictedDialog] = useState(false);
  const [restrictedSubjectName, setRestrictedSubjectName] = useState("");

  const isSubUser = session?.portalType === "sub-user";
  const isTeacher = session?.portalType === "teacher";
  const assignedSubjects = session?.assignedSubjects || [];
  const hasSubjectRestrictions = assignedSubjects.length > 0;

  const allowedBoards = useMemo(() => {
    if (!hasSubjectRestrictions) return null;
    return new Set(assignedSubjects.map((s: string) => s.split(" - ")[0]).filter(Boolean));
  }, [assignedSubjects, hasSubjectRestrictions]);

  const allowedClassesForBoard = useCallback((board: string) => {
    if (!hasSubjectRestrictions) return null;
    return new Set(
      assignedSubjects
        .filter((s: string) => s.startsWith(board + " - "))
        .map((s: string) => s.split(" - ")[1])
        .filter(Boolean)
    );
  }, [assignedSubjects, hasSubjectRestrictions]);

  const isSubjectAllowed = (board: string, className: string, title: string, subtitle?: string) => {
    if (!hasSubjectRestrictions) return true;
    const label = subtitle ? `${board} - ${className} - ${title} (${subtitle})` : `${board} - ${className} - ${title}`;
    return assignedSubjects.includes(label);
  };

  const chapterGroups = useMemo(() => {
    if (!selectedSubject || !selectedLevel || !selectedBoard) {
      return [];
    }

    const fromOneToEight = getOneToEightChapters(selectedSubject, selectedLevel, selectedBoard);
    if (fromOneToEight && fromOneToEight.length > 0) {
      return fromOneToEight;
    }

    const fromTopicsFile = getNineTopicChapters(selectedSubject, selectedLevel, selectedBoard);
    if (fromTopicsFile && fromTopicsFile.length > 0) {
      return fromTopicsFile;
    }

    const staticFallback = getChaptersForSubject(selectedSubject, selectedLevel, selectedBoard);
    if (dbChapterGroups && staticFallback) {
      const dbNames = new Set(dbChapterGroups.map(g => g.name));
      // If the static fallback introduces groups the backend doesn't have,
      // the static structure is more complete (e.g. Ayat/Hadith split) -> use it.
      const staticHasExtraGroups = staticFallback.some(g => !dbNames.has(g.name));
      if (staticHasExtraGroups) {
        return staticFallback;
      }
      if (dbChapterGroups.length <= staticFallback.length) {
        const staticByName = new Map(staticFallback.map(g => [g.name, g]));
        const merged = dbChapterGroups.map(dbGroup => {
          const staticGroup = staticByName.get(dbGroup.name);
          if (staticGroup && staticGroup.chapters && staticGroup.chapters.length > dbGroup.chapters.length) {
            return staticGroup;
          }
          return dbGroup;
        });
        const missing = staticFallback.filter(g => !dbNames.has(g.name));
        if (missing.length > 0 || merged.some((g, i) => g !== dbChapterGroups[i])) {
          return [...merged, ...missing];
        }
      }
    }
    return dbChapterGroups ?? staticFallback;
  }, [dbChapterGroups, selectedBoard, selectedLevel, selectedSubject]);

  // Every key "Select All Chapters" may add. Topics excluded by the current Smart
  // Syllabus are never part of this list unless the teacher enabled the full syllabus.
  const selectableChapterKeys = useMemo(
    () => getSelectableSelectionKeys(
      selectedSubject ?? "",
      selectedLevel ?? "",
      selectedBoard ?? "",
      chapterGroups,
      enableFullSyllabus,
    ),
    [chapterGroups, selectedBoard, selectedLevel, selectedSubject, enableFullSyllabus],
  );

  const canToggleFullSyllabus = useMemo(
    () => hasSmartSyllabusExclusions(
      selectedSubject ?? "",
      selectedLevel ?? "",
      selectedBoard ?? "",
    ),
    [selectedBoard, selectedLevel, selectedSubject],
  );

  const questionTypeOptions = useMemo(() => {
    const groupNameSet = new Set(chapterGroups.map((g) => g.name));
    const chapterNamesOnly = [...new Set(selectedChapters)].filter((ch) => {
      if (!groupNameSet.has(ch)) return true;
      const group = chapterGroups.find((g) => g.name === ch);
      return group && (group.chapters.length === 0 ||
        (group.chapters.length === 1 && group.chapters[0] === ch));
    });
    const topicTypes = getAvailableQuestionTypesForTopics(
      selectedSubject ?? "",
      chapterNamesOnly,
      selectedLevel ?? ""
    );

    let rawOptions: QuestionTypeOption[] = [];
    if (topicTypes !== null) {
      rawOptions = allPossibleQuestionTypeOptions;
    } else if (availableDbTypes && availableDbTypes.length > 0) {
      rawOptions = allPossibleQuestionTypeOptions;
    } else if (dbQuestionTypes && dbQuestionTypes.length > 0) {
      rawOptions = dbQuestionTypes;
    } else {
      rawOptions = defaultQuestionTypeOptions;
    }

    const subjectName = selectedSubject?.split("||")[0] || "";

    let allowedSet: Set<string> | null = null;
    const dbTypeValues = dbQuestionTypes?.map((t) => t.value) ?? [];
    const topicScopedSubject = isTopicScopedPtbClass(selectedBoard, selectedLevel);
    if (topicScopedSubject && availableDbTypes && availableDbTypes.length > 0) {
      // availableDbTypes is scoped to exactly the selected topics here, so it alone decides
      // the list -- unioning the static topic map back in re-adds unrelated types (e.g.
      // Letters/Stories/Idioms when only "Comprehension Paragraph" is selected).
      allowedSet = new Set(availableDbTypes);
    } else if (topicTypes && topicTypes.length > 0) {
      // dbTypeValues is the FULL subject-wide type list (unscoped by topic/chapter) --
      // merging it in here would defeat the topic-specific filtering entirely and show
      // every question type regardless of which topics are actually selected.
      allowedSet = new Set([...topicTypes, ...(availableDbTypes ?? [])]);
    } else if (availableDbTypes && availableDbTypes.length > 0) {
      allowedSet = new Set(availableDbTypes);
    } else if (dbTypeValues.length > 0) {
      allowedSet = new Set(dbTypeValues);
    }

    if (allowedSet) {
      rawOptions = rawOptions.filter((opt) => allowedSet!.has(opt.value));
    }

    // Remove question types that have no DB data for specific INTER-I subjects
    if (selectedLevel === "INTER-I" && selectedSubject) {
      const INTER_I_REMOVED_TYPES: Record<string, string[]> = {
        "اسلامیات لازمی": ["shakhsiyat", "shakhsiyaat"],
        "Islamiyat Lazmi": ["shakhsiyat", "shakhsiyaat"],
        "پنجابی": ["words_into_sentences", "wahid_jama", "muzakir_monas", "letters", "stories"],
        "Punjabi": ["words_into_sentences", "wahid_jama", "muzakir_monas", "letters", "stories"],
        "اسلامیات اختیاری": ["ayaat", "hadith", "ahadees"],
        "Islamiyat Ikhtayari": ["ayaat", "hadith", "ahadees"],
        "فارسی": ["long"],
        "Farsi": ["long"],
        "تاریخ اسلام": ["mcq"],
        "Tareekh Islam": ["mcq"],
        "لائبریری سائنس": ["mcq"],
        "Library Science": ["mcq"],
      };
      const removed = INTER_I_REMOVED_TYPES[subjectName];
      if (removed) {
        rawOptions = rawOptions.filter((opt) => !removed.includes(opt.value));
      }
    }

    // For 9TH, 10TH, INTER-I Urdu and English (PTB): remove Long Questions
    // and keep only one of Short Questions OR Question and Answers
    const isUrduEnglishPTB = selectedSubject &&
      selectedBoard === "PTB" &&
      ["9TH", "10TH", "INTER-I"].includes(selectedLevel || "") &&
      ["Urdu", "English", "اردو", "اردو لازمی"].some(s => subjectName === s || subjectName.includes(s));
    if (isUrduEnglishPTB) {
      // Remove Long Questions
      rawOptions = rawOptions.filter((opt) => opt.value !== "long");
      // If both Short Questions and Question and Answers exist, keep only Question and Answers for English, Short Questions for Urdu
      const hasShort = rawOptions.some((opt) => opt.value === "short");
      const hasQA = rawOptions.some((opt) => opt.value === "questions_answers");
      if (hasShort && hasQA) {
        if (subjectName === "English" || subjectName.includes("English")) {
          rawOptions = rawOptions.filter((opt) => opt.value !== "short");
        } else {
          rawOptions = rawOptions.filter((opt) => opt.value !== "questions_answers");
        }
      }
    }

    // For 9TH Punjabi (PTB): remove Long Questions and deduplicate "Explanation of Verses" label
    // (both ashaar_ki_tashreeh and ashar_ki_tashreeh map to same label)
    const isPunjabi9thPTB = selectedSubject &&
      selectedBoard === "PTB" &&
      selectedLevel === "9TH" &&
      ["Punjabi", "پنجابی"].some(s => subjectName === s || subjectName.includes(s));
    if (isPunjabi9thPTB) {
      // Remove Long Questions
      rawOptions = rawOptions.filter((opt) => opt.value !== "long");
      // Deduplicate by label (keep first occurrence of "Explanation of Verses")
      const seenLabels = new Set();
      rawOptions = rawOptions.filter((opt) => {
        const label = getProfessionalQuestionTypeLabel(opt.value, opt.label);
        if (label.includes("Explanation of Verses")) {
          if (seenLabels.has(label)) {
            return false;
          }
          seenLabels.add(label);
          return true;
        }
        return true;
      });
    }

    // Debug logs for runtime inspection — remove after verification
    // eslint-disable-next-line no-console
    console.debug('TeacherGeneratePaper: rawOptions labels ->', rawOptions.map((o) => o.label));
    // eslint-disable-next-line no-console
    console.debug('TeacherGeneratePaper: availableDbTypes ->', availableDbTypes);
    // eslint-disable-next-line no-console
    console.debug('TeacherGeneratePaper: topicTypes ->', topicTypes);

    return rawOptions.map((opt) => ({
      value: opt.value,
      label: getProfessionalQuestionTypeLabel(opt.value, opt.label),
    }));
  }, [dbQuestionTypes, selectedLevel, selectedSubject, selectedBoard, availableDbTypes, selectedChapters, chapterGroups]);

  useEffect(() => {
    if (questionType && !questionTypeOptions.some((option) => option.value === questionType)) {
      setQuestionType("");
      setAppliedQuestionType("");
    }
  }, [questionType, questionTypeOptions]);

  // Priority checkboxes come from the priorities actually present in the searched
  // results (not a separate DB lookup), so every option offered is guaranteed to match.
  const priorityOptions = useMemo(() => buildPriorityOptions(allQuestions), [allQuestions]);

  useEffect(() => {
    setQuestionPriorities((prev) => {
      const validValues = new Set(priorityOptions.map((option) => option.value));
      const next = prev.filter((value) => validValues.has(value));
      return next.length === prev.length ? prev : next;
    });
  }, [priorityOptions]);

  const activeQuestions = useMemo(() => {
    let filtered = allQuestions;

    // When user picks a basic type (mcq/short/long), exclude questions that
    // belong to a dedicated composition section (summary, essays, ashaar, etc.)
    // so they don't appear in both the basic view and their dedicated type view.
    const COMPOSITION_TYPES = new Set([
      "summary", "essays", "letters", "stories", "dialoges", "mukalmy",
      "darkhaastein", "applications", "appliations", "writing_paragraphs",
      "comprehension_paragraph", "tafheem_ibarat",
      "ashaar_ki_tashreeh", "ashar_ki_tashreeh", "paragraph_ki_tashreeh",
      "poem_stanzas", "markazi_khayal", "takhlees_ibarat",
      "history", "receipt", "newsletters", "farsi_tarjuma",
      "translate_into_urdu_paragraph", "translate_into_urdu_sentences",
      "ayaat", "hadith", "ahadees", "shakhsiyat", "shakhsiyaat",
      "words_into_sentences", "words_meanings",
      "ilfaz_mutazad", "ilfaz_mutaradif",
      "genders", "wahid_jama", "missing_letters", "tick_correct_spellings",
    ]);
    const isCompositionType = (cp: string | null) => !!cp && COMPOSITION_TYPES.has(cp);

    if (appliedQuestionType === "mcq") filtered = filtered.filter((q) => q.contentType === "mcq" && !isCompositionType(q.chapterPart));
    if (appliedQuestionType === "short") filtered = filtered.filter((q) => q.contentType === "short" && !isCompositionType(q.chapterPart));
    if (appliedQuestionType === "long") filtered = filtered.filter((q) => q.contentType === "long" && !isCompositionType(q.chapterPart));
    if (questionPriorities.length > 0) {
      filtered = filtered.filter((q) => questionPriorities.includes(q.priorityKey));
    }

    return filtered;
  }, [allQuestions, questionPriorities, appliedQuestionType]);

  // Changing the priority filter after searching can hide questions that were already
  // ticked -- drop those from the selection so the count only reflects what's visible.
  useEffect(() => {
    const visibleIds = new Set(activeQuestions.map((q) => q.id));
    setSelectedQuestions((prev) => {
      const next = prev.filter((id) => visibleIds.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [activeQuestions]);

  const typeSlugToLabel = useMemo(() => {
    const map: Record<string, string> = {};
    questionTypeOptions.forEach(opt => { map[opt.value] = opt.label; });
    return map;
  }, [questionTypeOptions]);

  const groupedQuestions = useMemo(() => {
    const groups: Record<string, typeof activeQuestions> = {};
    const isSpecialType = appliedQuestionType && !["mcq", "short", "long"].includes(appliedQuestionType);
    activeQuestions.forEach(q => {
      let key: string;
      if (isSpecialType && chapterGroups.length > 0) {
        if (q.topicName) {
          key = q.topicName;
        } else if (appliedQuestionType) {
          key = typeSlugToLabel[appliedQuestionType] || q.chapterPart || `Chapter ${q.chapter}`;
        } else {
          const group = chapterGroups[q.chapter - 1];
          key = group?.chapters?.[0] || group?.name || `Chapter ${q.chapter}`;
        }
      } else {
        key = q.topicName || q.chapterPart || `Chapter ${q.chapter}`;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    });
    return groups;
  }, [activeQuestions, appliedQuestionType, chapterGroups]);

  const orderQuestionIds = (ids: number[]) => {
    const uniqueIds = Array.from(new Set(ids));
    const getTypeWeight = (id: number) => {
      const matched = allQuestions.find((q) => q.id === id);
      const fallback = editedQuestions[id];
      const resolvedType = matched?.contentType || fallback?.contentType || inferContentType(id, fallback?.text || "");
      if (resolvedType === "mcq") return 1;
      if (resolvedType === "short") return 2;
      return 3;
    };

    return uniqueIds.sort((a, b) => getTypeWeight(a) - getTypeWeight(b));
  };

  const getRequiredCount = () => {
    const parsed = Number.parseInt(requiredQuestions, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const workspaceQuestions = useMemo(
    () => shuffledOrder
      .map((id) => {
        const matched = allQuestions.find((q) => q.id === id);
        if (matched) {
          return {
            id,
            text: editedQuestions[id]?.text ?? matched.text,
            urdu: editedQuestions[id]?.urdu ?? matched.urdu,
            contentType: matched.contentType,
            chapterPart: matched.chapterPart,
            batch: questionBatch[id] ?? 0,
            medium: questionMedium[id] ?? appliedDualMedium,
            twoPerLine: questionTwoPerLine[id] ?? appliedTwoQuestionsPerLine,
          };
        }

        const edited = editedQuestions[id];
        if (!edited) return null;

        return {
          id,
          text: edited.text,
          urdu: edited.urdu,
          contentType: edited.contentType || inferContentType(id, edited.text),
          chapterPart: edited.chapterPart ?? null,
          batch: questionBatch[id] ?? 0,
          medium: questionMedium[id] ?? appliedDualMedium,
          twoPerLine: questionTwoPerLine[id] ?? appliedTwoQuestionsPerLine,
        };
      })
      .filter((q): q is { id: number; text: string; urdu: string; contentType: WorkspaceQuestionType; chapterPart: string | null; batch: number; medium: string; twoPerLine: boolean } => Boolean(q)),
    [allQuestions, editedQuestions, shuffledOrder, questionBatch, questionMedium, appliedDualMedium, questionTwoPerLine, appliedTwoQuestionsPerLine]
  );

  const standardSectionMeta: Record<WorkspaceQuestionType, { english: string; urdu: string }> = {
    mcq: {
      english: "Choose the correct option(s) for the following questions.",
      urdu: "مندرجہ ذیل سوالات کے درست جواب کا انتخاب کریں۔",
    },
    short: {
      english: "Write short answers of the following questions.",
      urdu: "مندرجہ ذیل سوالات کے مختصر جوابات تحریر کریں۔",
    },
    long: {
      english: "Write detailed answers of the following questions.",
      urdu: "مندرجہ ذیل سوالات کے تفصیلی جوابات تحریر کریں۔",
    },
  };

  // Paper-only instructional headings -- these override what's PRINTED on the paper for
  // these named types, without changing the type's own name in the question-type dropdown
  // (that dropdown label comes from questionTypeOptions/getProfessionalQuestionTypeLabel,
  // which this map intentionally does not touch).
  const sectionHeadingOverrides: Record<string, { english: string; urdu: string }> = {
    letters: { english: "Write the following letters", urdu: "مندرجہ ذیل خطوط تحریر کریں" },
    stories: { english: "Write the following stories", urdu: "مندرجہ ذیل کہانیاں تحریر کریں" },
    dialoges: { english: "Write the following dialogues", urdu: "مندرجہ ذیل مکالمے تحریر کریں" },
    mukalmy: { english: "Write the following dialogues", urdu: "مندرجہ ذیل مکالمے تحریر کریں" },
    ideoms: { english: "Use the following idioms in sentences", urdu: "مندرجہ ذیل محاورات کو جملوں میں استعمال کریں" },
    active_and_passive_voice: { english: "Change the following sentences into Active or Passive Voice", urdu: "مندرجہ ذیل جملوں کو فعال یا مجہول آواز میں تبدیل کریں" },
    direct_and_indirect: { english: "Change the following sentences into Direct or Indirect Speech", urdu: "مندرجہ ذیل جملوں کو بلاواسطہ یا بالواسطہ کلام میں تبدیل کریں" },
    pair_of_words: { english: "Use the following pairs of words in sentences", urdu: "مندرجہ ذیل الفاظ کے جوڑوں کو جملوں میں استعمال کریں" },
    comprehension_paragraph: { english: "Read the following paragraph carefully and answer the questions given below", urdu: "مندرجہ ذیل پیراگراف غور سے پڑھ کر نیچے دیے گئے سوالات کے جوابات دیں" },
    questions_answers: { english: "Answer the following questions", urdu: "مندرجہ ذیل سوالات کے جوابات دیں" },
    question_and_answers: { english: "Answer the following questions", urdu: "مندرجہ ذیل سوالات کے جوابات دیں" },
    writing_paragraphs: { english: "Write paragraphs on the following topics", urdu: "مندرجہ ذیل عنوانات پر پیراگراف تحریر کریں" },
    translate_into_urdu_paragraph: { english: "Translate the following sentences/paragraph into Urdu", urdu: "مندرجہ ذیل جملوں/پیراگراف کا اردو میں ترجمہ کریں" },
    translate_urdu_paragraph: { english: "Translate the following sentences/paragraph into Urdu", urdu: "مندرجہ ذیل جملوں/پیراگراف کا اردو میں ترجمہ کریں" },
    translate_into_urdu_sentences: { english: "Translate the following sentences/paragraph into Urdu", urdu: "مندرجہ ذیل جملوں/پیراگراف کا اردو میں ترجمہ کریں" },
    tenses_translation: { english: "Translate the following sentences into English", urdu: "مندرجہ ذیل جملوں کا انگریزی میں ترجمہ کریں" },
    "tenses translation": { english: "Translate the following sentences into English", urdu: "مندرجہ ذیل جملوں کا انگریزی میں ترجمہ کریں" },
  };

  const getSectionLabel = (key: string): { english: string; urdu: string } => {
    if (key === "mcq" || key === "short" || key === "long") return standardSectionMeta[key];
    // chapterPart may be stored as a slug ("words_into_sentences") or a spaced label
    // ("words into sentences") depending on the subject -- match either against the
    // option list's slug-form values.
    const normalized = key.replace(/\s+/g, "_");
    const override = sectionHeadingOverrides[key] ?? sectionHeadingOverrides[normalized];
    if (override) return { english: `${override.english}.`, urdu: `${override.urdu}۔` };
    const opt = questionTypeOptions.find((o) => o.value === key || o.value === normalized);
    if (opt) {
      const parenMatch = opt.label.match(/\(([^)]+)\)$/);
      const urduPart = parenMatch ? parenMatch[1] : opt.label;
      const englishPart = opt.label.replace(/\s*\([^)]+\)\s*$/, "").trim();
      return { english: `${englishPart}.`, urdu: `${urduPart}۔` };
    }
    // Capitalize every word (e.g. "tick correct according to grammer" -> "Tick Correct
    // According To Grammer") so a type missing from questionTypeOptions still gets a
    // properly-cased heading instead of the raw lowercase slug.
    const titleCased = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { english: titleCased, urdu: key };
  };

  // Named question types are stored either as a slug ("words_into_sentences") or as a
  // lowercase label with spaces ("words into sentences") depending on the subject --
  // both must be recognized, or the type silently loses its own heading and gets
  // merged into the generic mcq/short/long section.
  const isSpecialSlugKey = (cp: string | null) => !!cp && /^[a-z_ ]+$/.test(cp);

  const workspaceSections = useMemo(() => {
    // Group by (batch, type) rather than just type -- so adding another 5 MCQs in a
    // separate "add questions" action creates its own section/heading instead of
    // merging into a previously-added MCQ section. Sections appear in the order they
    // were first added.
    const sectionMap = new Map<string, { typeKey: string; questions: typeof workspaceQuestions }>();
    const sectionOrder: string[] = [];
    workspaceQuestions.forEach((q) => {
      const typeKey = isSpecialSlugKey(q.chapterPart) ? q.chapterPart! : q.contentType;
      const key = `${q.batch}::${typeKey}`;
      if (!sectionMap.has(key)) {
        sectionMap.set(key, { typeKey, questions: [] });
        sectionOrder.push(key);
      }
      sectionMap.get(key)!.questions.push(q);
    });
    return sectionOrder.map((key) => ({ key, typeKey: sectionMap.get(key)!.typeKey, questions: sectionMap.get(key)!.questions }));
  }, [workspaceQuestions]);

  const getSectionMarks = (batch: number) => marksByBatch[batch] ?? (Number(eachQMarks) || 2);

  // How many of a section's questions carry marks. Comprehension sets count as one unit each, and with
  // "Question Choice" only N are attempted: "Any 6" out of 8 questions is 6 x marks, not 8 x marks.
  const getMarkedCount = (section: (typeof workspaceSections)[number]) => {
    const unitCount = isComprehensionType(section.typeKey)
      ? groupComprehensionSets(section.questions).length
      : section.questions.length;
    const attempted = unitCount - (ignoreCountByBatch[section.questions[0]?.batch ?? 0] ?? 0);
    return attempted > 0 ? attempted : unitCount;
  };

  // Sum of every section's own marked count x marks.
  const getDefaultTotalMarks = () =>
    formatMarks(
      workspaceSections.reduce(
        (sum, section) => sum + getMarkedCount(section) * getSectionMarks(section.questions[0]?.batch ?? 0),
        0,
      ),
    );

  // A total the user typed in wins; otherwise (empty, "0", or still the value auto-filled
  // earlier) it is re-derived from the sections.
  const resolveTotalMarks = () =>
    !totalMarks || totalMarks === "0" || totalMarks === autoTotalMarksRef.current
      ? getDefaultTotalMarks()
      : totalMarks;

  const handleSearchClick = async () => {
    if (!questionType) {
      setSelectionError("Please select question type first.");
      setShowSearchResults(false);
      setValidationMessage("Select question type!");
      setShowValidationDialog(true);
      return;
    }

    const requiredCount = getRequiredCount();
    if (!requiredCount) {
      setSelectionError("Please enter a valid Required Questions value first.");
      setShowSearchResults(false);
      setValidationMessage("Please enter Required Questions first.");
      setShowValidationDialog(true);
      return;
    }

    const marksPerQuestion = Number.parseFloat(eachQMarks);
    if (!Number.isFinite(marksPerQuestion) || marksPerQuestion <= 0) {
      setSelectionError("Please enter valid Each Q Marks first.");
      setShowSearchResults(false);
      setValidationMessage("Please enter Each Q Marks first.");
      setShowValidationDialog(true);
      return;
    }

    if (!selectedSubject || !selectedLevel || !selectedBoard || selectedChapters.length === 0) {
      setSelectionError("Please select board, class, subject and chapters first.");
      setShowSearchResults(false);
      return;
    }

    if (!dualMedium) {
      setSelectionError("Please select a medium mode.");
      setShowSearchResults(false);
      setValidationMessage("Select a medium mode!");
      setShowValidationDialog(true);
      return;
    }

    setSelectionError("");
    setShowSearchResults(true);
    setIsSearchingQuestions(true);
    setAllQuestions([]);
    setSelectedQuestions([]);
    setAppliedQuestionType(questionType);
    setAppliedDualMedium(dualMedium);
    setAppliedTwoQuestionsPerLine(twoQuestionsPerLine);

    try {
      const contentTypeFilter = ["mcq", "short", "long"].includes(questionType)
        ? (questionType as QuestionContentType)
        : null;
      const sectionTypeFilter = questionType && !["mcq", "short", "long"].includes(questionType)
        ? questionType
        : null;
      const questions = await fetchQuestionsForSelection(
        selectedChapters,
        selectedSubject?.split("||")[0] ?? "",
        selectedLevel,
        selectedBoard,
        chapterGroups,
        contentTypeFilter,
        sectionTypeFilter,
        enableFullSyllabus,
      );
      const maxExistingId = shuffledOrder.length > 0 ? Math.max(...shuffledOrder) : 0;
      const uniqueQuestions = questions.map((q, idx) => ({ ...q, id: maxExistingId + idx + 1 }));
      setAllQuestions(uniqueQuestions);
      if (uniqueQuestions.length === 0) {
        setSelectionError("No questions found for the selected filters.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setAllQuestions([]);
      setSelectionError("Failed to load questions. Please try again.");
    } finally {
      setIsSearchingQuestions(false);
    }
  };

  const handleAddQuestions = () => {
    const requiredCount = getRequiredCount();
    if (!requiredCount) {
      setValidationMessage("Please enter a valid Required Questions value first.");
      setShowValidationDialog(true);
      return;
    }
    const effectiveCount = appliedQuestionType === "match_columns"
      ? Object.values(groupedQuestions).filter(qs => qs.some(q => selectedQuestions.includes(q.id))).length
      : isComprehensionType(appliedQuestionType)
      ? Object.values(groupedQuestions).reduce(
          (count, qs) => count + groupComprehensionSets(qs).filter(
            (set) => [set.paragraph, ...set.questions].some((q) => selectedQuestions.includes(q.id))
          ).length,
          0,
        )
      : selectedQuestions.length;
    if (effectiveCount !== requiredCount) {
      setValidationMessage(`Please select exactly ${requiredCount} question(s) first.`);
      setShowValidationDialog(true);
      return;
    }

    // Ignore Questions is optional -- only validated when something was typed.
    let ignoreCount = 0;
    const trimmedIgnore = ignoreQuestions.trim();
    if (trimmedIgnore !== "") {
      const parsedIgnore = Number.parseInt(trimmedIgnore, 10);
      if (!Number.isFinite(parsedIgnore) || parsedIgnore < 0) {
        setValidationMessage("Question Choice must be a valid number.");
        setShowValidationDialog(true);
        return;
      }
      if (parsedIgnore >= effectiveCount) {
        setValidationMessage(`Question Choice must be less than ${effectiveCount} (the selected question count).`);
        setShowValidationDialog(true);
        return;
      }
      ignoreCount = parsedIgnore;
    }

    setSelectionError("");
    const ids = [...selectedQuestions];
    const batchId = nextBatchIdRef.current++;
    setMarksByBatch((prev) => ({ ...prev, [batchId]: Number.parseFloat(eachQMarks) || 2 }));
    if (ignoreCount > 0) {
      setIgnoreCountByBatch((prev) => ({ ...prev, [batchId]: ignoreCount }));
    }
    setShuffledOrder((prev) => orderQuestionIds([...prev, ...ids]));
    setQuestionBatch((prev) => {
      const next = { ...prev };
      ids.forEach((id) => { next[id] = batchId; });
      return next;
    });
    setQuestionMedium((prev) => {
      const next = { ...prev };
      ids.forEach((id) => { next[id] = appliedDualMedium; });
      return next;
    });
    setQuestionTwoPerLine((prev) => {
      const next = { ...prev };
      ids.forEach((id) => { next[id] = appliedTwoQuestionsPerLine; });
      return next;
    });
    setEditedQuestions((prev) => {
      const next = { ...prev };
      activeQuestions.filter((q) => ids.includes(q.id)).forEach((q) => {
        if (!next[q.id]) {
          next[q.id] = { text: q.text, urdu: q.urdu, contentType: q.contentType, chapterPart: q.chapterPart };
        }
      });
      return next;
    });
    setSelectedQuestions([]);
    setShowSearchResults(false);
    setIsManualEditing(false);
    setShowQuestionSelection(false);
    setShowPaperWorkspace(true);
    // Opens on phones too (unlike the other re-opens): it shows the Question's Menu so the user sees
    // they can add the next batch (e.g. Short Questions after MCQs).
    setSidebarOpen(true);
  };

  const handleRandomSelect = () => {
    const requiredCount = getRequiredCount();
    if (!requiredCount) {
      setSelectionError("Please enter a valid Required Questions value first.");
      return;
    }
    if (activeQuestions.length < requiredCount) {
      setSelectionError(`Only ${activeQuestions.length} question(s) available for current filters.`);
      return;
    }

    const randomIds = [...activeQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, requiredCount)
      .map((q) => q.id);

    setSelectionError("");
    setSelectedQuestions(randomIds);
    setShowSearchResults(true);
  };

  const clearPaperQuestions = () => {
    setSelectedQuestions([]);
    setShuffledOrder([]);
    setQuestionBatch({});
    setIgnoreCountByBatch({});
    setMarksByBatch({});
    setQuestionMedium({});
    setQuestionTwoPerLine({});
    nextBatchIdRef.current = 0;
    setEditedQuestions({});
    setIsManualEditing(false);
  };

  const handleCancelPaper = () => {
    clearPaperQuestions();
    setShowQuestionSelection(false);
    setShowPaperWorkspace(false);
    openSidebarOnDesktop();
  };

  useEffect(() => {
    if (!session?.token) {
      navigate(loginPath);
    }
  }, [session, navigate, loginPath]);

  useEffect(() => {
    const state = location.state as { editPaperId?: number; openQuestionMenu?: boolean } | null;
    if (!state?.editPaperId) return;

    let cancelled = false;
    const loadSavedPaper = async () => {
      const savedPaper = await getSavedPaperById(state.editPaperId as number);
      if (!savedPaper || cancelled) return;

      const orderedIds = savedPaper.questions.map((q) => q.id);
      const marksPerQuestion = savedPaper.questions.length > 0
        ? Math.max(0.01, roundMarks(Number(savedPaper.totalMarks || 0) / savedPaper.questions.length))
        : Number.parseFloat(eachQMarks) || 2;
      const chapterGroups = getChaptersForSubject(savedPaper.subject || "", savedPaper.className || "", savedPaper.board || "");
      // Restore only selectable topics -- out-of-syllabus topics stay blank.
      const allChapterSelections = getSelectableSelectionKeys(
        savedPaper.subject || "",
        savedPaper.className || "",
        savedPaper.board || "",
        chapterGroups,
      );

      setSelectedBoard(savedPaper.board || null);
      setSelectedLevel(savedPaper.className || null);
      setSelectedSubject(savedPaper.subject || null);
      setSelectedChapters(allChapterSelections);
      setQuestionType(savedPaper.questionType || "");
      setAppliedQuestionType(savedPaper.questionType || "");
      const paperMedium = savedPaper.medium || "dual";
      setDualMedium(paperMedium);
      setAppliedDualMedium(paperMedium);
      setRequiredQuestions(String(savedPaper.questions.length || 0));
      // Older saved papers have no per-batch marks, so every batch starts from the average.
      const batchMarksForLoad: Record<number, number> = {
        ...Object.fromEntries(savedPaper.questions.map((q) => [q.batch ?? 0, marksPerQuestion])),
        ...(savedPaper.batchMarks ?? {}),
      };
      const lastBatchId = Math.max(0, ...savedPaper.questions.map((q) => q.batch ?? 0));
      setEachQMarks(String(batchMarksForLoad[lastBatchId] ?? marksPerQuestion));
      setMarksByBatch(batchMarksForLoad);
      setShuffledOrder(orderedIds);
      setQuestionBatch(
        Object.fromEntries(savedPaper.questions.map((q) => [q.id, q.batch ?? 0]))
      );
      nextBatchIdRef.current = Math.max(0, ...savedPaper.questions.map((q) => (q.batch ?? 0) + 1));
      setIgnoreCountByBatch(savedPaper.batchIgnoreCounts ?? {});
      setQuestionMedium(
        Object.fromEntries(savedPaper.questions.map((q) => [q.id, q.medium || paperMedium]))
      );
      setQuestionTwoPerLine(
        Object.fromEntries(savedPaper.questions.map((q) => [q.id, q.twoPerLine ?? savedPaper.twoQuestionsPerLine ?? false]))
      );
      setEditedQuestions(
        Object.fromEntries(
          savedPaper.questions.map((q) => [q.id, { text: q.text, urdu: q.urdu, contentType: q.contentType, chapterPart: q.chapterPart }])
        )
      );
      setPaperName(savedPaper.title || "");
      setPaperCategory(savedPaper.paperCategory || "");
      setTimeAllowed(savedPaper.timeAllowed || "40");
      setPaperDate(savedPaper.date || "");
      setTotalMarks(savedPaper.totalMarks || "0");
      setShowSearchResults(false);
      setShowQuestionSelection(Boolean(state.openQuestionMenu));
      setShowPaperWorkspace(true);
      openSidebarOnDesktop();
      setIsManualEditing(false);
    };

    loadSavedPaper();
    return () => {
      cancelled = true;
    };
  }, [location.state]);

  const handleOpenSavePaperDialog = () => {
    if (!paperDate) {
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
      setPaperDate(formattedDate);
    }
    if (!totalMarks || totalMarks === "0" || totalMarks === autoTotalMarksRef.current) {
      const defaultTotal = getDefaultTotalMarks();
      setTotalMarks(defaultTotal);
      autoTotalMarksRef.current = defaultTotal;
    }
    setShowSavePaperDialog(true);
  };

  const openViewerPreview = (mode: "single" | "half" | "double") => {
    if (!showPaperWorkspace || workspaceQuestions.length === 0) {
      window.alert("Please add questions first.");
      return;
    }

    const previewPaper: SavedPaperRecord = {
      id: Date.now(),
      title: paperName || `${selectedSubject?.split("||")[0] || "Paper"} Test`,
      subject: selectedSubject?.split("||")[0] || "",
      className: selectedLevel || "",
      board: selectedBoard || "",
      teacherName: session?.name || (isSubUserPortal ? "Sub User" : "Teacher"),
      date: paperDate || new Date().toLocaleDateString("en-GB"),
      paperCategory: paperCategory || `${selectedSubject?.split("||")[0] || "Paper"} - ${questionType}`,
      timeAllowed: timeAllowed || "40",
      totalMarks: resolveTotalMarks(),
      questionType,
      medium: appliedDualMedium,
      twoQuestionsPerLine,
      questions: workspaceQuestions.map((question) => ({
        id: question.id,
        contentType: question.contentType,
        chapterPart: question.chapterPart ?? null,
        text: editedQuestions[question.id]?.text ?? question.text,
        urdu: editedQuestions[question.id]?.urdu ?? question.urdu,
        batch: question.batch,
        medium: question.medium,
        twoPerLine: question.twoPerLine,
      })),
      batchIgnoreCounts: ignoreCountByBatch,
      batchMarks: marksByBatch,
    };

    navigate(`/teacher/saved-paper/${previewPaper.id}/view`, {
      state: {
        paperOverride: previewPaper,
        printMode: mode,
      },
    });
  };

  const handleSavePaper = async () => {
    const activeQuestions = workspaceQuestions.map((q) => ({
      id: q.id,
      contentType: q.contentType,
      chapterPart: q.chapterPart ?? null,
      text: editedQuestions[q.id]?.text ?? q.text,
      urdu: editedQuestions[q.id]?.urdu ?? q.urdu,
      batch: q.batch,
      medium: q.medium,
      twoPerLine: q.twoPerLine,
    }));

    const dateForStorage = paperDate || new Date().toLocaleDateString("en-GB");
    const calculatedTotalMarks = resolveTotalMarks();

    await addSavedPaper({
      id: Date.now(),
      title: paperName || `${selectedSubject?.split("||")[0] || "Paper"} Test`,
      subject: selectedSubject?.split("||")[0] || "",
      className: selectedLevel || "",
      board: selectedBoard || "",
      teacherName: session?.name || (isSubUserPortal ? "Sub User" : "Teacher"),
      date: dateForStorage,
      paperCategory: paperCategory || `${selectedSubject?.split("||")[0] || "Paper"} - ${questionType}`,
      timeAllowed: timeAllowed || "40",
      totalMarks: calculatedTotalMarks,
      questionType,
      medium: appliedDualMedium,
      twoQuestionsPerLine,
      questions: activeQuestions,
      batchIgnoreCounts: ignoreCountByBatch,
      batchMarks: marksByBatch,
    });

    setShowSavePaperDialog(false);
    alert("Paper saved successfully!");
    navigate(`${basePath}/dashboard`, { state: { activeView: "savedpapers" } });
  };

  useEffect(() => {
    let isMounted = true;

    if (!selectedSubject || !selectedLevel || !selectedBoard) {
      setDbChapterGroups(null);
      setDbQuestionTypes(null);
      return () => {
        isMounted = false;
      };
    }

    const loadChapterGroups = async () => {
      try {
        const { groups, questionTypes } = await fetchChapterGroupsForSelection(
          selectedSubject?.split("||")[0] ?? "",
          selectedLevel,
          selectedBoard,
        );
        if (isMounted) {
          setDbChapterGroups(groups.length > 0 ? groups : null);
          setDbQuestionTypes(questionTypes.length > 0 ? questionTypes : null);
        }
      } catch {
        if (isMounted) {
          setDbChapterGroups(null);
          setDbQuestionTypes(null);
        }
      }
    };

    loadChapterGroups();

    return () => {
      isMounted = false;
    };
  }, [selectedBoard, selectedLevel, selectedSubject]);

  // Reset chapter selection (unchecked) whenever chapter groups load for a chosen subject
  useEffect(() => {
    if (!selectedSubject || !selectedLevel || !selectedBoard) {
      lastInitializedRef.current = null;
      return;
    }

    const currentKey = `${selectedBoard}-${selectedLevel}-${selectedSubject}`;
    const fromTopicsFile = getNineTopicChapters(selectedSubject, selectedLevel, selectedBoard)
      ?? getOneToEightChapters(selectedSubject, selectedLevel, selectedBoard);
    const hasTopicsFile = Boolean(fromTopicsFile && fromTopicsFile.length > 0);
    const hasDb = Boolean(dbChapterGroups && dbChapterGroups.length > 0);

    if (
      lastInitializedRef.current &&
      lastInitializedRef.current.key === currentKey &&
      (lastInitializedRef.current.isTopicsFile || (!hasTopicsFile && (lastInitializedRef.current.isDb || !hasDb)))
    ) {
      return;
    }

    const staticGroups = getChaptersForSubject(selectedSubject, selectedLevel, selectedBoard);
    let groups = fromTopicsFile?.length
      ? fromTopicsFile
      : (dbChapterGroups ?? staticGroups);
    // If DB has groups but static data has MORE, merge missing groups from static data
    if (dbChapterGroups && staticGroups && dbChapterGroups.length < staticGroups.length) {
      const dbNames = new Set(dbChapterGroups.map(g => g.name));
      const missing = staticGroups.filter(g => !dbNames.has(g.name));
      if (missing.length > 0) {
        groups = [...dbChapterGroups, ...missing];
      }
    }
    if (groups && groups.length > 0) {
      // Chapter checkboxes must start unchecked -- the user picks which ones to include.
      setSelectedChapters([]);
      lastInitializedRef.current = { key: currentKey, isDb: hasDb, isTopicsFile: hasTopicsFile };
    }
  }, [dbChapterGroups, selectedSubject, selectedLevel, selectedBoard]);

  // Safety net: even a restored paper or old state can never keep an out-of-syllabus
  // topic selected. A partially excluded group is expanded to its allowed topics only.
  // In full-syllabus mode every topic is allowed, so the list is left untouched.
  useEffect(() => {
    if (!selectedSubject || !selectedLevel || !selectedBoard || chapterGroups.length === 0) return;
    setSelectedChapters((previous) => {
      const next = sanitizeChapterSelections(
        selectedSubject,
        selectedLevel,
        selectedBoard,
        chapterGroups,
        previous,
        enableFullSyllabus,
      );
      return next.length === previous.length && next.every((value, index) => value === previous[index])
        ? previous
        : next;
    });
  }, [chapterGroups, selectedBoard, selectedLevel, selectedSubject, selectedChapters, enableFullSyllabus]);

  useEffect(() => {
    setAllQuestions([]);
    setSelectedQuestions([]);
    setShowSearchResults(false);
    setSelectionError("");
    setAppliedQuestionType("");
    setAppliedDualMedium("dual");
    setEnableFullSyllabus(false);
  }, [selectedBoard, selectedLevel, selectedSubject]);

  useEffect(() => {
    setSelectedQuestions([]);
    setShowSearchResults(false);
    setSelectionError("");
    setAllQuestions([]);
    setAppliedQuestionType("");
    setAppliedDualMedium("dual");
  }, [selectedChapters]);

  useEffect(() => {
    if (showQuestionSelection && selectedChapters.length > 0) {
      fetchAvailableQuestionTypes(
        selectedChapters,
        selectedSubject?.split("||")[0] ?? "",
        selectedLevel,
        selectedBoard,
        chapterGroups,
        isTopicScopedPtbClass(selectedBoard, selectedLevel),
        enableFullSyllabus,
      )
        .then(setAvailableDbTypes)
        .catch(() => setAvailableDbTypes(null));
    } else {
      setAvailableDbTypes(null);
    }
  }, [showQuestionSelection, selectedChapters, selectedSubject, selectedLevel, selectedBoard, chapterGroups, enableFullSyllabus]);

  const sidebarContent = (showQuestionSelection || showPaperWorkspace) ? (
    <>
      <div className="p-4 rounded-xl bg-secondary/60 border border-border text-center">
        <div className="w-14 h-14 rounded-full bg-card mx-auto mb-2 flex items-center justify-center text-xl border border-border">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-bold text-foreground text-sm">{session?.name || (isSubUserPortal ? "Sub User" : "Teacher")}</h2>
        <p className="text-xs text-muted-foreground">{session?.email || (isSubUserPortal ? "Sub User" : "Teacher")}</p>
      </div>

      <nav className="mt-4 space-y-0.5">
        <button type="button" onClick={() => { setShowQuestionSelection(true); setIsManualEditing(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left ${!isManualEditing ? 'text-primary bg-secondary' : 'text-foreground hover:text-primary hover:bg-secondary'}`}>
          <List className="w-4 h-4" />
          Question's Menu
        </button>
        <button type="button" onClick={() => setIsManualEditing(prev => !prev)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left ${isManualEditing ? 'text-primary bg-secondary' : 'text-foreground hover:text-primary hover:bg-secondary'}`}>
          <PencilLine className="w-4 h-4" />
          Manual Editing
        </button>
        <button type="button" onClick={handleOpenSavePaperDialog} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary text-left">
          <Save className="w-4 h-4" />
          Save Paper
        </button>
        <button type="button" onClick={() => openViewerPreview("single")} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary text-left">
          <Printer className="w-4 h-4" />
          Print Paper Single
        </button>
        <button type="button" onClick={() => openViewerPreview("half")} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary text-left">
          <Printer className="w-4 h-4" />
          Print Paper Double (Vertical)
        </button>
        <button type="button" onClick={() => openViewerPreview("double")} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary text-left">
          <Printer className="w-4 h-4" />
          Print Paper Double (Horizontal)
        </button>
        <button type="button" onClick={() => setShuffledOrder(prev => [...prev].sort(() => Math.random() - 0.5))} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary text-left">
          <Shuffle className="w-4 h-4" />
          Shuffle All Questions
        </button>
        <button type="button" onClick={handleCancelPaper} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-destructive hover:bg-secondary text-left">
          <X className="w-4 h-4" />
          Cancel Paper
        </button>
      </nav>
    </>
  ) : (
    <>
      <div className="p-4 rounded-xl bg-secondary/60 border border-border text-center">
        <div className="w-14 h-14 rounded-full bg-card mx-auto mb-2 flex items-center justify-center text-xl border border-border">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-bold text-foreground text-sm">{session?.name || (isSubUserPortal ? "Sub User" : "Teacher")}</h2>
        <p className="text-xs text-muted-foreground">{session?.email || (isSubUserPortal ? "Sub User" : "Teacher")}</p>
      </div>

      <nav className="mt-4 space-y-0.5">
        <Link to={`${basePath}/dashboard`} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary text-left">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
      </nav>

      <div className="mt-4 pt-3 border-t border-border">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate(loginPath);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary text-left"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-[hsl(var(--pts-dark))] w-full">
        <Dialog open={showQuestionSelection} onOpenChange={(open) => {
          setShowQuestionSelection(open);
          if (!open) {
            openSidebarOnDesktop();
            setShowPaperWorkspace(true);
          }
        }}>
          <DialogContent className="w-[96vw] max-w-5xl max-h-[92vh] md:w-[95vw] md:max-h-[90vh] overflow-y-auto p-3 md:p-6 gap-2 md:gap-4">
            <div className="space-y-2 md:space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 md:pb-4 border-b border-gray-200">
                <h2 className="text-[11px] md:text-base font-semibold text-gray-900">Select Your Questions Here ... {selectedLevel} - {selectedSubject?.split("||")[0]}</h2>
              </div>

              {/* First Row: Question Type, Question Priority and Dual Medium */}
              <div className="grid grid-cols-3 gap-2 md:gap-6">
                <div>
                  <label className="block text-[8px] md:text-[12px] font-semibold text-gray-700 mb-1 md:mb-2">SELECT QUESTION TYPE</label>
                  <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full border border-gray-300 rounded px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-xs text-gray-700 bg-white">
                    <option value="">Select question type</option>
                    {questionTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] md:text-[12px] font-semibold text-gray-700 mb-1 md:mb-2">QUESTION PRIORITY</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between border border-gray-300 rounded px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-xs text-gray-700 bg-white"
                      >
                        <span className={`truncate text-left ${priorityOptions.length === 0 ? "text-gray-400" : ""}`}>
                          {priorityOptions.length === 0
                            ? "Search questions first"
                            : questionPriorities.length === 0 || questionPriorities.length === priorityOptions.length
                            ? "All priorities"
                            : priorityOptions
                                .filter((option) => questionPriorities.includes(option.value))
                                .map((option) => option.label)
                                .join(", ")}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel className="text-[11px] text-gray-500">Select priorities</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {priorityOptions.length === 0 ? (
                        // Priorities are read from the searched results, so there's nothing to list until
                        // a search has run -- tell the user that instead of showing a Select All that does nothing.
                        <div className="px-2 py-2 text-xs text-gray-500">Search questions first, then filter by priority.</div>
                      ) : (
                        <>
                          <DropdownMenuCheckboxItem
                            checked={questionPriorities.length === priorityOptions.length}
                            onSelect={(e) => e.preventDefault()}
                            onCheckedChange={(checked) =>
                              setQuestionPriorities(checked ? priorityOptions.map((option) => option.value) : [])
                            }
                          >
                            Select All
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator />
                          {priorityOptions.map((option) => (
                            <DropdownMenuCheckboxItem
                              key={option.value}
                              checked={questionPriorities.includes(option.value)}
                              onSelect={(e) => e.preventDefault()}
                              onCheckedChange={(checked) =>
                                setQuestionPriorities((prev) =>
                                  checked ? [...prev, option.value] : prev.filter((value) => value !== option.value)
                                )
                              }
                            >
                              {option.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <label className="block text-[8px] md:text-[12px] font-semibold text-gray-700 mb-1 md:mb-2">DUAL MEDIUM <span className="text-red-500">*</span></label>
                  <select value={dualMedium} onChange={(e) => setDualMedium(e.target.value)} className="w-full border border-gray-300 rounded px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-xs text-gray-700 bg-white">
                    <option value="" disabled>Select Mode</option>
                    <option value="dual">Dual</option>
                    <option value="english">English</option>
                    <option value="urdu">Urdu</option>
                  </select>
                </div>
              </div>

              {/* Second Row: Input Fields */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div>
                  <label className="block text-[8px] md:text-[12px] font-semibold text-gray-700 mb-1 md:mb-2">Required Questions <span className="text-red-500">*</span></label>
                  <input type="text" value={requiredQuestions} onChange={(e) => setRequiredQuestions(e.target.value.replace(/\D/g, ''))} className="w-full border border-gray-300 rounded px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-xs text-gray-700" placeholder="0" />
                </div>
                <div>
                  <label className="block text-[8px] md:text-[12px] font-semibold text-gray-700 mb-1 md:mb-2">Each Q Marks <span className="text-red-500">*</span></label>
                  <input type="text" inputMode="decimal" value={eachQMarks} onChange={(e) => setEachQMarks(sanitizeDecimalInput(e.target.value))} className="w-full border border-gray-300 rounded px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-xs text-gray-700" placeholder="e.g. 1.5" />
                </div>
                <div>
                  <label className="block text-[8px] md:text-[12px] font-semibold text-gray-700 mb-1 md:mb-2">Question Choice</label>
                  <input type="text" value={ignoreQuestions} onChange={(e) => setIgnoreQuestions(e.target.value.replace(/\D/g, ''))} className="w-full border border-gray-300 rounded px-1 md:px-2 py-1 md:py-1.5 text-[10px] md:text-xs text-gray-700" placeholder="0" />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-center gap-2 md:gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoQuestionsPerLine}
                    onChange={(e) => setTwoQuestionsPerLine(e.target.checked)}
                    className="w-3 h-3 md:w-4 md:h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-[10px] md:text-xs font-medium text-gray-700">2 Questions Per Line</span>
                </label>
                <button
                  type="button"
                  disabled={isSearchingQuestions}
                  onClick={handleSearchClick}
                  className="bg-green-600 text-white text-[11px] md:text-sm font-semibold px-4 md:px-6 py-1.5 md:py-2 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSearchingQuestions ? "SEARCHING..." : "SEARCH"}
                </button>
              </div>

              {showSearchResults && !isSearchingQuestions && activeQuestions.length > 0 && (
                <p className="text-[10px] md:text-xs font-semibold text-gray-700">
                  Selected {selectedQuestions.length} Question(s) From {activeQuestions.length}
                </p>
              )}

              {selectionError && (
                <p className="text-sm font-semibold text-red-600">{selectionError}</p>
              )}

              {/* Questions List */}
              {showSearchResults && (
                <div className="space-y-2 md:space-y-4 max-h-[55vh] md:max-h-[500px] overflow-y-auto pr-1 md:pr-2">
                  {isSearchingQuestions ? (
                    <div className="p-4 text-center text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
                      Loading questions...
                    </div>
                  ) : activeQuestions.length === 0 ? (
                    <div className="p-4 text-center text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
                      No questions found for the selected filters. Please ensure data is available for this subject.
                    </div>
                  ) : (
                    (() => {
                      const groupEntries = Object.entries(groupedQuestions);
                      let globalOffset = 0;
                      return groupEntries.map(([topic, qs]) => {
                        const topicOffset = globalOffset;
                        globalOffset += qs.length;
                        return (
                      <div key={topic} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        {isComprehensionType(appliedQuestionType) ? (() => {
                          const sets = groupComprehensionSets(qs);
                          return (
                            <>
                              <div className="bg-[#311b92] text-white text-center py-1 px-2 md:py-2 md:px-4 font-semibold text-[10px] md:text-sm">
                                {typeSlugToLabel[topic] || topic}
                              </div>
                              {sets.map((set, setIdx) => {
                                const setIds = [set.paragraph.id, ...set.questions.map((q) => q.id)];
                                const allSelected = setIds.every((id) => selectedQuestions.includes(id));
                                const toggleSet = () => {
                                  if (allSelected) {
                                    const idSet = new Set(setIds);
                                    setSelectedQuestions((prev) => prev.filter((id) => !idSet.has(id)));
                                  } else {
                                    const newIds = setIds.filter((id) => !selectedQuestions.includes(id));
                                    setSelectedQuestions((prev) => [...prev, ...newIds]);
                                  }
                                  setSelectionError("");
                                };
                                return (
                                  <div
                                    key={set.paragraph.id}
                                    className={`p-4 border-b border-gray-100 last:border-b-0 flex gap-3 items-start hover:bg-slate-50 transition-colors ${allSelected ? "bg-green-50" : ""}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={allSelected}
                                      onChange={toggleSet}
                                      className="w-3 h-3 md:w-4 md:h-4 rounded mt-0.5 flex-shrink-0 cursor-pointer"
                                    />
                                    <div className="flex-1 min-w-0 space-y-2">
                                      <DualMediumQuestion
                                        text={set.paragraph.text}
                                        urdu={set.paragraph.urdu}
                                        index={setIdx + 1}
                                        dualMedium={appliedDualMedium}
                                        imageFile={set.paragraph.imageFile}
                                      />
                                      <div className="space-y-1 pl-4 border-l-2 border-gray-100">
                                        {set.questions.map((q, qIdx) => (
                                          <DualMediumQuestion
                                            key={q.id}
                                            text={q.text}
                                            urdu={q.urdu}
                                            index={qIdx + 1}
                                            dualMedium={appliedDualMedium}
                                            imageFile={q.imageFile}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          );
                        })() : appliedQuestionType === "match_columns" ? (() => {
                          const allSelected = qs.every(q => selectedQuestions.includes(q.id));
                          const toggleGroup = () => {
                            if (allSelected) {
                              const qIds = new Set(qs.map(q => q.id));
                              setSelectedQuestions(prev => prev.filter(id => !qIds.has(id)));
                            } else {
                              const newIds = qs.map(q => q.id).filter(id => !selectedQuestions.includes(id));
                              setSelectedQuestions(prev => [...prev, ...newIds]);
                            }
                            setSelectionError("");
                          };
                          return (
                            <>
                              <label className="bg-[#311b92] text-white py-1 px-2 md:py-2 md:px-4 font-semibold text-[10px] md:text-sm flex items-center gap-3 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={toggleGroup}
                                  className="w-4 h-4 cursor-pointer flex-shrink-0"
                                />
                                <span dir="rtl">{typeSlugToLabel[topic] || topic}</span>
                              </label>
                              <table className={`w-full border-collapse text-sm transition-colors ${allSelected ? "bg-green-50" : "bg-white"}`} dir="rtl">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2 text-right font-semibold">کالم (الف)</th>
                                    <th className="border border-gray-300 p-2 text-right font-semibold">کالم (ب)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {qs.map((q) => (
                                    <tr key={q.id}>
                                      <td className="border border-gray-300 p-2 text-right">{q.text}</td>
                                      <td className="border border-gray-300 p-2 text-right">{q.urdu}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </>
                          );
                        })() : (
                        <>
                        <div className="bg-[#311b92] text-white text-center py-1 px-2 md:py-2 md:px-4 font-semibold text-[10px] md:text-sm">
                          {typeSlugToLabel[topic] || topic}
                        </div>
                        <div className={`grid ${appliedTwoQuestionsPerLine ? 'grid-cols-2' : 'grid-cols-1'} gap-0`}>
                          {qs.map((q, idx) => (
                            <div key={q.id} className="p-2 md:p-4 border-b border-r border-gray-100 flex flex-col justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex gap-2 md:gap-3 items-start mb-1 md:mb-3">
                                <input
                                  type="checkbox"
                                  checked={selectedQuestions.includes(q.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const requiredCount = getRequiredCount();
                                      if (requiredCount && selectedQuestions.length >= requiredCount) {
                                        setSelectionError(`You can select only ${requiredCount} question(s).`);
                                        return;
                                      }
                                      setSelectionError("");
                                      setSelectedQuestions([...selectedQuestions, q.id]);
                                    } else {
                                      setSelectionError("");
                                      setSelectedQuestions(selectedQuestions.filter(id => id !== q.id));
                                    }
                                  }}
                                  className="w-3 h-3 md:w-4 md:h-4 rounded mt-0.5 flex-shrink-0 cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                  <DualMediumQuestion
                                    text={q.text}
                                    urdu={q.urdu}
                                    index={topicOffset + idx + 1}
                                    dualMedium={appliedDualMedium}
                                    imageFile={q.imageFile}
                                    textClassName="text-[10px] md:text-[13px] font-medium text-gray-800"
                                    urduClassName="text-[10px] md:text-[13px] text-gray-800 font-medium"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-center mt-auto pt-1 md:pt-2">
                                <span className={`px-2 md:px-4 py-0.5 md:py-1 rounded-sm text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${q.type === "Exercise" ? "bg-green-600 text-white" : "bg-yellow-400 text-black shadow-sm"}`}>
                                  {q.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        </>
                        )}
                      </div>
                        );
                      });
                    })()
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 md:gap-4 py-2 md:py-4">
                <button type="button" onClick={handleRandomSelect} className="bg-cyan-500 text-white text-[11px] md:text-sm font-semibold py-1.5 md:py-2 rounded hover:bg-cyan-600">
                  ↻ RANDOM SELECT ›
                </button>
                <button type="button" onClick={handleAddQuestions} className="bg-green-600 text-white text-[11px] md:text-sm font-semibold py-1.5 md:py-2 rounded hover:bg-green-700">
                  ADD QUESTIONS ›
                </button>
              </div>

              {/* Green Selected Questions Area */}
              <div className="bg-green-200 border-2 border-green-300 rounded-xl p-2 md:p-4 min-h-[100px] md:min-h-[200px]">
                {selectedQuestions.length > 0 && (
                  appliedQuestionType === "match_columns" ? (
                    <table className="w-full border-collapse text-sm bg-white rounded" dir="rtl">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-right font-semibold">کالم (الف)</th>
                          <th className="border border-gray-300 p-2 text-right font-semibold">کالم (ب)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeQuestions.filter(q => selectedQuestions.includes(q.id)).map((q) => (
                          <tr key={q.id}>
                            <td className="border border-gray-300 p-2 text-right">{q.text}</td>
                            <td className="border border-gray-300 p-2 text-right">{q.urdu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : isComprehensionType(appliedQuestionType) ? (
                    <div className="space-y-3">
                      {groupComprehensionSets(activeQuestions.filter(q => selectedQuestions.includes(q.id))).map((set, setIdx) => (
                        <div key={set.paragraph.id} className="p-2 bg-white rounded text-sm space-y-1">
                          <DualMediumQuestion
                            text={set.paragraph.text}
                            urdu={set.paragraph.urdu}
                            index={setIdx + 1}
                            dualMedium={appliedDualMedium}
                            imageFile={set.paragraph.imageFile}
                          />
                          <div className="space-y-1 pl-4 border-l-2 border-gray-100">
                            {set.questions.map((q, qIdx) => (
                              <DualMediumQuestion
                                key={q.id}
                                text={q.text}
                                urdu={q.urdu}
                                index={qIdx + 1}
                                dualMedium={appliedDualMedium}
                                imageFile={q.imageFile}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                  <div className="space-y-2">
                    {activeQuestions.filter(q => selectedQuestions.includes(q.id)).map((q, idx) => (
                      <div key={q.id} className="p-2 bg-white rounded text-[10px] md:text-sm">
                        <DualMediumQuestion
                          text={q.text}
                          urdu={q.urdu}
                          index={idx + 1}
                          dualMedium={appliedDualMedium}
                          imageFile={q.imageFile}
                        />
                      </div>
                    ))}
                  </div>
                  )
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
          <DialogContent className="max-w-[380px] p-5 text-center">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full border-4 border-red-400 flex items-center justify-center">
              <X className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-5">{validationMessage}</h3>
            <button
              type="button"
              onClick={() => setShowValidationDialog(false)}
              className="px-6 py-2 rounded-lg text-white text-lg font-semibold bg-indigo-500 hover:bg-indigo-600"
            >
              OK
            </button>
          </DialogContent>
        </Dialog>
        <Dialog open={showSavePaperDialog} onOpenChange={setShowSavePaperDialog}>
          <DialogContent className="max-w-xl p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-800 to-purple-700 px-4 py-3 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Save Paper</h2>
              <button type="button" onClick={() => setShowSavePaperDialog(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Paper Name <span className="text-red-500">*</span></label>
                <input type="text" value={paperName} onChange={(e) => setPaperName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Paper Category <span className="text-red-500">*</span></label>
                <input type="text" value={paperCategory} onChange={(e) => setPaperCategory(e.target.value)} placeholder="Like Monthly Exams, Daily Test System etc." className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Time Allowed <span className="text-red-500">*</span></label>
                <input type="text" value={timeAllowed} onChange={(e) => setTimeAllowed(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Paper Date <span className="text-red-500">*</span></label>
                  <input type="text" value={paperDate} onChange={(e) => setPaperDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">Total Marks <span className="text-red-500">*</span></label>
                  <input type="text" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-center" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="button" onClick={handleSavePaper} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-sm">
                  + SAVE PAPER
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-primary-foreground">
              {sidebarOpen && !showQuestionSelection && !showPaperWorkspace ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <h1 className="text-base font-bold tracking-wide text-primary-foreground">APEXTESTSOLUTION</h1>
              <p className="text-xs text-primary-foreground/50">{isSubUserPortal ? "Sub User Portal" : "Teacher Portal"}</p>
            </div>
          </div>
          <div className="text-right min-w-0">
            <p className="text-sm font-semibold text-primary-foreground truncate">{isSubUserPortal ? (session?.schoolName || "Institute") : (session?.name || "Teacher")}</p>
            <p className="text-xs text-primary-foreground/50 truncate hidden sm:block">{isSubUserPortal ? (session?.schoolAddress || "") : (session?.email || "")}</p>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside className="w-[280px] h-full bg-card border-r border-border p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-3">
              <button onClick={() => setSidebarOpen(false)} className="text-foreground"><X size={20} /></button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {!isMobile && sidebarOpen && (
        <aside className="fixed left-0 top-[58px] bottom-0 z-30 w-[260px] bg-card border-r border-border overflow-y-auto p-4">
          {sidebarContent}
        </aside>
      )}

      <div className={`px-4 md:px-6 py-6 ${!isMobile && sidebarOpen ? "lg:ml-[260px]" : ""}`}>
        <main className="space-y-5 min-w-0 max-w-7xl mx-auto">
          <div className={showPaperWorkspace ? "hidden" : "flex items-center justify-between mb-4"}>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {selectedBoard && selectedLevel && selectedSubject
                ? "Select Chapters"
                : selectedBoard && selectedLevel
                  ? "Select Subject"
                  : selectedBoard
                    ? "Select Class"
                    : "Select Syllabus"}
            </h2>
            <button
              type="button"
              onClick={() => {
                if (showQuestionSelection) setShowQuestionSelection(false);
                else if (showPaperWorkspace) setShowPaperWorkspace(false);
                else if (selectedSubject) {
                  setSelectedSubject(null);
                  setSelectedChapters([]);
                } else if (selectedLevel) {
                  setSelectedLevel(null);
                  setSelectedChapters([]);
                } else if (selectedBoard) {
                  setSelectedBoard(null);
                  setSelectedChapters([]);
                } else {
                  window.location.href = `${basePath}/dashboard`;
                }
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-card border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {!selectedBoard ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {boardCards.filter((b) => !hasSubjectRestrictions || allowedBoards?.has(b.name)).map((board) => (
                board.comingSoon ? (
                  <div
                    key={board.name}
                    className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-card via-card to-secondary/40 p-6 text-center min-h-[200px] flex flex-col items-center justify-center opacity-70 cursor-not-allowed select-none"
                  >
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${board.gradient} opacity-40`} />
                    <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${board.gradient} opacity-30`} />
                    <div className={`pointer-events-none absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-gradient-to-br ${board.gradient} opacity-10 blur-2xl`} />
                    {/* Coming Soon Badge */}
                    <div className="absolute top-2 right-2 z-20">
                      <span className="inline-flex items-center rounded-full bg-amber-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 shadow-sm uppercase tracking-wide">
                        Coming Soon
                      </span>
                    </div>
                    {/* Blur overlay */}
                    <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] rounded-2xl z-10" />
                    <img src={board.logo} alt={board.label} className="relative z-10 w-24 h-24 object-contain mb-4 drop-shadow-[0_6px_10px_rgba(0,0,0,0.08)] grayscale-[30%]" />
                    <p className="relative z-10 text-2xl font-extrabold text-foreground/60 tracking-wide">{board.label}</p>
                    <p className="relative z-10 text-base text-foreground/40 mt-1">{board.subtitle}</p>
                  </div>
                ) : (
                <button key={board.name} type="button" onClick={() => {
                  setSelectedBoard(board.name);
                  setSelectedLevel(null);
                  setSelectedSubject(null);
                  setSelectedChapters([]);
                }} className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-secondary/60 p-6 text-center min-h-[200px] flex flex-col items-center justify-center shadow-[0_8px_24px_-14px_hsl(var(--primary)/0.45)] hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_hsl(var(--primary)/0.6)] hover:border-primary/40 transition-all duration-300">
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${board.gradient} opacity-70`} />
                  <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${board.gradient} opacity-55`} />
                  <div className={`pointer-events-none absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-gradient-to-br ${board.gradient} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-30`} />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
                  <img src={board.logo} alt={board.label} className="relative z-10 w-24 h-24 object-contain mb-4 drop-shadow-[0_6px_10px_rgba(0,0,0,0.12)]" />
                  <p className="relative z-10 text-2xl font-extrabold text-foreground tracking-wide">{board.label}</p>
                  <p className="relative z-10 text-base text-foreground/80 mt-1">{board.subtitle}</p>
                </button>
                )
              ))}
            </div>
          ) : selectedBoard && !selectedLevel ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {(boardClassMap[selectedBoard] || []).filter((c) => !hasSubjectRestrictions || allowedClassesForBoard(selectedBoard)?.has(c.title)).map((card) => (
                card.comingSoon ? (
                  <div
                    key={card.title}
                    className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-card to-secondary/40 px-5 py-6 text-center min-h-[108px] flex flex-col items-center justify-center opacity-65 cursor-not-allowed select-none"
                  >
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.gradient} opacity-40`} />
                    <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${card.gradient} opacity-30`} />
                    <div className="absolute top-1.5 right-1.5 z-20">
                      <span className="inline-flex items-center rounded-full bg-amber-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 shadow-sm uppercase tracking-wide">
                        Coming Soon
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-background/25 backdrop-blur-[1px] rounded-2xl z-10" />
                    {card.image && (
                      <img src={card.image} alt={card.title} className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2 grayscale-[50%]" />
                    )}
                    <p className="relative z-10 text-2xl font-extrabold text-foreground/50 tracking-wide">{card.title}</p>
                    <p className="relative z-10 text-lg font-medium text-foreground/40 mt-1">{card.board}</p>
                  </div>
                ) : (
                <button key={card.title} type="button" onClick={() => {
                  setSelectedLevel(card.title);
                  setSelectedSubject(null);
                  setSelectedChapters([]);
                }} className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-secondary/50 px-5 py-6 text-center min-h-[108px] flex flex-col items-center justify-center shadow-[0_8px_20px_-14px_hsl(var(--primary)/0.55)] hover:-translate-y-1 hover:shadow-[0_16px_30px_-16px_hsl(var(--primary)/0.65)] hover:border-primary/40 transition-all duration-300">
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.gradient} opacity-75`} />
                  <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${card.gradient} opacity-60`} />
                  <div className={`pointer-events-none absolute -left-8 -bottom-10 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-30`} />
                  <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/10 blur-xl" />
                  {card.image && (
                    <img src={card.image} alt={card.title} className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]" />
                  )}
                  <p className="relative z-10 text-2xl font-extrabold text-foreground tracking-wide">{card.title}</p>
                  <p className="relative z-10 text-lg font-medium text-foreground/80 mt-1">{card.board}</p>
                </button>
                )
              ))}
            </div>
) : selectedLevel && selectedBoard && !selectedSubject && boardSubjectsMap[selectedBoard]?.[selectedLevel] ? (
            <div className="space-y-5">
              <h3 className="text-center text-2xl font-bold text-foreground">{selectedBoard} › {selectedLevel}</h3>
              {boardSubjectsMap[selectedBoard][selectedLevel].map((group, gi) => (
                <div key={gi}>
                  {group.length > 0 && group[0].subtitle && (
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">{group[0].subtitle}</h4>
                  )}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {group.map((s) => (
                      <button
                        key={s.title}
                        type="button"
                        disabled={s.comingSoon}
                        onClick={() => {
                          if (hasSubjectRestrictions && !isSubjectAllowed(selectedBoard!, selectedLevel!, s.title, s.subtitle)) {
                            setRestrictedSubjectName(s.title);
                            setShowRestrictedDialog(true);
                            return;
                          }
                          setSelectedSubject(selectedBoard === "AFAQ" && s.subtitle ? `${s.title}||${s.subtitle}` : s.title);
                          setSelectedChapters([]);
                        }}
                        className={`relative flex items-center gap-4 rounded-xl bg-card border border-border p-4 transition-all ${s.comingSoon ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:bg-secondary/50"}`}
                      >
                        {s.comingSoon && (
                          <span className="absolute top-1.5 right-1.5 inline-flex items-center rounded-full bg-amber-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 shadow-sm uppercase tracking-wide">
                            Coming Soon
                          </span>
                        )}
                        <img src={s.image} alt={s.title} className="w-16 h-16 object-contain shrink-0" />
                        <div className={`text-left ${isUrdu(s.title) ? "font-urdu" : ""}`} dir={isUrdu(s.title) ? "rtl" : "ltr"}>
                          <h4 className="font-bold text-sm text-foreground">{s.title}</h4>
                          <p className="text-xs text-muted-foreground">{s.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : showPaperWorkspace ? (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="space-y-6 mb-4">
                  {workspaceQuestions.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No questions added.</p>
                  ) : workspaceSections.map((section, sectionIndex) => {
                    const marksPerQuestion = getSectionMarks(section.questions[0]?.batch ?? 0);
                    const sectionNumber = sectionIndex + 1;
                    const sectionLabel = getSectionLabel(section.typeKey);
                    // Each section keeps the language it was added with -- changing the
                    // dropdown for a later "Add Questions" action must not retroactively
                    // change a previously-added section's language.
                    const sectionMedium = section.questions[0]?.medium ?? appliedDualMedium;
                    const showEn = sectionMedium !== "urdu";
                    const showUr = sectionMedium !== "english";
                    // Each section also keeps its own "2 Questions Per Line" setting.
                    const sectionTwoPerLine = section.questions[0]?.twoPerLine ?? appliedTwoQuestionsPerLine;
                    const sectionMarkedCount = getMarkedCount(section);
                    return (
                      <div key={section.key} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between gap-6 mb-4 pr-3">
                          {showEn && <p className="text-sm font-bold text-gray-900 flex-1">Q{sectionNumber}. {sectionLabel.english}</p>}
                          <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                            {sectionMarkedCount}X{formatMarks(marksPerQuestion)}={formatMarks(sectionMarkedCount * marksPerQuestion)}
                          </p>
                          {showUr && <p className="text-sm font-bold text-gray-900 flex-1 text-right" dir="rtl">سوال نمبر{sectionNumber}۔ {sectionLabel.urdu}</p>}
                        </div>
                        {section.typeKey === "match_columns" ? (
                          <table className="border-collapse text-sm" dir="rtl" style={{ width: "auto", minWidth: "40%", maxWidth: "70%" }}>
                            <thead>
                              <tr>
                                <th className="border border-gray-300 p-2 text-right bg-gray-50 font-semibold">کالم (الف)</th>
                                <th className="border border-gray-300 p-2 text-right bg-gray-50 font-semibold">کالم (ب)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.questions.map((q) => (
                                <tr key={q.id}>
                                  <td className="border border-gray-300 p-2 text-right">{editedQuestions[q.id]?.text ?? q.text}</td>
                                  <td className="border border-gray-300 p-2 text-right">{editedQuestions[q.id]?.urdu ?? q.urdu}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (() => {
                          const renderQuestionBody = (q: typeof section.questions[number], idx: number) => (
                            isManualEditing ? (
                              <>
                                {showEn && <input
                                  value={editedQuestions[q.id]?.text ?? q.text}
                                  onChange={(e) => setEditedQuestions(prev => ({ ...prev, [q.id]: { ...prev[q.id] ?? { text: q.text, urdu: q.urdu }, text: e.target.value } }))}
                                  className="flex-1 text-sm text-gray-800 border border-gray-300 rounded px-2 py-1"
                                />}
                                {showUr && <input
                                  dir="rtl"
                                  value={editedQuestions[q.id]?.urdu ?? q.urdu}
                                  onChange={(e) => setEditedQuestions(prev => ({ ...prev, [q.id]: { ...prev[q.id] ?? { text: q.text, urdu: q.urdu }, urdu: e.target.value } }))}
                                  className="flex-1 text-sm text-gray-800 border border-gray-300 rounded px-2 py-1 text-right"
                                />}
                              </>
                            ) : (
                              <>
                                {(() => {
                                  const qText = editedQuestions[q.id]?.text ?? q.text;
                                  const qUrdu = editedQuestions[q.id]?.urdu ?? q.urdu;
                                  const { englishStem, urduStem, parsedText, parsedUrdu } = getQuestionStems(qText, qUrdu);
                                  const mergedOptions = mergeMcqOptions(parsedText, parsedUrdu);
                                  const hasOptions = mergedOptions.some((o) => o.english || o.urdu);
                                  const englishMisras = splitVerseText(englishStem);
                                  const urduMisras = splitVerseText(urduStem);
                                  return (
                                    <>
                                      {showEn && (englishMisras.length === 2 ? (
                                        // 2-line شعر -- مصرعے side by side, centered.
                                        <p className="text-sm text-gray-800 flex w-full items-baseline justify-center gap-6">
                                          {englishMisras.map((m, i) => (
                                            <span key={i} className="min-w-0">{i === 0 ? `${idx + 1}. ` : ""}{m}</span>
                                          ))}
                                        </p>
                                      ) : englishMisras.length >= 3 ? (
                                        // 3+ lines -- stack one above another, preserving line breaks.
                                        <div className="text-sm text-gray-800">
                                          {englishMisras.map((m, i) => (
                                            <p key={i}>{i === 0 ? `${idx + 1}. ` : ""}{m}</p>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-800">{idx + 1}. {englishStem}</p>
                                      ))}
                                      {showEn && hasOptions && (
                                        <div className="mt-1 space-y-0.5">
                                          {mergedOptions.map((opt) => (
                                            <p key={opt.key} className="text-[12px] text-gray-700">
                                              ({opt.key}) {sanitizeOptionValue(opt.english || opt.urdu, "english")}
                                            </p>
                                          ))}
                                        </div>
                                      )}
                                      {showUr && (urduMisras.length === 2 ? (
                                        // 2-line شعر -- مصرعے side by side, centered.
                                        <p className="text-sm text-gray-800 flex w-full items-baseline justify-center gap-6" dir="rtl">
                                          {urduMisras.map((m, i) => (
                                            <span key={i} className="min-w-0">{i === 0 ? `${idx + 1}۔ ` : ""}{m}</span>
                                          ))}
                                        </p>
                                      ) : urduMisras.length >= 3 ? (
                                        // 3+ lines -- stack one above another, preserving line breaks.
                                        <div className="text-sm text-gray-800 text-right" dir="rtl">
                                          {urduMisras.map((m, i) => (
                                            <p key={i}>{i === 0 ? `${idx + 1}۔ ` : ""}{m}</p>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-800 text-right" dir="rtl">{idx + 1}۔ {urduStem}</p>
                                      ))}
                                      {showUr && hasOptions && (
                                        <div className="mt-1 space-y-0.5" dir="rtl">
                                          {mergedOptions.map((opt) => (
                                            <p key={opt.key} className="text-[12px] text-gray-700 text-right">
                                              ({opt.key}) {sanitizeOptionValue(opt.urdu || opt.english, "urdu")}
                                            </p>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </>
                            )
                          );

                          if (isComprehensionType(section.typeKey)) {
                            const sets = groupComprehensionSets(section.questions);
                            return (
                              <div className="space-y-3">
                                {sets.map((set, setIdx) => (
                                  <div key={set.paragraph.id} className="space-y-1">
                                    <div className="flex items-start justify-between gap-4">
                                      {renderQuestionBody(set.paragraph, setIdx)}
                                    </div>
                                    <div className="space-y-1 pl-4 border-l-2 border-gray-100">
                                      {set.questions.map((q, qIdx) => (
                                        <div key={q.id} className="flex items-start justify-between gap-4">
                                          {renderQuestionBody(q, qIdx)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          }

                          return (
                            <div className={sectionTwoPerLine ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-1"}>
                              {section.questions.map((q, idx) => (
                                <div key={q.id} className={sectionTwoPerLine ? "border border-gray-100 rounded-lg p-3" : "flex items-start justify-between gap-4"}>
                                  {renderQuestionBody(q, idx)}
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
                <div className="workspace-actions flex items-center gap-3 mt-2">
                  <button type="button" onClick={() => setIsManualEditing(prev => !prev)} className={`transition-colors ${isManualEditing ? 'text-orange-600' : 'text-orange-500 hover:text-orange-600'}`}>
                    <PencilLine className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={clearPaperQuestions} className="text-red-500 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={() => setShuffledOrder(prev => [...prev].sort(() => Math.random() - 0.5))} className="text-blue-500 hover:text-blue-600 transition-colors">
                    <Shuffle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : showQuestionSelection ? null : selectedSubject && selectedBoard && selectedLevel ? (
            <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-3">{selectedSubject?.split("||")[0]} - {selectedLevel}</h3>
                  <p className="text-[12px] sm:text-xs text-muted-foreground mb-5">Select Chapter(s)</p>

                  <div className="mb-5">
                    <label className={`flex items-center gap-3 ${selectableChapterKeys.length === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                      <input
                        type="checkbox"
                        checked={
                          selectableChapterKeys.length > 0 &&
                          selectedChapters.length > 0 &&
                          selectableChapterKeys.every((key) => selectedChapters.includes(key))
                        }
                        disabled={selectableChapterKeys.length === 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedChapters(selectableChapterKeys);
                          } else {
                            setSelectedChapters([]);
                          }
                        }}
                        className="h-4 w-4 accent-primary rounded"
                      />
                      <span className="text-[12px] sm:text-xs font-bold text-foreground uppercase tracking-wide">Select All Chapters</span>
                    </label>
                  </div>

                  {canToggleFullSyllabus && (
                    <label className="mb-5 flex items-start gap-3 cursor-pointer rounded-lg border border-border bg-background p-3">
                      <input
                        type="checkbox"
                        checked={enableFullSyllabus}
                        onChange={(e) => setEnableFullSyllabus(e.target.checked)}
                        className="h-4 w-4 accent-primary rounded mt-0.5 flex-shrink-0"
                      />
                      <span>
                        <span className="block text-[12px] sm:text-xs font-bold text-foreground uppercase tracking-wide">Enable All (Pre 9th/11TH)</span>
                        <span className="block text-[11px] text-muted-foreground">Show and select every topic from the full syllabus, ignoring the Smart Syllabus cuts.</span>
                      </span>
                    </label>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {chapterGroups.map((group, groupIdx) => {
                      const groupInfo = getSmartSyllabusGroupInfo(
                        selectedSubject ?? "",
                        selectedLevel ?? "",
                        selectedBoard ?? "",
                        group,
                        enableFullSyllabus,
                      );
                      const groupFullyExcluded = groupInfo.groupExcluded ||
                        (group.chapters.length > 0 && groupInfo.selectableChapters.length === 0);
                      const selectableGroupKeys = groupInfo.selectableChapters.map(ch => makeChapterKey(group.name, ch));
                      const isGroupChecked = !groupFullyExcluded && (
                        selectedChapters.includes(group.name) ||
                        (selectableGroupKeys.length > 0 && selectableGroupKeys.every(key => selectedChapters.includes(key)))
                      );
                      return (
                      <div key={groupIdx} className="bg-background border border-border rounded-lg p-4">
                        <label className={`flex items-start gap-2.5 mb-3 ${groupFullyExcluded ? "cursor-not-allowed" : "cursor-pointer"}`}>
                          <input
                            type="checkbox"
                            checked={isGroupChecked}
                            disabled={groupFullyExcluded}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const additions = group.chapters.length === 0
                                  ? [group.name]
                                  : [
                                      ...(groupInfo.hasExclusions ? [] : [group.name]),
                                      ...selectableGroupKeys,
                                    ];
                                setSelectedChapters([...new Set([...selectedChapters, ...additions])]);
                              } else {
                                const groupChapterKeys = new Set(group.chapters.map(ch => makeChapterKey(group.name, ch)));
                                setSelectedChapters(selectedChapters.filter(ch => ch !== group.name && !groupChapterKeys.has(ch)));
                              }
                            }}
                            className="h-4 w-4 accent-primary rounded mt-0.5 flex-shrink-0"
                          />
                          <span className={`text-[12px] sm:text-xs font-bold ${groupFullyExcluded ? "text-muted-foreground line-through decoration-black decoration-2" : "text-foreground"}`}>{group.name}</span>
                        </label>

                        <div className="space-y-2 ml-7">
                          {group.chapters
                            .filter(ch => ch !== group.name)
                            .filter(ch => {
                              // Hide "Exercise" for 9TH, 10TH, INTER-I Physics, Chemistry, Computer, Biology (PTB)
                              const subjectName = selectedSubject?.split("||")[0] || "";
                              const isTargetSubject = ["Physics", "Chemistry", "Computer", "Biology"].includes(subjectName);
                              const isTargetLevel = ["9TH", "10TH", "INTER-I"].includes(selectedLevel || "");
                              const isPTB = selectedBoard === "PTB";
                              if (isTargetSubject && isTargetLevel && isPTB) {
                                return ch.toLowerCase() !== "exercise";
                              }
                              return true;
                            })
                            .map((chapter, chIdx) => {
                            const chapterKey = makeChapterKey(group.name, chapter);
                            const isChapterExcluded = groupInfo.isChapterExcluded(chapter);
                            const isChapterDisabled = groupFullyExcluded || isChapterExcluded;
                            return (
                            <label key={chIdx} className={`flex items-center gap-2.5 ${isChapterDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                              <input
                                type="checkbox"
                                checked={selectedChapters.includes(chapterKey)}
                                disabled={isChapterDisabled}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedChapters([...selectedChapters, chapterKey]);
                                  } else {
                                    setSelectedChapters(selectedChapters.filter(ch => ch !== chapterKey && ch !== group.name));
                                  }
                                }}
                                className="h-3.5 w-3.5 accent-primary rounded"
                              />
                              <span className={`text-[12px] sm:text-xs ${isChapterExcluded ? "text-muted-foreground line-through decoration-black decoration-2" : "text-foreground"}`}>{chapter}</span>
                            </label>
                            );
                          })}
                        </div>
                      </div>
                      );
                    })}
                  </div>

                {selectedQuestions.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {allQuestions
                      .filter((q) => selectedQuestions.includes(q.id))
                      .map((q) => (
                        <div key={q.id} className="text-sm text-foreground">
                          {q.id}. {stripLeadingNumber(q.text)}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Stays pinned to the bottom of the screen so NEXT is visible without scrolling the whole chapter list. */}
              {/* No bar behind it: the wrapper ignores taps, only the button itself is tappable, so the chapter checkboxes under the wrapper stay usable. */}
              <div className="sticky bottom-4 z-30 flex justify-end pointer-events-none">
                <button
                  type="button"
                  disabled={selectedChapters.length === 0}
                  onClick={() => {
                    setShowQuestionSelection(true);
                    setShowPaperWorkspace(true);
                    openSidebarOnDesktop();
                  }}
                  className="pointer-events-auto shadow-lg bg-foreground text-background text-xs font-semibold py-2.5 px-7 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
                >
                  NEXT <span>›</span>
                </button>
              </div>
            </div>
          ) : showQuestionSelection && selectedSubject && selectedBoard && selectedLevel ? (
            <div className="space-y-6">
              <div className="bg-[hsl(var(--pts-dark))] text-primary-foreground rounded-xl p-6 flex items-center justify-between">
                <h2 className="text-lg font-bold">Select Your Questions Here ... {selectedLevel} - {selectedSubject?.split("||")[0]}</h2>
                <button
                  type="button"
                  onClick={() => setShowQuestionSelection(false)}
                  className="text-primary-foreground hover:opacity-75"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">SELECT QUESTION TYPE</label>
                  <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm">
                    <option value="">Select question type</option>
                    {questionTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">DUAL MEDIUM</label>
                  <select value="" onChange={() => { }} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm">
                    <option>English/Urdu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Required Questions <span className="text-red-500">*</span></label>
                  <input type="text" value={requiredQuestions} onChange={(e) => setRequiredQuestions(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Each Q Marks <span className="text-red-500">*</span></label>
                  <input type="text" value={eachQMarks} onChange={(e) => setEachQMarks(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Question Choice</label>
                  <input type="text" value={ignoreQuestions} onChange={(e) => setIgnoreQuestions(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Blank Lines</label>
                  <input type="text" value={blankLines} onChange={(e) => setBlankLines(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Blank Line Type</label>
                  <select value={blankLineType} onChange={(e) => setBlankLineType(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm">
                    <option>1 LINE</option>
                    <option>2 LINES</option>
                    <option>3 LINES</option>
                  </select>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground uppercase">Selected Questions</h3>
                  <span className="text-lg font-bold text-primary">0 / 0</span>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-2 rounded-lg bg-yellow-400 text-yellow-900 font-semibold text-sm hover:opacity-90">Smart Syllabus</button>
                  <button type="button" className="px-4 py-2 rounded-lg bg-yellow-300 text-yellow-900 font-semibold text-sm hover:opacity-90">Full Syllabus</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={handleRandomSelect} className="bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                  RANDOM SELECT ›
                </button>
                <button type="button" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                  ADD QUESTIONS ›
                </button>
              </div>

              <div className="bg-green-200 border-2 border-green-300 rounded-lg min-h-[300px]"></div>
            </div>
          ) : null}
        </main>
      </div>

      <Dialog open={showRestrictedDialog} onOpenChange={setShowRestrictedDialog}>
        <DialogContent className="max-w-sm">
          <div className="text-center space-y-4 py-6">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Access Restricted</h3>
            <p className="text-sm text-muted-foreground">
              {isTeacher
                ? <>Ap admin se contact kar k <strong>{restrictedSubjectName}</strong> aur subject assign karwa lein.</>
                : <>You cannot make papers for subjects other than your assigned subjects. Ask your master to assign you <strong>{restrictedSubjectName}</strong>.</>
              }
            </p>
            <button
              type="button"
              onClick={() => setShowRestrictedDialog(false)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              OK
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherGeneratePaper;
