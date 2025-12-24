import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Heart, Minus, Plus, ShoppingBag, ChevronLeft } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/ui/ProductCard";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../hooks/use-toast";

const sizes = ["XS", "S", "M", "L", "XL"];

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const { addItem: addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const product = products.find((p) => p.id === id);
  const relatedProducts = products.filter((p) => p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">Product Not Found</h1>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    toast({
      title: "Added to cart!",
      description: `${product.name} (Size: ${selectedSize}) has been added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    toast({
      title: inWishlist ? "Removed from wishlist" : "Added to wishlist!",
      description: `${product.name} has been ${inWishlist ? "removed from" : "added to"} your wishlist.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - Sign Fashion</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="animate-fade-in-up">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-secondary shadow-card">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />

                {/* Badges */}
                {product.isSale && <span className="absolute top-4 left-4 badge-sale">Sale</span>}
                {product.discount && (
                  <span className="absolute top-4 right-4 bg-coral text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="animate-fade-in-up delay-100">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-8">
                <h3 className="font-medium text-foreground mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "bg-card text-foreground border border-border hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-medium text-foreground mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-card rounded-lg border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={product.inStock ? handleAddToCart : undefined}
                  disabled={!product.inStock}
                  className={`flex-1 btn-primary flex items-center justify-center gap-3
      ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""}
    `}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {product.inStock ? "Add to Cart" : "Out Of Stock"}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    inWishlist
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground border border-border hover:border-primary"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Product Details */}
              <div className="mt-10 pt-8 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 text-foreground capitalize">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Availability:</span>
                    <span className="ml-2 text-green-600">{product.inStock ? "In Stock" : "Out Of Stock"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section>
            <h2 className="section-title mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
