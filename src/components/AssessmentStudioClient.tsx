"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { generateFsdDocx, CodeFileItem, OutputItem } from "@/lib/docxGenerator";
import { generateAssessmentObjectivesAndOutcomes } from "@/app/actions/generateAssessmentAi";
import { saveUserGeminiApiKey } from "@/app/actions/register";
import {
  Code2,
  Globe,
  Cpu,
  Coffee,
  UploadCloud,
  FileText,
  Check,
  Download,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  FileCode,
  Loader2,
  ArrowRight,
  Key,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";

interface AssessmentStudioClientProps {
  currentUser: {
    name?: string | null;
    email?: string | null;
  };
  studentDetails: {
    branch: string;
    yearOfStudy: string;
    uidNumber: string;
  };
}

interface CourseCardData {
  id: string;
  title: string;
  code: string;
  icon: any;
  accent: string;
  borderGlow: string;
}

const COURSES: CourseCardData[] = [
  {
    id: "cc-2",
    title: "Competitive Coding-II",
    code: "CSE 311",
    icon: Code2,
    accent: "text-purple-400",
    borderGlow: "hover:border-purple-500/50 hover:shadow-purple-500/10",
  },
  {
    id: "fsd-2",
    title: "Full Stack Development-II",
    code: "24CSP-304",
    icon: Globe,
    accent: "text-cyan-400",
    borderGlow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
  },
  {
    id: "iot",
    title: "IoT",
    code: "CSE 313",
    icon: Cpu,
    accent: "text-emerald-400",
    borderGlow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  {
    id: "pbl-java",
    title: "Project Based Learning in Java",
    code: "CSE 314",
    icon: Coffee,
    accent: "text-rose-400",
    borderGlow: "hover:border-rose-500/50 hover:shadow-rose-500/10",
  },
];

function stripComments(code: string): string {
  // Remove multi-line comments /* ... */ and JSX comments {/* ... */}
  let cleaned = code.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove single line comments // ... but not inside URLs
  return cleaned
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("//");
      if (idx !== -1) {
        const before = line.slice(0, idx);
        if (!before.includes("http:") && !before.includes("https:") && !before.includes('"') && !before.includes("'")) {
          return before.trimEnd();
        }
      }
      return line;
    })
    .filter((line, idx, arr) => {
      return line.trim() !== "" || (idx > 0 && arr[idx - 1].trim() !== "");
    })
    .join("\n");
}

