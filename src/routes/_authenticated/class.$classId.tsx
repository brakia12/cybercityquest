import { createFileRoute, Link, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useClassRoster, useMyClasses } from "@/lib/game";
import { useSession } from "@/lib/agent";
import { missionsByCert } from "@/lib/missions";
import { completedIds, levelFor } from "@/lib/progression";

export const Route = createFileRoute("/_authenticated/class/$classId")({
  head: () => ({
    meta: [
      { title: "Class Roster — CYBER//CITY" },
      {
        name: "description",
        content: "Teacher view: every student's questline, level, XP, streak, and cases cleared.",
      },
      { property: "og:title", content: "Class Roster — CYBER//CITY" },
      { property: "og:description", content: "Track student progress case by case." },
    ],
  }),
  component: ClassScreen,
});

function ClassScreen() {
  const { classId } = useParams({ from: "/_authenticated/class/$classId" });
  const { session } = useSession();
  const { data: classes = [] } = useMyClasses(session?.user.id);
  const { data: roster = [], isLoading } = useClassRoster(classId);

  const klass = classes.find((c) => c.id === classId);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <p className="kicker">Class roster</p>
      <h2 className="mt-2">{klass?.name ?? "Class"}</h2>
      {klass && (
        <p className="mt-1 text-sm text-muted-foreground">
          Join code: <span className="font-mono tracking-widest">{klass.join_code}</span> ·{" "}
          {roster.length} student{roster.length === 1 ? "" : "s"}
        </p>
      )}

      {isLoading ? (
        <p className="kicker mt-6">Loading roster…</p>
      ) : roster.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          No students yet. Share the join code so agents can enrol.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="p-3">AGENT</th>
                <th className="p-3">QUESTLINE</th>
                <th className="p-3">LEVEL</th>
                <th className="p-3">XP</th>
                <th className="p-3">STREAK</th>
                <th className="p-3">CASES CLEARED</th>
                <th className="p-3">BEST RANK</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((s) => {
                const total = s.cert ? missionsByCert[s.cert].length : 4;
                const cleared = new Set(completedIds(s.runs, s.cert ?? undefined)).size;
                const bestRank =
                  ["S", "A", "B", "C"].find((r) => s.runs.some((run) => run.rank === r)) ?? "—";
                return (
                  <tr key={s.user_id} className="border-t border-border">
                    <td className="p-3 font-bold">{s.name}</td>
                    <td className="p-3 text-muted-foreground">{s.cert ?? "Not chosen"}</td>
                    <td className="p-3">{levelFor(s.xp)}</td>
                    <td className="p-3 text-primary">{s.xp}</td>
                    <td className="p-3">🔥 {s.streak_count}</td>
                    <td className="p-3">
                      {cleared}/{total}
                    </td>
                    <td className="p-3">{bestRank}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2.5">
        <Button variant="steel" size="xl" asChild>
          <Link to="/classroom">← All classes</Link>
        </Button>
        <Button variant="hero" size="xl" asChild>
          <Link to="/city">Cyber City →</Link>
        </Button>
      </div>
    </main>
  );
}
