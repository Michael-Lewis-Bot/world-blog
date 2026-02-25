import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const siteUrl = "https://example.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  return [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/blog`, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    ...posts,
  ];
}
