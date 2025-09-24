import Link from "next/link";
import { history, type HistoryItem } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


export function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  // Explicitly type the result of history(posts)
  const historyItems: HistoryItem[] = history(posts);

  return (
    <ul>
      {historyItems.map(({ year, month, count }) => {
        // Ensure monthIndex is a valid number between 1 and 12
        const monthIndex = Number(month);
        const monthName =
          monthIndex >= 1 && monthIndex <= 12 ? months[monthIndex] : month;

        return (
          <li key={`${year}-${month}`}>
            <Link href={`/history/${year}/${month}`} title={`History / ${monthName}, ${year}`}>
              <SummaryItem
                name={`${monthName}, ${year}`}
                count={count}
                isSelected={selectedYear === year && selectedMonth === month}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}