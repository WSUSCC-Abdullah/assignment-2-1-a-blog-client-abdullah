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
          <Link href={`/tags/${item.name.toLowerCase().replace(/\s+/g, '-')}`} title={`Tag / ${item.name}`}>
            <SummaryItem
              name={item.name}
              count={item.count}
              isSelected={selectedTag === item.name}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}