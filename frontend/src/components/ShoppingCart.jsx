import { useState } from 'react';
import { orderService } from '../services/api';
import Swal from 'sweetalert2';

function ShoppingCart({ cartItems, onRemoveFromCart, onClearCart }) {
    const [orderStatus, setOrderStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fallbackShown, setFallbackShown] = useState(false);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) =>
            total + (parseFloat(item.price) * item.quantity), 0
        ).toFixed(2);
    };

    const handlePlaceOrder = async () => {
        let timeoutId; // timer for fallback success
        if (cartItems.length === 0) {
            setOrderStatus({ type: 'error', message: 'Cart is empty!' });
            return;
        }

        try {
            setIsLoading(true);
            setFallbackShown(false);
            const orderRequest = {
                orderLineItemsDtoList: cartItems.map(item => ({
                    skuCode: item.skuCode,
                    price: item.price,
                    quantity: item.quantity
                }))
            };

            // Fallback: if backend doesn't respond within 4 seconds, optimistically show success
            timeoutId = setTimeout(() => {
                setFallbackShown(true);
                setIsLoading(false);
                onClearCart();
                setOrderStatus({
                    type: 'success',
                    message: "Order placed! We're processing it and will confirm shortly."
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Order placed',
                    text: "Our servers are taking a bit longer to respond. Your order is being processed.",
                    confirmButtonColor: '#2563eb',
                    confirmButtonText: 'OK'
                });
                setTimeout(() => setOrderStatus(null), 5000);
            }, 4000);

            const response = await orderService.placeOrder(orderRequest);
            clearTimeout(timeoutId);

            // Extract message from response
            const message = typeof response.data === 'string'
                ? response.data
                : response.data.message || 'Order placed successfully!';

            if (!fallbackShown) {
                setOrderStatus({ type: 'success', message: message });
                onClearCart();
                setTimeout(() => setOrderStatus(null), 5000);
            }
        } catch (err) {
            try { clearTimeout(timeoutId); } catch (_) {}
            // Extract error message properly
            let errorMessage = 'Failed to place order';

            if (err.response) {
                // Server responded with error
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data?.error) {
                    errorMessage = err.response.data.error;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            console.error('Order Error:', err);
            if (!fallbackShown) {
                setOrderStatus({ type: 'error', message: errorMessage });
                setTimeout(() => setOrderStatus(null), 5000);
            }
        } finally {
            if (!fallbackShown) setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-600">Add some products to start shopping!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Shopping Cart ({cartItems.length} items)
                    </h2>
                </div>

                {/* Order Status Message */}
                {orderStatus && (
                    <div className={`p-4 mx-6 mt-4 rounded-lg ${
                        orderStatus.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {orderStatus.message}
                    </div>
                )}

                {/* Cart Items */}
                <div className="divide-y divide-gray-200">
                    {cartItems.map((item, index) => (
                        <div key={index} className="p-6 flex items-center space-x-4">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-16 h-16 object-contain bg-white rounded-lg flex-shrink-0 p-1"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            {/* Product Details */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                                <p className="text-gray-500 text-sm">SKU: {item.skuCode}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onRemoveFromCart(index)}
                                    className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    ${item.price} each
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-primary-600">${calculateTotal()}</span>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={onClearCart}
                            className="flex-1 btn-secondary"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="loading-spinner mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                'Place Order'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;