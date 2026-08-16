import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAgent, useSaveAgent, useSession } from "@/lib/agent";
import { questlines, type CertKey } from "@/lib/missions";

export const Route = createFileRoute("/_authenticated/quest")({
  head: () => ({
    meta: [
      { title: "Choose Your Main Quest — CYBER//CITY" },
      {
        name: "description",
        content:
          "Pick a certification questline — Security+, CySA+, PenTest+, or CEH — and your Cyber City missions train those skills.",
      },
      { property: "og:title", content: "Choose Your Main Quest — CYBER//CITY" },
      {
        property: "og:description",
        content: "Your certification is the questline beneath the game.",
      },
    ],
  }),
  component: QuestScreen,
});

function QuestScreen() {
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: agent } = useAgent(userId);
  const save = useSaveAgent(userId);
  const navigate = useNavigate();
  const [cert, setCert] = useState<CertKey | null>(null);

  useEffect(() => {
    if (agent?.cert) setCert(agent.cert);
  }, [agent]);

  async function enterCity() {
    if (!cert) return;
    await save.mutateAsync({ cert });
    navigate({ to: "/city" });
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="kicker">Choose your main quest</p>
      <h2 className="mt-2">What are you training for?</h2>
      <p className="mt-3 max-w-[760px] text-lg leading-relaxed text-muted-foreground">
        Your certification is the questline beneath the game. The city stays fun; your missions
        quietly train the skills you need.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {questlines.map((q) => (
          <button
            key={q.cert}
            type="button"
            onClick={() => setCert(q.cert)}
            className={`cyber-card min-h-[200px] text-left transition-colors ${
              cert === q.cert ? "border-primary shadow-[0_0_0_1px_var(--lime)_inset]" : "hover:border-accent"
            }`}
          >
            <div className="text-4xl">{q.icon}</div>
            <div className="mt-2 text-[11px] font-black tracking-[0.13em] text-accent">
              {q.quest}
            </div>
            <h3 className="mt-1 text-lg font-bold">{q.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{q.blurb}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <Button variant="steel" size="xl" asChild>
          <Link to="/creator">← Agent creator</Link>
        </Button>
        <Button variant="hero" size="xl" disabled={!cert || save.isPending} onClick={enterCity}>
          Enter Cyber City →
        </Button>
      </div>
    </main>
  );
}
