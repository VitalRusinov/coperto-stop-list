const STEP_MS = 15 * 60 * 1000;
const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;

export type UntilSlot = {
  until: string;
  label: string;
};

export function buildUntilSlots(now: Date): UntilSlot[] {
  const nowMs = now.getTime();
  const first = Math.ceil((nowMs + 1) / STEP_MS) * STEP_MS;
  const slots: UntilSlot[] = [];

  for (let ts = first; ts - nowMs <= MAX_AHEAD_MS; ts += STEP_MS) {
    const date = new Date(ts);
    slots.push({
      until: date.toISOString(),
      label: formatSlotLabel(date, now),
    });
  }

  return slots;
}

function formatSlotLabel(date: Date, now: Date): string {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const day = date < tomorrowStart ? "сегодня" : "завтра";
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day}, ${time}`;
}
