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
  FileArchive,
  Image as ImageIcon,
  Sparkles,
  User,
  Layers,
  LayoutGrid,
  ListFilter,
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  courseCode: string;
  fileType: string;
  fileSize: string;
  uploaderName: string;
  uploaderEmail?: string;
  fileUrl: string;
  createdAt: string;
}

export function FileVaultClient({ currentUser }: { currentUser: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedContributor, setSelectedContributor] = useState("All");
  const [viewMode, setViewMode] = useState<"grouped" | "grid">("grouped");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCourse, setUploadCourse] = useState("CS 301");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Dynamic resources list (uses authenticated user data)
  const activeUserName = currentUser?.name || currentUser?.email?.split("@")[0] || "Student Contributor";

  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: "1",
      title: "Data Structures & Algorithms - Complete AVL Tree Lecture Slides.pdf",
      courseCode: "CS 301",
      fileType: "pdf",
      fileSize: "4.8 MB",
      uploaderName: activeUserName,
      uploaderEmail: currentUser?.email,
      fileUrl: "#",
      createdAt: "2 hours ago",
    },
    {
      id: "2",
      title: "Graph Theory & Shortest Path Algorithms (Dijkstra vs A*).pdf",
      courseCode: "CS 301",
      fileType: "pdf",
      fileSize: "3.1 MB",
      uploaderName: activeUserName,
      uploaderEmail: currentUser?.email,
      fileUrl: "#",
      createdAt: "Yesterday",
    },
    {
      id: "3",
      title: "Database ER-Diagram & Relational Normalization Guide.docx",
      courseCode: "CS 305",
      fileType: "docx",
      fileSize: "1.8 MB",
      uploaderName: "Peer Contributor",
      fileUrl: "#",
      createdAt: "3 hours ago",
    },
    {
      id: "4",
      title: "SQL Query Performance Optimization & B-Tree Indexing.pdf",
      courseCode: "CS 305",
      fileType: "pdf",
      fileSize: "2.6 MB",
      uploaderName: "Peer Contributor",
      fileUrl: "#",
      createdAt: "1 day ago",
    },
    {
      id: "5",
      title: "Linear Algebra Eigenvectors & Matrix Diagonalization Proofs.pdf",
      courseCode: "MATH 202",
      fileType: "pdf",
      fileSize: "2.4 MB",
      uploaderName: activeUserName,
      uploaderEmail: currentUser?.email,
      fileUrl: "#",
      createdAt: "3 days ago",
    },
    {
      id: "6",
      title: "Computer Networks Packet Tracer Lab Setup & Wireshark Logs.zip",
      courseCode: "CS 310",
      fileType: "zip",
      fileSize: "12.5 MB",
      uploaderName: "Peer Contributor",
      fileUrl: "#",
      createdAt: "4 days ago",
    },
  ]);

  const courses = ["All", "CS 301", "CS 305", "MATH 202", "CS 310"];

  // Dynamically compute unique contributors from active data
  const contributors = ["All", ...Array.from(new Set(resources.map((r) => r.uploaderName)))];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() && !selectedFile) return;

    const fileTitle = uploadTitle.trim() || selectedFile?.name || "Untitled Resource.pdf";
    const fileExt = selectedFile?.name.split(".").pop() || "pdf";
    const fileSizeStr = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : "2.5 MB";

    const newResource: ResourceItem = {
      id: Date.now().toString(),
      title: fileTitle,
      courseCode: uploadCourse,
      fileType: fileExt,
      fileSize: fileSizeStr,
      uploaderName: activeUserName,
      uploaderEmail: currentUser?.email,
      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : "#",
      createdAt: "Just now",
    };

    setResources([newResource, ...resources]);
    setUploadTitle("");
    setSelectedFile(null);
    setIsUploadOpen(false);
  };

  const handleCopyShareLink = (id: string) => {
    const shareUrl = `${window.location.origin}/vault/share/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-white" />;
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-white" />;
      case "zip":
      case "rar":
        return <FileArchive className="w-5 h-5 text-white" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <ImageIcon className="w-5 h-5 text-white" />;
      default:
        return <FileCode className="w-5 h-5 text-white" />;
    }
  };

  // Filter resources dynamically
  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uploaderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === "All" || item.courseCode === selectedCourse;
    const matchesContributor =
      selectedContributor === "All" || item.uploaderName === selectedContributor;
    return matchesSearch && matchesCourse && matchesContributor;
  });

  // Group filtered resources dynamically by uploader
  const groupedByUploader: { [uploaderName: string]: ResourceItem[] } = {};
  filteredResources.forEach((item) => {
    if (!groupedByUploader[item.uploaderName]) {
      groupedByUploader[item.uploaderName] = [];
    }
    groupedByUploader[item.uploaderName].push(item);
  });

  return (
    <div className="space-y-10">
      
      {/* Top Banner with Unified Single Upload Spot */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Centralized Academic Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
            Subject Resources & Contributor Vault
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Upload files in one central spot and browse resources categorized dynamically by student contributors inside each subject.
          </p>
        </div>

        {/* Unified Single Upload Button */}
        <button
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm transition shadow-md cursor-pointer"
        >
          <UploadCloud className="w-5 h-5 text-black" />
          <span>Upload File Here</span>
        </button>
      </div>

      {/* Unified Single Upload Form Card */}
      {isUploadOpen && (
        <form
          onSubmit={handleUploadSubmit}
          className="bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-white" />
              <h3 className="text-lg font-bold text-white font-display">
                Upload Hub &bull; Uploading as <span className="underline">{activeUserName}</span>
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="text-xs font-mono text-neutral-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-300">
                Resource Title
              </label>
              <input
                type="text"
                placeholder="e.g. CS 301 AVL Trees & Graph Algorithms Notes"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-300">
                Subject / Course
              </label>
              <select
                value={uploadCourse}
                onChange={(e) => setUploadCourse(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="CS 301">CS 301 - Data Structures</option>
                <option value="CS 305">CS 305 - Databases</option>
                <option value="MATH 202">MATH 202 - Linear Algebra</option>
                <option value="CS 310">CS 310 - Networks</option>
              </select>
            </div>
          </div>

          {/* File Selector Dropzone */}
          <div className="border-2 border-dashed border-neutral-800 rounded-2xl p-6 text-center hover:border-neutral-600 transition bg-black">
            <input
              type="file"
              id="unified-file-input"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="unified-file-input" className="cursor-pointer space-y-2 block">
              <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto" />
              <p className="text-sm font-bold text-white">
                {selectedFile ? selectedFile.name : "Click or drag & drop PDF, DOCX, ZIP, or Slides"}
              </p>
              <p className="text-xs text-neutral-500 font-mono">
                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Max file size: 50MB"}
              </p>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md"
            >
              Upload to Vault &rarr;
            </button>
          </div>
        </form>
      )}

      {/* Filter Controls: Subject, Contributor, & View Mode Switcher */}
      <div className="space-y-4 bg-neutral-950 border border-neutral-800 p-5 rounded-3xl">
        
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name, uploader name, or course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-neutral-800/80">
          
          {/* Subject Filter Pills */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-white" /> Subject:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {courses.map((course) => (
                <button
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    selectedCourse === course
                      ? "bg-white text-black"
                      : "bg-black text-neutral-400 hover:text-white border border-neutral-800"
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Contributor Filter Pills */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
              <User className="w-3 h-3 text-white" /> Contributor:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {contributors.map((contrib) => (
                <button
                  key={contrib}
                  onClick={() => setSelectedContributor(contrib)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    selectedContributor === contrib
                      ? "bg-white text-black"
                      : "bg-black text-neutral-400 hover:text-white border border-neutral-800"
                  }`}
                >
                  {contrib}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
              View Layout:
            </span>
            <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setViewMode("grouped")}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === "grouped" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
                }`}
                title="Group by Contributor"
              >
                <ListFilter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
                }`}
                title="Flat Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Main Display: Grouped by Contributor or Flat Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-neutral-950 border border-neutral-800 rounded-3xl space-y-3">
          <FileText className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-neutral-300">No resources found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your subject or contributor filter.
          </p>
        </div>
      ) : viewMode === "grouped" ? (
        <div className="space-y-10">
          {Object.entries(groupedByUploader).map(([uploaderName, userResources]) => (
            <div
              key={uploaderName}
              className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-5"
            >
              {/* Dynamic Contributor Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-sm shadow-sm">
                    {uploaderName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                      Content by {uploaderName}
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">
                      {userResources.length} {userResources.length === 1 ? "resource" : "resources"} uploaded
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest border border-neutral-800 px-3 py-1 rounded-full">
                  Student Contributor
                </span>
              </div>

              {/* Resource Cards Grid for this Contributor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userResources.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black border border-neutral-800 hover:border-white rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 shrink-0">
                          {getFileIcon(item.fileType)}
                        </div>
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-neutral-900 text-white border border-neutral-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                            {item.courseCode}
                          </span>
                          <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span>{item.fileSize}</span>
                        <span>&bull;</span>
                        <span>{item.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyShareLink(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition border border-neutral-700 cursor-pointer"
                          title="Copy Share Link"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-white" />
                              <span>Share</span>
                            </>
                          )}
                        </button>

                        <a
                          href={item.fileUrl}
                          download={item.title}
                          className="p-1.5 rounded-lg bg-white text-black transition hover:bg-neutral-200"
                          title="Download File"
                        >
                          <Download className="w-4 h-4 text-black" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat Grid View Option */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-950 border border-neutral-800 hover:border-white rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-black border border-neutral-700 shrink-0">
                    {getFileIcon(item.fileType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-neutral-900 text-white border border-neutral-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {item.courseCode}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        Uploaded by {item.uploaderName}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>{item.fileSize}</span>
                  <span>&bull;</span>
                  <span>{item.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyShareLink(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition border border-neutral-700 cursor-pointer"
                    title="Copy Share Link"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-white" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.fileUrl}
                    download={item.title}
                    className="p-1.5 rounded-lg bg-white text-black transition hover:bg-neutral-200"
                    title="Download File"
                  >
                    <Download className="w-4 h-4 text-black" />
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
