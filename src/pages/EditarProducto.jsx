import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";

// Endpoint base de productos en el backend
const API_URL = import.meta.env.VITE_API_BACK + "/api/products";

// Categorías fijas que acepta el backend (enum: accesorios | periféricos | gadgets)
const CATEGORIAS = [
  { value: "accesorios", label: "Accesorios" },
  { value: "periféricos", label: "Periféricos" },
  { value: "gadgets", label: "Gadgets" },
];

// Modal de edición de un producto.
// Props:
//   - producto: objeto del producto a editar (viene del listado)
//   - onClose: cierra el modal sin guardar
//   - onGuardado: se llama con el producto actualizado que devuelve el back
export default function EditarProducto({ producto, onClose, onGuardado }) {
  // Estado del formulario, inicializado con los datos actuales del producto
  const [form, setForm] = useState({
    name: producto.name ?? "",
    description: producto.description ?? "",
    price: producto.price ?? "",
    category: producto.category ?? "",
    stock: producto.stock ?? "",
  });

  // Archivo de imagen nuevo (si el usuario elige cambiarla)
  const [nuevaImagen, setNuevaImagen] = useState(null);
  // URL para mostrar la preview: la imagen actual del producto, o la nueva si se cambió
  const [previewUrl, setPreviewUrl] = useState(producto.image || producto.imageUrl || "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  // Referencia al input de tipo file, oculto, para poder abrirlo con el botón "Cambiar Imagen"
  const inputImagenRef = useRef(null);

  // Actualiza el campo del formulario que cambió
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Cuando se selecciona un archivo nuevo, lo guardamos y generamos una preview local
  function handleCambiarImagen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNuevaImagen(file);
    setPreviewUrl(URL.createObjectURL(file));
  }



  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validaciones básicas en el cliente, espejando las validaciones del backend
    if (!form.name.trim()) return setError("La descripción es obligatoria.");
    if (!form.price || Number(form.price) <= 0)
      return setError("El precio debe ser mayor a 0.");
    if (!form.category) return setError("Elegí una categoría.");
    if (form.stock === "" || Number(form.stock) < 0)
      return setError("El stock no puede ser negativo.");

    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      let res;

       const cambios = {};
    if (form.name !== producto.name) cambios.name = form.name;
    if (form.description !== producto.description) cambios.description = form.description;
    if (Number(form.price) !== Number(producto.price)) cambios.price = Number(form.price);
    if (form.category !== producto.category) cambios.category = form.category;
    if (Number(form.stock) !== Number(producto.stock)) cambios.stock = Number(form.stock);
    if (Object.keys(cambios).length === 0 && !nuevaImagen) {
      setGuardando(false);
      return; // nada que guardar
    }

      if (nuevaImagen) {
        // Si hay imagen nueva, mandamos multipart/form-data (el back sube la imagen
        // a Cloudinary y borra la anterior)
        const formData = new FormData();
        //formData.append("name", form.name);
        // formData.append("description", form.description);
        // formData.append("price", Number(form.price));
        // formData.append("category", form.category);
        // formData.append("stock", Number(form.stock));
        // formData.append("image", nuevaImagen); 

        Object.entries(cambios).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("image", nuevaImagen);
        
        


        res = await fetch(`${API_URL}/${producto._id}`, {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      } else {
        // Sin imagen nueva, mandamos JSON plano (no tocamos la imagen actual)
        res = await fetch(`${API_URL}/${producto._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(cambios)
          
        });
      }

      const data = await res.json().catch(() => ({})); // si no hay JSON, devolvemos un objeto vacío
      if (!res.ok) throw new Error(data.error || "No se pudo actualizar el producto");

      // Avisamos al padre (AdminProductos) para que actualice la fila en la tabla
      onGuardado?.(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    // Overlay oscuro que cubre toda la pantalla, típico de un modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Encabezado del modal con botón de cerrar (X) */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Editar Producto</h2>
            <p className="text-xs text-slate-500">Corregir datos de productos</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {/* Id del producto: solo lectura, no se puede modificar */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nro Id
            </label>
            <input
              type="text"
              value={producto._id}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
            />
            <p className="mt-1 text-xs text-slate-400">No se puede modificar</p>
          </div>

          {/* Descripción del wireframe -> mapea al campo "name" del backend */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Descripción
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Campo extra (no estaba en el wireframe) para el "description" que sí soporta el back */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Detalle
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Precio
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              {/* Cantidad y Stock del wireframe se unificaron en un solo campo: stock */}
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Select "Tecnología" del wireframe -> mapea al enum "category" del backend */}
          <div className="mb-5">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tecnología
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="" disabled>
                Seleccioná una categoría
              </option>
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Imagen actual + botón para reemplazarla (dispara el input file oculto) */}
          <div className="mb-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Imagen
            </label>
            <div className="flex items-center gap-3">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={form.name}
                  className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-300">
                  <ImagePlus size={20} />
                </div>
              )}
              <button
                type="button"
                onClick={() => inputImagenRef.current?.click()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Cambiar Imagen
              </button>
              <input
                ref={inputImagenRef}
                type="file"
                accept="image/*"
                onChange={handleCambiarImagen}
                className="hidden"
              />
            </div>
          </div>

          {/* Mensaje de error de validación o de la API */}
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Acciones: guardar cambios o cerrar sin guardar (vuelve al listado) */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {guardando ? "Actualizando…" : "Actualizar Producto"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              Cerrar sin Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}