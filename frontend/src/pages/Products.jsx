import React, { useMemo, useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { attachProductImages } from '../services/images';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Initialize searchTerm from query param
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchTerm(q);
    setCurrentPage(1);
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
  const response = await productService.getAllProducts();
  const withImages = attachProductImages(response.data);
  setProducts(withImages);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate('/login', { replace: false, state: { from: '/products' } });
      return;
    }
    addToCart(product);
    // You could add a toast notification here
  };

  // Derive categories
  const categories = useMemo(() => {
    const set = new Set((products || []).map(p => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProducts = products
    .filter(product => {
      const q = searchTerm.trim().toLowerCase();
      const matchesQuery = !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.skuCode.toLowerCase().includes(q);
      const inCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const price = parseFloat(product.price);
      const minOk = minPrice === '' || price >= parseFloat(minPrice);
      const maxOk = maxPrice === '' || price <= parseFloat(maxPrice);
      return matchesQuery && inCategory && minOk && maxOk;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'sku':
          aValue = a.skuCode.toLowerCase();
          bValue = b.skuCode.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600">
            Discover our complete collection of high-quality products
          </p>
        </div>

        {/* Filters and Results header */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Filters sidebar */}
          <aside className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4 h-fit">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Search</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
              <div className="space-y-2 max-h-48 overflow-auto pr-1">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={(e) => {
                        setSelectedCategories(prev => e.target.checked ? [...prev, cat] : prev.filter(c => c !== cat));
                        setCurrentPage(1);
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Price</h3>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min" className="input-field" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
                <input type="number" placeholder="Max" className="input-field" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sort</h3>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleSortChange('name')} className={`px-3 py-1.5 rounded text-sm ${sortBy==='name'?'bg-primary-600 text-white':'bg-gray-100 text-gray-700'}`}>Name {sortBy==='name' && (sortOrder==='asc'?'↑':'↓')}</button>
                <button onClick={() => handleSortChange('price')} className={`px-3 py-1.5 rounded text-sm ${sortBy==='price'?'bg-primary-600 text-white':'bg-gray-100 text-gray-700'}`}>Price {sortBy==='price' && (sortOrder==='asc'?'↑':'↓')}</button>
                <button onClick={() => handleSortChange('sku')} className={`px-3 py-1.5 rounded text-sm ${sortBy==='sku'?'bg-primary-600 text-white':'bg-gray-100 text-gray-700'}`}>SKU {sortBy==='sku' && (sortOrder==='asc'?'↑':'↓')}</button>
              </div>
            </div>
          </aside>

          {/* Results header */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
              {searchTerm && ` for "${searchTerm}"`}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={fetchProducts}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="card p-6 animate-slide-up"
                  >
                    {product.imageUrl ? (
                      <a href={`/products/${product.id}`}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-contain bg-white rounded-lg mb-4 p-2"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    <div className="flex-1">
                      <a href={`/products/${product.id}`} className="text-lg font-semibold text-gray-900 mb-2 hover:underline">
                        {product.name}
                      </a>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        SKU: {product.skuCode}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">
                          ${product.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;