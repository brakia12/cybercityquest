import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AgentPhone } from "@/components/AgentPhone";
import { Button } from "@/components/ui/button";
import { useAgent, useSession } from "@/lib/agent";
import {
  useClaimRole,
  useCreateClass,
  useJoinClass,
  useMyClasses,
  useRoles,
} from "@/lib/game";

export const Route = createFileRoute("/_authenticated/classroom")({
  head: () => ({
    meta: [
      { title: "Classroom — CYBER//CITY" },
      {
        name: "description",
        content:
          "Students join a class with a code; teachers create classes and track every agent's mission progress.",
      },
      { property: "og:title", content: "Classroom — CYBER//CITY" },
      { property: "og:description", content: "Class codes, rosters, and student progress." },
    ],
  }),
  component: ClassroomScreen,
});

function ClassroomScreen() {
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: agent } = useAgent(userId);
  const { data: roles = [], isSuccess: rolesLoaded } = useRoles(userId);
  const { data: classes = [] } = useMyClasses(userId);
  const claimRole = useClaimRole(userId);
  const createClass = useCreateClass(userId);
  const joinClass = useJoinClass(userId);

  const [className, setClassName] = useState("");
  const [code, setCode] = useState("");

  const isTeacher = roles.includes("teacher");
  const owned = classes.filter((c) => c.teacher_id === userId);
  const joined = classes.filter((c) => c.teacher_id !== userId);

  async function handleCreate() {
    if (!className.trim()) return;
    try {
      await createClass.mutateAsync(className.trim());
      setClassName("");
      toast.success("Class created");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function handleJoin() {
    if (!code.trim()) return;
    try {
      await joinClass.mutateAsync(code.trim());
      setCode("");
      toast.success("You joined the class");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <p className="kicker">Classroom</p>
      <h2 className="mt-2">Classes & rosters</h2>

      {rolesLoaded && !isTeacher && (
        <div className="cyber-card mt-5">
          <strong>Are you a teacher?</strong>
          <p className="mt-1 text-sm text-muted-foreground">
            Switch on teacher tools to create classes and track student progress.
          </p>
          <Button
            variant="steel"
            className="mt-3"
            disabled={claimRole.isPending}
            onClick={() => claimRole.mutate("teacher")}
          >
            Enable teacher tools
          </Button>
        </div>
      )}

      <div className="cyber-panel mt-5">
        <p className="kicker">Join a class</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the six-character code your teacher gave you.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            aria-label="Class join code"
            maxLength={6}
            className="w-40 rounded-xl border border-border bg-[oklch(0.19_0.025_259.2)] px-3 py-2 font-mono tracking-widest"
          />
          <Button variant="hero" disabled={joinClass.isPending} onClick={handleJoin}>
            Join class
          </Button>
        </div>
      </div>

      {isTeacher && (
        <div className="cyber-panel mt-4">
          <p className="kicker">Create a class</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Period 3 — Cyber I"
              aria-label="Class name"
              className="min-w-[220px] flex-1 rounded-xl border border-border bg-[oklch(0.19_0.025_259.2)] px-3 py-2"
            />
            <Button variant="hero" disabled={createClass.isPending} onClick={handleCreate}>
              Create class
            </Button>
          </div>
        </div>
      )}

      {owned.length > 0 && (
        <section className="mt-6">
          <p className="kicker">Classes you teach</p>
          <div className="mt-3 grid gap-2">
            {owned.map((c) => (
              <Link
                key={c.id}
                to="/class/$classId"
                params={{ classId: c.id }}
                className="cyber-card flex items-center justify-between hover:border-accent"
              >
                <div>
                  <strong>{c.name}</strong>
                  <div className="text-xs text-muted-foreground">
                    Join code: <span className="font-mono tracking-widest">{c.join_code}</span>
                  </div>
                </div>
                <span className="pill">VIEW ROSTER →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {joined.length > 0 && (
        <section className="mt-6">
          <p className="kicker">Classes you're in</p>
          <div className="mt-3 grid gap-2">
            {joined.map((c) => (
              <div key={c.id} className="cyber-card">
                <strong>{c.name}</strong>
                <div className="text-xs text-muted-foreground">
                  Your teacher can see your mission progress and XP.
                </div>
              </div>
            ))}
          </div>
        </section>
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
