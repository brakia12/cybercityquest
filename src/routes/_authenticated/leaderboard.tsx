import { createFileRoute, Link } from "@tanstack/react-router";

import { AgentAvatar } from "@/components/AgentAvatar";
import { AgentPhone } from "@/components/AgentPhone";
import { Button } from "@/components/ui/button";
import { useAgent, useSession } from "@/lib/agent";
import { useLeaderboard } from "@/lib/game";
import { levelFor } from "@/lib/progression";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { title: "Agent Leaderboard — CYBER//CITY" },
      {
        name: "description",
        content: "The top Cyber City agents ranked by XP, level, streak, and badges earned.",
      },
      { property: "og:title", content: "Agent Leaderboard — CYBER//CITY" },
      { property: "og:description", content: "See how your agent ranks across the city." },
    ],
  }),
  component: LeaderboardScreen,
});

function LeaderboardScreen() {
  const { session } = useSession();
  const { data: agent } = useAgent(session?.user.id);
  const { data: rows = [], isLoading } = useLeaderboard();

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <p className="kicker">City rankings</p>
      <h2 className="mt-2">Agent leaderboard</h2>
      <p className="mt-2 text-muted-foreground">
        Public profile only: agent name, look, questline, level, XP, streak, and badge count.
      </p>

      {isLoading ? (
        <p className="kicker mt-6">Loading rankings…</p>
      ) : (
        <div className="mt-6 grid gap-2">
          {rows.map((row, i) => {
            const me = row.user_id === session?.user.id;
            return (
              <div
                key={row.user_id}
                className={`cyber-card flex items-center gap-4 ${me ? "border-primary" : ""}`}
              >
                <div className="w-8 text-xl font-black text-muted-foreground">{i + 1}</div>
                <div className="w-12 shrink-0">
                  <AgentAvatar skin={row.skin} hair={row.hair} outfit={row.outfit} />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="truncate">
                    {row.name}
                    {me && <span className="text-primary"> · you</span>}
                  </strong>
                  <div className="text-xs text-muted-foreground">
                    {row.cert ?? "No questline"} · Level {levelFor(row.xp)} · 🔥 {row.streak_count}
                  </div>
                </div>
                <div className="text-right">
                  <b className="text-primary">{row.xp} XP</b>
                  <div className="text-xs text-muted-foreground">🏅 {row.badges} badges</div>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="text-muted-foreground">No agents on the board yet.</p>
          )}
        </div>
      )}

      <div className="mt-6">
        <Button variant="hero" size="xl" asChild>
          <Link to="/city">Return to Cyber City →</Link>
        </Button>
      </div>
      {agent && <AgentPhone agent={agent} />}
    </main>
  );
}
