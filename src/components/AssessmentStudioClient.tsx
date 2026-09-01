"use client";

import React, { useState } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { generateFsdDocx, CodeFileItem, OutputItem } from "@/lib/docxGenerator";
import { generateAssessmentObjectivesAndOutcomes } from "@/app/actions/generateAssessmentAi";
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
    { id: string; heading: string; imageFile: File | null; previewUrl: string | null; bytes: Uint8Array | null }[]
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

  const handleGenerateAiObjectives = async () => {
    if (!aimEasy.trim() && !aimMedium.trim() && !aimHard.trim()) {
      alert("Please enter your Aim (Easy, Medium, or Hard) first so Gemini can analyze the requirements!");
      return;
    }

    const apiKey = localStorage.getItem("stash_gemini_api_key") || "";
    setIsAiGenerating(true);
    setAiError(null);

    try {
      const firstCodeFile = unzippedFiles.find((f) => selectedFilePaths.includes(f.path));
      const res = await generateAssessmentObjectivesAndOutcomes({
        aimEasy,
        aimMedium,
        aimHard,
        courseTitle: activeCourse?.title || "Full Stack Development - II",
        codeSnippet: firstCodeFile?.rawContent,
        apiKey,
      });

      if (res.success && res.objectives && res.learningOutcomes) {
        setObjectives(res.objectives);
        setLearningOutcomes(res.learningOutcomes);
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

  // Add Output Image Slot
  const handleAddOutput = () => {
    setOutputItems([
      ...outputItems,
      { id: Date.now().toString(), heading: "#OutputView:", imageFile: null, previewUrl: null, bytes: null },
    ]);
  };

  const handleRemoveOutput = (id: string) => {
    setOutputItems(outputItems.filter((o) => o.id !== id));
  };

  const handleOutputImageUpload = async (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      setOutputItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, imageFile: file, previewUrl: URL.createObjectURL(file), bytes: uint8 }
            : item
        )
      );
    };
    reader.readAsArrayBuffer(file);
  };

  // Generate & Download .docx File
  const handleDownloadDocx = async () => {
    if (!aimEasy.trim() || !aimMedium.trim() || !aimHard.trim()) {
      alert("Please fill in the Aim for Easy, Medium, and Hard before generating.");
      return;
    }

    setIsGeneratingDocx(true);

    try {
      // Prepare clean code files without comments
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

      // Prepare Output items
      const finalOutputs: OutputItem[] = outputItems.map((o) => ({
        heading: o.heading,
        imageBytes: o.bytes,
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
        objectives,
        codeFiles: chosenFiles,
        outputItems: finalOutputs,
        learningOutcomes,
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
                    <div key={item.id} className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                          <input
                            type="text"
                            value={item.heading}
                            onChange={(e) =>
                              setOutputItems((prev) =>
                                prev.map((o) => (o.id === item.id ? { ...o, heading: e.target.value } : o))
                              )
                            }
                            placeholder="Heading e.g. #Dashboard: or #AddStudent:"
                            className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/15 text-white text-xs font-mono font-bold focus:border-white focus:outline-none"
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

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono cursor-pointer transition">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{item.imageFile ? item.imageFile.name : "Choose Screenshot"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleOutputImageUpload(item.id, f);
                            }}
                            className="hidden"
                          />
                        </label>
                        {item.previewUrl && (
                          <img
                            src={item.previewUrl}
                            alt="Output preview"
                            className="h-10 w-16 object-cover rounded-lg border border-white/20"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Objectives & Learning Outcomes (AI Generated Pointers) */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    5. Objectives & Learning Outcomes (AI Generated Pointers)
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleGenerateAiObjectives}
                    disabled={isAiGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold transition cursor-pointer disabled:opacity-50"
                  >
                    {isAiGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    )}
                    <span>{isAiGenerating ? "Synthesizing with Gemini..." : "✨ Generate with Gemini AI"}</span>
                  </button>
                </div>

                {aiError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between gap-2">
                    <span>{aiError}</span>
                    <Link
                      href="/profile"
                      className="text-white underline font-bold hover:text-purple-300 shrink-0"
                    >
                      Add Key in Profile &rarr;
                    </Link>
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
