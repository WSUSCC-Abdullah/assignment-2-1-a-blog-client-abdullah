import { PrismaClient } from "@prisma/client";
import { posts as postsData } from "./data.js";
const client = new PrismaClient();

export async function seed() {
  // Delete children first, then parents
  await client.like.deleteMany();
  await client.post.deleteMany();

  const activePosts = postsData.filter(p => p.active);
  
  for (const post of activePosts) {
    const { likes, views, ...postData } = post;
    await client.post.upsert({
      where: { id: post.id },
      update: postData,
      create: postData,
    });
  }

  for (const post of activePosts) {
    const likeCount = post.likes ?? 0;
    for (let i = 0; i < likeCount; i++) {
      await client.like.upsert({
        where: {
          postId_userIP: {
            postId: post.id,
            userIP: `192.168.100.${i}`,
          },
        },
        update: {},
        create: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
}

seed()
  .then(() => {
    console.log("🌱 Seeding complete");
    return client.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return client.$disconnect();
  });