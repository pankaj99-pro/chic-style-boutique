import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const WishlistContext = createContext(undefined);
const WISHLIST_STORAGE_KEY = 'signfashion_wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }, [items]);

  const addItem = useCallback((product) => {
    if (!product || !product.id) {
      console.error('Invalid product passed to addItem:', product);
      return;
    }
    setItems(currentItems => {
      if (currentItems.find(item => item.id === product.id)) {
        return currentItems;
      }
      return [...currentItems, product];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(currentItems =>
      currentItems.filter(item => item.id !== productId)
    );
  }, []);

  const toggleItem = useCallback((product) => {
    if (!product || !product.id) {
      console.error('Invalid product passed to toggleItem:', product);
      return;
    }
    setItems(currentItems => {
      if (currentItems.find(item => item.id === product.id)) {
        return currentItems.filter(item => item.id !== product.id);
      }
      return [...currentItems, product];
    });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return items.some(item => item.id === productId);
  }, [items]);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
