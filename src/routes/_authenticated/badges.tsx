import { createFileRoute, Link } from "@tanstack/react-router";

import { AgentPhone } from "@/components/AgentPhone";
import { Button } from "@/components/ui/button";
import { useAgent, useSession } from "@/lib/agent";
import { useBadges, useMissionRuns } from "@/lib/game";
import { badgeDefs, earnedBadgeKeys, levelFor, levelProgress } from "@/lib/progression";

export const Route = createFileRoute("/_authenticated/badges")({
  head: () => ({
    meta: [
      { title: "Trophy Case — CYBER//CITY" },
      {
        name: "description",
        content: "Every badge you have earned as a Cyber City agent, plus the ones still locked.",
      },
      { property: "og:title", content: "Trophy Case — CYBER//CITY" },
      { property: "og:description", content: "Track your achievements, streaks, and agent level." },
    ],
  }),
  component: BadgesScreen,
});

function BadgesScreen() {
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: agent } = useAgent(userId);
  const { data: runs = [] } = useMissionRuns(userId);
  const { data: saved = [] } = useBadges(userId);

  if (!agent) return null;

  const live = new Set([
    ...saved.map((b) => b.badge_key),
    ...earnedBadgeKeys({
      runs,
      xp: agent.xp,
      streak: agent.streak_count,
      cert: agent.cert,
    }),
  ]);
  const progress = levelProgress(agent.xp);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <p className="kicker">Trophy case</p>
      <h2 className="mt-2">{agent.name}'s achievements</h2>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "AGENT LEVEL", value: levelFor(agent.xp) },
          { label: "TOTAL XP", value: agent.xp },
          { label: "CURRENT STREAK", value: `🔥 ${agent.streak_count}` },
          { label: "BADGES", value: `${live.size}/${badgeDefs.length}` },
        ].map((s) => (
          <div key={s.label} className="cyber-panel">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <b className="text-2xl">{s.value}</b>
          </div>
        ))}
      </div>

      <div className="cyber-panel mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>PROGRESS TO LEVEL {levelFor(agent.xp) + 1}</span>
          <span>
            {progress.into}/{progress.needed} XP
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[oklch(0.24_0.027_253.4)]">
          <div className="h-full bg-primary" style={{ width: `${progress.pct}%` }} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {badgeDefs.map((b) => {
          const earned = live.has(b.key);
          return (
            <div
              key={b.key}
              className={`cyber-card flex items-start gap-3 ${earned ? "border-primary" : "opacity-55"}`}
            >
              <div className="text-3xl">{earned ? b.icon : "🔒"}</div>
              <div>
                <strong>{b.name}</strong>
                <div className="text-sm text-muted-foreground">{b.desc}</div>
                <span className="pill mt-2">{earned ? "EARNED" : "LOCKED"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <Button variant="hero" size="xl" asChild>
          <Link to="/city">Return to Cyber City →</Link>
        </Button>
        <Button variant="steel" size="xl" asChild>
          <Link to="/skills">Skill tree</Link>
        </Button>
      </div>
      <AgentPhone agent={agent} />
    </main>
  );
}
