import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ ...producto, cantidad }]

  function addToCart(producto) {
    setItems((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        // Si ya está en el carrito, sumamos uno a la cantidad
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function removeFromCart(productoId) {
    setItems((prev) => prev.filter((item) => item.id !== productoId));
  }

  function updateQuantity(productoId, cantidad) {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productoId ? { ...item, cantidad } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}