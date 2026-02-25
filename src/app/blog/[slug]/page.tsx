import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  return (
    <main className="mx-auto min-h-screen max-w-3xl py-16">
      <Link href="/blog" className="text-sm text-zinc-500 hover:underline">
        ← Back to blog
      </Link>

      <article className="mt-6">
        <p className="text-xs uppercase tracking-wider text-zinc-500">{post.date}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-1 text-zinc-600">{post.excerpt}</p>
        <div
          className="mt-8 leading-8 text-zinc-700"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  );
}
