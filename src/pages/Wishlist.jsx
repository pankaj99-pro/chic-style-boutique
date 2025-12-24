import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

export default function Wishlist() {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveItem = (productId, productName) => {
    removeItem(productId);
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Wishlist - Sign Fashion</title>
        </Helmet>

        <Header />

        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-6 bg-peach-light rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Save items you love to your wishlist.
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Wishlist ({items.length}) - Sign Fashion</title>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">
            My Wishlist
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product, index) => (
              <div
                key={product.id}
                className="card-product group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <Link
                  to={`/product/${product.id}`}
                  className="block relative aspect-[3/4] overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 right-3 bg-coral text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors block mb-2"
                  >
                    {product.name}
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        ${Number(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="text-primary font-semibold">
                      ${Number(product.price || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2 hover:shadow-glow transition-shadow text-sm font-medium"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveItem(product.id, product.name)}
                      className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
