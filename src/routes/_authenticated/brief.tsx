import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useAgent, useSession } from "@/lib/agent";
import { missions } from "@/lib/missions";

export const Route = createFileRoute("/_authenticated/brief")({
  head: () => ({
    meta: [
      { title: "Mission Briefing — CYBER//CITY" },
      {
        name: "description",
        content: "Read the incoming case before you accept your Cyber City mission.",
      },
      { property: "og:title", content: "Mission Briefing — CYBER//CITY" },
      { property: "og:description", content: "Incoming case: explore the evidence, then make the call." },
    ],
  }),
  component: BriefScreen,
});

function BriefScreen() {
  const { session } = useSession();
  const { data: agent } = useAgent(session?.user.id);
  if (!agent?.cert) return null;
  const mission = missions[agent.cert];

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap gap-2.5">
        <span className="pill">MISSION 01</span>
        <span className="pill">{agent.cert}</span>
      </div>
      <p className="kicker mt-5">Incoming case</p>
      <h2 className="mt-2 mb-4">{mission.title}</h2>
      <div className="cyber-card">
        <h3 className="text-lg font-bold">{mission.brief}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{mission.desc}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <Button variant="steel" size="xl" asChild>
          <Link to="/city">← Back to city</Link>
        </Button>
        <Button variant="hero" size="xl" asChild>
          <Link to="/mission">ACCEPT MISSION →</Link>
        </Button>
      </div>
    </main>
  );
}
