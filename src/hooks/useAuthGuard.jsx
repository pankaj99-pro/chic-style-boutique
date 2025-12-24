import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const requireAuth = (action) => {
    if (isLoading) return false;
    
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: `Please sign in to ${action}`,
        variant: 'default',
      });
      navigate('/auth');
      return false;
    }
    return true;
  };

  return { requireAuth, isAuthenticated, isLoading };
}
