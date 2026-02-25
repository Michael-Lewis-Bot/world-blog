import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Latest posts",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto min-h-screen max-w-3xl py-16">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Back home
      </Link>
      <h1 className="mt-3 text-4xl font-bold">Blog</h1>
      <p className="mt-2 text-zinc-600">Fresh posts and build notes.</p>

      <ul className="mt-10 space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="rounded-2xl border border-zinc-200 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">{post.date}</p>
            <h2 className="mt-1 text-xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-zinc-600">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
