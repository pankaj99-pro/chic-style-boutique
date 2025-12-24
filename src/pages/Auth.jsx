import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = isLogin 
        ? await login(email, password)
        : await register(email, password);
      
      if (result.success) {
        toast({
          title: isLogin ? 'Welcome back!' : 'Account created!',
          description: isLogin ? 'You have been logged in successfully.' : 'Your account has been created. You are now logged in.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Sign In' : 'Create Account'} - Divya Fashion</title>
        <meta name="description" content={isLogin ? 'Sign in to your Sign Fashion account' : 'Create a new Sign Fashion account'} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-cream to-background flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
          <div className="relative z-10 flex flex-col justify-center px-16">
            <Link to="/" className="mb-8">
              <span className="text-5xl font-display font-bold text-primary italic">
                Divya
              </span>
            </Link>
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Elevate Your Style
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Discover curated fashion collections that define modern elegance. 
              Join our community of style enthusiasts.
            </p>
            <div className="mt-12 flex items-center gap-3 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Exclusive member benefits await</span>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/">
                <span className="text-4xl font-display font-bold text-primary italic">
                  Sign
                </span>
              </Link>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-card animate-fade-in-up">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground">
                  {isLogin 
                    ? 'Enter your credentials to access your account' 
                    : 'Sign up to start your fashion journey'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${
                        errors.email ? 'border-destructive' : 'border-border'
                      } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1.5">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${
                        errors.password ? 'border-destructive' : 'border-border'
                      } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-xs mt-1.5">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {!isLogin && (
                  <div className="animate-fade-in-up">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                        }}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${
                          errors.confirmPassword ? 'border-destructive' : 'border-border'
                        } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-destructive text-xs mt-1.5">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={toggleMode}
                    className="ml-2 text-primary font-medium hover:underline focus:outline-none"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {/* Back to Home */}
              <div className="mt-6 text-center">
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to store
                </Link>
              </div>
            </div>

            {/* First User Notice
            <p className="text-center text-xs text-muted-foreground mt-6">
              First registered user becomes admin
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
}
