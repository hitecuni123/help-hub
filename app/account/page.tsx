// app/account/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { MessageCircleQuestion, ThumbsUp, Heart, Award } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const stats = [
    { icon: MessageCircleQuestion, label: "Questions Asked", value: 4 },
    { icon: ThumbsUp, label: "Answers Given", value: 11 },
    { icon: Award, label: "Reputation Points", value: 230 },
    { icon: Heart, label: "Help Requests Supported", value: 2 },
  ];

  return (
    <main className="relative min-h-screen px-6 pt-32 pb-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-5 mb-12">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={80}
            height={80}
            className="rounded-2xl border border-white/10"
          />
        ) : (
          <div className="h-20 w-20 rounded-2xl bg-orange-500 grid place-items-center text-2xl font-bold">
            {session.user.name?.[0] || "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{session.user.name}</h1>
          <p className="text-white/40 text-sm">{session.user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 text-center"
          >
            <s.icon className="h-5 w-5 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <p className="text-white/30 text-sm text-center">
        Your real questions, answers, and help-request history will appear
        here once connected to a database.
      </p>
    </main>
  );
}





