const COUNTER_ID = 109559704;

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.ym === "function") {
    window.ym(COUNTER_ID, "reachGoal", goal, params);
  }
}
