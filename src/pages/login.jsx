import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import logoNM from "../assets/logo-novamarket.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await loginUser(form);
      login(user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 px-4 py-10">
      {/* Encabezado: logo + nombre, con link para volver al inicio */}
      <Link to="/" className="mb-10 flex items-center gap-3">
        <div className="flex h-20 w-19 items-center justify-center rounded-lg bg-[#457B9D] p-1.5 shadow-sm">
          <img
            src={logoNM}
            alt="NovaMarket - E-commerce"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="text-left">
          <p className="text-base font-bold text-slate-900">Nova-Market</p>
          <p className="text-xs text-slate-500">Tu ecommerce de confianza</p>
        </div>
      </Link>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Iniciar sesión</h1>
        <p className="text-sm text-slate-500 mb-6">Ingresá tus datos para ingresar a tu cuenta</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo electronico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="juan@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#457B9D] px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-[#3a6a87]"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>

      {/* Link para ir a registro, ya que no hay header/nav en esta pantalla */}
      <p className="mt-6 text-sm text-slate-600">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="font-semibold text-[#457B9D] hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
}