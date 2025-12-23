const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sign-fashion');

// Dummy Categories Data
const categories = [
  {
    name: 'Skirt',
    slug: 'skirts',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj9a?w=200&h=200&fit=crop',
    description: 'Beautiful skirts for every occasion'
  },
  {
    name: 'Long Dress',
    slug: 'dresses',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=200&fit=crop',
    description: 'Elegant dresses for special moments'
  },
  {
    name: 'Tops',
    slug: 'tops',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=200&h=200&fit=crop',
    description: 'Stylish tops and t-shirts'
  },
  {
    name: 'Suits',
    slug: 'suits',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop',
    description: 'Professional suits and blazers'
  },
  {
    name: 'Trail',
    slug: 'trail',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop',
    description: 'Trending trail collection'
  }
];

// Dummy Products Data
const products = [
  {
    name: 'Ladies Suits',
    price: 120.00,
    originalPrice: 150.00,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    category: 'suits',
    description: 'Elegant ladies suit perfect for formal occasions. Made with premium fabric for comfort and style.',
    discount: 20,
    isNew: false,
    isSale: true
  },
  {
    name: 'White T-shirt',
    price: 80.00,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=400&h=500&fit=crop',
    category: 'tops',
    description: 'Classic white t-shirt made from 100% cotton. Comfortable and versatile for everyday wear.',
    discount: null,
    isNew: true,
    isSale: false
  },
  {
    name: 'Ladies Tops',
    price: 80.00,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop',
    category: 'tops',
    description: 'Stylish floral top perfect for summer. Light and breathable fabric.',
    discount: null,
    isNew: false,
    isSale: false
  },
  {
    name: "Men's Shirt",
    price: 80.00,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop',
    category: 'tops',
    description: 'Premium quality mens shirt. Perfect for office or casual wear.',
    discount: null,
    isNew: false,
    isSale: false
  },
  {
    name: 'Ladies Blazer',
    price: 85.00,
    originalPrice: 100.00,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop',
    category: 'suits',
    description: 'Professional blazer for women. Tailored fit with modern design.',
    discount: 15,
    isNew: false,
    isSale: true
  },
  {
    name: 'Ladies Bottom',
    price: 80.00,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
    category: 'skirts',
    description: 'Comfortable and stylish bottom wear. Perfect for any occasion.',
    discount: null,
    isNew: true,
    isSale: false
  },
  {
    name: 'Summer Dress',
    price: 95.00,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
    category: 'dresses',
    description: 'Beautiful summer dress with floral patterns. Light and comfortable.',
    discount: 20,
    isNew: false,
    isSale: true
  },
  {
    name: 'Long Dress',
    price: 140.00,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    category: 'dresses',
    description: 'Elegant long dress for special occasions. Premium quality fabric.',
    discount: null,
    isNew: true,
    isSale: false
  },
  {
    name: 'Ladies Tees',
    price: 65.00,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop',
    category: 'tops',
    description: 'Comfortable ladies tees for everyday wear. Soft cotton blend.',
    discount: 45,
    isNew: false,
    isSale: true
  },
  {
    name: 'Casual Shirt',
    price: 75.00,
    originalPrice: 100.00,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    category: 'tops',
    description: 'Stylish casual shirt for relaxed occasions. Premium fabric.',
    discount: 25,
    isNew: false,
    isSale: true
  },
  {
    name: 'Full Sleeve Tshirt',
    price: 55.00,
    originalPrice: 90.00,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop',
    category: 'tops',
    description: 'Warm full sleeve t-shirt. Perfect for cooler weather.',
    discount: 40,
    isNew: false,
    isSale: true
  },
  {
    name: 'A-Line Skirt',
    price: 88.00,
    originalPrice: 110.00,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj9a?w=400&h=500&fit=crop',
    category: 'skirts',
    description: 'Classic A-line skirt that flatters every figure. Versatile style.',
    discount: 20,
    isNew: false,
    isSale: true
  },
  {
    name: 'Pleated Midi Skirt',
    price: 95.00,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
    category: 'skirts',
    description: 'Elegant pleated midi skirt. Perfect for office or evening wear.',
    discount: null,
    isNew: true,
    isSale: false
  },
  {
    name: 'Evening Gown',
    price: 250.00,
    originalPrice: 300.00,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    category: 'dresses',
    description: 'Stunning evening gown for special occasions. Luxurious fabric.',
    discount: 17,
    isNew: false,
    isSale: true
  },
  {
    name: 'Casual Maxi Dress',
    price: 110.00,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
    category: 'dresses',
    description: 'Flowy casual maxi dress. Perfect for summer days.',
    discount: null,
    isNew: true,
    isSale: false
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Inserted ${createdCategories.length} categories`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample data:');
    console.log(`- Categories: ${createdCategories.map(c => c.name).join(', ')}`);
    console.log(`- Products: ${createdProducts.length} items across all categories`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
