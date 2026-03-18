import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addSavedPaper, getSavedPaperById, type SavedPaperRecord } from "@/lib/savedPapers";
import { Menu, X, Home, LogOut, ChevronLeft, GraduationCap, List, PencilLine, Save, Printer, Shuffle, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { buildPriorityOptions, buildQuestionsForSelection } from "@/lib/questionBank";
import { useTeacherSessionStore } from "@/stores/teacherSessionStore";
import {
  boardClassMap, boardCards, boardSubjectsMap, getChaptersForSubject,
} from "@/data/subjectData";
import SubjectButton from "@/components/SubjectButton";

const isUrdu = (text: string) => /[\u0600-\u06FF]/.test(text);
type WorkspaceQuestionType = "mcq" | "short" | "long";
type EditedQuestion = { text: string; urdu: string; contentType?: WorkspaceQuestionType };
const inferContentType = (id: number, text: string): WorkspaceQuestionType => {
  const normalized = Math.abs(id) % 100000;
  if (normalized >= 10000 && normalized < 20000) return "mcq";
  if (normalized >= 20000 && normalized < 30000) return "short";
  if (normalized >= 30000 && normalized < 40000) return "long";
  if (id >= 100 && id < 200) return "mcq";
  if (id >= 200) return "long";
  return /\([A-D]\)/.test(text) ? "mcq" : "short";
};

const TeacherGeneratePaper = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const session = useTeacherSessionStore((s) => s.session);
  const logout = useTeacherSessionStore((s) => s.logout);
  const isSubUserPortal = session?.portalType === "sub-user";
  const basePath = isSubUserPortal ? "/sub-user" : "/teacher";
  const loginPath = "/teacher/login";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [showQuestionSelection, setShowQuestionSelection] = useState(false);
  const [showPaperWorkspace, setShowPaperWorkspace] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [dualMedium, setDualMedium] = useState("dual");
  const [requiredQuestions, setRequiredQuestions] = useState("");
  const [eachQMarks, setEachQMarks] = useState("");
  const [ignoreQuestions, setIgnoreQuestions] = useState("");
  const [blankLines, setBlankLines] = useState("");
  const [blankLineType, setBlankLineType] = useState("1 LINE");
  const [questionPriority, setQuestionPriority] = useState("all");
  const [twoQuestionsPerLine, setTwoQuestionsPerLine] = useState(false);
  const [longQuestionsParts, setLongQuestionsParts] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectionError, setSelectionError] = useState("");
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState<Record<number, EditedQuestion>>({});
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [showSavePaperDialog, setShowSavePaperDialog] = useState(false);
  const [paperName, setPaperName] = useState("");
  const [paperCategory, setPaperCategory] = useState("");
  const [timeAllowed, setTimeAllowed] = useState("");
  const [paperDate, setPaperDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("0");
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const allQuestions = useMemo(() => buildQuestionsForSelection(selectedChapters), [selectedChapters]);

  const priorityOptions = useMemo(
    () => buildPriorityOptions(allQuestions, selectedChapters),
    [allQuestions, selectedChapters]
  );

  const activeQuestions = useMemo(() => {
    let filtered = allQuestions;

    if (questionType === "mcq") filtered = filtered.filter((q) => q.contentType === "mcq");
    if (questionType === "short") filtered = filtered.filter((q) => q.contentType === "short");
    if (questionType === "long") filtered = filtered.filter((q) => q.contentType === "long");

    if (questionPriority && questionPriority !== "all") {
      if (questionPriority.startsWith("cat:")) {
        const categoryValue = questionPriority.replace("cat:", "");
        filtered = filtered.filter((q) => q.priorityKey === categoryValue);
      } else if (questionPriority.startsWith("part:")) {
        const partValue = questionPriority.replace("part:", "");
        filtered = filtered.filter((q) => q.chapterPart === partValue);
      }
    }

    return filtered;
  }, [allQuestions, questionPriority, questionType]);

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
          };
        }

        const edited = editedQuestions[id];
        if (!edited) return null;

        return {
          id,
          text: edited.text,
          urdu: edited.urdu,
          contentType: edited.contentType || inferContentType(id, edited.text),
        };
      })
      .filter((q): q is { id: number; text: string; urdu: string; contentType: WorkspaceQuestionType } => Boolean(q)),
    [allQuestions, editedQuestions, shuffledOrder]
  );

  const sectionMeta: Record<WorkspaceQuestionType, { english: string; urdu: string }> = {
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

  const workspaceSections = useMemo(() => {
    const orderedTypes: WorkspaceQuestionType[] = ["mcq", "short", "long"];
    return orderedTypes
      .map((type) => ({
        type,
        questions: workspaceQuestions.filter((q) => q.contentType === type),
      }))
      .filter((section) => section.questions.length > 0);
  }, [workspaceQuestions]);

  const handleSearchClick = () => {
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

    const marksPerQuestion = Number.parseInt(eachQMarks, 10);
    if (!Number.isFinite(marksPerQuestion) || marksPerQuestion <= 0) {
      setSelectionError("Please enter valid Each Q Marks first.");
      setShowSearchResults(false);
      setValidationMessage("Please enter Each Q Marks first.");
      setShowValidationDialog(true);
      return;
    }
    setSelectionError("");
    setShowSearchResults(true);
  };

  const handleAddQuestions = () => {
    const requiredCount = getRequiredCount();
    if (!requiredCount) {
      setSelectionError("Please enter a valid Required Questions value first.");
      return;
    }
    if (selectedQuestions.length !== requiredCount) {
      setSelectionError(`Please select exactly ${requiredCount} question(s) first.`);
      return;
    }

    setSelectionError("");
    const ids = [...selectedQuestions];
    setShuffledOrder((prev) => orderQuestionIds([...prev, ...ids]));
    setEditedQuestions((prev) => {
      const next = { ...prev };
      activeQuestions.filter((q) => ids.includes(q.id)).forEach((q) => {
        if (!next[q.id]) {
          next[q.id] = { text: q.text, urdu: q.urdu, contentType: q.contentType };
        }
      });
      return next;
    });
    setSelectedQuestions([]);
    setShowSearchResults(false);
    setIsManualEditing(false);
    setShowQuestionSelection(false);
    setShowPaperWorkspace(true);
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
    setEditedQuestions({});
    setIsManualEditing(false);
  };

  const handleCancelPaper = () => {
    clearPaperQuestions();
    setShowQuestionSelection(false);
    setShowPaperWorkspace(false);
    setSidebarOpen(true);
  };

  useEffect(() => {
    if (!session?.token) {
      navigate(loginPath);
    }
  }, [session, navigate, loginPath]);

  useEffect(() => {
    const state = location.state as { editPaperId?: number; openQuestionMenu?: boolean } | null;
    if (!state?.editPaperId) return;

    const savedPaper = getSavedPaperById(state.editPaperId);
    if (!savedPaper) return;

    const orderedIds = savedPaper.questions.map((q) => q.id);
    const marksPerQuestion = savedPaper.questions.length > 0
      ? Math.max(1, Math.round(Number(savedPaper.totalMarks || 0) / savedPaper.questions.length))
      : Number(eachQMarks || 2);
    const chapterGroups = getChaptersForSubject(savedPaper.subject || "", savedPaper.className || "", savedPaper.board || "");
    const allChapterSelections = chapterGroups.flatMap((group) => [group.name, ...group.chapters]);

    setSelectedBoard(savedPaper.board || null);
    setSelectedLevel(savedPaper.className || null);
    setSelectedSubject(savedPaper.subject || null);
    setSelectedChapters(allChapterSelections);
    setQuestionType(savedPaper.questionType || "");
    setRequiredQuestions(String(savedPaper.questions.length || 0));
    setEachQMarks(String(marksPerQuestion));
    setShuffledOrder(orderedIds);
    setEditedQuestions(
      Object.fromEntries(
        savedPaper.questions.map((q) => [q.id, { text: q.text, urdu: q.urdu, contentType: q.contentType }])
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
    setSidebarOpen(true);
    setIsManualEditing(false);
  }, [location.state]);

  const handleOpenSavePaperDialog = () => {
    if (!paperDate) {
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
      setPaperDate(formattedDate);
    }
    if (!totalMarks || totalMarks === "0") {
      const marksPerQuestion = Number(eachQMarks) || 2;
      setTotalMarks(String(shuffledOrder.length * marksPerQuestion));
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
      title: paperName || `${selectedSubject || "Paper"} Test`,
      subject: selectedSubject || "",
      className: selectedLevel || "",
      board: selectedBoard || "",
      teacherName: session?.name || (isSubUserPortal ? "Sub User" : "Teacher"),
      date: paperDate || new Date().toLocaleDateString("en-GB"),
      paperCategory: paperCategory || `${selectedSubject || "Paper"} - ${questionType}`,
      timeAllowed: timeAllowed || "40",
      totalMarks: totalMarks && totalMarks !== "0" ? totalMarks : String(workspaceQuestions.length * (Number(eachQMarks) || 2)),
      questionType,
      questions: workspaceQuestions.map((question) => ({
        id: question.id,
        contentType: question.contentType,
        text: editedQuestions[question.id]?.text ?? question.text,
        urdu: editedQuestions[question.id]?.urdu ?? question.urdu,
      })),
    };

    navigate(`/teacher/saved-paper/${previewPaper.id}/view`, {
      state: {
        paperOverride: previewPaper,
        printMode: mode,
      },
    });
  };

  const handleSavePaper = () => {
    const activeQuestions = workspaceQuestions.map((q) => ({
      id: q.id,
      contentType: q.contentType,
      text: editedQuestions[q.id]?.text ?? q.text,
      urdu: editedQuestions[q.id]?.urdu ?? q.urdu,
    }));

    const dateForStorage = paperDate || new Date().toLocaleDateString("en-GB");
    const marksPerQuestion = Number(eachQMarks) || 2;
    const calculatedTotalMarks = totalMarks && totalMarks !== "0" ? totalMarks : String(activeQuestions.length * marksPerQuestion);

    addSavedPaper({
      id: Date.now(),
      title: paperName || `${selectedSubject || "Paper"} Test`,
      subject: selectedSubject || "",
      className: selectedLevel || "",
      board: selectedBoard || "",
      teacherName: session?.name || (isSubUserPortal ? "Sub User" : "Teacher"),
      date: dateForStorage,
      paperCategory: paperCategory || `${selectedSubject || "Paper"} - ${questionType}`,
      timeAllowed: timeAllowed || "40",
      totalMarks: calculatedTotalMarks,
      questionType,
      questions: activeQuestions,
    });

    setShowSavePaperDialog(false);
    alert("Paper saved successfully!");
    navigate(`${basePath}/dashboard`, { state: { activeView: "savedpapers" } });
  };

  useEffect(() => {
    setSelectedQuestions([]);
    setShowSearchResults(false);
    setSelectionError("");
  }, [questionType, questionPriority, selectedChapters]);

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
                  setSidebarOpen(true);
                  setShowPaperWorkspace(true);
                }
              }}>
                <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900">Select Your Questions Here ... {selectedLevel} - {selectedSubject}</h2>
                    </div>

                    {/* First Row: Question Type and Dual Medium */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">SELECT QUESTION TYPE</label>
                        <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white">
                          <option value="">Select question type</option>
                          <option value="mcq">Multiple Option (متعدد انتخابی)</option>
                          <option value="short">Short Questions (مختصر سوالات)</option>
                          <option value="long">Long Questions (تفصیلی سوالات)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">DUAL MEDIUM</label>
                        <select value={dualMedium} onChange={(e) => setDualMedium(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white">
                          <option value="dual">Dual</option>
                          <option value="english">English</option>
                          <option value="urdu">Urdu</option>
                        </select>
                      </div>
                    </div>

                    {/* Second Row: Input Fields */}
                    <div className="grid grid-cols-5 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">Required Questions *</label>
                        <input type="text" value={requiredQuestions} onChange={(e) => setRequiredQuestions(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">Each Q Marks *</label>
                        <input type="text" value={eachQMarks} onChange={(e) => setEachQMarks(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">Question Priority</label>
                        <select value={questionPriority} onChange={(e) => setQuestionPriority(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white">
                          {priorityOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">Ignore Questions</label>
                        <input type="text" value={ignoreQuestions} onChange={(e) => setIgnoreQuestions(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">Blank Lines</label>
                        <input type="text" value={blankLines} onChange={(e) => setBlankLines(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700" placeholder="0" />
                      </div>
                    </div>

                    {/* Third Row: Blank Line Type and Checkboxes */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">Blank Line Type</label>
                        <select value={blankLineType} onChange={(e) => setBlankLineType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white">
                          <option>1 LINE</option>
                          <option>2 LINES</option>
                          <option>3 LINES</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={twoQuestionsPerLine} onChange={(e) => setTwoQuestionsPerLine(e.target.checked)} className="w-4 h-4 rounded" />
                          <span className="text-[11px] font-medium text-gray-700">2 Questions Per Line</span>
                        </label>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={longQuestionsParts} onChange={(e) => setLongQuestionsParts(e.target.checked)} className="w-4 h-4 rounded" />
                          <span className="text-[11px] font-medium text-gray-700">Long Questions Parts</span>
                        </label>
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex gap-3">
                      <button type="button" onClick={handleSearchClick} className="bg-green-600 text-white text-sm font-semibold px-6 py-2 rounded hover:bg-green-700">
                        SEARCH
                      </button>
                    </div>

                    {selectionError && (
                      <p className="text-sm font-semibold text-red-600">{selectionError}</p>
                    )}

                    {/* Questions List */}
                    {showSearchResults && (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {activeQuestions.map((q, idx) => (
                          <div key={q.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
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
                              className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              {(dualMedium === "dual" || dualMedium === "english") && (
                                <p className="text-[13px] font-medium text-gray-800">{idx + 1}. {q.text}</p>
                              )}
                              {(dualMedium === "dual" || dualMedium === "urdu") && (
                                <p className={`text-sm text-gray-700 mt-1 ${isUrdu(q.urdu) ? "font-urdu" : ""}`} dir={isUrdu(q.urdu) ? "rtl" : "ltr"}>{q.urdu}</p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0 ${q.type === "Exercise" ? "bg-green-600 text-white" : "bg-yellow-300 text-gray-800"}`}>
                              {q.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Green Selected Questions Area */}
                    <div className="bg-green-200 border-2 border-green-300 rounded-xl p-4 min-h-[200px]">
                      {selectedQuestions.length > 0 && (
                        <div className="space-y-2">
                          {activeQuestions.filter(q => selectedQuestions.includes(q.id)).map((q, idx) => (
                            <div key={q.id} className="p-2 bg-white rounded text-sm">
                              {(dualMedium === "dual" || dualMedium === "english") && (
                                <p className="text-[13px] font-medium text-gray-800">{idx + 1}. {q.text}</p>
                              )}
                              {(dualMedium === "dual" || dualMedium === "urdu") && (
                                <p className={`mt-1 text-gray-700 ${isUrdu(q.urdu) ? "font-urdu" : ""}`} dir={isUrdu(q.urdu) ? "rtl" : "ltr"}>{q.urdu}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <button type="button" onClick={handleRandomSelect} className="bg-cyan-500 text-white text-sm font-semibold py-2 rounded hover:bg-cyan-600">
                        ↻ RANDOM SELECT ›
                      </button>
                      <button type="button" onClick={handleAddQuestions} className="bg-green-600 text-white text-sm font-semibold py-2 rounded hover:bg-green-700">
                        ADD QUESTIONS ›
                      </button>
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
              <h1 className="text-base font-bold tracking-wide text-primary-foreground">EXAMSYNC</h1>
              <p className="text-xs text-primary-foreground/50">{isSubUserPortal ? "Sub User Portal" : "Teacher Portal"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-semibold">{isSubUserPortal ? "Sub User Panel" : "Teacher Panel"}</span>
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
                else if (selectedSubject) setSelectedSubject(null);
                else if (selectedLevel) setSelectedLevel(null);
                else if (selectedBoard) setSelectedBoard(null);
                else window.location.href = `${basePath}/dashboard`;
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-card border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {!selectedBoard ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {boardCards.map((board) => (
                <button key={board.name} type="button" onClick={() => setSelectedBoard(board.name)} className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-secondary/60 p-6 text-center min-h-[200px] flex flex-col items-center justify-center shadow-[0_8px_24px_-14px_hsl(var(--primary)/0.45)] hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_hsl(var(--primary)/0.6)] hover:border-primary/40 transition-all duration-300">
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${board.gradient} opacity-70`} />
                  <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${board.gradient} opacity-55`} />
                  <div className={`pointer-events-none absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-gradient-to-br ${board.gradient} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-30`} />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
                  <img src={board.logo} alt={board.label} className="relative z-10 w-24 h-24 object-contain mb-4 drop-shadow-[0_6px_10px_rgba(0,0,0,0.12)]" />
                  <p className="relative z-10 text-2xl font-extrabold text-foreground tracking-wide">{board.label}</p>
                  <p className="relative z-10 text-base text-foreground/80 mt-1">{board.subtitle}</p>
                </button>
              ))}
            </div>
          ) : selectedBoard && !selectedLevel ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {(boardClassMap[selectedBoard] || []).map((card) => (
                <button key={card.title} type="button" onClick={() => setSelectedLevel(card.title)} className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-secondary/50 px-5 py-6 text-center min-h-[108px] flex flex-col items-center justify-center shadow-[0_8px_20px_-14px_hsl(var(--primary)/0.55)] hover:-translate-y-1 hover:shadow-[0_16px_30px_-16px_hsl(var(--primary)/0.65)] hover:border-primary/40 transition-all duration-300">
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.gradient} opacity-75`} />
                  <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${card.gradient} opacity-60`} />
                  <div className={`pointer-events-none absolute -left-8 -bottom-10 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-30`} />
                  <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/10 blur-xl" />
                  <p className="relative z-10 text-2xl font-extrabold text-foreground tracking-wide">{card.title}</p>
                  <p className="relative z-10 text-lg font-medium text-foreground/80 mt-1">{card.board}</p>
                </button>
              ))}
            </div>
          ) : selectedLevel && selectedBoard && !selectedSubject && boardSubjectsMap[selectedBoard]?.[selectedLevel] ? (
            <div className="space-y-5">
              <h3 className="text-center text-2xl font-bold text-foreground">{selectedBoard} › {selectedLevel}</h3>
              {boardSubjectsMap[selectedBoard][selectedLevel].map((group, gi) => (
                <div key={gi} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  {group.map((s) => (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => setSelectedSubject(s.title)}
                      className="flex items-center gap-4 rounded-xl bg-card border border-border p-4 hover:shadow-md hover:bg-secondary/50 transition-all"
                    >
                      <img src={s.image} alt={s.title} className="w-16 h-16 object-contain shrink-0" />
                      <div className={`text-left ${isUrdu(s.title) ? "font-urdu" : ""}`} dir={isUrdu(s.title) ? "rtl" : "ltr"}>
                        <h4 className="font-bold text-sm text-foreground">{s.title}</h4>
                        <p className="text-xs text-muted-foreground">{s.subtitle}</p>
                      </div>
                    </button>
                  ))}
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
                    const marksPerQuestion = Number(eachQMarks) || 2;
                    const sectionNumber = sectionIndex + 1;
                    return (
                      <div key={section.type} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between gap-6 mb-4">
                          <p className="text-sm font-bold text-gray-900 flex-1">Q{sectionNumber}. {sectionMeta[section.type].english}</p>
                          <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                            {section.questions.length}X{marksPerQuestion}={section.questions.length * marksPerQuestion}
                          </p>
                          <p className="text-sm font-bold text-gray-900 flex-1 text-right" dir="rtl">سوال نمبر{sectionNumber}۔ {sectionMeta[section.type].urdu}</p>
                        </div>
                        <div className="space-y-1">
                          {section.questions.map((q, idx) => (
                            <div key={q.id} className="flex items-start justify-between gap-4">
                              {isManualEditing ? (
                                <>
                                  <input
                                    value={editedQuestions[q.id]?.text ?? q.text}
                                    onChange={(e) => setEditedQuestions(prev => ({ ...prev, [q.id]: { ...prev[q.id] ?? { text: q.text, urdu: q.urdu }, text: e.target.value } }))}
                                    className="flex-1 text-sm text-gray-800 border border-gray-300 rounded px-2 py-1"
                                  />
                                  <input
                                    dir="rtl"
                                    value={editedQuestions[q.id]?.urdu ?? q.urdu}
                                    onChange={(e) => setEditedQuestions(prev => ({ ...prev, [q.id]: { ...prev[q.id] ?? { text: q.text, urdu: q.urdu }, urdu: e.target.value } }))}
                                    className="flex-1 text-sm text-gray-800 border border-gray-300 rounded px-2 py-1 text-right"
                                  />
                                </>
                              ) : (
                                <>
                                  <p className="text-sm text-gray-800">{idx + 1} . {editedQuestions[q.id]?.text ?? q.text}</p>
                                  <p className="text-sm text-gray-800 text-right" dir="rtl">{idx + 1} ۔ {editedQuestions[q.id]?.urdu ?? q.urdu}</p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
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
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-3">{selectedSubject} - {selectedLevel}</h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground mb-5">Select Chapter(s)</p>
                
                <div className="mb-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedChapters.length === getChaptersForSubject(selectedSubject, selectedLevel, selectedBoard).flatMap(g => [g.name, ...g.chapters]).length && selectedChapters.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedChapters(getChaptersForSubject(selectedSubject, selectedLevel, selectedBoard).flatMap(g => [g.name, ...g.chapters]));
                        } else {
                          setSelectedChapters([]);
                        }
                      }}
                      className="h-4 w-4 accent-primary rounded"
                    />
                    <span className="text-[11px] sm:text-xs font-bold text-foreground uppercase tracking-wide">Select All Chapters</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {getChaptersForSubject(selectedSubject, selectedLevel, selectedBoard).map((group, groupIdx) => (
                    <div key={groupIdx} className="bg-background border border-border rounded-lg p-4">
                      <label className="flex items-start gap-2.5 mb-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedChapters.includes(group.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChapters([...selectedChapters, group.name, ...group.chapters]);
                            } else {
                              setSelectedChapters(selectedChapters.filter(ch => ch !== group.name && !group.chapters.includes(ch)));
                            }
                          }}
                          className="h-4 w-4 accent-primary rounded mt-0.5 flex-shrink-0"
                        />
                        <span className="text-[11px] sm:text-xs font-bold text-foreground">{group.name}</span>
                      </label>
                      
                      <div className="space-y-2 ml-7">
                        {group.chapters.map((chapter, chIdx) => (
                          <label key={chIdx} className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedChapters.includes(chapter)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedChapters([...selectedChapters, chapter]);
                                } else {
                                  setSelectedChapters(selectedChapters.filter(ch => ch !== chapter));
                                }
                              }}
                              className="h-3.5 w-3.5 accent-primary rounded"
                            />
                            <span className="text-[11px] sm:text-xs text-foreground">{chapter}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedQuestions.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {allQuestions
                      .filter((q) => selectedQuestions.includes(q.id))
                      .map((q) => (
                        <div key={q.id} className="text-sm text-foreground">
                          {q.id}. {q.text}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  disabled={selectedChapters.length === 0}
                  onClick={() => {
                    setShowQuestionSelection(true);
                    setShowPaperWorkspace(true);
                    setSidebarOpen(true);
                  }}
                  className="bg-foreground text-background text-xs font-semibold py-2.5 px-7 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
                >
                  NEXT <span>›</span>
                </button>
              </div>
            </div>
          ) : showQuestionSelection && selectedSubject && selectedBoard && selectedLevel ? (
            <div className="space-y-6">
              <div className="bg-[hsl(var(--pts-dark))] text-primary-foreground rounded-xl p-6 flex items-center justify-between">
                <h2 className="text-lg font-bold">Select Your Questions Here ... {selectedLevel} - {selectedSubject}</h2>
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
                    <option value="mcq">Multiple Option (متعدد انتخابی)</option>
                    <option value="short">Short Questions (مختصر سوالات)</option>
                    <option value="long">Long Questions (تفصیلی سوالات)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">DUAL MEDIUM</label>
                  <select value="" onChange={() => {}} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm">
                    <option>English/Urdu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Required Questions *</label>
                  <input type="text" value={requiredQuestions} onChange={(e) => setRequiredQuestions(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Each Q Marks *</label>
                  <input type="text" value={eachQMarks} onChange={(e) => setEachQMarks(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Ignore Questions</label>
                  <input type="text" value={ignoreQuestions} onChange={(e) => setIgnoreQuestions(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Blank Lines</label>
                  <input type="text" value={blankLines} onChange={(e) => setBlankLines(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Blank Line Type</label>
                  <select value={blankLineType} onChange={(e) => setBlankLineType(e.target.value)} className="w-full border border-border rounded-lg bg-card text-foreground px-3 py-2 text-sm">
                    <option>1 LINE</option>
                    <option>2 LINES</option>
                    <option>3 LINES</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={twoQuestionsPerLine} onChange={(e) => setTwoQuestionsPerLine(e.target.checked)} className="w-4 h-4 accent-primary rounded" />
                    <span className="text-xs font-semibold text-foreground">2 Questions Per Line</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={longQuestionsParts} onChange={(e) => setLongQuestionsParts(e.target.checked)} className="w-4 h-4 accent-primary rounded" />
                    <span className="text-xs font-semibold text-foreground">Long Questions Parts</span>
                  </label>
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
    </div>
  );
};

export default TeacherGeneratePaper;
