import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { attachProductImages } from '../services/images';

function ProductList({ onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

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

    if (loading) return (
        <div className="flex justify-center items-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
    );

    if (error) return (
        <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
                onClick={fetchProducts}
                className="btn-primary"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <div
                        key={product.id}
                        className="card p-6 animate-slide-up"
                    >
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-contain bg-white rounded-lg mb-4 p-2"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {product.name}
                            </h3>
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
                                    onClick={() => onAddToCart(product)}
                                    className="btn-primary text-sm px-4 py-2"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;