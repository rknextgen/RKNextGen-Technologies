# Deployment Plan for RK NextGen (File-Based Version)

This project uses a file-based mock database (`src/data/data.json`) instead of a real PostgreSQL database. This simplifies deployment but introduces some limitations on serverless platforms like Vercel.

## 1. Deployment Limitations (Read-Only)

Since Vercel's serverless environment is ephemeral and read-only:
- **Data Persistence**: You **cannot** permanently save new data (e.g., new blogs, contact form submissions) to `data.json`. Any changes made via the admin panel or forms will be lost when the serverless function restarts.
- **Contact Form**: Form submissions will appear to succeed (if we handle the write error gracefully), but the data won't be saved to a file. You should rely on email notifications (which require SMTP configuration) for receiving leads.

## 2. Preparation Steps (I will handle these)

- [x] **Clean up**: Remove temporary scripts and backup files.
- [ ] **Update Database Logic**: Modify `src/lib/db.ts` to:
    - Use `import` to load initial data (ensures data exists in Vercel build).
    - Handle write errors gracefully (prevent crashes when trying to save data).
- [ ] **Environment Variables**: Ensure you have the necessary environment variables set in Vercel.

## 3. Environment Variables for Vercel

You need to add these in the Vercel Dashboard (Settings > Environment Variables):

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXTAUTH_SECRET` | Secret for authentication | `your-random-secret-string` |
| `NEXTAUTH_URL` | Your Vercel URL | `https://your-project.vercel.app` |
| `SMTP_HOST` | (Optional) For emails | `smtp.gmail.com` |
| `SMTP_PORT` | (Optional) For emails | `587` |
| `SMTP_USER` | (Optional) For emails | `your-email@gmail.com` |
| `SMTP_PASS` | (Optional) For emails | `your-app-password` |

**Note**: `DATABASE_URL` is **NOT** required for this file-based version.

## 4. Deployment Steps

1.  **Push to GitHub**: Ensure all your changes are committed and pushed to your repository.
2.  **Import to Vercel**:
    - Go to [Vercel Dashboard](https://vercel.com/new).
    - Import your GitHub repository.
    - **Build Command**: Leave as default (`next build`).
    - **Install Command**: Leave as default (`npm install`).
3.  **Deploy**: Click "Deploy".

## 5. Future Upgrade (Optional)

If you need real data persistence (saving blogs, leads, etc.), you can switch to a real database later by:
1.  Setting up Vercel Postgres.
2.  Updating `src/lib/db.ts` to use the real `PrismaClient`.
3.  Running migrations.
