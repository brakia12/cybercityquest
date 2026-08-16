import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/agent";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Agent Access — CYBER//CITY" },
      {
        name: "description",
        content:
          "Sign in or create an agent account to enter Cyber City and play your certification questline mission.",
      },
      { property: "og:title", content: "Agent Access — CYBER//CITY" },
      {
        property: "og:description",
        content: "Sign in to save your agent, questline, and mission XP in Cyber City.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/creator" });
  }, [session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          });
    const { error } = await fn;
    setBusy(false);
    if (error) setMessage(error.message);
    else if (mode === "signup") setMessage("Account created. If email confirmation is on, check your inbox.");
  }

  async function google() {
    setMessage(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setMessage("Google sign-in failed. Try email instead.");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
      <Link to="/" className="kicker mb-3">
        ← CYBER//CITY
      </Link>
      <h2>{mode === "signin" ? "Agent access" : "Create your agent account"}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your agent, questline, and XP are saved to your account.
      </p>

      <form onSubmit={submit} className="cyber-card mt-6 grid gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm outline-none focus:border-accent"
            placeholder="agent@northstar.example"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm outline-none focus:border-accent"
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" variant="hero" size="xl" disabled={busy}>
          {mode === "signin" ? "SIGN IN →" : "CREATE AGENT ACCOUNT →"}
        </Button>
        <Button type="button" variant="steel" size="xl" onClick={google}>
          Continue with Google
        </Button>
        {message && <p className="text-sm text-destructive">{message}</p>}
      </form>

      <button
        type="button"
        className="mt-4 text-sm text-muted-foreground underline underline-offset-4"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin" ? "No account yet? Create one" : "Already have an agent? Sign in"}
      </button>
    </main>
  );
}