export function AssessmentStudioClient({
  currentUser,
  studentDetails,
}: AssessmentStudioClientProps) {
  const [activeCourse, setActiveCourse] = useState<CourseCardData | null>(null);

  // Form State
  const [experimentNo, setExperimentNo] = useState("5");
  const [dateOfPerformance, setDateOfPerformance] = useState("27/08/26");
  const [studentName, setStudentName] = useState(currentUser.name || "Abhideep Jain");
  const [uid, setUid] = useState(studentDetails.uidNumber || "24BCS10694");
  const [branch, setBranch] = useState("BE CSE");
  const [sectionGroup, setSectionGroup] = useState("24BCS_703_A");
  const [semester, setSemester] = useState("5th");
  const [subjectName, setSubjectName] = useState("Full Stack Development - II");
  const [subjectCode, setSubjectCode] = useState("24CSP-304");

  // AIM (Exact, No AI)
  const [aimEasy, setAimEasy] = useState("");
  const [aimMedium, setAimMedium] = useState("");
  const [aimHard, setAimHard] = useState("");

  // Codebase Zip & Extracted Files
  const [zipFileName, setZipFileName] = useState<string | null>(null);
  const [unzippedFiles, setUnzippedFiles] = useState<{ path: string; name: string; rawContent: string }[]>([]);
  const [selectedFilePaths, setSelectedFilePaths] = useState<string[]>([]);
  const [isUnzipping, setIsUnzipping] = useState(false);

  // Output Images
  const [outputItems, setOutputItems] = useState<
    {
      id: string;
      heading: string;
      imageFile: File | null;
      previewUrl: string | null;
      bytes: Uint8Array | null;
      base64DataUrl?: string | null;
      width?: number;
      height?: number;
    }[]
  >([
    { id: "1", heading: "#Dashboard:", imageFile: null, previewUrl: null, bytes: null },
  ]);

  // AI Generated Objectives & Learning Outcomes
  const [objectives, setObjectives] = useState<string[]>([
    "To understand and implement React components for displaying and managing application records.",
    "To create reusable components for different sections and functionalities of the system.",
    "To implement advanced frontend logic and state management for handling data and user interactions.",
    "To implement forms and validation for adding and updating application state.",
    "To implement interactive functionalities such as searching, filtering, editing, and deleting records.",
    "To enhance understanding of component-based modular architecture and responsive user interfaces.",
  ]);

  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    "Implement React Router to create and navigate between multiple pages in a Single Page Application.",
    "Create dynamic routes using route parameters to display individual record details.",
    "Develop modular systems to add, display, update, and manage records using React components and state management.",
    "Implement form handling and validation to collect and validate user information efficiently.",
    "Implement live search and filtering to efficiently find and manage records based on relevant criteria.",
    "Integrate multiple React functionalities such as routing, state management, forms, and filtering to develop a complete interactive frontend application.",
  ]);

  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Gemini API Key Inline State
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [keySavedInline, setKeySavedInline] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("stash_gemini_api_key");
    if (saved) setGeminiApiKeyInput(saved);
  }, []);

  const handleSaveInlineKey = async () => {
    const key = geminiApiKeyInput.trim();
    if (!key) {
      localStorage.removeItem("stash_gemini_api_key");
      document.cookie = "stash_gemini_key=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      try {
        await saveUserGeminiApiKey("");
      } catch {}
      setKeySavedInline(true);
      setTimeout(() => setKeySavedInline(false), 2000);
      return;
    }

    localStorage.setItem("stash_gemini_api_key", key);
    document.cookie = `stash_gemini_key=${encodeURIComponent(key)}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      await saveUserGeminiApiKey(key);
    } catch {}
    setKeySavedInline(true);
    setAiError(null);
    setTimeout(() => setKeySavedInline(false), 2000);
  };

  const handleGenerateAiObjectives = async () => {
    if (!aimEasy.trim() && !aimMedium.trim() && !aimHard.trim()) {
      alert("Please enter your Aim (Easy, Medium, or Hard) first so Gemini can analyze the requirements!");
      return;
    }

    const effectiveKey =
      geminiApiKeyInput.trim() ||
      localStorage.getItem("stash_gemini_api_key") ||
      "";

    if (!effectiveKey) {
      setAiError("Please paste your Google Gemini API key in the box below to generate live objectives.");
      return;
    }

    setIsAiGenerating(true);
    setAiError(null);
    setAiSuccessMessage(null);

    try {
      const chosenFiles = unzippedFiles
        .filter((f) => selectedFilePaths.includes(f.path))
        .map((f) => ({
          filename: f.name,
          cleanCode: stripComments(f.rawContent),
        }));

      const res = await generateAssessmentObjectivesAndOutcomes({
        aimEasy,
        aimMedium,
        aimHard,
        courseTitle: activeCourse?.title || "Full Stack Development - II",
        codeFiles: chosenFiles,
        apiKey: effectiveKey,
      });

      if (res.success && res.objectives && res.learningOutcomes) {
        setObjectives(res.objectives);
        setLearningOutcomes(res.learningOutcomes);
        setAiSuccessMessage(
          `✓ Gemini synthesized ${res.objectives.length} objectives & ${res.learningOutcomes.length} outcomes from your codebase & aim!`
        );
        setTimeout(() => setAiSuccessMessage(null), 4500);
      } else {
        setAiError(res.error || "Failed to generate AI pointers.");
      }
    } catch (err: any) {
      setAiError(err.message || "Failed to contact Gemini API.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Handle Zip Upload
  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setZipFileName(file.name);
    setIsUnzipping(true);

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const extracted: { path: string; name: string; rawContent: string }[] = [];

      for (const [relativePath, zipEntry] of Object.entries(contents.files)) {
        if (!zipEntry.dir && !relativePath.includes("node_modules/") && !relativePath.includes(".git/")) {
          // Check for code file extensions
          const isCode = /\.(jsx|js|tsx|ts|css|html|json|cpp|java|py)$/i.test(relativePath);
          if (isCode) {
            const text = await zipEntry.async("text");
            const filename = relativePath.split("/").pop() || relativePath;
            extracted.push({
              path: relativePath,
              name: filename,
              rawContent: text,
            });
          }
        }
      }

      setUnzippedFiles(extracted);

      // Default select App.jsx, main.jsx, or core components
      const initialSelected = extracted
        .filter((f) => /App\.(jsx|js|tsx)|main\.(jsx|js|tsx)|index\.(css|html)|NavBar/i.test(f.name))
        .map((f) => f.path);

      setSelectedFilePaths(initialSelected.length > 0 ? initialSelected : extracted.slice(0, 4).map((f) => f.path));
    } catch (err) {
      console.error("Failed to unzip file:", err);
      alert("Failed to unzip codebase. Please upload a valid .zip archive.");
    } finally {
      setIsUnzipping(false);
    }
  };

  const toggleFileSelection = (path: string) => {
    if (selectedFilePaths.includes(path)) {
      setSelectedFilePaths(selectedFilePaths.filter((p) => p !== path));
    } else {
      setSelectedFilePaths([...selectedFilePaths, path]);
    }
  };

  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const HEADING_PRESETS = [
    "#Dashboard:",
    "#AddStudent:",
    "#EditStudent:",
    "#StudentList:",
    "#OutputView:",
    "#TerminalExecution:",
    "#TestResults:",
  ];

  // Converts any image (PNG, JPEG, WebP, AVIF, BMP, Clipboard Blob) into standard PNG bytes & Data URL via canvas
  const processImageToStandardPng = (file: File | Blob): Promise<{
    bytes: Uint8Array;
    base64DataUrl: string;
    previewUrl: string;
    width: number;
    height: number;
  }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const naturalWidth = img.naturalWidth || img.width || 800;
          const naturalHeight = img.naturalHeight || img.height || 600;

          const canvas = document.createElement("canvas");
          canvas.width = naturalWidth;
          canvas.height = naturalHeight;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngDataUrl = canvas.toDataURL("image/png");

            // Convert to clean standard byte array using atob
            const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, "");
            const binaryStr = atob(base64Data);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }

            resolve({
              bytes,
              base64DataUrl: pngDataUrl,
              previewUrl: pngDataUrl,
              width: naturalWidth,
              height: naturalHeight,
            });
          } else {
            resolve({
              bytes: new Uint8Array(),
              base64DataUrl: rawDataUrl,
              previewUrl: rawDataUrl,
              width: naturalWidth,
              height: naturalHeight,
            });
          }
        };
        img.onerror = () => reject(new Error("Failed to load image in canvas"));
        img.src = rawDataUrl;
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  };

  const handleOutputImageUpload = async (id: string, file: File) => {
    try {
      const processed = await processImageToStandardPng(file);
      setOutputItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                imageFile: file,
                previewUrl: processed.previewUrl,
                bytes: processed.bytes,
                base64DataUrl: processed.base64DataUrl,
                width: processed.width,
                height: processed.height,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error processing output image via canvas, using raw fallback:", err);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        const previewUrl = URL.createObjectURL(file);
        setOutputItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, imageFile: file, previewUrl, bytes: uint8 }
              : item
          )
        );
      } catch (fallbackErr) {
        console.error("Critical image loading failure:", fallbackErr);
      }
    }
  };

  const handlePasteFromClipboardButton = async (id: string) => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const file = new File([blob], `screenshot_${Date.now()}.png`, { type });
            await handleOutputImageUpload(id, file);
            return;
          }
        }
      }
      alert("No image found in clipboard. Take a screenshot (Win + Shift + S) and click Paste again!");
    } catch (err) {
      alert("Clipboard permission prompt or press Ctrl + V directly inside the box to paste.");
    }
  };

  const handlePasteImage = (id: string, e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleOutputImageUpload(id, file);
        }
        break;
      }
    }
  };

  // Global window paste listener when modal is active
  useEffect(() => {
    if (!activeCourse) return;

    const handleGlobalPaste = async (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA") &&
        target.getAttribute("type") !== "file"
      ) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const targetId =
              selectedSlotId ||
              outputItems.find((o) => !o.previewUrl)?.id ||
              outputItems[outputItems.length - 1]?.id ||
              outputItems[0]?.id;

            if (targetId) {
              await handleOutputImageUpload(targetId, file);
            }
          }
          break;
        }
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, [activeCourse, outputItems, selectedSlotId]);

  const handleDropImage = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleOutputImageUpload(id, file);
    }
  };

  // Add Output Image Slot
  const handleAddOutput = () => {
    const newId = Date.now().toString();
    setOutputItems([
      ...outputItems,
      { id: newId, heading: "#OutputView:", imageFile: null, previewUrl: null, bytes: null },
    ]);
    setSelectedSlotId(newId);
  };

  const handleRemoveOutput = (id: string) => {
    setOutputItems(outputItems.filter((o) => o.id !== id));
  };

  // Generate & Download .docx File
  const handleDownloadDocx = async () => {
    if (!aimEasy.trim() || !aimMedium.trim() || !aimHard.trim()) {
      alert("Please fill in the Aim for Easy, Medium, and Hard before generating.");
      return;
    }

    setIsGeneratingDocx(true);

    try {
      // 1. Prepare clean code files without comments
      const chosenFiles: CodeFileItem[] = unzippedFiles
        .filter((f) => selectedFilePaths.includes(f.path))
        .map((f) => ({
          filename: f.name,
          cleanCode: stripComments(f.rawContent),
        }));

      // Fallback if no zip was uploaded
      if (chosenFiles.length === 0) {
        chosenFiles.push({
          filename: "App.jsx",
          cleanCode: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div>\n      <h1>Full Stack Development II Assessment</h1>\n    </div>\n  );\n}`,
        });
      }

      // 2. Run live Google Gemini AI synthesis for Objectives & Outcomes if possible
      let finalObjectives = objectives;
      let finalLearningOutcomes = learningOutcomes;

      const apiKey = geminiApiKeyInput.trim() || localStorage.getItem("stash_gemini_api_key") || "";

      try {
        const aiRes = await generateAssessmentObjectivesAndOutcomes({
          aimEasy,
          aimMedium,
          aimHard,
          courseTitle: activeCourse?.title || "Full Stack Development - II",
          codeFiles: chosenFiles,
          apiKey,
        });

        if (aiRes.success && aiRes.objectives && aiRes.learningOutcomes) {
          finalObjectives = aiRes.objectives;
          finalLearningOutcomes = aiRes.learningOutcomes;
          setObjectives(aiRes.objectives);
          setLearningOutcomes(aiRes.learningOutcomes);
        }
      } catch (aiErr) {
        console.warn("AI generation fallback to standard curriculum pointers:", aiErr);
      }

      // Prepare Output items
      const finalOutputs: OutputItem[] = outputItems.map((o) => ({
        heading: o.heading,
        imageBytes: o.bytes,
        base64DataUrl: o.base64DataUrl,
        width: o.width,
        height: o.height,
      }));

      // Generate the exact docx blob
      const docxBlob = await generateFsdDocx({
        experimentNo,
        studentName,
        uid,
        branch,
        sectionGroup,
        semester,
        dateOfPerformance,
        subjectName,
        subjectCode,
        aimEasy,
        aimMedium,
        aimHard,
        objectives: finalObjectives,
        codeFiles: chosenFiles,
        outputItems: finalOutputs,
        learningOutcomes: finalLearningOutcomes,
      });

      // Trigger automatic browser download
      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FSD_EXP_0${experimentNo}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate docx:", err);
      alert("Error generating .docx file. Please check your inputs and try again.");
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      
      {/* 4 Cards Grid - No other text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {COURSES.map((course) => {
          const Icon = course.icon;
          return (
            <div
              key={course.id}
              onClick={() => setActiveCourse(course)}
              className={`fused-card rounded-3xl p-8 sm:p-12 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[260px] sm:min-h-[300px] border border-white/10 ${course.borderGlow} shadow-xl hover:scale-[1.02] active:scale-[0.99] relative overflow-hidden`}
            >
              {/* Subtle ambient glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[90px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40" />

              {/* Icon & Subject Code */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${course.accent} transition-transform group-hover:scale-110 shadow-lg`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  {course.code}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-2 pt-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight group-hover:text-white transition">
                  {course.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-slate-200 transition">
                  <span>Generate Assessment .docx</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Stack Development-II Dedicated Generator Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="fused-card border-prismatic rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl relative border border-white/20">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ${activeCourse.accent}`}>
                  <activeCourse.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white font-display">
                    {activeCourse.title}
                  </h3>
                  <span className="text-xs font-mono text-cyan-400">
                    {activeCourse.code} &bull; Official Submission .docx Generator
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveCourse(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Sections */}
            <div className="space-y-6">
              
              {/* 1. Experiment & Student Details */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                  1. Experiment & Student Metadata
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Experiment No.</label>
                    <input
                      type="text"
                      value={experimentNo}
                      onChange={(e) => setExperimentNo(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Date of Performance</label>
                    <input
                      type="text"
                      value={dateOfPerformance}
                      onChange={(e) => setDateOfPerformance(e.target.value)}
                      placeholder="e.g. 27/08/26"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Section / Group</label>
                    <input
                      type="text"
                      value={sectionGroup}
                      onChange={(e) => setSectionGroup(e.target.value)}
                      placeholder="24BCS_703_A"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Student Name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-bold focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Student UID</label>
                    <input
                      type="text"
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-purple-300 text-xs font-mono font-bold focus:border-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. AIM (Exact User Input - Easy, Medium, Hard) */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                    2. AIM (Exact Text - No AI Generation)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Ditto Match</span>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300 font-bold">
                      (Easy):
                    </label>
                    <textarea
                      rows={2}
                      value={aimEasy}
                      onChange={(e) => setAimEasy(e.target.value)}
                      placeholder="Enter Easy problem aim exactly as given by professor..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs leading-relaxed focus:border-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300 font-bold">
                      (Medium):
                    </label>
                    <textarea
                      rows={2}
                      value={aimMedium}
                      onChange={(e) => setAimMedium(e.target.value)}
                      placeholder="Enter Medium problem aim exactly as given by professor..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs leading-relaxed focus:border-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300 font-bold">
                      (Hard):
                    </label>
                    <textarea
                      rows={2}
                      value={aimHard}
                      onChange={(e) => setAimHard(e.target.value)}
                      placeholder="Enter Hard problem aim exactly as given by professor..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs leading-relaxed focus:border-white focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Codebase Zip Upload & File Selector */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  3. Codebase Zip & File Selection
                </span>

                <div className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition cursor-pointer relative bg-black/40 group">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleZipUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-300 group-hover:scale-110 transition">
                      <UploadCloud className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-xs font-bold text-white">
                      {isUnzipping ? (
                        <span className="flex items-center justify-center gap-2 text-cyan-400 font-mono">
                          <Loader2 className="w-4 h-4 animate-spin" /> Unzipping codebase...
                        </span>
                      ) : zipFileName ? (
                        <span className="text-emerald-400 flex items-center justify-center gap-1.5 font-mono">
                          <CheckCircle2 className="w-4 h-4" /> {zipFileName} ({unzippedFiles.length} files extracted)
                        </span>
                      ) : (
                        "Upload Entire Codebase (.zip)"
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Extracts your code files and automatically strips all comments
                    </p>
                  </div>
                </div>

                {/* File Checkboxes */}
                {unzippedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Select files to include in report (Times New Roman 10pt, no comments):</span>
                      <span>{selectedFilePaths.length} selected</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2 bg-black/60 rounded-xl border border-white/10">
                      {unzippedFiles.map((file) => {
                        const isSelected = selectedFilePaths.includes(file.path);
                        return (
                          <div
                            key={file.path}
                            onClick={() => toggleFileSelection(file.path)}
                            className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center justify-between cursor-pointer transition ${
                              isSelected
                                ? "bg-white/10 border-emerald-500 text-white"
                                : "bg-black/40 border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                            }`}
                          >
                            <span className="truncate">{file.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Output Screenshots & Headings */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                    4. Output Images & Headings
                  </span>
                  <button
                    type="button"
                    onClick={handleAddOutput}
                    className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Output Image
                  </button>
                </div>

                <div className="space-y-3">
                  {outputItems.map((item, idx) => (
                    <div
                      key={item.id}
                      onPaste={(e) => handlePasteImage(item.id, e)}
                      tabIndex={0}
                      className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 focus:border-rose-500/50 focus:outline-none transition"
                    >
                      {/* Heading Row: Dropdown selector + Editable Custom Input + Delete */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                          <span className="text-xs font-mono text-slate-500 font-bold">#{idx + 1}</span>

                          {/* Heading Dropdown */}
                          <select
                            value={HEADING_PRESETS.includes(item.heading) ? item.heading : "custom"}
                            onChange={(e) => {
                              if (e.target.value !== "custom") {
                                setOutputItems((prev) =>
                                  prev.map((o) => (o.id === item.id ? { ...o, heading: e.target.value } : o))
                                );
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/15 text-white text-xs font-mono font-bold focus:border-white focus:outline-none cursor-pointer"
                          >
                            <option value="custom">Select Heading...</option>
                            {HEADING_PRESETS.map((preset) => (
                              <option key={preset} value={preset}>
                                {preset}
                              </option>
                            ))}
                          </select>

                          {/* Heading Text Input */}
                          <input
                            type="text"
                            value={item.heading}
                            onChange={(e) =>
                              setOutputItems((prev) =>
                                prev.map((o) => (o.id === item.id ? { ...o, heading: e.target.value } : o))
                              )
                            }
                            placeholder="Heading e.g. #Dashboard:"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-white/15 text-white text-xs font-mono font-bold focus:border-white focus:outline-none"
                          />
                        </div>

                        {outputItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOutput(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Interactive Drag & Drop / Browse / Clipboard Paste Zone */}
                      <div
                        tabIndex={0}
                        onClick={() => {
                          setSelectedSlotId(item.id);
                          document.getElementById(`file-input-${item.id}`)?.click();
                        }}
                        onFocus={() => setSelectedSlotId(item.id)}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOverId(item.id);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOverId(item.id);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOverId(null);
                        }}
                        onDrop={(e) => handleDropImage(item.id, e)}
                        className={`border-2 border-dashed rounded-2xl p-4 transition text-center relative group cursor-pointer ${
                          dragOverId === item.id
                            ? "border-rose-400 bg-rose-500/20 scale-[1.01]"
                            : selectedSlotId === item.id
                            ? "border-purple-400/80 bg-neutral-950/90"
                            : "border-white/15 hover:border-white/35 bg-neutral-950/60"
                        }`}
                      >
                        {/* Hidden Native Input triggered by click */}
                        <input
                          id={`file-input-${item.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleOutputImageUpload(item.id, f);
                          }}
                          className="hidden"
                        />

                        {item.previewUrl ? (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.previewUrl}
                                alt="Output preview"
                                className="h-16 w-24 object-cover rounded-xl border border-white/20 shadow-md"
                              />
                              <div className="text-left">
                                <span className="text-xs font-mono font-bold text-white block truncate max-w-[220px]">
                                  {item.imageFile?.name || "Pasted Screenshot"}
                                </span>
                                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                                  <Check className="w-3.5 h-3.5" /> Image Loaded & Ready
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-mono text-slate-400 group-hover:text-white underline">
                              Change Image
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2.5 py-2">
                            <div className="flex items-center justify-center gap-2 text-slate-300 group-hover:text-white transition">
                              <UploadCloud className="w-5 h-5 text-rose-400" />
                              <span className="text-xs font-bold text-white">
                                Drop image here, click to browse, or paste with Ctrl + V
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePasteFromClipboardButton(item.id);
                                }}
                                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Copy className="w-3 h-3 text-rose-400" />
                                <span>Paste from Clipboard</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Objectives & Learning Outcomes (AI Generated Pointers) */}
              <div className="space-y-3.5 pt-3 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>5. Objectives & Learning Outcomes (AI Generated Pointers)</span>
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleGenerateAiObjectives}
                    disabled={isAiGenerating}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/25 hover:bg-purple-500/35 border border-purple-500/50 text-purple-200 text-xs font-mono font-bold transition shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-50"
                  >
                    {isAiGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    )}
                    <span>{isAiGenerating ? "Synthesizing with Gemini AI..." : "✨ Generate with Gemini AI"}</span>
                  </button>
                </div>

                {/* Inline Gemini API Key Setup Box */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                      <span>Google Gemini API Key:</span>
                      {geminiApiKeyInput && (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          ● Key Ready
                        </span>
                      )}
                    </div>

                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold underline"
                    >
                      <span>Get Free Google Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showGeminiKey ? "text" : "password"}
                        value={geminiApiKeyInput}
                        onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                        placeholder="Paste your key here (e.g. AIzaSy...)"
                        className="w-full px-3 py-2 pr-10 rounded-xl bg-black border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1"
                      >
                        {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveInlineKey}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {keySavedInline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Key className="w-3.5 h-3.5" />}
                      <span>{keySavedInline ? "Saved!" : "Save Key"}</span>
                    </button>
                  </div>
                </div>

                {aiSuccessMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{aiSuccessMessage}</span>
                  </div>
                )}

                {aiError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between gap-2">
                    <span>{aiError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5 bg-black/40 p-3 rounded-2xl border border-white/10">
                    <span className="font-bold text-white font-mono uppercase text-[11px] block">
                      OBJECTIVE ({objectives.length} Pointers)
                    </span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside font-serif text-[11px] leading-relaxed">
                      {objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 bg-black/40 p-3 rounded-2xl border border-white/10">
                    <span className="font-bold text-white font-mono uppercase text-[11px] block">
                      LEARNING OUTCOMES ({learningOutcomes.length} Pointers)
                    </span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside font-serif text-[11px] leading-relaxed">
                      {learningOutcomes.map((out, i) => (
                        <li key={i}>{out}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Final Submit & Download Action */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  disabled={isGeneratingDocx}
                  className="w-full py-4 rounded-2xl bg-white hover:bg-slate-200 text-black font-extrabold text-sm transition flex items-center justify-center gap-2.5 shadow-xl shadow-white/10 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingDocx ? (
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                  ) : (
                    <Download className="w-5 h-5 text-black" />
                  )}
                  <span>
                    {isGeneratingDocx
                      ? "Compiling Official .docx Report..."
                      : `Download FSD_EXP_0${experimentNo}.docx (Ready for Submission)`}
                  </span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
