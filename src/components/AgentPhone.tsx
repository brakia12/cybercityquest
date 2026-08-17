import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { AgentAvatar } from "@/components/AgentAvatar";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/agent";
import { questFor, missions } from "@/lib/missions";

export function AgentPhone({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);
  const quest = agent.cert ? questFor(agent.cert) : null;
  const mission = agent.cert ? missions[agent.cert] : null;

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
            className="cyber-panel w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="kicker">Agent phone</p>
                <h3 className="mt-1 text-xl font-bold">{agent.name}</h3>
              </div>
              <button
                type="button"
                aria-label="Close agent phone"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-2.5 py-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <AgentAvatar skin={agent.skin} hair={agent.hair} outfit={agent.outfit} size={92} />
              <div className="grid gap-1 text-sm">
                <div className="text-muted-foreground">QUESTLINE</div>
                <b>{quest ? quest.name : "Not chosen"}</b>
                <div className="mt-1 text-muted-foreground">TOTAL XP</div>
                <b className="text-primary">{agent.xp}</b>
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <div className="rounded-xl border border-border p-3">
                <div className="text-xs text-muted-foreground">CURRENT CASE</div>
                {mission ? mission.title : "Choose a questline to unlock a case."}
              </div>
              <div className="rounded-xl border border-border p-3">
                <div className="text-xs text-muted-foreground">SKILLS IN TRAINING</div>
                {quest ? quest.skills.join(" · ") : "—"}
              </div>
            </div>

            <Button variant="steel" className="mt-4 w-full" asChild>
              <Link to="/city" onClick={() => setOpen(false)}>
                Map: Cyber City
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
