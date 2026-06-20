// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Questions", href: "/questions" },
  { label: "Help Requests", href: "/help-requests" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-2xl shadow-[0_12px_50px_rgba(0,0,0,0.6)] border-b border-white/10 py-3"
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      {/* max-w-full aur px-8 md:px-16 se yeh center me dabne ke bajaye poori screen use karega */}
      <div className="mx-auto max-w-full px-8 md:px-16 flex items-center justify-between transition-all duration-300">
        
        {/* Logo Section (More prominent) */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 grid place-items-center font-extrabold text-lg shadow-xl  group-hover:scale-110 transition-transform">
            H
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Help<span className="text-orange-400">Hub</span>
          </span>
        </Link>

        {/* Navigation Links (Bigger fonts and more gap between items) */}
        <nav className="hidden md:flex items-center gap-14">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-lg font-semibold text-white/80 hover:text-white transition-colors duration-300 group py-2 tracking-wide"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-[2.5px] w-0 bg-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons / Profile (Larger and chunkier) */}
        <div className="hidden md:flex items-center gap-6">
          {status === "loading" ? (
            <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-4 pl-2 pr-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shadow-md"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={42}
                    height={42}
                    className="rounded-full shadow-inner"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-orange-500 grid place-items-center text-base font-bold shadow-md">
                    {session.user.name?.[0] || "U"}
                  </div>
                )}
                <span className="text-lg font-semibold">{session.user.name?.split(" ")[0]}</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-56 rounded-2xl border border-white/10 bg-[#0a0a10] shadow-2xl overflow-hidden z-50 p-1"
                  >
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 text-base font-medium text-white/80 hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <User className="h-5 w-5 text-orange-400" /> My Account
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-3 px-5 py-4 text-base font-medium text-orange-400 hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <LogOut className="h-5 w-5" /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-lg font-semibold text-white/80 hover:text-white px-6 py-3 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="relative text-lg font-bold px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 shadow-xl   hover:scale-105 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white/80 p-2 hover:bg-white/5 rounded-xl transition-colors">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </motion.header>
  );
}






