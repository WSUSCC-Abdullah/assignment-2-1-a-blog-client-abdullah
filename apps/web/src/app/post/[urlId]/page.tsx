import { posts } from "@repo/db/data";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ urlId: string }> }) {
  const { urlId } = await params;
  const post = posts.find((p) => p.urlId === urlId);

  if (!post) {
    return <div style={{ padding: 32 }}>Article not found</div>;
  }

  return (
    <div
      data-test-id={`blog-post-${post.id}`}
      style={{
        maxWidth: 700,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: 32,
      }}
    >
      <h1 style={{ marginBottom: 8 }}>{post.title}</h1>
      <div style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>
        {new Date(post.date).toLocaleDateString()}
      </div>
      <img
        src={post.imageUrl}
        alt={post.title}
        style={{
          width: "100%",
          maxWidth: 400,
          height: "auto",
          borderRadius: 8,
          margin: "16px 0",
          display: "block",
        }}
      />
      <div style={{ marginBottom: 12 }}>
        {post.tags.split(",").map((tag) => (
          <span
            key={tag}
            style={{
              background: "var(--tag-bg)",
              color: "var(--tag-color)",
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
      <div style={{ margin: "24px 0", fontSize: 16, lineHeight: 1.7 }}>
        <ReactMarkdown>{post.description || ""}</ReactMarkdown>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
        {post.likes} likes &middot; {post.views} views
      </div>
      <div style={{ marginTop: 24 }}>
        <Link href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}