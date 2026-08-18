import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { CertKey } from "@/lib/missions";

export interface Agent {
  user_id: string;
  name: string;
  skin: string;
  hair: string;
  outfit: string;
  cert: CertKey | null;
  xp: number;
  streak_count: number;
  longest_streak: number;
  last_played_on: string | null;
}

const AGENT_COLUMNS =
  "user_id, name, skin, hair, outfit, cert, xp, streak_count, longest_streak, last_played_on";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export function useAgent(userId?: string) {
  return useQuery({
    queryKey: ["agent", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Agent | null> => {
      const { data, error } = await supabase
        .from("agents")
        .select(AGENT_COLUMNS)
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as Agent | null;
    },
  });
}

export function useSaveAgent(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Agent>) => {
      const { data, error } = await supabase
        .from("agents")
        .upsert({ user_id: userId!, ...patch }, { onConflict: "user_id" })
        .select(AGENT_COLUMNS)
        .single();
      if (error) throw error;
      return data as Agent;
    },
    onSuccess: (data) => {
      qc.setQueryData(["agent", userId], data);
    },
  });
}
