import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ChevronLeft, 
  CreditCard, 
  Lock, 
  CheckCircle, 
  Truck, 
  Package,
  ShoppingBag
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingCost + tax;

  // Redirect to cart if empty
  if (items.length === 0 && step !== 3) {
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

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Invalid email format';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card number';
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!paymentInfo.expiry.trim()) newErrors.expiry = 'Expiry date is required';
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (paymentInfo.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsProcessing(false);
      setStep(3);
      clearCart();
      window.scrollTo(0, 0);
      
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. Check your email for confirmation.",
      });
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Step indicators
  const steps = [
    { number: 1, title: 'Shipping', icon: Truck },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Confirmation', icon: CheckCircle },
  ];

  return (
    <>
      <Helmet>
        <title>{`Checkout - Step ${step} - Sign Fashion`}</title>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          {step < 3 && (
            <Link
              to={step === 1 ? "/cart" : "#"}
              onClick={step === 2 ? () => setStep(1) : undefined}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Back to Cart' : 'Back to Shipping'}
            </Link>
          )}

          {/* Step Indicators */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className={`flex flex-col items-center ${step >= s.number ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= s.number ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-secondary'
                  }`}>
                    {step > s.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-2 transition-colors duration-300 ${
                    step > s.number ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Order Confirmation */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
              <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mb-2">
                Order #SF{Date.now().toString().slice(-8)}
              </p>
              <p className="text-muted-foreground mb-8">
                We've sent a confirmation email to <strong>{shippingInfo.email}</strong>
              </p>
              
              <div className="bg-card rounded-2xl p-6 shadow-card mb-8 text-left">
                <h3 className="font-display font-semibold text-lg mb-4">Order Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping to:</span>
                    <span className="text-foreground text-right">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <span className="text-foreground">5-7 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Paid:</span>
                    <span className="text-primary font-semibold">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn-primary">
                  Continue Shopping
                </Link>
                <Link to="/" className="px-6 py-3 rounded-full border border-border text-foreground hover:border-primary transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* Shipping & Payment Forms */}
          {step < 3 && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                {/* Shipping Form */}
                {step === 1 && (
                  <form onSubmit={handleShippingSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-card animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-6">
                      <Truck className="w-6 h-6 text-primary" />
                      <h2 className="font-display font-semibold text-xl text-foreground">
                        Shipping Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                        <input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="123 Main Street, Apt 4B"
                        />
                        {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="New York"
                        />
                        {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">State *</label>
                          <input
                            type="text"
                            value={shippingInfo.state}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.state ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                            placeholder="NY"
                          />
                          {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">ZIP *</label>
                          <input
                            type="text"
                            value={shippingInfo.zipCode}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.zipCode ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                            placeholder="10001"
                          />
                          {errors.zipCode && <p className="text-destructive text-xs mt-1">{errors.zipCode}</p>}
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full btn-primary mt-6 flex items-center justify-center gap-2">
                      Continue to Payment
                      <CreditCard className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Payment Form */}
                {step === 2 && (
                  <form onSubmit={handlePaymentSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-card animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <h2 className="font-display font-semibold text-xl text-foreground">
                        Payment Details
                      </h2>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-400">
                        Your payment is secure and encrypted
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Card Number *</label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                          maxLength={19}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.cardNumber ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && <p className="text-destructive text-xs mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Cardholder Name *</label>
                        <input
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.cardName ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="JOHN DOE"
                        />
                        {errors.cardName && <p className="text-destructive text-xs mt-1">{errors.cardName}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            value={paymentInfo.expiry}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: formatExpiry(e.target.value) })}
                            maxLength={5}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.expiry ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                            placeholder="MM/YY"
                          />
                          {errors.expiry && <p className="text-destructive text-xs mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">CVV *</label>
                          <input
                            type="text"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                            maxLength={4}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.cvv ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                            placeholder="123"
                          />
                          {errors.cvv && <p className="text-destructive text-xs mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full btn-primary mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay ${grandTotal.toFixed(2)}
                        </>
                      )}
                    </button>

                    {/* Payment Methods */}
                    <div className="flex justify-center gap-4 mt-6 opacity-60">
                      <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-6" />
                      <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="MasterCard" className="h-6" />
                      <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="PayPal" className="h-6" />
                    </div>
                  </form>
                )}
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

                  {/* Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                        <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Size: {item.size} × {item.quantity}
                          </p>
                          <p className="text-primary font-medium text-sm mt-1">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-foreground pt-3 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Add ${(100 - totalPrice).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}