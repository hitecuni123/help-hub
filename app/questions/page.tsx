// app/questions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  MessageSquare,
  Send,
  X,
  Plus,
  Clock,
} from "lucide-react";

type Answer = {
  id: string;
  body: string;
  author: string;
  votes: number;
  createdAt: number;
};

type Question = {
  id: string;
  title: string;
  body: string;
  category: string;
  author: string;
  votes: number;
  createdAt: number;
  answers: Answer[];
};

const CATEGORIES = [
  "Web Dev",
  "Career",
  "Design",
  "Productivity",
  "Architecture",
  "General",
];

const STORAGE_KEY = "helphub_questions";

const seedQuestions: Question[] = [
  {
    id: "q1",
    title: "How do I optimize a Next.js 14 app for Core Web Vitals?",
    body: "My LCP is sitting around 4.2s on mobile. I've already lazy-loaded most components but it's still slow. Any real-world tips?",
    category: "Web Dev",
    author: "Ahmed",
    votes: 12,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    answers: [
      {
        id: "a1",
        body: "Check your hero image — if it's not using next/image with priority, that's almost always the LCP culprit. Also defer any non-critical JS with dynamic imports.",
        author: "Sara K.",
        votes: 8,
        createdAt: Date.now() - 1000 * 60 * 60 * 4,
      },
    ],
  },
  {
    id: "q2",
    title: "Best way to structure a monorepo for 3 microservices?",
    body: "Starting a new project with a Next.js frontend and two Node services. Turborepo or Nx? Or just plain npm workspaces?",
    category: "Architecture",
    author: "Bilal R.",
    votes: 6,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    answers: [],
  },
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAskForm, setShowAskForm] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [hydrated, setHydrated] = useState(false);

  // Ask form state
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newAuthor, setNewAuthor] = useState("");

  // Answer draft per question
  const [answerDraft, setAnswerDraft] = useState<Record<string, string>>({});
  const [answerAuthor, setAnswerAuthor] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setQuestions(JSON.parse(stored));
      } catch {
        setQuestions(seedQuestions);
      }
    } else {
      setQuestions(seedQuestions);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    }
  }, [questions, hydrated]);

  function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const q: Question = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      body: newBody.trim(),
      category: newCategory,
      author: newAuthor.trim() || "Anonymous",
      votes: 0,
      createdAt: Date.now(),
      answers: [],
    };

    setQuestions((prev) => [q, ...prev]);
    setNewTitle("");
    setNewBody("");
    setNewAuthor("");
    setShowAskForm(false);
    setOpenId(q.id);
  }

  function handleUpvoteQuestion(id: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))
    );
  }

  function handleUpvoteAnswer(qid: string, aid: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === aid ? { ...a, votes: a.votes + 1 } : a
              ),
            }
          : q
      )
    );
  }

  function handleSubmitAnswer(qid: string) {
    const body = (answerDraft[qid] || "").trim();
    if (!body) return;

    const answer: Answer = {
      id: crypto.randomUUID(),
      body,
      author: answerAuthor.trim() || "Anonymous",
      votes: 0,
      createdAt: Date.now(),
    };

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, answers: [...q.answers, answer] } : q
      )
    );
    setAnswerDraft((prev) => ({ ...prev, [qid]: "" }));
  }

  const filtered =
    filter === "All" ? questions : questions.filter((q) => q.category === filter);

  const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <main className="relative min-h-screen px-6 pt-32 pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Questions
          </h1>
          <p className="mt-2 text-white/50">
            Ask anything. Answer anything. Built by the community.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAskForm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-gradient-to-r bg-orange-500   transition-shadow self-start"
        >
          <Plus className="h-4 w-4" /> Ask a Question
        </motion.button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm border transition-colors ${
              filter === cat
                ? "bg-gradient-to-r from-orange-500/20 to-orange-500/20 border-orange-400/40 text-white"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ask form modal */}
      <AnimatePresence>
        {showAskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
            onClick={() => setShowAskForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0c12] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">Ask a Question</h2>
                <button
                  onClick={() => setShowAskForm(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAsk} className="space-y-4">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's your question?"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                />
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Add more details..."
                  required
                  rows={4}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors resize-none"
                />
                <div className="flex gap-3">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-orange-400/50 transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0c0c12]">
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Your name (optional)"
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-medium bg-gradient-to-r bg-orange-500  transition-shadow"
                >
                  Post Question
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions list */}
      {!hydrated ? (
        <div className="text-white/30 text-sm">Loading...</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          No questions in this category yet. Be the first to ask!
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((q) => {
            const isOpen = openId === q.id;
            return (
              <motion.div
                key={q.id}
                layout
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
              >
                {/* Question header */}
                <div className="p-6 flex gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button
                      onClick={() => handleUpvoteQuestion(q.id)}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-orange-300 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-white/80">
                      {q.votes}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setOpenId(isOpen ? null : q.id)}
                  >
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-500/20 border border-white/10 text-white/70">
                        {q.category}
                      </span>
                      <span className="text-xs text-white/30 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {timeAgo(q.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1 hover:text-orange-300 transition-colors">
                      {q.title}
                    </h3>
                    <p className="text-sm text-white/50 line-clamp-2">
                      {q.body}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                      <span>Asked by {q.author}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />{" "}
                        {q.answers.length} answers
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded answers */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="border-t border-white/10 bg-white/[0.02]"
                    >
                      <div className="p-6 space-y-4">
                        {q.answers.length === 0 && (
                          <p className="text-sm text-white/30 italic">
                            No answers yet — be the first to help!
                          </p>
                        )}

                        {[...q.answers]
                          .sort((a, b) => b.votes - a.votes)
                          .map((a) => (
                            <div
                              key={a.id}
                              className="flex gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-4"
                            >
                              <div className="flex flex-col items-center gap-1 pt-0.5">
                                <button
                                  onClick={() =>
                                    handleUpvoteAnswer(q.id, a.id)
                                  }
                                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-orange-300 transition-colors"
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <span className="text-xs text-white/60">
                                  {a.votes}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-white/80 leading-relaxed">
                                  {a.body}
                                </p>
                                <div className="mt-2 text-xs text-white/30">
                                  {a.author} · {timeAgo(a.createdAt)}
                                </div>
                              </div>
                            </div>
                          ))}

                        {/* Answer composer */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                          <input
                            value={answerAuthor}
                            onChange={(e) => setAnswerAuthor(e.target.value)}
                            placeholder="Your name"
                            className="sm:w-40 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                          />
                          <input
                            value={answerDraft[q.id] || ""}
                            onChange={(e) =>
                              setAnswerDraft((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSubmitAnswer(q.id);
                            }}
                            placeholder="Write your answer..."
                            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                          />
                          <button
                            onClick={() => handleSubmitAnswer(q.id)}
                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r bg-orange-500  transition-shadow"
                          >
                            <Send className="h-3.5 w-3.5" /> Reply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}






