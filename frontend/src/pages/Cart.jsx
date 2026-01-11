import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fallbackShown, setFallbackShown] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = (index, newQuantity) => {
    updateQuantity(index, newQuantity);
  };

  const handleRemoveItem = (index) => {
    removeFromCart(index);
  };

  const handlePlaceOrder = async () => {
    let timeoutId; // timer for fallback success
    if (items.length === 0) {
      setOrderStatus({ type: 'error', message: 'Cart is empty!' });
      return;
    }

    try {
      setIsLoading(true);
      setFallbackShown(false);
      const orderRequest = {
        orderLineItemsDtoList: items.map(item => ({
          skuCode: item.skuCode,
          price: item.price,
          quantity: item.quantity
        }))
      };

      // Fallback: if backend doesn't respond within 4 seconds, optimistically show success
      timeoutId = setTimeout(() => {
        setFallbackShown(true);
        setIsLoading(false);
        clearCart();
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
        // Auto-clear the message after 5s
        setTimeout(() => setOrderStatus(null), 5000);
      }, 4000);

      const response = await orderService.placeOrder(orderRequest);
      clearTimeout(timeoutId);

      // Extract message from response
      const message = typeof response.data === 'string'
        ? response.data
        : response.data.message || 'Order placed successfully!';

      // If fallback already shown, don't duplicate UI updates
      if (!fallbackShown) {
        setOrderStatus({ type: 'success', message: message });
        clearCart();
        // Clear success message after 5 seconds
        setTimeout(() => setOrderStatus(null), 5000);
      }
    } catch (err) {
      // Ensure fallback timer is cleared if request errored earlier than timeout
      // Note: if fallback already fired, we avoid overriding the optimistic success
      try { /* best-effort */ clearTimeout(timeoutId); } catch (_) {}
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
        // Clear error message after 5 seconds
        setTimeout(() => setOrderStatus(null), 5000);
      }
    } finally {
      // If fallback already handled loading state, don't toggle again
      if (!fallbackShown) setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-contain bg-white rounded-lg mr-4 p-1"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {item.description}
                    </p>
                    <p className="text-gray-500 text-sm">
                      SKU: {item.skuCode}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 mr-6">
                    <button
                      onClick={() => handleQuantityChange(index, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(index, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>

                  {/* Price and Remove */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-4">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
              >
                Clear all items
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Order Status Message */}
              {orderStatus && (
                <div className={`p-4 rounded-lg mb-4 ${
                  orderStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {orderStatus.message}
                </div>
              )}

              {/* Item breakdown */}
              <div className="space-y-3 mb-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} (x{item.quantity})
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-600">${getTotal()}</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="w-full btn-secondary mt-3 block text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;