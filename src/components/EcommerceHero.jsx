import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const banners = [
  { id: 1, title: "Productos Destacados" },
  { id: 2, title: "Ofertas de la Semana" },
  { id: 3, title: "Productos mas Vendidos" },
  { id: 4, tipo: "beneficios" },
];


const productos = [
  { id: 1, nombre: "Notebook", marca: "Lenobo", precio: 1250000, imagen: "https://res.cloudinary.com/dszxrhzpx/image/upload/v1784828977/novamarket/owe3ogichqmom4zlb6i4.png"},
  { id: 2, nombre: "Mouse Inalámbrico", marca: "Logitech", precio: 25000, imagen: "https://placehold.co/400x300/457B9D/FFFFFF?text=Mouse" },
  { id: 3, nombre: "Teclado Mecánico", marca: "Redragon", precio: 45000, imagen: "https://placehold.co/400x300/2B8D8B/FFFFFF?text=Teclado" },
  { id: 4, nombre: "Monitor 24''", marca: "Samsung", precio: 210000, imagen: "https://placehold.co/400x300/1D3557/FFFFFF?text=Monitor" },
  { id: 5, nombre: "Auriculares BT", marca: "JBL", precio: 38000, imagen: "https://placehold.co/400x300/457B9D/FFFFFF?text=Auriculares" },
  { id: 6, nombre: "Webcam HD", marca: "Logitech", precio: 32000, imagen: "https://placehold.co/400x300/2B8D8B/FFFFFF?text=Webcam" },
  { id: 7, nombre: "SSD 1TB", marca: "Kingston", precio: 65000, imagen: "https://placehold.co/400x300/1D3557/FFFFFF?text=SSD" },
  { id: 8, nombre: "Cargador USB-C", marca: "Anker", precio: 18000, imagen: "https://placehold.co/400x300/457B9D/FFFFFF?text=Cargador" },
];

export default function EcommerceHero() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const { user, logout } = useAuth();
  const { addToCart, totalItems } = useCart();

  const prev = () => {
    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="relative w-full flex flex-col gap-6">
      {/* Encabezado completo — tarjeta */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative z-10 bg-white px-4 py-3 sm:px-6">
          {/* Fila superior: logo + buscador | auth + carrito */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-15 w-15 items-center justify-center rounded-lg bg-[#457B9D] text-sm font-semibold text-teal-950">
                NM
              </div>
              <span className="text-sm font-medium text-black">Nova-Market</span>
            </div>

            {/* Buscador */}
            <div className="flex flex-1 items-center gap-2 max-w-md">
              <span className="text-sm font-medium text-black whitespace-nowrap">Buscar:</span>
              <div className="flex flex-1 items-center rounded-full bg-white border border-gray-300 px-4 py-2 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Ingrese producto o categoria o marca"
                  className="w-full bg-transparent px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Auth + Carrito */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm font-medium text-black">
                    Hola, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-full bg-[#457B9D] px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-[#3a6a87]"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-full bg-[#457B9D] px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-[#3a6a87]"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="rounded-full bg-[#457B9D] px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-[#3a6a87]"
                  >
                    Registrarse
                  </button>
                </>
              )}
              <button
                onClick={() => navigate("/checkout")}
                className="relative flex items-center gap-2 rounded-full bg-[#457B9D] px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-[#3a6a87]"
                aria-label="Carrito de compras"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Carrito
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categorías / Marcas / Todos */}
          <div className="mt-3 flex items-center gap-6">
            <span className="text-xs font-semibold text-black/70 leading-tight">
              CATEGORIAS<br />O MARCAS O<br />TODO:
            </span>
            <label className="flex flex-col items-center gap-1 cursor-pointer">
              <input type="radio" name="filtro" defaultChecked className="accent-black" />
              <span className="text-[11px] text-black/60">Categorias</span>
            </label>
            <label className="flex flex-col items-center gap-1 cursor-pointer">
              <input type="radio" name="filtro" className="accent-black" />
              <span className="text-[11px] text-black/60">Marcas</span>
            </label>
            <label className="flex flex-col items-center gap-1 cursor-pointer">
              <input type="radio" name="filtro" className="accent-black" />
              <span className="text-[11px] text-black/60">todos</span>
            </label>
          </div>
        </div>
      </div>

      {/* Carrusel de banners */}
      <div className="w-full bg-[#2B8D8B] py-10 px-4 rounded-2xl">
        <div className="flex items-center justify-center gap-4 sm:gap-6 max-w-6xl mx-auto">
          <button onClick={prev} aria-label="Anterior" className="shrink-0 text-black hover:text-black/70 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-1 justify-center gap-4 sm:gap-6">
            {banners.map((banner) =>
              banner.tipo === "beneficios" ? (
                <div
                  key={banner.id}
                  className="w-full max-w-[280px] h-32 sm:h-40 flex flex-col items-center justify-center gap-2 rounded-xl bg-[#fdf6ec] shadow-md text-center px-3"
                >
                  <span className="text-xs sm:text-sm font-bold text-black">Beneficios</span>
                  <ul className="text-[11px] sm:text-xs text-black/70 space-y-1">
                    <li>🚚 Envío gratis +$50.000</li>
                    <li>💳 Cuotas sin interés</li>
                    <li>🔒 Compra 100% segura</li>
                  </ul>
                </div>
              ) : (
                <div
                  key={banner.id}
                  className="w-full max-w-[280px] h-32 sm:h-40 flex items-center justify-center rounded-xl bg-[#fdf6ec] shadow-md text-center px-3"
                >
                  <span className="text-sm sm:text-base font-semibold text-black">
                    {banner.title}
                  </span>
                </div>
              )
            )}
          </div>

          <button onClick={next} aria-label="Siguiente" className="shrink-0 text-black hover:text-black/70 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-3 w-3 rounded-full transition ${
                i === index ? "bg-black" : "bg-white/60"
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Productos tecnológicos — tarjeta */}
      <div className="rounded-2xl overflow-hidden shadow-md bg-gray-100">
        <div className="py-8 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-2">
                  <div className="h-24 w-full rounded-lg bg-gray-100 flex items-center justify-center">
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7"
                      />
                    </svg>)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-black leading-tight">
                      {producto.nombre}
                    </p>
                    <p className="text-xs text-gray-500">{producto.marca}</p>
                  </div>

                  <p className="text-sm font-bold text-[#457B9D]">
                    $ {producto.precio.toLocaleString("es-AR")}
                  </p>
                </div>

                <button
                  onClick={() => addToCart(producto)}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-[#457B9D] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3a6a87]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}