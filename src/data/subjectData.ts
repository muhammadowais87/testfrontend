export type SubjectCard = {
  title: string;
  subtitle: string;
  image: string;
  showArrow?: boolean;
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
  "Geography": "/images/books/geography-book.png",
  "جغرافیہ": "/images/books/geography-book.png",
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
};

const getBookImage = (title: string): string => {
  return bookImages[title] || "/images/books/generic-book.png";
};

export const syllabusCards = [
  { title: "ONE", board: "PTB", gradient: "from-cyan-300 to-blue-400" },
  { title: "TWO", board: "PTB", gradient: "from-green-600 to-lime-400" },
  { title: "THREE", board: "PTB", gradient: "from-cyan-500 to-blue-500" },
  { title: "FOUR", board: "PTB", gradient: "from-amber-300 to-orange-300" },
  { title: "5TH", board: "PTB", gradient: "from-orange-500 to-yellow-400" },
  { title: "6TH", board: "PTB", gradient: "from-blue-400 to-cyan-400" },
  { title: "7TH", board: "PTB", gradient: "from-purple-500 to-pink-400" },
  { title: "8TH", board: "PTB", gradient: "from-emerald-400 to-blue-700" },
  { title: "9TH", board: "PTB", gradient: "from-cyan-300 to-blue-400" },
  { title: "10TH", board: "PTB", gradient: "from-green-600 to-lime-400" },
  { title: "INTER-I", board: "PTB", gradient: "from-cyan-500 to-blue-500" },
  { title: "INTER-II", board: "PTB", gradient: "from-amber-300 to-orange-300" },
  { title: "OLD BOOKS", board: "PTB", gradient: "from-orange-500 to-yellow-400" },
];

export const afaqCards = [
  { title: "ONE", board: "AFAQ", gradient: "from-green-400 to-lime-300" },
  { title: "TWO", board: "AFAQ", gradient: "from-cyan-300 to-blue-400" },
  { title: "THREE", board: "AFAQ", gradient: "from-orange-300 to-amber-400" },
  { title: "FOUR", board: "AFAQ", gradient: "from-purple-500 to-pink-400" },
  { title: "5TH", board: "AFAQ", gradient: "from-blue-400 to-cyan-400" },
  { title: "6TH", board: "AFAQ", gradient: "from-emerald-400 to-blue-700" },
  { title: "7TH", board: "AFAQ", gradient: "from-amber-300 to-orange-300" },
];

