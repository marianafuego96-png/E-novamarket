import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, CreditCard, Lock, Headphones, ChevronRight, SlidersHorizontal, Laptop, Watch, Package, Menu as MenuIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import heroProductosImg from "../assets/hero-productos.png";
import logoNM from "../assets/logo-novamarket.png";

// Endpoint real de productos (mismo que usa el panel de admin)
const API_URL = vite.env.VITE_API_URL + "/api/products"; 

// Traduce el enum de categoría del backend a una etiqueta legible,
// ya que el catálogo no tiene un campo de "marca" (se sacó del modelo)
const CATEGORY_LABELS = {
  accesorios: "Accesorios",
  "periféricos": "Periféricos",
  gadgets: "Gadgets",
};

// Categorías reales del backend para el menú (con su ícono), en vez de las
// categorías del mockup (Tecnología/Hogar/Ofertas) que no existen en el modelo
const CATEGORIAS_MENU = [
  { value: "accesorios", label: "Accesorios", Icon: Package },
  { value: "periféricos", label: "Periféricos", Icon: Laptop },
  { value: "gadgets", label: "Gadgets", Icon: Watch },
];

export default function EcommerceHero() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToCart, totalItems } = useCart();

  // Productos reales del catálogo, ya no el array mock
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    setCargandoProductos(true);
    setErrorProductos(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("No se pudo cargar el catálogo");
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.products ?? [];

      // Mapeamos el shape del backend (name, price, image, category) al que
      // ya usaban las tarjetas (nombre, precio, imagen, marca), para no
      // tener que tocar el resto del render ni el carrito
      const mapeados = lista.map((p) => ({
        id: p._id,
        nombre: p.name,
        categoria: p.category ?? "", // valor crudo del back, para filtrar por el menú
        marca: CATEGORY_LABELS[p.category] ?? p.category ?? "",
        precio: p.price,
        imagen: p.image || p.imageUrl || "",
        stock: p.stock,
      }));

      setProductos(mapeados);
    } catch (err) {
      setErrorProductos(err.message);
    } finally {
      setCargandoProductos(false);
    }
  }

  // Producto cuya imagen está siendo visualizada en grande (null = modal cerrado)
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  // Texto del toast de confirmación (null = no se muestra nada)
  const [toast, setToast] = useState(null);

  // Agrega el producto al carrito y muestra un aviso breve que desaparece solo
  function handleAgregar(producto) {
    addToCart(producto);
    setToast(`${producto.nombre} agregado al carrito`);
    setTimeout(() => setToast(null), 2500);
  }

  // Texto ingresado en el buscador
  const [busqueda, setBusqueda] = useState("");
  // Categoría elegida en el menú de categorías ("todos" = sin filtro de categoría)
  const [categoriaMenu, setCategoriaMenu] = useState("todos");

  // Lista final que se muestra en la grilla: primero se aplica el filtro por
  // categoría del menú, y sobre ese resultado se aplica la búsqueda de texto
  // (por nombre o por categoría)
  const productosFiltrados = useMemo(() => {
    const porCategoria =
      categoriaMenu === "todos"
        ? productos
        : productos.filter((p) => p.categoria === categoriaMenu);

    const term = busqueda.trim().toLowerCase();
    if (!term) return porCategoria;

    return porCategoria.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(term) ||
        p.marca?.toLowerCase().includes(term)
    );
  }, [productos, busqueda, categoriaMenu]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="relative w-full flex flex-col gap-6">
      {/* Barra de beneficios — tarjeta, siempre visible (no es parte del carrusel) */}
      <div className="rounded-2xl bg-[#2B8D8B] px-4 py-2.5 text-white shadow-md">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-8 gap-y-1 text-xs sm:text-sm">
          <span className="flex items-center gap-2">
            <Truck size={16} />
            Envío gratis en compras superiores a $50.000
          </span>
          <span className="flex items-center gap-2">
            <CreditCard size={16} />
            Hasta 3 cuotas sin interés
          </span>
          <span className="flex items-center gap-2">
            <Lock size={16} />
            Compra 100% segura
          </span>
        </div>
      </div>

      {/* Encabezado completo — tarjeta */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative z-10 bg-white px-4 py-3 sm:px-6">
          {/* Fila superior: logo + buscador | auth + carrito */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-19 items-center justify-center rounded-xl bg-[#457B9D] p-1.5 shadow-sm">
                <img
                  src={logoNM}
                  alt="NovaMarket - E-commerce"
                  className="h-full w-full object-contain"
                />
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
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ingrese producto o categoria"
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
                  {/* Solo visible para usuarios con role admin */}
                  {user.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="rounded-full border border-[#457B9D] px-4 py-2 text-sm font-semibold text-[#457B9D] transition hover:bg-[#457B9D]/10"
                    >
                      Administración
                    </button>
                  )}
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

          {/* Menú de categorías: filtra los productos de la grilla por categoría real */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-black"
            >
              <MenuIcon size={16} />
              <span className="flex flex-col items-start leading-tight">
                CATEGORÍAS
                <span className="text-[10px] font-normal text-gray-400">Ver todas</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCategoriaMenu("todos")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                categoriaMenu === "todos"
                  ? "bg-[#2B8D8B]/10 text-[#2B8D8B]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={14} />
              Todos
            </button>

            {CATEGORIAS_MENU.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategoriaMenu(value)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  categoriaMenu === value
                    ? "bg-[#2B8D8B]/10 text-[#2B8D8B]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero + panel de beneficios */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Hero principal */}
        <div className="relative overflow-hidden rounded-2xl bg-[#2B8D8B] px-6 py-10 sm:px-10 shadow-md">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Texto */}
            <div className="max-w-md text-center lg:text-left">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                <span className="font-extrabold">Tecnología</span> que mejora tu día a día
              </h1>
              <p className="mt-3 text-sm text-white/90 sm:text-base">
                Descubrí los mejores productos con <strong>envío gratis</strong> y cuotas sin interés.
              </p>
              <button
                onClick={() =>
                  document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#2B8D8B] transition hover:bg-white/90"
              >
                Ver productos
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Imagen real de la escena de productos (recortada del asset provisto,
                sin el texto/botón/flechas que traía "horneados" el archivo original) */}
            <img
              src={heroProductosImg}
              alt="Reloj inteligente, monitor, webcam e impresora sobre plataformas"
              className="w-full max-w-[420px] rounded-xl object-contain sm:w-[420px]"
            />
          </div>

        </div>

        {/* Panel lateral de beneficios */}
        <div className="rounded-2xl bg-[#3a9c99] px-5 py-6 text-white shadow-md flex flex-col gap-5 justify-center">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Truck size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Envío gratis</p>
              <p className="text-xs text-white/80">en compras +$50.000</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Cuotas sin interés</p>
              <p className="text-xs text-white/80">Hasta 3 cuotas</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Compra 100% segura</p>
              <p className="text-xs text-white/80">Protegemos tus datos</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Headphones size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Atención personalizada</p>
              <p className="text-xs text-white/80">Estamos para ayudarte</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos destacados — tarjeta */}
      <div id="catalogo" className="rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100">
        <div className="py-6 px-4 sm:px-6">
          <div className="mb-5 flex items-center justify-between max-w-[1400px] mx-auto">
            <h2 className="text-lg font-bold text-black">Productos destacados</h2>
            <button
              onClick={() =>
                document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-1 text-sm font-semibold text-[#2B8D8B] hover:underline"
            >
              Ver todos
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Estado de carga y error del fetch al catálogo */}
          {cargandoProductos ? (
            <p className="text-center text-sm text-gray-500">Cargando productos…</p>
          ) : errorProductos ? (
            <p className="text-center text-sm text-red-500">{errorProductos}</p>
          ) : productosFiltrados.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No se encontraron productos para "{busqueda}".
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-[1400px] mx-auto">
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.id}
                  className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-2">
                    <div className="h-24 w-full rounded-lg bg-gray-100 flex items-center justify-center p-2">
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="h-full w-full object-contain"
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
                    onClick={() => handleAgregar(producto)}
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

                  {/* Solo mostramos el botón si el producto tiene imagen para ampliar */}
                  {producto.imagen && (
                    <button
                      onClick={() => setImagenAmpliada(producto)}
                      className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-[#457B9D] px-3 py-2 text-xs font-semibold text-[#457B9D] transition hover:bg-[#457B9D]/10"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Ver detalles
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagen ampliada del producto */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setImagenAmpliada(null)}
        >
          <div
            className="relative max-w-lg rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()} // evita que el clic adentro cierre el modal
          >
            <button
              onClick={() => setImagenAmpliada(null)}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-md hover:text-black"
              aria-label="Cerrar"
            >
              ✕
            </button>
            <img
              src={imagenAmpliada.imagen}
              alt={imagenAmpliada.nombre}
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />
            <p className="mt-3 text-center text-sm font-semibold text-black">
              {imagenAmpliada.nombre}
            </p>
          </div>
        </div>
      )}

      {/* Toast de confirmación al agregar al carrito */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-5 py-2.5 text-sm font-medium text-white shadow-lg">
          ✅ {toast}
        </div>
      )}
    </div>
  );
}