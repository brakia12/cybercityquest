import { createFileRoute, Link, useParams } from "@tanstack/react-router";

import { AgentPhone } from "@/components/AgentPhone";
import { Button } from "@/components/ui/button";
import { useAgent, useSession } from "@/lib/agent";
import { useMissionRuns } from "@/lib/game";
import { getMission, missionsByCert } from "@/lib/missions";
import { bestRunFor } from "@/lib/progression";

export const Route = createFileRoute("/_authenticated/brief/$missionId")({
  head: () => ({
    meta: [
      { title: "Mission Briefing — CYBER//CITY" },
      {
        name: "description",
        content: "Read the incoming case before you accept your Cyber City mission.",
      },
      { property: "og:title", content: "Mission Briefing — CYBER//CITY" },
      {
        property: "og:description",
        content: "Incoming case: explore the evidence, then make the call.",
      },
    ],
  }),
  component: BriefScreen,
});

function BriefScreen() {
  const { missionId } = useParams({ from: "/_authenticated/brief/$missionId" });
  const { session } = useSession();
  const { data: agent } = useAgent(session?.user.id);
  const { data: runs = [] } = useMissionRuns(session?.user.id);

  if (!agent?.cert) return null;
  const mission = getMission(agent.cert, missionId);
  if (!mission) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h2>Case file not found</h2>
        <Button variant="hero" size="xl" className="mt-5" asChild>
          <Link to="/city">Return to Cyber City →</Link>
        </Button>
      </main>
    );
  }

  const index = missionsByCert[agent.cert].findIndex((m) => m.id === mission.id);
  const best = bestRunFor(runs, mission.id);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap gap-2.5">
        <span className="pill">
          {mission.boss ? "BOSS OPERATION" : `MISSION 0${index + 1}`}
        </span>
        <span className="pill">{agent.cert}</span>
        <span className="pill">{mission.skill}</span>
      </div>
      <p className="kicker mt-5">Incoming case</p>
      <h2 className="mt-2 mb-4">{mission.title}</h2>
      <div className="cyber-card">
        <h3 className="text-lg font-bold">{mission.brief}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{mission.desc}</p>
        {best && (
          <p className="mt-3 text-xs text-muted-foreground">
            Best result so far: rank {best.rank} · {best.score} points · {best.clues_found}/4 clues
          </p>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <Button variant="steel" size="xl" asChild>
          <Link to="/city">← Back to city</Link>
        </Button>
        <Button variant="hero" size="xl" asChild>
          <Link to="/mission/$missionId" params={{ missionId: mission.id }}>
            ACCEPT MISSION →
          </Link>
        </Button>
      </div>
      <AgentPhone agent={agent} />
    </main>
  );
}
