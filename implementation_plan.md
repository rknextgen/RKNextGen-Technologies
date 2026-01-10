# Implementation Plan - Fix Blog Page Build Error

The goal is to resolve the Netlify build error by refactoring the Blog page to fetch data on the server side instead of using client-side `fetch` calls to the API during build.

## User Review Required

> [!IMPORTANT]
> This change refactors the Blog page to be a Server Component. It will fetch all blogs (limit 1000) on the server and pass them to the client. This improves SEO and fixes the build error.

## Proposed Changes

### Blog Page Refactor

#### [NEW] [BlogClient.tsx](file:///home/tspl/Documents/Kamlesh Lovewanshi/Learning/AntiGravity Learning/rk-nextgen-web-replica/src/app/(site)/blog/BlogClient.tsx)
- Create a new Client Component `BlogClient` based on the existing `page.tsx`.
- Remove `useEffect` data fetching.
- Accept `initialBlogs` as a prop.
- Initialize state with `initialBlogs`.

#### [MODIFY] [page.tsx](file:///home/tspl/Documents/Kamlesh Lovewanshi/Learning/AntiGravity Learning/rk-nextgen-web-replica/src/app/(site)/blog/page.tsx)
- Convert to Server Component.
- Import `getPublishedBlogs` from `@/lib/actions`.
- Fetch data: `const { blogs } = await getPublishedBlogs({ limit: 1000 });`
- Render `BlogClient` wrapped in `Suspense`.

## Verification Plan

### Automated Tests
- Run `npm run build` locally to verify the build passes.

### Manual Verification
- Navigate to `/blog` and verify blogs are displayed.
- Test filtering and search to ensure interactivity still works.
