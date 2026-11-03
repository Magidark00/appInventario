import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import CrudProductos from "./components/Productos/CrudProductos";
import Categorias from "./components/Categorias/Categorias";
import Proveedores from "./components/Proveedores/Proveedores";
import Kardex from "./components/Kardex/Kardex";
import Usuarios from "./components/Usuarios/Usuarios";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/productos" element={<CrudProductos />} />
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/proveedores" element={<Proveedores />} />
                    <Route path="/kardex" element={<Kardex />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
