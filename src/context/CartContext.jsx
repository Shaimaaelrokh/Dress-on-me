import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  // --- إضافة الحالة الخاصة بالويش ليست ---
  const [wishlist, setWishlist] = useState([]);

  // دالة إضافة للسلة (كودك الأصلي بدون تغيير)
  const addToCart = (product) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + amount) } 
          : item
      )
    );
  };

  // --- دالات الويش ليست الجديدة ---
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (!exists) {
        return [...prev, product];
      }
      return prev; // إذا كان موجوداً لا يكرره
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ 
      cart: cartItems, // مررناه باسم cart ليطابق كود الـ Shop عندك
      addToCart, 
      removeFromCart, 
      updateQuantity,
      wishlist,        // مررنا قائمة الويش ليست
      addToWishlist,   // دالة الإضافة للويش ليست
      removeFromWishlist // دالة الحذف من الويش ليست
    }}>
      {children}
    </CartContext.Provider>
  );
}