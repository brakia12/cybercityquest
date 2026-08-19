import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { AgentAvatar } from "@/components/AgentAvatar";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/agent";
import { questFor, missionsByCert } from "@/lib/missions";
import { levelFor, levelProgress } from "@/lib/progression";

export function AgentPhone({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);
  const quest = agent.cert ? questFor(agent.cert) : null;
  const missions = agent.cert ? missionsByCert[agent.cert] : [];
  const progress = levelProgress(agent.xp);

  return (
    <>
      <button
        type="button"
        aria-label="Open agent phone"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-2xl border border-border bg-[oklch(0.19_0.025_259.2)] text-2xl shadow-lg"
      >
        📱
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="cyber-panel max-h-[90vh] w-full max-w-sm overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="kicker">Agent phone</p>
                <h3 className="mt-1 text-xl font-bold">{agent.name}</h3>
                <div className="text-xs text-muted-foreground">
                  Level {levelFor(agent.xp)} · 🔥 {agent.streak_count} day streak
                </div>
              </div>
              <button
                type="button"
                aria-label="Close agent phone"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-2 py-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <AgentAvatar skin={agent.skin} hair={agent.hair} outfit={agent.outfit} scale={0.22} />
              <div className="grid gap-1 text-sm">
                <div className="text-muted-foreground">QUESTLINE</div>
                <b>{quest ? quest.name : "Not chosen"}</b>
                <div className="mt-1 text-muted-foreground">TOTAL XP</div>
                <b className="text-primary">{agent.xp}</b>
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[oklch(0.24_0.027_253.4)]">
              <div className="h-full bg-primary" style={{ width: `${progress.pct}%` }} />
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <div className="rounded-xl border border-border p-3">
                <div className="text-xs text-muted-foreground">CASE FILES</div>
                {missions.length > 0
                  ? `${missions.length} cases in this questline`
                  : "Choose a questline to unlock cases."}
              </div>
              <div className="rounded-xl border border-border p-3">
                <div className="text-xs text-muted-foreground">QUEST FOCUS</div>
                {quest ? quest.quest : "—"}
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Button variant="steel" className="w-full" asChild>
                <Link to="/city" onClick={() => setOpen(false)}>
                  Map: Cyber City
                </Link>
              </Button>
              <Button variant="steel" className="w-full" asChild>
                <Link to="/skills" onClick={() => setOpen(false)}>
                  Skill tree
                </Link>
              </Button>
              <Button variant="steel" className="w-full" asChild>
                <Link to="/badges" onClick={() => setOpen(false)}>
                  Trophy case
                </Link>
              </Button>
              <Button variant="steel" className="w-full" asChild>
                <Link to="/leaderboard" onClick={() => setOpen(false)}>
                  Leaderboard
                </Link>
              </Button>
              <Button variant="steel" className="w-full" asChild>
                <Link to="/classroom" onClick={() => setOpen(false)}>
                  Classroom
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
