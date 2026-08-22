import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
 
// Endpoint base de productos en el backend
const API_URL = "http://localhost:5000/api/products";
 
// Categorías fijas que acepta el backend (enum: accesorios | periféricos | gadgets)
const CATEGORIAS = [
  { value: "accesorios", label: "Accesorios" },
  { value: "periféricos", label: "Periféricos" },
  { value: "gadgets", label: "Gadgets" },
];
 
// Modal de alta de un producto nuevo.
// Props:
//   - onClose: cierra el modal sin guardar
//   - onCreado: se llama con el producto que devuelve el back al crearse
export default function NuevoProducto({ onClose, onCreado }) {
  // Formulario vacio por defecto
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
 
  const [imagen, setImagen] = useState(null); // archivo elegido
  const [previewUrl, setPreviewUrl] = useState(""); // preview local de la imagen elegida
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const inputImagenRef = useRef(null);
 
  // Actualiza el campo del formulario que cambió
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
 
  // Guarda el archivo elegido y genera una preview local antes de subirlo
  function handleElegirImagen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagen(file);
    setPreviewUrl(URL.createObjectURL(file));
  }
 
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
 
    // Mismas validaciones que espera el backend (name, price > 0, category, stock >= 0)
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
 
      if (imagen) {
        // Con imagen: multipart/form-data (el back la sube a Cloudinary)
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("stock", form.stock);
        formData.append("image", imagen);
 
        res = await fetch(API_URL, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      } else {
        // Sin imagen: JSON plano (el producto queda sin foto por ahora)
        res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            category: form.category,
            stock: Number(form.stock),
          }),
        });
      }
 
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear el producto");
 
      // Avisamos al padre (AdminProductos) para que agregue la fila nueva a la tabla
      onCreado?.(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }
  return (
    // Overlay oscuro que cubre toda la pantalla, igual que en EditarProducto
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Encabezado del modal */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Nuevo Producto</h2>
            <p className="text-xs text-slate-500">Completá los datos del nuevo producto</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
 
        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-6 py-5">
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
              placeholder="Ingresar descripción"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
 
          {/* Precio */}
          <div className="mb-4">
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
              placeholder="Ingresar su precio"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
 
          {/* Select "Categoría" del wireframe ("Todas las Categoria") -> enum "category" del backend.
              El segundo select de "Marca" del wireframe se saca, igual que en EditarProducto,
              porque el backend no tiene un campo de marca. */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Categoría
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
 
          {/* Stock */}
          <div className="mb-5">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              placeholder="Ingresar el stock"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
 
          {/* Imagen: opcional. Se puede crear el producto sin imagen y agregarla después
              editando (como vimos, subir imagen depende de que el back tenga Cloudinary configurado) */}
          <div className="mb-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Imagen
            </label>
            <button
              type="button"
              onClick={() => inputImagenRef.current?.click()}
              className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-indigo-300 hover:text-indigo-500"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={22} />
              )}
            </button>
            <input
              ref={inputImagenRef}
              type="file"
              accept="image/*"
              onChange={handleElegirImagen}
              className="hidden"
            />
          </div>
 
          {/* Mensaje de error de validación o de la API */}
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
 
          {/* Único botón de acción, como en el wireframe (sin "cancelar" explícito ahí,
              pero se puede cerrar con la X del encabezado) */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={guardando}
              className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
            >
              {guardando ? "Guardando…" : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 