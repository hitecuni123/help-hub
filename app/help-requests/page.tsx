// app/help-requests/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Upload,
  X,
  Plus,
  Heart,
  Clock,
  BadgeCheck,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

type HelpRequest = {
  id: string;
  name: string;
  title: string;
  story: string;
  amountNeeded: number;
  amountRaised: number;
  category: string;
  verified: boolean; // becomes true only after backend/admin review
  createdAt: number;
  documentUploaded: boolean;
};

const STORAGE_KEY = "helphub_help_requests";

const seedRequests: HelpRequest[] = [
  {
    id: "r1",
    name: "Fatima Bibi",
    title: "Urgent surgery cost for my father",
    story:
      "My father needs an emergency heart surgery. We've already spent our savings on initial tests. Any help, big or small, means the world to us right now.",
    amountNeeded: 250000,
    amountRaised: 142000,
    category: "Medical",
    verified: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    documentUploaded: true,
  },
  {
    id: "r2",
    name: "Usman Ali",
    title: "Rebuilding after flood damage",
    story:
      "Our home was badly damaged in the recent floods. We're trying to raise enough to repair the roof before monsoon season hits again.",
    amountNeeded: 120000,
    amountRaised: 38000,
    category: "Disaster Relief",
    verified: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
    documentUploaded: true,
  },
  {
    id: "r3",
    name: "Pending Review",
    title: "Help with daughter's school fees",
    story:
      "Single father trying to keep my daughter in school after losing my job. Documents submitted, awaiting verification.",
    amountNeeded: 45000,
    amountRaised: 0,
    category: "Education",
    verified: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    documentUploaded: true,
  },
];

const CATEGORIES = ["Medical", "Education", "Disaster Relief", "Food & Shelter", "Other"];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatPKR(n: number) {
  return `PKR ${n.toLocaleString()}`;
}

