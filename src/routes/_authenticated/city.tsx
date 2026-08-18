import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AgentPhone } from "@/components/AgentPhone";
import { Button } from "@/components/ui/button";

import { useAgent, useSession } from "@/lib/agent";
import { useMissionRuns } from "@/lib/game";
import { buildings, isMissionUnlocked, missionsByCert, questFor } from "@/lib/missions";
import { completedIds, levelFor, levelProgress } from "@/lib/progression";

export const Route = createFileRoute("/_authenticated/city")({
  head: () => ({
    meta: [
      { title: "Cyber City — CYBER//CITY" },
      {
        name: "description",
        content:
          "Four districts, four cases. Take on SOC Tower, the Cyber Café, the Network Hub, and the Security HQ boss operation.",
      },
      { property: "og:title", content: "Cyber City — CYBER//CITY" },
      { property: "og:description", content: "Explore the city and take your next case." },
    ],
  }),
  component: CityScreen,
});

function CityScreen() {
  const { session } = useSession();
  const { data: agent, isSuccess } = useAgent(session?.user.id);
  const { data: runs = [] } = useMissionRuns(session?.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuccess) return;
    if (!agent) navigate({ to: "/creator" });
    else if (!agent.cert) navigate({ to: "/quest" });
  }, [isSuccess, agent, navigate]);

  if (!agent?.cert) return null;
  const quest = questFor(agent.cert);
  const list = missionsByCert[agent.cert];
  const done = completedIds(runs, agent.cert);
  const progress = levelProgress(agent.xp);

  const cards = buildings.map((b) => {
    const index = list.findIndex((m) => m.building === b.key);
    const mission = list[index]!;
    const unlocked = isMissionUnlocked(agent.cert!, index, done);
    const cleared = done.includes(mission.id);
    return { b, mission, index, unlocked, cleared };
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0d1623_0,#101828_49%,#11141b_49%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[44%] bg-[radial-gradient(circle_at_65%_25%,rgba(105,231,255,.18),transparent_17%),radial-gradient(circle_at_28%_10%,rgba(173,145,255,.16),transparent_20%)]" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-6">
        <div className="rounded-2xl border border-border bg-black/50 px-3.5 py-2.5 backdrop-blur">
          <strong>{agent.name}</strong>{" "}
          <span className="text-muted-foreground">· Level {levelFor(agent.xp)}</span>
          <div className="text-xs text-muted-foreground">
            {quest.quest} · {agent.cert} · {agent.xp} XP · 🔥 {agent.streak_count} day streak
          </div>
          <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-[oklch(0.24_0.027_253.4)]">
            <div className="h-full bg-primary" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="steel" asChild>
            <Link to="/skills">Skill tree</Link>
          </Button>
          <Button variant="steel" asChild>
            <Link to="/badges">Badges</Link>
          </Button>
          <Button variant="steel" asChild>
            <Link to="/leaderboard">Leaderboard</Link>
          </Button>
          <Button variant="steel" asChild>
            <Link to="/classroom">Classroom</Link>
          </Button>
          <Button variant="steel" asChild>
            <Link to="/quest">Change questline</Link>
          </Button>
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden h-[600px] max-w-6xl md:block">
        {cards.map(({ b, mission, index, unlocked, cleared }) =>
          unlocked ? (
            <Link
              key={b.key}
              to="/brief/$missionId"
              params={{ missionId: mission.id }}
              className={`absolute rounded-t-[18px] border p-4 text-left bg-[linear-gradient(180deg,#172437,#101721)] ${b.pos} ${
                cleared
                  ? "border-accent"
                  : "border-primary shadow-[0_0_35px_rgba(204,255,77,.12)]"
              }`}
            >
              <strong>{b.label}</strong>
              <div className="text-xs text-muted-foreground">{mission.title}</div>
              <div className="mt-4 h-[105px] bg-[repeating-linear-gradient(90deg,rgba(105,231,255,.22)_0_18px,transparent_18px_31px),repeating-linear-gradient(0deg,rgba(105,231,255,.17)_0_12px,transparent_12px_24px)]" />
              <span className="pill mt-3">
                {cleared ? "CLEARED ✓" : mission.boss ? "BOSS OP" : `MISSION 0${index + 1}`}
              </span>
            </Link>
          ) : (
            <div
              key={b.key}
              className={`absolute rounded-t-[18px] border border-border bg-[linear-gradient(180deg,#172437,#101721)] p-4 opacity-45 ${b.pos}`}
            >
              <strong>{b.label}</strong>
              <div className="text-xs text-muted-foreground">{b.sub}</div>
              <div className="mt-4 h-[105px] bg-[repeating-linear-gradient(90deg,rgba(105,231,255,.22)_0_18px,transparent_18px_31px),repeating-linear-gradient(0deg,rgba(105,231,255,.17)_0_12px,transparent_12px_24px)]" />
              <span className="pill mt-3">LOCKED</span>
            </div>
          ),
        )}
      </div>

      <div className="relative z-10 grid gap-3 p-5 md:hidden">
        {cards.map(({ b, mission, index, unlocked, cleared }) =>
          unlocked ? (
            <Link
              key={b.key}
              to="/brief/$missionId"
              params={{ missionId: mission.id }}
              className={`cyber-card ${cleared ? "border-accent" : "border-primary"}`}
            >
              <strong>{b.label}</strong>
              <div className="text-xs text-muted-foreground">{mission.title}</div>
              <span className="pill mt-3">
                {cleared ? "CLEARED ✓" : mission.boss ? "BOSS OP" : `MISSION 0${index + 1}`}
              </span>
            </Link>
          ) : (
            <div key={b.key} className="cyber-card opacity-45">
              <strong>{b.label}</strong>
              <div className="text-xs text-muted-foreground">{b.sub}</div>
              <span className="pill mt-3">LOCKED</span>
            </div>
          ),
        )}
      </div>
      <AgentPhone agent={agent} />
    </main>
  );
}
