import { getNineTopicChapters } from "./nineTopicChapters";
import { getTenTopicChapters } from "./tenTopicChapters";
import afaqTopicChapters from "./afaqTopicChapters.json";
import oxfordTopicChapters from "./oxfordTopicChapters.json";
import baTopicChapters from "./baTopicChapters.json";
import { interTwoChapters } from "./interTwoChapters";


export type SubjectCard = {
  title: string;
  subtitle: string;
  image: string;
  showArrow?: boolean;
  // Shown greyed out with a "Coming Soon" badge and can't be opened (only INTER-II uses this).
  comingSoon?: boolean;
};

// Book image mapping by subject name
const bookImages: Record<string, string> = {
  "Biology": "/images/books/biology-book.png",
  "Chemistry": "/images/books/chemistry-book.png",
  "Physics": "/images/books/physics-book.png",
  "Mathematics": "/images/books/mathematics-book.png",
  "Computer": "/images/books/computer-book.png",
  "English": "/images/books/english-book.png",
  "اردو لازمی": "/images/books/urdu-book.png",
  "اردو": "/images/books/urdu-book.png",
  "Urdu": "/images/books/urdu-book.png",
  "اسلامیات لازمی": "/images/books/islamiat-book.png",
  "اسلامیات اختیاری": "/images/books/islamiat-book.png",
  "اسلامیات": "/images/books/islamiat-book.png",
  "Islamiat": "/images/books/islamiat-book.png",
  "General Science": "/images/books/general-science-book.png",
  "Economics": "/images/books/economics-book.png",
  "Statistics": "/images/books/statistics-book.png",
  "Pakistan Studies": "/images/books/pak-studies-book.png",
  "معاشرتی علوم": "/images/books/social-studies-book.png",
  "Social Studies": "/images/books/social-studies-book.png",
  "ناظرہ قرآن مجید": "/images/books/nazra-quran-book.png",
  "Nazra Quran": "/images/books/nazra-quran-book.png",
  "History": "/images/books/history-book.png",
  "تاریخ": "/images/books/history-book.png",
  "تاریخ اسلام": "/images/books/history-book.png",
  "Geography": "/images/books/geography-book.png",
  "جغرافیہ": "/images/books/geography-book.png",
  "طبعی جغرافیہ": "/images/books/geography-book.png",
  "طبی جغرافیہ": "/images/books/geography-book.png",
  "ایجوکیشن": "/images/books/education-book.png",
  "پنجابی": "/images/books/punjabi-book.png",
  "ہوم اکنامکس": "/images/books/home-economics-book.png",
  "سوشیالوجی": "/images/books/sociology-book.png",
  "ترجمہ القرآن المجید": "/images/books/quran-book.png",
  "فزیکل ایجوکیشن": "/images/books/physical-education-book.png",
  "اخلاقیات": "/images/books/ethics-book.png",
  "Principles of Accounting": "/images/books/accounting-book.png",
  "اصول محاسبت": "/images/books/accounting-book.png",
  "Principles of Economics": "/images/books/economics-book.png",
  "Principles of Commerce": "/images/books/commerce-book.png",
  "Business Maths": "/images/books/business-maths-book.png",
  "معاشیات": "/images/books/economics-book.png",
  "سوکس": "/images/books/sociology-book.png",
  "اصول بینکاری": "/images/books/accounting-book.png",
  "تجارتی جغرافیہ": "/images/books/geography-book.png",
  "کاروباری شماریات": "/images/books/statistics-book.png",
  "پاکستان کا معاشرہ": "/images/books/pak-studies-book.png",
  "جنرل ریاضی": "/images/books/mathematics-book.png",
  "علم شہریت": "/images/books/social-studies-book.png",
  "Civics": "/images/books/social-studies-book.png",
  "لائبریری سائنس": "/images/books/library-science-book.png",
  "Library Science": "/images/books/library-science-book.png",
  "لازمیری سائنس": "/images/books/library-science-book.png",
  "غذا اور غذائیت": "/images/books/home-economics-book.png",
  "مرغبانی": "/images/books/home-economics-book.png",
  "پارچہ بافی اور لباس": "/images/books/home-economics-book.png",
  "Electrical Wiring": "/images/books/general-science-book.png",
  "Textile and Clothing": "/images/books/home-economics-book.png",
  "General Knowledge": "/images/books/general-science-book.png",
  "Social Study": "/images/books/social-studies-book.png",
  "ترجمہ القرآن": "/images/books/quran-book.png",
  "زرعی تعلیم": "/images/books/general-science-book.png",
  "Science": "/images/books/general-science-book.png",
  "Math": "/images/books/mathematics-book.png",
  "Computer Science": "/images/books/computer-book.png",
  "English (IS)": "/images/books/english-book.png",
  "اردو (Iqbal)": "/images/books/urdu-book.png",
  "مطالعہ اسلام": "/images/books/islamiat-book.png",
  "انسانی جغرافیہ": "/images/books/geography-book.png",
  "معلومات عامہ": "/images/books/general-science-book.png",
  "واقعیت عامہ": "/images/books/general-science-book.png",
};

const getBookImage = (title: string): string => {
  return bookImages[title] || "/images/books/generic-book.png";
};

export const syllabusCards = [
  { title: "ONE", board: "PTB", gradient: "from-cyan-300 to-blue-400", comingSoon: false },
  { title: "TWO", board: "PTB", gradient: "from-green-600 to-lime-400", comingSoon: false },
  { title: "THREE", board: "PTB", gradient: "from-cyan-500 to-blue-500", comingSoon: false },
  { title: "FOUR", board: "PTB", gradient: "from-amber-300 to-orange-300", comingSoon: false },
  { title: "5TH", board: "PTB", gradient: "from-orange-500 to-yellow-400", comingSoon: false },
  { title: "6TH", board: "PTB", gradient: "from-blue-400 to-cyan-400", comingSoon: false },
  { title: "7TH", board: "PTB", gradient: "from-purple-500 to-pink-400", comingSoon: false },
  { title: "8TH", board: "PTB", gradient: "from-emerald-400 to-blue-700", comingSoon: false },
  { title: "9TH", board: "PTB", gradient: "from-cyan-300 to-blue-400", comingSoon: false },
  { title: "10TH", board: "PTB", gradient: "from-green-600 to-lime-400", comingSoon: false },
  { title: "INTER-I", board: "PTB", gradient: "from-cyan-500 to-blue-500", comingSoon: false },
  { title: "INTER-II", board: "PTB", gradient: "from-amber-300 to-orange-300", comingSoon: false },
];

export const afaqCards = [
  { title: "ONE", board: "AFAQ", gradient: "from-green-400 to-lime-300" },
  { title: "TWO", board: "AFAQ", gradient: "from-cyan-300 to-blue-400" },
  { title: "THREE", board: "AFAQ", gradient: "from-orange-300 to-amber-400" },
  { title: "FOUR", board: "AFAQ", gradient: "from-purple-500 to-pink-400" },
  { title: "5TH", board: "AFAQ", gradient: "from-blue-400 to-cyan-400" },
  { title: "6TH", board: "AFAQ", gradient: "from-emerald-400 to-blue-700" },
];

export const oxfordCards = [
  { title: "ONE",   board: "OXFORD", gradient: "from-cyan-400 to-blue-500" },
  { title: "TWO",   board: "OXFORD", gradient: "from-green-600 to-lime-400" },
  { title: "THREE", board: "OXFORD", gradient: "from-orange-500 to-yellow-400" },
  { title: "FOUR",  board: "OXFORD", gradient: "from-purple-500 to-pink-400" },
  { title: "5TH",   board: "OXFORD", gradient: "from-cyan-300 to-blue-400" },
];

export const goharCards = [
  { title: "ONE", board: "GOHAR", gradient: "from-orange-300 to-amber-400" },
  { title: "TWO", board: "GOHAR", gradient: "from-cyan-300 to-blue-400" },
  { title: "THREE", board: "GOHAR", gradient: "from-green-500 to-lime-400" },
  { title: "FOUR", board: "GOHAR", gradient: "from-purple-500 to-pink-400" },
  { title: "5TH", board: "GOHAR", gradient: "from-blue-400 to-cyan-400" },
  { title: "6TH", board: "GOHAR", gradient: "from-emerald-400 to-blue-700" },
  { title: "7TH", board: "GOHAR", gradient: "from-amber-300 to-orange-300" },
];

export const baCards = [
  { title: "B.A Part-I", board: "PU", gradient: "from-yellow-400 to-amber-500" },
  { title: "B.A Part-II", board: "PU", gradient: "from-cyan-400 to-blue-500" },
];

export const boardClassMap: Record<string, { title: string; board: string; gradient: string; image?: string; comingSoon?: boolean }[]> = {
  PTB: syllabusCards,
  AFAQ: afaqCards,
  OXFORD: oxfordCards,
  GOHAR: goharCards,
  BA: baCards,
};

