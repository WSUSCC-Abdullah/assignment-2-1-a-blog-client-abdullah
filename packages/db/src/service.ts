import { client } from '@repo/db/client';
import { posts as staticPosts } from './data.js';

// Initialize database with static data if empty
export async function seedDatabase() {
  // Prevent running in browser environment
  if (typeof window !== 'undefined') {
    return;
  }
  
  try {
    const existingPosts = await client.db.post.count();
    
    if (existingPosts === 0) {
      console.log('Database is empty, seeding with static data...');
      
      for (const post of staticPosts) {
        await client.db.post.create({
          data: {
            id: post.id,
            urlId: post.urlId,
            title: post.title,
            content: post.content,
            description: post.description,
            imageUrl: post.imageUrl,
            date: post.date,
            category: post.category,
            tags: post.tags,
            views: post.views,
            active: post.active,
          }
        });
      }
      
      console.log('Database seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Get all posts with like counts
export async function getAllPosts() {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations cannot be performed in the browser');
  }
  await seedDatabase();
  
  const posts = await client.db.post.findMany({
    include: {
      Likes: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  return posts.map(post => ({
    ...post,
    likes: post.Likes.length
  }));
}

// Get active posts only
export async function getActivePosts() {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations cannot be performed in the browser');
  }
  await seedDatabase();
  
  const posts = await client.db.post.findMany({
    where: {
      active: true
    },
    include: {
      Likes: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  return posts.map(post => ({
    ...post,
    likes: post.Likes.length
  }));
}

// Get single post by ID with like info
export async function getPostById(id: number, userIP?: string) {
  await seedDatabase();
  
  const post = await client.db.post.findUnique({
    where: { id },
    include: {
      Likes: true
    }
  });

  if (!post) return null;

  const userHasLiked = userIP ? 
    post.Likes.some(like => like.userIP === userIP) : 
    false;

  return {
    ...post,
    likes: post.Likes.length,
    userHasLiked
  };
}

// Get single post by urlId
export async function getPostByUrlId(urlId: string, userIP?: string) {
  await seedDatabase();
  
  const post = await client.db.post.findUnique({
    where: { urlId },
    include: {
      Likes: true
    }
  });

  if (!post) return null;

  const userHasLiked = userIP ? 
    post.Likes.some(like => like.userIP === userIP) : 
    false;

  return {
    ...post,
    likes: post.Likes.length,
    userHasLiked
  };
}

// Get posts by category
export async function getPostsByCategory(category: string) {
  await seedDatabase();
  
  const posts = await client.db.post.findMany({
    where: {
      category,
      active: true
    },
    include: {
      Likes: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  return posts.map(post => ({
    ...post,
    likes: post.Likes.length
  }));
}

// Get posts by tag
export async function getPostsByTag(tag: string) {
  await seedDatabase();
  
  const posts = await client.db.post.findMany({
    where: {
      tags: {
        contains: tag
      },
      active: true
    },
    include: {
      Likes: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  return posts.map(post => ({
    ...post,
    likes: post.Likes.length
  }));
}

// Search posts
export async function searchPosts(query: string) {
  await seedDatabase();
  
  const posts = await client.db.post.findMany({
    where: {
      AND: [
        { active: true },
        {
          OR: [
            {
              title: {
                contains: query
              }
            },
            {
              description: {
                contains: query
              }
            },
            {
              content: {
                contains: query
              }
            }
          ]
        }
      ]
    },
    include: {
      Likes: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  return posts.map(post => ({
    ...post,
    likes: post.Likes.length
  }));
}

// Get posts by date (year and month)
export async function getPostsByDate(year: number, month: number) {
  await seedDatabase();
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  const posts = await client.db.post.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      },
      active: true
    },
    include: {
      Likes: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  return posts.map(post => ({
    ...post,
    likes: post.Likes.length
  }));
}

// Admin functions
export async function createPost(postData: {
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string;
}) {
  // Generate urlId from title
  const urlId = postData.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  return await client.db.post.create({
    data: {
      ...postData,
      urlId,
      active: true
    }
  });
}

export async function updatePost(id: number, postData: {
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string;
}) {
  // Generate urlId from title
  const urlId = postData.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  return await client.db.post.update({
    where: { id },
    data: {
      ...postData,
      urlId
    }
  });
}

// Get next active post by date (chronological order)
export async function getNextPost(currentUrlId: string) {
  await seedDatabase();
  
  // First get the current post to find its date
  const currentPost = await client.db.post.findUnique({
    where: { urlId: currentUrlId }
  });

  if (!currentPost) return null;

  // Find the next post with a date after the current post's date
  const nextPost = await client.db.post.findFirst({
    where: {
      active: true,
      date: {
        gt: currentPost.date
      }
    },
    include: {
      Likes: true
    },
    orderBy: {
      date: 'asc' // Get the earliest post that's after the current one
    }
  });

  // If no post found after current date, wrap around to the oldest post
  if (!nextPost) {
    const firstPost = await client.db.post.findFirst({
      where: {
        active: true,
        urlId: {
          not: currentUrlId // Don't return the same post
        }
      },
      include: {
        Likes: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    if (!firstPost) return null;
    
    return {
      ...firstPost,
      likes: firstPost.Likes.length
    };
  }

  return {
    ...nextPost,
    likes: nextPost.Likes.length
  };
}

export async function togglePostActive(id: number) {
  const post = await client.db.post.findUnique({
    where: { id }
  });

  if (!post) return null;

  return await client.db.post.update({
    where: { id },
    data: {
      active: !post.active
    }
  });
}