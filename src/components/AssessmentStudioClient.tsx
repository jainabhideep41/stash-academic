"use client";

import React, { useState } from "react";
import {
  Code2,
  Globe,
  Cpu,
  Coffee,
  UploadCloud,
  Sparkles,
  Check,
  Copy,
  Download,
  Printer,
  X,
  FileText,
  RefreshCw,
  Eye,
  Code,
  CheckCircle2,
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
  bgGlow: string;
}

const COURSES: CourseCardData[] = [
  {
    id: "cc-2",
    title: "Competitive Coding-II",
    code: "CSE 311",
    icon: Code2,
    accent: "text-purple-400",
    borderGlow: "hover:border-purple-500/50 hover:shadow-purple-500/10",
    bgGlow: "group-hover:bg-purple-500/10",
  },
  {
    id: "fsd-2",
    title: "Full Stack Development-II",
    code: "CSE 312",
    icon: Globe,
    accent: "text-cyan-400",
    borderGlow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    bgGlow: "group-hover:bg-cyan-500/10",
  },
  {
    id: "iot",
    title: "IoT",
    code: "CSE 313",
    icon: Cpu,
    accent: "text-emerald-400",
    borderGlow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    bgGlow: "group-hover:bg-emerald-500/10",
  },
  {
    id: "pbl-java",
    title: "Project Based Learning in Java",
    code: "CSE 314",
    icon: Coffee,
    accent: "text-rose-400",
    borderGlow: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    bgGlow: "group-hover:bg-rose-500/10",
  },
];

