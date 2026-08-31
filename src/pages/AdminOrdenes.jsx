import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ESTADOS = ["pending", "paid", "shipped", "delivered", "cancelled"];

const ESTADO_LABEL = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function AdminOrdenes() {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  async function cargarOrdenes() {
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudieron cargar las órdenes");
      const data = await res.json();
      setOrdenes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function handleCambiarEstado(ordenId, nuevoEstado) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${ordenId}/status`, {
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto mb-6">
        <div className="rounded-2xl bg-white px-4 py-3 sm:px-6 shadow-md flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 bg-[#457B9D] text-sm font-semibold text-white hover:bg-[#3a6a87]"
          >
            Volver
          </button>
          <h1 className="text-lg font-bold text-black">Órdenes de compra</h1>

          {/* Pestañas entre pantallas de admin */}
          <div className="ml-auto flex items-center gap-1 rounded-full bg-gray-100 p-1">
            <button
              onClick={() => navigate("/admin")}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-white/60"
            >
              Productos
            </button>
            <span className="rounded-full bg-[#457B9D] px-3 py-1.5 text-xs font-semibold text-white">
              Órdenes
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        {cargando && <p className="text-sm text-gray-500">Cargando órdenes...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!cargando && !error && ordenes.length === 0 && (
          <p className="text-sm text-gray-500">No hay órdenes registradas.</p>
        )}

        {!cargando && ordenes.length > 0 && (
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
    </div>
  );
}