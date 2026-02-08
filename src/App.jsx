import React from "react";
import { Routes, Route } from "react-router-dom"; 
import CartProvider from "./context/CartContext";

// استدعاء الصفحات
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
// إضافة استدعاء الملف الجديد هنا
import Vichat from "./pages/vichat"; 

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wish" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />
    
        
        
        {/* ملف viton القديم زي ما هو */}
        <Route path="/viton" element={<Viton />} /> 
        
        {/* إضافة ملف vichat الجديد بمسار جديد */}
        <Route path="/vichat" element={<Vichat />} /> 
        
        <Route path="/outfits" element={<Outfits />} />
      </Routes>
    </CartProvider>
  );
}

export default App;