export const oxfordCards = [
  { title: "ONE", board: "OXFORD", gradient: "from-cyan-400 to-blue-500" },
  { title: "TWO", board: "OXFORD", gradient: "from-green-600 to-lime-400" },
  { title: "THREE", board: "OXFORD", gradient: "from-orange-500 to-yellow-400" },
  { title: "FOUR", board: "OXFORD", gradient: "from-purple-500 to-pink-400" },
  { title: "5TH", board: "OXFORD", gradient: "from-cyan-300 to-blue-400" },
  { title: "6TH", board: "OXFORD", gradient: "from-emerald-400 to-blue-700" },
  { title: "7TH", board: "OXFORD", gradient: "from-amber-300 to-orange-300" },
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

export const boardClassMap: Record<string, { title: string; board: string; gradient: string }[]> = {
  PTB: syllabusCards,
  AFAQ: afaqCards,
  OXFORD: oxfordCards,
  GOHAR: goharCards,
  BA: baCards,
};

export const ninthSubjects: SubjectCard[] = [
  { title: "Biology", subtitle: "SNC-2025", image: getBookImage("Biology") },
  { title: "Computer", subtitle: "SNC-2025", image: getBookImage("Computer"), showArrow: true },
  { title: "Chemistry", subtitle: "SNC-2025", image: getBookImage("Chemistry") },
  { title: "Physics", subtitle: "SNC-2025", image: getBookImage("Physics") },
  { title: "Mathematics", subtitle: "SNC-2025", image: getBookImage("Mathematics") },
  { title: "English", subtitle: "SNC-2025", image: getBookImage("English") },
  { title: "اردو لازمی", subtitle: "SNC-2025", image: getBookImage("اردو لازمی") },
  { title: "اسلامیات لازمی", subtitle: "SNC-2025", image: getBookImage("اسلامیات لازمی") },
  { title: "General Science", subtitle: "9TH", image: getBookImage("General Science") },
];

export const ninthOptionalSubjects: SubjectCard[] = [
  { title: "ایجوکیشن", subtitle: "9TH", image: getBookImage("ایجوکیشن") },
  { title: "پنجابی", subtitle: "9TH", image: getBookImage("پنجابی"), showArrow: true },
  { title: "اسلامیات اختیاری", subtitle: "9TH", image: getBookImage("اسلامیات اختیاری") },
  { title: "ہوم اکنامکس", subtitle: "9TH", image: getBookImage("ہوم اکنامکس") },
  { title: "سوکس", subtitle: "9TH", image: getBookImage("سوکس") },
  { title: "معاشیات", subtitle: "9TH", image: getBookImage("معاشیات") },
  { title: "ترجمہ القرآن المجید", subtitle: "2022", image: getBookImage("ترجمہ القرآن المجید") },
  { title: "اخلاقیات", subtitle: "9TH", image: getBookImage("اخلاقیات") },
  { title: "فزیکل ایجوکیشن", subtitle: "9TH", image: getBookImage("فزیکل ایجوکیشن") },
  { title: "مرغبانی", subtitle: "9TH", image: getBookImage("مرغبانی") },
  { title: "غذا اور غذائیت", subtitle: "PTB", image: getBookImage("غذا اور غذائیت") },
];

export const tenthSubjects: SubjectCard[] = [
  { title: "Biology", subtitle: "10TH", image: getBookImage("Biology") },
  { title: "Computer", subtitle: "2022", image: getBookImage("Computer"), showArrow: true },
  { title: "Chemistry", subtitle: "10TH", image: getBookImage("Chemistry") },
  { title: "Physics", subtitle: "10TH", image: getBookImage("Physics") },
  { title: "Mathematics", subtitle: "10TH", image: getBookImage("Mathematics") },
  { title: "English", subtitle: "10TH", image: getBookImage("English") },
  { title: "Pakistan Studies", subtitle: "SNC-2025", image: getBookImage("Pakistan Studies") },
  { title: "اردو لازمی", subtitle: "10TH", image: getBookImage("اردو لازمی") },
  { title: "اسلامیات لازمی", subtitle: "SNC-2023", image: getBookImage("اسلامیات لازمی") },
];

export const tenthOptionalSubjects: SubjectCard[] = [
  { title: "General Science", subtitle: "10TH", image: getBookImage("General Science") },
  { title: "جنرل ریاضی", subtitle: "10TH", image: getBookImage("جنرل ریاضی") },
  { title: "ایجوکیشن", subtitle: "10TH", image: getBookImage("ایجوکیشن") },
  { title: "پنجابی", subtitle: "10TH", image: getBookImage("پنجابی") },
  { title: "اسلامیات اختیاری", subtitle: "10TH", image: getBookImage("اسلامیات اختیاری") },
  { title: "ہوم اکنامکس", subtitle: "10TH", image: getBookImage("ہوم اکنامکس") },
  { title: "سوکس", subtitle: "10TH", image: getBookImage("سوکس") },
  { title: "معاشیات", subtitle: "10TH", image: getBookImage("معاشیات") },
  { title: "ترجمہ القرآن المجید", subtitle: "2023", image: getBookImage("ترجمہ القرآن المجید") },
  { title: "اخلاقیات", subtitle: "PTB", image: getBookImage("اخلاقیات") },
  { title: "فزیکل ایجوکیشن", subtitle: "PTB", image: getBookImage("فزیکل ایجوکیشن") },
  { title: "مرغبانی", subtitle: "PTB", image: getBookImage("مرغبانی") },
  { title: "غذا اور غذائیت", subtitle: "PTB", image: getBookImage("غذا اور غذائیت") },
];

export const interOneCoreSubjects: SubjectCard[] = [
  { title: "Biology", subtitle: "SNC-2025", image: getBookImage("Biology") },
  { title: "Chemistry", subtitle: "SNC-2025", image: getBookImage("Chemistry"), showArrow: true },
  { title: "Physics", subtitle: "SNC-2025", image: getBookImage("Physics") },
  { title: "Mathematics", subtitle: "SNC-2025", image: getBookImage("Mathematics") },
  { title: "Computer", subtitle: "SNC-2025", image: getBookImage("Computer") },
  { title: "Statistics", subtitle: "ICS", image: getBookImage("Statistics") },
  { title: "Economics", subtitle: "ICS", image: getBookImage("Economics") },
  { title: "English", subtitle: "SNC-2025", image: getBookImage("English") },
  { title: "Principles of Accounting", subtitle: "I.COM", image: getBookImage("Principles of Accounting") },
];

export const interOneGeneralSubjects: SubjectCard[] = [
  { title: "Principles of Economics", subtitle: "I.COM", image: getBookImage("Principles of Economics") },
  { title: "Principles of Commerce", subtitle: "I.COM", image: getBookImage("Principles of Commerce"), showArrow: true },
  { title: "Business Maths", subtitle: "I.COM", image: getBookImage("Business Maths") },
  { title: "اسلامیات لازمی", subtitle: "SNC-2025", image: getBookImage("اسلامیات لازمی") },
  { title: "اردو لازمی", subtitle: "SNC-2025", image: getBookImage("اردو لازمی") },
  { title: "ایجوکیشن", subtitle: "F.A", image: getBookImage("ایجوکیشن") },
  { title: "سوکس", subtitle: "F.A", image: getBookImage("سوکس") },
  { title: "پنجابی", subtitle: "F.A", image: getBookImage("پنجابی") },
  { title: "اسلامیات اختیاری", subtitle: "F.A", image: getBookImage("اسلامیات اختیاری") },
  { title: "فزیکل ایجوکیشن", subtitle: "F.A", image: getBookImage("فزیکل ایجوکیشن") },
  { title: "سوشیالوجی", subtitle: "F.A", image: getBookImage("سوشیالوجی") },
  { title: "اخلاقیات", subtitle: "PTB", image: getBookImage("اخلاقیات") },
];

export const interOneExtraSubjects: SubjectCard[] = [
  { title: "ترجمہ القرآن المجید", subtitle: "SNC-2022", image: getBookImage("ترجمہ القرآن المجید") },
  { title: "قبلیت", subtitle: "F.A", image: getBookImage("قبلیت"), showArrow: true },
  { title: "فارسی", subtitle: "PTB", image: getBookImage("فارسی") },
  { title: "تاریخ اسلام", subtitle: "PTB", image: getBookImage("تاریخ اسلام") },
  { title: "صدیقۃ الادب", subtitle: "F.A", image: getBookImage("صدیقۃ الادب") },
  { title: "طبی جغرافیہ", subtitle: "PTB", image: getBookImage("طبی جغرافیہ") },
  { title: "لازمیری سائنس", subtitle: "PTB", image: getBookImage("لازمیری سائنس") },
  { title: "ہوم اکنامکس", subtitle: "PTB", image: getBookImage("ہوم اکنامکس") },
  { title: "تاریخ پاکستان", subtitle: "PTB", image: getBookImage("تاریخ پاکستان") },
];

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
  { title: "پاکستان کا معاشرہ", subtitle: "2022", image: getBookImage("پاکستان کا معاشرہ") },
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
  { title: "ترجمہ القرآن المجید", subtitle: "SNC-2023", image: getBookImage("ترجمہ القرآن المجید") },
  { title: "قبلیت", subtitle: "PTB", image: getBookImage("قبلیت") },
  { title: "فارسی", subtitle: "PTB", image: getBookImage("فارسی") },
  { title: "تاریخ اسلام", subtitle: "PTB", image: getBookImage("تاریخ اسلام") },
  { title: "عربی الادب", subtitle: "F.A", image: getBookImage("عربی الادب") },
  { title: "رسالیہ جغرافیہ", subtitle: "PTB", image: getBookImage("رسالیہ جغرافیہ") },
  { title: "لازمیری سائنس", subtitle: "PTB", image: getBookImage("لازمیری سائنس") },
  { title: "ہوم اکنامکس", subtitle: "PTB", image: getBookImage("ہوم اکنامکس") },
  { title: "تاریخ پاکستان", subtitle: "PTB", image: getBookImage("تاریخ پاکستان") },
];

// ---- PTB Classes 1-8 & OLD BOOKS subjects ----

export const classOneSubjects: SubjectCard[] = [
  { title: "English", subtitle: "PTB", image: getBookImage("English") },
  { title: "اردو", subtitle: "PTB", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "PTB", image: getBookImage("Mathematics") },
  { title: "ناظرہ قرآن مجید", subtitle: "PTB", image: getBookImage("ناظرہ قرآن مجید") },
  { title: "General Science", subtitle: "PTB", image: getBookImage("General Science") },
];

export const classTwoSubjects: SubjectCard[] = [
  { title: "English", subtitle: "PTB", image: getBookImage("English") },
  { title: "اردو", subtitle: "PTB", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "PTB", image: getBookImage("Mathematics") },
  { title: "ناظرہ قرآن مجید", subtitle: "PTB", image: getBookImage("ناظرہ قرآن مجید") },
  { title: "General Science", subtitle: "PTB", image: getBookImage("General Science") },
];

export const classThreeSubjects: SubjectCard[] = [
  { title: "English", subtitle: "PTB", image: getBookImage("English") },
  { title: "اردو", subtitle: "PTB", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "PTB", image: getBookImage("Mathematics") },
  { title: "ناظرہ قرآن مجید", subtitle: "PTB", image: getBookImage("ناظرہ قرآن مجید") },
  { title: "General Science", subtitle: "PTB", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "PTB", image: getBookImage("اسلامیات") },
];

