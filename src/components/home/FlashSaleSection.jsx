import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { flashSaleProducts } from '../../data/products';
import { useCart } from '../../context/CartContext';

export default function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 10,
    minutes: 20,
    seconds: 30,
  });
  const { addItem: addToCart } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-peach-light">
      <div className="container mx-auto px-4">
        {/* Flash Sale Banner */}
        <div className="relative bg-gradient-to-r from-primary/90 to-coral/90 rounded-3xl overflow-hidden mb-12 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Content */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
                FLASH SALE
              </h2>
              
              {/* Timer */}
              <div className="flex justify-center md:justify-start gap-3 mb-6">
                {[
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Min' },
                  { value: timeLeft.seconds, label: 'Sec' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 bg-primary-foreground/20 backdrop-blur rounded-full flex flex-col items-center justify-center"
                  >
                    <span className="text-xl font-bold text-primary-foreground">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-full font-medium hover:shadow-lg transition-shadow duration-300"
              >
                Flash Store
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Discount Badge */}
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-foreground rounded-full flex flex-col items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-primary">70%</span>
                <span className="text-sm font-medium text-primary">OFF</span>
              </div>
            </div>

            {/* Images */}
            <div className="hidden lg:flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=200&fit=crop"
                alt="Flash sale"
                className="w-32 h-40 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150&h=200&fit=crop"
                alt="Flash sale"
                className="w-32 h-40 object-cover rounded-2xl shadow-lg -mt-4"
              />
            </div>
          </div>
        </div>

        {/* Flash Store Products */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="section-title">FLASH STORE</h3>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {flashSaleProducts.map((product, index) => (
            <div
              key={product.id}
              className="card-product group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-3 right-3 bg-coral text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold">
                  -{product.discount}%
                </div>

                {/* Quick Add */}
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:shadow-glow"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <h4 className="font-medium text-foreground mb-2">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground line-through text-sm">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-primary font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
