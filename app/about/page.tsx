// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Target,
  Users,
  Heart,
  Globe2,
  Sparkles,
  MessageCircleQuestion,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import Blobs from "@/components/Blobs";

const stats = [
  { label: "Active Members", value: "50K+" },
  { label: "Questions Answered", value: "180K+" },
  { label: "Countries", value: "90+" },
  { label: "Avg. Response Time", value: "12 min" },
];

const values = [
  {
    icon: Heart,
    title: "Genuine Help",
    desc: "No gatekeeping, no condescension. Just real people helping real people solve real problems.",
    gradient: "from-orange-500 to-pink-500",
  },
  {
    icon: Globe2,
    title: "Open to Everyone",
    desc: "Whether you're a beginner or an expert, your question and your answer both matter here.",
    gradient: "bg-orange-500",
  },
  {
    icon: Sparkles,
    title: "Quality Over Noise",
    desc: "Our reputation system surfaces the best answers — not the loudest or the first.",
    gradient: "from-orange-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Built Together",
    desc: "Every feature on Help Hub exists because the community asked for it.",
    gradient: "from-amber-400 to-orange-500",
  },
];

const team = [
  {
    name: "Ahmed Nadeem",
    role: "Founder & Lead Engineer",
    img: "/images/team.webp",
  },
];
export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
        <Blobs />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs text-white/70 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            We believe{" "}
            <span className="bg-gradient-to-r bg-orange-500 bg-clip-text text-transparent">
              every question
            </span>{" "}
            deserves a real answer.
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto">
            Help Hub started as a simple idea: people are more willing to help
            strangers than we give them credit for. We just built the place
            for it to happen.
          </p>
        </motion.div>
      </section>

      {/* WHO WE ARE */}
      <section className="relative px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=3840&q=90&fit=crop"


                alt="Team collaborating"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5 text-orange-300 mb-4">
              <MessageCircleQuestion className="h-3.5 w-3.5" /> Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              A community-first platform, built by people who got stuck too.
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Help Hub was founded in 2024 by a small team of developers and
              designers who were tired of asking questions into the void —
              forums that never replied, Discord servers where messages got
              buried in seconds, and Q&A sites that felt more like exams than
              conversations.
            </p>
            <p className="text-white/60 leading-relaxed">
              So we built something different: a space where asking for help
              is encouraged, not judged. Where good answers actually rise to
              the top. And where helping someone else feels as rewarding as
              getting unstuck yourself.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5 text-orange-300 mb-4">
              <Target className="h-3.5 w-3.5" /> Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Make expert-level help accessible to anyone, for free.
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Knowledge shouldn't be locked behind paywalls, gatekept
              communities, or intimidating jargon. Our mission is to connect
              people who have a problem with people who've already solved it
              — instantly, and without friction.
            </p>
            <p className="text-white/60 leading-relaxed">
              Every feature we ship — reputation badges, smart categorization,
              real-time notifications — exists to get you a good answer
              faster, and to make giving one feel worthwhile.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="order-1 md:order-2">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=3840&q=90&fit=crop"

                alt="People working together"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS */}
      <section className="relative px-6 py-16 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r bg-orange-500 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* VALUES */}
      <section className="relative px-6 py-20 max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            What we stand for
          </h2>
          <p className="mt-3 text-white/50 max-w-xl mx-auto">
            These aren't just values on a wall — they shape every decision we
            make about the product.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden hover:border-white/20 transition-colors"
              >
                <div
                  className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${v.gradient} opacity-0 transition-opacity duration-500`}
                />
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${v.gradient} grid place-items-center mb-5 shadow-lg`}
                >
                  <v.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TEAM */}
    {/* TEAM */}
<section className="relative px-6 py-20 max-w-4xl mx-auto">
  <ScrollReveal className="text-center mb-14">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
      Meet the founder
    </h2>
    <p className="mt-3 text-white/50 max-w-xl mx-auto">
      One person, one obsession: making it easier for people to help
      each other.
    </p>
  </ScrollReveal>

  <div className="flex justify-center">
    {team.map((member) => (
      <ScrollReveal key={member.name}>
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center group"
        >
          <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border border-white/10 mb-5 bg-white/[0.03]">
            <Image
              src={member.img}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-lg">{member.name}</h3>
          <p className="text-sm text-white/40 mt-1">{member.role}</p>
        </motion.div>
      </ScrollReveal>
    ))}
  </div>
</section>

      {/* CTA */}
      <section className="relative px-6 py-24">
        <ScrollReveal className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 px-8 py-16 text-center bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-xl">
            <div className="absolute inset-0 " />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Want to be part of the story?
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-8">
                Join thousands of people already asking, answering, and
                growing together on Help Hub.
              </p>
              <motion.a
                href="/questions"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="inline-block px-8 py-4 rounded-full font-semibold bg-gradient-to-r bg-orange-500   transition-shadow"
              >
                Join the Community
              </motion.a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}