export const ninthSubjects: SubjectCard[] = [
  { title: "Biology", subtitle: "", image: getBookImage("Biology") },
  { title: "Computer", subtitle: "", image: getBookImage("Computer"), showArrow: true },
  { title: "Chemistry", subtitle: "", image: getBookImage("Chemistry") },
  { title: "Physics", subtitle: "", image: getBookImage("Physics") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
  { title: "General Science", subtitle: "9TH", image: getBookImage("General Science") },
];

export const ninthOptionalSubjects: SubjectCard[] = [
  { title: "ایجوکیشن", subtitle: "9TH", image: getBookImage("ایجوکیشن") },
  { title: "پنجابی", subtitle: "9TH", image: getBookImage("پنجابی"), showArrow: true },
  { title: "اسلامیات اختیاری", subtitle: "9TH", image: getBookImage("اسلامیات اختیاری") },
  { title: "ہوم اکنامکس", subtitle: "9TH", image: getBookImage("ہوم اکنامکس") },
  { title: "معاشیات", subtitle: "9TH", image: getBookImage("معاشیات") },
  { title: "ترجمہ القرآن المجید", subtitle: "", image: getBookImage("ترجمہ القرآن المجید") },
  { title: "اخلاقیات", subtitle: "9TH", image: getBookImage("اخلاقیات") },
  { title: "علم شہریت", subtitle: "9TH", image: getBookImage("علم شہریت") },
  { title: "فزیکل ایجوکیشن", subtitle: "9TH", image: getBookImage("فزیکل ایجوکیشن") },
  { title: "مرغبانی", subtitle: "9TH", image: getBookImage("مرغبانی") },
  { title: "غذا اور غذائیت", subtitle: "PTB", image: getBookImage("غذا اور غذائیت") },
  { title: "پارچہ بافی اور لباس", subtitle: "9TH", image: getBookImage("پارچہ بافی اور لباس") },
];

export const tenthSubjects: SubjectCard[] = [
  { title: "Biology", subtitle: "10TH", image: getBookImage("Biology") },
  { title: "Computer", subtitle: "", image: getBookImage("Computer"), showArrow: true },
  { title: "Chemistry", subtitle: "10TH", image: getBookImage("Chemistry") },
  { title: "Physics", subtitle: "10TH", image: getBookImage("Physics") },
  { title: "Mathematics", subtitle: "10TH", image: getBookImage("Mathematics") },
  { title: "English", subtitle: "10TH", image: getBookImage("English") },
  { title: "Pakistan Studies", subtitle: "", image: getBookImage("Pakistan Studies") },
  { title: "اردو لازمی", subtitle: "10TH", image: getBookImage("اردو لازمی") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
];

export const tenthOptionalSubjects: SubjectCard[] = [
  { title: "General Science", subtitle: "10TH", image: getBookImage("General Science") },
  { title: "جنرل ریاضی", subtitle: "10TH", image: getBookImage("جنرل ریاضی") },
  { title: "ایجوکیشن", subtitle: "10TH", image: getBookImage("ایجوکیشن") },
  { title: "پنجابی", subtitle: "10TH", image: getBookImage("پنجابی") },
  { title: "اسلامیات اختیاری", subtitle: "10TH", image: getBookImage("اسلامیات اختیاری") },
  { title: "ہوم اکنامکس", subtitle: "10TH", image: getBookImage("ہوم اکنامکس") },
  { title: "معاشیات", subtitle: "10TH", image: getBookImage("معاشیات") },
  { title: "ترجمہ القرآن المجید", subtitle: "", image: getBookImage("ترجمہ القرآن المجید") },
  { title: "اخلاقیات", subtitle: "PTB", image: getBookImage("اخلاقیات") },
  { title: "علم شہریت", subtitle: "10TH", image: getBookImage("علم شہریت") },
  { title: "فزیکل ایجوکیشن", subtitle: "PTB", image: getBookImage("فزیکل ایجوکیشن") },
  { title: "مرغبانی", subtitle: "PTB", image: getBookImage("مرغبانی") },
  { title: "غذا اور غذائیت", subtitle: "PTB", image: getBookImage("غذا اور غذائیت") },
];

export const interOneCoreSubjects: SubjectCard[] = [
  { title: "Biology", subtitle: "", image: getBookImage("Biology"), showArrow: true },
  { title: "Chemistry", subtitle: "", image: getBookImage("Chemistry"), showArrow: true },
  { title: "Physics", subtitle: "", image: getBookImage("Physics"), showArrow: true },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
  { title: "Computer", subtitle: "", image: getBookImage("Computer") },
  { title: "Statistics", subtitle: "ICS", image: getBookImage("Statistics") },
  { title: "Economics", subtitle: "ICS", image: getBookImage("Economics") },
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "Principles of Accounting", subtitle: "I.COM", image: getBookImage("Principles of Accounting") },
];

export const interOneGeneralSubjects: SubjectCard[] = [
  { title: "Principles of Economics", subtitle: "I.COM", image: getBookImage("Principles of Economics") },
  { title: "Principles of Commerce", subtitle: "I.COM", image: getBookImage("Principles of Commerce"), showArrow: true },
  { title: "Business Maths", subtitle: "I.COM", image: getBookImage("Business Maths") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "ایجوکیشن", subtitle: "F.A", image: getBookImage("ایجوکیشن") },
  { title: "سوکس", subtitle: "F.A", image: getBookImage("سوکس") },
  { title: "پنجابی", subtitle: "F.A", image: getBookImage("پنجابی") },
  { title: "علم شہریت", subtitle: "F.A", image: getBookImage("علم شہریت") },
  { title: "اسلامیات اختیاری", subtitle: "F.A", image: getBookImage("اسلامیات اختیاری") },
  { title: "فزیکل ایجوکیشن", subtitle: "F.A", image: getBookImage("فزیکل ایجوکیشن") },
  { title: "سوشیالوجی", subtitle: "F.A", image: getBookImage("سوشیالوجی") },
  { title: "نفسیات", subtitle: "F.A", image: getBookImage("نفسیات") },
  { title: "اخلاقیات", subtitle: "PTB", image: getBookImage("اخلاقیات") },
];

export const interOneExtraSubjects: SubjectCard[] = [
  { title: "ترجمہ القرآن المجید", subtitle: "", image: getBookImage("ترجمہ القرآن المجید") },
  { title: "فارسی", subtitle: "PTB", image: getBookImage("فارسی") },
  { title: "تاریخ اسلام", subtitle: "PTB", image: getBookImage("تاریخ اسلام") },
  { title: "طبی جغرافیہ", subtitle: "PTB", image: getBookImage("طبی جغرافیہ") },
  { title: "لائبریری سائنس", subtitle: "PTB", image: getBookImage("لائبریری سائنس") },
];

// INTER-I subjects that are not part of the INTER-II list. Only the INTER-II map filters
// these out -- INTER-I keeps showing them.
const interTwoExcludedTitles = new Set([
  "Principles of Economics",
  "Principles of Commerce",
  "Business Maths",
  "اسلامیات لازمی",
  "سوکس",
  "علم شہریت",
  "اسلامیات اختیاری",
  "طبی جغرافیہ",
  "لائبریری سائنس",
]);

// INTER-II subjects whose questions are in the question bank. Every other INTER-II subject
// is shown as "Coming Soon" -- add a title here once its data has been seeded.
const interTwoReadyTitles = new Set([
  "Economics",
  "Pakistan Studies",
  "ایجوکیشن",
  "سوشیالوجی",
  "اخلاقیات",
  "ہوم اکنامکس",
  "پنجابی",
  "فزیکل ایجوکیشن",
  "نفسیات",
  "انسانی جغرافیہ",
  "ترجمہ القرآن المجید",
  "فارسی",
  "تاریخ اسلام",
]);
const forInterTwo = (cards: SubjectCard[]) =>
  cards
    .filter((card) => !interTwoExcludedTitles.has(card.title))
    .map((card) => (interTwoReadyTitles.has(card.title) ? card : { ...card, comingSoon: true }));

// INTER-II subjects that have no INTER-I counterpart (INTER-II shows the INTER-I list plus these).
const interTwoOnlySubjects: SubjectCard[] = [
  { title: "کاروباری شماریات", subtitle: "I.COM", image: getBookImage("کاروباری شماریات") },
  { title: "اصول بینکاری", subtitle: "I.COM", image: getBookImage("اصول بینکاری") },
  { title: "تجارتی جغرافیہ", subtitle: "I.COM", image: getBookImage("تجارتی جغرافیہ") },
  { title: "Pakistan Studies", subtitle: "", image: getBookImage("Pakistan Studies") },
  { title: "ہوم اکنامکس", subtitle: "PTB", image: getBookImage("ہوم اکنامکس") },
  { title: "انسانی جغرافیہ", subtitle: "PTB", image: getBookImage("انسانی جغرافیہ") },
];

// INTER-II shows the subjects that already have data first and the "Coming Soon" ones after
// them, as two groups so there is a gap between. The page prints the first card's subtitle as
// the group heading, so each group leads with a card that has no subtitle (no stray "ICS" etc.).
const buildInterTwoGroups = (): SubjectCard[][] => {
  const all = forInterTwo([
    ...interOneCoreSubjects,
    ...interOneGeneralSubjects,
    ...interOneExtraSubjects,
    ...interTwoOnlySubjects,
  ]);
  const leadWithUntitled = (cards: SubjectCard[]) => {
    const lead = cards.findIndex((card) => !card.subtitle);
    return lead > 0 ? [cards[lead], ...cards.filter((_, i) => i !== lead)] : cards;
  };
  return [
    leadWithUntitled(all.filter((card) => !card.comingSoon)),
    leadWithUntitled(all.filter((card) => card.comingSoon)),
  ];
};

export const interTwoCoreSubjects: SubjectCard[] = [
  { title: "Biology", subtitle: "FSc", image: getBookImage("Biology") },
  { title: "Chemistry", subtitle: "FSc", image: getBookImage("Chemistry"), showArrow: true },
  { title: "Physics", subtitle: "FSc", image: getBookImage("Physics") },
  { title: "Mathematics", subtitle: "FSc - ICS", image: getBookImage("Mathematics") },
  { title: "Computer", subtitle: "ICS", image: getBookImage("Computer") },
  { title: "Statistics", subtitle: "ICS", image: getBookImage("Statistics") },
  { title: "Economics", subtitle: "ICS", image: getBookImage("Economics") },
  { title: "English", subtitle: "12TH", image: getBookImage("English") },
  { title: "اصول محاسبت", subtitle: "I.COM", image: getBookImage("اصول محاسبت") },
];

export const interTwoCommerceSubjects: SubjectCard[] = [
  { title: "اصول بینکاری", subtitle: "I.COM", image: getBookImage("اصول بینکاری") },
  { title: "تجارتی جغرافیہ", subtitle: "I.COM", image: getBookImage("تجارتی جغرافیہ") },
  { title: "کاروباری شماریات", subtitle: "I.COM", image: getBookImage("کاروباری شماریات") },
  { title: "پاکستان کا معاشرہ", subtitle: "", image: getBookImage("پاکستان کا معاشرہ") },
  { title: "اردو لازمی", subtitle: "12TH", image: getBookImage("اردو لازمی") },
  { title: "ایجوکیشن", subtitle: "F.A", image: getBookImage("ایجوکیشن") },
  { title: "سوکس", subtitle: "F.A", image: getBookImage("سوکس") },
  { title: "پنجابی", subtitle: "F.A", image: getBookImage("پنجابی") },
  { title: "اسلامیات اختیاری", subtitle: "F.A", image: getBookImage("اسلامیات اختیاری") },
];

export const interTwoExtraSubjects: SubjectCard[] = [
  { title: "فزیکل ایجوکیشن", subtitle: "F.A", image: getBookImage("فزیکل ایجوکیشن") },
  { title: "سوشیالوجی", subtitle: "F.A", image: getBookImage("سوشیالوجی") },
  { title: "اخلاقیات", subtitle: "PTB", image: getBookImage("اخلاقیات") },
  { title: "ترجمہ القرآن المجید", subtitle: "", image: getBookImage("ترجمہ القرآن المجید") },
  { title: "قبلیت", subtitle: "PTB", image: getBookImage("قبلیت") },
  { title: "فارسی", subtitle: "PTB", image: getBookImage("فارسی") },
  { title: "تاریخ اسلام", subtitle: "PTB", image: getBookImage("تاریخ اسلام") },
  { title: "عربی الادب", subtitle: "F.A", image: getBookImage("عربی الادب") },
  { title: "رسالیہ جغرافیہ", subtitle: "PTB", image: getBookImage("رسالیہ جغرافیہ") },
  { title: "لائبریری سائنس", subtitle: "PTB", image: getBookImage("لائبریری سائنس") },
  { title: "ہوم اکنامکس", subtitle: "PTB", image: getBookImage("ہوم اکنامکس") },
  { title: "تاریخ پاکستان", subtitle: "PTB", image: getBookImage("تاریخ پاکستان") },
];

// ---- PTB Classes 1-8 & OLD BOOKS subjects ----

export const classOneSubjects: SubjectCard[] = [
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "General Knowledge", subtitle: "", image: getBookImage("General Knowledge") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
];

export const classTwoSubjects: SubjectCard[] = [
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
  { title: "واقفیت عامہ", subtitle: "", image: getBookImage("General Knowledge") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
  { title: "English", subtitle: "", image: getBookImage("English") },
];

export const classThreeSubjects: SubjectCard[] = [
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "General Knowledge", subtitle: "", image: getBookImage("General Knowledge") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
];

export const classFourSubjects: SubjectCard[] = [
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "General Science", subtitle: "", image: getBookImage("General Science") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "Social Study", subtitle: "", image: getBookImage("Social Study") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
];

export const classFifthSubjects: SubjectCard[] = [
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "General Science", subtitle: "", image: getBookImage("General Science") },
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
  { title: "Social Studies", subtitle: "", image: getBookImage("Social Studies") },
];

export const classSixthSubjects: SubjectCard[] = [
  { title: "ترجمہ القرآن", subtitle: "6th", image: getBookImage("ترجمہ القرآن") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "General Science", subtitle: "", image: getBookImage("General Science") },
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
  { title: "History", subtitle: "", image: getBookImage("History") },
  { title: "Geography", subtitle: "", image: getBookImage("Geography") },
  { title: "پنجابی", subtitle: "6th", image: getBookImage("پنجابی") },
  { title: "زرعی تعلیم", subtitle: "6th", image: getBookImage("زرعی تعلیم") },
  { title: "ہوم اکنامکس", subtitle: "6th", image: getBookImage("ہوم اکنامکس") },
  { title: "اخلاقیات", subtitle: "6th", image: getBookImage("اخلاقیات") },
  { title: "Computer", subtitle: "", image: getBookImage("Computer") },
];

export const classSeventhSubjects: SubjectCard[] = [
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "General Science", subtitle: "", image: getBookImage("General Science") },
  { title: "Geography", subtitle: "", image: getBookImage("Geography") },
  { title: "پنجابی", subtitle: "7th", image: getBookImage("پنجابی") },
  { title: "زرعی تعلیم", subtitle: "7th", image: getBookImage("زرعی تعلیم") },
  { title: "ہوم اکنامکس", subtitle: "7th", image: getBookImage("ہوم اکنامکس") },
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
  { title: "Computer", subtitle: "", image: getBookImage("Computer") },
  { title: "History", subtitle: "", image: getBookImage("History") },
  { title: "ترجمہ القرآن", subtitle: "", image: getBookImage("ترجمہ القرآن") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
];

export const classEighthSubjects: SubjectCard[] = [
  { title: "ترجمہ القرآن", subtitle: "", image: getBookImage("ترجمہ القرآن") },
  { title: "اسلامیات لازمی", subtitle: "", image: getBookImage("اسلامیات لازمی") },
  { title: "اردو لازمی", subtitle: "", image: getBookImage("اردو لازمی") },
  { title: "English", subtitle: "", image: getBookImage("English") },
  { title: "Mathematics", subtitle: "", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "", image: getBookImage("General Science") },
  { title: "Computer", subtitle: "", image: getBookImage("Computer") },
  { title: "جغرافیہ", subtitle: "", image: getBookImage("جغرافیہ") },
  { title: "تاریخ", subtitle: "", image: getBookImage("تاریخ") },
  { title: "اخلاقیات", subtitle: "8th", image: getBookImage("اخلاقیات") },
  { title: "پنجابی", subtitle: "8th", image: getBookImage("پنجابی") },
  { title: "زرعی تعلیم", subtitle: "8th", image: getBookImage("زرعی تعلیم") },
  { title: "ہوم اکنامکس", subtitle: "8th", image: getBookImage("ہوم اکنامکس") },
];

export const oldBooksSubjects: SubjectCard[] = [
  { title: "Biology", subtitle: "Old", image: getBookImage("Biology") },
  { title: "Chemistry", subtitle: "Old", image: getBookImage("Chemistry") },
  { title: "Physics", subtitle: "Old", image: getBookImage("Physics") },
  { title: "Mathematics", subtitle: "Old", image: getBookImage("Mathematics") },
  { title: "English", subtitle: "Old", image: getBookImage("English") },
  { title: "اردو لازمی", subtitle: "Old", image: getBookImage("اردو لازمی") },
  { title: "Computer", subtitle: "Old", image: getBookImage("Computer") },
  { title: "اسلامیات لازمی", subtitle: "Old", image: getBookImage("اسلامیات لازمی") },
  { title: "Pakistan Studies", subtitle: "Old", image: getBookImage("Pakistan Studies") },
  { title: "General Science", subtitle: "Old", image: getBookImage("General Science") },
];

// ---- SNC Boards (AFAQ, OXFORD, GOHAR) subjects ----
// Load AFAQ-specific subject lists (generated from AFAQ images)
// Prefer generated OCR output when present; fall back to manual `afaqSubjects.ts`.
import manualAfaq, { AfaqSubject } from "./afaqSubjects";
import generatedAfaq from "./afaqSubjects.generated.json";
import { oxfordClassSubjects } from "./oxfordSubjects";

const afaqClassSubjects: Record<string, AfaqSubject[]> = (generatedAfaq && Object.keys(generatedAfaq).length > 0)
  ? generatedAfaq as Record<string, AfaqSubject[]>
  : manualAfaq as Record<string, AfaqSubject[]>;

const makeSNCGroups = (items: AfaqSubject[]): SubjectCard[][] => {
  const groups = new Map<string, SubjectCard[]>();
  for (const it of items) {
    const series = it.series || "";
    if (!groups.has(series)) groups.set(series, []);
    groups.get(series)!.push({ title: it.title, subtitle: series, image: getBookImage(it.title) });
  }
  return Array.from(groups.values());
};

const sncClassMap: Record<string, SubjectCard[][]> = Object.fromEntries(
  Object.entries(afaqClassSubjects).map(([className, items]) => [className, makeSNCGroups(items)]),
) as Record<string, SubjectCard[][]>;

const oxfordClassMap: Record<string, SubjectCard[][]> = Object.fromEntries(
  Object.entries(oxfordClassSubjects).map(([className, items]) => [className, makeSNCGroups(items)]),
) as Record<string, SubjectCard[][]>;

// ---- B.A subjects ----
const baPartOneSubjects: SubjectCard[] = [
  { title: "English", subtitle: "3RD YEAR", image: getBookImage("English") },
  { title: "اسلامیات لازمی", subtitle: "3RD YEAR", image: getBookImage("اسلامیات لازمی") },
  { title: "مطالعہ پاکستان", subtitle: "3RD YEAR", image: getBookImage("مطالعہ پاکستان") },
  { title: "اسلامیات اختیاری", subtitle: "3RD YEAR", image: getBookImage("اسلامیات اختیاری") },
  { title: "علم التعلیم", subtitle: "3RD YEAR", image: getBookImage("علم التعلیم") },
  { title: "امور صحافت", subtitle: "3RD YEAR", image: getBookImage("امور صحافت") },
  { title: "کشمیرات", subtitle: "3RD YEAR", image: getBookImage("کشمیرات") },
  { title: "عمرانیات", subtitle: "3RD YEAR", image: getBookImage("عمرانیات") },
  { title: "پنجابی", subtitle: "3RD YEAR", image: getBookImage("پنجابی") },
  { title: "عربی", subtitle: "3RD YEAR", image: getBookImage("عربی") },
  { title: "سیاسیات", subtitle: "3RD YEAR", image: getBookImage("سیاسیات") },
];
const baPartTwoSubjects: SubjectCard[] = [
  { title: "English", subtitle: "B.A", image: getBookImage("English") },
  { title: "گلشن فارسی", subtitle: "B.A", image: getBookImage("گلشن فارسی") },
  { title: "امور صحافت", subtitle: "B.A", image: getBookImage("امور صحافت") },
  { title: "اسلامیات اختیاری", subtitle: "B.A", image: getBookImage("اسلامیات اختیاری") },
  { title: "سیاسیات", subtitle: "B.A", image: getBookImage("سیاسیات") },
  { title: "پنجابی", subtitle: "B.A", image: getBookImage("پنجابی") },
];

const baClassMap: Record<string, SubjectCard[][]> = {
  "B.A Part-I": [baPartOneSubjects],
  "B.A Part-II": [baPartTwoSubjects],
};

// Unified map: class title -> array of subject groups
export const ptbClassSubjectsMap: Record<string, SubjectCard[][]> = {
  "ONE": [classOneSubjects],
  "TWO": [classTwoSubjects],
  "THREE": [classThreeSubjects],
  "FOUR": [classFourSubjects],
  "5TH": [classFifthSubjects],
  "6TH": [classSixthSubjects],
  "7TH": [classSeventhSubjects],
  "8TH": [classEighthSubjects],
  "9TH": [ninthSubjects, ninthOptionalSubjects],
  "10TH": [
    [...ninthSubjects, { title: "Pakistan Studies", subtitle: "10TH", image: getBookImage("Pakistan Studies") }],
    [
      ...ninthOptionalSubjects.filter(s => s.title !== "پارچہ بافی اور لباس").map(s => s.title === "علم شہریت" ? { ...s, title: "Civics" } : s),
      { title: "Electrical Wiring", subtitle: "10TH", image: getBookImage("Electrical Wiring") },
      { title: "Textile and Clothing", subtitle: "10TH", image: getBookImage("Textile and Clothing") },
    ],
  ],
  "INTER-I": [interOneCoreSubjects, interOneGeneralSubjects, interOneExtraSubjects],
  "INTER-II": buildInterTwoGroups(),
};

// Board-level map: board name -> class -> subjects
export const boardSubjectsMap: Record<string, Record<string, SubjectCard[][]>> = {
  PTB: ptbClassSubjectsMap,
  AFAQ: sncClassMap,
  OXFORD: oxfordClassMap,
  GOHAR: sncClassMap,
  BA: baClassMap,
};

export const boardCards = [
  { name: "PTB", label: "PTB", subtitle: "Syllabus", logo: "/images/PTBLogo.png", gradient: "from-cyan-300 to-blue-400", comingSoon: false },
  { name: "AFAQ", label: "AFAQ", subtitle: "Syllabus", logo: "/images/AfaqLogo.png", gradient: "from-green-500 to-lime-400", comingSoon: false },
  { name: "OXFORD", label: "OXFORD", subtitle: "Syllabus", logo: "/images/OxfordLogo.png", gradient: "from-cyan-400 to-blue-500", comingSoon: false },

  { name: "BA", label: "B.A", subtitle: "Syllabus", logo: "/images/PULogo.png", gradient: "from-yellow-400 to-amber-500", comingSoon: false },
];

export const allSubjectTitles: string[] = Array.from(
  new Set(
    Object.values(boardSubjectsMap)
      .flatMap((classMap) => Object.values(classMap))
      .flatMap((groups) => groups)
      .flatMap((subjects) => subjects.map((subject) => subject.title))
      .map((title) => title.trim())
      .filter(Boolean),
  ),
).sort((a, b) => a.localeCompare(b));

export type BoardSubjectOption = {
  value: string;
  label: string;
  board: string;
  className: string;
  title: string;
};

export const allBoardSubjectOptions: BoardSubjectOption[] = Object.entries(boardSubjectsMap)
  .flatMap(([board, classMap]) =>
    Object.entries(classMap).flatMap(([className, groups]) =>
      groups.flatMap((subjects) =>
        subjects.map((subject) => {
          const title = subject.title.trim();
          const series = (subject.subtitle || '').trim();
          const label = series ? `${board} - ${className} - ${title} (${series})` : `${board} - ${className} - ${title}`;
          return {
            value: label,
            label,
            board,
            className,
            title,
          };
        }),
      ),
    ),
  )
  .sort((a, b) => a.label.localeCompare(b.label));

// ---- Chapter/Topic Data Structure ----
export type ChapterGroup = {
  name: string;
  chapters: string[];
};

// Computer 10th PTB
const computer10thChapters: ChapterGroup[] = [
  {
    name: "CHAP 1: Introduction to Programming",
    chapters: [
      "1.1 Programming Environment",
      "1.2 Programming Basics",
      "1.3 Constant and Variables",
      "1.01 Past Multiple choice question",
    ],
  },
  {
    name: "CHAP 2: User Interface",
    chapters: [
      "2.1 Input / Output (I/O) Function",
      "2.2 Operators",
      "2.01 Past Multiple choice question",
    ],
  },
  {
    name: "CHAP 3: Conditional Logic",
    chapters: [
      "3.1 Control Statments",
      "3.2 Selection Statements",
    ],
  },
  {
    name: "CHAP 4: Data and Repetition",
    chapters: [
      "4.1 Data Structure",
      "4.2 Loop Structures",
    ],
  },
  {
    name: "CHAP 5: Functions",
    chapters: [
      "5.1 Functions",
    ],
  },
];

// Chemistry 10th PTB
const chemistry10thChapters: ChapterGroup[] = [
  {
    name: "CHAP 1: Chemical Equilibrium",
    chapters: [
      "1.1 Reversible Reaction and Dynamic",
      "1.2 Law of Mass Action and Derivation of the Expression for the Equilibrium",
      "1.3 Equilibrium Constant and its Units",
      "1.4 Importance of Equilibrium Constant",
    ],
  },
  {
    name: "CHAP 2: Acid, Bases and Salts",
    chapters: [
      "2.1 Concepts of Acids, Bases",
      "2.2 pH Scale",
      "2.3 Salts",
    ],
  },
  {
    name: "CHAP 3: Organic Chemistry",
    chapters: [
      "3.1 Organic Compounds",
      "3.2 Sources of Organic Compounds",
      "3.3 Uses of Organic Compounds",
      "3.4 Alkanes and Alkyl Radicals",
      "3.5 Functional Groups",
      "3.6 Tests of Functional Groups",
    ],
  },
  {
    name: "CHAP 4: Hydrocarbons",
    chapters: [
      "4.1 Alkanes",
      "4.2 Alkenes",
      "4.3 Alkynes",
    ],
  },
  {
    name: "CHAP 5: Biochemistry",
    chapters: [
      "5.1 Carbohydrates",
      "5.2 Proteins",
      "5.3 Lipids",
      "5.4 Nucleic acids",
      "5.5 Vitamins",
    ],
  },
  {
    name: "CHAP 6: The Atmosphere",
    chapters: [
      "6.1 composition of Atmosphere",
      "6.2 Layers of Atmosphere",
      "6.3 Air Pollutants",
      "6.4 Acid Rain and its Effects",
      "6.5 Ozone Depletion and its Effects",
    ],
  },
  {
    name: "CHAP 7: Water",
    chapters: [
      "7.1 Properties of Water",
      "7.2 Water as Solvent",
      "7.3 Soft and Hard Water",
      "7.4 Types of Hardness",
      "7.5 Methods of Removing Hardness",
      "7.6 Disadvantages of Water Hardness",
      "7.7 Water Pollution",
      "7.8 Water borne Diseases",
    ],
  },
  {
    name: "CHAP 8: Chemical Industries",
    chapters: [
      "8.1 Basic Metallurgical Operations",
      "8.2 Solvay's Process",
      "8.4 Petroleum Industry",
      "8.3 Manufacture of Urea",
    ],
  },
];

// English 10th PTB
const english10thChapters: ChapterGroup[] = [
  {
    name: "CHAP 1: Hazrat Muhammad ﷺ an Embodiment of Justice",
    chapters: [
      "1.1 Hazrat Muhammad ﷺ an Embodiment of Justice",
      "Past Papers MCQ",
    ],
  },
  {
    name: "CHAP 2: Chinese New Year",
    chapters: [
      "2.2 Chinese New Year",
    ],
  },
  {
    name: "CHAP 3: Poem : Try Again",
    chapters: [
      "3.1 Poem: Try Again",
    ],
  },
  {
    name: "CHAP 4: First Aid",
    chapters: [
      "4.1 First Aid",
    ],
  },
  {
    name: "CHAP 5: Poem: The Rain",
    chapters: [
      "5.1 Poem : The Rain",
    ],
  },
  {
    name: "CHAP 6: Television vs. Newspapers",
    chapters: [
      "6.1 Television vs. Newspapers",
    ],
  },
  {
    name: "CHAP 7: Little by Little One Walks Far!",
    chapters: [
      "7.1 Little by Little One Walks Far!",
    ],
  },
  {
    name: "CHAP 8: Poem : Peace",
    chapters: [
      "8.1 Poem : Peace",
    ],
  },
  {
    name: "CHAP 9: Selecting the Right Career",
    chapters: [
      "9.1 Selecting the Right Career",
    ],
  },
  {
    name: "CHAP 10: A World Without books",
    chapters: [
      "10.1 A World Without books",
    ],
  },
  {
    name: "CHAP 11: Great Expectations",
    chapters: [
      "11.1 Great Expectations",
    ],
  },
  {
    name: "CHAP 12: Population Growth and World Food Supplies",
    chapters: [
      "12.1 Population Growth and World Food Supplies",
    ],
  },
  {
    name: "CHAP 13: Faithfulness",
    chapters: [
      "13.1 Faithfulness",
    ],
  },
  {
    name: "CHAP 14: Present Tense",
    chapters: [
      "14.1 Present Indefinite Tense",
      "14.2 Present Continuous Tense",
      "14.3 Present Perfect Tense",
      "14.4 Present Perfect Continues Tense",
    ],
  },
  {
    name: "CHAP 15: Past Tense",
    chapters: [
      "15.1 Past Indefinite Tense",
      "15.2 Past Continues Tense",
      "15.3 Past Perfect Tense",
      "15.4 Past Perfect Continues Tense",
    ],
  },
  {
    name: "CHAP 16: Future Tense",
    chapters: [
      "16.1 Future Indefinite Tense",
      "16.2 Future Continuous Tense",
      "16.3 Future Perfect Tense",
      "16.4 Future Perfect Continues Tense",
    ],
  },
  {
    name: "CHAP 17: Direct & Indirect",
    chapters: [
      "17.1 Assertive Sentences",
      "17.2 Interrogative Sentences",
      "17.3 Imperative Sentences",
      "17.4 Exclamatory/Optative Sentences",
      "17.5 Let Sentences",
    ],
  },
  {
    name: "CHAP 18: English B",
    chapters: [
      "18.1 Pair of Words",
      "18.2 Essays",
      "18.3 Writing Paragraphs",
      "18.4 Translate into English Paragraphs",
    ],
  },
];

// Urdu (Lazmi) 10th PTB
const urdu10thChapters: ChapterGroup[] = [
  {
    name: "CHAP 1: نظم نمبر 1: حمد",
    chapters: ["1.1 حمد"],
  },
  {
    name: "CHAP 2: نظم نمبر 2: نعت",
    chapters: ["2.1 نعت"],
  },
  {
    name: "CHAP 3: نثر نمبر 3: مرزا محمد سعید",
    chapters: ["3.1 مرزا محمد سعید"],
  },
  {
    name: "CHAP 4: نثر نمبر 4: نظریۂ پاکستان",
    chapters: ["4.1 نظریۂ پاکستان"],
  },
  {
    name: "CHAP 5: نثر نمبر 5: پرستان کی شہزادی",
    chapters: ["5.1 پرستان کی شہزادی"],
  },
  {
    name: "CHAP 6: نثر نمبر 6: اردو ادب میں عیدالفطر",
    chapters: ["6.1 اردو ادب میں عیدالفطر"],
  },
  {
    name: "CHAP 7: نثر نمبر 7: مجھے میرے دوستوں سے بچاؤ",
    chapters: ["7.1 مجھے میرے دوستوں سے بچاؤ"],
  },
  {
    name: "CHAP 8: نثر نمبر 8: ملَمَّع",
    chapters: ["8.1 ملَمَّع"],
  },
  {
    name: "CHAP 9: نثر نمبر 9: چغل خور",
    chapters: ["9.1 چغل خور"],
  },
  {
    name: "CHAP 10: نثر نمبر 10: نام دیو مالی",
    chapters: ["10.1 نام دیو مالی"],
  },
  {
    name: "CHAP 11: نثر نمبر 11: علی بخش",
    chapters: ["11.1 علی بخش"],
  },
  {
    name: "CHAP 12: نثر نمبر 12: استنبول",
    chapters: ["12.1 استنبول"],
  },
  {
    name: "CHAP 13: نثر نمبر 13: خطوطِ غالب",
    chapters: ["13.1 خطوطِ غالب"],
  },
  {
    name: "CHAP 14: نثر نمبر 14: خطوطِ رشید احمد صدیقی",
    chapters: ["14.1 خطوطِ رشید احمد صدیقی"],
  },
  {
    name: "CHAP 15: نظم نمبر 15: میدانِ کربلا میں گرمی کی شدت",
    chapters: ["15.1 میدانِ کربلا میں گرمی کی شدت"],
  },
  {
    name: "CHAP 16: نظم نمبر 16: فاطمہ بنتِ عبداللہ",
    chapters: ["16.1 فاطمہ بنتِ عبداللہ"],
  },
  {
    name: "CHAP 17: نظم نمبر 17: کسان",
    chapters: ["17.1 کسان"],
  },
  {
    name: "CHAP 18: نظم نمبر 18: جیوے جیوے پاکسان",
    chapters: ["18.1 جیوے جیوے پاکسان"],
  },
  {
    name: "CHAP 19: نظم نمبر 19: اونٹ کی شادی",
    chapters: ["19.1 اونٹ کی شادی"],
  },
  {
    name: "CHAP 20: نظم نمبر 20: مال گودام روڈ",
    chapters: ["20.1 مال گودام روڈ"],
  },
  {
    name: "CHAP 21: غزل نمبر 21: مصیبت بھی راحت فزا ہوگئی ہے",
    chapters: ["21.1 مصیبت بھی راحت فزا ہوگئی ہے"],
  },
  {
    name: "CHAP 22: غزل نمبر 22: آدمی آدمی سے ملتا ہے",
    chapters: ["22.1 آدمی آدمی سے ملتا ہے"],
  },
  {
    name: "CHAP 23: غزل نمبر 23: سر میں سودا بھی نہیں،دل میں تمناّ بھی نہیں",
    chapters: ["23.1 سر میں سودا بھی نہیں،دل میں تمناّ بھی نہیں"],
  },
  {
    name: "CHAP 24: غزل نمبر 24: یہ فخر تو حاصل ہے،بْرے ہیں کہ بھلے ہیں",
    chapters: ["24.1 یہ فخر تو حاصل ہے،بْرے ہیں کہ بھلے ہیں"],
  },
  {
    name: "CHAP 25: اُردو (ب)",
    chapters: [
      "25.1 مضامین",
      "25.2 تفہیم عبارات",
      "25.3 گرائمر معروضی",
      "25.4 اعراب لگائیں",
    ],
  },
];

// Default chapters for subjects that don't have specific ones
const defaultChapters: ChapterGroup[] = [
  {
    name: "Chapter 1",
    chapters: ["Topic 1.1", "Topic 1.2", "Topic 1.3"],
  },
  {
    name: "Chapter 2",
    chapters: ["Topic 2.1", "Topic 2.2"],
  },
  {
    name: "Chapter 3",
    chapters: ["Topic 3.1", "Topic 3.2", "Topic 3.3"],
  },
];

// English INTER-I (1st year) PTB chapters (provided topics)
const englishInterOneChapters: ChapterGroup[] = [
  { name: "UNIT 1: Khatam-un-Nabiyeen Hazrat Muhammad خاتم النبین ﷺ", chapters: ["1.1 Khatam-un-Nabiyeen Hazrat Muhammad خاتم النبین ﷺ"] },
  { name: "UNIT 2: Responsibility of the Youth in Nation-Building", chapters: ["2.1 Responsibility of the Youth in Nation-Building"] },
  { name: "UNIT 3: A Bird Came Down the Walk (Poem)", chapters: ["3.1 A Bird Came Down the Walk"] },
  { name: "UNIT 4: Team Moon", chapters: ["4.1 Team Moon"] },
  { name: "UNIT 5: Impact of Global Warming on Pakistan", chapters: ["5.1 Impact of Global Warming on Pakistan"] },
  { name: "UNIT 6: The Echoing Green (Poem)", chapters: ["6.1 The Echoing Green (Poem)"] },
  { name: "UNIT 7: What You Do is What You Are", chapters: ["7.1 What You Do is What You Are"] },
  { name: "UNIT 8: Clean Water", chapters: ["8.1 Clean Water"] },
  { name: "UNIT 9: Freedom (Poem)", chapters: ["9.1 Freedom"] },
  { name: "UNIT 10: The Punishment of Shahpesh, the Persian, on Khipil, the Builder", chapters: ["10.1 The Punishment of Khipil"] },
  { name: "UNIT 11: Those Winter Sundays (Poem)", chapters: ["11.1 Those Winter Sundays"] },
  { name: "UNIT 12: The Impact of AI on Society, Human Relationships, and Ethics", chapters: ["12.1 The Impact of AI on Society..."] },
  { name: "UNIT 13: Ruba'iyat (Poem)", chapters: ["13.1 Ruba'iyat"] },
  { name: "UNIT 14: The End of the Beginning", chapters: ["14.1 The End of the Beginning"] },
  { name: "English (B)", chapters: ["Letters", "Applications", "Stories", "Pair of words"] },
  { name: "Correct Form Of Verb", chapters: [
    "Present Indefinite",
    "Present Continuous",
    "Present Perfect Tense",
    "Present Perfect Continuous Tense",
    "Past Indefinite Tense",
    "Past Continuous Tense",
    "Past Perfect Tense",
    "Past Perfect Continuous Tense",
    "Future Indefinite Tense",
    "Future Continuous Tense",
    "Future Perfect Tense",
    "Future Perfect Continuous Tense",
  ] },
];

// Physics INTER-I (1st year) PTB chapters
const physicsInterOneChapters: ChapterGroup[] = [
  {
    name: "CHAP 1: Measurements",
    chapters: [
      "1.1 Physical Quantities And Their Units",
      "1.2 International System Of Units",
      "1.3 Uncertainty In Measurement",
      "1.4 Use Of Significant Figures",
      "1.5 Precision And Accuracy",
      "1.6 Assessment Of Total Uncertainty In The Final Result",
      "1.7 Dimensions Of Physical Quantities",
    ],
  },
  {
    name: "CHAP 2: Force and Motion",
    chapters: [
      "2.1 Scalars",
      "2.2 Vectors",
      "2.3 Product Of Two Vectors",
      "2.4 Equations Of Motions",
      "2.5 Motion Under Gravity",
      "2.6 Projectile Motion",
      "2.7 Momentum",
      "2.8 Elastic And Inelastic Collisions",
      "2.9 Inelastic Collision In One Dimension",
      "2.10 Elastic Collision In Two Dimensions",
      "2.11 Inelastic Collision In Two Dimensions",
      "2.12 Rocket Propulsion",
    ],
  },
  {
    name: "CHAP 3: Circular and Rotational Motion",
    chapters: [
      "3.1 Angular Measurements",
      "3.2 Centripetal Force",
      "3.3 Artificial Satellites",
      "3.4 Moment of Inertia",
      "3.5 Angular Momentum",
      "3.6 Law of Conservation of Angular Momentum",
    ],
  },
  {
    name: "CHAP 4: Work, Energy and Power",
    chapters: [
      "4.1 Work Done by a Constant Force",
      "4.2 Work Done by a Variable Force",
      "4.3 Conservative and non-Conservative Forces",
      "4.4 Power",
      "4.5 Energy",
      "4.6 Escape Velocity",
      "4.7 Work-Energy Theorem",
      "4.8 Interconversion of Potential Energy And Kinetic Energy",
    ],
  },
  {
    name: "CHAP 5: Solids and Fluid Dynamics",
    chapters: [
      "5.1 Classification of Solids",
      "5.2 Mechanical Properties of Solids",
      "5.3 Stress, Strain and young's Modulus",
      "5.4 Determination of Young's Modulus of a Wire",
      "5.5 Elastic Deformation, Plastic Deformation and Elastic Limit",
      "5.6 Strain Energy in Deformed Materials",
      "5.7 Archimedes Principle and Floatation",
      "5.8 Steady, Non-Viscous and Ideal Fluid",
      "5.9 Equations of Continuity",
      "5.10 Increase in Flow Velocity",
      "5.11 Bernoulli's Equation",
      "5.12 Uses of Bernoulli's Equation",
      "5.13 Viscous Drag and Stokes' Law",
      "5.14 Terminal Velocity",
      "5.15 Real Fluids are Viscous Fluids",
      "5.16 Superfluids",
    ],
  },
  {
    name: "CHAP 6: Heat and Thermodynamics",
    chapters: [
      "6.1 Assumptions of the Kinetic Theory of Gases",
      "6.2 Internal Energy",
      "6.3 Heat and Work",
      "6.4 First Law of Thermodynamics",
      "6.5 Reversible and Irreversible Processes",
      "6.6 Heat Engine",
      "6.7 Second Law of Thermodynamics",
      "6.8 Carnot Engine and Carnot's Theorem",
      "6.9 Refrigerator",
      "6.10 Entropy",
    ],
  },
  {
    name: "CHAP 7: Waves and Vibrations",
    chapters: [
      "7.1 Waves",
      "7.2 Principle of of Superposition of Waves",
      "7.3 Interference and Its Types",
      "7.4 Stationary Waves & Their Formation",
      "7.5 Stationary Waves on a Stretched String",
      "7.6 Stationary Waves in air Columns",
      "7.7 Experiment Demonstrating Stationary Wave Using Microwaves",
      "7.8 Diffraction of Waves",
      "7.9 Beats",
      "7.10 Intensity (I) of a Wave",
      "7.11 Doppler Effect",
      "7.12 Applications of Doppler Effect",
    ],
  },
  {
    name: "CHAP 8: Physical Optics and Gravitational Waves",
    chapters: [
      "8.1 Polarization of Light",
      "8.2 Types of Polarization",
      "8.3 Production and Detection of Plane Polarized Light",
      "8.4 Polarization of Light By The Method of Reflection",
      "8.5 Malus's Law",
      "8.6 Gravitational Waves (GWs)",
      "8.7 Interferometer",
    ],
  },
  {
    name: "CHAP 9: Electrostatics and Current Electricity",
    chapters: [
      "9.1 Coulomb's Law",
      "9.2 Electric Field Strength",
      "9.3 Electric Flux",
      "9.4 Gauss's Law",
      "9.5 Electric Potential",
      "9.6 Electron Volt",
      "9.7 Motion of Charged Particles in A Uniform Electric Field",
      "9.8 Path of a Charged Particle",
      "9.9 Shielding From External Electric Field",
      "9.10 Electric Current",
      "9.11 Current through a Conductor",
      "9.12 Ohm's Law",
      "9.13 Resistivity and Its Dependence Upon Temperature",
      "9.14 Electric Power",
      "9.15 Electromotive Force (EMF) And Potential Difference",
      "9.16 Kirchhoff's Rules",
      "9.17 Wheatstone Bridge",
      "9.18 Potentiometer",
      "9.19 Use of Galvanometer",
      "9.20 Thermistors",
      "9.21 Light Dependent Resistor",
      "9.22 Constructed Response Questions",
    ],
  },
  {
    name: "CHAP 10: Electromagnetism",
    chapters: [
      "10.1 Force on a Current-Carrying Conductor In A Uniform Magnetic Field",
      "10.2 Magnetic Flux and Flux Density",
      "10.3 Magnetic Flux Linkage",
      "10.4 Motion of A Charged Particles In a Magnetic Field",
      "10.5 Velocity Selector",
      "10.6 Induced EMF and Faraday's Law",
      "10.7 Lenz's Law And Direction of Induced EMF",
      "10.8 Factors Affecting EMF",
      "10.9 Ferrofluids",
      "10.10 A Seismometer",
      "10.11 Constructed Response Questions",
    ],
  },
  {
    name: "CHAP 11: Special Theory of Relativity",
    chapters: [
      "11.1 Relative Motion",
      "11.2 Frames of Reference",
      "11.3 Special Theory of Relativity",
      "11.4 The Equivalence Between Mass and Energy",
      "11.5 Space-time in Relativity",
      "11.6 Constructed Response Questions",
    ],
  },
  {
    name: "CHAP 12: Nuclear and Particle Physics",
    chapters: [
      "12.1 Structure and Properties of the Nucleus",
      "12.2 Fundamental Forces of Nature",
      "12.3 Matter and Anti-matter",
      "12.4 Radioactivity",
      "12.5 Fundamental Particles",
      "12.6 Quarks",
      "12.7 Higgs Boson",
      "12.8 Conservation Laws",
      "12.9 The Asymmetry of Matter and Anti-matter in the Universe",
      "12.10 Most of the Matter in the Observable Universe in Plasma",
      "12.11 The Theories about the Forces between the Masses of Particles",
      "12.12 The Standard Model",
      "12.13 Constructed Response Questions",
    ],
  },
];

// Chemistry INTER-I (1st year) PTB chapters
const chemistryInterOneChapters: ChapterGroup[] = [
  {
    name: "CHAP 1: Periodic Table and Periodic Properties",
    chapters: [
      "1.1 Historical Background",
      "1.2 Modern Periodic Table - Main Features",
      "1.3 Metals Non-Metals And Metalloids",
      "1.4 Blocks In Periodic Table",
      "1.5 Families In Periodic-Table",
      "1.6 Periodic Arrangement And Electronic Configuration",
      "1.7 Periodicity Of Properties",
      "1.8 Reactions Of Sodium And Magnesium",
      "1.9 Trends In Bonding In Oxides And Chlorides Of Period 3",
      "1.10 Variation In Oxidation Number In Oxides And Chlorides",
    ],
  },
  {
    name: "CHAP 2: Atomic Structure",
    chapters: [
      "2.1 Atomic Number Proton Number And Nucleon Number Identity Of An Element",
      "2.2 Effect Of Electric Field On Fundamental Particles",
      "2.3 Experimental Evidences For The Electronic Configuration",
      "2.4 Quantum Numbers",
      "2.5 Shapes Of Atomic Orbitals",
      "2.6 Electronic Configuration",
      "2.7 Electronic Configuration And The Periodic Table",
      "2.8 Electronic Configuration Of Ions And Free Radicals",
      "2.9 Electronic Configuration And The Formation Of Semiconductors",
      "2.10 Excercise Short questions",
    ],
  },
  {
    name: "CHAP 3: Chemical Bonding",
    chapters: [
      "3.1 Types Of Bonding",
      "3.2 Electronegativity And The Type Of Bond",
      "3.3 Intermolecular Forces",
      "3.4 Bond Energy And Bond Length",
      "3.5 A Comparison Among Ionic, Covalent, Metallic Bonds And Intermolecular Forces",
      "3.6 Valence Bond Theory (VBT)",
      "3.7 Atomic Orbital Hybridization",
      "3.8 Valence Shell Electron Pair Repulsion Model (VSEPR)",
      "3.9 Molecular Orbital Theory (MOT)",
    ],
  },
  {
    name: "CHAP 4: Stoichiometry",
    chapters: [
      "4.1 Concept of Mole",
      "4.2 Relationship Between Mole, Molar Mass And Avogadro’s Number",
      "4.3 Molar Volume",
      "4.4 Molar Mass and Density of Gases",
      "4.5 Molar Concentration",
      "4.6 Stoichiometric Relationships",
      "4.7 Limiting and Excess Reactant",
      "4.8 Theoretical Yield and Actual Yield",
      "4.9 Importance Of Stoichiometry In Production And Dosage Of Medicine",
    ],
  },
  {
    name: "CHAP 5: States and Phases of Matter",
    chapters: [
      "5.1 Properties of Gases",
      "5.2 Ideal Gas Equation",
      "5.3 Properties of Liquids",
      "5.4 Intermolecular Forces",
      "5.5 Surface Tension of Liquid",
      "5.6 Viscosity of Liquids",
      "5.7 Evaporation",
      "5.8 Vapour Pressure",
      "5.9 Boiling Point",
      "5.10 Energetics of Phase Changes",
      "5.11 Solids",
      "5.12 Types of Solids",
      "5.13 Liquid Crystals",
    ],
  },
  {
    name: "CHAP 6: Chemical Energetics",
    chapters: [
      "6.1 Enthalpy Change",
      "6.2 Energy Profile Diagram",
      "6.3 Standard Enthalpy Changes",
      "6.4 Bond Energy (Bond Dissociation Energy) And Enthalpy Changes",
      "6.5 Enthalpy Change of Reaction (△Hr) And Chemical Bonds",
      "6.6 Measurement of Enthalpy change of a Reaction",
      "6.7 Enthalpy Change And Calorie Content of Food",
      "6.8 Hess's Law of Heat Summation",
      "6.9 Energetics of Solution",
      "6.10 Born-Haber Cycle",
      "6.11 Entropy",
      "6.12 The Free Energy Change,△G",
    ],
  },
  {
    name: "CHAP 7: Reaction Kinetics",
    chapters: [
      "7.1 Collision Theory",
      "7.2 Rate of Reaction",
      "7.3 Factors Affection Rate of a Chemical Reaction",
      "7.4 Rate Law, Rate Constant and Order of Reaction",
      "7.5 Determination of Rate Constant",
      "7.6 Reaction Mechanism",
    ],
  },
  {
    name: "CHAP 8: Chemical Equilibrium",
    chapters: [
      "8.1 Macroscopic Events and Microscopic Events",
      "8.2 Reversible Reactions, Microscopic Events And Dynamic Equilibrium",
      "8.3 Relation Between Macroscopic And Microscopic Events",
      "8.4 Dynamic Equilibrium Between Two Physical States",
      "8.5 Conditions for Equilibrium",
      "8.6 Characteristics Of Chemical Equilibrium",
      "8.7 Types of Equilibrium",
      "8.8 Equilibrium Constant and Position of Equilibrium",
      "8.9 Relationship Between Various Equilibrium Constant",
      "8.10 Position Of Equilibrium And Reaction Conditions",
      "8.11 Le-Chatelier's Principle",
      "8.12 The Effect of Change of Concentrations",
      "8.13 The Effect of Change in Pressure Or Volume",
      "8.14 The Effect Of Change in Temperature",
      "8.15 Effect Of Catalyst on Equilibrium",
      "8.16 Industrial Application of Chemical Equilibrium",
    ],
  },
  {
    name: "CHAP 9: Acid-Base Chemistry",
    chapters: [
      "9.1 Bronsted-Lowry Concept",
      "9.2 Lewis Concept of Acids And Bases",
      "9.3 Ionic Product water",
      "9.4 pH and pOH",
      "9.5 Ionization Constant of a Acids (Ka)",
      "9.6 Common Ion Effect",
      "9.7 Buffer Solutions",
      "9.8 Solubility Product",
      "9.9 Salt Hydrolysis",
      "9.10 Acid-Base Indicators",
    ],
  },
  {
    name: "CHAP 10: Electrochemistry",
    chapters: [
      "10.1 Oxidation, Reduction, and Redox Reactions",
      "10.2 Oxidation Number and Its Significance",
      "10.3 Disproportionnation Reaction",
      "10.4 Oxidizing Agent (oxidant) and Reducing Agent (Reductant)",
      "10.5 Balancing Of Redox Equations by Oxidation Number Method",
      "10.6 Electrolytic Cell",
      "10.7 Redox Reactions In Electrolysis",
      "10.8 Mass of a Substance Deposited During Electrolysis",
      "10.9 Amount of Substance Produced During Electrolysis",
      "10.10 Avogadro's Constant By The Electrolytic Method",
      "10.11 Electrode Potentials",
      "10.12 Standard Hydrogen Electrode (SHE)",
      "10.13 Standard Electrode Potential (E)",
      "10.14 Measuring Standard Electrode Potentials",
      "10.15 Electrochemical Cell (Galvanic Cell)",
      "10.16 Applications of E Values",
      "10.17 Variation of E With Ion Concentration",
      "10.18 Nernst Equation",
      "10.19 Activity Series of Metals",
      "10.20 Feasibility of Redox Reactions From Activity Series or Reaction data",
      "10.21 Photovoltaic Cells",
      "10.22 Winkler Method, BOD And Do",
      "10.23 Excercis Questions",
    ],
  },
  {
    name: "CHAP 11: Hydrocarbons",
    chapters: [
      "11.1 Aliphatic And Aromatic Hydrocarbons",
      "11.2 Nomenclature",
      "11.3 Reaction Machanism and Modes of Bond Breaking",
      "11.4 Unreactive Nature of Alkanes Towards Polar Reagents",
      "11.5 Reactions Of Alkanes",
      "11.6 Alkenes",
      "11.7 Structure and Reactivity of Alkenes",
      "11.8 Reaction of Alkenes",
      "11.9 Conjugated Dienes",
      "11.10 Isomerism",
      "11.11 Organic Redox Reaction",
    ],
  },
  {
    name: "CHAP 12: Nitrogen and Sulfur",
    chapters: [
      "12.1 Reactivity of Nitrogen (N)",
      "12.2 Ammonia (NH₃)",
      "12.3 Oxides of Nitrogen",
      "12.4 Sources of oxides of Nitrogen",
      "12.5 Role of NO & NO₂ In Smog & Pan Formation",
      "12.6 Catalytic Converter",
      "12.7 Nitrification And Denitrification",
      "12.8 Sulfur",
      "12.9 Stability of Oxidation States of Sulfur",
      "12.10 Reactions of Sulfur",
      "12.11 Uses of Sulfur and Its Compounds",
      "12.12 Role of Sulfur in Organic Synthesis",
      "12.13 Sulfuric Acid",
    ],
  },
  {
    name: "CHAP 13: Halogens",
    chapters: [
      "13.1 Volatility of Chlorine, Bromine and Iodine",
      "13.2 Trend in Volatility of The Halogens",
      "13.3 The Bond Strength of Halogen Molecules",
      "13.4 Relative Reactivities of The Halogens as Oxidizing Agents",
      "13.5 Reactions of The Halogens With Hydrogen",
      "13.6 Relative Thermal Stabilities of Hydrogen Halides in Terms of Their Bond Strength",
      "13.7 Relative Reacitivity of Halide Ions As Reducing Agents",
      "13.8 Reactions of Halides With Aqueous Silver Ion Followed By Aqueous Ammonia",
      "13.9 Reactions of Halides (x) With Concentrated Sulfuric Acid",
      "13.10 Reactions of Chlorine With Cold And Hot Aqueous Sodium Hydroxide",
      "13.11 Use of Chlorine in Water Purification",
      "13.0 Introduction",
    ],
  },
  {
    name: "CHAP 14: Atmosphere",
    chapters: [
      "14.1 Layers of The Atmospheres",
      "14.2 Air Pollutants",
      "14.3 Sources of Air Pollution",
      "14.4 Sources of Air Pollutants",
      "14.5 Impact of Human Activities On Atmosphere",
      "14.6 Effects Of Air Pollutants",
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
  {
    name: "CHAP 15: Basic Separation Techniques",
    chapters: [
      "15.1 Methods of Separation of Mixtures",
      "15.2 Crystallization",
      "15.3 Separation Through Distillation",
      "15.4 Chromatography",
      "15.5 How To Check The Purity Of The Product?",
    ],
  },
  {
    name: "CHAP 16: Lab Safety and Practical Skills",
    chapters: [
      "16.1 General Instructions To The Students",
      "16.2 Common Types Of Hazards In A Laboratory",
      "16.3 Waste Disposal System For Chemicals",
      "16.4 First Aid In Laboratory",
      "16.5 Acid-Base Titration",
      "16.6 Tests For Identification of Anions",
      "16.7 Tests For Identification Of Basic Radicals",
    ],
  },
];

// Computer INTER-I (1st year) PTB chapters
const computerInterOneChapters: ChapterGroup[] = [
  {
    name: "UNIT 1: Introduction to Software Development",
    chapters: [
      "1.1 Software Development",
      "1.2 Introduction to Software Development Life Cycle (SDLC)",
      "1.3 Software Developnient Methodologies",
      "1.4 Project Planning and Management",
      "1.5 Graphical-Representation of Software Systems",
      "1.6 Introduction to Design Patterns",
      "1.7 Software Debugging and Testing",
      "1.8 Software Development Tools",
    ],
  },
  {
    name: "UNIT 2: Python Programming",
    chapters: [
      "2.1 Introduction to Python Programming",
      "2.2 Basic Python Syntax and Structure",
      "2.3 Operators and Expressions",
      "2.4 Control Structures",
      "2.5 Python Modules and Built-in Data Structures",
      "2.6 Built-in Data Structures",
      "2.7 Modular Programming in Python",
      "2.8 Object-Oriented Programming in Python",
      "2.9 Advanced Python Concepts",
      "2.10 Testing and Debugging in Python",
    ],
  },
  {
    name: "UNIT 3: Algorithms and Problem Solving",
    chapters: [
      "3.1 Understanding Computational Problems",
      "3.2 Algorithms for Problem Solving",
      "3.3 Problem Solvability and Complexity",
      "3.4 Algorithm Analysis",
      "3.5 Algorithm Design Techniques",
      "3.6 Commonly Used Algorithms",
    ],
  },
  {
    name: "UNIT 4: Computational Structures",
    chapters: [
      "4.1 Primitive Computational Structures",
      "4.1.1 Lists",
      "4.1.2 Stacks",
      "4.1.3 Queues",
      "4.1.4 Trees",
      "4.1.5 Introduction to Graphs",
    ],
  },
  {
    name: "UNIT 5: Data Analytics",
    chapters: [
      "5.1 Basic Statistical Concepts",
      "5.2 Data Collection and Preparation",
      "5.3 Building Statistical Models",
      "5.4 Introduction to Data Visualization",
      "5.5 Tools for Data Visualization",
    ],
  },
  {
    name: "UNIT 6: Emerging Technologies",
    chapters: [
      "6.1 Definition and Overview of Emerging Technologies",
      "6.2 Cloud Computing",
      "6.3 Applications and Implications of Cloud Computing",
      "6.4 Introduction to Blockchain Technology",
      "6.5 Applications and Implications of Blockchain",
      "6.6 Future Trends and Innovations",
    ],
  },
  {
    name: "UNIT 7: Legal and Ethical Aspects of Computing System",
    chapters: [
      "7.1 Understanding Terms of Us",
      "7.2 Privacy and Security Threats",
      "7.3 The Digital Divide and Its Impacts",
      "7.4 Computing's Impact on Individuals and Society",
      "7.5 Digital Citizenship and Ethical Considerations",
    ],
  },
  {
    name: "UNIT 8: Online Research and Digital Literacy",
    chapters: [
      "8.1 Online Research and Digital Literacy",
      "8.2 Utilizing Digital Resources",
      "8.3 Research Ethics",
      "8.4 Understanding Intellectual Property",
    ],
  },
  {
    name: "UNIT 9: Entrepreneurship in Digital Age",
    chapters: [
      "9.1 Design Thinking and Business Solutions",
      "9.2 Creating a Business Plan",
      "9.3 Collecting Market Insights",
      "9.4 Developing Effective Marketing and Sales Strategies",
      "9.5 Financial Concepts for Business",
      "9.6 Communication and Storytelling Skills",
      "9.7 Collaborating and Iteration",
      "9.8 Innovation and Creativity",
    ],
  },
];

// Biology INTER-I (1st year) PTB chapters (using user-provided list)
const biologyInterOneChapters: ChapterGroup[] = [
  {
    name: "CHAP 1: Classification",
    chapters: [
      "1.1 Three-Domain System Of Classification",
      "1.2 Taxonomi Hierarchy",
      "1.3 Salient Features Of Kingdoms Of Domain Eukarya",
      "1.4 Classification Of Kingdom Animalia",
      "1.5 Classification Of Vertebrates",
      "1.6 Classification Of Viruses",
      "1.7 Biodiversity",
      "1.8 Species And Speciation",
    ],
  },
  {
    name: "CHAP 2: Bacteria",
    chapters: [
      "2.1 Structure Of Bacteria",
      "2.2 Endospore Formation In Bacteria",
      "2.3 Motility In Bacteria",
      "2.4 Flagella",
      "2.5 Bacteria: Ecology And Diversity",
      "2.6 Importance Of Bacteria",
      "2.7 Normal Flora",
      "2.8 Virus",
    ],
  },
  {
    name: "CHAP 3: Cell Biology",
    chapters: [
      "3.1 Cells-the Basic unit of Life",
      "3.2 Cell Theory",
      "3.3 Microscopy",
      "3.4 Structure of Cell",
      "3.5 Prokaryotic and Eukaryotic Cells",
      "3.6 Cell Signalling",
      "3.7 Membrane Transport Mechanisms",
      "3.8 Stem Cells",
    ],
  },
  {
    name: "CHAP 4: Biological Molecules",
    chapters: [
      "4.1 Biological Molecules",
      "4.2 Types of Bonds in Biology",
      "4.3 Condensation (Synthesis) and Hydrolysis",
      "4.4 Importance of Water",
      "4.5 Carbohydrates",
      "4.6 Proteins",
      "4.7 Lipids",
      "4.8 Nucleic Acids",
      "4.9 Conjugated Molecules",
    ],
  },
  {
    name: "CHAP 5: Enzymes",
    chapters: [
      "5.1 Enzymes",
      "5.2 Cofactors and Coenzymes",
      "5.3 Mechanism of Enzyme Action",
      "5.4 Factors Affecting the Rate of Enzyme Action",
      "5.5 Enzyme Inhibition",
      "5.6 Classification of Enzymes",
    ],
  },
  {
    name: "CHAP 6: Bioenergetics",
    chapters: [
      "6.1 Photosynthesis",
      "6.2 Cellular Respiration",
      "6.3 Photorespiration",
    ],
  },
  {
    name: "CHAP 7: Structural Biology",
    chapters: [
      "7.1 Applications of Structural Biology",
      "7.2 X-Ray Crystallography",
      "7.3 Computational Biology",
      "7.4 Sequence Homology",
    ],
  },
  {
    name: "CHAP 8: Life Processes in Plants",
    chapters: [
      "8.1 Nutrition In Plants",
      "8.2 Gas Exchange in Plants",
      "8.3 Support in Plants",
      "8.4 Water Potential",
      "8.5 Transport off Water in Plants",
      "8.6 Translocation of Food In Plants",
      "8.7 Growth In Plants",
      "8.8 Osmoregulation in Plants",
      "8.9 Thermoregulation In Plants",
      "8.10 Movement in Plants",
      "8.11 Phtotoperiodism",
      "8.12 Vernalisation",
    ],
  },
  {
    name: "CHAP 9: Digestion",
    chapters: [
      "9.1 Anatomy and Physiology of Digestive System",
    ],
  },
  {
    name: "CHAP 10: Gaseous Exchange",
    chapters: [
      "10.1 Respiratory System of Man",
      "10.2 Transport of Gases",
      "10.3 Respiratory Pigments",
      "10.4 Respiratory Disorders",
    ],
  },
  {
    name: "CHAP 11: Circulation",
    chapters: [
      "11.1 Structure & Functioning of Heart",
      "11.2 Blood Vessels",
      "11.3 Blood Pressure",
      "11.4 Cardiovascular Disorders",
      "11.5 Lymphatic System of Human",
    ],
  },
  {
    name: "CHAP 12: Support and Movement",
    chapters: [
      "12.1 Bones and Cartilage",
      "12.2 Disorders of Skeletal System",
      "12.3 Muscles",
    ],
  },
];

// Mathematics INTER-I (1st year) PTB chapters
const mathematicsInterOneChapters: ChapterGroup[] = [
  {
    name: "UNIT 1: Complex Numbers",
    chapters: ["E.x: 1.1", "E.x: 1.2", "E.x: 1.3", "E.x: 1.4", "E.x: 1.5"],
  },
  {
    name: "UNIT 2: Functions and Graphs",
    chapters: ["E.x: 2.1", "E.x: 2.2"],
  },
  {
    name: "UNIT 3: Theory of Quadratic Functions",
    chapters: ["E.x: 3.1", "E.x: 3.2"],
  },
  {
    name: "UNIT 4: Matrices and Determinants",
    chapters: ["E.x: 4.1", "E.x: 4.2", "E.x: 4.3"],
  },
  {
    name: "UNIT 5: Partial Fractions",
    chapters: ["E.x: 5.1", "E.x: 5.2"],
  },
  {
    name: "UNIT 6: Sequences and Series",
    chapters: [
      "E.x: 6.1",
      "E.x: 6.2",
      "E.x: 6.3",
      "E.x: 6.4",
      "E.x: 6.5",
      "E.x: 6.6",
      "E.x: 6.7",
      "E.x: 6.8",
      "E.x: 6.9",
      "E.x: 6.10",
      "E.x: 6.11",
    ],
  },
  {
    name: "UNIT 7: Permutations and Combinations",
    chapters: ["E.x: 7.1", "E.x: 7.2", "E.x: 7.3", "E.x: 7.4"],
  },
  {
    name: "UNIT 8: Mathematical induction and Binomial Theorem",
    chapters: ["E.x: 8.1", "E.x: 8.2", "E.x: 8.3", "E.x: 8.4"],
  },
  {
    name: "UNIT 9: Division of Polynomials",
    chapters: ["E.x: 9.1", "E.x: 9.2"],
  },
  {
    name: "UNIT 10: Trigonometric Identities",
    chapters: ["E.x: 10.1", "E.x: 10.2", "E.x: 10.3", "E.x: 10.4"],
  },
  {
    name: "UNIT 11: Trigonometric Functions and their Graphs",
    chapters: ["E.x: 11.1", "E.x: 11.2", "E.x: 11.3"],
  },
  {
    name: "UNIT 12: Limit and Continuity",
    chapters: ["E.x: 12.1", "E.x: 12.2", "E.x: 12.3"],
  },
  {
    name: "UNIT 13: Differentiation",
    chapters: ["E.x: 13.1", "E.x: 13.2", "E.x: 13.3"],
  },
  {
    name: "UNIT 14: Vectors in space",
    chapters: ["E.x: 14.1", "E.x: 14.2", "E.x: 14.3", "E.x: 14.4"],
  },
];

// Islamic Studies (اسلامیات لازمی) INTER-I (1st year) PTB chapters
const islamiyatInterOneChapters: ChapterGroup[] = [
  {
    name: "باب نمبر 1: قرآن مجیدوحدیث خاتم النبین ﷺ",
    chapters: ["1.1 علوم القرآن", "علوم الحدیث 1.2"],
  },
  {
    name: "باب نمبر 2: ایمانیات وعبادات",
    chapters: [
      "2.1 توحید کے دلائل اور تقاضے",
      "2.2 رسالت محمدیﷺ کی خصوصیات",
      "2.3 ملائکہ پر ایمان",
      "2.4 کتب سماویہ پر ایمان",
      "2.5 آخرت پر ایمان",
      "2.6 فلسفہ نماز",
      "2.7 فلسفہ زکوٰۃ وصدقات",
      "2.8 فلسفہ صوم",
      "2.9 فلسفہ حج وقربانی",
    ],
  },
  {
    name: "باب نمبر 3: سیرت نبوی خاتم النبینﷺ",
    chapters: [
      "3.1 نبی کریم خاتم النبینﷺ بطور مثالی سربراہ خاندان",
      "3.2 نبی کریم خاتم النبینﷺ بطور مثالی سربراہ ریاست",
      "3.3 نبی کریم خاتم النبینﷺ بطور مثالی سپہ سالار",
      "3.4 نبی کریم خاتم النبینﷺ کی معاشی تعلیمات",
    ],
  },
  {
    name: "باب نمبر 4: اخلاق وآداب",
    chapters: [
      "4.1 اجتماعی خیر خواہی اور احترام انسانیت",
      "4.2 اخلاقی رذائل سے اجتناب",
      "4.3 معاشرتی تعلقات کے اخلاقی وآداب",
    ],
  },
  {
    name: "باب نمبر 5: حسن معاملات ومعاشرت",
    chapters: [
      "5.1 حقوق العباد(اساتذہ کرام،معاون عملہ،زوجین،اولاد،،بیوہ)",
      "5.2 وراثت کی اسلامی تعلیمات",
      "5.3 نکاح وطلاق کی اسلامی تعلیمات",
    ],
  },
  {
    name: "باب نمبر 6: ہدایت کے سرچشمے اور مشاہیر اسلام",
    chapters: [
      "6.1 خلافت راشدہ",
      "6.2 ائمہ اہل بیت اطہار رضی اللہ تعالیٰ عنہ",
      "6.3 صوفیہ کرامؒ(پیر سید علی شاہؒ، میاں شیر محمد شرقپوریؒ)",
    ],
  },
  {
    name: "باب نمبر 7: اسلامی تعلیمات اور عصر حاضر کے تقاضے",
    chapters: [
      "7.1 قانون کی پاسداری",
      "7.2 نظام اسلام کی نشاۃ ثانیہ اور مسلمانوں کی ذمہ داریاں",
      "7.3 اسلاموفوبیا اور ہماری ذمہ داریاں",
    ],
  },
];

// Islamiyat (اختیاری) chapters provided by user
const islamiyatOptionalChapters: ChapterGroup[] = [
  { name: "باب نمبر 1: تہذیب وتمدن", chapters: ["تہذیب وتمدن"] },
  { name: "باب نمبر 2: تقوٰی، ذکر، شکر، عفودرگزر، عدل، احسان، خدمت خلق", chapters: ["تقوٰی، ذکر، شکر، عفودرگزر، عدل، احسان، خدمت خلق"] },
  { name: "باب نمبر 3: خاندانی و عائلی زندگی، والدین کے حقوق، حقوق الزوجین", chapters: ["خاندانی و عائلی زندگی، والدین کے حقوق، حقوق الزوجین"] },
  { name: "باب نمبر 4: اسلام کا نظام تعلیم، شاگرد کے حقوق، استاد کے حقوق، مکتب ، مسجد", chapters: ["اسلام کا نظام تعلیم، شاگرد کے حقوق، استاد کے حقوق، مکتب ، مسجد"] },
  { name: "باب نمبر 5: صلہ رحمی، ہمسائے کے حقوق، شہری کے حقوق و فرائض", chapters: ["صلہ رحمی، ہمسائے کے حقوق، شہری کے حقوق و فرائض"] },
  { name: "باب نمبر 6: عالم اسلام، اخوت، تبلیغ ودعوت، جہاد", chapters: ["عالم اسلام، اخوت، تبلیغ ودعوت، جہاد"] },
  { name: "باب نمبر 7: ظہوراسلام سے قبل عرب کے حالات، رسولﷺ کی ابتدائی زندگی، قریش کے مقاط سے ہجرت مدینہ، میثاق مدینہ", chapters: ["ظہوراسلام سے قبل عرب کے حالات، رسولﷺ کی ابتدائی زندگی، قریش کے مقاط سے ہجرت مدینہ، میثاق مدینہ"] },
  { name: "باب نمبر 8: غزوہ بدر، غزوہ احد، صلح حدیبیہ، غزوہ خیبر، غزوہ مؤتہ، جنگ حنین", chapters: ["غزوہ بدر، غزوہ احد، صلح حدیبیہ، غزوہ خیبر، غزوہ مؤتہ، جنگ حنین"] },
  { name: "باب نمبر 9: فتح مکہ، غزوہ حنین و تبوک، حجتہ الوداع، میثاق مدینہ", chapters: ["فتح مکہ، غزوہ حنین و تبوک، حجتہ الوداع، میثاق مدینہ"] },
  { name: "باب نمبر 10: حضرت ابوبکرصدیقؓ، حضرت عمرؓ، حضرت عثمانؓ، حضرت علیؓ", chapters: ["حضرت ابوبکرصدیقؓ، حضرت عمرؓ، حضرت عثمانؓ، حضرت علیؓ"] },
];

// Sociology chapters (user-provided)
const sociologyChapters: ChapterGroup[] = [
  { name: "باب نمبر 1: تعارف عمرانیات", chapters: ["تعارف عمرانیات"] },
  { name: "باب نمبر 2: عمرانیات اور سائنس کا تعلق", chapters: ["عمرانیات اور سائنس کا تعلق"] },
  { name: "باب نمبر 3: معاشرتی تفاعل اور معاشرتی عمل", chapters: ["معاشرتی تفاعل اور معاشرتی عمل"] },
  { name: "باب نمبر 4: معاشرتی گروہ", chapters: ["معاشرتی گروہ"] },
  { name: "باب نمبر 5: منصب اور کار منصب", chapters: ["منصب اور کار منصب"] },
  { name: "باب نمبر 6: معاشرتی معمولات و مستحبات", chapters: ["معاشرتی معمولات و مستحبات"] },
  { name: "باب نمبر 7: معاشرتی انحراف وسماجی ضبط", chapters: ["معاشرتی انحراف وسماجی ضبط"] },
  { name: "باب نمبر 8: معاشرتی اقدار", chapters: ["معاشرتی اقدار"] },
  { name: "باب نمبر 9: معاشرہ", chapters: ["معاشرہ"] },
  { name: "باب نمبر 10: ثقافت", chapters: ["ثقافت"] },
  { name: "باب نمبر 11: معاشرتی ادارے", chapters: ["معاشرتی ادارے"] },
  { name: "باب نمبر 12: معاشرتی درجہ بندی و معاشرتی حرکت پذیری", chapters: ["معاشرتی درجہ بندی و معاشرتی حرکت پذیری"] },
  { name: "باب نمبر 13: معاشرتی تغیر", chapters: ["معاشرتی تغیر"] },
];

// Education chapters (user-provided)
const educationChapters: ChapterGroup[] = [
  { name: "باب نمبر 1: تعلیم", chapters: ["تعلیم"] },
  { name: "باب نمبر 2: مقاصد تعلیم", chapters: ["مقاصد تعلیم"] },
  { name: "باب نمبر 3: تعلیم کی بنیادیں", chapters: ["تعلیم کی بنیادیں"] },
  { name: "باب نمبر 4: انسانی نشوونما", chapters: ["انسانی نشوونما"] },
  { name: "باب نمبر 5: تعلّم", chapters: ["تعلّم"] },
  { name: "باب نمبر 6: معاشرہ، کمیونٹی اور تعلیم", chapters: ["معاشرہ، کمیونٹی اور تعلیم"] },
  { name: "باب نمبر 7: رہنمائی اور مشاورت", chapters: ["رہنمائی اور مشاورت"] },
  { name: "باب نمبر 8: نصاب، سلیبس اور درسی کتب", chapters: ["نصاب، سلیبس اور درسی کتب"] },
];

// Physical Education chapters (user-provided)
const physicalEducationChapters: ChapterGroup[] = [
  { name: "باب نمبر 1: جسمانی تعلیم کی تعریف واہمیت", chapters: ["جسمانی تعلیم کی تعریف واہمیت"] },
  { name: "باب نمبر 2: جسمانی تعلیم کے اغراض ومقاصد", chapters: ["جسمانی تعلیم کے اغراض ومقاصد"] },
  { name: "باب نمبر 3: جسمانی سرگرمیوں کا دائرہ کار", chapters: ["جسمانی سرگرمیوں کا دائرہ کار"] },
  { name: "باب نمبر 4: معظم کھیل", chapters: ["نیٹ بال", "والی بال", "فٹ بال"] },
  { name: "باب نمبر 5: کسرتی کھیلوں کے ضابطے اور بنیادی مہارتیں", chapters: ["سہ جست", "ڈسکس تھرو", "گولہ اندازی", "ڈاک دوڑ"] },
  { name: "باب نمبر 6: علم الصحت", chapters: ["علم الصحت"] },
  { name: "باب نمبر 7: انسانی جسم اور اس کی کارکردگی", chapters: ["انسانی جسم اور اس کی کارکردگی", "نظام تنفس", "نظام دوران خون"] },
  { name: "باب نمبر 8: قامت و قامتی نقائص اور ان کی اصلاح", chapters: ["قامتی نقائص اور ان کی اصلاح"] },
  { name: "باب نمبر 9: ابتدائی طبی امداد", chapters: ["ابتدائی طبی امداد"] },
  { name: "باب نمبر 10: متعدی امراض", chapters: ["متعدی امراض"] },
];

// Psychology (نفسیات) chapters (user-provided)
const psychologyChapters: ChapterGroup[] = [
  { name: "باب نمبر 1: نفسیات کا تعارف", chapters: ["نفسیات کا تعارف"] },
  { name: "باب نمبر 2: اسالیبِ تحقیق", chapters: ["اسالیبِ تحقیق"] },
  { name: "باب نمبر 3: نظامِ عصبی اور کردار", chapters: ["نظامِ عصبی اور کردار"] },
  { name: "باب نمبر 4: حواس، توجہ اور ادراکِ حواس", chapters: ["حواس", "توجہ", "ادراکِ حواس"] },
  { name: "باب نمبر 5: آموزش اور حافظہ", chapters: ["آموزش", "حافظہ"] },
  { name: "باب نمبر 6: محرکاتی کردار", chapters: ["محرکاتی کردار"] },
  { name: "باب نمبر 7: شخصیت", chapters: ["شخصیت"] },
  { name: "باب نمبر 8: ہیجانی کردار", chapters: ["ہیجانی کردار"] },
  { name: "باب نمبر 9: اعلیٰ وقوفی اعمال", chapters: ["اعلیٰ وقوفی اعمال"] },
];

// Business Mathematics INTER-I (1st year) PTB chapters (user-provided)
const businessMathInterOneChapters: ChapterGroup[] = [
  {
    name: "UNIT 1: Business Arithmetic",
    chapters: ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6"],
  },
  {
    name: "UNIT 2: Mathematics of Finance",
    chapters: ["2.1", "2.2", "2.3"],
  },
  {
    name: "UNIT 3: Linear, Quadratic & Simultaneous Equations",
    chapters: ["3.1", "3.2", "3.3", "3.4"],
  },
  {
    name: "UNIT 4: Functions & their Graphs",
    chapters: ["4.1", "4.2"],
  },
  {
    name: "UNIT 5: Elements of Matrix Algebra",
    chapters: ["5.1", "5.2"],
  },
  {
    name: "UNIT 6: Binary Number System and its Operations",
    chapters: ["6.1", "6.2"],
  },
];

// Principles of Commerce INTER-I (1st year) PTB chapters (user-provided)
const principlesOfCommerceInterOneChapters: ChapterGroup[] = [
  { name: "CHAP 1: Concept of Business", chapters: ["1.1 Concept of Business"] },
  { name: "CHAP 2: Nature and Scope of Commerce", chapters: ["2.1 Nature and Scope of Commerce"] },
  { name: "CHAP 3: Sole Tradership", chapters: ["3.1 Sole Tradership"] },
  { name: "CHAP 4: Partnership", chapters: ["4.1 Partnership"] },
  { name: "CHAP 5: Joint Stock Company-I", chapters: ["5.1 Joint Stock Company-I"] },
  { name: "CHAP 6: Joint Stock Company-II", chapters: ["6.1 Joint Stock Company-II"] },
  { name: "CHAP 7: Joint Stock Company-III", chapters: ["7.1 Joint Stock Company-III"] },
  { name: "CHAP 8: Cooperative Society", chapters: ["8.1 Cooperative Society"] },
  { name: "CHAP 9: Home Trade", chapters: ["9.1 Home Trade"] },
  { name: "CHAP 10: Wholesale Trade", chapters: ["10.1 Wholesale Trade"] },
  { name: "CHAP 11: Retail Trade", chapters: ["11.1 Retail Trade"] },
  { name: "CHAP 12: Foreign Trade", chapters: ["12.1 Foreign Trade"] },
  { name: "CHAP 13: Import Trade", chapters: ["13.1 Import Trade"] },
  { name: "CHAP 14: Export Trade", chapters: ["14.1 Export Trade"] },
  { name: "CHAP 15: Middlemen", chapters: ["15.1 Middlemen"] },
  { name: "CHAP 16: Sales Promotion", chapters: ["16.1 Sales Promotion"] },
  { name: "CHAP 17: Business Finance", chapters: ["17.1 Business Finance"] },
  { name: "CHAP 18: Insurance", chapters: ["18.1 Insurance"] },
  { name: "CHAP 19: Means of Transportation", chapters: ["19.1 Means of Transportation"] },
  { name: "CHAP 20: Warehousing", chapters: ["20.1 Warehousing"] },
  { name: "CHAP 21: Chamber of Commerce & Industry", chapters: ["21.1 Chamber of Commerce & Industry"] },
  { name: "CHAP 22: Office Organization", chapters: ["22.1 Office Organization"] },
  { name: "CHAP 23: Office Machines", chapters: ["23.1 Office Machines"] },
  { name: "CHAP 24: Filing & Indexing", chapters: ["24.1 Filing & Indexing"] },
  { name: "CHAP 25: Business Correspondence", chapters: ["25.1 Business Correspondence"] },
  { name: "CHAP 26: Official Correspondence", chapters: ["26.1 Official Correspondence"] },
];


// subjectChaptersMap will be defined after all chapter arrays to avoid
// referencing arrays before they are declared.

// Economics INTER-I (1st year) PTB chapters (user-provided Urdu list)
const economicsInterOneChapters: ChapterGroup[] = [
  { name: "باب نمبر 1: معاشیات کی نوعیت اور وسعت", chapters: ["معاشیات کی نوعیت اور وسعت"] },
  { name: "باب نمبر 2: رؤیہ صارف کا تجزیہ", chapters: ["رؤیہ صارف کا تجزیہ"] },
  { name: "باب نمبر 3: معاشیات میں شماریات اور ریاضی کے بنیادی آلات", chapters: ["معاشیات میں شماریات اور ریاضی کے بنیادی آلات"] },
  { name: "باب نمبر 4: طلب", chapters: ["طلب"] },
  { name: "باب نمبر 5: رسد", chapters: ["رسد"] },
  { name: "باب نمبر 6: منڈی کا توازن", chapters: ["منڈی کا توازن"] },
  { name: "باب نمبر 7: نظریہ پیدائشِ دولت", chapters: ["نظریہ پیدائشِ دولت"] },
  { name: "باب نمبر 8: پیمانہ پیدائش اور قوانین حاصل", chapters: ["پیمانہ پیدائش اور قوانین حاصل"] },
  { name: "باب نمبر 9: مصارف پیدائش", chapters: ["مصارف پیدائش"] },
  { name: "باب نمبر 10: وصولیوں کا تجزیہ", chapters: ["وصولیوں کا تجزیہ"] },
  { name: "باب نمبر 11: منڈی", chapters: ["منڈی"] },
  { name: "باب نمبر 12: تقسیم۔ عاملین پیدائش کے معاوضوں کا تعین", chapters: ["تقسیم۔ عاملین پیدائش کے معاوضوں کا تعین"] },
];

// Statistics INTER-I (1st year) PTB chapters (user-provided)
const statisticsInterOneChapters: ChapterGroup[] = [
  {
    name: "CHAP 1: Introduction to Statistics",
    chapters: [
      "1.1 Introduction",
      "1.2 Importance of Statistics in Various Disciplines",
      "1.3 Variables",
      "1.4 Description and Inferential Statistics",
      "1.5 Sources of Data",
    ],
  },
  {
    name: "CHAP 2: Representation of Data",
    chapters: [
      "2.1 Introduction",
      "2.2 Classification",
      "2.3 Tabulation",
      "2.4 Frequency Distribution",
      "2.5 Cumulative Frequency Distribution",
      "2.6 Graphic Representation of Data",
      "2.7 Bivariate Frequency Distribution",
    ],
  },
  {
    name: "CHAP 3: Measure of Location",
    chapters: [
      "3.1 Introduction",
      "3.2 Arithmetic Mean and Weighted Mean",
      "3.3 Geometric Mean",
      "3.4 Harmonic Mean",
      "3.5 Median",
      "3.6 Quantiles",
      "3.7 Mode",
      "3.8 Selecting a Suitable Measure of Central Tendency",
    ],
  },
  {
    name: "CHAP 4: Measure of Dispersion",
    chapters: [
      "4.1 Introduction",
      "4.2 Co-efficient of Variation and Other Relative Measures",
      "4.3 Moments",
      "4.4 Sheppad's Correction for Grouping Error",
      "4.5 Skewness",
    ],
  },
  {
    name: "CHAP 5: Index Numbers",
    chapters: [
      "5.1 Introduction",
      "5.2 Construction of Price Index Numbers",
      "5.3 Unweighted Index Numbers",
      "5.4 Weighted Index Number",
      "5.5 Consumer Price Index (CPI) and Wholesale Price Index (WPI)",
    ],
  },
  {
    name: "CHAP 6: Probability",
    chapters: [
      "6.1 Introduction",
      "6.2 Permutations",
      "6.3 Combinations",
      "6.4 Probability",
    ],
  },
  {
    name: "CHAP 7: Random Variables",
    chapters: [
      "7.1 Introduction",
      "7.2 Random Numbers and Their Generation",
      "7.3 Application of Random Numbers",
      "7.4 Concept of Random Variables and Their Construction from Different Fields",
      "7.5 Discrete and Continuous Random Variables",
    ],
  },
  {
    name: "CHAP 8: Probability Distributions",
    chapters: [
      "8.1 Introduction",
      "8.2 Probability Mass Function",
      "8.3 Probability Density Function",
      "8.4 Simple Univariate Discrete and Continuous Distributions",
      "8.5 Drawing of Probability Mass Function and Probability Density Function",
      "8.6 Expectation and Variance of the Simple Discrete Random Variable",
      "8.7 a",
      "8.8 a",
      "8.9 Distribution Function",
    ],
  },
  {
    name: "CHAP 9: Binomial and Hyper Geometric Probability Distribution",
    chapters: [
      "9.1 Introduction",
      "9.2 Binomial Probability Distribution",
      "9.3 Hypergeometric Distribution and Hypergeometric Experiment",
    ],
  },
];

// Principles of Accounting INTER-I (1st year) PTB chapters (user-provided)
const accountingInterOneChapters: ChapterGroup[] = [
  { name: "CHAP 1: Introduction", chapters: ["1.1 Introduction"] },
  { name: "CHAP 2: Transactions And Accounting Equation", chapters: ["2.1 Transactions And Accounting Equation"] },
  { name: "CHAP 3: Analysis Of Business Transactions And Double Entry System", chapters: ["3.1 Analysis Of Business Transactions And Double Entry System"] },
  { name: "CHAP 4: Journal: The Original Book Of Entry", chapters: ["4.1 Journal: The Original Book Of Entry"] },
  { name: "CHAP 5: Ledger: The Main Book Of Accounts", chapters: ["5.1 Ledger: The Main Book Of Accounts"] },
  { name: "CHAP 6: Accounting For Bills Of Exchange", chapters: ["6.1 Accounting For Bills Of Exchange"] },
  { name: "CHAP 7: Special Journals", chapters: ["7.1 Special Journals"] },
  { name: "CHAP 8: Cash Book And Bank Reconciliation Statement", chapters: ["8.1 Cash Book And Bank Reconciliation Statement"] },
  { name: "CHAP 9: Journal Proper And Summary Of Book Keeping To The Trial Balance", chapters: ["9.1 Journal Proper And Summary Of Book Keeping To Trial Balance"] },
  { name: "CHAP 10: Final Accounts: The Completion Of Accounting Cycle", chapters: ["10.1 Final Accounts: The Completion Of Accounting Cycle"] },
  { name: "CHAP 11: Adjustments And Their Effects On Final Accounts", chapters: ["11.1 Adjustments And Their Effects On Final Accounts"] },
  { name: "CHAP 12: Work Sheet", chapters: ["12.1 Work Sheet"] },
  { name: "CHAP 13: Financial Statements", chapters: ["13.1 Financial Statements"] },
  { name: "CHAP 14: Capital And Revenue", chapters: ["14.1 Capital And Revenue"] },
  { name: "CHAP 15: Rectification Of Errors", chapters: ["15.1 Rectification Of Errors"] },
];

// Principles of Economics INTER-I (1st year) PTB chapters (user-provided)
const principlesOfEconomicsInterOneChapters: ChapterGroup[] = [
  { name: "CHAP 1: Definition Of Economics", chapters: ["1.1 Definition Of Economics"] },
  { name: "CHAP 2: Consumer's Demand Theory", chapters: ["2.1 Consumer's Demand Theory"] },
  { name: "CHAP 3: Demand And Supply", chapters: ["3.1 Demand And Supply"] },
  { name: "CHAP 4: Factors Of Production", chapters: ["4.1 Factors Of Production"] },
  { name: "CHAP 5: Laws Of Return", chapters: ["5.1 Laws Of Return"] },
  { name: "CHAP 6: Firm's Costs OF Production And Revenues", chapters: ["6.1 Firm's Costs OF Production And Revenues"] },
  { name: "CHAP 7: Price And Output Determination", chapters: ["7.1 Price And Output Determination"] },
  { name: "CHAP 8: Resource Pricing", chapters: ["8.1 Resource Pricing"] },
  { name: "CHAP 9: National Income", chapters: ["9.1 National Income"] },
  { name: "CHAP 10: Money", chapters: ["10.1 Money"] },
  { name: "CHAP 11: Business Cycle / Trade Cycle", chapters: ["11.1 Business Cycle / Trade Cycle"] },
  { name: "CHAP 12: International Trade", chapters: ["12.1 International Trade"] },
  { name: "CHAP 13: Public Finance And Zakat", chapters: ["13.1 Public Finance And Zakat"] },
];

// English (pre-9th / pre-11th) chapters — Enable All
const englishPreChapters: ChapterGroup[] = [
  { name: "UNIT 1: Khatam-un-Nabiyeen Hazrat Muhammad خاتم النبین ﷺ", chapters: ["1.1 Khatam-un-Nabiyeen Hazrat Muhammad خاتم النبین ﷺ"] },
  { name: "UNIT 2: Responsibility of the Youth in Nation-Building", chapters: ["2.1 Responsibility of the Youth in Nation-Building"] },
  { name: "UNIT 3: A Bird Came Down the Walk (Poem)", chapters: ["3.1 A Bird Came Down the Walk"] },
  { name: "UNIT 4: Team Moon", chapters: ["4.1 Team Moon"] },
  { name: "UNIT 5: Impact of Global Warming on Pakistan", chapters: ["5.1 Impact of Global Warming on Pakistan"] },
  { name: "UNIT 6: The Echoing Green (Poem)", chapters: ["6.1 The Echoing Green (Poem)"] },
  { name: "UNIT 7: What You Do is What You Are", chapters: ["7.1 What You Do is What You Are"] },
  { name: "UNIT 8: Clean Water", chapters: ["8.1 Clean Water"] },
  { name: "UNIT 9: Freedom (Poem)", chapters: ["9.1 Freedom"] },
  { name: "UNIT 10: The Punishment of Shahpesh, the Persian, on Khipil, the Builder", chapters: ["10.1 The Punishment of Khipil"] },
  { name: "UNIT 11: Those Winter Sundays (Poem)", chapters: ["11.1 Those Winter Sundays"] },
  { name: "UNIT 12: The Impact of AI on Society, Human Relationships, and Ethics", chapters: ["12.1 The Impact of AI on Society..."] },
  { name: "UNIT 13: Ruba'iyat (Poem)", chapters: ["13.1 Ruba'iyat"] },
  { name: "UNIT 14: The End of the Beginning", chapters: ["14.1 The End of the Beginning"] },
  {
    name: "English (B)",
    chapters: [
      "Letters",
      "Applications",
      "Stories",
      "Pair of words",
    ],
  },
  {
    name: "Correct Form Of Verb",
    chapters: [
      "Present Indefinite",
      "Present Continuous",
      "Present Perfect Tense",
      "Present Perfect Continuous Tense",
      "Past Indefinite Tense",
      "Past Continuous Tense",
      "Past Perfect Tense",
      "Past Perfect Continuous Tense",
      "Future Indefinite Tense",
      "Future Continuous Tense",
      "Future Perfect Tense",
      "Future Perfect Continuous Tense",
    ],
  },
];

// Urdu (Lazmi) pre-9th/11th chapters — Enable All
const urduPreChapters: ChapterGroup[] = [
  { name: "نثر نمبر1:اخلاق نبوی خاتم النبین ﷺ", chapters: ["اخلاق نبوی خاتم النبین ﷺ"] },
  { name: "نثر نمبر 2: فاقہ میں روزہ", chapters: ["فاقہ میں روزہ"] },
  { name: "نثر نمبر3: مکاتیب غالب", chapters: ["مکاتیب غالب"] },
  { name: "نثر نمبر4: ایک اُستاد عدالت کے کٹہرے میں", chapters: ["ایک اُستاد عدالت کے کٹہرے میں"] },
  { name: "نثر نمبر5: چار پائی", chapters: ["چار پائی"] },
  { name: "نثر نمبر6: اور پاکستان بن گیا", chapters: ["اور پاکستان بن گیا"] },
  { name: "نثر نمبر7: نیا قانون", chapters: ["نیا قانون"] },
  { name: "نثر نمبر8: دهلیز", chapters: ["دهلیز"] },
  { name: "نثر نمبر9: تاریخ کا کفن", chapters: ["تاریخ کا کفن"] },
  { name: "نثر نمبر10: پاکستانی زبانیں اور ان کا باہمی رشتہ", chapters: ["پاکستانی زبانیں اور ان کا باہمی رشتہ"] },
  { name: "نظم نمبر1: حمد", chapters: ["حمد"] },
  { name: "نظم نمبر2: نعت", chapters: ["نعت"] },
  { name: "نظم نمبر3: اے وادیِ لولاب !", chapters: ["اے وادیِ لولاب"] },
  { name: "نظم نمبر4: اوردیس سے آنے والے بتا", chapters: ["اوردیس سے آنے والے بتا"] },
  { name: "نظم نمبر5: آزادی", chapters: ["آزادی"] },
  { name: "نظم نمبر6: اِخلاص", chapters: ["اِخلاص"] },
  { name: "نظم نمبر7: کھڑا ڈنر", chapters: ["کھڑا ڈنر"] },
  { name: "غزل نمبر1: پتا پتا بُو ٹا بُوٹا حال ہمارا جانے ہے", chapters: ["پتا پتا بُو ٹا بُوٹا حال ہمارا جانے ہے"] },
  { name: "غزل نمبر2: سر میں سودا بھی نہیں ، دل میں تمنا بھی نہیں", chapters: ["سر میں سودا بھی نہیں ، دل میں تمنا بھی نہیں"] },
  { name: "غزل نمبر3: بے چین بہت پھرنا ، گھرائے ہوئے رہنا", chapters: ["بے چین بہت پھرنا ، گھرائے ہوئے رہنا"] },
  { name: "غزل نمبر4: سلسلے توڑ گیا وہ سبھی جاتے جاتے", chapters: ["سلسلے توڑ گیا وہ سبھی جاتے جاتے"] },
  { name: "غزل نمبر5: بادباں کھلنے سے پہلے کا اشارہ دیکھنا", chapters: ["بادباں کھلنے سے پہلے کا اشارہ دیکھنا"] },
  { name: "اردو بی", chapters: ["مکالمے","رداد/مضامین","درخواستیں","رسیدیں","تلخیص پیراگراف","روزنامچے"] },
  { name: "حصہ قوائد وانشا (معروضی)", chapters: [
    "مطلع","مقطع","قافیہ","ردیف","تلمیح","تشبیہہ","استعارہ","جملوں کی درستگی","علم بیان","مجاز مرسل","کنایہ","مراعات النظیر","صنعت تضاد"
  ] },
];

// Nazra Quran / Tarjuma chapters (basic mapping for early classes)
const nazraQuranChapters: ChapterGroup[] = [
  { name: "سورۃ البقرۃ", chapters: ["سورۃ البقرۃ"] },
  { name: "سورۃ آلِ عمران", chapters: ["سورۃ آلِ عمران"] },
  { name: "سورۃ الانفال", chapters: ["سورۃ الانفال"] },
  { name: "سورۃ التوبہ", chapters: ["سورۃ التوبہ"] },
];

// Punjabi chapters (user-provided)
const punjabiChapters: ChapterGroup[] = [
  { name: "نثر نمبر 1: معراج شریف", chapters: ["معراج شریف"] },
  { name: "نثر نمبر 2: پنجابی زبان دی کہانی", chapters: ["پنجابی زبان دی کہانی"] },
  { name: "نثر نمبر 3: حضرت بہاؤ الدین زکریا ملتانی", chapters: ["حضرت بہاؤ الدین زکریا ملتانی"] },
  { name: "نثر نمبر 4: پاکستان بن گیا اے", chapters: ["پاکستان بن گیا اے"] },
  { name: "نثر نمبر 5: ٹاہلی تھلے", chapters: ["ٹاہلی تھلے"] },
  { name: "نثر نمبر 6: شاہ عبدالطیف بھٹائی", chapters: ["شاہ عبدالطیف بھٹائی"] },
  { name: "نثر نمبر 7: کھوپڑیاں تے آہلنے", chapters: ["کھوپڑیاں تے آہلنے"] },
  { name: "نثر نمبر 8: لندن دے ٹیوب ٹیشن", chapters: ["لندن دے ٹیوب ٹیشن"] },
  { name: "نثر نمبر 9: رائے احمد خان کھرل شہید", chapters: ["رائے احمد خان کھرل شہید"] },
  { name: "نثر نمبر 10: کپاہ وچ", chapters: ["کپاہ وچ"] },
  { name: "نثر نمبر 11: لوک گیت", chapters: ["لوک کیت"] },
  { name: "نثر نمبر 12: ان ڈٹھے روگ", chapters: ["ان ڈٹھے روگ"] },
  { name: "نظم نمبر 1: حمد", chapters: ["حمد"] },
  { name: "نظم نمبر 2: نعت", chapters: ["نعت"] },
  { name: "نظم نمبر 3: شلوک", chapters: ["شلوک"] },
  { name: "نظم نمبر 4: کافی", chapters: ["کافی"] },
  { name: "نظم نمبر 5: ابیات", chapters: ["ابیات"] },
  { name: "نظم نمبر 6: دوہڑے", chapters: ["دوہڑے"] },
  { name: "نظم نمبر 7: سی حرفی", chapters: ["سی حرفی"] },
  { name: "نظم نمبر 8: کافی (بابا بلھے شاہ)", chapters: ["کافی (بابا بلھے شاہ)"] },
  { name: "نظم نمبر 9: منت وزاری کردن برادران", chapters: ["منت وزاری کردن برادران"] },
  { name: "نظم نمبر 10: دوہڑے (ہاشم شاہ)", chapters: ["دوہڑے"] },
  { name: "نظم نمبر 11: کافی (خواجہ غلام فرید)", chapters: ["کافی (خواجہ غلام فرید)"] },
  { name: "نظم نمبر 12: حضرت یوسفؑ", chapters: ["حضرت یوسفؑ"] },
  { name: "نظم نمبر 13: کلام عشق لہر", chapters: ["کلام عشق لہر"] },
  { name: "نظم نمبر 14: سی حرفی (احمد علی سائیں)", chapters: ["سی حرفی"] },
  { name: "نظم نمبر 15: (غزل) پیر فضل گجراتی", chapters: ["پیر فضل گجراتی"] },
  { name: "نظم نمبر 16: غازی تے شہید", chapters: ["غازی تے شہید"] },
  { name: "نظم نمبر 17: اپنی سہان", chapters: ["اپنی سہان"] },
  { name: "نظم نمبر 18: توقیر حسین", chapters: ["توقیر حسین"] },
  { name: "نظم نمبر 19: اوڑک ہوندی لو", chapters: ["اوڑک ہوندی لو"] },
  { name: "نظم نمبر 20: (غزل) عارف عبدالمتین", chapters: ["عارف عبدالمتین"] },
  { name: "نظم نمبر 21: نواں نواں بور", chapters: ["نواں نواں بور"] },
  { name: "نظم نمبر 22: ہک بوٹا", chapters: ["ہک بوٹا"] },
  { name: "نظم نمبر 23: تن نظماں", chapters: ["تن نظماں"] },
  { name: "نظم نمبر 24: جمعہ بازار", chapters: ["جمعہ بازار"] },
  { name: "مضامین", chapters: ["مضامین"] },
];

// Civics / علم شہریت chapters (user-provided)
const civicsChapters: ChapterGroup[] = [
  { name: "باب نمبر 1: علم شہریت کا تعارف", chapters: ["علم شہریت کا تعارف"] },
  { name: "باب نمبر 2: علم شہریت کے بنیادی تصورات", chapters: ["علم شہریت کے بنیادی تصورات"] },
  { name: "باب نمبر 3: ریاست", chapters: ["ریاست"] },
  { name: "باب نمبر 4: اقتداراعلیٰ", chapters: ["اقتداراعلیٰ"] },
  { name: "باب نمبر 5: حکومت", chapters: ["حکومت"] },
  { name: "باب نمبر 6: قانون", chapters: ["قانون"] },
  { name: "باب نمبر 7: شہری اور شہریت", chapters: ["شہری اور شہریت"] },
  { name: "باب نمبر 8: دستور", chapters: ["دستور"] },
  { name: "باب نمبر 9: سیاسی حرکیات", chapters: ["سیاسی حرکیات"] },
];

// Farsi (فارسی) Part 1 chapters (user-provided)
const farsiPartOneChapters: ChapterGroup[] = [
  { name: "درس نمبر 1: ترجمہ سورہ الحمد", chapters: ["ترجمہ سورہ الحمد"] },
  { name: "درس نمبر 2: نعت", chapters: ["نعت"] },
  { name: "درس نمبر 3: کلام خدا", chapters: ["کلام خدا"] },
  { name: "درس نمبر 4: کتاب", chapters: ["کتاب"] },
  { name: "درس نمبر 5: سید علی ہجویریؒ (خلفای رشدین)", chapters: ["سید علی ہجویریؒ (خلفای رشدین)"] },
  { name: "درس نمبر 6: درد صفِ داغگاہ", chapters: ["درد صفِ داغگاہ"] },
  { name: "درس نمبر 7: امام غزالی (نامہ امام بہ سلطان سنجر سلجوقی)", chapters: ["امام غزالی (نامہ امام بہ سلطان سنجر سلجوقی)"] },
  { name: "درس نمبر 8: مسعود سعد سلطان لاھوری", chapters: ["مسعود سعد سلطان لاھوری"] },
  { name: "درس نمبر 9: جوامع الحکایات", chapters: ["جوامع الحکایات"] },
  { name: "درس نمبر 10: پندھا(نظم)", chapters: ["پندھا(نظم)"] },
  { name: "درس نمبر 11: موسی و شبان(نظم)", chapters: ["موسی و شبان(نظم)"] },
  { name: "درس نمبر 12: سخنان خواجہ نظام الدین اولیاءؒ", chapters: ["سخنان خواجہ نظام الدین اولیاءؒ"] },
  { name: "درس نمبر 13: غزلھای خسرو", chapters: ["غزلھای خسرو"] },
  { name: "درس نمبر 14: مرواریدھایی ازسلک السلوک", chapters: ["مرواریدھایی ازسلک السلوک"] },
  { name: "درس نمبر 15: غزلھای حافظ", chapters: ["غزلھای حافظ"] },
  { name: "درس نمبر 16: گزیدہ ای ازبھارستان", chapters: ["گزیدہ ای ازبھارستان"] },
  { name: "درس نمبر 17: گزیدہ ای ازتوزک جھانگیری", chapters: ["گزیدہ ای ازتوزک جھانگیری"] },
  { name: "درس نمبر 18: حضرت سچل سر مستؒ", chapters: ["حضرت سچل سر مستؒ"] },
  { name: "درس نمبر 19: درودبہ پاکستان", chapters: ["درودبہ پاکستان"] },
  { name: "درس نمبر 20: درکلاس", chapters: ["درکلاس"] },
  { name: "درس نمبر 21: نصیحت بہ فرزند", chapters: ["نصیحت بہ فرزند"] },
  { name: "درس نمبر 22: فاطمہ جناح", chapters: ["فاطمہ جناح"] },
  { name: "درس نمبر 23: محاروہ بین خداوانسان", chapters: ["محاورہ بین خداوانسان"] },
  { name: "درس نمبر 24: داستان پرواز", chapters: ["داستان پرواز"] },
  { name: "درس نمبر 25: آمدبھاران", chapters: ["آمدبھاران"] },
  { name: "درس نمبر 26: نامہ ای بہ پسرم", chapters: ["نامہ ای بہ پسرم"] },
  { name: "درس نمبر 27: غزل", chapters: ["غزل"] },
  { name: "درس نمبر 28: راشد منھاس، نشان حیدر", chapters: ["راشد منھاس، نشان حیدر"] },
  { name: "درس نمبر 29: ارزشِ روزش", chapters: ["ارزشِ روزش"] },
  { name: "درس نمبر 30: درکتابخانہ", chapters: ["درکتابخانہ"] },
  { name: "گرائمر", chapters: ["گرائمر"] },
];

// Map Urdu pre-chapters (moved below after map declaration)

// Physical Geography / طبعی جغرافیہ Part 1 chapters (user-provided)
const physicalGeographyPartOneChapters: ChapterGroup[] = [
  { name: "باب نمبر 1:طبعی جغرافیہ", chapters: ["1 طبعی جغرافیہ"] },
  { name: "باب نمبر 2:زمین کی اندرونی ساخت", chapters: ["زمین کی اندرونی ساخت"] },
  { name: "باب نمبر 3:زمینی خدوخال", chapters: ["زمینی خدوخال"] },
  { name: "باب نمبر 4:کرّہ ہوائی", chapters: ["کرّہ ہوائی"] },
  { name: "باب نمبر 5:ہواؤں کا عالمی نظام", chapters: ["ہواؤں کا عالمی نظام"] },
  { name: "باب نمبر 6:ہوا کی نمی", chapters: ["ہوا کی نمی"] },
  { name: "باب نمبر 7:سمندر کے پانی کی حرکات", chapters: ["سمندر کے پانی کی حرکات"] },
  { name: "باب نمبر 8:آب وہوا کے خطے", chapters: ["آب وہوا کے خطے"] },
];


// Tareekh-e-Islam (تاریخِ اسلام) Part 1 chapters (user-provided)
const tareekhIslamPartOneChapters: ChapterGroup[] = [
  { name: "باب نمبر 1: عرب قبل از اسلام اور باشندے", chapters: ["عرب قبل از اسلام اور باشندے"] },
  { name: "باب نمبر 2: رسول اللہ ﷺ کی ابتدائی زندگی", chapters: ["رسول اللہ ﷺ کی ابتدائی زندگی"] },
  { name: "باب نمبر 3: مکہ میں اشاعت اسلام", chapters: ["مکہ میں اشاعت اسلام"] },
  { name: "باب نمبر 4: مکہ میں اشاعت اسلام (I)", chapters: ["مکہ میں اشاعت اسلام (I)"] },
  { name: "باب نمبر 5 : مدینہ میں اشاعت اسلام (II)", chapters: ["مدینہ میں اشاعت اسلام (II)"] },
  { name: "باب نمبر 6: مدینہ میں اشاعت اسلام (III)", chapters: ["مدینہ میں اشاعت اسلام (III)"] },
  { name: "باب نمبر 7: نبیﷺ کی سیرت", chapters: ["نبیﷺ کی سیرت"] },
  { name: "(I) باب نمبر 8: خلافت راشدہ", chapters: ["خلافت راشدہ (1)"] },
  { name: "(II) باب نمبر 9: خلافت راشدہ", chapters: ["خلافت راشدہ (2)"] },
  { name: "(III) باب نمبر 10: خلافت راشدہ", chapters: ["خلافت راشدہ (3)"] },
  { name: "(IV) باب نمبر 11: خلافت راشدہ", chapters: ["خلافت راشدہ (4)"] },
  { name: "(V) باب نمبر 12: خلافت راشدہ", chapters: ["خلافت راشدہ (5)"] },
  { name: "باب نمبر 13: حضرت امیر معاویہ", chapters: ["حضرت امیر معاویہ"] },
  { name: "باب نمبر 14: یزید اول، سانحہ کربلا", chapters: ["یزید اول، سانحہ کربلا"] },
  { name: "باب نمبر 15: معاویہ ثانی اور مروان بن حکم", chapters: ["معاویہ ثانی اور مروان بن حکم"] },
  { name: "باب نمبر 16: حضرت عبداللہ بن زبیر", chapters: ["حضرت عبداللہ بن زبیر"] },
  { name: "باب نمبر 17: عبدالملک بن مروان", chapters: ["عبدالملک بن مروان"] },
  { name: "باب نمبر 18: ولید بن عبدالملک", chapters: ["ولید بن عبدالملک"] },
  { name: "باب نمبر 19: سلیمان بن عبدالملک", chapters: ["سلیمان بن عبدالملک"] },
  { name: "باب نمبر 20: حضرت عمر بن عبدالعزیزؒ", chapters: ["حضرت عمر بن عبدالعزیزؒ"] },
  { name: "باب نمبر 21: یزید ثانی", chapters: ["یزید ثانی"] },
  { name: "باب نمبر 22: ہشام بن عبدالملک", chapters: ["ہشام بن عبدالملک"] },
  { name: "باب نمبر 23: مروان ثانی - عباسی تحریک", chapters: ["مروان ثانی - عباسی تحریک"] },
  { name: "باب نمبر 24: عہد بنو امیہ پر ایک نظر", chapters: ["عہد بنو امیہ پر ایک نظر"] },
];

// Ikhlaqiat / اخلاقیات Part 1 chapters
const ikhlaqiatPartOneChapters: ChapterGroup[] = [
  { name: "باب نمبر1: مذاہب کا تعارف", chapters: ["مذہب کی سماجی،فلسفیانہ اورنفسیاتی تفہیم،مذہب پرمعاشرت کےاثرات"] },
  { name: "باب نمبر2: پاکستان میں مختلف مذاہب", chapters: ["اسلام،مسیحیت"] },
  { name: "باب نمبر3: اخلاقی اقدار", chapters: ["اجتماعی عدل اور مساوات،معاشرتی ادارے،ریاستی ادارے،سماجی ادارے"] },
  { name: "باب نمبر4: آداب", chapters: ["کام کی جگہ کےآداب،خدمت گار،ملاقاتی"] },
  { name: "باب نمبر5: مشاہیر", chapters: ["عبدالستارایدھی،مدرٹریسا،جمشیدسروان جی مہتا"] },
];

// Library Science / لائبریری سائنس Part 1 chapters
const librarySciencePartOneChapters: ChapterGroup[] = [
  { name: "باب نمبر1: لائبریری کامفہوم،معنی اورتعریف", chapters: ["1.1 لائبریری کامفہوم،معنی اورتعریف"] },
  { name: "باب نمبر2: کتب خانے کامواد", chapters: ["2.1 کتب خانے کامواد"] },
  { name: "باب نمبر3: تحریرکامفہوم،معنی اورتعریف", chapters: ["3.1 تحریرکامفہوم،معنی اورتعریف"] },
  { name: "باب نمبر4: کتاب کامفہوم،معنی اورتعریف", chapters: ["4.1 کتاب کامفہوم،معنی اورتعریف"] },
  { name: "باب نمبر5: انفارمیشن کامفہوم،معنی اور تعریف", chapters: ["5.1 انفارمیشن کامفہوم،معنی اور تعریف"] },
];





// Map of subject+class+board to chapters
export const subjectChaptersMap: Record<string, ChapterGroup[]> = {
  "Computer-10TH-PTB": computer10thChapters,
  "Chemistry-10TH-PTB": chemistry10thChapters,
  "English-10TH-PTB": english10thChapters,
  "اردو لازمی-10TH-PTB": urdu10thChapters,
  "Physics-INTER-I-PTB": physicsInterOneChapters,
  "Chemistry-INTER-I-PTB": chemistryInterOneChapters,
  "Computer-INTER-I-PTB": computerInterOneChapters,
  "Biology-INTER-I-PTB": biologyInterOneChapters,
  "Mathematics-INTER-I-PTB": mathematicsInterOneChapters,
  "اسلامیات لازمی-INTER-I-PTB": islamiyatInterOneChapters,
  "Economics-INTER-I-PTB": economicsInterOneChapters,
  "معاشیات-INTER-I-PTB": economicsInterOneChapters,
  "Statistics-INTER-I-PTB": statisticsInterOneChapters,
  "شماریات-INTER-I-PTB": statisticsInterOneChapters,
  "Principles of Accounting-INTER-I-PTB": accountingInterOneChapters,
  "اصول محاسبت-INTER-I-PTB": accountingInterOneChapters,
  "Business Maths-INTER-I-PTB": businessMathInterOneChapters,
  "Business Math-INTER-I-PTB": businessMathInterOneChapters,
  "کاروباری ریاضی-INTER-I-PTB": businessMathInterOneChapters,
  "English-INTER-I-PTB": englishInterOneChapters,
  "Principles of Commerce-INTER-I-PTB": principlesOfCommerceInterOneChapters,
  "اصول تجارت-INTER-I-PTB": principlesOfCommerceInterOneChapters,
  "Principles of Economics-INTER-I-PTB": principlesOfEconomicsInterOneChapters,
  "معاشیات کے اصول-INTER-I-PTB": principlesOfEconomicsInterOneChapters,
  // Other subjects can be added here
};

// Map Islamiyat (اختیاری) optional chapters for INTER classes
subjectChaptersMap["اسلامیات اختیاری-INTER-I-PTB"] = islamiyatOptionalChapters;

// Map Nazra Quran for early PTB classes
subjectChaptersMap["ناظرہ قرآن مجید-ONE-PTB"] = nazraQuranChapters;
subjectChaptersMap["ناظرہ قرآن مجید-TWO-PTB"] = nazraQuranChapters;
subjectChaptersMap["ناظرہ قرآن مجید-THREE-PTB"] = nazraQuranChapters;
subjectChaptersMap["ناظرہ قرآن مجید-FOUR-PTB"] = nazraQuranChapters;
subjectChaptersMap["ناظرہ قرآن مجید-5TH-PTB"] = nazraQuranChapters;
subjectChaptersMap["ناظرہ قرآن مجید-6TH-PTB"] = nazraQuranChapters;
subjectChaptersMap["ناظرہ قرآن مجید-7TH-PTB"] = nazraQuranChapters;
subjectChaptersMap["ناظرہ قرآن مجید-8TH-PTB"] = nazraQuranChapters;
// Map Tarjuma (ترجمہ القرآن المجید) for INTER classes as well
subjectChaptersMap["ترجمہ القرآن المجید-INTER-I-PTB"] = nazraQuranChapters;
subjectChaptersMap["Tarjuma-INTER-I-PTB"] = nazraQuranChapters;
subjectChaptersMap["ترجمہ القرآن المجید-INTER-I"] = nazraQuranChapters;
// Also map Tarjuma / ترجمہ القرآن المجید to the same groups for Part ONE
subjectChaptersMap["ترجمہ القرآن المجید-ONE-PTB"] = nazraQuranChapters;
subjectChaptersMap["ترجمہ القرآن المجید-ONE"] = nazraQuranChapters;
subjectChaptersMap["Tarjuma-ONE-PTB"] = nazraQuranChapters;

// Map English pre-9th / pre-11th to the new chapters
subjectChaptersMap["English-9TH-PTB"] = englishPreChapters;
subjectChaptersMap["English-11TH-PTB"] = englishPreChapters;
subjectChaptersMap["اردو لازمی-9TH-PTB"] = urduPreChapters;
subjectChaptersMap["اردو لازمی-11TH-PTB"] = urduPreChapters;
// Also allow Urdu Lazmi pre-chapters to be used for INTER classes where needed
subjectChaptersMap["اردو لازمی-INTER-I-PTB"] = urduPreChapters;

// Map Sociology for INTER classes
subjectChaptersMap["سوشیالوجی-INTER-I-PTB"] = sociologyChapters;
// Tolerant keys for Sociology (سوکس)
subjectChaptersMap["سوکس-INTER-I-PTB"] = sociologyChapters;
subjectChaptersMap["Sociology-INTER-I-PTB"] = sociologyChapters;

// Map Education for INTER classes
subjectChaptersMap["ایجوکیشن-INTER-I-PTB"] = educationChapters;

// Map Punjabi chapters for PTB 9th and 10th
subjectChaptersMap["پنجابی-9TH-PTB"] = punjabiChapters;
subjectChaptersMap["پنجابی-10TH-PTB"] = punjabiChapters;
// Also map Punjabi to PTB Part ONE (ONE)
subjectChaptersMap["پنجابی-ONE-PTB"] = punjabiChapters;
subjectChaptersMap["Punjabi-ONE-PTB"] = punjabiChapters;
subjectChaptersMap["پنجابی-ONE"] = punjabiChapters;
// Map Punjabi for INTER classes (if selected under INTER-I/II)
subjectChaptersMap["پنجابی-INTER-I-PTB"] = punjabiChapters;
subjectChaptersMap["Punjabi-INTER-I-PTB"] = punjabiChapters;

// Map Physical Education for INTER classes
subjectChaptersMap["فزیکل ایجوکیشن-INTER-I-PTB"] = physicalEducationChapters;

// Map Psychology (نفسیات) for INTER classes
subjectChaptersMap["نفسیات-INTER-I-PTB"] = psychologyChapters;

// Map Civics / علم شہریت for secondary classes (user-requested)
subjectChaptersMap["علم شہریت-9TH-PTB"] = civicsChapters;
subjectChaptersMap["علم شہریت-10TH-PTB"] = civicsChapters;
subjectChaptersMap["Civics-9TH-PTB"] = civicsChapters;
subjectChaptersMap["Civics-10TH-PTB"] = civicsChapters;
// Also map Civics to PTB Part ONE (ONE)
subjectChaptersMap["علم شہریت-ONE-PTB"] = civicsChapters;
subjectChaptersMap["Civics-ONE-PTB"] = civicsChapters;
subjectChaptersMap["علم شہریت-ONE"] = civicsChapters;
// Map Farsi (فارسی) Part ONE chapters
subjectChaptersMap["فارسی-ONE-PTB"] = farsiPartOneChapters;
subjectChaptersMap["Farsi-ONE-PTB"] = farsiPartOneChapters;
subjectChaptersMap["فارسی-ONE"] = farsiPartOneChapters;
// Map Farsi for INTER classes (use Part1 chapters as fallback)
subjectChaptersMap["فارسی-INTER-I-PTB"] = farsiPartOneChapters;
subjectChaptersMap["Farsi-INTER-I-PTB"] = farsiPartOneChapters;
subjectChaptersMap["فارسی-INTER-I"] = farsiPartOneChapters;
// Map Physical Geography (طبعی جغرافیہ) for Part ONE
subjectChaptersMap["طبعی جغرافیہ-ONE-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبعی جغرافیہ-ONE"] = physicalGeographyPartOneChapters;
subjectChaptersMap["Physical Geography-ONE-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبعی جغرافیہ-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبی جغرافیہ-ONE-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبی جغرافیہ-ONE"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبی جغرافیہ-PTB"] = physicalGeographyPartOneChapters;

// Map Tareekh-e-Islam (تاریخِ اسلام) Part ONE
subjectChaptersMap["تاریخ اسلام-ONE-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["تاریخ اسلام-ONE"] = tareekhIslamPartOneChapters;
subjectChaptersMap["Tareekh-e-Islam-ONE-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["History of Islam-ONE-PTB"] = tareekhIslamPartOneChapters;
// Additional tolerant aliases for Tareekh-e-Islam
subjectChaptersMap["تاریخِ اسلام-ONE-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["تاریخِ اسلام-ONE"] = tareekhIslamPartOneChapters;
subjectChaptersMap["تاریخ اسلام-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["تاریخ اسلام"] = tareekhIslamPartOneChapters;
subjectChaptersMap["Tareekh e Islam-ONE-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["Tareekh-e-Islam-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["Tareekh-e-Islam"] = tareekhIslamPartOneChapters;
subjectChaptersMap["History of Islam-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["تاریخ اسلام-INTER-I-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["تاریخ اسلام-9TH-PTB"] = tareekhIslamPartOneChapters;
subjectChaptersMap["تاریخ اسلام-10TH-PTB"] = tareekhIslamPartOneChapters;

// Tolerant aliases for Library Science / لائبریری سائنس
subjectChaptersMap["لائبریری سائنس-ONE-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["لائبریری سائنس-ONE"] = librarySciencePartOneChapters;
subjectChaptersMap["لائبریری سائنس-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["Library Science-ONE-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["Library Science-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["Library Science"] = librarySciencePartOneChapters;
subjectChaptersMap["لائبریری سائنس-INTER-I-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["لازمیری سائنس-ONE-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["لازمیری سائنس-ONE"] = librarySciencePartOneChapters;
subjectChaptersMap["لازمیری سائنس-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["لازمیری سائنس-INTER-I-PTB"] = librarySciencePartOneChapters;

// Tolerant aliases for Ikhlaqiat / اخلاقیات
subjectChaptersMap["اخلاقیات-ONE-PTB"] = ikhlaqiatPartOneChapters;
subjectChaptersMap["اخلاقیات-ONE"] = ikhlaqiatPartOneChapters;
subjectChaptersMap["Ethics-ONE-PTB"] = ikhlaqiatPartOneChapters;
subjectChaptersMap["اخلاقیات-PTB"] = ikhlaqiatPartOneChapters;
subjectChaptersMap["اخلاقیات-INTER-I-PTB"] = ikhlaqiatPartOneChapters;

// Tolerant aliases for Physical Geography / طبعی جغرافیہ
subjectChaptersMap["طبعی جغرافیہ-ONE-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبعی جغرافیہ-ONE"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبعی جغرافیہ-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["Physical Geography-ONE-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["Physical Geography-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبعی جغرافیہ-INTER-I-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبی جغرافیہ-ONE-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبی جغرافیہ-ONE"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبی جغرافیہ-PTB"] = physicalGeographyPartOneChapters;
subjectChaptersMap["طبی جغرافیہ-INTER-I-PTB"] = physicalGeographyPartOneChapters;
// Map Ikhlaqiat (اخلاقیات) Part ONE
subjectChaptersMap["اخلاقیات-ONE-PTB"] = ikhlaqiatPartOneChapters;
subjectChaptersMap["اخلاقیات-ONE"] = ikhlaqiatPartOneChapters;
subjectChaptersMap["Ethics-ONE-PTB"] = ikhlaqiatPartOneChapters;
// Map Library Science (لائبریری سائنس) Part ONE
subjectChaptersMap["لائبریری سائنس-ONE-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["لائبریری سائنس-ONE"] = librarySciencePartOneChapters;
subjectChaptersMap["Library Science-ONE-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["لازمیری سائنس-ONE-PTB"] = librarySciencePartOneChapters;
subjectChaptersMap["لازمیری سائنس-ONE"] = librarySciencePartOneChapters;
// Map Civics for INTER classes
subjectChaptersMap["علم شہریت-INTER-I-PTB"] = civicsChapters;
subjectChaptersMap["Civics-INTER-I-PTB"] = civicsChapters;

// INTER-II (2nd year): only the subjects in interTwoChapters.ts have topics.
Object.assign(subjectChaptersMap, interTwoChapters);

// Load AFAQ, Oxford, BA chapter JSON data synchronously
const defaultBaChapter: ChapterGroup[] = [{ name: "Syllabus", chapters: ["Full Syllabus"] }];
const populateChapters = (data: unknown) => {
  const records = data as Record<string, unknown>;
  Object.entries(records).forEach(([key, chapters]) => {
    subjectChaptersMap[key] = chapters as ChapterGroup[];
  });
};
populateChapters(afaqTopicChapters);
populateChapters(oxfordTopicChapters);
populateChapters(baTopicChapters);
// BA subjects without TXT data — register immediately (hardcoded, no JSON)
const baSubjectsNoData: Record<string, string[]> = {
  "B.A Part-I": ["پنجابی", "عربی", "کشمیرات", "عمرانیات"],
  "B.A Part-II": ["پنجابی"],
};
Object.entries(baSubjectsNoData).forEach(([cls, subjects]) => {
  subjects.forEach(subj => {
    const key = `${subj}-${cls}-BA`;
    if (!subjectChaptersMap[key]) {
      subjectChaptersMap[key] = defaultBaChapter;
    }
  });
});

export const getChaptersForSubject = (subject: string, className: string, board: string): ChapterGroup[] => {
  // If subject contains a series separator, extract actual subject and series
  let actualSubject = subject;
  let series = "";
  if (subject.includes("||")) {
    const parts = subject.split("||");
    actualSubject = parts[0];
    series = parts[1];
  }

  // For AFAQ with series info, do a direct lookup with series in the key
  if (series && board === "AFAQ") {
    const seriesKey = `${actualSubject}-${series}-${className}-${board}`;
    try {
      console.log(`[AFAQ lookup] subject="${actualSubject}" series="${series}" class="${className}" board="${board}" key="${seriesKey}" exists=${!!subjectChaptersMap[seriesKey]} mapKeys=${Object.keys(subjectChaptersMap).filter(k=>k.includes(actualSubject)).join(", ")}`);
    } catch(e) {}
    if (subjectChaptersMap[seriesKey]) return subjectChaptersMap[seriesKey];
  }

  const fromTopicsFile = getNineTopicChapters(actualSubject, className, board);
  if (fromTopicsFile && fromTopicsFile.length > 0) {
    return fromTopicsFile;
  }

  const fromTenTopicsFile = getTenTopicChapters(actualSubject, className, board);
  if (fromTenTopicsFile && fromTenTopicsFile.length > 0) {
    return fromTenTopicsFile;
  }

  const key = `${actualSubject}-${className}-${board}`;
  // INTER-II: show only the topics registered for it; never fall back to Part 1 or the dummy list.
  if (board === "PTB" && className === "INTER-II") {
    return subjectChaptersMap[key] ?? [];
  }
  // Debug logging to help trace why some subjects don't return chapters
  try {
    // eslint-disable-next-line no-console
    console.debug(`[subjectData] lookup key=${key} (subject=${subject}, class=${className}, board=${board})`);
  } catch (e) {
    // ignore
  }
  if (subjectChaptersMap[key]) {
    try {
      // eslint-disable-next-line no-console
      console.debug(`[subjectData] found exact match for key=${key}`);
    } catch (e) {}
    return subjectChaptersMap[key];
  }

  // Tolerant lookup: try normalized, case-insensitive matches to handle
  // minor differences like casing, extra spaces, or punctuation in UI labels.
  const normalize = (s: string) => {
    // remove Arabic diacritics, normalize whitespace, remove parentheses and common punctuation
    return s
      .toLowerCase()
      .replace(/[\u064B-\u065F]/g, "")
      .replace(/[،:؛,.!?"'\/\\]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[()\[\]{}]/g, "")
      .trim();
  };
  const target = normalize(key);
  for (const k of Object.keys(subjectChaptersMap)) {
    if (normalize(k) === target) return subjectChaptersMap[k];
  }

  // Try matching by subject+class (ignore board) as a last resort
  const targetSubjectClass = normalize(`${actualSubject}-${className}`);
  for (const k of Object.keys(subjectChaptersMap)) {
    if (normalize(k).startsWith(targetSubjectClass)) return subjectChaptersMap[k];
  }

  // Final fallback: subject + class + board must all appear in the map key
  const targetSubjectOnly = normalize(actualSubject);
  const targetClassOnly = normalize(className);
  const targetBoardOnly = normalize(board);
  for (const k of Object.keys(subjectChaptersMap)) {
    const nk = normalize(k);
    if (nk.startsWith(targetSubjectOnly) && nk.includes(targetClassOnly) && nk.includes(targetBoardOnly)) {
      return subjectChaptersMap[k];
    }
  }

  return defaultChapters;
};
