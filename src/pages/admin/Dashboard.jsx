import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, Tag, TrendingUp, AlertTriangle, Plus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { isAdmin, isLoading, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setStats(data.data);
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
      <Helmet><title>Admin Dashboard - Sign Fashion</title></Helmet>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Manage your store</p>
                </div>
              </div>
              <Link to="/" className="text-primary hover:underline">← Back to Store</Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-primary' },
              { label: 'In Stock', value: stats?.inStockProducts || 0, icon: TrendingUp, color: 'text-green-500' },
              { label: 'Out of Stock', value: stats?.outOfStockProducts || 0, icon: AlertTriangle, color: 'text-destructive' },
              { label: 'On Sale', value: stats?.saleProducts || 0, icon: Tag, color: 'text-orange-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground">{loading ? '...' : stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h2 className="text-xl font-display font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/admin/products" className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all">
                <Package className="w-10 h-10 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Manage Products</h3>
                  <p className="text-sm text-muted-foreground">View, edit, and delete products</p>
                </div>
              </Link>
              <Link to="/admin/products/new" className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all">
                <Plus className="w-10 h-10 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Add New Product</h3>
                  <p className="text-sm text-muted-foreground">Create a new product listing</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
