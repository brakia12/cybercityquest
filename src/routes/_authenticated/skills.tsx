import { createFileRoute, Link } from "@tanstack/react-router";

import { AgentPhone } from "@/components/AgentPhone";
import { Button } from "@/components/ui/button";
import { useAgent, useSession } from "@/lib/agent";
import { useMissionRuns } from "@/lib/game";
import { questFor } from "@/lib/missions";
import { isSkillUnlocked, levelFor, skillTree } from "@/lib/progression";

export const Route = createFileRoute("/_authenticated/skills")({
  head: () => ({
    meta: [
      { title: "Skill Tree — CYBER//CITY" },
      {
        name: "description",
        content:
          "See which cybersecurity skills your questline has unlocked and what the next case will teach you.",
      },
      { property: "og:title", content: "Skill Tree — CYBER//CITY" },
      { property: "og:description", content: "Your certification skills, unlocked case by case." },
    ],
  }),
  component: SkillsScreen,
});

function SkillsScreen() {
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: agent } = useAgent(userId);
  const { data: runs = [] } = useMissionRuns(userId);

  if (!agent?.cert) return null;
  const quest = questFor(agent.cert);
  const nodes = skillTree(agent.cert);
  const unlockedCount = nodes.filter((n) =>
    isSkillUnlocked(n, runs, agent.xp, agent.cert!),
  ).length;

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <p className="kicker">{quest.quest}</p>
      <h2 className="mt-2">Skill tree · {agent.cert}</h2>
      <p className="mt-2 text-muted-foreground">
        {unlockedCount} of {nodes.length} skills unlocked · Level {levelFor(agent.xp)}
      </p>

      <div className="mt-6 grid gap-3">
        {nodes.map((node, i) => {
          const unlocked = isSkillUnlocked(node, runs, agent.xp, agent.cert!);
          return (
            <div key={node.key} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-bold ${
                    unlocked
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {unlocked ? "✓" : i + 1}
                </div>
                {i < nodes.length - 1 && (
                  <div
                    className={`w-px flex-1 ${unlocked ? "bg-primary/50" : "bg-border"}`}
                    aria-hidden
                  />
                )}
              </div>
              <div className={`cyber-card flex-1 ${unlocked ? "border-primary" : "opacity-60"}`}>
                <strong>{node.name}</strong>
                <div className="text-sm text-muted-foreground">{node.desc}</div>
                <span className="pill mt-2">{unlocked ? "UNLOCKED" : "LOCKED"}</span>
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
          <Link to="/badges">Trophy case</Link>
        </Button>
      </div>
      <AgentPhone agent={agent} />
    </main>
  );
}
