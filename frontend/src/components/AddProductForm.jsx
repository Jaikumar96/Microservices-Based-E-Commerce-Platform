import { useState } from 'react';
import { productService } from '../services/api';

function AddProductForm({ onProductAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        skuCode: ''
    });
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            await productService.createProduct({
                ...formData,
                price: parseFloat(formData.price)
            });

            setMessage({ type: 'success', text: 'Product added successfully!' });
            setFormData({ name: '', description: '', price: '', skuCode: '' });

            if (onProductAdded) {
                onProductAdded();
            }

            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error('Error adding product:', err);
            setMessage({ type: 'error', text: 'Failed to add product' });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                    <p className="text-gray-600 mt-1">Fill in the details to add a new product to your catalog</p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`p-4 mb-6 rounded-lg ${
                        message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter product name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter product description"
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-vertical"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="skuCode" className="block text-sm font-medium text-gray-700 mb-2">
                                SKU Code *
                            </label>
                            <input
                                type="text"
                                id="skuCode"
                                name="skuCode"
                                value={formData.skuCode}
                                onChange={handleChange}
                                required
                                placeholder="e.g., PROD123"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ name: '', description: '', price: '', skuCode: '' })}
                            className="btn-secondary"
                        >
                            Clear Form
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="loading-spinner mr-2"></div>
                                    Adding Product...
                                </div>
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductForm;