import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Barcode, BookOpen, Calculator, CalendarDays, ChevronDown, ChevronLeft, Clock3, GraduationCap, Hash, PenLine, Printer, User } from "lucide-react";
import { getSavedPaperById, type SavedPaperRecord } from "@/lib/savedPapers";
import { API_BASE_URL } from "@/lib/api";
import { useInstituteSessionStore } from "@/stores/instituteSessionStore";
import { useTeacherSessionStore } from "@/stores/teacherSessionStore";
import { useIsMobile } from "@/hooks/use-mobile";

const SavedPaperViewer = () => {
  const DESKTOP_PREVIEW_WIDTH = 1100;
  const navigate = useNavigate();
  const location = useLocation();
  const instituteSession = useInstituteSessionStore((s) => s.session);
  const teacherSession = useTeacherSessionStore((s) => s.session);
  const isTeacherRoute = location.pathname.startsWith("/teacher/");
  const navState = location.state as { autoPrint?: boolean; printMode?: "single" | "double" | "half"; paperOverride?: SavedPaperRecord } | null;
  const { id } = useParams();
  const isMobile = useIsMobile();
  const paperId = Number(id);
  const [paper, setPaper] = useState(() => navState?.paperOverride ?? getSavedPaperById(paperId));
  const [lineHeight, setLineHeight] = useState("1.28");
  const [urduFontSize, setUrduFontSize] = useState("12");
  const [englishFontSize, setEnglishFontSize] = useState("11");
  const [titleFontSize, setTitleFontSize] = useState("35");
  const [fontWeight, setFontWeight] = useState("Normal");
  const [fontColor, setFontColor] = useState("Black");
  const [borderStyle, setBorderStyle] = useState("No Border");
  const [pageBorder, setPageBorder] = useState("No Border");
  const [layout, setLayout] = useState("Layout 1");
  const [watermark, setWatermark] = useState("Monogram Watermark");
  const [manualEditing, setManualEditing] = useState(false);
  const [showFontStylesMenu, setShowFontStylesMenu] = useState(false);
  const [englishFontFamily, setEnglishFontFamily] = useState("Poppins");
  const [urduFontFamily, setUrduFontFamily] = useState("Noto Nastaliq Urdu");
  const [titleFontFamily, setTitleFontFamily] = useState("Times New Roman");
  const [printExamSyllabus, setPrintExamSyllabus] = useState(true);
  const [printBubbleSheet, setPrintBubbleSheet] = useState(false);
  const [printAnswerKeys, setPrintAnswerKeys] = useState(false);
  const [tickAnswers, setTickAnswers] = useState(false);
  const [wordFontSize, setWordFontSize] = useState(14);
  const [logoScale, setLogoScale] = useState("100");
  const [monogramScale, setMonogramScale] = useState("100");
  const [selectedLineHeight, setSelectedLineHeight] = useState("1.28");
  const [hasTextSelection, setHasTextSelection] = useState(false);
  const [sectionMarksOverrides, setSectionMarksOverrides] = useState<Record<string, string>>({});
  const [headerInfo, setHeaderInfo] = useState({
    schoolName: "The Hope Science Academy",
    slogan: "Excellence is our standard not goal",
    addressLine: "247-E-1, (Opposite LDA School) Johar Town, Lahore. PH: 0300-8194789, 0322-4157001",
    logoUrl: "",
  });
  const [paperFields, setPaperFields] = useState({
    studentName: "",
    rollNum: "",
    paperCode: "",
    className: "",
    subjectName: "",
    timeAllowed: "40",
    totalMarks: "0",
    examDate: "",
    section: "",
    paperType: "",
    groupName: "",
    round: "",
    phase: "",
    testDetails: "",
  });
  const [editableQuestions, setEditableQuestions] = useState<Array<{ id: number; text: string; urdu: string; contentType?: "mcq" | "short" | "long" }>>([]);
  const [mobilePreviewZoom, setMobilePreviewZoom] = useState(1);

  const handlePrintPaper = useCallback(() => {
    const prevTitle = document.title;
    const printStyle = document.createElement("style");
    printStyle.setAttribute("data-print-cleanup", "saved-paper-viewer");
    printStyle.textContent = `
      @media print {
        @page { margin: 0 !important; size: auto; }
        html, body { margin: 0 !important; padding: 0 !important; }
      }
    `;

    document.head.appendChild(printStyle);
    document.title = "";

    try {
      window.print();
    } finally {
      document.title = prevTitle;
      printStyle.remove();
    }
  }, []);

  const applySelectionStyle = (e: React.MouseEvent, styles: Partial<CSSStyleDeclaration>) => {
    e.preventDefault();
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    Object.assign(span.style, styles);
    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
    const updatedRange = document.createRange();
    updatedRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(updatedRange);
  };

  const applyWordFontSize = (e: React.MouseEvent, size: number) => {
    applySelectionStyle(e, { fontSize: `${size}px` });
  };

  const applySelectedLineHeight = (e: React.MouseEvent, height: number) => {
    applySelectionStyle(e, { display: "inline-block", lineHeight: String(height) });
  };

  const getSelectionAnchorElement = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const node = sel.getRangeAt(0).startContainer;
    return node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
  };

  const applyBoldToSelection = (e: React.MouseEvent) => {
    const anchorEl = getSelectionAnchorElement();
    const currentWeight = anchorEl ? Number.parseInt(window.getComputedStyle(anchorEl).fontWeight, 10) || 400 : 400;
    const shouldUnbold = currentWeight >= 600;
    applySelectionStyle(e, { fontWeight: shouldUnbold ? "400" : "700" });
  };

  const applyUnderlineToSelection = (e: React.MouseEvent) => {
    const anchorEl = getSelectionAnchorElement();
    const hasUnderline = Boolean(anchorEl && window.getComputedStyle(anchorEl).textDecorationLine.includes("underline"));
    applySelectionStyle(e, { textDecoration: hasUnderline ? "none" : "underline" });
  };

  const handleResetFontStyles = () => {
    setLineHeight("1.28");
    setUrduFontSize("12");
    setEnglishFontSize("11");
    setTitleFontSize("35");
    setFontWeight("Normal");
    setFontColor("Black");
    setWordFontSize(14);
    setSelectedLineHeight("1.28");
    setEnglishFontFamily("Poppins");
    setUrduFontFamily("Noto Nastaliq Urdu");
    setTitleFontFamily("Times New Roman");
  };

  useEffect(() => {
    const latestPaper = navState?.paperOverride ?? getSavedPaperById(paperId);
    setPaper(latestPaper);
    setPaperFields((prev) => ({
      ...prev,
      className: latestPaper?.className || "",
      subjectName: latestPaper?.subject || "",
      timeAllowed: latestPaper?.timeAllowed || "40",
      totalMarks: latestPaper?.totalMarks || "0",
      examDate: latestPaper?.date || "",
    }));
    setEditableQuestions(
      (latestPaper?.questions || []).map((q) => ({
        id: q.id,
        text: q.text,
        urdu: q.urdu,
        contentType: q.contentType,
      }))
    );
  }, [paperId, navState?.paperOverride]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      setHasTextSelection(Boolean(sel && !sel.isCollapsed && (sel.toString() || "").trim().length > 0));
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    handleSelectionChange();
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobilePreviewZoom(1);
      return;
    }

    const updateZoom = () => {
      const availableWidth = Math.max(320, window.innerWidth - 16);
      setMobilePreviewZoom(Math.min(1, availableWidth / DESKTOP_PREVIEW_WIDTH));
    };

    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, [isMobile, DESKTOP_PREVIEW_WIDTH]);

  useEffect(() => {
    setHeaderInfo((prev) => ({
      ...prev,
      schoolName: teacherSession?.schoolName || instituteSession?.name || prev.schoolName,
    }));
  }, [instituteSession?.name, teacherSession?.schoolName]);

  useEffect(() => {
    if (!navState?.autoPrint) return;

    const timer = window.setTimeout(() => {
      handlePrintPaper();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [navState, handlePrintPaper]);

  useEffect(() => {
    const instituteToken = instituteSession?.token;
    const teacherToken = teacherSession?.token;
    const token = isTeacherRoute ? teacherToken : instituteToken;
    if (!token) return;

    let cancelled = false;
    const loadHeaderSettings = async () => {
      try {
        const endpoint = isTeacherRoute ? "/teacher-auth/me" : "/institute-auth/me";
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok || cancelled) return;

        if (isTeacherRoute && data?.teacher) {
          const teacher = data.teacher;
          const teacherSettings = teacher.portalSettings || {};
          setHeaderInfo((prev) => ({
            ...prev,
            schoolName: teacherSettings.schoolName || teacher.schoolName || teacherSession?.schoolName || prev.schoolName,
            addressLine: teacherSettings.schoolAddress || prev.addressLine,
            logoUrl: teacherSettings.logoUrl || prev.logoUrl,
          }));
          return;
        }

        if (!isTeacherRoute && data?.institute) {
          const institute = data.institute;
          const phones = [institute.phonePrimary, institute.phoneSecondary].filter(Boolean).join(", ");
          const addressLine = [
            institute.address,
            phones ? `PH: ${phones}` : "",
          ]
            .filter(Boolean)
            .join(". ");

          setHeaderInfo((prev) => ({
            ...prev,
            schoolName: institute.name || prev.schoolName,
            addressLine: addressLine || prev.addressLine,
            logoUrl: institute.portalSettings?.logoUrl || prev.logoUrl,
          }));
        }
      } catch {
        // Keep defaults silently.
      }
    };

    loadHeaderSettings();
    return () => {
      cancelled = true;
    };
  }, [instituteSession?.token, teacherSession?.token, teacherSession?.schoolName, isTeacherRoute]);

  const parseQuestionOptions = (text: string) => {
    const optionRegex = /\(([A-D])\)\s*([^()]+?)(?=\s*\([A-D]\)|$)/g;
    const options: Array<{ key: string; value: string }> = [];
    let match: RegExpExecArray | null;

    while ((match = optionRegex.exec(text)) !== null) {
      options.push({ key: match[1], value: match[2].trim() });
    }

    if (options.length === 0) {
      return { stem: text.trim(), options: [] };
    }

    const firstOptionIndex = text.search(/\([A-D]\)/);
    const stem = firstOptionIndex > -1 ? text.slice(0, firstOptionIndex).trim() : text.trim();
    return { stem, options };
  };

  const cleanUrduStem = (text: string) => {
    return text
      .replace(/^\s*[0-9۰-۹]+\s*[۔\.\-:]\s*/, "")
      .replace(/^\s*[۰-۹]+\s*۔\s*/, "")
      .trim();
  };

  const normalizeComparableText = (text: string) => {
    return text
      .replace(/\s+/g, " ")
      .replace(/[۔،,:;!?]/g, "")
      .trim()
      .toLowerCase();
  };

  const classifyQuestionType = (questionId: number, text: string, contentType?: "mcq" | "short" | "long") => {
    if (contentType) return contentType;

    const encoded = Math.abs(questionId) % 100000;
    if (encoded >= 10000 && encoded < 20000) return "mcq" as const;
    if (encoded >= 20000 && encoded < 30000) return "short" as const;
    if (encoded >= 30000 && encoded < 40000) return "long" as const;

    if (questionId >= 100 && questionId < 200) return "mcq" as const;
    if (questionId >= 200) return "long" as const;
    if (/\([A-D]\)/.test(text)) return "mcq" as const;
    return "short" as const;
  };

  const getAnswerKey = (questionId: number) => {
    const keys = ["A", "B", "C", "D"] as const;
    return keys[Math.abs(questionId) % keys.length];
  };

  const sectionedQuestions = useMemo(() => {
    const all = editableQuestions;
    const mcq = all.filter((q) => classifyQuestionType(q.id, q.text, q.contentType) === "mcq");
    const short = all.filter((q) => classifyQuestionType(q.id, q.text, q.contentType) === "short");
    const long = all.filter((q) => classifyQuestionType(q.id, q.text, q.contentType) === "long");

    const total = Number(paperFields.totalMarks || paper?.totalMarks || 0);
    const totalCount = all.length;
    const marksPerQuestion = total > 0 && totalCount > 0 ? Math.max(1, Math.round(total / totalCount)) : 2;

    const sections = [
      { key: "mcq", title: "Choose the correct answer.", urduTitle: "درست جواب منتخب کریں۔", questions: mcq },
      { key: "short", title: "Write short answers of the following questions.", urduTitle: "مندرجہ ذیل سوالات کے مختصر جوابات تحریر کریں۔", questions: short },
      { key: "long", title: "Write the answers of following questions.", urduTitle: "مندرجہ ذیل سوالات کے جوابات تحریر کریں۔", questions: long },
    ].filter((section) => section.questions.length > 0);

    return { sections, marksPerQuestion };
  }, [editableQuestions, paper?.totalMarks, paperFields.totalMarks]);

  const totalQuestionCount = useMemo(
    () => sectionedQuestions.sections.reduce((sum, section) => sum + section.questions.length, 0),
    [sectionedQuestions.sections]
  );

  const resolvedLineHeight = Number(lineHeight) > 0 ? Number(lineHeight) : 1.28;
  const resolvedUrduFontSize = Number(urduFontSize) > 0 ? Number(urduFontSize) : 12;
  const resolvedEnglishFontSize = Number(englishFontSize) > 0 ? Number(englishFontSize) : 11;
  const resolvedTitleFontSize = Number(titleFontSize) > 0 ? Number(titleFontSize) : 35;
  const resolvedTextColor = fontColor === "Blue" ? "#1d4ed8" : fontColor === "Gray" ? "#475569" : "#000000";
  const resolvedFontWeight = fontWeight === "Bold" ? 700 : 400;
  const questionBorderClass = borderStyle === "Solid" ? "border border-slate-300" : borderStyle === "Dashed" ? "border border-dashed border-slate-300" : "";
  const pageBorderClass =
    pageBorder === "Solid Border"
      ? "border-2 border-slate-700"
      : pageBorder === "Dashed Border"
        ? "border-2 border-dashed border-slate-600"
        : pageBorder === "Double Border"
          ? "border-4 border-double border-slate-700"
          : pageBorder === "Thick Border"
            ? "border-[6px] border-slate-800"
            : pageBorder === "Rounded Border"
              ? "border-2 border-slate-700 rounded-xl"
              : "";
  const watermarkTextValue = (paper?.title || headerInfo.schoolName || "THE HOPE").toUpperCase();
  const watermarkMonogramFallback = (headerInfo.schoolName || "THE HOPE")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "TH";
  const resolvedLogoScale = Math.max(50, Math.min(200, Number(logoScale) || 100));
  const resolvedMonogramScale = Math.max(50, Math.min(200, Number(monogramScale) || 100));
  const selectedLayout = [
    "Layout 1", "Layout 2", "Layout 3", "Layout 4", "Layout 5", "Layout 6", "Layout 7", "Layout 8", "Layout 9", "Layout 10", "Layout 11",
    "Layout 12", "Layout 13", "Layout 14", "Layout 15", "Layout 16", "Layout 17", "Layout 18", "Layout 19", "Layout 20",
  ].includes(layout) ? layout : "Layout 1";
  const hasPrintExtras = printExamSyllabus || printBubbleSheet || printAnswerKeys;
  const compactPrintMode = totalQuestionCount <= 12 && (hasPrintExtras || selectedLayout === "Layout 1");
  const printMode = navState?.printMode === "double" || navState?.printMode === "half" ? navState.printMode : "single";
  const previewCopyIndexes = printMode === "single" ? [0] : [0, 1];
  const previewCopiesClass =
    printMode === "half"
      ? "saved-paper-copies mode-half"
      : printMode === "double"
        ? "saved-paper-copies mode-double"
        : "saved-paper-copies mode-single";
  const mobileCanvasStyle = isMobile ? { zoom: mobilePreviewZoom } : undefined;

  const updateField = (key: keyof typeof paperFields, value: string) => {
    setPaperFields((prev) => ({ ...prev, [key]: value }));
  };

  const renderFieldValue = (key: keyof typeof paperFields, className = "text-center font-semibold") => (
    manualEditing ? (
      <input
        type="text"
        value={paperFields[key]}
        onChange={(e) => updateField(key, e.target.value)}
        className="w-full border-0 bg-transparent p-0 text-center font-semibold text-slate-900 outline-none"
      />
    ) : (
      <div className={className}>{paperFields[key]}</div>
    )
  );

  if (!paper) {
    return (
      <div className="min-h-screen bg-background grid place-items-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Saved paper not found</h1>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`saved-paper-print min-h-screen bg-slate-200 print:bg-white mode-${printMode} ${compactPrintMode ? "compact-print" : ""}`}>
      <div className="sticky top-0 z-20 select-none bg-[#24364a] text-white shadow-sm print:hidden">
        <div className="grid grid-cols-2 gap-1 border-b border-black/30 px-2 pb-1 pt-1 md:grid-cols-6 xl:grid-cols-12">
          <ToolbarField label="Line Height" value={lineHeight} onChange={setLineHeight} />
          <ToolbarField label="Urdu Font Size" value={urduFontSize} onChange={setUrduFontSize} />
          <ToolbarField label="English Font Size" value={englishFontSize} onChange={setEnglishFontSize} />
          <ToolbarField label="Title Font Size" value={titleFontSize} onChange={setTitleFontSize} />
          <ToolbarSelect label="Font Bold" value={fontWeight} onChange={setFontWeight} options={["Normal", "Bold"]} />
          <ToolbarSelect label="Font Color" value={fontColor} onChange={setFontColor} options={["Black", "Blue", "Gray"]} />
          <ToolbarSelect label="Border Style" value={borderStyle} onChange={setBorderStyle} options={["No Border", "Solid", "Dashed"]} />
          <ToolbarSelect label="Page Border" value={pageBorder} onChange={setPageBorder} options={["No Border", "Solid Border", "Dashed Border", "Double Border", "Thick Border", "Rounded Border"]} />
          <ToolbarSelect
            label="Change Layout"
            value={layout}
            onChange={setLayout}
            options={[
              "Layout 1", "Layout 2", "Layout 3", "Layout 4", "Layout 5", "Layout 6", "Layout 7", "Layout 8", "Layout 9", "Layout 10", "Layout 11",
              "Layout 12", "Layout 13", "Layout 14", "Layout 15", "Layout 16", "Layout 17", "Layout 18", "Layout 19", "Layout 20",
            ]}
          />
          <ToolbarSelect label="Select Watermark" value={watermark} onChange={setWatermark} options={["Monogram Watermark", "Text Watermark"]} />
          <ToolbarField label="Logo Size %" value={logoScale} onChange={setLogoScale} />
          <ToolbarField label="Monogram %" value={monogramScale} onChange={setMonogramScale} />
        </div>

        <div className="relative flex flex-wrap items-center gap-1 px-2 pb-1 pt-1">
          <label className="inline-flex h-7 min-w-[132px] items-center gap-1 rounded-sm border border-slate-300 bg-white px-1.5 text-[10px] text-[#2d2d2d]">
            <input type="checkbox" checked={printExamSyllabus} onChange={(e) => setPrintExamSyllabus(e.target.checked)} className="h-4 w-4 rounded-sm border border-slate-300 accent-blue-600" />
            Print Exam Syllabus
          </label>
          <label className="inline-flex h-7 min-w-[132px] items-center gap-1 rounded-sm border border-slate-300 bg-white px-1.5 text-[10px] text-[#2d2d2d]">
            <input type="checkbox" checked={printBubbleSheet} onChange={(e) => setPrintBubbleSheet(e.target.checked)} className="h-4 w-4 rounded-sm border border-slate-300 accent-blue-600" />
            Print Bubble Sheet
          </label>
          <label className="inline-flex h-7 min-w-[132px] items-center gap-1 rounded-sm border border-slate-300 bg-white px-1.5 text-[10px] text-[#2d2d2d]">
            <input type="checkbox" checked={printAnswerKeys} onChange={(e) => setPrintAnswerKeys(e.target.checked)} className="h-4 w-4 rounded-sm border border-slate-300 accent-blue-600" />
            Print Answer Keys
          </label>
          <label className="inline-flex h-7 min-w-[132px] items-center gap-1 rounded-sm border border-slate-300 bg-white px-1.5 text-[10px] text-[#2d2d2d]">
            <input type="checkbox" checked={tickAnswers} onChange={(e) => setTickAnswers(e.target.checked)} className="h-4 w-4 rounded-sm border border-slate-300 accent-blue-600" />
            Tick Answers
          </label>
          <button type="button" onClick={() => setShowFontStylesMenu((prev) => !prev)} className="inline-flex h-7 min-w-[114px] items-center justify-center gap-1 rounded-sm border border-slate-300 bg-white px-2 text-[10px] font-medium text-slate-900">
            FONT STYLES <ChevronDown className="h-4 w-4" />
          </button>

          {showFontStylesMenu && (
            <div className="absolute right-3 top-14 z-50 w-80 rounded-md border border-slate-300 bg-white p-3 text-slate-900 shadow-lg">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Font Settings</p>
              <div className="space-y-2">
                <label className="block text-xs font-semibold">
                  Title Font Family
                  <select
                    value={titleFontFamily}
                    onChange={(e) => setTitleFontFamily(e.target.value)}
                    className="mt-1 h-8 w-full rounded border border-slate-300 px-2 text-xs"
                  >
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Inter">Inter</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Lora">Lora</option>
                    <option value="IBM Plex Serif">IBM Plex Serif</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Nunito">Nunito</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold">
                  English Font Family
                  <select
                    value={englishFontFamily}
                    onChange={(e) => setEnglishFontFamily(e.target.value)}
                    className="mt-1 h-8 w-full rounded border border-slate-300 px-2 text-xs"
                  >
                    <option value="Poppins">Poppins</option>
                    <option value="Inter">Inter</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Nunito">Nunito</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Tahoma">Tahoma</option>
                  </select>
                </label>
                <label className="block text-xs font-semibold">
                  Urdu Font Family
                  <select
                    value={urduFontFamily}
                    onChange={(e) => setUrduFontFamily(e.target.value)}
                    className="mt-1 h-8 w-full rounded border border-slate-300 px-2 text-xs"
                  >
                    <option value="Noto Nastaliq Urdu">Noto Nastaliq Urdu</option>
                    <option value="Jameel Noori Nastaleeq">Jameel Noori Nastaleeq</option>
                    <option value="Noto Naskh Arabic">Noto Naskh Arabic</option>
                    <option value="Mehr Nastaliq Web">Mehr Nastaliq Web</option>
                    <option value="Alvi Nastaleeq">Alvi Nastaleeq</option>
                    <option value="Pak Nastaleeq">Pak Nastaleeq</option>
                    <option value="Urdu Typesetting">Urdu Typesetting</option>
                    <option value="Nafees Nastaleeq">Nafees Nastaleeq</option>
                    <option value="Awami Nastaliq">Awami Nastaliq</option>
                    <option value="Scheherazade New">Scheherazade New</option>
                    <option value="Lateef">Lateef</option>
                    <option value="Amiri">Amiri</option>
                  </select>
                </label>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleResetFontStyles}
                  className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowFontStylesMenu(false)}
                  className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white"
                >
                  Done
                </button>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setManualEditing((prev) => !prev)}
            className={`inline-flex h-7 min-w-[114px] items-center justify-center rounded-sm border border-slate-300 px-2 text-[10px] font-medium ${manualEditing ? "bg-amber-400 text-slate-900" : "bg-white text-slate-900"}`}
          >
            Manual Editing
          </button>

          {/* Selected Text Controls */}
          <div className="inline-flex h-7 max-w-full items-center gap-1 overflow-x-auto rounded-sm border border-slate-300 bg-white px-1.5 text-[10px] text-[#2d2d2d]">
            <span className="whitespace-nowrap font-medium text-slate-600">Selected Text:</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${hasTextSelection ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {hasTextSelection ? "Text selected" : "Select text first"}
            </span>
            <button
              type="button"
              title="Decrease selected text size"
              onMouseDown={(e) => {
                e.preventDefault();
                setWordFontSize((s) => {
                  const next = Math.max(6, s - 1);
                  if (hasTextSelection) applyWordFontSize(e, next);
                  return next;
                });
              }}
              className="h-5 w-6 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold hover:bg-slate-100 select-none"
            >A-</button>
            <input
              type="number"
              value={wordFontSize}
              onChange={(e) => {
                const next = Math.max(6, Math.min(72, Number(e.target.value) || 14));
                setWordFontSize(next);
              }}
              className="h-5 w-9 rounded border border-slate-200 text-center text-[10px] outline-none"
              min={6}
              max={72}
            />
            <button
              type="button"
              title="Increase selected text size"
              onMouseDown={(e) => {
                e.preventDefault();
                setWordFontSize((s) => {
                  const next = Math.min(72, s + 1);
                  if (hasTextSelection) applyWordFontSize(e, next);
                  return next;
                });
              }}
              className="h-5 w-6 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold hover:bg-slate-100 select-none"
            >A+</button>
            <button
              type="button"
              title="Apply bold to selected text"
              onMouseDown={applyBoldToSelection}
              disabled={!hasTextSelection}
              className="h-5 rounded bg-slate-700 px-2 text-[10px] font-semibold text-white hover:bg-slate-800 select-none disabled:cursor-not-allowed disabled:opacity-50"
            >B</button>
            <button
              type="button"
              title="Apply underline to selected text"
              onMouseDown={applyUnderlineToSelection}
              disabled={!hasTextSelection}
              className="h-5 rounded bg-slate-700 px-2 text-[10px] font-semibold text-white hover:bg-slate-800 select-none disabled:cursor-not-allowed disabled:opacity-50"
            >U</button>
            <span className="ml-1 whitespace-nowrap font-medium text-slate-600">Specific Line Height:</span>
            <button
              type="button"
              title="Decrease selected line height"
              onMouseDown={(e) => {
                e.preventDefault();
                setSelectedLineHeight((v) => {
                  const next = Math.max(0.8, Number((Number(v || 1.28) - 0.05).toFixed(2)));
                  if (hasTextSelection) applySelectedLineHeight(e, next);
                  return String(next);
                });
              }}
              className="h-5 w-6 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold hover:bg-slate-100 select-none"
            >-</button>
            <input
              type="number"
              value={selectedLineHeight}
              onChange={(e) => setSelectedLineHeight(e.target.value)}
              className="h-5 w-10 rounded border border-slate-200 text-center text-[10px] outline-none"
              min={0.8}
              step={0.05}
            />
            <button
              type="button"
              title="Increase selected line height"
              onMouseDown={(e) => {
                e.preventDefault();
                setSelectedLineHeight((v) => {
                  const next = Number((Number(v || 1.28) + 0.05).toFixed(2));
                  if (hasTextSelection) applySelectedLineHeight(e, next);
                  return String(next);
                });
              }}
              className="h-5 w-6 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold hover:bg-slate-100 select-none"
            >+</button>
          </div>
          <div className="rounded-sm border border-slate-300 bg-white px-2 py-1 text-[10px] font-medium text-slate-600">
            Step: Select text in paper, then use A+/A-/B/U/L+/L- to apply changes instantly
          </div>

          <button
            type="button"
            onClick={handlePrintPaper}
            className="inline-flex h-7 min-w-[114px] items-center justify-center gap-1 rounded-sm bg-emerald-600 px-2 text-[10px] font-medium text-white"
          >
            <Printer className="w-4 h-4" />
            Print Paper
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-2 py-3 sm:px-3 sm:py-4 print:max-w-none print:px-0 print:py-0">
        <div className="overflow-hidden print:overflow-visible">
        <div className={previewCopiesClass}>
        {previewCopyIndexes.map((copyIndex) => (
        <div key={`paper-copy-${copyIndex}`} className="saved-paper-copy">
        <div
          className={`saved-paper-canvas mx-auto w-[1100px] min-w-[1100px] bg-white shadow-sm print:min-w-0 print:w-full print:shadow-none ${pageBorderClass}`}
          style={mobileCanvasStyle}
        >
          <div
            className="saved-paper-page relative p-7 print:p-3"
            style={{ "--logo-scale": `${resolvedLogoScale / 100}` } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => navigate(isTeacherRoute ? "/teacher/dashboard" : "/dashboard", { state: { activeView: "savedpapers" } })}
              className={`mb-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary/60 print:hidden ${copyIndex > 0 ? "hidden" : ""}`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Saved Papers
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {watermark === "Text Watermark" ? (
                  <div className="text-[110px] font-black tracking-[0.22em] text-rose-200/30 select-none" style={{ transform: `scale(${resolvedMonogramScale / 100})`, transformOrigin: "center" }}>
                    {watermarkTextValue}
                  </div>
                ) : headerInfo.logoUrl ? (
                  <img
                    src={headerInfo.logoUrl}
                    alt="Watermark"
                    className="h-[280px] w-[280px] object-contain opacity-10 select-none"
                    style={{ transform: `scale(${resolvedMonogramScale / 100})`, transformOrigin: "center" }}
                  />
                ) : (
                  <div className="text-[140px] font-black tracking-[0.16em] text-rose-200/30 select-none" style={{ transform: `scale(${resolvedMonogramScale / 100})`, transformOrigin: "center" }}>
                    {watermarkMonogramFallback}
                  </div>
                )}
              </div>

              <div className="saved-paper-header relative border-b border-slate-300 pb-3 text-center print:pb-2">
                <h1
                  className="font-extrabold text-slate-900"
                  style={{
                    fontSize: `${resolvedTitleFontSize}px`,
                    fontWeight: fontWeight === "Bold" ? 800 : 600,
                    color: resolvedTextColor,
                    fontFamily: titleFontFamily,
                  }}
                >
                  {headerInfo.schoolName}
                </h1>
                <p className="mt-1 text-sm text-slate-700 print:text-[11px]">{headerInfo.slogan}</p>
                <p className="text-sm text-slate-700 print:text-[11px]">{headerInfo.addressLine}</p>
              </div>

              {selectedLayout === "Layout 1" && (
                <div className="mt-3 grid grid-cols-[76px_1fr] gap-3 items-start text-sm">
                  <div className="flex justify-center pt-2">
                    <LogoBox src={headerInfo.logoUrl} className="h-12 w-12 border border-slate-300 bg-slate-50 grid place-items-center text-[9px]" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-4 gap-1">
                      <PaperMetaField compact label="Student Name" value={paperFields.studentName} manualEditing={manualEditing} onChange={(value) => updateField("studentName", value)} />
                      <PaperMetaField compact label="Roll Num" value={paperFields.rollNum} manualEditing={manualEditing} onChange={(value) => updateField("rollNum", value)} />
                      <PaperMetaField compact label="Class Name" value={paperFields.className} manualEditing={manualEditing} onChange={(value) => updateField("className", value)} />
                      <PaperMetaField compact label="Paper Code" value={paperFields.paperCode} manualEditing={manualEditing} onChange={(value) => updateField("paperCode", value)} />
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      <PaperMetaField compact label="Subject Name" value={paperFields.subjectName} manualEditing={manualEditing} onChange={(value) => updateField("subjectName", value)} />
                      <PaperMetaField compact label="Time Allowed" value={paperFields.timeAllowed} manualEditing={manualEditing} onChange={(value) => updateField("timeAllowed", value)} />
                      <PaperMetaField compact label="Total Marks" value={paperFields.totalMarks} manualEditing={manualEditing} onChange={(value) => updateField("totalMarks", value)} />
                      <PaperMetaField compact label="Exam Date" value={paperFields.examDate} manualEditing={manualEditing} onChange={(value) => updateField("examDate", value)} />
                    </div>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 2" && (
                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-start pl-5">
                    <LogoBox src={headerInfo.logoUrl} className="h-12 w-12 border border-slate-300 bg-slate-50 grid place-items-center text-[9px]" />
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <PaperMetaField compact label="Student Name" value={paperFields.studentName} manualEditing={manualEditing} onChange={(value) => updateField("studentName", value)} />
                    <PaperMetaField compact label="Roll Num" value={paperFields.rollNum} manualEditing={manualEditing} onChange={(value) => updateField("rollNum", value)} />
                    <PaperMetaField compact label="Class Name" value={paperFields.className} manualEditing={manualEditing} onChange={(value) => updateField("className", value)} />
                    <PaperMetaField compact label="Paper Code" value={paperFields.paperCode} manualEditing={manualEditing} onChange={(value) => updateField("paperCode", value)} />
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <PaperMetaField compact label="Subject Name" value={paperFields.subjectName} manualEditing={manualEditing} onChange={(value) => updateField("subjectName", value)} />
                    <PaperMetaField compact label="Time Allowed" value={paperFields.timeAllowed} manualEditing={manualEditing} onChange={(value) => updateField("timeAllowed", value)} />
                    <PaperMetaField compact label="Total Marks" value={paperFields.totalMarks} manualEditing={manualEditing} onChange={(value) => updateField("totalMarks", value)} />
                    <PaperMetaField compact label="Exam Date" value={paperFields.examDate} manualEditing={manualEditing} onChange={(value) => updateField("examDate", value)} />
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 3" && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div className="space-y-1">
                    <SplitFieldRow compact label="Student Name">{renderFieldValue("studentName")}</SplitFieldRow>
                    <SplitFieldRow compact label="Roll Number">{renderFieldValue("rollNum")}</SplitFieldRow>
                    <SplitFieldRow compact label="Paper Code">{renderFieldValue("paperCode")}</SplitFieldRow>
                    <SplitFieldRow compact label="Time Allowed">{renderFieldValue("timeAllowed")}</SplitFieldRow>
                  </div>
                  <div className="flex items-center justify-center">
                    <LogoBox src={headerInfo.logoUrl} className="h-12 w-12 border border-slate-300 bg-slate-50 grid place-items-center text-[9px]" />
                  </div>
                  <div className="space-y-1">
                    <SplitFieldRow compact label="Class">{renderFieldValue("className")}</SplitFieldRow>
                    <SplitFieldRow compact label="Subject">{renderFieldValue("subjectName")}</SplitFieldRow>
                    <SplitFieldRow compact label="Total Marks">{renderFieldValue("totalMarks")}</SplitFieldRow>
                    <SplitFieldRow compact label="Exam Date">{renderFieldValue("examDate")}</SplitFieldRow>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 4" && (
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="space-y-1.5">
                    <LineFieldRow label="Student Name">{renderFieldValue("studentName", "text-left font-semibold")}</LineFieldRow>
                    <LineFieldRow label="Roll Number">{renderFieldValue("rollNum", "text-left font-semibold")}</LineFieldRow>
                    <LineFieldRow label="Paper Code">{renderFieldValue("paperCode", "text-left font-semibold")}</LineFieldRow>
                    <LineFieldRow label="Time Allowed">{renderFieldValue("timeAllowed", "text-left font-semibold")}</LineFieldRow>
                  </div>
                  <div className="flex items-center justify-center">
                    <LogoBox src={headerInfo.logoUrl} className="h-16 w-16 border border-slate-300 bg-slate-50 grid place-items-center text-[10px]" />
                  </div>
                  <div className="space-y-1.5">
                    <LineFieldRow label="Class">{renderFieldValue("className", "text-left font-semibold")}</LineFieldRow>
                    <LineFieldRow label="Subject">{renderFieldValue("subjectName", "text-left font-semibold")}</LineFieldRow>
                    <LineFieldRow label="Total Marks">{renderFieldValue("totalMarks", "text-left font-semibold")}</LineFieldRow>
                    <LineFieldRow label="Exam Date">{renderFieldValue("examDate", "text-left font-semibold")}</LineFieldRow>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 5" && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <div className="space-y-1.5">
                      <LineFieldRow label="Student Name"><div className="flex items-center gap-2"><User className="h-4 w-4" />{renderFieldValue("studentName", "text-left font-semibold")}</div></LineFieldRow>
                      <LineFieldRow label="Roll Num"><div className="flex items-center gap-2"><Hash className="h-4 w-4" />{renderFieldValue("rollNum", "text-left font-semibold")}</div></LineFieldRow>
                      <LineFieldRow label="Paper Code"><div className="flex items-center gap-2"><Barcode className="h-4 w-4" />{renderFieldValue("paperCode", "text-left font-semibold")}</div></LineFieldRow>
                      <LineFieldRow label="Time Allowed"><div className="flex items-center gap-2"><Clock3 className="h-4 w-4" />{renderFieldValue("timeAllowed", "text-left font-semibold")}</div></LineFieldRow>
                    </div>
                    <div className="flex items-center justify-center">
                      <LogoBox src={headerInfo.logoUrl} className="h-16 w-16 border border-slate-300 bg-slate-50 grid place-items-center text-[10px]" />
                    </div>
                    <div className="space-y-1.5">
                      <LineFieldRow label="Class"><div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />{renderFieldValue("className", "text-left font-semibold")}</div></LineFieldRow>
                      <LineFieldRow label="Subject"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{renderFieldValue("subjectName", "text-left font-semibold")}</div></LineFieldRow>
                      <LineFieldRow label="Total Marks"><div className="flex items-center gap-2"><Calculator className="h-4 w-4" />{renderFieldValue("totalMarks", "text-left font-semibold")}</div></LineFieldRow>
                      <LineFieldRow label="Exam Date"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{renderFieldValue("examDate", "text-left font-semibold")}</div></LineFieldRow>
                    </div>
                  </div>
                  {printExamSyllabus && (
                    <div className="border-b border-slate-500 px-2 py-1.5 flex items-center gap-2">
                      <PenLine className="h-4 w-4" />
                      <span className="font-semibold">Exam Syllabus:</span>
                      <span>{paper.paperCategory || `${paperFields.subjectName} (${paper.board})`}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedLayout === "Layout 6" && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-3">
                    <LogoBox src={headerInfo.logoUrl} className="h-20 w-20 border border-slate-300 bg-slate-50 grid place-items-center text-[10px]" />
                    <div className="flex-1 max-w-[760px] space-y-1">
                      <div className="h-8 border-b border-slate-700 flex items-center justify-center">{renderFieldValue("subjectName")}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-0">
                    <div className="bg-[#2f5757] text-white text-center py-1.5 rounded-l-full font-semibold">CLASS: {paperFields.className}</div>
                    <div className="text-center py-1.5 border-y border-slate-700">Paper Date: {paperFields.examDate}</div>
                    <div className="bg-[#2f5757] text-white text-center py-1.5 rounded-r-full font-semibold">TOTAL MARKS: {paperFields.totalMarks}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-b border-slate-500 pb-1">
                    <div>STUDENT NAME: {renderFieldValue("studentName", "inline font-semibold")}</div>
                    <div className="text-center">Paper Date: {renderFieldValue("examDate", "inline font-semibold")}</div>
                    <div className="text-right">TIME: {renderFieldValue("timeAllowed", "inline font-semibold")}</div>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 7" && (
                <div className="mt-4 border border-slate-500 text-sm">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-slate-500 p-2 text-center" colSpan={3}>Test OR Examination</td>
                        <td className="border border-slate-500 p-2 text-center">Subject</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">{paperFields.subjectName}</td>
                        <td className="border border-slate-500 p-2 text-center">Class</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">{paperFields.className}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-500 p-2 text-center">Roll #</td>
                        <td className="border border-slate-500 p-2 text-center">{renderFieldValue("rollNum")}</td>
                        <td className="border border-slate-500 p-2 text-center">Time Allowed</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">{paperFields.timeAllowed}</td>
                        <td className="border border-slate-500 p-2 text-center">Group(if any)</td>
                        <td className="border border-slate-500 p-2 text-center">Date</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">{paperFields.examDate}</td>
                      </tr>
                      <tr><td className="border border-slate-500 p-2 text-center font-semibold" colSpan={7}>Detail of objective &amp; subjective marks of the paper</td></tr>
                      <tr>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Objective Part</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Total Marks</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Obt. Marks</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Subjective Part</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Total Marks</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Obt. Marks</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Signatures of concerned Teacher</td>
                      </tr>
                      <tr><td className="border border-slate-500 p-2 text-center" colSpan={7}>Note: No marks will be awarded in case of over-writing, cutting or using ink-remover, lead pencil or any kind of coloured ink.</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {selectedLayout === "Layout 8" && (
                <div className="mt-4 border border-slate-500 text-sm">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-slate-500 p-2 text-center" colSpan={2}>Test OR Examination</td>
                        <td className="border border-slate-500 p-2 text-center">Subject</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">{paperFields.subjectName}</td>
                        <td className="border border-slate-500 p-2 text-center">Class</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">{paperFields.className}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Roll #</td>
                        <td className="border border-slate-500 p-2 text-center">{renderFieldValue("rollNum")}</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Time Allowed</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">{paperFields.timeAllowed}</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">Date</td>
                        <td className="border border-slate-500 p-2 text-center font-semibold">{paperFields.examDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {selectedLayout === "Layout 9" && (
                <div className="mt-4 border border-slate-500 grid grid-cols-[120px_1fr] text-sm">
                  <div className="border-r border-slate-500 grid place-items-center p-2">
                    <LogoBox src={headerInfo.logoUrl} className="h-16 w-16 border border-slate-300 bg-slate-50 grid place-items-center text-[10px]" />
                  </div>
                  <div className="grid grid-rows-[auto_auto_auto]">
                    <div className="grid grid-cols-2 border-b border-slate-500">
                      <div className="px-3 py-1.5">Class: <span className="font-semibold">{paperFields.className}</span></div>
                      <div className="px-3 py-1.5">Subject: <span className="font-semibold">{paperFields.subjectName}</span></div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-slate-500">
                      <div className="px-3 py-1.5">Marks: <span className="font-semibold">{paperFields.totalMarks}</span></div>
                      <div className="px-3 py-1.5">Roll#: <span className="font-semibold">{paperFields.rollNum}</span></div>
                    </div>
                    <div className="px-3 py-1.5">Name: {renderFieldValue("studentName", "inline font-semibold")}</div>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 10" && (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="grid grid-cols-[1fr_390px] gap-2">
                    <div className="border border-slate-500">
                      <div className="px-2 py-1 border-b border-slate-500 font-semibold">Student's Name: {renderFieldValue("studentName", "inline font-semibold")}</div>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border border-slate-500 p-1.5 font-semibold text-center">Q No.</td>
                            {Array.from({ length: 12 }, (_, i) => <td key={i} className="border border-slate-500 p-1.5 text-center">{i + 1}</td>)}
                          </tr>
                          <tr>
                            <td className="border border-slate-500 p-1.5 font-semibold text-center">Marks</td>
                            {Array.from({ length: 12 }, (_, i) => <td key={i} className="border border-slate-500 p-1.5 text-center">&nbsp;</td>)}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="space-y-1">
                      <LineFieldRow compact label="Paper">{renderFieldValue("subjectName", "text-left font-semibold")}</LineFieldRow>
                      <LineFieldRow compact label="Class">{renderFieldValue("className", "text-left font-semibold")}</LineFieldRow>
                      <LineFieldRow compact label="Marks">{renderFieldValue("totalMarks", "text-left font-semibold")}</LineFieldRow>
                      <LineFieldRow compact label="Time">{renderFieldValue("timeAllowed", "text-left font-semibold")}</LineFieldRow>
                      <LineFieldRow compact label="Date">{renderFieldValue("examDate", "text-left font-semibold")}</LineFieldRow>
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span>Invigilator's Sign: __________________</span>
                    <span>Checker's Sign: __________________</span>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 11" && (
                <div className="mt-4 border border-slate-500 text-sm">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-slate-500 p-2 font-semibold">Name:</td>
                        <td className="border border-slate-500 p-2">{renderFieldValue("studentName", "inline font-semibold")}</td>
                        <td className="border border-slate-500 p-2 font-semibold">Roll#:</td>
                        <td className="border border-slate-500 p-2">{renderFieldValue("rollNum", "inline font-semibold")}</td>
                        <td className="border border-slate-500 p-2 font-semibold">Subject:</td>
                        <td className="border border-slate-500 p-2 font-semibold">{paperFields.subjectName}</td>
                        <td className="border border-slate-500 p-2 font-semibold">Marks:</td>
                        <td className="border border-slate-500 p-2 font-semibold">{paperFields.totalMarks}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-500 p-2 font-semibold">Test Details:</td>
                        <td className="border border-slate-500 p-2" colSpan={5}>{renderFieldValue("testDetails", "inline font-semibold")}</td>
                        <td className="border border-slate-500 p-2 font-semibold">Time:</td>
                        <td className="border border-slate-500 p-2 font-semibold">{paperFields.timeAllowed}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-500 p-2 font-semibold">Syllabus:</td>
                        <td className="border border-slate-500 p-2 font-semibold" colSpan={5}>{paper.paperCategory || `${paperFields.subjectName} (${paper.board})`}</td>
                        <td className="border border-slate-500 p-2 font-semibold">Date:</td>
                        <td className="border border-slate-500 p-2 font-semibold">{paperFields.examDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {selectedLayout === "Layout 12" && (
                <div className="mt-4 text-sm border-b-2 border-black pb-2">
                  <div className="grid grid-cols-[90px_1fr] gap-3 items-start">
                    <div className="pt-2 flex justify-center"><LogoBox src={headerInfo.logoUrl} className="h-16 w-16 border border-slate-400 bg-slate-50 grid place-items-center text-[10px]" /></div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-0 text-center font-semibold text-white">
                        <div className="bg-black py-1 rounded-l-sm">Class: {paperFields.className}</div>
                        <div className="border-y border-black py-1 text-black bg-white">{paperFields.subjectName}</div>
                        <div className="bg-black py-1 rounded-r-sm">Maximum Marks: {paperFields.totalMarks}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <LineFieldRow label="Student Name">{renderFieldValue("studentName", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Roll Number">{renderFieldValue("rollNum", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Date of Paper">{renderFieldValue("examDate", "text-left")}</LineFieldRow>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <LineFieldRow label="Section">{renderFieldValue("section", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Paper Type">{renderFieldValue("paperType", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Time Allowed">{renderFieldValue("timeAllowed", "text-left")}</LineFieldRow>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 13" && (
                <div className="mt-4 border-2 border-dashed border-black text-sm">
                  <div className="grid grid-cols-3 border-b border-black">
                    <SplitFieldRow label="Student Name">{renderFieldValue("studentName")}</SplitFieldRow>
                    <div className="border-x border-black grid place-items-center py-3"><LogoBox src={headerInfo.logoUrl} className="h-16 w-16 border border-slate-400 bg-slate-50 grid place-items-center text-[10px]" /></div>
                    <SplitFieldRow label="Class">{renderFieldValue("className")}</SplitFieldRow>
                  </div>
                  <div className="grid grid-cols-3">
                    <SplitFieldRow label="Paper Type">{renderFieldValue("paperType")}</SplitFieldRow>
                    <SplitFieldRow label="Paper Time">{renderFieldValue("timeAllowed")}</SplitFieldRow>
                    <SplitFieldRow label="Max. Marks">{renderFieldValue("totalMarks")}</SplitFieldRow>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 14" && (
                <div className="mt-4 border border-slate-500 text-sm">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">Name:</td>
                        <td className="border border-slate-500 p-1.5" colSpan={2}>{renderFieldValue("studentName", "inline")}</td>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">Roll No.</td>
                        <td className="border border-slate-500 p-1.5" colSpan={2}>{renderFieldValue("rollNum", "inline")}</td>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">Class:</td>
                        <td className="border border-slate-500 p-1.5 font-semibold">{paperFields.className}</td>
                      </tr>
                      <tr>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">Subject:</td>
                        <td className="border border-slate-500 p-1.5" colSpan={2}>{paperFields.subjectName}</td>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">Date:</td>
                        <td className="border border-slate-500 p-1.5" colSpan={2}>{paperFields.examDate}</td>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">T.Marks:</td>
                        <td className="border border-slate-500 p-1.5 font-semibold">{paperFields.totalMarks}</td>
                      </tr>
                      <tr>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">Syllabus:</td>
                        <td className="border border-slate-500 p-1.5" colSpan={2}>{paper.paperCategory || `${paperFields.subjectName} (${paper.board})`}</td>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">Round:</td>
                        <td className="border border-slate-500 p-1.5" colSpan={2}>{renderFieldValue("round", "inline")}</td>
                        <td className="bg-black text-white border border-slate-500 p-1.5 font-semibold">Phase:</td>
                        <td className="border border-slate-500 p-1.5">{renderFieldValue("phase", "inline")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {selectedLayout === "Layout 15" && (
                <div className="mt-4 space-y-2 text-sm border-b-2 border-black pb-2">
                  <div className="flex justify-center"><LogoBox src={headerInfo.logoUrl} className="h-20 w-20 border border-slate-400 bg-slate-50 grid place-items-center text-[10px]" /></div>
                  <div className="grid grid-cols-3 gap-0">
                    <div className="bg-black text-white text-center py-1.5 rounded-l-full font-semibold">Subject: {paperFields.subjectName}</div>
                    <div className="border-y border-black text-center py-1.5 font-semibold">Class: {paperFields.className}</div>
                    <div className="bg-black text-white text-center py-1.5 rounded-r-full font-semibold">Maximum Marks: {paperFields.totalMarks}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <LineFieldRow label="Student Name">{renderFieldValue("studentName", "text-left")}</LineFieldRow>
                    <LineFieldRow label="Roll Number">{renderFieldValue("rollNum", "text-left")}</LineFieldRow>
                    <LineFieldRow label="Section">{renderFieldValue("section", "text-left")}</LineFieldRow>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <LineFieldRow label="Paper Type">{renderFieldValue("paperType", "text-left")}</LineFieldRow>
                    <LineFieldRow label="Time Allowed">{renderFieldValue("timeAllowed", "text-left")}</LineFieldRow>
                    <LineFieldRow label="Date of Paper">{renderFieldValue("examDate", "text-left")}</LineFieldRow>
                   </div>
                 </div>
               )}

              {selectedLayout === "Layout 16" && (
                <div className="mt-4 text-sm border-b-2 border-black pb-2">
                  <div className="grid grid-cols-[90px_1fr] gap-3 items-start">
                    <div className="pt-2 flex justify-center"><LogoBox src={headerInfo.logoUrl} className="h-16 w-16 border border-slate-400 bg-slate-50 grid place-items-center text-[10px]" /></div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <LineFieldRow label="Student Name">{renderFieldValue("studentName", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Date Of Paper">{renderFieldValue("examDate", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Subject">{renderFieldValue("subjectName", "text-left")}</LineFieldRow>
                      </div>
                      <div className="space-y-2">
                        <LineFieldRow label="Roll Number">{renderFieldValue("rollNum", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Class">{renderFieldValue("className", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Time Allowed">{renderFieldValue("timeAllowed", "text-left")}</LineFieldRow>
                      </div>
                      <div className="space-y-2">
                        <LineFieldRow label="Section">{renderFieldValue("section", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Paper Type">{renderFieldValue("paperType", "text-left")}</LineFieldRow>
                        <LineFieldRow label="Total Marks">{renderFieldValue("totalMarks", "text-left")}</LineFieldRow>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 17" && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="border border-slate-500 grid grid-cols-[180px_1fr]">
                    <div className="border-r border-slate-500 grid place-items-center p-2"><LogoBox src={headerInfo.logoUrl} className="h-20 w-20 border border-slate-400 bg-slate-50 grid place-items-center text-[10px]" /></div>
                    <div className="p-3 text-right">
                      <div className="grid grid-cols-3 gap-4" dir="rtl">
                        <LineFieldRow label="کلاس">{renderFieldValue("className", "text-right")}</LineFieldRow>
                        <LineFieldRow label="مضمون">{renderFieldValue("subjectName", "text-right")}</LineFieldRow>
                        <LineFieldRow label="نام">{renderFieldValue("studentName", "text-right")}</LineFieldRow>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-2" dir="rtl">
                        <LineFieldRow label="کل نمبر">{renderFieldValue("totalMarks", "text-right")}</LineFieldRow>
                        <LineFieldRow label="وقت">{renderFieldValue("timeAllowed", "text-right")}</LineFieldRow>
                        <LineFieldRow label="تاریخ">{renderFieldValue("examDate", "text-right")}</LineFieldRow>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedLayout === "Layout 18" && (
                <div className="mt-4 border-2 border-slate-500 text-sm">
                  <div className="grid grid-cols-[110px_1fr_110px] border-b-2 border-slate-500">
                    <div className="grid place-items-center p-2"><LogoBox src={headerInfo.logoUrl} className="h-16 w-16 border border-slate-400 bg-slate-50 grid place-items-center text-[10px]" /></div>
                    <div className="text-center py-2"></div>
                    <div className="grid place-items-center p-2"><LogoBox src={headerInfo.logoUrl} className="h-16 w-16 border border-slate-400 bg-slate-50 grid place-items-center text-[10px]" /></div>
                  </div>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border-2 border-slate-500 p-2">Class</td><td className="border-2 border-slate-500 p-2 font-semibold text-center">{paperFields.className}</td>
                        <td className="border-2 border-slate-500 p-2">Subject</td><td className="border-2 border-slate-500 p-2 font-semibold text-center">{paperFields.subjectName}</td>
                        <td className="border-2 border-slate-500 p-2">Date</td><td className="border-2 border-slate-500 p-2 font-semibold text-center">{paperFields.examDate}</td>
                        <td className="border-2 border-slate-500 p-2">T.Marks</td><td className="border-2 border-slate-500 p-2 font-semibold text-center">{paperFields.totalMarks}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-slate-500 p-2">Roll No.</td><td className="border-2 border-slate-500 p-2">{renderFieldValue("rollNum")}</td>
                        <td className="border-2 border-slate-500 p-2">Name</td><td className="border-2 border-slate-500 p-2" colSpan={3}>{renderFieldValue("studentName", "text-left")}</td>
                        <td className="border-2 border-slate-500 p-2">Time</td><td className="border-2 border-slate-500 p-2 font-semibold text-center">{paperFields.timeAllowed}</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-slate-500 p-2">Syllabus</td><td className="border-2 border-slate-500 p-2 font-semibold" colSpan={7}>{paper.paperCategory || `${paperFields.subjectName} (${paper.board})`}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {selectedLayout === "Layout 19" && (
                <div className="mt-4 border border-slate-500 text-sm">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-slate-500 p-2" rowSpan={2} style={{ width: "100px" }}><LogoBox src={headerInfo.logoUrl} className="h-14 w-14 border border-slate-400 bg-slate-50 grid place-items-center text-[10px] mx-auto" /></td>
                        <td className="border border-slate-500 p-2">Name</td>
                        <td className="border border-slate-500 p-2" colSpan={3}>{renderFieldValue("studentName", "text-left")}</td>
                        <td className="border border-slate-500 p-2 bg-[#145f6b] text-white font-semibold text-center" rowSpan={2}>English.</td>
                        <td className="border border-slate-500 p-2">Class</td>
                        <td className="border border-slate-500 p-2 font-semibold">{paperFields.className}</td>
                        <td className="border border-slate-500 p-2">T.MARKS</td>
                        <td className="border border-slate-500 p-2 font-semibold">{paperFields.totalMarks}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-500 p-2">Roll#</td>
                        <td className="border border-slate-500 p-2" colSpan={2}>{renderFieldValue("rollNum", "text-left")}</td>
                        <td className="border border-slate-500 p-2">Section</td>
                        <td className="border border-slate-500 p-2">{renderFieldValue("section", "text-left")}</td>
                        <td className="border border-slate-500 p-2">Date</td>
                        <td className="border border-slate-500 p-2 font-semibold" colSpan={3}>{paperFields.examDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {selectedLayout === "Layout 20" && (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <LineFieldRow label="Student Name">{renderFieldValue("studentName", "text-left")}</LineFieldRow>
                      <LineFieldRow label="Student Roll#">{renderFieldValue("rollNum", "text-left")}</LineFieldRow>
                      <LineFieldRow label="Paper Time">{renderFieldValue("timeAllowed", "text-left")}</LineFieldRow>
                    </div>
                    <div className="grid place-items-center">
                      <LogoBox src={headerInfo.logoUrl} className="h-20 w-20 border border-slate-400 bg-slate-50 grid place-items-center text-[10px]" />
                    </div>
                    <div className="space-y-2">
                      <LineFieldRow label="Paper Date">{renderFieldValue("examDate", "text-left")}</LineFieldRow>
                      <LineFieldRow label="Class">{renderFieldValue("className", "text-left")}</LineFieldRow>
                      <LineFieldRow label="Subject">{renderFieldValue("subjectName", "text-left")}</LineFieldRow>
                      <LineFieldRow label="Total Marks">{renderFieldValue("totalMarks", "text-left")}</LineFieldRow>
                    </div>
                  </div>
                  <table className="w-full border border-slate-500 border-collapse text-center">
                    <tbody>
                      <tr>
                        <td className="border border-slate-500 p-2 font-semibold">Question No.</td>
                        {Array.from({ length: 10 }, (_, i) => <td key={i} className="border border-slate-500 p-2">{i + 1}</td>)}
                        <td className="border border-slate-500 p-2 font-semibold">Total Marks</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-500 p-2 font-semibold">Marks Obtained</td>
                        {Array.from({ length: 10 }, (_, i) => <td key={i} className="border border-slate-500 p-2">&nbsp;</td>)}
                        <td className="border border-slate-500 p-2">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-between font-semibold">
                    <span>Checked By: (Signature) __________________</span>
                    <span>Rechecked By: (Signature) __________________</span>
                  </div>
                </div>
              )}

              {printExamSyllabus && ["Layout 1", "Layout 2", "Layout 3", "Layout 4"].includes(selectedLayout) && (
                <div className="saved-paper-syllabus mt-3 border border-slate-400 px-4 py-2 print:px-3 print:py-1.5 text-sm print:text-[11px] text-slate-900">
                  <span className="font-semibold text-slate-500">Exam Syllabus</span>
                  <div className="mt-1 font-medium">{paper.paperCategory || `${paperFields.subjectName} (${paper.board})`}</div>
                </div>
              )}

              {printBubbleSheet && (
                <div className="saved-paper-bubble mt-2 rounded-lg border border-slate-300 bg-gradient-to-br from-slate-50 via-white to-sky-50 px-3 py-2 text-slate-700 shadow-sm">
                  <div className="mb-1.5 inline-flex rounded-full border border-sky-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-sky-700">Bubble Sheet</div>
                  <div className="grid grid-cols-1 gap-1.5 text-[11px] sm:grid-cols-2 lg:grid-cols-3">
                    {(sectionedQuestions.sections.find((s) => s.key === "mcq")?.questions || []).map((q, idx) => {
                      const answerKey = getAnswerKey(q.id);
                      return (
                        <div key={`bubble-${q.id}`} className="rounded-md border border-slate-200 bg-white px-2 py-1 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                          <div className="mb-0.5 text-[11px] font-semibold text-slate-700">Q{idx + 1}</div>
                          <div className="flex items-center gap-1.5">
                            {(["A", "B", "C", "D"] as const).map((option) => (
                              <div key={`${q.id}-${option}`} className="inline-flex items-center gap-1 rounded px-0.5 py-0.5 hover:bg-slate-50">
                                <span
                                  className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-400 text-[9px] ${tickAnswers && answerKey === option ? "border-emerald-600 bg-emerald-600 text-white" : "bg-white"}`}
                                >
                                  {tickAnswers && answerKey === option ? "✓" : ""}
                                </span>
                                <span className="text-[10px] font-medium text-slate-700">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="saved-paper-sections mt-5 print:mt-3 space-y-6 print:space-y-3" style={{ lineHeight: resolvedLineHeight }}>
                {sectionedQuestions.sections.map((section, sectionIndex) => (
                  <section key={section.key} className="saved-paper-section" style={{ breakInside: "avoid" }}>
                    <div className="mb-1 print:mb-1 grid grid-cols-[1fr_auto_1fr] items-start gap-3">
                      <h2 className="font-bold text-left text-slate-900" style={{ fontSize: `${resolvedEnglishFontSize + 1}px`, fontFamily: englishFontFamily }}>
                        {`Q${sectionIndex + 1}. ${section.title}`}
                      </h2>
                      {manualEditing ? (
                        <input
                          type="text"
                          value={sectionMarksOverrides[section.key] || `${section.questions.length}X${sectionedQuestions.marksPerQuestion}=${section.questions.length * sectionedQuestions.marksPerQuestion}`}
                          onChange={(e) => setSectionMarksOverrides((prev) => ({ ...prev, [section.key]: e.target.value }))}
                          className="h-6 min-w-[170px] rounded border border-slate-300 px-2 text-center text-slate-900 outline-none"
                          style={{ fontSize: `${resolvedEnglishFontSize}px`, fontFamily: englishFontFamily }}
                        />
                      ) : (
                        <span className="font-bold text-center text-slate-900" style={{ fontSize: `${resolvedEnglishFontSize}px`, fontFamily: englishFontFamily }}>
                          {sectionMarksOverrides[section.key] || `${section.questions.length}X${sectionedQuestions.marksPerQuestion}=${section.questions.length * sectionedQuestions.marksPerQuestion}`}
                        </span>
                      )}
                      <p className="text-right font-bold text-slate-900" dir="rtl" style={{ fontSize: `${resolvedUrduFontSize}px`, fontFamily: urduFontFamily }}>
                        {`سوال نمبر${sectionIndex + 1}۔ ${section.urduTitle}`}
                      </p>
                    </div>

                    <div className="space-y-2 print:space-y-1.5">
                      {section.questions.map((question, index) => {
                        const parsed = parseQuestionOptions(question.text);
                        const parsedUrdu = parseQuestionOptions(question.urdu || "");
                        const englishQuestionText = parsed.stem || question.text || "";
                        const urduQuestionText = cleanUrduStem(parsedUrdu.stem || question.urdu || "");
                        const showUrduQuestion = normalizeComparableText(urduQuestionText) !== normalizeComparableText(englishQuestionText);
                        const isMcq = section.key === "mcq";
                        const answerKey = getAnswerKey(question.id);
                        const optionKeys = Array.from(new Set([
                          ...parsed.options.map((o) => o.key),
                          ...parsedUrdu.options.map((o) => o.key),
                        ]));

                        return (
                          <div key={question.id} className={`saved-paper-question pb-2 print:pb-1.5 ${questionBorderClass} ${questionBorderClass ? "px-2 py-1" : ""}`} style={{ breakInside: "avoid" }}>
                            <div className="grid grid-cols-2 gap-4 items-start">
                              {manualEditing ? (
                                <textarea
                                  value={question.text}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditableQuestions((prev) => prev.map((q) => (q.id === question.id ? { ...q, text: value } : q)));
                                  }}
                                  className="w-full resize-y rounded border border-slate-300 px-2 py-1 text-slate-900"
                                  rows={2}
                                  style={{ fontSize: `${resolvedEnglishFontSize}px`, color: resolvedTextColor, fontWeight: resolvedFontWeight, fontFamily: englishFontFamily }}
                                />
                              ) : (
                                <div className="text-slate-900" style={{ fontSize: `${resolvedEnglishFontSize}px`, color: resolvedTextColor, fontWeight: resolvedFontWeight, fontFamily: englishFontFamily }}>
                                  {`${index + 1}. ${englishQuestionText}`}
                                </div>
                              )}

                              {manualEditing ? (
                                <textarea
                                  value={question.urdu}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setEditableQuestions((prev) => prev.map((q) => (q.id === question.id ? { ...q, urdu: value } : q)));
                                  }}
                                  className="w-full resize-y rounded border border-slate-300 px-2 py-1 text-right text-slate-900"
                                  rows={2}
                                  dir="rtl"
                                  style={{ fontSize: `${resolvedUrduFontSize}px`, color: resolvedTextColor, fontWeight: resolvedFontWeight, fontFamily: urduFontFamily }}
                                />
                              ) : question.urdu && showUrduQuestion ? (
                                <div className="text-right text-slate-900" dir="rtl" style={{ fontSize: `${resolvedUrduFontSize}px`, color: resolvedTextColor, fontWeight: resolvedFontWeight, fontFamily: urduFontFamily }}>
                                  {`${index + 1}۔ ${urduQuestionText}`}
                                </div>
                              ) : (
                                <div />
                              )}
                            </div>

                            {isMcq && optionKeys.length > 0 && (
                              <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                                {optionKeys.map((key) => {
                                  const enOption = parsed.options.find((o) => o.key === key)?.value || "";
                                  const urOption = parsedUrdu.options.find((o) => o.key === key)?.value || "";
                                  const showUrduOption = normalizeComparableText(urOption) !== normalizeComparableText(enOption);
                                  return (
                                    <div key={`${question.id}-opt-${key}`} className="flex items-baseline gap-1 text-slate-900" style={{ fontSize: `${resolvedEnglishFontSize}px`, color: resolvedTextColor, fontWeight: resolvedFontWeight, fontFamily: englishFontFamily }}>
                                      <span dir="ltr">
                                        {tickAnswers && answerKey === key ? "✓ " : ""}
                                        ({key}) {enOption}
                                      </span>
                                      {urOption && showUrduOption && (
                                        <span dir="rtl" style={{ fontSize: `${resolvedUrduFontSize}px`, fontFamily: urduFontFamily }}>
                                          {urOption}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}

                {printAnswerKeys && (
                  <section style={{ breakInside: "avoid" }}>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h2 className="font-bold text-slate-900" style={{ fontSize: `${resolvedEnglishFontSize}px`, fontFamily: englishFontFamily }}>
                        Answer Keys
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-900" style={{ fontSize: `${resolvedEnglishFontSize}px`, fontFamily: englishFontFamily }}>
                      {(sectionedQuestions.sections.find((s) => s.key === "mcq")?.questions || []).map((q, i) => {
                        return <div key={`answer-${q.id}`}>{`Q${i + 1}: ${getAnswerKey(q.id)}`}</div>;
                      })}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
        ))}
        </div>
      </div>
    </div>
    </div>
  );
};

type ToolbarFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

type LogoBoxProps = {
  src?: string;
  className: string;
};

const LogoBox = ({ src = "", className }: LogoBoxProps) => (
  <div className={`${className} overflow-visible`}>
    {src ? (
      <img
        src={src}
        alt="School Logo"
        className="h-full w-full object-contain"
        style={{ transform: "scale(var(--logo-scale, 1))", transformOrigin: "center" }}
      />
    ) : (
      <span className="font-bold text-slate-500" style={{ transform: "scale(var(--logo-scale, 1))", transformOrigin: "center" }}>LOGO</span>
    )}
  </div>
);

const ToolbarField = ({ label, value, onChange }: ToolbarFieldProps) => (
  <label className="block">
    <span className="mb-0.5 block pl-1 text-[10px] font-medium text-white">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded-sm border border-slate-300 bg-white px-2 text-center text-xs font-medium text-slate-900"
    />
  </label>
);

type ToolbarSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

const ToolbarSelect = ({ label, value, onChange, options }: ToolbarSelectProps) => (
  <label className="block">
    <span className="mb-0.5 block pl-1 text-[10px] font-medium text-white">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded-sm border border-slate-300 bg-white px-2 text-center text-[11px] font-medium text-slate-900"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </label>
);

type PaperMetaFieldProps = {
  className?: string;
  compact?: boolean;
  label: string;
  value: string;
  manualEditing: boolean;
  onChange: (value: string) => void;
};

const PaperMetaField = ({ className = "", compact = false, label, value, manualEditing, onChange }: PaperMetaFieldProps) => (
  <div className={`border border-slate-500 ${compact ? "px-2 py-1 min-h-[34px]" : "px-3 py-2 min-h-[42px]"} print:px-2 print:py-1 print:min-h-[34px] ${className}`}>
    <div className={`${compact ? "-mt-3 text-[11px]" : "-mt-4 text-xs"} inline-block bg-white px-2 text-slate-500`}>{label}</div>
    {manualEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-0 bg-transparent p-0 text-center font-semibold text-slate-900 outline-none"
      />
    ) : (
      <div className="text-center font-semibold text-slate-900">{value}</div>
    )}
  </div>
);

type RowProps = {
  label: string;
  children: React.ReactNode;
  compact?: boolean;
};

const SplitFieldRow = ({ label, children, compact = false }: RowProps) => (
  <div className={`grid grid-cols-[42%_58%] border border-slate-500 ${compact ? "min-h-[34px]" : "min-h-[42px]"}`}>
    <div className={`bg-slate-200 ${compact ? "px-2 py-1" : "px-3 py-2"} font-semibold text-slate-900 flex items-center`}>{label}</div>
    <div className={`${compact ? "px-2 py-1" : "px-3 py-2"} flex items-center justify-center`}>{children}</div>
  </div>
);

const LineFieldRow = ({ label, children, compact = false }: RowProps) => (
  <div className={`border-b border-slate-500 flex items-center justify-between gap-3 ${compact ? "min-h-[28px] px-2 py-1" : "min-h-[34px] px-3 py-1.5"}`}>
    <span className="font-semibold text-slate-900">{label}:</span>
    <div className={`${compact ? "min-w-[140px]" : "min-w-[180px]"} text-right`}>{children}</div>
  </div>
);

export default SavedPaperViewer;

