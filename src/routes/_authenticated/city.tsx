import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAgent, useSession } from "@/lib/agent";
import { missions, questFor } from "@/lib/missions";

export const Route = createFileRoute("/_authenticated/city")({
  head: () => ({
    meta: [
      { title: "Cyber City — CYBER//CITY" },
      {
        name: "description",
        content: "Your active mission is waiting in Cyber City. Tap the lit building to get briefed.",
      },
      { property: "og:title", content: "Cyber City — CYBER//CITY" },
      { property: "og:description", content: "Explore the city and take your active case." },
    ],
  }),
  component: CityScreen,
});

const lockedBuildings = [
  { key: "cafe", label: "☕ Cyber Café", sub: "Social Engineering", pos: "left-[7%] top-[190px] w-[215px] h-[240px]" },
  { key: "hub", label: "🌐 Network Hub", sub: "Network puzzles", pos: "right-[28%] top-[175px] w-[200px] h-[255px]" },
  { key: "hq", label: "🏢 Security HQ", sub: "Boss operations", pos: "right-[6%] top-[125px] w-[220px] h-[305px]" },
];

function CityScreen() {
  const { session } = useSession();
  const { data: agent, isSuccess } = useAgent(session?.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuccess) return;
    if (!agent) navigate({ to: "/creator" });
    else if (!agent.cert) navigate({ to: "/quest" });
  }, [isSuccess, agent, navigate]);


  if (!agent?.cert) return null;
  const quest = questFor(agent.cert);
  const mission = missions[agent.cert];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0d1623_0,#101828_49%,#11141b_49%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[44%] bg-[radial-gradient(circle_at_65%_25%,rgba(105,231,255,.18),transparent_17%),radial-gradient(circle_at_28%_10%,rgba(173,145,255,.16),transparent_20%)]" />

      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="rounded-2xl border border-border bg-black/50 px-3.5 py-2.5 backdrop-blur">
          <strong>{agent.name}</strong>{" "}
          <span className="text-muted-foreground">· Level {Math.floor(agent.xp / 500) + 1}</span>
          <div className="text-xs text-muted-foreground">
            {quest.quest} · {agent.cert} · {agent.xp} XP
          </div>
        </div>
        <Button variant="steel" size="xl" asChild>
          <Link to="/quest">Change questline</Link>
        </Button>
      </div>

      <div className="relative z-10 mx-auto hidden h-[600px] max-w-6xl md:block">
        {lockedBuildings.map((b) => (
          <div
            key={b.key}
            className={`absolute rounded-t-[18px] border border-border bg-[linear-gradient(180deg,#172437,#101721)] p-4 opacity-45 ${b.pos}`}
          >
            <strong>{b.label}</strong>
            <div className="text-xs text-muted-foreground">{b.sub}</div>
            <div className="mt-4 h-[105px] bg-[repeating-linear-gradient(90deg,rgba(105,231,255,.22)_0_18px,transparent_18px_31px),repeating-linear-gradient(0deg,rgba(105,231,255,.17)_0_12px,transparent_12px_24px)]" />
            <span className="pill mt-3">LOCKED</span>
          </div>
        ))}
        <Link
          to="/brief"
          className="absolute left-[31%] top-[115px] h-[315px] w-[225px] rounded-t-[18px] border border-primary bg-[linear-gradient(180deg,#172437,#101721)] p-4 text-left shadow-[0_0_35px_rgba(204,255,77,.12)]"
        >
          <strong>{mission.building}</strong>
          <div className="text-xs text-muted-foreground">Active mission</div>
          <div className="mt-4 h-[105px] bg-[repeating-linear-gradient(90deg,rgba(105,231,255,.22)_0_18px,transparent_18px_31px),repeating-linear-gradient(0deg,rgba(105,231,255,.17)_0_12px,transparent_12px_24px)]" />
          <span className="pill mt-3">MISSION 01</span>
        </Link>
      </div>

      <div className="relative z-10 grid gap-3 p-5 md:hidden">
        <Link
          to="/brief"
          className="cyber-card border-primary shadow-[0_0_35px_rgba(204,255,77,.12)]"
        >
          <strong>{mission.building}</strong>
          <div className="text-xs text-muted-foreground">Active mission</div>
          <span className="pill mt-3">MISSION 01</span>
        </Link>
        {lockedBuildings.map((b) => (
          <div key={b.key} className="cyber-card opacity-45">
            <strong>{b.label}</strong>
            <div className="text-xs text-muted-foreground">{b.sub}</div>
            <span className="pill mt-3">LOCKED</span>
          </div>
        ))}
      </div>
      <AgentPhone agent={agent} />
    </main>

  );
}
