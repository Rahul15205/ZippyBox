# ZippyBox 🚀

A modern, secure cloud storage application for managing files and folders with a beautiful, responsive interface. Built with Next.js 15, TypeScript, and HeroUI components.

![ZippyBox](https://img.shields.io/badge/ZippyBox-Cloud%20Storage-blue?style=for-the-badge&logo=cloud)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔐 **Authentication & Security**
- **Clerk Integration**: Secure user authentication with Clerk
- **Protected Routes**: Automatic route protection for authenticated users
- **Session Management**: Persistent user sessions

### 📁 **File Management**
- **Drag & Drop Upload**: Intuitive file upload interface
- **Folder Organization**: Create and manage folders
- **File Preview**: Preview images and documents
- **Bulk Operations**: Select and manage multiple files
- **File Search**: Quick file search functionality

### 🎨 **User Interface**
- **Modern Design**: Beautiful HeroUI components
- **Dark/Light Mode**: Theme switching capability
- **Responsive Design**: Works on all devices
- **Loading States**: Smooth loading animations
- **Toast Notifications**: User feedback system

### 🗄️ **Database & Storage**
- **Neon Database**: PostgreSQL database with Neon
- **Drizzle ORM**: Type-safe database operations
- **ImageKit Integration**: Cloud file storage
- **File Metadata**: Track file information and uploads

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **HeroUI**: Beautiful React components
- **Framer Motion**: Smooth animations

### **Backend & Database**
- **Neon Database**: Serverless PostgreSQL
- **Drizzle ORM**: Type-safe database queries
- **Next.js API Routes**: Server-side API endpoints

### **Authentication & Storage**
- **Clerk**: User authentication and management
- **ImageKit**: Cloud file storage and CDN
- **NextAuth.js**: Session management

### **Development Tools**
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon Database account
- Clerk account
- ImageKit account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahul15205/ZippyBox.git
   cd ZippyBox
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your-neon-database-url"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   
   # ImageKit
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="your-imagekit-url-endpoint"
   IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
   
   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL= http://localhost:3000/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL= http://localhost:3000/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL= http://localhost:3000/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL= http://localhost:3000/dashboard
   NEXT_PUBLIC_CLERK_CAPTCHA_TYPE=invisible

   # Fallback URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL= http://localhost:3000/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL= http://localhost:3000/sign-up

   ```

4. **Database Setup**
   ```bash
   # Generate database schema
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ZippyBox/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── sign-in/          # Authentication pages
│   ├── sign-up/          # Registration pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Context providers
├── components/            # React components
│   ├── ui/               # UI components
│   ├── FileList.tsx      # File listing component
│   ├── FileUploadForm.tsx # File upload component
│   ├── Navbar.tsx        # Navigation component
│   └── ...               # Other components
├── lib/                   # Utility functions
├── styles/               # Global styles
├── drizzle/              # Database migrations
├── types/                # TypeScript types
└── config/               # Configuration files
```

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio
npm run db:generate      # Generate database schema
npm run db:migrate       # Run database migrations

# Code Quality
npm run lint             # Run ESLint
```

## 🔧 Configuration

### Database Configuration

The project uses Drizzle ORM with Neon PostgreSQL. Configure your database connection in `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Authentication Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Set up your application in Clerk dashboard
3. Add your Clerk keys to `.env.local`

### ImageKit Setup

1. Create an ImageKit account at [imagekit.io](https://imagekit.io)
2. Get your public key, URL endpoint, and private key
3. Add them to your environment variables

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Add Environment Variables**
   - Go to your Vercel dashboard
   - Add all environment variables from `.env.local`

3. **Deploy**
   ```bash
   git push origin main
   ```

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- `IMAGEKIT_PRIVATE_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [HeroUI](https://heroui.com/) - Beautiful React components
- [Clerk](https://clerk.com/) - Authentication
- [ImageKit](https://imagekit.io/) - File storage
- [Neon](https://neon.tech/) - Database
- [Drizzle](https://orm.drizzle.team/) - ORM

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ by [Rahul Kumar](https://github.com/Rahul15205)** 
