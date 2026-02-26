# Website Maintenance Playbook

## Weekly (15-20 min)

- Publish at least one useful post (`content/posts/*.md`).
- Check `npm outdated` and update safe patches.
- Run:

```bash
npm run lint
npm run build
```

- Verify core routes:
  - `/`
  - `/blog`
  - `/blog/[slug]`
  - `/about`
  - `/sitemap.xml`
  - `/robots.txt`

## Monthly

- Update dependencies (`npm update` + test build).
- Review analytics: top posts, bounce pages, search queries.
- Improve internal links between posts.
- Refresh older posts with new examples/screenshots.

## Every new post checklist

- Frontmatter includes `title`, `date`, `excerpt`.
- Strong opening paragraph (first 2 lines matter for SEO/social).
- One clear takeaway + one actionable tip.
- At least one internal link to another post.
- Build passes before deploy.

## Deployment flow

```bash
git add -A
git commit -m "Improve blog UI + content"
git push
vercel --prod
```

## Quality guardrails

- Keep design consistency (spacing, heading hierarchy, card styles).
- Keep post slugs short and readable.
- Use descriptive page titles and metadata.
- Avoid publishing without a successful production build.
- If changing design system styles, check both light and dark mode.
