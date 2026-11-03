import { useEffect, useState } from "react";
import api from "../../services/api";
import { UMBRAL_BAJO_STOCK } from "../../config";
import { formatearFecha, fechaDe } from "../../utils/formato";

const Tarjeta = ({ titulo, valor, alerta }) => (
    <div className="col-6 col-lg-3">
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <div className="text-muted small">{titulo}</div>
                <div className={`fs-2 fw-semibold ${alerta ? "text-danger" : ""}`}>{valor}</div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                const [p, c, pr, m] = await Promise.all([
                    api.get("/productos"),
                    api.get("/categorias"),
                    api.get("/proveedores"),
                    api.get("/movimientos"),
                ]);
                setProductos(p.data);
                setCategorias(c.data);
                setProveedores(pr.data);
                setMovimientos(m.data);
            } catch {
                setError("No se pudo cargar el resumen. Verifica que el backend esté en ejecución.");
            }
        };
        cargar();
    }, []);

    const bajoStock = productos.filter((p) => Number(p.stock) <= UMBRAL_BAJO_STOCK).length;

    const recientes = [...movimientos]
        .sort((a, b) => new Date(fechaDe(b)) - new Date(fechaDe(a)))
        .slice(0, 5);

    const stockPorCategoria = categorias.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        stock: productos.filter((p) => p.categoria_id === c.id).reduce((suma, p) => suma + Number(p.stock), 0),
    }));
    const maxStock = Math.max(1, ...stockPorCategoria.map((c) => c.stock));

    return (
        <div>
            <h3 className="mb-3">Dashboard</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-3 mb-4">
                <Tarjeta titulo="Total de productos" valor={productos.length} />
                <Tarjeta titulo="Categorías" valor={categorias.length} />
                <Tarjeta titulo="Proveedores" valor={proveedores.length} />
                <Tarjeta titulo="Bajo stock (alertas)" valor={bajoStock} alerta={bajoStock > 0} />
            </div>

            <div className="row g-3">
                <div className="col-lg-7">
                    <div className="card shadow-sm p-3 h-100">
                        <h5>Movimientos recientes (Kardex)</h5>
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Producto</th>
                                        <th>Tipo</th>
                                        <th>Cantidad</th>
                                        <th>Usuario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recientes.map((m) => (
                                        <tr key={m.id}>
                                            <td>{formatearFecha(m)}</td>
                                            <td>{m.producto?.nombre ?? "-"}</td>
                                            <td>{m.tipo_movimiento}</td>
                                            <td className={m.tipo_movimiento === "Salida" ? "text-danger" : "text-success"}>
                                                {m.tipo_movimiento === "Salida" ? `-${m.cantidad}` : `+${m.cantidad}`}
                                            </td>
                                            <td>{m.usuario?.nombre ?? "-"}</td>
                                        </tr>
                                    ))}
                                    {recientes.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-muted">
                                                Aún no hay movimientos. Registra el primero desde Kardex.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card shadow-sm p-3 h-100">
                        <h5>Stock por categoría</h5>
                        {stockPorCategoria.map((c) => (
                            <div key={c.id} className="mb-3">
                                <div className="d-flex justify-content-between small">
                                    <span>{c.nombre}</span>
                                    <span>{c.stock}</span>
                                </div>
                                <div className="progress" style={{ height: "8px" }}>
                                    <div className="progress-bar" style={{ width: `${(c.stock / maxStock) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                        {stockPorCategoria.length === 0 && (
                            <p className="text-muted mb-0">Crea categorías y productos para ver el stock aquí.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
