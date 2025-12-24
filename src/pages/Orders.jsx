import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Package, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Orders = () => {
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token]);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50',
      confirmed: 'text-blue-600 bg-blue-50',
      processing: 'text-purple-600 bg-purple-50',
      shipped: 'text-indigo-600 bg-indigo-50',
      delivered: 'text-green-600 bg-green-50',
      cancelled: 'text-red-600 bg-red-50'
    };
    return colors[status] || 'text-muted-foreground bg-muted';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      paid: 'text-green-600',
      failed: 'text-red-600'
    };
    return colors[status] || 'text-muted-foreground';
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Order History | Sign Fashion</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Please Login</h2>
            <p className="text-muted-foreground mb-6">Login to view your order history</p>
            <Link 
              to="/auth" 
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Login
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
        <title>Order History | Sign Fashion</title>
        <meta name="description" content="View your order history and track previous purchases" />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">Order History</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your order history here</p>
              <Link 
                to="/products" 
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-card rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => toggleOrder(order._id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{formatCurrency(order.total, order.currency)}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                          <span className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentMethod === 'cod' ? 'COD' : order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      {expandedOrder === order._id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  
                  {expandedOrder === order._id && (
                    <div className="px-6 pb-4 border-t border-border">
                      <div className="py-4">
                        <h3 className="font-semibold text-foreground mb-3">Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div className="flex-1">
                                <span className="text-foreground">{item.name}</span>
                                <span className="text-muted-foreground text-sm"> × {item.quantity}</span>
                                {item.size && <span className="text-muted-foreground text-sm"> (Size: {item.size})</span>}
                              </div>
                              <span className="text-foreground">
                                {formatCurrency(item.price * item.quantity, order.currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Order Summary */}
                      <div className="py-4 border-t border-border">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(order.subtotal, order.currency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost, order.currency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span>{formatCurrency(order.tax, order.currency)}</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t border-border">
                            <span>Total</span>
                            <span>{formatCurrency(order.total, order.currency)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {order.shippingAddress && (
                        <div className="py-4 border-t border-border">
                          <h3 className="font-semibold text-foreground mb-2">Shipping Address</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.fullName}<br />
                            {order.shippingAddress.address}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            {order.shippingAddress.country}
                            {order.shippingAddress.phone && <><br />Phone: {order.shippingAddress.phone}</>}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Orders;
