'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({
    content: '',
    author: ''
  });
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.content.trim() || !newComment.author.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: newComment.content,
          author: newComment.author,
          email: 'user@example.com' // Default email since backend might require it
        })
      });

      if (response.ok) {
        setNewComment({ content: '', author: '' });
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const submitReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: replyContent,
          author: 'Anonymous', // Simplified for now
          email: 'anonymous@example.com', // Simplified for now
          parentId
        })
      });

      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  if (loading) {
    return <div style={{ opacity: 0.6 }}>Loading comments...</div>;
  }

  return (
    <div style={{ marginTop: "3rem", borderTop: "1px solid var(--border-color)", paddingTop: "2rem" }}>
      <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--text-primary)" }}>
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={submitComment} style={{ marginBottom: "2rem", background: "var(--bg-secondary)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Your name"
            value={newComment.author}
            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
            style={{ 
              width: "60%",
              maxWidth: "300px",
              padding: "0.5rem 0.75rem", 
              border: "1px solid var(--border-color)", 
              borderRadius: "4px",
              fontSize: "14px",
              background: "var(--input-bg)",
              color: "var(--text-primary)"
            }}
            required
          />
        </div>
        <textarea
          placeholder="Write your comment..."
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          style={{ 
            width: "100%", 
            padding: "0.5rem 0.75rem", 
            border: "1px solid var(--border-color)", 
            borderRadius: "4px", 
            height: "6rem", 
            resize: "none",
            fontSize: "14px",
            fontFamily: "inherit",
            background: "var(--input-bg)",
            color: "var(--text-primary)"
          }}
          required
        />
        <button
          type="submit"
          style={{ 
            marginTop: "0.75rem", 
            padding: "0.5rem 1.5rem", 
            background: "var(--primary-color)", 
            color: "white", 
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold"
          }}
        >
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <h4 style={{ fontWeight: "bold", color: "var(--text-primary)" }}>{comment.author}</h4>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.5 }}>{comment.content}</p>
            
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              style={{ 
                color: "var(--primary-color)", 
                fontSize: "0.875rem", 
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Reply
            </button>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div style={{ marginTop: "1rem", paddingLeft: "1.5rem", borderLeft: "2px solid var(--border-color)" }}>
                <textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  style={{ 
                    width: "90%", 
                    maxWidth: "500px",
                    padding: "0.5rem 0.75rem", 
                    border: "1px solid var(--border-color)", 
                    borderRadius: "4px", 
                    height: "5rem", 
                    resize: "none",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)"
                  }}
                />
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => submitReply(comment.id)}
                    style={{ 
                      padding: "0.25rem 1rem", 
                      background: "var(--primary-color)", 
                      color: "white", 
                      fontSize: "0.875rem", 
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    style={{ 
                      padding: "0.25rem 1rem", 
                      background: "var(--text-muted)", 
                      color: "white", 
                      fontSize: "0.875rem", 
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginTop: "1.5rem", paddingLeft: "1.5rem", borderLeft: "2px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} style={{ background: "var(--bg-secondary)", padding: "1rem", borderRadius: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <h5 style={{ fontWeight: "600", color: "var(--text-primary)" }}>{reply.author}</h5>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.4 }}>{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "2rem 0" }}>
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}