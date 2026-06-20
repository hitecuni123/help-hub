// app/login/page.tsx
"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";
import Blobs from "@/components/Blobs";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <Blobs />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 text-center"
      >
        {/* Fixed the syntax error below by properly closing the opening div tag */}
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-400 grid place-items-center font-bold text-lg mx-auto mb-5">
          H
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Welcome to Help Hub
        </h1>
        <p className="text-sm text-white/50 mb-8">
          Sign in to ask questions, answer others, and track your reputation.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-black font-medium transition-shadow"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.55-1.84.86-3.06.86-2.35 0-4.34-1.58-5.05-3.71H.9v2.33A9 9 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.95 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.9a9 9 0 0 0 0 8.08l3.05-2.33z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.6 8.6 0 0 0 9 0 9 9 0 0 0 .9 4.96l3.05 2.33C4.66 5.16 6.65 3.58 9 3.58z"
            />
          </svg>
          Continue with Google
        </motion.button>

        {/* Apple Sign In — requires Apple Developer account + provider config */}
        <button
          disabled
          title="Requires Apple Developer setup"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-medium mt-3 cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.2-46.9.7-91.5 27.3-115.1 69.3-49.4 85.7-12.6 212.8 35.4 282.4 23.5 33.9 51.3 71.7 88 70.3 35.3-1.4 48.6-22.9 91.4-22.9 42.6 0 55.1 22.9 92.7 22.2 38.2-.6 62.7-34 86.1-67.9 27.1-39.1 38.2-77 38.6-79.1-.7-.3-74.1-28.4-74.5-112.4zM251.3 88.7c19.8-23.5 33.1-56.2 29.5-88.7-28.4 1.1-62.9 18.9-83.5 42.4-17.9 20.5-33.7 53.3-29.5 84.9 30.6 2.4 62-15.5 83.5-38.6z" />
          </svg>
          Continue with Apple (coming soon)
        </button>
      </motion.div>
    </main>
  );
}