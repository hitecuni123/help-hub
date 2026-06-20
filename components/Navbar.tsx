"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Menu, X } from "lucide-react"; // Imported Menu and X icons

const links = [
  { label: "Home", href: "/" },
  { label: "Questions", href: "/questions" },
  { label: "Help Requests", href: "/help-requests" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Used for desktop profile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Added for mobile menu
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when changing viewports
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
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
        <div className="mx-auto max-w-full px-8 md:px-16 flex items-center justify-between transition-all duration-300">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 grid place-items-center font-extrabold text-lg shadow-xl group-hover:scale-110 transition-transform">
              H
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Help<span className="text-orange-400">Hub</span>
            </span>
          </Link>

          {/* Navigation Links (Desktop Only) */}
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

          {/* Right Action Buttons / Profile (Desktop Only) */}
          <div className="hidden md:flex items-center gap-6">
            {status === "loading" ? (
              <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-4 pl-2 pr-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shadow-md text-white"
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
                  className="relative text-lg font-bold px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 shadow-xl hover:scale-105 transition-all duration-300 text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button (Fixed with state toggle and Lucide Icons) */}
          <button 
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-white/80 p-2 hover:bg-white/5 rounded-xl transition-colors z-50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay and Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Background Backdrop Tint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
            />

            {/* Mobile Menu Content Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0a0a10] border-l border-white/10 z-40 p-8 pt-28 flex flex-col justify-between md:hidden"
            >
              {/* Navigation Links inside Drawer */}
              <nav className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-semibold text-white/80 hover:text-white transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Authentication Actions inside Drawer */}
              <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                {status === "loading" ? (
                  <div className="h-12 w-full rounded-xl bg-white/10 animate-pulse" />
                ) : session?.user ? (
                  <>
                    <div className="flex items-center gap-4 mb-2">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-orange-500 grid place-items-center text-base font-bold text-white">
                          {session.user.name?.[0] || "U"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-white">{session.user.name}</span>
                        <span className="text-xs text-white/50">{session.user.email}</span>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full py-3 px-4 rounded-xl border border-white/10 bg-white/5 text-white/80 font-medium"
                    >
                      <User size={18} className="text-orange-400" /> My Account
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-3 w-full py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors"
                    >
                      <LogOut size={18} /> Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 rounded-xl border border-white/10 text-white/80 font-semibold"
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}