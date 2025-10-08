# 🍽️ Piko Digital Menu

A **production-ready**, **multi-language** digital menu with **Arabic RTL support**, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- 🌍 **Multi-language Support**: English, Arabic, and Turkish with proper RTL
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile
- 🔐 **Secure Admin Panel**: Staff authentication with role-based access
- 🗄️ **Robust Database**: Supabase with Row Level Security and optimized queries
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- ⚡ **High Performance**: Server-side rendering and optimized images
- 🔒 **Type Safety**: Full TypeScript coverage with strict validation
- 📊 **Production Ready**: Comprehensive error handling and monitoring

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Supabase (Database, Auth, Storage, RLS) |
| **Deployment** | Vercel (recommended) |
| **Version Control** | Git, GitHub |
| **Validation** | Custom TypeScript validation system |
| **Storage** | Supabase Storage with image optimization |

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-username/piko-digital-menu.git
cd piko-digital-menu
npm install
```

### 2. Environment Setup

```bash
cp env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open the SQL Editor
3. Copy and paste the entire content of `supabase-complete-backend-setup.sql`
4. Click **Run** to execute the script

This will create:
- ✅ All database tables with proper constraints
- ✅ Row Level Security policies
- ✅ Storage bucket for menu images
- ✅ Sample data in 3 languages
- ✅ Performance indexes
- ✅ Authentication triggers

### 4. Create Staff User

1. Go to **Authentication → Users** in Supabase
2. Click **Add user** and create a staff account
3. Run this SQL query with the user's ID:

```sql
INSERT INTO profiles (id, email, role) 
VALUES ('USER_ID_FROM_AUTH', 'staff@example.com', 'staff');
```

### 5. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
piko-digital-menu/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (data)/                   # Data layer & queries
│   ├── 📁 (utils)/                  # Utility functions
│   ├── 📁 admin/                    # Admin panel pages
│   ├── 📁 api/                      # API routes
│   │   ├── 📁 auth/                 # Authentication endpoints
│   │   ├── 📁 items/                # Item management
│   │   └── 📁 upload/               # File upload
│   ├── 📁 [category]/               # Dynamic category pages
│   └── 📁 item/[id]/                # Item detail pages
├── 📁 components/                   # Reusable UI components
│   ├── 📄 Card.tsx                  # Item card component
│   ├── 📄 LocaleSwitch.tsx          # Language switcher
│   └── 📄 Price.tsx                 # Price formatter
├── 📁 lib/                          # Core utilities
│   ├── 📄 auth.ts                   # Authentication service
│   ├── 📄 database.ts               # Database types & client
│   ├── 📄 queries.ts                # Typed database queries
│   ├── 📄 storage.ts                # File upload service
│   ├── 📄 validation.ts             # Form validation system
│   ├── 📄 i18n.tsx                  # Internationalization
│   └── 📄 supabaseClient.ts         # Supabase client
├── 📁 scripts/                      # Utility scripts
│   └── 📄 test-backend.js           # Database testing
├── 📄 supabase-complete-backend-setup.sql  # Complete DB setup
└── 📄 package.json                  # Dependencies & scripts
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login with email/password |
| `POST` | `/api/auth/logout` | Sign out current user |
| `GET` | `/api/auth/me` | Get current user profile |

### Items Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/items` | Get all items (admin only) |
| `POST` | `/api/items` | Create new item (admin only) |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload image files (admin only) |

## 🗄️ Database Schema

### Core Tables

```sql
categories           # Menu categories
├── id (UUID)
├── slug (VARCHAR)
├── sort_order (INT)
└── is_active (BOOL)

category_i18n        # Multilingual category names
├── category_id (UUID)
├── locale (ENUM: en, ar, tr)
└── name (VARCHAR)

items               # Menu items
├── id (UUID)
├── category_id (UUID)
├── image_url (TEXT)
├── sort_order (INT)
└── is_active (BOOL)

item_i18n           # Multilingual item content
├── item_id (UUID)
├── locale (ENUM: en, ar, tr)
├── name (VARCHAR)
└── description (TEXT)

item_prices         # Item pricing
├── item_id (UUID)
├── size_name (VARCHAR)
├── price_cents (INT)
└── is_active (BOOL)

profiles            # User management
├── id (UUID)
├── email (VARCHAR)
└── role (ENUM: customer, staff, admin)
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbo
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier

# Database
npm run db:test      # Test database connection
npm run db:setup     # Setup database (if script exists)
npm run db:reset     # Reset database (if script exists)

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Add your Supabase credentials
3. **Deploy**: Automatic deployment on push to main

### Manual Deployment

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Type-safe Queries**: Prevents SQL injection
- **Authentication**: Supabase Auth with JWT tokens
- **Role-based Access**: Customer, Staff, Admin roles
- **Input Validation**: Comprehensive form validation
- **File Upload Security**: Type and size restrictions

## 🌍 Multi-language Support

### Supported Languages
- 🇺🇸 **English** (en) - Default
- 🇸🇦 **Arabic** (ar) - RTL support
- 🇹🇷 **Turkish** (tr) - LTR

### RTL Implementation
- Automatic `dir="rtl"` attribute for Arabic
- CSS logical properties for proper layout
- Font loading optimization
- Proper text alignment and spacing

## 🎨 UI/UX Features

- **Responsive Grid**: Adapts to all screen sizes
- **Image Optimization**: Automatic WebP conversion
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG 2.1 AA compliant
- **Dark Mode Ready**: CSS custom properties

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific functionality
npm test -- --testNamePattern="authentication"
npm test -- --testNamePattern="database"

# Test with coverage
npm run test:coverage
```

## 📊 Performance

- **Core Web Vitals**: Optimized for Google's metrics
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Supabase query caching
- **Bundle Size**: Optimized with tree-shaking

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write tests for new features
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@pikomenu.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/piko-digital-menu/issues)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/piko-digital-menu/wiki)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Vercel](https://vercel.com/) for seamless deployment

---

**Built with ❤️ for restaurants worldwide** 🍽️