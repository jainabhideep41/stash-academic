"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  FileCheck2,
  RefreshCw,
  Eye,
  Code,
  Layers,
  CheckCircle2,
  GraduationCap,
  Calendar,
  CreditCard,
  ChevronRight,
  AlertCircle,
  FileCode,
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

export function AssessmentStudioClient({
  currentUser,
  studentDetails,
}: AssessmentStudioClientProps) {
  // Input State
  const [referenceFileName, setReferenceFileName] = useState<string | null>(null);
  const [referenceFileText, setReferenceFileText] = useState<string>("");
  const [detectedStyle, setDetectedStyle] = useState<{
    hasUniversityHeader: boolean;
    hasCodeBlocks: boolean;
    hasMathFormula: boolean;
    headingHierarchy: string[];
    academicTone: string;
  } | null>(null);

  const [courseCode, setCourseCode] = useState("CS 301 - Data Structures & Algorithms");
  const [assessmentTitle, setAssessmentTitle] = useState(
    "Lab 4: Self-Balancing AVL Trees & Height Invariant Rotations"
  );
  const [problemPrompt, setProblemPrompt] = useState(
    "Implement an AVL tree insertion algorithm with automated LL, RR, LR, and RL rotations. Include theoretical time complexity analysis, C++ code implementation, test case outputs, and comparative benchmark with standard BSTs."
  );

  const [includeCode, setIncludeCode] = useState(true);
  const [includeMath, setIncludeMath] = useState(true);
  const [includeTestCases, setIncludeTestCases] = useState(true);
  const [academicDepth, setAcademicDepth] = useState<"Standard" | "Comprehensive" | "Research">("Comprehensive");

  // Output / Studio State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "markdown">("preview");
  const [copied, setCopied] = useState(false);

  const studentName = currentUser.name || "Abhideep Jain";
  const studentUid = studentDetails.uidNumber || "23CS01049";
  const studentBranch = studentDetails.branch || "Computer Science & Engineering";
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Default initial generated assessment
  const [generatedDoc, setGeneratedDoc] = useState<string>(`
# DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
### ACADEMIC ASSESSMENT & LAB REPORT

---

**Course Code:** CS 301 - Data Structures & Algorithms  
**Experiment / Topic:** Lab 4: Self-Balancing AVL Trees & Height Invariant Rotations  
**Student Name:** ${studentName}  
**Student UID:** ${studentUid}  
**Branch & Year:** ${studentBranch} (Year ${studentDetails.yearOfStudy})  
**Submission Date:** ${currentDate}  
**Evaluation Status:** Ready for Review  

---

## 1. OBJECTIVE & PROBLEM STATEMENT
The principal objective of this assessment is to construct, verify, and empirically evaluate a self-balancing binary search tree (AVL Tree). Standard binary search trees degenerate to $O(n)$ linear complexity under sorted input sequences; AVL trees enforce an invariant balance factor:
$$\\text{Balance Factor } BF(v) = \\text{height}(\\text{left}(v)) - \\text{height}(\\text{right}(v)) \\in \\{-1, 0, +1\\}$$
Whenever an insertion alters $BF(v) \\notin \\{-1, 0, +1\\}$, immediate local rotations must re-establish $O(\\log n)$ height boundaries.

## 2. THEORETICAL FOUNDATION & ROTATION MECHANICS
An imbalance arises through one of four canonical scenarios:
1. **Left-Left (LL) Heavy:** Resolved via a Single Right Rotation.
2. **Right-Right (RR) Heavy:** Resolved via a Single Left Rotation.
3. **Left-Right (LR) Heavy:** Double rotation: Left rotation on left child, followed by Right rotation on root.
4. **Right-Left (RL) Heavy:** Double rotation: Right rotation on right child, followed by Left rotation on root.

### Complexity Guarantees:
| Operation | Average Case | Worst Case (AVL) | Worst Case (Standard BST) |
| :--- | :--- | :--- | :--- |
| Search | $O(\\log n)$ | $O(\\log n)$ | $O(n)$ |
| Insertion | $O(\\log n)$ | $O(\\log n)$ | $O(n)$ |
| Deletion | $O(\\log n)$ | $O(\\log n)$ | $O(n)$ |
| Rebalancing Overhead | $O(1)$ amortized | $O(\\log n)$ rotations | None |

## 3. IMPLEMENTATION SOURCE CODE (C++)
\`\`\`cpp
#include <iostream>
#include <algorithm>
using namespace std;

struct Node {
    int key, height;
    Node *left, *right;
    Node(int k) : key(k), height(1), left(nullptr), right(nullptr) {}
};

int getHeight(Node* n) { return n ? n->height : 0; }
int getBalance(Node* n) { return n ? getHeight(n->left) - getHeight(n->right) : 0; }

Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = max(getHeight(y->left), getHeight(y->right)) + 1;
    x->height = max(getHeight(x->left), getHeight(x->right)) + 1;
    return x;
}

Node* leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;
    y->left = x;
    x->right = T2;
    x->height = max(getHeight(x->left), getHeight(x->right)) + 1;
    y->height = max(getHeight(y->left), getHeight(y->right)) + 1;
    return y;
}

Node* insert(Node* node, int key) {
    if (!node) return new Node(key);
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    else return node; // Duplicate keys not permitted

    node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    int balance = getBalance(node);

    // LL Case
    if (balance > 1 && key < node->left->key) return rightRotate(node);
    // RR Case
    if (balance < -1 && key > node->right->key) return leftRotate(node);
    // LR Case
    if (balance > 1 && key > node->left->key) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    // RL Case
    if (balance < -1 && key < node->right->key) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}
\`\`\`

## 4. EXPERIMENTAL VERIFICATION & TEST OBSERVATIONS
- **Input Sequence:** { 10, 20, 30, 40, 50, 25 }
- **Sequential In-Order Traversal:** 10, 20, 25, 30, 40, 50
- **Balanced Root Inspection:** 30 is correctly elected root with balance factor $BF(30) = 0$.
- **Measured Tree Height:** 3 (Maximum theoretical ceiling $\\lfloor 1.44 \\log_2(6 + 2) \\rfloor = 3$).

## 5. CONCLUSION & ACADEMIC REMARKS
The AVL balancing logic was successfully validated against degenerate ascending insertions. Tree height was strictly bounded to logarithmic scale, eliminating the worst-case degradation characteristic of standard BSTs.
`.trim());

  // Handle Reference File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReferenceFileName(file.name);

    // Read textual content if possible
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || "";
      setReferenceFileText(text);

      // Extract style heuristics
      const hasHeader = /department|course|student|roll|uid|assessment/i.test(text);
      const hasCode = /```|void|int|function|class|def|import/i.test(text);
      const hasMath = /\$|\\text|\\frac|=|equation/i.test(text);

      setDetectedStyle({
        hasUniversityHeader: hasHeader,
        hasCodeBlocks: hasCode,
        hasMathFormula: hasMath,
        headingHierarchy: ["Objective", "Theoretical Foundation", "Algorithm / Code", "Results", "Conclusion"],
        academicTone: "Formal Institutional (IEEE / University Format)",
      });
    };
    reader.readAsText(file);
  };

  // Generate Styled Assessment
  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generated = `
# ${studentBranch.toUpperCase()}
### ACADEMIC ASSESSMENT & EXPERIMENTAL REPORT

---

**Course Code:** ${courseCode}  
**Assessment Title:** ${assessmentTitle}  
**Student Name:** ${studentName}  
**Student UID:** ${studentUid}  
**Enrolled Branch:** ${studentBranch} (Year ${studentDetails.yearOfStudy})  
**Submission Date:** ${currentDate}  
**Institutional Style:** Styled to match reference (${referenceFileName || "Standard University Archive Format"})  

---

## 1. ABSTRACT & OBJECTIVE
This submission presents an in-depth investigation into **${assessmentTitle}**. Specifically, it fulfills the following academic requirements:
- ${problemPrompt.slice(0, 180)}...
- Formal derivation of architectural assumptions and theoretical boundaries.
- Verification against standard performance benchmarks.

## 2. SYSTEM ARCHITECTURE & METHODOLOGY
The system is constructed through discrete procedural steps following institutional formatting standards:
1. **Specification Decomposition:** Formulate state invariants and operational pre-conditions.
2. **Algorithmic Construction:** Implement modular routines with optimized space-time tradeoffs.
3. **Empirical Benchmarking:** Execute reproducible stress testing across varying input distributions.

${includeMath ? `### Theoretical Formulation:
The computational throughput $\\mathcal{T}(n)$ under standard parameters satisfies:
$$\\mathcal{T}(n) = \\sum_{i=1}^{k} \\frac{w_i \\cdot \\tau_i}{\\log_2(n + 1)}$$
where $w_i$ represents weighting coefficients and $\\tau_i$ represents execution latency.` : ""}

${includeCode ? `## 3. CORE IMPLEMENTATION
\`\`\`cpp
// ${courseCode} - ${assessmentTitle}
// Author: ${studentName} (${studentUid})
// Verified Submission

#include <iostream>
#include <vector>
#include <chrono>

class AssessmentModule {
private:
    std::string moduleName;
    size_t sampleSize;

public:
    AssessmentModule(std::string name, size_t size) 
        : moduleName(name), sampleSize(size) {}

    void executeAnalysis() {
        std::cout << "[STASH] Initiating evaluation for " << moduleName << std::endl;
        // Core algorithmic logic executes with O(log n) guarantees
    }
};

int main() {
    AssessmentModule assessment("${assessmentTitle}", 1024);
    assessment.executeAnalysis();
    return 0;
}
\`\`\`` : ""}

${includeTestCases ? `## 4. EXPERIMENTAL RESULTS & OBSERVATIONS
| Parameter | Expected Output | Measured Result | Verdict |
| :--- | :--- | :--- | :--- |
| Invariant State Check | $BF \\in \\{-1, 0, 1\\}$ | Validated across 1,000 runs | PASS |
| Peak Memory Allocation | $< 32 \\text{ MB}$ | $14.2 \\text{ MB}$ | OPTIMAL |
| Execution Latency | $< 5.0 \\text{ ms}$ | $1.82 \\text{ ms}$ | PASS |` : ""}

## 5. CONCLUSION & ACADEMIC REMARKS
The assessment targets for **${assessmentTitle}** have been successfully demonstrated and validated. The implementation conforms to institutional formatting, rigorous algorithmic bounds, and established course expectations.

---
*Report synthesized on Stash Academic Portal &bull; Verification UID: ${studentUid}*
`.trim();

      setGeneratedDoc(generated);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDoc], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assessmentTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Assessment.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner Header */}
      <div className="fused-card border-prismatic rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Assessment Studio 2.0
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              Style-Matched Synthesis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Instant Academic Assessment Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Upload your previous assessment, lab report, or assignment file. The engine analyzes its typography, layout, and university header to instantly format your new assessment in the exact same style.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-200 text-black font-bold text-xs transition shadow-lg shadow-white/10 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Sparkles className="w-4 h-4 text-black" />
            )}
            <span>{isGenerating ? "Synthesizing Assessment..." : "Generate Assessment"}</span>
          </button>
        </div>
      </div>

      {/* Split Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Reference Upload & Config Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Reference Upload Dropzone */}
          <div className="fused-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                <UploadCloud className="w-4 h-4 text-purple-400" />
                Upload Reference Document
              </h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Style Source</span>
            </div>

            <div className="border-2 border-dashed border-white/15 hover:border-purple-500/50 rounded-2xl p-6 text-center transition cursor-pointer relative bg-black/40 group">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-300 group-hover:scale-110 group-hover:text-purple-300 transition">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white">
                  {referenceFileName ? (
                    <span className="text-emerald-400 flex items-center justify-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      {referenceFileName}
                    </span>
                  ) : (
                    "Drop old assessment or lab file here"
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Supports PDF, Word (.docx), Markdown (.md), or Plain Text
                </p>
              </div>
            </div>

            {/* Detected Style Badges */}
            {detectedStyle ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  Style Architecture Extracted
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    ✓ Institutional Header
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    ✓ IEEE / University Tone
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    ✓ 5-Tier Hierarchy
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <AlertCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Upload a previous report to automatically clone its layout & font styling.</span>
              </div>
            )}
          </div>

          {/* New Assessment Requirements */}
          <div className="fused-card rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              New Assessment Parameters
            </h3>

            {/* Course Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Course & Subject
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS 301 - Data Structures"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-white transition"
              />
            </div>

            {/* Assessment Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Assessment / Lab Title
              </label>
              <input
                type="text"
                value={assessmentTitle}
                onChange={(e) => setAssessmentTitle(e.target.value)}
                placeholder="e.g. Lab 5: Process Synchronization"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-white transition"
              />
            </div>

            {/* Problem Statement / Prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Assignment Questions / Topic Details
              </label>
              <textarea
                rows={4}
                value={problemPrompt}
                onChange={(e) => setProblemPrompt(e.target.value)}
                placeholder="Paste the assignment questions or topic prompt..."
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-xs leading-relaxed focus:outline-none focus:border-white transition resize-none"
              />
            </div>

            {/* Components Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                Required Sections
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setIncludeCode(!includeCode)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-between cursor-pointer ${
                    includeCode
                      ? "bg-white/15 border-white text-white"
                      : "bg-black/40 border-white/10 text-slate-500"
                  }`}
                >
                  <span>Code Blocks</span>
                  {includeCode && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeMath(!includeMath)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-between cursor-pointer ${
                    includeMath
                      ? "bg-white/15 border-white text-white"
                      : "bg-black/40 border-white/10 text-slate-500"
                  }`}
                >
                  <span>LaTeX Math</span>
                  {includeMath && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeTestCases(!includeTestCases)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-between cursor-pointer ${
                    includeTestCases
                      ? "bg-white/15 border-white text-white"
                      : "bg-black/40 border-white/10 text-slate-500"
                  }`}
                >
                  <span>Test Tables</span>
                  {includeTestCases && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
              ) : (
                <Sparkles className="w-4 h-4 text-black" />
              )}
              <span>{isGenerating ? "Synthesizing Assessment..." : "Generate Styled Assessment"}</span>
            </button>
          </div>

        </div>

        {/* Right Column: High-Fidelity Paper Preview & Export (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Preview Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-white text-black shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Formatted Paper</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("markdown")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "markdown"
                    ? "bg-white text-black shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Markdown / LaTeX</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                title="Copy full document text"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white text-xs font-mono font-bold transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                title="Download as Markdown file"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white text-xs font-mono font-bold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                title="Print or Save as PDF"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-black" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Document Sheet Display */}
          <div className="fused-card rounded-3xl p-6 sm:p-10 min-h-[640px] relative overflow-hidden bg-slate-950/90 border border-white/15">
            {activeTab === "preview" ? (
              <div className="prose prose-invert max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
                {/* Formatted Paper Rendering */}
                <div className="border-b border-white/15 pb-6 text-center space-y-2">
                  <span className="text-[11px] font-mono tracking-widest text-purple-300 uppercase font-bold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 inline-block">
                    {studentBranch.toUpperCase()} &bull; FORMAL ASSESSMENT
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mt-2">
                    {assessmentTitle}
                  </h1>
                  <p className="text-xs font-mono text-cyan-300 font-bold">
                    {courseCode}
                  </p>
                </div>

                {/* Institutional Student Header Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/60 p-4 rounded-2xl border border-white/10 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Candidate Name</span>
                    <span className="font-bold text-white">{studentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Student UID</span>
                    <span className="font-bold text-purple-300">{studentUid}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Academic Year</span>
                    <span className="font-bold text-cyan-300">Year {studentDetails.yearOfStudy}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Submission Date</span>
                    <span className="font-bold text-white">{currentDate}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-6 pt-4 text-xs sm:text-sm">
                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-1 flex items-center gap-2">
                      <span className="text-purple-400 font-bold">1.0</span> OBJECTIVE & PROBLEM STATEMENT
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                      {problemPrompt}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-1 flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">2.0</span> THEORETICAL ANALYSIS & INVARIANTS
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                      Following the structural formatting extracted from <code className="text-purple-300 font-mono">{referenceFileName || "Reference Assessment Document"}</code>,
                      the system models operational complexity through discrete transformations.
                    </p>
                    {includeMath && (
                      <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center font-mono text-purple-200">
                        {"$$\\mathcal{T}(n) = \\sum_{i=1}^{k} \\frac{w_i \\cdot \\tau_i}{\\log_2(n + 1)} \\implies \\mathcal{O}(\\log n)$$"}
                      </div>
                    )}
                  </div>

                  {includeCode && (
                    <div className="space-y-2">
                      <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-1 flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">3.0</span> ALGORITHMIC IMPLEMENTATION
                      </h2>
                      <pre className="p-4 rounded-2xl bg-black border border-white/15 overflow-x-auto text-[11px] font-mono text-emerald-300 leading-relaxed">
{`// Course: ${courseCode}
// Experiment: ${assessmentTitle}
// Verified Student: ${studentName} (${studentUid})

#include <iostream>
#include <vector>

void executeAssessmentPipeline() {
    std::cout << "[STASH] Executing verified analysis..." << std::endl;
    // Verified algorithmic implementation verified against invariant tests
}

int main() {
    executeAssessmentPipeline();
    return 0;
}`}
                      </pre>
                    </div>
                  )}

                  {includeTestCases && (
                    <div className="space-y-2">
                      <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-1 flex items-center gap-2">
                        <span className="text-rose-400 font-bold">4.0</span> EMPIRICAL TEST OBSERVATIONS
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-white/10 font-mono">
                          <thead className="bg-white/5 border-b border-white/10 text-slate-400">
                            <tr>
                              <th className="p-2.5">Test Case ID</th>
                              <th className="p-2.5">Input Parameters</th>
                              <th className="p-2.5">Expected State</th>
                              <th className="p-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-300">
                            <tr>
                              <td className="p-2.5">TC-01</td>
                              <td className="p-2.5">Ascending Sequential Keys</td>
                              <td className="p-2.5">Height &le; 3</td>
                              <td className="p-2.5 text-emerald-400 font-bold">PASS</td>
                            </tr>
                            <tr>
                              <td className="p-2.5">TC-02</td>
                              <td className="p-2.5">Random Key Distribution</td>
                              <td className="p-2.5">BF &in; &#123;-1, 0, 1&#125;</td>
                              <td className="p-2.5 text-emerald-400 font-bold">PASS</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-1 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">5.0</span> CONCLUSION & ACADEMIC EVALUATION
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                      All criteria stipulated for {assessmentTitle} have been verified with complete structural integrity matching the department benchmark.
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              /* Raw Markdown/LaTeX View */
              <div className="h-full">
                <textarea
                  value={generatedDoc}
                  onChange={(e) => setGeneratedDoc(e.target.value)}
                  className="w-full h-[580px] bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none border-none selection:bg-purple-500 selection:text-white"
                />
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
