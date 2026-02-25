# World Blog

A minimal blog built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

Run the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view it.

## Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Install the Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy from the project folder:

```bash
cd /home/myles/.openclaw/workspace/world-blog
vercel
```

3. Push to production:

```bash
vercel --prod
```

4. (Optional) Connect GitHub for automatic deploys in the Vercel dashboard.

## Project Routes

- `/` Home page
- `/blog` Blog index
- `/blog/[slug]` Post pages
- `/about` About page
