import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ChevronLeft, 
  CreditCard, 
  Lock, 
  Truck, 
  Package,
  ShoppingBag,
  Loader2,
  MapPin,
  Plus,
  Check,
  Trash2,
  Banknote
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SAVED_ADDRESSES_KEY = 'signfashion_saved_addresses';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  
  // Saved addresses state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [saveThisAddress, setSaveThisAddress] = useState(false);
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Load saved addresses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SAVED_ADDRESSES_KEY);
    if (stored) {
      const addresses = JSON.parse(stored);
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        setShowAddressForm(false);
      }
    }
  }, []);

  // Select a saved address
  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    setShippingAddress({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone
    });
    setShowAddressForm(false);
    setAddressErrors({});
  };

  // Add new address mode
  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
    setShippingAddress({
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: ''
    });
    setShowAddressForm(true);
    setSaveThisAddress(false);
  };

  // Save current address to localStorage
  const saveAddressToStorage = () => {
    const newAddress = {
      id: Date.now().toString(),
      ...shippingAddress
    };
    const updated = [...savedAddresses, newAddress];
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
    setSavedAddresses(updated);
    setSelectedAddressId(newAddress.id);
    toast({
      title: "Address Saved",
      description: "Your address has been saved for future orders.",
    });
  };

  // Delete saved address
  const handleDeleteAddress = (addressId, e) => {
    e.stopPropagation();
    const updated = savedAddresses.filter(a => a.id !== addressId);
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
    setSavedAddresses(updated);
    if (selectedAddressId === addressId) {
      setSelectedAddressId(null);
      if (updated.length === 0) {
        setShowAddressForm(true);
      }
    }
    toast({
      title: "Address Removed",
      description: "The address has been deleted.",
    });
  };

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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    if (addressErrors[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateAddress = () => {
    const errors = {};
    if (!shippingAddress.firstName.trim()) errors.firstName = 'First name is required';
    if (!shippingAddress.lastName.trim()) errors.lastName = 'Last name is required';
    if (!shippingAddress.address.trim()) errors.address = 'Address is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.state.trim()) errors.state = 'State is required';
    if (!shippingAddress.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    if (!shippingAddress.phone.trim()) errors.phone = 'Phone number is required';
    
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create order in backend
  const createOrderInBackend = async (paymentType) => {
    const orderItems = items.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size,
      image: item.product.image
    }));

    const orderData = {
      items: orderItems,
      shippingAddress: {
        fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone
      },
      paymentMethod: paymentType,
      subtotal: totalPrice,
      shippingCost,
      tax,
      total: grandTotal
    };

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }
    return data;
  };

  const handleCODCheckout = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!validateAddress()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (saveThisAddress && showAddressForm) {
      saveAddressToStorage();
    }
    
    setIsProcessing(true);

    try {
      await createOrderInBackend('cod');
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed. Pay when you receive your items.",
      });
      navigate('/orders');
    } catch (error) {
      console.error('COD checkout error:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    
    if (!validateAddress()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (customerEmail && !/\S+@\S+\.\S+/.test(customerEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    
    if (saveThisAddress && showAddressForm) {
      saveAddressToStorage();
    }
    
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: items,
          customerEmail: customerEmail || undefined,
          shippingInfo: shippingAddress,
        },
      });

      if (error) throw error;

      if (data?.url) {
        localStorage.setItem('lastShippingAddress', JSON.stringify({
          fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        }));
        clearCart();
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

  const handleCheckout = (e) => {
    if (paymentMethod === 'cod') {
      handleCODCheckout(e);
    } else {
      handleStripeCheckout(e);
    }
  };

  const inputClasses = (fieldName) => 
    `w-full px-4 py-3 rounded-xl border ${addressErrors[fieldName] ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`;

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
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Shipping Address Section */}
                <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-primary" />
                      <h2 className="font-display font-semibold text-xl text-foreground">
                        Shipping Address
                      </h2>
                    </div>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add New
                      </button>
                    )}
                  </div>

                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && !showAddressForm && (
                    <div className="space-y-3 mb-6">
                      <p className="text-sm text-muted-foreground mb-3">Select a saved address:</p>
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAddressId === addr.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {selectedAddressId === addr.id && (
                            <div className="absolute top-3 right-3">
                              <Check className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteAddress(addr.id, e)}
                            className="absolute bottom-3 right-3 p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <p className="font-medium text-foreground">
                            {addr.firstName} {addr.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {addr.address}, {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                          <p className="text-sm text-muted-foreground">{addr.phone}</p>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Use a different address
                      </button>
                    </div>
                  )}

                  {/* Address Form */}
                  {showAddressForm && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={shippingAddress.firstName}
                            onChange={handleAddressChange}
                            className={inputClasses('firstName')}
                            placeholder="John"
                          />
                          {addressErrors.firstName && <p className="text-destructive text-xs mt-1">{addressErrors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={shippingAddress.lastName}
                            onChange={handleAddressChange}
                            className={inputClasses('lastName')}
                            placeholder="Doe"
                          />
                          {addressErrors.lastName && <p className="text-destructive text-xs mt-1">{addressErrors.lastName}</p>}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={shippingAddress.address}
                          onChange={handleAddressChange}
                          className={inputClasses('address')}
                          placeholder="123 Main St, Apt 4B"
                        />
                        {addressErrors.address && <p className="text-destructive text-xs mt-1">{addressErrors.address}</p>}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleAddressChange}
                            className={inputClasses('city')}
                            placeholder="New York"
                          />
                          {addressErrors.city && <p className="text-destructive text-xs mt-1">{addressErrors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={shippingAddress.state}
                            onChange={handleAddressChange}
                            className={inputClasses('state')}
                            placeholder="NY"
                          />
                          {addressErrors.state && <p className="text-destructive text-xs mt-1">{addressErrors.state}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={shippingAddress.zipCode}
                            onChange={handleAddressChange}
                            className={inputClasses('zipCode')}
                            placeholder="10001"
                          />
                          {addressErrors.zipCode && <p className="text-destructive text-xs mt-1">{addressErrors.zipCode}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Country
                          </label>
                          <select
                            name="country"
                            value={shippingAddress.country}
                            onChange={handleAddressChange}
                            className={inputClasses('country')}
                          >
                            <option value="IN">India</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleAddressChange}
                          className={inputClasses('phone')}
                          placeholder="+91 98765 43210"
                        />
                        {addressErrors.phone && <p className="text-destructive text-xs mt-1">{addressErrors.phone}</p>}
                      </div>

                      {/* Save Address Checkbox */}
                      <div className="mt-4 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          checked={saveThisAddress}
                          onChange={(e) => setSaveThisAddress(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="saveAddress" className="text-sm text-muted-foreground">
                          Save this address for future orders
                        </label>
                      </div>
                    </>
                  )}
                </div>

                {/* Payment Method Selection */}
                <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="font-display font-semibold text-xl text-foreground">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* Stripe Option */}
                    <div
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'stripe' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'stripe' ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {paymentMethod === 'stripe' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Pay Online (Card/UPI)</p>
                          <p className="text-sm text-muted-foreground">Secure payment via Stripe</p>
                        </div>
                      </div>
                    </div>

                    {/* COD Option */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {paymentMethod === 'cod' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <Banknote className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-foreground">Cash on Delivery (COD)</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COD Notice */}
                  {paymentMethod === 'cod' && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        ⚡ Login required for COD orders. You'll pay ₹{grandTotal.toFixed(2)} when your order arrives.
                      </p>
                    </div>
                  )}

                  {/* Stripe: Optional Email */}
                  {paymentMethod === 'stripe' && (
                    <>
                      <div className="flex items-center gap-2 my-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Lock className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 dark:text-green-400">
                          Secure checkout powered by Stripe
                        </span>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address (for order confirmation)
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${emailError ? 'border-destructive' : 'border-border'} bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                          placeholder="Enter your email for order confirmation"
                        />
                        {emailError && <p className="text-destructive text-xs mt-1">{emailError}</p>}
                      </div>
                    </>
                  )}

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
                            ₹{(item.product.price * item.quantity).toFixed(2)}
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
                        {paymentMethod === 'cod' ? 'Placing Order...' : 'Redirecting to Payment...'}
                      </>
                    ) : (
                      <>
                        {paymentMethod === 'cod' ? (
                          <>
                            <Banknote className="w-4 h-4" />
                            Place COD Order
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Proceed to Payment
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {/* Payment Methods */}
                  {paymentMethod === 'stripe' && (
                    <>
                      <div className="flex justify-center gap-4 mt-6 opacity-60">
                        <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-6" />
                        <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="MasterCard" className="h-6" />
                        <img src="https://cdn-icons-png.flaticon.com/128/196/196566.png" alt="Amex" className="h-6" />
                        <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="PayPal" className="h-6" />
                      </div>

                      <p className="text-center text-xs text-muted-foreground mt-4">
                        You'll enter card details on Stripe's secure payment page
                      </p>
                    </>
                  )}
                </div>
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
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-semibold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shippingCost > 0 && (
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Add ₹{(100 - totalPrice).toFixed(2)} more for free shipping
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
                    <span>Free shipping over ₹100</span>
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