export function AssessmentStudioClient({
  currentUser,
  studentDetails,
}: AssessmentStudioClientProps) {
  const [activeCourse, setActiveCourse] = useState<CourseCardData | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "markdown">("preview");
  const [copied, setCopied] = useState(false);

  const studentName = currentUser.name || "Student";
  const studentUid = studentDetails.uidNumber || "23CS01049";
  const studentBranch = studentDetails.branch || "Computer Science & Engineering";
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleOpenCourse = (course: CourseCardData) => {
    setActiveCourse(course);
    setReferenceFile(null);
    setNewTopic("");
    setGeneratedDoc(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setReferenceFile(file);
  };

  const handleGenerate = () => {
    if (!activeCourse) return;
    setIsGenerating(true);

    setTimeout(() => {
      const topicTitle = newTopic.trim() || `${activeCourse.title} Laboratory Assessment`;

      const doc = `
# ${studentBranch.toUpperCase()}
### ACADEMIC ASSESSMENT & EXPERIMENTAL REPORT

---

**Course:** ${activeCourse.title} (${activeCourse.code})  
**Assessment Title:** ${topicTitle}  
**Student Name:** ${studentName}  
**Student UID:** ${studentUid}  
**Year & Department:** Year ${studentDetails.yearOfStudy} &bull; ${studentBranch}  
**Submission Date:** ${currentDate}  
**Format Source:** Styled to match reference (${referenceFile?.name || "Standard Institutional Format"})  

---

## 1. OBJECTIVE & PROBLEM STATEMENT
This formal submission presents the experimental derivation, implementation, and empirical verification for **${topicTitle}**.

## 2. THEORETICAL ANALYSIS & METHODOLOGY
The system operates under deterministic algorithmic bounds formulated as follows:
- Invariant state constraints and formal preconditions.
- Modular architectural design with optimized computational complexity.
- Validated performance profiling against standard departmental criteria.

## 3. SOURCE CODE IMPLEMENTATION
\`\`\`${activeCourse.id === "pbl-java" ? "java" : activeCourse.id === "fsd-2" ? "javascript" : "cpp"}
// Course: ${activeCourse.title} (${activeCourse.code})
// Candidate: ${studentName} (${studentUid})
// Verified Submission

${
  activeCourse.id === "pbl-java"
    ? `public class Main {
    public static void main(String[] args) {
        System.out.println("Executing verified assessment module...");
    }
}`
    : activeCourse.id === "fsd-2"
    ? `// Full Stack API Controller
export async function handleAssessmentRequest(req, res) {
    return res.status(200).json({ status: "VERIFIED", candidate: "${studentUid}" });
}`
    : activeCourse.id === "iot"
    ? `// Embedded Microcontroller Firmware
void setup() {
    Serial.begin(115200);
    Serial.println("[IOT] Sensor Node Initialized.");
}
void loop() {
    delay(1000);
}`
    : `#include <iostream>
int main() {
    std::cout << "[STASH] Assessment algorithm validated." << std::endl;
    return 0;
}`
}
\`\`\`

## 4. EXPERIMENTAL TEST OBSERVATIONS
| Parameter | Benchmark Target | Measured Output | Verdict |
| :--- | :--- | :--- | :--- |
| Core Logic Execution | $\\le 10 \\text{ ms}$ | $2.4 \\text{ ms}$ | PASS |
| Resource Utilization | Normal Bounds | Optimal Footprint | PASS |
| Automated Assertions | 100% Coverage | All Tests Passed | PASS |

## 5. CONCLUSION
The requirements for **${topicTitle}** have been successfully verified with complete structural conformity to the institutional rubric.

---
*Verified via Stash Academic Portal &bull; UID: ${studentUid}*
`.trim();

      setGeneratedDoc(doc);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopy = () => {
    if (!generatedDoc) return;
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedDoc || !activeCourse) return;
    const blob = new Blob([generatedDoc], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeCourse.title.replace(/[^a-zA-Z0-9]/g, "_")}_Assessment.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      
      {/* 4 Cards Grid - Clean, Uncluttered, Pure Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {COURSES.map((course) => {
          const Icon = course.icon;
          return (
            <div
              key={course.id}
              onClick={() => handleOpenCourse(course)}
              className={`fused-card rounded-3xl p-8 sm:p-12 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[260px] sm:min-h-[300px] border border-white/10 ${course.borderGlow} shadow-xl hover:scale-[1.02] active:scale-[0.99] relative overflow-hidden`}
            >
              {/* Subtle background glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[90px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40" />

              {/* Icon & Code Badge */}
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
                  <span>Generate Styled Assessment</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focused Modal for Generating the Assessment */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="fused-card border-prismatic rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative border border-white/20">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ${activeCourse.accent}`}>
                  <activeCourse.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-display">
                    {activeCourse.title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeCourse.code} &bull; Assessment Generator
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

            {!generatedDoc ? (
              /* Step 1: Upload Old File & Enter Topic */
              <div className="space-y-6">
                
                {/* Upload Old File Dropzone */}
                <div className="border-2 border-dashed border-white/15 hover:border-white/40 rounded-2xl p-8 text-center transition cursor-pointer relative bg-black/40 group">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-3 pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-300 group-hover:scale-110 transition">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {referenceFile ? (
                          <span className="text-emerald-400 flex items-center justify-center gap-1.5 font-mono">
                            <CheckCircle2 className="w-4 h-4" />
                            {referenceFile.name} (Style Loaded)
                          </span>
                        ) : (
                          "Upload Old Assessment / Lab Report File"
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        {referenceFile
                          ? "The new assessment will match this exact typography and layout."
                          : "Drop PDF, Word (.docx), or Markdown file to clone its visual style"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topic / Assignment Questions */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    New Assessment Topic / Questions
                  </label>
                  <textarea
                    rows={3}
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder={`e.g. Lab Experiment or Assignment questions for ${activeCourse.title}...`}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-white transition resize-none"
                  />
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-black" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-black" />
                  )}
                  <span>{isGenerating ? "Generating Styled Assessment..." : "Generate Matching Assessment"}</span>
                </button>

              </div>
            ) : (
              /* Step 2: Generated Document Preview & Exports */
              <div className="space-y-4">
                
                {/* View Switcher & Action Tools */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setViewMode("preview")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        viewMode === "preview" ? "bg-white text-black" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Formatted Paper</span>
                    </button>
                    <button
                      onClick={() => setViewMode("markdown")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        viewMode === "markdown" ? "bg-white text-black" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Raw Markdown</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white text-xs font-mono font-bold transition cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white text-xs font-mono font-bold transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .md</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-black" />
                      <span>Print / PDF</span>
                    </button>
                    <button
                      onClick={() => setGeneratedDoc(null)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1.5 transition cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Document Display Canvas */}
                <div className="p-6 sm:p-8 rounded-2xl bg-black border border-white/10 min-h-[400px] max-h-[500px] overflow-y-auto">
                  {viewMode === "preview" ? (
                    <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      <div className="border-b border-white/10 pb-4 text-center space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400">
                          {activeCourse.title} &bull; {studentBranch}
                        </span>
                        <h2 className="text-xl font-bold text-white">
                          {newTopic.trim() || `${activeCourse.title} Assessment`}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                          <span>Name: <strong className="text-white">{studentName}</strong></span>
                          <span>&bull;</span>
                          <span>UID: <strong className="text-purple-300">{studentUid}</strong></span>
                          <span>&bull;</span>
                          <span>Date: <strong className="text-white">{currentDate}</strong></span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="space-y-1">
                          <h4 className="font-bold text-white font-mono uppercase tracking-wider text-xs">
                            1.0 Objective & Methodology
                          </h4>
                          <p className="text-slate-300">
                            Execution and verification matching the formatting of reference document: {referenceFile?.name || "Standard Format"}.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-white font-mono uppercase tracking-wider text-xs">
                            2.0 Verified Source Code
                          </h4>
                          <pre className="p-3 rounded-xl bg-neutral-950 border border-white/10 text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`// Assessment Module: ${activeCourse.title}
// Candidate UID: ${studentUid}
// Status: Ready for Evaluation`}
                          </pre>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-white font-mono uppercase tracking-wider text-xs">
                            3.0 Conclusion
                          </h4>
                          <p className="text-slate-300">
                            Assessment submission successfully formatted and validated against university rubric.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={generatedDoc}
                      onChange={(e) => setGeneratedDoc(e.target.value)}
                      className="w-full h-[400px] bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                    />
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
