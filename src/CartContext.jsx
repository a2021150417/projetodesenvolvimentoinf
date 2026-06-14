import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

function getCartKey() {
  const userId = localStorage.getItem('userId');
  return userId ? `carrinho_${userId}` : null;
}

function loadCart() {
  try {
    const key = getCartKey();
    if (!key) return []; // utilizador não autenticado → carrinho vazio
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  // Re-carrega o carrinho quando o userId muda (login/logout)
  useEffect(() => {
    const onStorage = () => setCart(loadCart());
    window.addEventListener('storage', onStorage);
    window.addEventListener('userChanged', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('userChanged', onStorage);
    };
  }, []);

  // Persiste sempre que o carrinho muda
  useEffect(() => {
    try {
      const key = getCartKey();
      if (key) localStorage.setItem(key, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (newItem) => {
    setCart(prevCart => {
      const itemId = newItem.id || newItem.eventId;
      const existingItem = prevCart.find(item => (item.id || item.eventId) === itemId);
      if (existingItem) {
        return prevCart.map(item =>
          (item.id || item.eventId) === itemId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...newItem, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        (item.id || item.eventId) === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => (item.id || item.eventId) !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);