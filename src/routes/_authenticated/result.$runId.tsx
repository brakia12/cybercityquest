import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { missions, type CertKey } from "@/lib/missions";

export const Route = createFileRoute("/_authenticated/result/$runId")({
  head: () => ({
    meta: [
      { title: "Mission Complete — CYBER//CITY" },
      {
        name: "description",
        content: "Your mission rank, score, XP, and the cybersecurity concept the case taught you.",
      },
      { property: "og:title", content: "Mission Complete — CYBER//CITY" },
      { property: "og:description", content: "Case closed. See your rank, XP, and what you learned." },
    ],
  }),
  component: ResultScreen,
});

function ResultScreen() {
  const { runId } = useParams({ from: "/_authenticated/result/$runId" });

  const { data: run, isLoading } = useQuery({
    queryKey: ["mission_run", runId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mission_runs")
        .select("cert, mission_title, score, rank, clues_found, xp_earned, correct")
        .eq("id", runId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="kicker">Compiling report…</span>
      </div>
    );
  }

  if (!run) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h2>Report not found</h2>
        <Button variant="hero" size="xl" className="mt-5" asChild>
          <Link to="/city">Return to Cyber City →</Link>
        </Button>
      </main>
    );
  }

  const mission = missions[run.cert as CertKey];

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <p className="kicker">Mission complete</p>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="mt-2">{run.correct ? "Case closed." : "Mission reviewed."}</h2>
          <p className="mt-2 max-w-[640px] text-lg leading-relaxed text-muted-foreground">
            {run.correct
              ? `You made the right call and found ${run.clues_found} evidence clues. Strong investigators use context before acting.`
              : "You finished the case, but your final action increased risk. Review the evidence and replay to improve your rank."}
          </p>
        </div>
        <div className="text-[88px] font-black leading-none text-primary drop-shadow-[0_0_45px_rgba(204,255,77,.18)]">
          {run.rank}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "MISSION SCORE", value: run.score },
          { label: "XP EARNED", value: `+${run.xp_earned}` },
          { label: "CLUES FOUND", value: `${run.clues_found}/4` },
          { label: "QUESTLINE", value: run.cert },
        ].map((s) => (
          <div key={s.label} className="cyber-panel">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <b className="text-2xl">{s.value}</b>
          </div>
        ))}
      </div>

      <div className="cyber-card mt-4">
        <h3 className="text-lg font-bold">What you learned</h3>
        <p className="mt-2 text-sm text-muted-foreground">{mission.lesson}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <Button variant="hero" size="xl" asChild>
          <Link to="/city">Return to Cyber City →</Link>
        </Button>
        <Button variant="steel" size="xl" asChild>
          <Link to="/brief">Replay mission</Link>
        </Button>
      </div>
    </main>
  );
}
