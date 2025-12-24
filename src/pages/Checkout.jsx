import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ChevronLeft, 
  CreditCard, 
  Lock, 
  Truck, 
  Package,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingCost + tax;

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Checkout - Sign Fashion</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-6 bg-peach-light rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checkout.
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    
    // Optional email validation
    if (customerEmail && !/\S+@\S+\.\S+/.test(customerEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: items,
          customerEmail: customerEmail || undefined,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Clear cart before redirecting
        clearCart();
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout - Sign Fashion</title>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleStripeCheckout} className="bg-card rounded-2xl p-6 md:p-8 shadow-card animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <h2 className="font-display font-semibold text-xl text-foreground">
                    Secure Checkout
                  </h2>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Secure checkout powered by Stripe
                  </span>
                </div>

                {/* Optional Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${emailError ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Enter your email for order confirmation"
                  />
                  {emailError && <p className="text-destructive text-xs mt-1">{emailError}</p>}
                  <p className="text-muted-foreground text-xs mt-2">
                    You'll enter shipping and payment details on the next page
                  </p>
                </div>

                {/* Order Items Preview */}
                <div className="mb-6">
                  <h3 className="font-medium text-foreground mb-4">Order Items</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.size}`} className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{item.product.name}</p>
                          <p className="text-muted-foreground text-xs">Size: {item.size} × {item.quantity}</p>
                        </div>
                        <p className="font-medium text-primary text-sm">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Proceed to Secure Payment
                    </>
                  )}
                </button>

                {/* Payment Methods */}
                <div className="flex justify-center gap-4 mt-6 opacity-60">
                  <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-6" />
                  <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="MasterCard" className="h-6" />
                  <img src="https://cdn-icons-png.flaticon.com/128/196/196566.png" alt="Amex" className="h-6" />
                  <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="PayPal" className="h-6" />
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  By proceeding, you'll be redirected to Stripe's secure checkout page
                </p>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-semibold text-lg text-foreground">
                    Order Summary
                  </h2>
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-semibold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shippingCost > 0 && (
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Add ${(100 - totalPrice).toFixed(2)} more for free shipping
                  </p>
                )}

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Lock className="w-3 h-3" />
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Truck className="w-3 h-3" />
                    <span>Free shipping over $100</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Package className="w-3 h-3" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}