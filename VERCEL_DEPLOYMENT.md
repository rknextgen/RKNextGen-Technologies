# Vercel Deployment Guide for RK NextGen Website

## Prerequisites
- GitHub repository with your code pushed
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (we'll use Vercel Postgres or external provider)

## Step 1: Prepare Your Project

### 1.1 Create `vercel.json` (Optional - for custom configuration)
Already handled by Next.js defaults, but you can customize if needed.

### 1.2 Ensure Environment Variables are Ready
You'll need these environment variables in Vercel:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (for migrations)
- `JWT_SECRET` - Your JWT secret key
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Your production URL (e.g., https://your-domain.vercel.app)

**Optional:**
- `NEXT_PUBLIC_API_URL` - Your API URL (if different from main domain)

## Step 2: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Git Repository**:
   - Click "Import Project"
   - Select "Import Git Repository"
   - Authorize Vercel to access your GitHub account
   - Select your repository: `RKNextGen-Technologies-Website`

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
   DIRECT_URL=postgresql://user:password@host:5432/database?sslmode=require
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=https://your-project.vercel.app
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? rk-nextgen-website
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

## Step 3: Set Up Database

### Option A: Use Vercel Postgres (Recommended)

1. Go to your project in Vercel Dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose region closest to your users
6. Click "Create"
7. Vercel will automatically add `DATABASE_URL` and `DIRECT_URL` to your environment variables

### Option B: Use External PostgreSQL (Neon, Supabase, etc.)

If using external database, add the connection strings manually in Environment Variables.

## Step 4: Run Database Migrations

After deployment, you need to run Prisma migrations:

### Method 1: Using Vercel CLI
```bash
# Connect to your Vercel project
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Method 2: Add to Build Command (Automatic)
Update `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## Step 5: Create Admin User

After deployment, create your admin user:

```bash
# Pull environment variables
vercel env pull .env.production

# Run the admin creation script
npx ts-node scripts/create-admin.ts
```

Or use Vercel's terminal:
1. Go to your project → Settings → Functions
2. Use the terminal to run the script

## Step 6: Configure Custom Domain (Optional)

1. Go to your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` environment variable to your custom domain

## Step 7: Post-Deployment Checklist

- [ ] Database connected and migrations run
- [ ] Admin user created
- [ ] Environment variables set correctly
- [ ] Site loads without errors
- [ ] Admin panel accessible at `/admin`
- [ ] Media uploads working
- [ ] Forms submitting correctly

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### Database Connection Issues
- Verify `DATABASE_URL` format
- Ensure database allows connections from Vercel IPs
- Check SSL mode is set correctly

### Environment Variables Not Working
- Redeploy after adding/changing environment variables
- Check variable names match exactly (case-sensitive)

### 404 Errors
- Ensure all routes are properly configured
- Check `next.config.js` for any issues

## Important Notes

⚠️ **Security**:
- Never commit `.env` files
- Use strong secrets for JWT and NextAuth
- Enable HTTPS only (Vercel does this by default)

⚠️ **Performance**:
- Vercel automatically optimizes images
- Static pages are cached at edge
- API routes run as serverless functions

⚠️ **Costs**:
- Hobby plan: Free for personal projects
- Pro plan: $20/month for production sites
- Database: Vercel Postgres has free tier

## Useful Commands

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# View environment variables
vercel env ls

# Add environment variable
vercel env add

# Pull environment variables locally
vercel env pull
```

## Next Steps After Deployment

1. Test all functionality on production
2. Set up monitoring (Vercel Analytics)
3. Configure error tracking (Sentry, etc.)
4. Set up backup strategy for database
5. Document deployment process for team

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma on Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
