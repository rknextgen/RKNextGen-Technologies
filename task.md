# Task: Fix Netlify Build Error (Blog Page)

The build is failing during prerendering of `/blog`. The likely cause is `fetch` calls to the application's own API routes during build time, which is not supported in Next.js static generation.

- [ ] Analyze `src/app/(site)/blog/page.tsx` to confirm API usage. <!-- id: 0 -->
- [ ] Refactor `src/app/(site)/blog/page.tsx` to use Server Component pattern: <!-- id: 1 -->
    - [ ] Fetch initial data directly using `getPublishedBlogs` from `@/lib/actions`.
    - [ ] Pass data to a Client Component for filtering/interaction.
- [ ] Verify the fix. <!-- id: 2 -->
