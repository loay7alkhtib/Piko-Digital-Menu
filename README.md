# Piko Digital Menu

A production-ready, multi-language digital menu built with Next.js, Supabase, and Tailwind CSS. Features Arabic RTL support, admin management, and Turkish Lira pricing.

## Features

- 🌍 **Multi-language Support**: English, Arabic (RTL), and Turkish
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🔐 **Admin Panel**: Secure item management with Supabase Auth
- 💰 **Turkish Lira Pricing**: Proper currency formatting
- 🖼️ **Image Management**: Upload and manage item images
- ♿ **Accessible**: WCAG compliant design
- 🚀 **Production Ready**: TypeScript, ESLint, and best practices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account and project
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Piko-Digital-Menu
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Set up your Supabase database:
- Create the required tables (categories, items, item_prices, item_i18n, category_i18n, profiles)
- Enable Row Level Security (RLS)
- Create a storage bucket named `menu-images` for item images
- Add sample data for testing

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application expects the following Supabase tables:

### Core Tables
- `categories` - Menu categories
- `items` - Menu items
- `item_prices` - Item pricing by size
- `item_i18n` - Multilingual item content
- `category_i18n` - Multilingual category content
- `profiles` - User profiles with roles

### Key Fields
- Prices stored as cents (integers) for precision
- Locale codes: 'en', 'ar', 'tr'
- User roles: 'staff' for admin access
- Sort ordering for categories and items

## Usage

### Public Menu
- Browse categories and items
- Switch between languages (EN/AR/TR)
- View item details with pricing
- Responsive design for all devices

### Admin Panel
1. Navigate to `/admin/login`
2. Sign in with staff credentials
3. Manage items at `/admin/items`
4. Create, edit, and publish menu items
5. Upload images and manage pricing

### Admin Features
- **Item Management**: Create, edit, delete items
- **Multilingual Content**: Add names/descriptions in EN/AR/TR
- **Image Upload**: Upload item images to Supabase storage
- **Pricing Management**: Set multiple sizes and prices
- **Draft/Publish**: Save as draft or publish immediately
- **Sort Ordering**: Control display order of items

## Development

### Project Structure
```
├── app/
│   ├── (data)/          # Data queries and types
│   ├── (utils)/         # Utility functions
│   ├── admin/           # Admin interface
│   ├── [category]/      # Category pages
│   ├── item/[id]/       # Item detail pages
│   └── globals.css      # Global styles
├── components/          # Reusable components
├── lib/                 # Core utilities
└── public/              # Static assets
```

### Key Components
- `LocaleSwitch` - Language toggle with RTL support
- `Price` - Turkish Lira price formatting
- `Card` - Item display card
- `EditDrawer` - Admin item editor

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Environment Variables
Ensure these are set in production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing

See [TESTING.md](./TESTING.md) for comprehensive manual testing steps including:
- Locale switching and RTL support
- Admin functionality
- Responsive design
- Error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the [TESTING.md](./TESTING.md) guide
2. Review Supabase documentation
3. Open an issue on GitHub