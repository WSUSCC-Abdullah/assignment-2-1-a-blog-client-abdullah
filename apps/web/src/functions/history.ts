export type HistoryItem = {
  year: string;
  month: string; // "01", "02", etc.
  count: number;
};

export function history(posts: { date: Date; active: boolean }[]): HistoryItem[] {
  // Only consider active posts
  const filtered = posts.filter((p) => p.active);

  // Map to { year, month }
  const counts: Record<string, HistoryItem> = {};

  filtered.forEach((p) => {
    const date = new Date(p.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const key = `${year}-${month}`;
    if (!counts[key]) {
      counts[key] = { year, month, count: 0 };
    }
    counts[key].count += 1;
  });

  // Convert to array and sort from most recent to oldest
  return Object.values(counts).sort((a, b) => {
    if (a.year !== b.year) return Number(b.year) - Number(a.year);
    return Number(b.month) - Number(a.month);
  });
}