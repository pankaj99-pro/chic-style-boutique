import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem: addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-product">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.inStock && product.isSale && <span className="badge-sale">Sale</span>}
            {product.inStock &&product.isNew && (
              <span className="bg-charcoal text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                New
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-400 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                Out Of Stock
              </span>
            )}
            
          </div>

          {/* Discount Badge */}
          {product.inStock && product.discount && (
            <div className="absolute top-3 right-3 bg-coral text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold">
              -{product.discount}%
            </div>
          )}

          {/* Hover Actions */}
          <div
            className={`absolute inset-0 bg-foreground/5 flex items-center justify-center gap-3 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleToggleWishlist}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-card ${
                inWishlist
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={product.inStock ? handleAddToCart : undefined}
              disabled={!product.inStock}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-card
    ${
      product.inStock
        ? "bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
        : "bg-card text-muted-foreground cursor-not-allowed opacity-50"
    }
  `}
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>

            <Link
              to={`/product/${product.id}`}
              className="w-11 h-11 rounded-full bg-card text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-card"
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="text-muted-foreground line-through text-sm">₹{product.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-primary font-semibold text-lg">₹{product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
