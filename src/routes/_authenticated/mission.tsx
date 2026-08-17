import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AgentPhone } from "@/components/AgentPhone";
import { supabase } from "@/integrations/supabase/client";

import { useAgent, useSaveAgent, useSession } from "@/lib/agent";
import { missions, scoreMission, tabLabels, type TabKey } from "@/lib/missions";

export const Route = createFileRoute("/_authenticated/mission")({
  head: () => ({
    meta: [
      { title: "Case File 001 — CYBER//CITY" },
      {
        name: "description",
        content:
          "Investigate the alert, user, logs, and device evidence, then make the call and learn why it was right.",
      },
      { property: "og:title", content: "Case File 001 — CYBER//CITY" },
      { property: "og:description", content: "Pin the clues that matter, then choose your response." },
    ],
  }),
  component: MissionScreen,
});

const tabKeys: TabKey[] = ["alert", "user", "logs", "device"];

function MissionScreen() {
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: agent } = useAgent(userId);
  const save = useSaveAgent(userId);
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabKey>("alert");
  const [pinned, setPinned] = useState<Record<string, string>>({});
  const [chosen, setChosen] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  if (!agent?.cert) return null;
  const mission = missions[agent.cert];
  const clueCount = Math.min(Object.keys(pinned).length, 4);

  function pin(key: string, text: string) {
    setPinned((p) => (p[key] ? p : { ...p, [key]: text }));
  }

  async function decide(index: number) {
    if (chosen !== null || !agent?.cert) return;
    setChosen(index);
    setSaving(true);
    const correct = index === mission.correct;
    const result = scoreMission(correct, Object.keys(pinned).length);

    const { data, error } = await supabase
      .from("mission_runs")
      .insert({
        user_id: userId!,
        cert: agent.cert,
        mission_title: mission.title,
        score: result.score,
        rank: result.rank,
        clues_found: result.clues,
        xp_earned: result.xp,
        correct,
      })
      .select("id")
      .single();

    if (!error && data) {
      await save.mutateAsync({ xp: agent.xp + result.xp });
      setTimeout(() => navigate({ to: "/result/$runId", params: { runId: data.id } }), 1400);
    } else {
      setSaving(false);
    }
  }

  return (
    <main className="grid min-h-screen md:grid-cols-[235px_1fr]">
      <aside className="border-b border-border bg-[oklch(0.176_0.019_255.8)] p-5 md:border-b-0 md:border-r">
        <p className="kicker">Case file 001</p>
        <h3 className="mt-1 text-lg font-bold">{mission.title}</h3>
        <p className="text-xs text-muted-foreground">Find evidence before choosing your response.</p>
        <div className="mt-4 grid gap-1">
          {tabKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`w-full rounded-[10px] px-3 py-2.5 text-left text-sm ${
                tab === key ? "bg-[oklch(0.24_0.027_253.4)] text-foreground" : "text-muted-foreground hover:bg-[oklch(0.24_0.027_253.4)]"
              }`}
            >
              {tabLabels[key].nav}
            </button>
          ))}
        </div>
        <div className="cyber-card mt-4">
          <div className="text-xs text-muted-foreground">EVIDENCE FOUND</div>
          <strong className="text-2xl">{clueCount}/4</strong>
          <div className="text-xs text-muted-foreground">Optional clues improve your rank.</div>
        </div>
      </aside>

      <section className="grid gap-4 p-6 lg:grid-cols-[1fr_310px] lg:p-8">
        <div className="cyber-panel min-h-[420px]">
          <p className="kicker">{tab.toUpperCase()}</p>
          <h3 className="mt-1 text-2xl font-bold">{tabLabels[tab].heading}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap evidence that you think matters to the case.
          </p>
          {mission.tabs[tab].map((text, i) => {
            const key = `${tab}${i}`;
            const found = Boolean(pinned[key]);
            return (
              <button
                key={key}
                type="button"
                onClick={() => pin(key, text)}
                className={`mt-2.5 block w-full rounded-xl border p-3 text-left text-sm ${
                  found
                    ? "border-primary bg-[color-mix(in_oklab,var(--lime)_8%,transparent)]"
                    : "border-border bg-[oklch(0.19_0.025_259.2)] hover:border-accent"
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>

        <div>
          <div className="cyber-panel">
            <p className="kicker">Case notes</p>
            {Object.keys(pinned).length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No clues pinned yet.</p>
            ) : (
              <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground">
                {Object.entries(pinned).map(([key, text]) => (
                  <li key={key}>✓ {text}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="cyber-panel mt-3.5">
            <p className="kicker">Make the call</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You can decide at any time, but stronger investigators gather evidence first.
            </p>
            {mission.decision.map((text, i) => (
              <button
                key={text}
                type="button"
                disabled={chosen !== null}
                onClick={() => decide(i)}
                className={`mt-2.5 block w-full rounded-xl border p-3 text-left text-sm disabled:opacity-80 ${
                  chosen === i
                    ? i === mission.correct
                      ? "border-primary"
                      : "border-destructive"
                    : "border-border bg-[oklch(0.215_0.027_255.8)] hover:border-accent"
                }`}
              >
                {text}
              </button>
            ))}
            {chosen !== null && (
              <div
                className={`mt-3 rounded-xl border p-3 text-sm ${
                  chosen === mission.correct ? "border-primary" : "border-destructive"
                }`}
                role="status"
              >
                {mission.feedback[chosen]}
                <div className="mt-2 text-xs text-muted-foreground">
                  {saving ? "Filing your report…" : ""}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <AgentPhone agent={agent} />

    </main>
  );
}
