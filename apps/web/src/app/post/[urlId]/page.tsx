import { getPostByUrlId } from "@repo/db/service";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import LikeButton from "../../../components/LikeButton";
import ViewTracker from "../../../components/ViewTracker";
import { headers } from 'next/headers';

// Helper function to get client IP (similar to API route)
async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const cfConnectingIp = headersList.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || '127.0.0.1';
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return '127.0.0.1';
}

export default async function Page({ params }: { params: Promise<{ urlId: string }> }) {
  const { urlId } = await params;
  const clientIP = await getClientIP();
  const post = await getPostByUrlId(urlId, clientIP);

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
      {/* View tracker */}
      <ViewTracker postId={post.id} />
      
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
      
      {/* Like button and stats */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        margin: '24px 0' 
      }}>
        <LikeButton 
          postId={post.id} 
          initialLikes={post.likes} 
          initialUserHasLiked={post.userHasLiked || false}
        />
        <div style={{ fontSize: 14, color: "#666" }}>
          {post.views} views
        </div>
      </div>
      
      <div style={{ marginTop: 24 }}>
        <Link href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}