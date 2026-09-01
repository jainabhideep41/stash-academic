"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  Search,
  Share2,
  Download,
  Check,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  Plus,
  Sparkles,
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  courseCode: string;
  fileType: string;
  fileSize: string;
  uploaderName: string;
  fileUrl: string;
  createdAt: string;
}

export function FileVaultClient({ currentUser }: { currentUser: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock initial items for smooth demo (connected to Supabase/Prisma)
  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: "1",
      title: "Data Structures & Algorithms - Complete Lecture Slides.pdf",
      courseCode: "CS 301",
      fileType: "pdf",
      fileSize: "4.8 MB",
      uploaderName: currentUser?.name || "Student",
      fileUrl: "#",
      createdAt: "2 hours ago",
    },
    {
      id: "2",
      title: "Database ER-Diagram & SQL Practice Problems.docx",
      courseCode: "CS 305",
      fileType: "docx",
      fileSize: "1.2 MB",
      uploaderName: "Alex Rivera",
      fileUrl: "#",
      createdAt: "Yesterday",
    },
    {
      id: "3",
      title: "Linear Algebra Midterm Formula Sheet & Proofs.pdf",
      courseCode: "MATH 202",
      fileType: "pdf",
      fileSize: "2.4 MB",
      uploaderName: currentUser?.name || "Student",
      fileUrl: "#",
      createdAt: "3 days ago",
    },
    {
      id: "4",
      title: "Computer Networks Packet Tracer Lab Manual.zip",
      courseCode: "CS 310",
      fileType: "zip",
      fileSize: "12.5 MB",
      uploaderName: "Sarah Chen",
      fileUrl: "#",
      createdAt: "5 days ago",
    },
  ]);

  const courses = ["All", "CS 301", "CS 305", "MATH 202", "CS 310"];

  const handleCopyShareLink = (id: string, title: string) => {
    const shareUrl = `${window.location.origin}/vault/share/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="w-6 h-6 text-rose-400" />;
      case "docx":
      case "doc":
        return <FileText className="w-6 h-6 text-blue-400" />;
      case "zip":
      case "rar":
        return <FileArchive className="w-6 h-6 text-amber-400" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <ImageIcon className="w-6 h-6 text-emerald-400" />;
      default:
        return <FileCode className="w-6 h-6 text-indigo-400" />;
    }
  };

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "All" || item.courseCode === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Fast Academic Storage & File Sharing
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Academic File Vault
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Store, preview, and instantly share course slides, question papers, and lab manuals.
          </p>
        </div>

        {/* Upload Action Button */}
        <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/25">
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const newResource: ResourceItem = {
                  id: Date.now().toString(),
                  title: file.name,
                  courseCode: selectedCourse === "All" ? "CS 301" : selectedCourse,
                  fileType: file.name.split(".").pop() || "file",
                  fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                  uploaderName: currentUser?.name || "Student",
                  fileUrl: URL.createObjectURL(file),
                  createdAt: "Just now",
                };
                setResources([newResource, ...resources]);
              }
            }}
          />
        </label>
      </div>

      {/* Search & Course Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Course Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {courses.map((course) => (
            <button
              key={course}
              onClick={() => setSelectedCourse(course)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCourse === course
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {course}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Files Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No files found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or upload a new course resource.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0">
                    {getFileIcon(item.fileType)}
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {item.courseCode}
                    </span>
                    <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-indigo-300 transition">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>{item.fileSize}</span>
                  <span>&bull;</span>
                  <span>{item.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyShareLink(item.id, item.title)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 cursor-pointer"
                    title="Copy Share Link"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.fileUrl}
                    download={item.title}
                    className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
