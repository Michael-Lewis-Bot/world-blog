import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  html: string;
};

function parsePostFile(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    content,
    html: marked.parse(content) as string,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"));

  return fileNames
    .map(parsePostFile)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return undefined;
  return parsePostFile(`${slug}.md`);
}
