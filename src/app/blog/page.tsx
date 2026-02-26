import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Latest posts",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto min-h-screen max-w-4xl py-12 sm:py-16">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Back home
      </Link>

      <h1 className="mt-4 text-4xl font-bold">Blog</h1>
      <p className="muted mt-2 max-w-2xl text-lg">Fresh posts, build notes, and what changed.</p>

      <ul className="mt-10 space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="card rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              {post.formattedDate} · {post.readingTimeMinutes} min read
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="muted mt-3 leading-7">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
