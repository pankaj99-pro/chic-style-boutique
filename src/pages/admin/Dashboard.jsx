import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Package, 
  Tag, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  LayoutDashboard,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { isAdmin, isLoading, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productRes, orderRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/admin/orders/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const productData = await productRes.json();
        const orderData = await orderRes.json();
        
        if (productData.success) setStats(productData.data);
        if (orderData.success) setOrderStats(orderData.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  if (isLoading || !isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Divya Fashion</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your store
                  </p>
                </div>
              </div>

              <Link
                to="/"
                className="text-sm text-primary hover:underline self-start sm:self-auto"
              >
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>

        

        {/* Content */}
        <div className="container mx-auto px-4 py-6 space-y-8">

          {/* Revenue Card */}
          {orderStats?.totalRevenue > 0 && (
            <div className="bg-gradient-to-r from-green-500 to-green-400/80 rounded-2xl p-6 text-primary-foreground">
              <p className="text-sm opacity-80">Total Revenue</p>
              <p className="text-3xl font-bold">₹{orderStats.totalRevenue.toFixed(2)}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-card">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-5">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/products"
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Package className="w-9 h-9 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Manage Products
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View, edit, and delete products
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/products/new"
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Plus className="w-9 h-9 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Add New Product
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create a new product listing
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <ShoppingBag className="w-9 h-9 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Manage Orders
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View and process customer orders
                  </p>
                </div>
              </Link>
            </div>
          </div>
          {/* Product Stats Grid */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Product Statistics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Products",
                  value: stats?.totalProducts || 0,
                  icon: Package,
                  color: "text-primary",
                },
                {
                  label: "In Stock",
                  value: stats?.inStockProducts || 0,
                  icon: TrendingUp,
                  color: "text-green-500",
                },
                {
                  label: "Out of Stock",
                  value: stats?.outOfStockProducts || 0,
                  icon: AlertTriangle,
                  color: "text-destructive",
                },
                {
                  label: "On Sale",
                  value: stats?.saleProducts || 0,
                  icon: Tag,
                  color: "text-orange-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-2xl p-4 sm:p-6 shadow-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {loading ? "..." : stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Stats Grid */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Statistics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Orders",
                  value: orderStats?.totalOrders || 0,
                  icon: ShoppingBag,
                  color: "text-primary",
                },
                {
                  label: "Pending",
                  value: orderStats?.pendingOrders || 0,
                  icon: Clock,
                  color: "text-yellow-500",
                },
                {
                  label: "Shipped",
                  value: orderStats?.shippedOrders || 0,
                  icon: Truck,
                  color: "text-blue-500",
                },
                {
                  label: "Delivered",
                  value: orderStats?.deliveredOrders || 0,
                  icon: CheckCircle,
                  color: "text-green-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-2xl p-4 sm:p-6 shadow-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {loading ? "..." : stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
}
