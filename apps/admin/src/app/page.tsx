import { posts } from "@repo/db/data";
import { isLoggedIn } from "../utils/auth";
import LoginForm from "../components/LoginForm";
import AdminLayout from "../components/AdminLayout";
import AdminPostList from "../components/AdminPostList";

export default async function Home() {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <LoginForm />;
  } else {
    return (
      <AdminLayout>
        <AdminPostList initialPosts={posts} />
      </AdminLayout>
    );
  }
}
