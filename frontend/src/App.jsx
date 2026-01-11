import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminHome from './pages/AdminHome';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import RequireAuth from './components/RequireAuth';
import AccountLayout from './pages/account/AccountLayout';
import AccountOrders from './pages/account/AccountOrders';
import AccountReturns from './pages/account/AccountReturns';
import AccountAddresses from './pages/account/AccountAddresses';
import AccountPayments from './pages/account/AccountPayments';
import AccountDetails from './pages/account/AccountDetails';
import AccountWishlist from './pages/account/AccountWishlist';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminHome />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>

                {/* Account routes (protected) */}
                <Route
                  path="/account"
                  element={
                    <RequireAuth>
                      <AccountLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<AccountDetails />} />
                  <Route path="orders" element={<AccountOrders />} />
                  <Route path="returns" element={<AccountReturns />} />
                  <Route path="addresses" element={<AccountAddresses />} />
                  <Route path="payments" element={<AccountPayments />} />
                  <Route path="wishlist" element={<AccountWishlist />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
