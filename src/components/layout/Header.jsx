import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Orders', path: '/orders' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-display font-bold text-primary italic">
              Sign
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.name}
                {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="icon-button"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="icon-button relative">
              <Heart className="w-5 h-5" />
              {wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="icon-button relative">
              <ShoppingBag className="w-5 h-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="icon-button"
                    aria-label="User menu"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-12 z-50 w-56 bg-card rounded-xl shadow-card border border-border py-2 animate-fade-in-up">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user?.email}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {user?.role}
                          </p>
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link to="/auth" className="icon-button" aria-label="Sign in">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden icon-button"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="pb-4 animate-fade-in-up">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-3 rounded-full border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium py-2 ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium py-2 flex items-center gap-2 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            <div className="border-t border-border pt-4 mt-2">
              {isAuthenticated ? (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    Signed in as {user?.email}
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-destructive font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-primary font-medium"
                >
                  <User className="w-4 h-4" />
                  Sign In / Sign Up
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
