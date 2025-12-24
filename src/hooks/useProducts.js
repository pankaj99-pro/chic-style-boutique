import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function useProducts(options = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category, sale, isNew, limit, page = 1, sort } = options;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (sale) params.append('sale', 'true');
        if (isNew) params.append('new', 'true');
        if (limit) params.append('limit', limit.toString());
        if (page) params.append('page', page.toString());
        if (sort) params.append('sort', sort);

        const response = await fetch(`${API_BASE_URL}/products?${params}`);
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sale, isNew, limit, page, sort]);

  return { products, loading, error };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
        } else {
          throw new Error(data.message || 'Product not found');
        }
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

export function useFlashSaleProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashSale = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/products/flash-sale`);
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch flash sale products');
        }
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  return { products, loading, error };
}
