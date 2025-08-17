# 🛍️ E-commerce Full-Stack Application

A modern e-commerce platform built with Next.js 15 (App Router) frontend and Node.js/Express backend with MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

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
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
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



## 📁 Project Structure

```
├── src/                    # Backend source
│   ├── config/            # Database configuration
│   ├── controllers/       # API controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   └── scripts/          # Database seeding
├── frontend/              # Next.js app
│   ├── src/app/          # App Router pages
│   │   ├── (components)/ # Shared components
│   │   ├── cart/         # Cart page
│   │   ├── checkout/     # Checkout pages
│   │   └── products/     # Products page
│   └── src/lib/          # Utilities & API
├── dist/                  # Compiled backend
└── package.json           # Backend dependencies
```



## 🛠️ Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:seed` - Seed database with sample data
- `npm run clean` - Remove compiled files

### Frontend
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔍 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
2. **Port Conflicts**: Backend runs on port 3001, frontend on port 3000
3. **CORS Errors**: Backend has CORS enabled for localhost:3000
4. **Build Errors**: Run `npm run build` in backend before starting

### Development Tips
- Backend auto-restarts with nodemon on file changes
- Frontend uses Turbopack for faster development builds
- Use `npm run db:seed` to populate database with sample products
- Check console logs for detailed error messages
