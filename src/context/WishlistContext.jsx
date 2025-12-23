import React, { createContext, useContext, useState, useCallback } from 'react';

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product) => {
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
