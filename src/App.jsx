import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import CrudProductos from "./components/Productos/CrudProductos";
import Categorias from "./components/Categorias/Categorias";
import Proveedores from "./components/Proveedores/Proveedores";
import Kardex from "./components/Kardex/Kardex";
import Usuarios from "./components/Usuarios/Usuarios";

function App() {
    const [autenticado, setAutenticado] = useState(() => Boolean(localStorage.getItem("token")));

    useEffect(() => {
        const actualizar = () => setAutenticado(Boolean(localStorage.getItem("token")));
        window.addEventListener("auth:changed", actualizar);
        window.addEventListener("auth:expired", actualizar);
        return () => {
            window.removeEventListener("auth:changed", actualizar);
            window.removeEventListener("auth:expired", actualizar);
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={autenticado ? <Navigate to="/dashboard" replace /> : <Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/productos" element={<CrudProductos />} />
                        <Route path="/categorias" element={<Categorias />} />
                        <Route path="/proveedores" element={<Proveedores />} />
                        <Route path="/kardex" element={<Kardex />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to={autenticado ? "/dashboard" : "/login"} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
