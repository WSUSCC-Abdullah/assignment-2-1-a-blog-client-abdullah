import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

export async function seed() {
  // Delete children first, then parents
  await client.like.deleteMany();
  await client.post.deleteMany();

  const posts = [
    {
      id: 1,
      urlId: "boost-your-conversion-rate",
      title: "Boost your conversion rate",
      description: "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunit.",
      content: "Full content for Boost your conversion rate...",
      category: "Back-End",
      tags: "Databases,Back-End",
      imageUrl: "https://via.placeholder.com/600x400?text=Post+1",
      likes: 2,
    },
    {
      id: 2,
      urlId: "react-vs-vue-vs-angular",
      title: "React vs Vue vs Angular",
      description: "A comparison of the three most popular front-end frameworks. Which one should you choose for your next project?",
      content: "Full content for React vs Vue vs Angular...",
      category: "Front-End",
      tags: "React,Vue,Angular,Front-End",
      imageUrl: "https://via.placeholder.com/600x400?text=Post+2",
      likes: 3,
    },
    {
      id: 3,
      urlId: "understanding-databases",
      title: "Understanding Databases",
      description: "Databases are essential for modern applications. Learn the basics of SQL and NoSQL databases.",
      content: "Full content for Understanding Databases...",
      category: "Back-End",
      tags: "Databases,SQL,NoSQL,Back-End",
      imageUrl: "https://via.placeholder.com/600x400?text=Post+3",
      likes: 1,
    },
  ];

  for (const post of posts) {
    const { likes, ...postData } = post;
    await client.post.upsert({
      where: { id: post.id },
      update: postData,
      create: postData,
    });
  }

  for (const post of posts) {
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