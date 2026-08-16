import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AgentAvatar } from "@/components/AgentAvatar";
import { Button } from "@/components/ui/button";
import { useAgent, useSaveAgent, useSession } from "@/lib/agent";

export const Route = createFileRoute("/_authenticated/creator")({
  head: () => ({
    meta: [
      { title: "Agent Creator — CYBER//CITY" },
      {
        name: "description",
        content: "Name your agent and choose their look before entering Cyber City.",
      },
      { property: "og:title", content: "Agent Creator — CYBER//CITY" },
      {
        property: "og:description",
        content: "Who are you in Cyber City? Build your agent in seconds.",
      },
    ],
  }),
  component: CreatorScreen,
});

const skins = ["#9c654a", "#c78867", "#744a36", "#4d3025"];
const outfits = ["#243550", "#552e67", "#1f503f", "#5a3b28"];
const hairs = [
  { key: "coils", label: "Coils" },
  { key: "bob", label: "Bob" },
  { key: "buzz", label: "Buzz" },
];

function CreatorScreen() {
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: agent } = useAgent(userId);
  const save = useSaveAgent(userId);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [skin, setSkin] = useState(skins[0]!);
  const [hair, setHair] = useState("coils");
  const [outfit, setOutfit] = useState(outfits[0]!);

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setSkin(agent.skin);
      setHair(agent.hair);
      setOutfit(agent.outfit);
    }
  }, [agent]);

  async function next() {
    await save.mutateAsync({ name: name.trim() || "Agent", skin, hair, outfit });
    navigate({ to: "/quest" });
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="kicker">Agent creator</p>
      <h2 className="mt-2 mb-6">Who are you in Cyber City?</h2>

      <div className="grid gap-6 md:grid-cols-[360px_1fr]">
        <div className="flex h-[520px] items-center justify-center rounded-3xl border border-border bg-[radial-gradient(circle_at_50%_35%,rgba(105,231,255,.13),transparent_30%),#0d141f] md:sticky md:top-6 md:h-[650px]">
          <AgentAvatar skin={skin} hair={hair} outfit={outfit} />
        </div>

        <div className="grid gap-3.5">
          <div className="cyber-card">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Agent name
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your agent name"
              className="w-full rounded-xl border border-border bg-input px-3.5 py-3.5 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="cyber-card">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Skin tone
            </p>
            <div className="flex flex-wrap gap-2.5">
              {skins.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Skin tone ${c}`}
                  onClick={() => setSkin(c)}
                  className={`size-10 rounded-xl border-2 ${skin === c ? "border-primary" : "border-transparent"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="cyber-card">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Hair
            </p>
            <div className="flex flex-wrap gap-2.5">
              {hairs.map((h) => (
                <Button
                  key={h.key}
                  type="button"
                  variant={hair === h.key ? "hero" : "steel"}
                  size="xl"
                  onClick={() => setHair(h.key)}
                >
                  {h.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="cyber-card">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Fit
            </p>
            <div className="flex flex-wrap gap-2.5">
              {outfits.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Outfit color ${c}`}
                  onClick={() => setOutfit(c)}
                  className={`size-10 rounded-xl border-2 ${outfit === c ? "border-primary" : "border-transparent"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="steel" size="xl" asChild>
              <Link to="/">← Back</Link>
            </Button>
            <Button variant="hero" size="xl" onClick={next} disabled={save.isPending}>
              Choose questline →
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
