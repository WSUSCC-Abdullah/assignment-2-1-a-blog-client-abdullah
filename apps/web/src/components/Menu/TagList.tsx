import Link from "next/link";
import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { SummaryItem } from "./SummaryItem";

export function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = tags(posts); // Should return [{ name: string, count: number }, ...]

  return (
    <ul>
      {postTags.map((item) => (
        <li key={item.name}>
          <Link href={`/tag/${item.name.toLowerCase()}`}>
            <SummaryItem
              name={item.name}
              count={item.count}
              isSelected={selectedTag === item.name}
              title={`Posts tagged ${item.name}`}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}