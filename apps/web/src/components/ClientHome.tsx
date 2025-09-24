import { useState } from "react";
import { BlogList } from "./Blog/List";
import { PaginationControls } from "./PaginationControls";
import type { Post } from "@repo/db/data";

interface ClientHomeProps {
  posts: Post[];
  search: string;
}

const POSTS_PER_PAGE = 5;

export default function ClientHome({ posts, search }: ClientHomeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredPosts = posts.filter(p => p.active).filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div style={{ 
      maxWidth: "900px", 
      margin: "0 auto", 
      padding: "2rem 1rem" 
    }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "3rem" 
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "bold", 
          color: "var(--text-primary)", 
          marginBottom: "0.75rem",
          lineHeight: "1.2"
        }}>
          From the blog
        </h1>
        <p style={{ 
          fontSize: "1.125rem", 
          color: "var(--text-secondary)", 
          lineHeight: "1.6",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          Learn how to grow your business with our expert advice.
        </p>
      </div>

      {/* Blog Posts */}
      <BlogList posts={paginatedPosts} />
      
      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}