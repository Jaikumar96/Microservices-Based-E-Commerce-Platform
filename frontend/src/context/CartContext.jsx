import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Cart Context
const CartContext = createContext();

// Cart Actions
const cartActions = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case cartActions.ADD_TO_CART: {
      const existingItemIndex = state.items.findIndex(
        item => item.skuCode === action.payload.skuCode
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...state, items: updatedItems };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }
    }

    case cartActions.REMOVE_FROM_CART: {
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.payload)
      };
    }

    case cartActions.UPDATE_QUANTITY: {
      const { index, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((_, i) => i !== index)
        };
      }

      const updatedItems = [...state.items];
      updatedItems[index].quantity = quantity;
      return { ...state, items: updatedItems };
    }

    case cartActions.CLEAR_CART: {
      return { ...state, items: [] };
    }

    case cartActions.LOAD_CART: {
      return { ...state, items: action.payload };
    }

    default:
      return state;
  }
}

// Initial State
const initialState = {
  items: []
};

// Cart Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart from localStorage on mount or when user changes (per-user cart)
  useEffect(() => {
    const key = user ? `ecommerce-cart-${user.username}` : null;
    const fallbackKey = 'ecommerce-cart'; // in case old key exists
    try {
      let savedCart = null;
      if (key) {
        savedCart = localStorage.getItem(key);
      } else {
        savedCart = localStorage.getItem(fallbackKey);
      }
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: cartActions.LOAD_CART, payload: cartItems });
      } else {
        dispatch({ type: cartActions.LOAD_CART, payload: [] });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      dispatch({ type: cartActions.LOAD_CART, payload: [] });
    }
  }, [user]);

  // Save cart to localStorage whenever items or user change (per-user key)
  useEffect(() => {
    const key = user ? `ecommerce-cart-${user.username}` : 'ecommerce-cart';
    try {
      localStorage.setItem(key, JSON.stringify(state.items));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [state.items, user]);

  // Cart Actions
  const addToCart = (product) => {
    // Only allow add when authenticated; UI should already guard this
    dispatch({ type: cartActions.ADD_TO_CART, payload: product });
  };

  const removeFromCart = (index) => {
    dispatch({ type: cartActions.REMOVE_FROM_CART, payload: index });
  };

  const updateQuantity = (index, quantity) => {
    dispatch({ type: cartActions.UPDATE_QUANTITY, payload: { index, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: cartActions.CLEAR_CART });
  };

  // Calculate total
  const getTotal = () => {
    return state.items.reduce((total, item) =>
      total + (parseFloat(item.price) * item.quantity), 0
    ).toFixed(2);
  };

  // Get item count
  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}