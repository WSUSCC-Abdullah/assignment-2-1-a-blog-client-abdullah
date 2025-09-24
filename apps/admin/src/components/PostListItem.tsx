import Link from 'next/link';
import { Post } from '@repo/db/data';

interface PostListItemProps {
  post: Post;
  onToggleActive: (postId: number) => void;
}

export default function PostListItem({ post, onToggleActive }: PostListItemProps) {
  const handleToggleActive = () => {
    onToggleActive(post.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6 hover:shadow-md dark:hover:shadow-gray-700/70 transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-24 h-24 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/96x96?text=No+Image';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link
                href={`/posts/${post.id}/edit`}
                className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {post.title}
              </Link>
              
              <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {post.description}
              </p>

              {/* Metadata */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  {post.category}
                </span>
                
                <div className="flex items-center space-x-1">
                  <span>Tags:</span>
                  <div className="flex space-x-1">
                    {post.tags.split(',').filter(tag => tag.trim()).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <span>
                  Created: {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Active Status Button */}
            <div className="flex-shrink-0 ml-4">
              <button
                onClick={handleToggleActive}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  post.active
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                }`}
              >
                {post.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}