export default function HelpRequestsPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [donateTarget, setDonateTarget] = useState<HelpRequest | null>(null);
  const [filter, setFilter] = useState<"All" | "Verified">("All");

  // form state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [cnic, setCnic] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // donate state
  const [donateAmount, setDonateAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [donateSuccess, setDonateSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch {
        setRequests(seedRequests);
      }
    } else {
      setRequests(seedRequests);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests, hydrated]);

  function resetForm() {
    setName("");
    setTitle("");
    setStory("");
    setAmount("");
    setCategory(CATEGORIES[0]);
    setCnic("");
    setDocFile(null);
    setSubmitted(false);
  }

  function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !story.trim() || !amount || !cnic.trim()) return;

    const req: HelpRequest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      title: title.trim(),
      story: story.trim(),
      amountNeeded: Number(amount),
      amountRaised: 0,
      category,
      verified: false, // always starts unverified — real review happens server-side
      createdAt: Date.now(),
      documentUploaded: !!docFile,
    };

    setRequests((prev) => [req, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      resetForm();
    }, 2000);
  }

  function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    if (!donateTarget || !donateAmount) return;

    // TODO: replace with real payment gateway integration (Stripe / JazzCash / Easypaisa)
    setRequests((prev) =>
      prev.map((r) =>
        r.id === donateTarget.id
          ? { ...r, amountRaised: r.amountRaised + Number(donateAmount) }
          : r
      )
    );
    setDonateSuccess(true);
    setTimeout(() => {
      setDonateTarget(null);
      setDonateSuccess(false);
      setDonateAmount("");
    }, 1800);
  }

  const filtered =
    filter === "Verified" ? requests.filter((r) => r.verified) : requests;
  const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <main className="relative min-h-screen px-6 pt-32 pb-24 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs text-white/70 mb-4">
            <Heart className="h-3.5 w-3.5 text-orange-400" />
            Real people. Real needs. Verified.
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Help Requests
          </h1>
          <p className="mt-2 text-white/50 max-w-lg">
            Every request goes through document verification before it's
            marked verified. Donate directly and securely.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500   transition-shadow self-start"
        >
          <Plus className="h-4 w-4" /> Request Help
        </motion.button>
      </div>

      {/* Trust banner */}
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 mb-8 text-sm text-white/50">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        Requests marked <span className="text-emerald-400 font-medium mx-1">Verified</span>
        have had their CNIC and supporting documents reviewed by our team.
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8">
        {(["All", "Verified"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              filter === f
                ? "bg-gradient-to-r from-orange-500/20 to-orange-500/20 border-orange-400/40 text-white"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* REQUEST FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 py-10 overflow-y-auto"
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0c12] p-6 shadow-2xl my-auto"
            >
              {submitted ? (
                <div className="text-center py-10">
                  <BadgeCheck className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Request Submitted
                  </h3>
                  <p className="text-sm text-white/50">
                    Our team will review your documents shortly. You'll be
                    marked verified once approved.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold">Request Help</h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitRequest} className="space-y-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                    />
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Short title (e.g. Urgent medical surgery)"
                      required
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                    />
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Explain your situation in detail..."
                      required
                      rows={4}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors resize-none"
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min={1}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount needed (PKR)"
                        required
                        className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors"
                      />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-orange-400/50 transition-colors"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-[#0c0c12]">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2 border-t border-white/10 mt-2">
                      <p className="text-xs text-white/40 mb-3 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Identity verification (kept private, reviewed by our team only)
                      </p>
                      <input
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                        placeholder="CNIC number (e.g. 12345-1234567-1)"
                        required
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors mb-3"
                      />

                      <label className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 px-4 py-3 cursor-pointer hover:border-white/30 transition-colors">
                        <Upload className="h-4 w-4 text-white/40" />
                        <span className="text-sm text-white/50 flex-1 truncate">
                          {docFile ? docFile.name : "Upload CNIC / supporting document"}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) =>
                            setDocFile(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-white/30 pt-1">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      Your documents are reviewed manually and never shown
                      publicly. Only your verification badge is visible to
                      others.
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500  transition-shadow mt-2"
                    >
                      Submit for Review
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DONATE MODAL */}
      <AnimatePresence>
        {donateTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
            onClick={() => {
              setDonateTarget(null);
              setDonateSuccess(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c12] p-6 shadow-2xl"
            >
              {donateSuccess ? (
                <div className="text-center py-10">
                  <Heart className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
                  <p className="text-sm text-white/50">
                    Your contribution has been added to {donateTarget.name}'s
                    request.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold">
                      Donate to {donateTarget.name}
                    </h2>
                    <button
                      onClick={() => setDonateTarget(null)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleDonate} className="space-y-4">
                    <input
                      type="number"
                      min={1}
                      value={donateAmount}
                      onChange={(e) => setDonateAmount(e.target.value)}
                      placeholder="Amount (PKR)"
                      required
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 transition-colors"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      {["Card", "JazzCash", "Easypaisa"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPaymentMethod(m)}
                          className={`py-2.5 rounded-xl text-sm border transition-colors ${
                            paymentMethod === m
                              ? "border-emerald-400/50 bg-emerald-400/10 text-white"
                              : "border-white/10 text-white/50 hover:text-white"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "Card" && (
                      <div className="space-y-2">
                        <input
                          placeholder="Card number"
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 transition-colors"
                        />
                        <div className="flex gap-2">
                          <input
                            placeholder="MM/YY"
                            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 transition-colors"
                          />
                          <input
                            placeholder="CVC"
                            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-teal-400  transition-shadow"
                    >
                      <CreditCard className="h-4 w-4" /> Donate Now
                    </button>
                    <p className="text-xs text-white/30 text-center">
                      Payments are simulated in this demo — connect a real
                      gateway before going live.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    {/* LIST */}
      {!hydrated ? (
        <div className="text-white/30 text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((r, i) => {
            const pct = Math.min(
              100,
              Math.round((r.amountRaised / r.amountNeeded) * 100)
            );
            return (
              <ScrollReveal key={r.id} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                      {r.category}
                    </span>
                    {r.verified ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <Clock className="h-3.5 w-3.5" /> Pending Review
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{r.title}</h3>
                  <p className="text-sm text-white/40 mb-3">by {r.name}</p>
                  <p className="text-sm text-white/60 leading-relaxed mb-5 line-clamp-3">
                    {r.story}
                  </p>

                  <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white font-medium">
                        {formatPKR(r.amountRaised)}
                      </span>
                      <span className="text-white/40">
                        of {formatPKR(r.amountNeeded)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                      />
                    </div>

                    {/* Fixed button className syntax below */}
                    <button
                      onClick={() => setDonateTarget(r)}
                      disabled={!r.verified}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-shadow ${
                        r.verified
                          ? "bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-white "
                          : "bg-white/5 text-white/30 cursor-not-allowed"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      {r.verified ? "Donate Now" : "Awaiting Verification"}
                    </button>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </main>
  );
}







