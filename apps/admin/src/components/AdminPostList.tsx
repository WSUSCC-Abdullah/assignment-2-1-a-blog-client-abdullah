'use client';

import { useState, useMemo } from 'react';
import { Post } from '@repo/db/data';
import PostFilter, { PostFilters, PostSorting } from './PostFilter';
import PostListItem from './PostListItem';
import Link from 'next/link';

interface AdminPostListProps {
  initialPosts: Post[];
}

export default function AdminPostList({ initialPosts }: AdminPostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filters, setFilters] = useState<PostFilters>({
    searchTerm: '',
    selectedTags: [],
    dateFrom: '',
    dateTo: '',
    visibility: 'all',
  });
  const [sorting, setSorting] = useState<PostSorting>({
    field: 'title',
    direction: 'asc',
  });

  // Get available tags from all posts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.split(',').forEach(tag => {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
          tagSet.add(trimmedTag);
        }
      });
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(searchLower);
        const matchesContent = post.content.toLowerCase().includes(searchLower);
        const matchesDescription = post.description.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesContent && !matchesDescription) {
          return false;
        }
      }

      // Tags filter
      if (filters.selectedTags.length > 0) {
        const postTags = post.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        const hasSelectedTag = filters.selectedTags.some(selectedTag => 
          postTags.includes(selectedTag)
        );
        if (!hasSelectedTag) {
          return false;
        }
      }

      // Date filter
      if (filters.dateFrom) {
        const postDate = new Date(post.date);
        const fromDate = new Date(filters.dateFrom);
        if (postDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const postDate = new Date(post.date);
        const toDate = new Date(filters.dateTo);
        if (postDate > toDate) {
          return false;
        }
      }

      // Visibility filter
      if (filters.visibility !== 'all') {
        const isActive = filters.visibility === 'active';
        if (post.active !== isActive) {
          return false;
        }
      }

      return true;
    });

    // Sort posts
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sorting.field === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sorting.field === 'createdAt') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return sorting.direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [posts, filters, sorting]);

  const handleToggleActive = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, active: !post.active }
          : post
      )
    );
  };

  return (
    <div>
      {/* Header with Create button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Posts ({filteredAndSortedPosts.length})
        </h1>
        <Link
          href="/posts/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Create Post
        </Link>
      </div>

      {/* Filter Component */}
      <PostFilter
        filters={filters}
        sorting={sorting}
        availableTags={availableTags}
        onFiltersChange={setFilters}
        onSortingChange={setSorting}
      />

      {/* Posts List */}
      <div className="space-y-4">
        {filteredAndSortedPosts.length > 0 ? (
          filteredAndSortedPosts.map(post => (
            <PostListItem
              key={post.id}
              post={post}
              onToggleActive={handleToggleActive}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No posts found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}