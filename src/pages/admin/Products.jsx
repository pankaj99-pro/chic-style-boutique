import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Plus, Edit, Trash2, ArrowLeft, Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminProducts() {
  const { isAdmin, isLoading, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== Protect Admin Route ===== */
  useEffect(() => {
    if (!isLoading && !isAdmin) navigate("/");
  }, [isAdmin, isLoading, navigate]);

  /* ===== Fetch Products ===== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProducts();
  }, [token]);

  /* ===== Delete Product ===== */
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
        toast({ title: "Product deleted successfully" });
      }
    } catch (error) {
      toast({ title: "Error deleting product", variant: "destructive" });
    }
  };

  if (isLoading || !isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Manage Products - Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* ===== Header ===== */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-display font-bold">
                  Products
                </h1>
              </div>

              <Link
  to="/admin/products/new"
  className="btn-primary flex items-center gap-2 px-4 py-2
             text-sm sm:text-base rounded-full
             shadow-card hover:shadow-md transition"
>
  <Plus className="w-4 h-4" />
  <span className="hidden sm:inline">Add Product</span>
  <span className="sm:hidden">Add</span>
</Link>

            </div>
          </div>
        </div>

        {/* ===== Content ===== */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products yet</p>
            </div>
          ) : (
            <>
              {/* ===== Desktop Table ===== */}
              <div className="hidden md:block bg-card rounded-2xl shadow-card overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-secondary/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-medium">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">${product.price}</td>

                        <td className="px-6 py-4 capitalize">
                          {product.category}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.inStock
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/products/${product._id}`}
                              className="p-2 rounded-lg hover:bg-secondary"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== Mobile Cards ===== */}
             {/* ===== Improved Mobile Cards ===== */}
<div className="md:hidden space-y-4">
  {products.map((product) => (
    <div
      key={product._id}
      className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
    >
      {/* Top Section */}
      <div className="flex items-center gap-4 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">
            {product.name}
          </p>
          <p className="text-sm text-muted-foreground capitalize">
            {product.category}
          </p>
          <p className="mt-1 text-sm font-medium">
            ${product.price}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Bottom Section */}
      <div className="flex items-center justify-between px-4 py-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/products/${product._id}`}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary"
          >
            <Edit className="w-4 h-4" />
          </Link>

          <button
            onClick={() => handleDelete(product._id)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-destructive/10 text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

            </>
          )}
        </div>
      </div>
    </>
  );
}
