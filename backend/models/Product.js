const mongoose = require('mongoose');

/**
 * Product Schema
 * Represents a fashion product in the store
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: null
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['tops', 'dresses', 'skirts', 'suits', 'trail']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  discount: {
    type: Number,
    default: null,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  },
  sizes: {
    type: [String],
    default: ['XS', 'S', 'M', 'L', 'XL']
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster category queries
productSchema.index({ category: 1 });

// Virtual for checking if product is on sale
productSchema.virtual('isOnSale').get(function() {
  return this.discount !== null && this.discount > 0;
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
