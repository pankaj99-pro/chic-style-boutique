import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/products';

export default function CategoriesSection() {
  const categoryImages = {
    skirts: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj9a?w=200&h=200&fit=crop",
    dresses: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=200&fit=crop",
    tops: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=200&h=200&fit=crop",
    trail: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop",
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="section-title">CATEGORIES</h2>
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative mb-4">
                {/* Image Container */}
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-secondary transition-transform duration-300 group-hover:scale-105 shadow-card">
                  <img
                    src={categoryImages[category.slug] || category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Count Badge */}
                <span className="absolute top-2 right-1/4 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {category.count}
                </span>
              </div>

              <h3 className="font-display font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                {category.name}
              </h3>
              <p className="text-primary text-sm font-medium">See Collection</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
