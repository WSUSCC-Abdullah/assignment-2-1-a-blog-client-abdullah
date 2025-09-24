'use client';

import { useState, useRef } from 'react';
import { Post } from '@repo/db/data';

interface PostFormData {
  title: string;
  description: string;
  content: string;
  tags: string;
  imageUrl: string;
}

interface PostFormProps {
  initialData?: Post;
  isEdit?: boolean;
  onSave: (data: PostFormData) => Promise<void>;
}

interface FormErrors {
  title?: string;
  description?: string;
  content?: string;
  tags?: string;
  imageUrl?: string;
}

export default function PostForm({ initialData, isEdit = false, onSave }: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    tags: initialData?.tags || '',
    imageUrl: initialData?.imageUrl || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else {
      // Basic URL validation
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Please enter a valid URL';
      }
    }

    return newErrors;
  };

  const handleChange = (field: keyof PostFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePreviewToggle = () => {
    if (isPreview) {
      // Closing preview - restore cursor position
      setIsPreview(false);
      setTimeout(() => {
        if (contentTextareaRef.current) {
          contentTextareaRef.current.focus();
          contentTextareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
    } else {
      // Opening preview - save cursor position
      if (contentTextareaRef.current) {
        setCursorPosition(contentTextareaRef.current.selectionStart);
      }
      setIsPreview(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple markdown renderer (basic implementation)
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (max 200 characters)
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post description"
              maxLength={200}
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formData.description.length}/200
              </p>
            </div>

            {/* Preview Button */}
            <button
              type="button"
              onClick={handlePreviewToggle}
              className="mt-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
            >
              {isPreview ? 'Close Preview' : 'Preview'}
            </button>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content (Markdown)
            </label>
            {isPreview ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[200px]">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) }}
                />
              </div>
            ) : (
              <textarea
                ref={contentTextareaRef}
                id="content"
                rows={10}
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter post content in Markdown"
              />
            )}
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.tags ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g. JavaScript, React, Web Development"
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.imageUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
            )}

            {/* Image Preview */}
            {formData.imageUrl && !errors.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}