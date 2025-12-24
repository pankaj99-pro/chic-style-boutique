import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ChevronLeft, 
  Package, 
  Loader2, 
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Banknote,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminOrders() {
  const { isAdmin, isLoading, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/orders?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, statusFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? data.data : o));
        toast({
          title: "Status Updated",
          description: `Order status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? data.data : o));
        toast({
          title: "Payment Status Updated",
          description: `Payment status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getPaymentColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      paid: 'text-green-600',
      failed: 'text-red-600'
    };
    return colors[status] || 'text-muted-foreground';
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (isLoading || !isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Manage Orders - Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    Manage Orders
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {orders.length} orders found
                  </p>
                </div>
              </div>
              <button
                onClick={fetchOrders}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', ...statusOptions].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:bg-muted'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No orders found</h2>
              <p className="text-muted-foreground">
                {statusFilter === 'all' ? 'No orders have been placed yet' : `No ${statusFilter} orders`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-card rounded-xl border border-border overflow-hidden">
                  {/* Order Header */}
                  <div 
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)} • {order.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === 'cod' ? (
                            <Banknote className="w-4 h-4 text-green-600" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-blue-600" />
                          )}
                          <span className={`text-sm font-medium ${getPaymentColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <span className="font-bold text-foreground">
                          {formatCurrency(order.total)}
                        </span>
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order._id && (
                    <div className="border-t border-border p-4 space-y-4">
                      {/* Items */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Size: {item.size} × {item.quantity}
                                </p>
                              </div>
                              <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Shipping Address</h4>
                          <div className="p-3 bg-muted/50 rounded-lg text-sm">
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p className="text-muted-foreground">
                              {order.shippingAddress.address}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                              {order.shippingAddress.country}
                              {order.shippingAddress.phone && <><br />📞 {order.shippingAddress.phone}</>}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Subtotal</p>
                          <p className="font-medium">{formatCurrency(order.subtotal)}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Shipping</p>
                          <p className="font-medium">{order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Tax</p>
                          <p className="font-medium">{formatCurrency(order.tax)}</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-bold text-primary">{formatCurrency(order.total)}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                        {/* Order Status Update */}
                        <div className="flex-1 min-w-[200px]">
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Update Order Status
                          </label>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            disabled={updating === order._id}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Payment Status Update (for COD) */}
                        {order.paymentMethod === 'cod' && (
                          <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Update Payment Status
                            </label>
                            <select
                              value={order.paymentStatus}
                              onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                              disabled={updating === order._id}
                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="failed">Failed</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {updating === order._id && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
