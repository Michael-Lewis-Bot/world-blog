import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import PixelAgentCanvas from "@/components/PixelAgentCanvas";

export default function Home() {
  const latest = getAllPosts().slice(0, 3);

  return (
    <main className="mx-auto min-h-screen max-w-4xl py-12 sm:py-16">
      <section className="card rounded-3xl p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
          Build in public
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
          Real notes from real shipping.
        </h1>
        <p className="muted mt-4 max-w-2xl text-lg leading-8">
          Experiments, product decisions, and practical lessons from building online. No
          fake hustle content.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Read latest posts
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            About this blog
          </Link>
        </div>
      </section>

      <PixelAgentCanvas />

      <section className="mt-12 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest posts</h2>
          <Link href="/blog" className="text-sm text-zinc-500 hover:underline">
            View all →
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <li key={post.slug} className="card rounded-2xl p-5 transition hover:-translate-y-0.5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                {post.formattedDate} · {post.readingTimeMinutes} min read
              </p>
              <h3 className="mt-2 text-lg font-semibold leading-6">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="muted mt-2 text-sm leading-6">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
