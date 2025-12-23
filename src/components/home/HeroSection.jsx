import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-peach-light overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[600px] py-12">
          {/* Content */}
          <div className="relative z-10 space-y-6">
            <p className="text-primary font-medium tracking-wide animate-fade-in-up">
              Women's Dress Store
            </p>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight animate-fade-in-up delay-100">
              SUMMER
              <br />
              COLLECTION
            </h1>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 btn-primary animate-fade-in-up delay-200"
            >
              <span className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </span>
              Browse all Categories
            </Link>

            {/* Featured Products Preview */}
            <div className="flex gap-4 pt-8 animate-fade-in-up delay-300">
              <div className="bg-card rounded-2xl p-3 shadow-card flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=100&h=120&fit=crop"
                  alt="Women Tops"
                  className="w-20 h-24 object-cover rounded-xl"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-muted-foreground">Women Tops</p>
                  <p className="font-semibold text-foreground">$22.00</p>
                  <button className="mt-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm hover:shadow-glow transition-shadow">
                    +
                  </button>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-3 shadow-card flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=100&h=120&fit=crop"
                  alt="Women Tshirt"
                  className="w-20 h-24 object-cover rounded-xl"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-muted-foreground">Women Tshirt</p>
                  <p className="text-primary font-semibold">$29.00</p>
                  <button className="mt-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm hover:shadow-glow transition-shadow">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-primary/30 rounded-lg rotate-12 animate-float" />
              <div className="absolute top-1/4 -right-8 w-4 h-4 bg-primary rounded-full animate-pulse-soft" />
              <div className="absolute bottom-1/4 -left-12 w-3 h-3 bg-coral rounded-full animate-pulse-soft delay-300" />
              <div className="absolute bottom-12 right-12 w-6 h-6 border-2 border-primary/50 rounded-full animate-float delay-200" />

              {/* Main Image */}
              <img
                src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&h=600&fit=crop"
                alt="Summer Collection"
                className="relative z-10 w-[400px] h-[500px] object-cover rounded-3xl shadow-card"
              />

              {/* Social Links */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full hidden xl:flex flex-col gap-4 pl-6">
                {['Youtube', 'Instagram', 'Facebook'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 writing-mode-vertical"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
