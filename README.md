
# NotionLite - Simplified Document Management System

A minimalist, Notion-inspired web application for creating, sharing, and collaborating on documents with user authentication and permission-based editing.

![NotionLite](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)

## ✨ Features

### 🔐 Authentication System
- Secure user authentication with NextAuth.js
- Pre-configured demo accounts for MVP testing
- Session-based authentication with protected routes

### 📝 Document Management
- Create and edit rich text documents with markdown support
- Upload and embed images directly in documents
- Real-time document saving with "last save wins" approach
- Document metadata tracking (creator, last edited timestamp)

### 🌍 Privacy & Permissions
- **Public Documents**: Visible and editable by all authenticated users
- **Private Documents**: Visible and editable only by the creator
- Permission-based editing system
- Collaborative editing on public documents

### 🎨 User Interface
- Clean, minimalist black and white design
- Responsive design for desktop and mobile
- Intuitive navigation between document list, creation, and editing
- Modern UI components with Radix UI and Tailwind CSS

## 🚀 Quick Start

### Demo Accounts
Use these pre-configured accounts to test the application:

| Email | Password | Role |
|-------|----------|------|
| `admin@demo.com` | `admin123` | Administrator |
| `alice@demo.com` | `password123` | Regular User |
| `bob@demo.com` | `password123` | Regular User |
| `john@doe.com` | `johndoe123` | Test Account |

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notion_inspired_app/app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   yarn prisma generate
   
   # Run database migrations
   yarn prisma db push
   
   # Seed the database with demo data
   yarn prisma db seed
   ```

4. **Start the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` and log in with one of the demo accounts.

## 🏗️ Project Structure

```
app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── documents/         # Document pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── document-editor.tsx
│   ├── document-list.tsx
│   ├── image-upload.tsx
│   └── header.tsx
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # General utilities
├── prisma/               # Database schema
│   └── schema.prisma
└── scripts/              # Database scripts
    └── seed.ts           # Database seeding
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2 with App Router
- **Language**: TypeScript 5.2
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with Shadcn UI
- **State Management**: React hooks and Zustand
- **Forms**: React Hook Form with Zod validation

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **File Upload**: Native file handling with image storage
- **Password Hashing**: bcryptjs

### Development
- **Package Manager**: Yarn
- **Linting**: ESLint with TypeScript support
- **Database Management**: Prisma CLI
- **Development Server**: Next.js dev server

## 📋 Available Scripts

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint

# Database
yarn prisma generate    # Generate Prisma client
yarn prisma db push     # Push schema changes to database
yarn prisma db seed     # Seed database with demo data
yarn prisma studio      # Open Prisma Studio (database GUI)
```

## 🔧 Configuration

### Environment Variables
The application uses the following environment variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### Database Schema
The application uses the following main models:

- **User**: User accounts with authentication
- **Document**: Text documents with privacy settings
- **Image**: Uploaded images linked to documents
- **Account/Session**: NextAuth.js authentication tables

## 🚀 Features in Detail

### Document Creation & Editing
- Rich text editor with markdown support
- Image upload and embedding
- Auto-save functionality
- Privacy toggle (public/private)

### Permission System
- **Public documents**: All authenticated users can view and edit
- **Private documents**: Only the creator can view and edit
- Document creator is always tracked
- Last editor information is stored

### User Experience
- Responsive design for all screen sizes
- Loading states and error handling
- Toast notifications for user feedback
- Clean, distraction-free interface

## 🔒 Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Protected API routes
- Input validation with Zod
- SQL injection prevention with Prisma
- CSRF protection with NextAuth.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Notion](https://notion.so) for the document management concept
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)

---

**Happy documenting! 📝**
