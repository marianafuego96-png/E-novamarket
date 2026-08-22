import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, totalPrecio, updateQuantity, removeFromCart } = useCart();

  const [form, setForm] = useState({
    nombre: "",
    direccionEnvio: "",
    provincia: "",
    ciudad: "",
    direccionFacturacion: "",
    codigoPostal: "",
    telefono: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleGuardarDatos(e) {
    e.preventDefault();
    // Acá después conectamos con el backend para guardar la orden
    console.log("Datos del cliente:", form);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Encabezado — mismo lenguaje visual que el home (logo, nombre, usuario, cerrar sesión) */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="rounded-2xl bg-white px-4 py-3 sm:px-6 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Volver: mismo lugar que estaba, ahora integrado en la barra */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 bg-[#457B9D] text-sm font-semibold text-white transition hover:bg-[#3a6a87]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>

            {/* Logo, igual al del header del home */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#457B9D] text-sm font-semibold text-white text-teal-950 ">
                NM
              </div>
              <span className="text-sm font-medium text-black">Nova-Market</span>
            </div>
          </div>

          {/* Usuario logueado, igual que en el home */}
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-black">Hola, {user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-[#457B9D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3a6a87]"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-6">
        {/* Resumen del Pedido */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-base font-bold text-black mb-4">Resumen del Pedido</h2>

          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Tu carrito está vacío.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="h-28 w-full rounded-lg bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
                  {item.imagen && (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="text-sm font-semibold text-black uppercase">
                  {item.nombre}
                </p>
                <p className="text-sm font-bold text-[#457B9D] mt-1">
                  $ {item.precio.toLocaleString("es-AR")}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    className="h-6 w-6 rounded-full bg-gray-200 text-sm font-bold hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="text-sm">Cantidad: {item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    className="h-6 w-6 rounded-full bg-gray-200 text-sm font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-500 hover:underline mt-2"
                >
                  Quitar
                </button>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-bold text-black">
                Total: $ {totalPrecio.toLocaleString("es-AR")}
              </p>
            </div>
          )}
        </div>

        {/* Checkout - formulario */}
        <div className="bg-[#A39F9F] rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-black text-center">Checkout</h2>
          <p className="text-sm text-black text-center mb-6">
            Completa los datos del cliente
          </p>

          <form onSubmit={handleGuardarDatos} className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Nombre Completo:
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ingresar su Nombre Completo"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Dirección de envío
              </label>
              <input
                type="text"
                name="direccionEnvio"
                value={form.direccionEnvio}
                onChange={handleChange}
                placeholder="Ingresar dirección de envío"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Provincia
              </label>
              <input
                type="text"
                name="provincia"
                value={form.provincia}
                onChange={handleChange}
                placeholder="Ingresar su Provincia"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                placeholder="Ingresar su Ciudad"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Dirección de facturación
              </label>
              <input
                type="text"
                name="direccionFacturacion"
                value={form.direccionFacturacion}
                onChange={handleChange}
                placeholder="Ingresar dirección de facturación"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Codigo Postal
              </label>
              <input
                type="text"
                name="codigoPostal"
                value={form.codigoPostal}
                onChange={handleChange}
                placeholder="Ingresar su Codigo Postal"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">
                Telefono:
              </label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ingresar su Telefono"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#457B9D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3a6a87]"
            >
              Guardar datos
            </button>
          </form>
        </div>

        {/* Realizar el Pago */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-base font-bold text-black text-center mb-4">
            Realizar el Pago
          </h2>
          <div className="h-40 rounded-lg border border-gray-300 flex items-center justify-center text-center text-sm text-gray-500 px-2">
            Comprobante<br />de<br />Pago
          </div>
        </div>
      </div>
    </div>
  );
}