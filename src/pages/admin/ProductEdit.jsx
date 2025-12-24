import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminProductEdit() {
  const { id } = useParams();
  const isNew = !id;
  const { isAdmin, isLoading, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', originalPrice: '', image: '', category: 'tops',
    description: '', discount: '', isNew: false, isSale: false, inStock: true
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/');
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (!isNew && token) {
      fetch(`${API_URL}/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const p = data.data;
            setForm({
              name: p.name || '', price: p.price || '', originalPrice: p.originalPrice || '',
              image: p.image || '', category: p.category || 'tops', description: p.description || '',
              discount: p.discount || '', isNew: p.isNew || false, isSale: p.isSale || false, inStock: p.inStock ?? true
            });
          }
        });
    }
  }, [id, isNew, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, discount: form.discount ? Number(form.discount) : null };
      const res = await fetch(`${API_URL}/admin/products${isNew ? '' : `/${id}`}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: isNew ? 'Product created' : 'Product updated' });
        navigate('/admin/products');
      } else {
        toast({ title: data.message || 'Error', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error saving product', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !isAdmin) return null;

  return (
    <>
      <Helmet><title>{isNew ? 'Add Product' : 'Edit Product'} - Admin</title></Helmet>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Link to="/admin/products" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
              <h1 className="text-2xl font-display font-bold text-foreground">{isNew ? 'Add Product' : 'Edit Product'}</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-card space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price *</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Original Price</label>
                <input type="number" step="0.01" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image URL *</label>
              <input type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="tops">Tops</option>
                  <option value="dresses">Dresses</option>
                  <option value="skirts">Skirts</option>
                  <option value="suits">Suits</option>
                  <option value="trail">Trail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Discount %</label>
                <input type="number" min="0" max="100" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} className="rounded text-primary" />
                <span className="text-foreground">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} className="rounded text-primary" />
                <span className="text-foreground">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isSale} onChange={e => setForm({...form, isSale: e.target.checked})} className="rounded text-primary" />
                <span className="text-foreground">On Sale</span>
              </label>
            </div>
            <button type="submit" disabled={saving} className="w-full btn-primary flex items-center justify-center gap-2 py-4">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : (isNew ? 'Create Product' : 'Save Changes')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
