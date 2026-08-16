import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/agent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CYBER//CITY — Learn Cybersecurity by Solving Missions" },
      {
        name: "description",
        content:
          "Create an agent, pick a certification questline, and solve an interactive cybersecurity mission in Cyber City instead of memorizing notes.",
      },
      { property: "og:title", content: "CYBER//CITY — Learn Cybersecurity by Solving Missions" },
      {
        property: "og:description",
        content:
          "A character-driven cybersecurity adventure: explore evidence, make the call, and learn why it was right.",
      },
    ],
  }),
  component: TitleScreen,
});

function TitleScreen() {
  const { session } = useSession();

  return (
    <main className="mx-auto max-w-6xl px-5 py-6">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm font-black tracking-[0.08em]">
          <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-primary-foreground">
            C
          </span>
          CYBER//CITY
        </div>
        <span className="text-xs text-muted-foreground">
          Game-first cybersecurity learning
        </span>
      </header>

      <section className="grid items-center gap-7 rounded-[28px] border border-border bg-[oklch(0.17_0.02_260)] p-8 shadow-[var(--shadow-cyber)] md:grid-cols-[1.1fr_0.9fr] md:min-h-[620px] md:p-12">
        <div>
          <p className="kicker">New transmission received</p>
          <h1 className="mt-3 mb-4">
            Cybersecurity
            <br />
            is your world now.
          </h1>
          <p className="max-w-[560px] text-lg leading-relaxed text-muted-foreground">
            Create your agent. Pick the certification questline you want to train for. Explore
            Cyber City and learn by solving missions—not by memorizing a wall of notes.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button variant="hero" size="xl" asChild>
              <Link to={session ? "/creator" : "/auth"}>NEW GAME →</Link>
            </Button>
            <Button variant="outlineCyber" size="xl" asChild>
              <Link to={session ? "/city" : "/auth"}>CONTINUE</Link>
            </Button>
          </div>
        </div>

        <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-border bg-[linear-gradient(180deg,#111a27_0_45%,#111724_45%_100%)] md:h-[530px]">
          <div className="absolute left-1/2 top-16 size-[190px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#d8fbff,#77d7ed_70%,#4a8192)] shadow-[0_0_70px_rgba(105,231,255,.28)]" />
          <div
            className="absolute inset-x-0 bottom-0 h-[210px] bg-[linear-gradient(90deg,#111827_5%,#182236_5%_14%,#101725_14%_22%,#1b2840_22%_34%,#0f1725_34%_46%,#1a2536_46%_56%,#101826_56%_68%,#1d2a3f_68%_79%,#101624_79%_100%)]"
            style={{
              clipPath:
                "polygon(0 35%,8% 35%,8% 15%,15% 15%,15% 47%,23% 47%,23% 25%,33% 25%,33% 5%,42% 5%,42% 42%,52% 42%,52% 20%,61% 20%,61% 52%,70% 52%,70% 8%,80% 8%,80% 38%,90% 38%,90% 18%,100% 18%,100% 100%,0 100%)",
            }}
          />
          <div className="absolute bottom-14 left-1/2 h-[230px] w-[125px] -translate-x-1/2">
            <div className="absolute left-[35px] top-0 size-[58px] rounded-full bg-[#17121a]" />
            <div className="absolute left-[17px] top-[50px] h-[145px] w-[95px] rounded-[40px_40px_20px_20px] border border-[#445068] bg-[#1e2432]" />
            <div className="absolute -right-1.5 top-[78px] h-[70px] w-[38px] rounded-[10px] border-2 border-[#627087] bg-[#07090d] shadow-[0_0_25px_rgba(105,231,255,.28)]" />
          </div>
        </div>
      </section>
    </main>
  );
}
