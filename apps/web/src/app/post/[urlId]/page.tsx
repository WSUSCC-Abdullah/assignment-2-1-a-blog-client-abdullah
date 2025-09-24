import { getPostByUrlId } from "@repo/db/service";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import LikeButton from "../../../components/LikeButton";
import ViewTracker from "../../../components/ViewTracker";
import Comments from "../../../components/Comments";
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
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <div
        data-test-id={`blog-post-${post.id}`}
        style={{
          background: "var(--bg-primary)",
          borderRadius: "8px",
          boxShadow: "var(--shadow-md)",
          padding: "2rem",
          marginBottom: "2rem",
          border: "1px solid var(--border-color)"
        }}
      >
      {/* View tracker */}
      <ViewTracker postId={post.id} />
      
      <h1 style={{ 
        marginBottom: "1rem", 
        fontSize: "2rem", 
        fontWeight: "bold", 
        color: "var(--text-primary)",
        lineHeight: 1.3
      }}>{post.title}</h1>
      
      <div style={{ 
        color: "var(--text-secondary)", 
        fontSize: "0.875rem", 
        marginBottom: "1.5rem",
        fontWeight: "500"
      }}>
        📅 {new Date(post.date).toLocaleDateString()}
      </div>
      
      <img
        src={post.imageUrl}
        alt={post.title}
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "auto",
          borderRadius: "8px",
          margin: "1.5rem 0",
          display: "block",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      />
      <div style={{ marginBottom: "1.5rem" }}>
        {post.tags.split(",").map((tag) => (
          <span
            key={tag}
            style={{
              background: "var(--bg-accent)",
              color: "var(--text-secondary)",
              borderRadius: "4px",
              padding: "0.25rem 0.5rem",
              marginRight: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              display: "inline-block",
              marginBottom: "0.25rem"
            }}
          >
            #{tag.trim()}
          </span>
        ))}
      </div>
      
      <div style={{ 
        margin: "2rem 0", 
        fontSize: "1rem", 
        lineHeight: 1.8,
        color: "var(--text-secondary)"
      }}>
        <ReactMarkdown>{post.content || ""}</ReactMarkdown>
      </div>
      
      {/* Like button and stats */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        margin: '2rem 0',
        padding: '1rem 0',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <LikeButton 
          postId={post.id} 
          initialLikes={post.likes} 
          initialUserHasLiked={post.userHasLiked || false}
        />
        <div style={{ 
          fontSize: "0.875rem", 
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem"
        }}>
          👀 {post.views} views
        </div>
      </div>
      
      <div style={{ marginTop: "1.5rem" }}>
        <Link href="/" style={{ 
          color: "var(--primary-color)", 
          textDecoration: "none",
          fontWeight: "500",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          ← Back to Home
        </Link>
      </div>
      </div>
      
      {/* Comments Section */}
      <Comments postId={post.id} />
    </div>
  );
}