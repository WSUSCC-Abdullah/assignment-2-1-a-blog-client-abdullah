import { getActivePosts } from "@repo/db/service";
import HomeClient from "./HomeClient";

export default async function Home() {
  const posts = await getActivePosts();
  
  return <HomeClient posts={posts} />;
}