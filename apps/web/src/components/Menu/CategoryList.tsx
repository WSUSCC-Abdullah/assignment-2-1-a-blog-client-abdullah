import Link from "next/link";
import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {categories(posts).map((item) => (
        <li key={item.name}>
          <Link href={`/category/${toUrlPath(item.name)}`} title={`Category / ${item.name}`}>
            <SummaryItem
              count={item.count}
              name={item.name}
              isSelected={false} // Replace with logic if you want to highlight selected
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}