import { client } from '@repo/db/client';
import { posts as staticPosts } from './data.js';

// Initialize database with static data if empty
export async function seedDatabase() {
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