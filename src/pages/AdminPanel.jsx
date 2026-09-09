import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, ImageOff, ChevronLeft } from "lucide-react";
import EditarProducto from "./EditarProducto"; // modal de edición
import NuevoProducto from "./NuevoProducto"; // modal de alta
import { useAuth } from "../context/AuthContext"; // ajustá la ruta si tu AuthContext está en otro lugar
import logoNM from "../assets/logo-novamarket.png";

const PRODUCTS_URL = vite.env.VITE_API_URL + "/api/products";
const ORDERS_URL = vite.env.VITE_API_URL + "/api/orders";

const CATEGORY_LABELS = {
  accesorios: "Accesorios",
  "periféricos": "Periféricos",
  gadgets: "Gadgets",
};

const ESTADOS = ["pending", "paid", "shipped", "delivered", "cancelled"];

const ESTADO_LABEL = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Controla qué sección se muestra dentro de la misma pantalla:
  // "productos" (listado + alta/edición/borrado) u "ordenes" (listado de compras)
  const [vista, setVista] = useState("productos");

  // ----- Estado de Productos -----
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [productoABorrar, setProductoABorrar] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarNuevoProducto, setMostrarNuevoProducto] = useState(false);

  // ----- Estado de Órdenes -----
  const [ordenes, setOrdenes] = useState([]);
  const [cargandoOrdenes, setCargandoOrdenes] = useState(false);
  const [errorOrdenes, setErrorOrdenes] = useState(null);
  // Evita volver a pedir las órdenes al backend cada vez que se cambia de pestaña
  const [ordenesCargadas, setOrdenesCargadas] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  // Carga las órdenes recién la primera vez que se entra a esa pestaña
  useEffect(() => {
    if (vista === "ordenes" && !ordenesCargadas) {
      cargarOrdenes();
    }
  }, [vista, ordenesCargadas]);

  async function cargarProductos() {
    setCargandoProductos(true);
    setErrorProductos(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(PRODUCTS_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("No se pudo obtener el listado de productos");
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : data.products ?? []);
    } catch (err) {
      setErrorProductos(err.message);
    } finally {
      setCargandoProductos(false);
    }
  }

  async function cargarOrdenes() {
    setCargandoOrdenes(true);
    setErrorOrdenes(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(ORDERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudieron cargar las órdenes");
      const data = await res.json();
      setOrdenes(data);
      setOrdenesCargadas(true);
    } catch (err) {
      setErrorOrdenes(err.message);
    } finally {
      setCargandoOrdenes(false);
    }
  }

  async function handleCambiarEstado(ordenId, nuevoEstado) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${ORDERS_URL}/${ordenId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado");

      setOrdenes((prev) =>
        prev.map((o) => (o._id === ordenId ? { ...o, status: nuevoEstado } : o))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  // Cierra la sesión (borra token/user del AuthContext y localStorage) y vuelve al home
  function handleCerrarSesion() {
    logout();
    navigate("/");
  }

  const productosFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return productos;
    return productos.filter((p) => {
      const categoria = CATEGORY_LABELS[p.category] ?? p.category ?? "";
      return (
        p.name?.toLowerCase().includes(term) ||
        categoria.toLowerCase().includes(term)
      );
    });
  }, [productos, busqueda]);

  async function confirmarBorrado() {
    if (!productoABorrar) return;
    setBorrando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${PRODUCTS_URL}/${productoABorrar._id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("No se pudo eliminar el producto");
      // Eliminación lógica: el back devuelve el producto con active:false
      setProductos((prev) =>
        prev.filter((p) => p._id !== productoABorrar._id)
      );
      setProductoABorrar(null);
    } catch (err) {
      setErrorProductos(err.message);
    } finally {
      setBorrando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header único para ambas secciones */}
      <header className="bg-teal-700 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Vuelve a la tienda (home), ya que el admin llega acá desde el botón "Administración" del header */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 rounded-full bg-[#457B9D] px-3 py-1.5 text-sm font-medium hover:bg-[#3a6a87]"
            >
              <ChevronLeft size={16} />
              Volver
            </button>
            <div className="flex h-20 w-19 items-center justify-center rounded-md bg-[#457B9D] p-1 shadow-sm">
              <img
                src={logoNM}
                alt="NovaMarket - E-commerce"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-sm font-semibold tracking-wide sm:text-base">
              ADMINISTRACIÓN
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {/* Pestañas: cambian el estado "vista", no navegan a otra ruta */}
            <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
              <button
                onClick={() => setVista("productos")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  vista === "productos"
                    ? "bg-[#457B9D] text-white"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => setVista("ordenes")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  vista === "ordenes"
                    ? "bg-[#457B9D] text-white"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                Órdenes
              </button>
            </div>

            <span className="hidden sm:inline">Usuario: {user?.name ?? "—"}</span>
            <button
              onClick={handleCerrarSesion}
              className="rounded bg-[#457B9D] px-3 py-1.5 font-medium hover:bg-[#3a6a87]"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido: productos u órdenes según la pestaña activa */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {vista === "productos" ? (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setMostrarNuevoProducto(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#457B9D] px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus size={18} />
                Nuevo Producto
              </button>

              <div className="relative w-full sm:w-96">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ingrese producto o categoría"
                  className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {errorProductos && (
                <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
                  {errorProductos}
                </div>
              )}

              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Id</th>
                    <th className="px-6 py-3 font-medium">Descripción</th>
                    <th className="px-6 py-3 font-medium">Imagen</th>
                    <th className="px-6 py-3 font-medium">Precio</th>
                    <th className="px-6 py-3 font-medium">Stock</th>
                    <th className="px-6 py-3 font-medium text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cargandoProductos ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                        Cargando productos…
                      </td>
                    </tr>
                  ) : productosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                        No se encontraron productos.
                      </td>
                    </tr>
                  ) : (
                    productosFiltrados.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-slate-600">{p._id?.slice(-4)}</td>
                        <td className="px-6 py-3 font-medium text-slate-800">{p.name}</td>
                        <td className="px-6 py-3">
                          {p.image || p.imageUrl ? (
                            <img
                              src={p.image || p.imageUrl}
                              alt={p.name}
                              className="h-10 w-10 rounded-md border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-300">
                              <ImageOff size={16} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3 text-slate-700">{formatPrice(p.price)}</td>
                        <td className="px-6 py-3 text-slate-700">{p.stock}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setProductoEditando(p)}
                              title="Editar producto"
                              className="rounded-md border border-slate-200 p-2 text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setProductoABorrar(p)}
                              title="Eliminar producto"
                              className="rounded-md border border-slate-200 p-2 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            {cargandoOrdenes && <p className="text-sm text-gray-500">Cargando órdenes...</p>}
            {errorOrdenes && <p className="text-sm text-red-600">{errorOrdenes}</p>}

            {!cargandoOrdenes && !errorOrdenes && ordenes.length === 0 && (
              <p className="text-sm text-gray-500">No hay órdenes registradas.</p>
            )}

            {!cargandoOrdenes && ordenes.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="py-2 pr-4">Cliente</th>
                      <th className="py-2 pr-4">Productos</th>
                      <th className="py-2 pr-4">Total</th>
                      <th className="py-2 pr-4">Fecha</th>
                      <th className="py-2 pr-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenes.map((orden) => (
                      <tr key={orden._id} className="border-b border-gray-100">
                        <td className="py-2 pr-4">{orden.user?.name || orden.user?.email || "—"}</td>
                        <td className="py-2 pr-4">
                          {orden.items.map((it, idx) => (
                            <div key={it.product?._id || idx}>
                              {it.quantity} × {it.product?.name || "Producto eliminado"}
                            </div>
                          ))}
                        </td>
                        <td className="py-2 pr-4 font-semibold text-[#457B9D]">
                          $ {orden.total?.toLocaleString("es-AR")}
                        </td>
                        <td className="py-2 pr-4">
                          {new Date(orden.createdAt).toLocaleDateString("es-AR")}
                        </td>
                        <td className="py-2 pr-4">
                          <select
                            value={orden.status}
                            onChange={(e) => handleCambiarEstado(orden._id, e.target.value)}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                          >
                            {ESTADOS.map((estado) => (
                              <option key={estado} value={estado}>
                                {ESTADO_LABEL[estado]}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de confirmación de borrado (solo aplica a productos) */}
      {productoABorrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-center text-base font-semibold text-red-600">
              Confirma el producto a borrar
            </h2>
            <p className="mb-6 text-center text-sm text-slate-600">
              {productoABorrar.name}
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmarBorrado}
                disabled={borrando}
                className="flex-1 rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
              >
                {borrando ? "Eliminando…" : "Confirmar Producto"}
              </button>
              <button
                onClick={() => setProductoABorrar(null)}
                disabled={borrando}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de producto */}
      {productoEditando && (
        <EditarProducto
          producto={productoEditando}
          onClose={() => setProductoEditando(null)}
          onGuardado={(actualizado) => {
            // Reemplaza el producto editado dentro de la lista, sin volver a pedir todo al back
            setProductos((prev) =>
              prev.map((p) => (p._id === actualizado._id ? actualizado : p))
            );
          }}
        />
      )}
      {/* Modal de alta de producto */}
      {mostrarNuevoProducto && (
        <NuevoProducto
          onClose={() => setMostrarNuevoProducto(false)}
          onCreado={(nuevo) => {
            // Agrega el producto recién creado al principio de la lista, sin recargar todo
            setProductos((prev) => [nuevo, ...prev]);
          }}
        />
      )}
    </div>
  );
}