# RK NextGen Technologies Website

A fully production-ready, 3D animated, ultra-modern website for **RK NextGen Technologies**. Built with Next.js, TailwindCSS, Three.js (React Three Fiber), and Framer Motion.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd rk-nextgen-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Build & Deployment

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `.next/` directory.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository (GitHub, GitLab, BitBucket).
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js and configure the build settings.
4. Click **Deploy**.

## 🎨 Design System

- **Colors**:
  - Deep Navy: `#0A2540`
  - Electric Cyan: `#00C2D9`
  - Tech Blue: `#1E90FF`
  - AI Purple: `#8A2BE2`
- **Theme**: Glass Cyber + Hologram Neon

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── projects/         # Projects portfolio
│   ├── services/         # Services list
│   ├── globals.css       # Global styles & Tailwind imports
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── 3d/               # Three.js components (Scene, Globe, Stars)
│   ├── layout/           # Navbar, Footer
│   └── ui/               # Reusable UI (Button, Card, Section)
└── ...
```

## 📝 License

This project is proprietary to RK NextGen Technologies.