export const classFourSubjects: SubjectCard[] = [
  { title: "English", subtitle: "PTB", image: getBookImage("English") },
  { title: "اردو", subtitle: "PTB", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "PTB", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "PTB", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "PTB", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "PTB", image: getBookImage("معاشرتی علوم") },
  { title: "ناظرہ قرآن مجید", subtitle: "PTB", image: getBookImage("ناظرہ قرآن مجید") },
];

export const classFifthSubjects: SubjectCard[] = [
  { title: "English", subtitle: "PTB", image: getBookImage("English") },
  { title: "اردو", subtitle: "PTB", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "PTB", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "PTB", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "PTB", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "PTB", image: getBookImage("معاشرتی علوم") },
  { title: "ناظرہ قرآن مجید", subtitle: "PTB", image: getBookImage("ناظرہ قرآن مجید") },
  { title: "Computer", subtitle: "PTB", image: getBookImage("Computer") },
];

export const classSixthSubjects: SubjectCard[] = [
  { title: "English", subtitle: "PTB", image: getBookImage("English") },
  { title: "اردو", subtitle: "PTB", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "PTB", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "PTB", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "PTB", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "PTB", image: getBookImage("معاشرتی علوم") },
  { title: "ناظرہ قرآن مجید", subtitle: "PTB", image: getBookImage("ناظرہ قرآن مجید") },
  { title: "Computer", subtitle: "PTB", image: getBookImage("Computer") },
];

export const classSeventhSubjects: SubjectCard[] = [
  { title: "English", subtitle: "PTB", image: getBookImage("English") },
  { title: "اردو", subtitle: "PTB", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "PTB", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "PTB", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "PTB", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "PTB", image: getBookImage("معاشرتی علوم") },
  { title: "ناظرہ قرآن مجید", subtitle: "PTB", image: getBookImage("ناظرہ قرآن مجید") },
  { title: "Computer", subtitle: "PTB", image: getBookImage("Computer") },
];

