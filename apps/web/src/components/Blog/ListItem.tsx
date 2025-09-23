import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article
      key={post.id}
      className="flex flex-row gap-8"
      data-test-id={`blog-post-${post.id}`}
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        alignItems: "flex-start",
      }}
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 4 }}
      />
      <div style={{ flex: 1 }}>
        <Link href={`/post/${post.id}`}>
          <h2 style={{ margin: 0 }}>{post.title}</h2>
        </Link>
        <div style={{ color: "#888", fontSize: 14 }}>
          {new Date(post.date).toLocaleDateString()}
        </div>
        <div style={{ margin: "8px 0" }}>{post.description}</div>
        <div>
          {post.tags.split(",").map((tag) => (
            <span
              key={tag}
              style={{
                background: "#f0f0f0",
                borderRadius: 4,
                padding: "2px 8px",
                marginRight: 8,
                fontSize: 12,
              }}
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
          {post.likes} likes &middot; {post.views} views
        </div>
      </div>
    </article>
  );
}