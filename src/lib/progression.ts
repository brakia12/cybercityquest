import { missionsByCert, type CertKey } from "@/lib/missions";

export interface RunRow {
  id: string;
  cert: string;
  mission_id: string;
  mission_title: string;
  score: number;
  rank: string;
  clues_found: number;
  xp_earned: number;
  correct: boolean;
  is_boss: boolean;
  created_at: string;
}

export const XP_PER_LEVEL = 500;

export function levelFor(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function levelProgress(xp: number) {
  const into = xp % XP_PER_LEVEL;
  return { into, needed: XP_PER_LEVEL, pct: Math.round((into / XP_PER_LEVEL) * 100) };
}

export function completedIds(runs: RunRow[], cert?: string) {
  return runs
    .filter((r) => r.correct && (!cert || r.cert === cert))
    .map((r) => r.mission_id);
}

export function bestRunFor(runs: RunRow[], missionId: string) {
  return runs
    .filter((r) => r.mission_id === missionId)
    .sort((a, b) => b.score - a.score)[0];
}

/** UTC day string, used for streak bookkeeping. */
export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function nextStreak(lastPlayedOn: string | null, current: number) {
  const now = today();
  if (lastPlayedOn === now) return { streak: Math.max(current, 1), changed: false, day: now };
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const streak = lastPlayedOn === yesterday ? current + 1 : 1;
  return { streak, changed: true, day: now };
}

export interface BadgeContext {
  runs: RunRow[];
  xp: number;
  streak: number;
  cert: CertKey | null;
}

export interface BadgeDef {
  key: string;
  icon: string;
  name: string;
  desc: string;
  earned: (ctx: BadgeContext) => boolean;
}

export const badgeDefs: BadgeDef[] = [
  {
    key: "first_case",
    icon: "🗂️",
    name: "First Case",
    desc: "Close your first mission.",
    earned: ({ runs }) => runs.length > 0,
  },
  {
    key: "right_call",
    icon: "✅",
    name: "Right Call",
    desc: "Make the correct decision on a case.",
    earned: ({ runs }) => runs.some((r) => r.correct),
  },
  {
    key: "clean_sweep",
    icon: "🔍",
    name: "Clean Sweep",
    desc: "Find all 4 clues in a single case.",
    earned: ({ runs }) => runs.some((r) => r.clues_found >= 4),
  },
  {
    key: "s_rank",
    icon: "🏅",
    name: "S-Rank Investigator",
    desc: "Earn an S rank on any mission.",
    earned: ({ runs }) => runs.some((r) => r.rank === "S"),
  },
  {
    key: "triple_threat",
    icon: "🎯",
    name: "Triple Threat",
    desc: "Solve three different missions correctly.",
    earned: ({ runs }) => new Set(completedIds(runs)).size >= 3,
  },
  {
    key: "boss_slayer",
    icon: "👑",
    name: "Boss Operator",
    desc: "Clear a boss operation at Security HQ.",
    earned: ({ runs }) => runs.some((r) => r.is_boss && r.correct),
  },
  {
    key: "questline_clear",
    icon: "🧭",
    name: "Questline Cleared",
    desc: "Solve every mission in one certification questline.",
    earned: ({ runs, cert }) =>
      Boolean(cert) &&
      missionsByCert[cert as CertKey].every((m) => completedIds(runs, cert as string).includes(m.id)),
  },
  {
    key: "streak_3",
    icon: "🔥",
    name: "On the Case",
    desc: "Play on 3 days in a row.",
    earned: ({ streak }) => streak >= 3,
  },
  {
    key: "streak_7",
    icon: "⚡",
    name: "Night Shift",
    desc: "Play on 7 days in a row.",
    earned: ({ streak }) => streak >= 7,
  },
  {
    key: "level_5",
    icon: "🚀",
    name: "Level 5 Agent",
    desc: "Reach agent level 5.",
    earned: ({ xp }) => levelFor(xp) >= 5,
  },
];

export function earnedBadgeKeys(ctx: BadgeContext) {
  return badgeDefs.filter((b) => b.earned(ctx)).map((b) => b.key);
}

export interface SkillNode {
  key: string;
  name: string;
  desc: string;
  missionId: string | null;
  requiredLevel: number;
}

/** A per-questline skill tree: one node per mission plus two mastery nodes. */
export function skillTree(cert: CertKey): SkillNode[] {
  const nodes: SkillNode[] = missionsByCert[cert].map((m, i) => ({
    key: m.id,
    name: m.skill,
    desc: m.boss ? `Unlocked by clearing ${m.title}` : `Unlocked by solving ${m.title}`,
    missionId: m.id,
    requiredLevel: i + 1,
  }));
  nodes.push(
    {
      key: `${cert}-mastery-1`,
      name: "Field Analyst",
      desc: "Reach agent level 4.",
      missionId: null,
      requiredLevel: 4,
    },
    {
      key: `${cert}-mastery-2`,
      name: "Lead Investigator",
      desc: "Reach agent level 8.",
      missionId: null,
      requiredLevel: 8,
    },
  );
  return nodes;
}

export function isSkillUnlocked(node: SkillNode, runs: RunRow[], xp: number, cert: CertKey) {
  if (node.missionId) return completedIds(runs, cert).includes(node.missionId);
  return levelFor(xp) >= node.requiredLevel;
}
