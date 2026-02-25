import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const latest = getAllPosts().slice(0, 3);

  return (
    <main className="mx-auto min-h-screen max-w-3xl py-16">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Live Blog</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Building in public.</h1>
        <p className="text-lg text-zinc-600">
          Notes, experiments, and real shipping logs. No fluff.
        </p>
        <Link
          href="/blog"
          className="inline-block rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Read the blog
        </Link>
      </section>

      <section className="mt-14 space-y-5">
        <h2 className="text-xl font-semibold">Latest posts</h2>
        <ul className="space-y-4">
          {latest.map((post) => (
            <li key={post.slug} className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{post.date}</p>
              <h3 className="mt-1 text-lg font-semibold">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-1 text-zinc-600">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
