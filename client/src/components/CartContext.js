import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Charger le panier depuis localStorage lors du premier rendu
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Ajouter un produit au panier
  const addToCart = (product) => {
    const productInCart = cart.find(item => item._id === product._id);

    if (productInCart) {
      // Si le produit existe déjà, mettre à jour la quantité
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Ajouter un nouveau produit au panier
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (productId, newQuantity) => {
    setCart(cart.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
