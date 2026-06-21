// app/questions/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  ThumbsUp,
  MessageSquare,
  Send,
  Image as ImageIcon,
  Smile,
  MoreHorizontal,
  X, // Fixed: Added missing icon
} from "lucide-react";

type Comment = {
  id: string;
  body: string;
  author: string;
  authorImg?: string | null;
  createdAt: number;
};

type Post = {
  id: string;
  body: string;
  author: string;
  authorImg?: string | null;
  image?: string | null;
  likes: number;
  liked: boolean;
  createdAt: number;
  comments: Comment[];
};

const STORAGE_KEY = "helphub_feed_posts";

const seedPosts: Post[] = [
  {
    id: "p1",
    body: "How do I optimize a Next.js 14 app for Core Web Vitals? My LCP is sitting around 4.2s on mobile even after lazy-loading most components. Any real-world tips?",
    author: "Ahmed",
    authorImg: null,
    likes: 12,
    liked: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    comments: [
      {
        id: "c1",
        body: "Check your hero image — if it's not using next/image with priority, that's almost always the LCP culprit.",
        author: "Sara K.",
        authorImg: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 4,
      },
    ],
  },
  {
    id: "p2",
    body: "Best way to structure a monorepo for 3 microservices? Starting a new project with a Next.js frontend and two Node services. Turborepo or Nx?",
    author: "Bilal R.",
    authorImg: null,
    likes: 6,
    liked: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    comments: [],
  },
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function initials(name: string) {
  return name?.[0]?.toUpperCase() || "U";
}

export default function QuestionsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Fixed: Moved inside component
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});

  const userName = session?.user?.name || "Guest";
  const userImg = session?.user?.image || null;

  // Hydration handling
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPosts(JSON.parse(stored));
      } catch {
        setPosts(seedPosts);
      }
    } else {
      setPosts(seedPosts);
    }
    setHydrated(true);
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts, hydrated]);

  // Fixed: Moved inside component scope to access state setters
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large — please pick something under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handlePost() {
    if (!draft.trim() && !imagePreview) return;
    const post: Post = {
      id: crypto.randomUUID(),
      body: draft.trim(),
      author: userName,
      authorImg: userImg,
      image: imagePreview,
      likes: 0,
      liked: false,
      createdAt: Date.now(),
      comments: [],
    };
    setPosts((prev) => [post, ...prev]);
    setDraft("");
    setImagePreview(null);
    setComposerOpen(false);
  }

  function toggleLike(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  function submitComment(postId: string) {
    const body = (commentDraft[postId] || "").trim();
    if (!body) return;
    const comment: Comment = {
      id: crypto.randomUUID(),
      body,
      author: userName,
      authorImg: userImg,
      createdAt: Date.now(),
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
    setCommentDraft((prev) => ({ ...prev, [postId]: "" }));
  }

  const sorted = [...posts].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <main className="relative min-h-screen px-4 pt-28 pb-24 max-w-2xl mx-auto text-white">
      {/* COMPOSER */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 mb-6">
        {!composerOpen ? (
          <div className="flex items-center gap-3">
            <Avatar img={userImg} name={userName} size={40} />
            <button
              onClick={() => setComposerOpen(true)}
              className="flex-1 text-left rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white/40 transition-colors"
            >
              What's your question, {userName.split(" ")[0]}?
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar img={userImg} name={userName} size={40} />
              <span className="text-sm font-medium">{userName}</span>
            </div>
            
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask something, share a problem, or start a discussion..."
              rows={3}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-400/50 transition-colors resize-none"
            />

            {/* Image Preview Window */}
            {imagePreview && (
              <div className="relative mt-3 rounded-xl overflow-hidden border border-white/10 max-h-72">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-72 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2 text-white/30">
                {/* Custom File Upload Input Wrapper */}
                <label className="p-2 rounded-lg hover:bg-white/10 hover:text-white/60 transition-colors cursor-pointer flex items-center justify-center">
                  <ImageIcon className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
                <button type="button" className="p-2 rounded-lg hover:bg-white/10 hover:text-white/60 transition-colors">
                  <Smile className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setComposerOpen(false);
                    setDraft("");
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 rounded-full text-sm text-white/50 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePost}
                  disabled={!draft.trim() && !imagePreview} // Fixed: Allow posting if image exists without text
                  className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/30 transition-all text-white"
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* FEED */}
      {!hydrated ? (
        <div className="text-white/30 text-sm text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {sorted.map((post, i) => {
            const showComments = !!openComments[post.id];
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 flex items-start gap-3">
                  <Avatar img={post.authorImg} name={post.author} size={44} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{post.author}</div>
                        <div className="text-xs text-white/30">
                          {timeAgo(post.createdAt)} ago
                        </div>
                      </div>
                      <button className="text-white/30 hover:text-white/60 p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Body Text */}
                {post.body && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
                      {post.body}
                    </p>
                  </div>
                )}

                {/* Post Image Render */}
                {post.image && (
                  <div className="px-4 pb-3">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="w-full rounded-xl border border-white/10 max-h-96 object-cover"
                    />
                  </div>
                )}

                {/* Stats Row */}
                {(post.likes > 0 || post.comments.length > 0) && (
                  <div className="px-4 pb-2 flex items-center justify-between text-xs text-white/30">
                    <span>{post.likes > 0 && `${post.likes} likes`}</span>
                    <span>
                      {post.comments.length > 0 &&
                        `${post.comments.length} comments`}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-2 py-1 border-t border-white/10 flex items-center">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      post.liked
                        ? "text-orange-400"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <ThumbsUp
                      className="h-4 w-4"
                      fill={post.liked ? "currentColor" : "none"}
                    />
                    Like
                  </button>
                  <button
                    onClick={() =>
                      setOpenComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Comment
                  </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/10 bg-white/[0.02]"
                    >
                      <div className="p-4 space-y-3">
                        {post.comments.map((c) => (
                          <div key={c.id} className="flex gap-2.5">
                            <Avatar img={c.authorImg} name={c.author} size={32} />
                            <div className="flex-1 rounded-2xl bg-white/[0.05] px-3.5 py-2">
                              <div className="text-xs font-semibold">
                                {c.author}
                              </div>
                              <p className="text-sm text-white/75 mt-0.5">
                                {c.body}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Comment Composer */}
                        <div className="flex items-center gap-2.5 pt-1">
                          <Avatar img={userImg} name={userName} size={32} />
                          <div className="flex-1 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 pl-4 pr-1.5 py-1">
                            <input
                              value={commentDraft[post.id] || ""}
                              onChange={(e) =>
                                setCommentDraft((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") submitComment(post.id);
                              }}
                              placeholder="Write a comment..."
                              className="flex-1 bg-transparent text-sm placeholder:text-white/30 focus:outline-none py-1.5"
                            />
                            <button
                              onClick={() => submitComment(post.id)}
                              className="p-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-md transition-shadow flex items-center justify-center"
                            >
                              <Send className="h-3.5 w-3.5 text-white" />
                            </button>
                          </div>
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

function Avatar({
  img,
  name,
  size,
}: {
  img?: string | null;
  name: string;
  size: number;
}) {
  if (img) {
    return (
      <Image
        src={img}
        alt={name}
        width={size}
        height={size}
        className="rounded-full shrink-0 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-orange-500 to-amber-500 grid place-items-center font-semibold text-white shrink-0 text-sm"
    >
      {initials(name)}
    </div>
  );
}