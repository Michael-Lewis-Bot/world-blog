export const metadata = {
  title: "About",
  description: "About this blog and what it is for.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl py-14">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>
      <p className="mt-5 text-lg leading-8 text-zinc-700">
        This is a simple build-in-public blog. The goal is to share what gets shipped,
        what breaks, and what gets learned along the way.
      </p>
      <p className="mt-4 text-lg leading-8 text-zinc-700">
        Posts focus on practical experiments, product notes, and fast iterations.
      </p>
    </main>
  );
}
