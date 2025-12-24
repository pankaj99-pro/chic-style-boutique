import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

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

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>Order History | ShopEase</title>
        <meta name="description" content="View your order history and track previous purchases" />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">Order History</h1>
          
          {orders.length === 0 ? (
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
                <div key={order.id} className="bg-card rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => toggleOrder(order.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Order #{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{formatCurrency(order.total, order.currency)}</p>
                        <p className={`text-sm ${order.status === 'paid' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {order.status === 'paid' ? 'Paid' : order.status}
                        </p>
                      </div>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  
                  {expandedOrder === order.id && (
                    <div className="px-6 pb-4 border-t border-border">
                      <div className="py-4">
                        <h3 className="font-semibold text-foreground mb-3">Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="text-foreground">
                                {formatCurrency(item.price * item.quantity, order.currency)}
                              </span>
                            </div>
                          ))}
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
