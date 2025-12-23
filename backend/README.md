# Sign Fashion - E-commerce Backend

A RESTful API backend for the Sign Fashion e-commerce store built with Node.js, Express, and MongoDB.

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   ├── productController.js   # Product business logic
│   └── categoryController.js  # Category business logic
├── models/
│   ├── Product.js         # Product schema
│   └── Category.js        # Category schema
├── routes/
│   ├── productRoutes.js   # Product API routes
│   └── categoryRoutes.js  # Category API routes
├── seeds/
│   └── seedData.js        # Database seeding script
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── server.js              # Main entry point
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to the backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```
   MONGODB_URI=mongodb://localhost:27017/sign-fashion
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Seed the database with dummy data**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filtering) |
| GET | `/api/products/:id` | Get single product by ID |
| GET | `/api/products/category/:category` | Get products by category |
| GET | `/api/products/flash-sale` | Get flash sale products |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

#### Query Parameters for GET /api/products

| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category slug |
| sort | string | Sort order: `price-low`, `price-high`, `newest` |
| limit | number | Items per page (default: 20) |
| page | number | Page number (default: 1) |
| sale | boolean | Filter sale items only |
| new | boolean | Filter new items only |

**Example:**
```
GET /api/products?category=dresses&sort=price-low&limit=10&page=1
```

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:slug` | Get single category by slug |
| POST | `/api/categories` | Create new category |
| PUT | `/api/categories/:slug` | Update category |
| DELETE | `/api/categories/:slug` | Delete category |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

## 📝 Example API Responses

### Get All Products
```json
{
  "success": true,
  "count": 8,
  "total": 15,
  "page": 1,
  "pages": 2,
  "data": [
    {
      "_id": "...",
      "name": "Ladies Suits",
      "price": 120,
      "originalPrice": 150,
      "image": "https://...",
      "category": "suits",
      "description": "...",
      "discount": 20,
      "isNew": false,
      "isSale": true,
      "sizes": ["XS", "S", "M", "L", "XL"],
      "inStock": true
    }
  ]
}
```

### Get Categories
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "...",
      "name": "Skirt",
      "slug": "skirts",
      "image": "https://...",
      "productCount": 15
    }
  ]
}
```

## 🔧 Connecting Frontend to Backend

Update your frontend to fetch from the API instead of using mock data:

```javascript
// src/services/api.js
const API_URL = 'http://localhost:5000/api';

export const fetchProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/products?${queryString}`);
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
};
```

## 🛡️ Security Notes (Production)

For production deployment, you should:

1. Add authentication middleware (JWT)
2. Add rate limiting
3. Add input validation/sanitization
4. Use HTTPS
5. Set proper CORS origins
6. Add request logging
7. Use environment-specific configurations

## 📄 License

MIT License
