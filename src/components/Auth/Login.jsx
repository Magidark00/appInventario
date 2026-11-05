import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
    const [modoRegistro, setModoRegistro] = useState(false);
    const [form, setForm] = useState({ nombre: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);
        try {
            const endpoint = modoRegistro ? "/auth/register" : "/auth/login";
            const { data } = await api.post(endpoint, form);
            localStorage.setItem("token", data.token);
            window.dispatchEvent(new Event("auth:changed"));
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || "No se pudo conectar con el servidor. Intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="login-pagina">
            <section className="login-tarjeta">
                <img src="/senati-logo.png" alt="SENATI" className="login-logo" />
                <p className="login-etiqueta">SISTEMA DE INVENTARIO</p>
                <h1>{modoRegistro ? "Crear cuenta" : "Bienvenido"}</h1>
                <p className="login-descripcion">
                    {modoRegistro ? "Registra tu acceso al panel de inventario." : "Inicia sesión para continuar al panel administrativo."}
                </p>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {modoRegistro && (
                        <div className="mb-3">
                            <label className="form-label" htmlFor="nombre">Nombre</label>
                            <input id="nombre" name="nombre" autoComplete="name" className="form-control" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                        </div>
                    )}
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Correo electrónico</label>
                        <input id="email" name="email" type="email" autoComplete="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input id="password" name="password" type="password" autoComplete={modoRegistro ? "new-password" : "current-password"} minLength={modoRegistro ? 8 : undefined} className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                        {modoRegistro && <small className="text-secondary">Usa al menos 8 caracteres.</small>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={cargando}>
                        {cargando ? "Procesando…" : modoRegistro ? "Crear cuenta" : "Iniciar sesión"}
                    </button>
                </form>
                <button className="btn btn-link w-100 mt-3" onClick={() => { setModoRegistro(!modoRegistro); setError(""); }}>
                    {modoRegistro ? "Ya tengo una cuenta" : "Crear una cuenta de almacenero"}
                </button>
            </section>
        </main>
    );
};

export default Login;