export const classEighthSubjects: SubjectCard[] = [
  { title: "English", subtitle: "SNC-2025", image: getBookImage("English") },
  { title: "اردو", subtitle: "PTB", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "SNC-2025", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "SNC-2025", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "SNC-2025", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "PTB", image: getBookImage("معاشرتی علوم") },
  { title: "Computer", subtitle: "PTB", image: getBookImage("Computer") },
  { title: "ناظرہ قرآن مجید", subtitle: "PTB", image: getBookImage("ناظرہ قرآن مجید") },
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
const sncClassOne: SubjectCard[] = [
  { title: "English", subtitle: "SNC", image: getBookImage("English") },
  { title: "اردو", subtitle: "SNC", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "SNC", image: getBookImage("Mathematics") },
  { title: "ناظرہ قرآن مجید", subtitle: "SNC", image: getBookImage("ناظرہ قرآن مجید") },
  { title: "General Science", subtitle: "SNC", image: getBookImage("General Science") },
];
const sncClassTwo: SubjectCard[] = [
  { title: "English", subtitle: "SNC", image: getBookImage("English") },
  { title: "اردو", subtitle: "SNC", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "SNC", image: getBookImage("Mathematics") },
  { title: "ناظرہ قرآن مجید", subtitle: "SNC", image: getBookImage("ناظرہ قرآن مجید") },
  { title: "General Science", subtitle: "SNC", image: getBookImage("General Science") },
];
const sncClassThree: SubjectCard[] = [
  { title: "English", subtitle: "SNC", image: getBookImage("English") },
  { title: "اردو", subtitle: "SNC", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "SNC", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "SNC", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "SNC", image: getBookImage("اسلامیات") },
  { title: "ناظرہ قرآن مجید", subtitle: "SNC", image: getBookImage("ناظرہ قرآن مجید") },
];
const sncClassFour: SubjectCard[] = [
  { title: "English", subtitle: "SNC", image: getBookImage("English") },
  { title: "اردو", subtitle: "SNC", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "SNC", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "SNC", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "SNC", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "SNC", image: getBookImage("معاشرتی علوم") },
  { title: "ناظرہ قرآن مجید", subtitle: "SNC", image: getBookImage("ناظرہ قرآن مجید") },
];
const sncClassFifth: SubjectCard[] = [
  { title: "English", subtitle: "SNC", image: getBookImage("English") },
  { title: "اردو", subtitle: "SNC", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "SNC", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "SNC", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "SNC", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "SNC", image: getBookImage("معاشرتی علوم") },
  { title: "Computer", subtitle: "SNC", image: getBookImage("Computer") },
  { title: "ناظرہ قرآن مجید", subtitle: "SNC", image: getBookImage("ناظرہ قرآن مجید") },
];
const sncClassSixth: SubjectCard[] = [
  { title: "English", subtitle: "SNC", image: getBookImage("English") },
  { title: "اردو", subtitle: "SNC", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "SNC", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "SNC", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "SNC", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "SNC", image: getBookImage("معاشرتی علوم") },
  { title: "Computer", subtitle: "SNC", image: getBookImage("Computer") },
  { title: "ناظرہ قرآن مجید", subtitle: "SNC", image: getBookImage("ناظرہ قرآن مجید") },
];
const sncClassSeventh: SubjectCard[] = [
  { title: "English", subtitle: "SNC", image: getBookImage("English") },
  { title: "اردو", subtitle: "SNC", image: getBookImage("اردو") },
  { title: "Mathematics", subtitle: "SNC", image: getBookImage("Mathematics") },
  { title: "General Science", subtitle: "SNC", image: getBookImage("General Science") },
  { title: "اسلامیات", subtitle: "SNC", image: getBookImage("اسلامیات") },
  { title: "معاشرتی علوم", subtitle: "SNC", image: getBookImage("معاشرتی علوم") },
  { title: "Computer", subtitle: "SNC", image: getBookImage("Computer") },
  { title: "ناظرہ قرآن مجید", subtitle: "SNC", image: getBookImage("ناظرہ قرآن مجید") },
];

const sncClassMap: Record<string, SubjectCard[][]> = {
  "ONE": [sncClassOne],
  "TWO": [sncClassTwo],
  "THREE": [sncClassThree],
  "FOUR": [sncClassFour],
  "5TH": [sncClassFifth],
  "6TH": [sncClassSixth],
  "7TH": [sncClassSeventh],
};

// ---- B.A subjects ----
const baPartOneSubjects: SubjectCard[] = [
  { title: "English", subtitle: "B.A", image: getBookImage("English") },
  { title: "اردو", subtitle: "B.A", image: getBookImage("اردو") },
  { title: "اسلامیات", subtitle: "B.A", image: getBookImage("اسلامیات") },
  { title: "Pakistan Studies", subtitle: "B.A", image: getBookImage("Pakistan Studies") },
  { title: "Economics", subtitle: "B.A", image: getBookImage("Economics") },
  { title: "ایجوکیشن", subtitle: "B.A", image: getBookImage("ایجوکیشن") },
  { title: "سوشیالوجی", subtitle: "B.A", image: getBookImage("سوشیالوجی") },
  { title: "پنجابی", subtitle: "B.A", image: getBookImage("پنجابی") },
];
const baPartTwoSubjects: SubjectCard[] = [
  { title: "English", subtitle: "B.A", image: getBookImage("English") },
  { title: "اردو", subtitle: "B.A", image: getBookImage("اردو") },
  { title: "Economics", subtitle: "B.A", image: getBookImage("Economics") },
  { title: "ایجوکیشن", subtitle: "B.A", image: getBookImage("ایجوکیشن") },
  { title: "سوشیالوجی", subtitle: "B.A", image: getBookImage("سوشیالوجی") },
  { title: "پنجابی", subtitle: "B.A", image: getBookImage("پنجابی") },
  { title: "Pakistan Studies", subtitle: "B.A", image: getBookImage("Pakistan Studies") },
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
  "10TH": [tenthSubjects, tenthOptionalSubjects],
  "INTER-I": [interOneCoreSubjects, interOneGeneralSubjects, interOneExtraSubjects],
  "INTER-II": [interTwoCoreSubjects, interTwoCommerceSubjects, interTwoExtraSubjects],
  "OLD BOOKS": [oldBooksSubjects],
};

// Board-level map: board name -> class -> subjects
export const boardSubjectsMap: Record<string, Record<string, SubjectCard[][]>> = {
  PTB: ptbClassSubjectsMap,
  AFAQ: sncClassMap,
  OXFORD: sncClassMap,
  GOHAR: sncClassMap,
  BA: baClassMap,
};

export const boardCards = [
  { name: "PTB", label: "PTB", subtitle: "Syllabus", logo: "/images/PTBLogo.png", gradient: "from-cyan-300 to-blue-400" },
  { name: "AFAQ", label: "AFAQ SNC", subtitle: "Syllabus", logo: "/images/AfaqLogo.png", gradient: "from-green-500 to-lime-400" },
  { name: "OXFORD", label: "OXFORD SNC", subtitle: "Syllabus", logo: "/images/OxfordLogo.png", gradient: "from-cyan-400 to-blue-500" },
  { name: "GOHAR", label: "GOHAR SNC", subtitle: "Syllabus", logo: "/images/GoharLogo.png", gradient: "from-orange-300 to-amber-400" },
  { name: "BA", label: "B.A", subtitle: "Syllabus", logo: "/images/PULogo.png", gradient: "from-yellow-400 to-amber-500" },
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
          const label = `${board} - ${className} - ${title}`;
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

// Map of subject+class+board to chapters
export const subjectChaptersMap: Record<string, ChapterGroup[]> = {
  "Computer-10TH-PTB": computer10thChapters,
  // Other subjects can be added here
};

export const getChaptersForSubject = (subject: string, className: string, board: string): ChapterGroup[] => {
  const key = `${subject}-${className}-${board}`;
  return subjectChaptersMap[key] || defaultChapters;
};
