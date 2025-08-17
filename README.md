# 🛍️ E-commerce Full-Stack Application

A modern e-commerce platform built with Next.js 14 (App Router) frontend and Node.js/Express backend with MongoDB.

## 🚀 Quick Start

### Backend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Seed database with sample products
npm run db:seed

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your backend API URL

# Start development server
npm run dev
```

## 📦 Dependencies

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB/Mongoose** - Database & ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## ✨ Features

### 🛒 Shopping Cart
- Add/remove items
- Quantity controls
- Real-time cart count
- Persistent storage (localStorage)
- Cart context with React hooks

### 🏪 Product Management
- Product catalog with images
- Search functionality
- Category filtering
- "New" product badges
- Responsive grid layout

### 💳 Checkout System
- Multi-step checkout form
- Payment method selection
- Credit card validation
- Order confirmation
- Success page with order number

### 🎨 UI/UX
- Dark theme design
- Mobile-responsive layout
- Toast notifications
- Loading states
- Error boundaries
- Smooth animations

### 🔧 Backend Features
- RESTful API endpoints
- MongoDB integration
- Data validation
- Error handling
- CORS enabled

## 🌐 API Endpoints

- `GET /` - Welcome message
- `GET /api/products` - Get all products
- `GET /api/products/categories` - Get product categories
- `GET /api/products/search` - Search products
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

## 🚀 Deployment

### Backend (Render)
- Free tier hosting
- Auto-deploy from GitHub
- Environment variables support

### Frontend (Vercel)
- Automatic deployments
- Edge network
- Environment variables

## 📁 Project Structure

```
├── src/                    # Backend source
│   ├── controllers/       # API controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   └── config/           # Database config
├── frontend/              # Next.js app
│   ├── src/app/          # App Router pages
│   └── src/lib/          # Utilities & API
└── scripts/               # Database seeding
```

## 🔑 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```
