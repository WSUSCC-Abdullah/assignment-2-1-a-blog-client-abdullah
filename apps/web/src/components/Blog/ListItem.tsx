import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <div key={post.id} style={{ 
      marginBottom: "2rem", 
      padding: "1rem", 
      border: "1px solid var(--border-color)", 
      borderRadius: "8px",
      display: "flex",
      gap: "1rem",
      maxWidth: "800px",
      background: "var(--bg-primary)"
    }}>
      {/* Image on the left */}
      <img 
        src={post.imageUrl} 
        alt={post.title}
        style={{ 
          width: "250px", 
          height: "180px", 
          objectFit: "cover", 
          borderRadius: "4px",
          flexShrink: 0
        }} 
      />
      
      {/* Content on the right */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Date and Category */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric',
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <span style={{ 
            backgroundColor: "var(--bg-accent)", 
            color: "var(--primary-color)", 
            padding: "0.25rem 0.5rem", 
            borderRadius: "4px", 
            fontSize: "0.8rem"
          }}>
            {post.category}
          </span>
        </div>
        
        {/* Title */}
        <h2 style={{ 
          fontSize: "1.5rem", 
          fontWeight: "bold", 
          marginBottom: "0.5rem", 
          color: "var(--text-primary)",
          lineHeight: "1.3"
        }}>
          <Link href={`/post/${post.urlId}`} style={{ textDecoration: "none", color: "var(--text-primary)" }}>
            {post.title}
          </Link>
        </h2>
        
        {/* Description */}
        <p style={{ 
          color: "var(--text-secondary)", 
          lineHeight: "1.6", 
          marginBottom: "1rem",
          fontSize: "0.95rem"
        }}>
          {post.description}
        </p>
        
        {/* Tags */}
        <div style={{ marginBottom: "1rem" }}>
          {post.tags.split(",").slice(0, 4).map((tag) => (
            <span key={tag} style={{ 
              backgroundColor: "var(--bg-accent)", 
              color: "var(--text-secondary)", 
              padding: "0.25rem 0.5rem", 
              borderRadius: "4px", 
              fontSize: "0.8rem",
              marginRight: "0.5rem",
              marginBottom: "0.25rem",
              display: "inline-block"
            }}>
              #{tag.trim()}
            </span>
          ))}
        </div>
        
        {/* Views and Likes with icons */}
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          gap: "1.5rem", 
          fontSize: "0.9rem", 
          color: "var(--text-secondary)",
          marginTop: "auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span>👁️</span>
            <span>{post.views} views</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span>❤️</span>
            <span>{post.likes} likes</span>
          </div>
          <Link href={`/post/${post.urlId}`} style={{ 
            color: "var(--primary-color)", 
            textDecoration: "none", 
            marginLeft: "auto",
            fontWeight: "500"
          }}>
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
}