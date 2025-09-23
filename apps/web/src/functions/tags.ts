export function tags(posts: { tags: string; active: boolean }[]) {
  const tagCount: Record<string, number> = {};

  posts.forEach((post) => {
    if (!post.active) return;
    post.tags.split(",").map((tag) => tag.trim()).forEach((tag) => {
      if (tag) tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount).map(([name, count]) => ({ name, count }));
}