"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Share2,
  Check,
  Search,
  BookOpen,
  Sparkles,
  Edit3,
} from "lucide-react";

interface NoteItem {
  id: string;
  title: string;
  courseCode: string;
  content: string;
  createdAt: string;
}

export function NotesClient({ currentUser }: { currentUser: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("CS 301");
  const [newContent, setNewContent] = useState("");

  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: "n1",
      title: "Binary Search Trees & AVL Rotations Summary",
      courseCode: "CS 301",
      content:
        "AVL tree maintains O(log n) height by enforcing balance factor |hL - hR| <= 1. Single and double rotations handle LL, RR, LR, and RL imbalance cases.",
      createdAt: "3 hours ago",
    },
    {
      id: "n2",
      title: "SQL Joins & Indexing Cheat Sheet",
      courseCode: "CS 305",
      content:
        "B-Tree indexes speed up equality and range queries in SQL. INNER JOIN matches both tables; LEFT JOIN keeps all rows from the left table.",
      createdAt: "Yesterday",
    },
    {
      id: "n3",
      title: "Eigenvalues & Matrix Diagonalization",
      courseCode: "MATH 202",
      content:
        "Characteristic equation det(A - lambda*I) = 0 yields eigenvalues. Diagonalization A = P D P^(-1) holds when matrix A has n linearly independent eigenvectors.",
      createdAt: "4 days ago",
    },
  ]);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: NoteItem = {
      id: Date.now().toString(),
      title: newTitle,
      courseCode: newCourse,
      content: newContent,
      createdAt: "Just now",
    };

    setNotes([created, ...notes]);
    setNewTitle("");
    setNewContent("");
    setIsCreating(false);
  };

  const handleCopyShareLink = (id: string) => {
    const shareUrl = `${window.location.origin}/notes/share/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-mono uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Instant Academic Note Creation & Sharing
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">
            Academic Notes & Summaries
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Capture clean Markdown lecture notes and generate instant shareable links for classmates.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>New Note</span>
        </button>
      </div>

      {/* New Note Form Modal / Expandable Card */}
      {isCreating && (
        <form
          onSubmit={handleCreateNote}
          className="bg-neutral-950 border border-neutral-700 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <Edit3 className="w-5 h-5 text-white" />
              Create Academic Note
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Dynamic Programming Optimization Techniques"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">Course</label>
              <select
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="CS 301">CS 301</option>
                <option value="CS 305">CS 305</option>
                <option value="MATH 202">MATH 202</option>
                <option value="CS 310">CS 310</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-neutral-300 mb-1">
              Content (Markdown & Notes)
            </label>
            <textarea
              rows={4}
              placeholder="Write lecture notes, key formulas, or summary bullet points..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white font-mono"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search notes content or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-neutral-950 border border-neutral-800 hover:border-white rounded-2xl p-6 flex flex-col justify-between space-y-4 transition group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-neutral-900 text-white border border-neutral-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                  {note.courseCode}
                </span>
                <span className="text-xs text-neutral-500 font-mono">{note.createdAt}</span>
              </div>

              <h3 className="text-base font-bold text-white">
                {note.title}
              </h3>

              <p className="text-xs text-neutral-300 leading-relaxed font-normal bg-black p-3.5 rounded-xl border border-neutral-800 whitespace-pre-wrap font-mono">
                {note.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-white" />
                Public Note
              </span>

              <button
                onClick={() => handleCopyShareLink(note.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition border border-neutral-700 cursor-pointer"
              >
                {copiedId === note.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-white" />
                    <span>Share Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
