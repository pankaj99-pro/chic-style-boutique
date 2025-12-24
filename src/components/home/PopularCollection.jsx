import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { useProducts } from '../../hooks/useProducts';

export default function PopularCollection() {
  const { products, loading, error } = useProducts({ limit: 4 });
  const popularProducts = products.map(p => ({ ...p, id: p._id || p.id }));

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="section-title">POPULAR COLLECTION</h2>
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            See All
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            Unable to load products
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
