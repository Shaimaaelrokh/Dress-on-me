import React from "react";
import { Routes, Route } from "react-router-dom";
import CartProvider from "./context/CartContext";

import Login from "./pages/Login";
import ChooseRole from "./pages/ChooseRole";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import Chat from "./pages/chat";
import Viton from "./pages/viton";
import Outfits from "./pages/Outfits";
import Vichat from "./pages/vichat";
import Blog from "./pages/Blog"

import DressOnMeDashboard from "./pages/DressOnMeDashboard";

function App() {
  return (
    <CartProvider>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Choose Role */}
        <Route path="/choose-role" element={<ChooseRole />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* Shop */}
        <Route path="/shop" element={<Shop />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* Wishlist */}
        <Route path="/wish" element={<Wishlist />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Chat */}
        <Route path="/chat" element={<Chat />} />

        {/* Viton */}
        <Route path="/viton" element={<Viton />} />

        {/* AI Chat */}
        <Route path="/vichat" element={<Vichat />} />

        {/* Outfits */}
        <Route path="/outfits" element={<Outfits />} />

        {/* Blog */}
        <Route path="/blog" element={<Blog />} />

        {/* Dress On Me Dashboard */}
        <Route
          path="/dashboard"
          element={<DressOnMeDashboard />}
        />

      </Routes>
    </CartProvider>
  );
}

export default App;