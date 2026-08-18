import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { CertKey } from "@/lib/missions";
import type { RunRow } from "@/lib/progression";

const RUN_COLUMNS =
  "id, cert, mission_id, mission_title, score, rank, clues_found, xp_earned, correct, is_boss, created_at";

export function useMissionRuns(userId?: string) {
  return useQuery({
    queryKey: ["mission_runs", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<RunRow[]> => {
      const { data, error } = await supabase
        .from("mission_runs")
        .select(RUN_COLUMNS)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RunRow[];
    },
  });
}

export function useBadges(userId?: string) {
  return useQuery({
    queryKey: ["badges", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select("badge_key, earned_at")
        .eq("user_id", userId!);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAwardBadges(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (keys: string[]) => {
      if (!userId || keys.length === 0) return [];
      const { data, error } = await supabase
        .from("badges")
        .upsert(
          keys.map((badge_key) => ({ user_id: userId, badge_key })),
          { onConflict: "user_id,badge_key", ignoreDuplicates: true },
        )
        .select("badge_key");
      if (error) throw error;
      return data ?? [];
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["badges", userId] });
    },
  });
}

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  skin: string;
  hair: string;
  outfit: string;
  cert: CertKey | null;
  xp: number;
  streak_count: number;
  badges: number;
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const [agentsRes, badgeRes] = await Promise.all([
        supabase
          .from("agents")
          .select("user_id, name, skin, hair, outfit, cert, xp, streak_count")
          .order("xp", { ascending: false })
          .limit(50),
        supabase.from("badges").select("user_id"),
      ]);
      if (agentsRes.error) throw agentsRes.error;
      if (badgeRes.error) throw badgeRes.error;

      const counts = new Map<string, number>();
      for (const row of badgeRes.data ?? []) {
        counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1);
      }
      return (agentsRes.data ?? []).map((a) => ({
        ...(a as Omit<LeaderboardEntry, "badges" | "cert">),
        cert: a.cert as CertKey | null,
        badges: counts.get(a.user_id) ?? 0,
      }));
    },
  });
}

export type AppRole = "student" | "teacher" | "admin";

export function useRoles(userId?: string) {
  return useQuery({
    queryKey: ["roles", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<AppRole[]> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });
}

export function useClaimRole(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (role: Exclude<AppRole, "admin">) => {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId!, role }, { onConflict: "user_id,role", ignoreDuplicates: true });
      if (error) throw error;
      return role;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["roles", userId] });
    },
  });
}

export function useMyClasses(userId?: string) {
  return useQuery({
    queryKey: ["classes", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("id, name, join_code, teacher_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

function makeJoinCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("");
}

export function useCreateClass(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("classes")
        .insert({ name, teacher_id: userId!, join_code: makeJoinCode() })
        .select("id, name, join_code, teacher_id, created_at")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["classes", userId] });
    },
  });
}

export function useJoinClass(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.rpc("join_class_by_code", { _code: code });
      if (error) throw error;
      return data as string;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["classes", userId] });
    },
  });
}

export interface RosterRow {
  user_id: string;
  name: string;
  cert: CertKey | null;
  xp: number;
  streak_count: number;
  runs: RunRow[];
}

export function useClassRoster(classId: string) {
  return useQuery({
    queryKey: ["roster", classId],
    queryFn: async (): Promise<RosterRow[]> => {
      const { data: members, error } = await supabase
        .from("class_members")
        .select("user_id")
        .eq("class_id", classId);
      if (error) throw error;
      const ids = (members ?? []).map((m) => m.user_id);
      if (ids.length === 0) return [];

      const [agentsRes, runsRes] = await Promise.all([
        supabase
          .from("agents")
          .select("user_id, name, cert, xp, streak_count")
          .in("user_id", ids),
        supabase.from("mission_runs").select(RUN_COLUMNS + ", user_id").in("user_id", ids),
      ]);
      if (agentsRes.error) throw agentsRes.error;
      if (runsRes.error) throw runsRes.error;

      const runsByUser = new Map<string, RunRow[]>();
      for (const run of (runsRes.data ?? []) as (RunRow & { user_id: string })[]) {
        runsByUser.set(run.user_id, [...(runsByUser.get(run.user_id) ?? []), run]);
      }

      return ids.map((id) => {
        const agent = (agentsRes.data ?? []).find((a) => a.user_id === id);
        return {
          user_id: id,
          name: agent?.name ?? "Unregistered agent",
          cert: (agent?.cert ?? null) as CertKey | null,
          xp: agent?.xp ?? 0,
          streak_count: agent?.streak_count ?? 0,
          runs: runsByUser.get(id) ?? [],
        };
      });
    },
  });
}
