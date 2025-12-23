import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Send } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'My Cart', path: '/cart' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Products', path: '/products' },
  ];

  const helpfulLinks = [
    { name: 'About Us', path: '#' },
    { name: 'Services', path: '#' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms & Conditions', path: '#' },
  ];

  return (
    <footer className="bg-cream-dark pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg text-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Helpful Links */}
          <div>
            <h4 className="font-display font-semibold text-lg text-foreground mb-6">
              Helpful Links
            </h4>
            <ul className="space-y-3">
              {helpfulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h4 className="font-display font-semibold text-lg text-foreground mb-6">
              Store Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>471-473 Metro City, Old City, CA, USA</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>info@signfashion.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-lg text-foreground mb-6">
              Get In Touch
            </h4>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 input-newsletter"
              />
              <button className="btn-primary px-4">
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-soft"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Sign Fashion. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-6 opacity-60" />
              <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="MasterCard" className="h-6 opacity-60" />
              <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="PayPal" className="h-6 opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
