import { NavLink, Outlet } from "react-router-dom";
import "../../estilos/panel.css";
import {
    IconoInicio,
    IconoProductos,
    IconoCategorias,
    IconoProveedores,
    IconoKardex,
    IconoUsuarios,
} from "./iconos";

const enlaces = [
    { to: "/dashboard", texto: "Inicio (Dashboard)", icono: <IconoInicio /> },
    { to: "/productos", texto: "Productos", icono: <IconoProductos /> },
    { to: "/categorias", texto: "Categorías", icono: <IconoCategorias /> },
    { to: "/proveedores", texto: "Proveedores", icono: <IconoProveedores /> },
    { to: "/kardex", texto: "Kardex / Movimientos", icono: <IconoKardex /> },
    { to: "/usuarios", texto: "Usuarios", icono: <IconoUsuarios /> },
];

const Layout = () => (
    <div className="panel">
        <aside className="panel-sidebar">
            <div className="panel-marca">
                {/* El archivo está en la carpeta public/ */}
                <img src="/senati-logo.png" alt="SENATI" className="panel-logo" />
                <span className="panel-marca-texto">Sistema de Inventario</span>
            </div>
            <nav className="panel-nav">
                {enlaces.map((e) => (
                    <NavLink key={e.to} to={e.to} className={({ isActive }) => (isActive ? "activo" : "")}>
                        {e.icono}
                        <span>{e.texto}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>

        <div className="panel-contenido">
            <header className="panel-topbar">Panel administrativo</header>
            <main className="panel-main">
                <Outlet />
            </main>
        </div>
    </div>
);

export default Layout;
