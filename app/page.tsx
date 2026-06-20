// app/page.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import {
  MessageCircleQuestion,
  Sparkles,
  Trophy,
  HeartHandshake,
  ArrowUpRight,
  ArrowRight,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import Blobs from "@/components/Blobs";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: MessageCircleQuestion,
    title: "Ask Questions",
    desc: "Post anything you're stuck on. Our community jumps in fast, with real, thoughtful answers.",
    gradient: "bg-orange-500",
  },
  {
    icon: Sparkles,
    title: "Get Answers",
    desc: "Receive clear, vetted solutions from people who've solved the exact same problem.",
    gradient: "from-orange-500 to-pink-400",
  },
  {
    icon: Trophy,
    title: "Build Reputation",
    desc: "Earn points, badges, and recognition every time you contribute something valuable.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: HeartHandshake,
    title: "Help Others",
    desc: "Pay it forward. Share your expertise and become the person others rely on.",
    gradient: "from-emerald-400 to-teal-400",
  },
];

const questions = [
  {
    title: "How do I optimize a Next.js 14 app for Core Web Vitals?",
    category: "Web Dev",
    upvotes: 128,
    answers: 14,
  },
  {
    title: "Best way to structure a monorepo for 3 microservices?",
    category: "Architecture",
    upvotes: 96,
    answers: 9,
  },
  {
    title: "How to negotiate a remote job offer as a junior dev?",
    category: "Career",
    upvotes: 211,
    answers: 22,
  },
  {
    title: "What's the cleanest way to manage global state in 2026?",
    category: "Frontend",
    upvotes: 154,
    answers: 18,
  },
  {
    title: "Tips for staying consistent with a side project?",
    category: "Productivity",
    upvotes: 77,
    answers: 11,
  },
  {
    title: "How do I price freelance design work fairly?",
    category: "Freelancing",
    upvotes: 89,
    answers: 7,
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};
export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      {/* HERO */}
     <section
  id="home"
  // FIX: pt-32 (mobile) aur md:pt-40 (desktop) kiya, and px-6 on mobile taake space bache
  className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 pt-32 md:pt-40 pb-24 text-center overflow-hidden"
>
  <Blobs />
  <div className="absolute inset-0 -z-20">
    <Image
      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&fit=crop"
      alt="People collaborating"
      fill
      className="object-cover opacity-40"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#06060a]/70 via-[#06060a]/50 to-[#06060a]" />
  </div>

  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
  >
    {/* Badge size mobile pe thora sleek kiya */}
    <motion.div
      variants={item}
      className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs md:text-sm text-white/80 mb-6 md:mb-8 shadow-inner"
    >
      <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-400" />
      Join 50,000+ problem solvers worldwide
    </motion.div>

    {/* FIX: text-4xl ya text-5xl mobile ke liye best hai, desktop par text-8xl hi rahega */}
    <motion.h1
      variants={item}
      className="text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tight leading-[1.1] md:leading-[1.02]"
    >
      <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
        Ask. Solve. Help.
      </span>
      <br />
      <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
        Grow Together.
      </span>
    </motion.h1>

    {/* FIX: text-base/text-lg on mobile, md:text-2xl on desktop */}
    <motion.p
      variants={item}
      className="mt-6 md:mt-8 text-base sm:text-lg md:text-2xl text-white/70 max-w-2xl md:max-w-3xl mx-auto font-medium tracking-wide leading-relaxed"
    >
      A community where real people solve real problems in real time.
    </motion.p>

    {/* Buttons section margin adjustment */}
    <motion.div
      variants={item}
      className="mt-10 md:mt-12 flex items-center justify-center w-full"
    >
      <Link href="/questions" passHref legacyBehavior>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          // FIX: Padding and font adjusted for mobile compatibility
          className="group relative px-8 py-3.5 md:px-10 md:py-4 rounded-full text-base md:text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-400 shadow-xl transition-all duration-300 text-white cursor-pointer"
        >
          <span className="flex items-center gap-3">
            Ask a Question
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
          </span>
        </motion.button>
      </Link>
    </motion.div>
  </motion.div>

  {/* Bottom Scroll Indicator Icon */}
  <motion.div
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/40"
  >
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5v14m0 0l-6-6m6 6l6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.div>
</section>
      {/* FEATURES */}
      <section id="categories" className="relative px-6 py-24 max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="bg-orange-500 bg-clip-text text-transparent">
              level up
            </span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            One platform. Endless ways to learn, share, and grow with people
            who get it.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden hover:border-white/20 transition-colors"
              >
                <div
                  className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-0 transition-opacity duration-500`}
                />
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} grid place-items-center mb-5 shadow-lg`}
                >
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* RECENT QUESTIONS */}
      <section id="questions" className="relative px-6 py-24 max-w-7xl mx-auto">
        <ScrollReveal className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Fresh from the community
            </h2>
            <p className="mt-3 text-white/50">
              Real questions, real answers, happening right now.
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-orange-300 hover:text-orange-200 transition-colors">
            View all questions <ArrowUpRight className="h-4 w-4" />
          </button>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {questions.map((q, i) => (
            <ScrollReveal key={q.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-orange-400/30   transition-all cursor-pointer"
              >
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-500/20 border border-white/10 text-white/70 mb-4">
                  {q.category}
                </span>
                <h3 className="text-base font-medium leading-snug mb-6 text-white/90">
                  {q.title}
                </h3>
                <div className="flex items-center gap-5 text-sm text-white/40">
                  <span className="flex items-center gap-1.5">
                    <ThumbsUp className="h-4 w-4" /> {q.upvotes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" /> {q.answers} answers
                  </span>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="relative px-6 py-28">
        <ScrollReveal className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 px-8 py-16 md:py-24 text-center bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-xl">
            <div className="absolute inset-0 " />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Join Help Hub Today
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10">
                Become part of a growing community of curious minds and
                generous helpers. Your next breakthrough is one question away.
              </p>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-4 rounded-full font-semibold bg-gradient-to-r bg-orange-500   transition-shadow"
              >
                Get Started — It's Free
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        <footer className="mt-24 text-center text-white/30 text-sm">
          © 2026 Help Hub. Built by the community, for the community.
        </footer>
      </section>
    </main>
  );
}









