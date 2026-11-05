import { useEffect, useState } from "react";
import api from "../../services/api";
import useTabla from "../../hooks/useTabla";
import Paginacion from "../Comunes/Paginacion";
import { formatearFecha, fechaDe } from "../../utils/formato";

const claseTipo = {
    Entrada: "text-bg-success",
    Salida: "text-bg-danger",
    Ajuste: "text-bg-warning",
};

const formVacio = { producto_id: "", tipo_movimiento: "Entrada", cantidad: "", observaciones: "" };

const Kardex = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState(formVacio);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [error, setError] = useState("");

    const tabla = useTabla(movimientos, (m) => [m.producto?.nombre, m.tipo_movimiento, m.usuario?.nombre]);

    const cargar = async () => {
        try {
            const [mov, prod] = await Promise.all([
                api.get("/movimientos"),
                api.get("/productos"),
            ]);
            // Los más recientes primero
            setMovimientos([...mov.data].sort((a, b) => new Date(fechaDe(b)) - new Date(fechaDe(a))));
            setProductos(prod.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.error ||
                `No se pudo cargar el Kardex (${err.config?.url}: ${err.message})`
            );
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const cancelar = () => {
        setForm(formVacio);
        setMostrarForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/movimientos", {
                ...form,
                producto_id: Number(form.producto_id),
                cantidad: Number(form.cantidad),
            });
            cancelar();
            cargar(); // vuelve a leer productos para reflejar el stock actualizado
        } catch (err) {
            setError(err.response?.data?.error || "No se pudo registrar el movimiento.");
        }
    };

    const cantidadConSigno = (m) => (m.tipo_movimiento === "Salida" ? `-${m.cantidad}` : `+${m.cantidad}`);

    const sinDatosBase = productos.length === 0;

    return (
        <div>
            <h3 className="mb-3">Kardex / Movimientos</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between gap-3 mb-3">
                <input
                    type="search"
                    className="form-control w-50"
                    placeholder="Buscar por producto, tipo o usuario..."
                    value={tabla.busqueda}
                    onChange={(e) => tabla.buscar(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => (mostrarForm ? cancelar() : setMostrarForm(true))}>
                    {mostrarForm ? "Cerrar formulario" : "+ Registrar movimiento"}
                </button>
            </div>

            {mostrarForm && (
                <form onSubmit={handleSubmit} className="card p-3 mb-3 shadow-sm">
                    <h5>Registrar movimiento</h5>

                    {sinDatosBase && (
                        <div className="alert alert-warning">
                            Necesitas al menos un producto registrado para crear un movimiento.
                        </div>
                    )}

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Producto</label>
                            <select name="producto_id" className="form-select" value={form.producto_id} onChange={handleChange} required>
                                <option value="">Selecciona un producto</option>
                                {productos.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre} (stock: {p.stock})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Tipo de movimiento</label>
                            <select name="tipo_movimiento" className="form-select" value={form.tipo_movimiento} onChange={handleChange}>
                                <option value="Entrada">Entrada</option>
                                <option value="Salida">Salida</option>
                                <option value="Ajuste">Ajuste</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Cantidad</label>
                            <input
                                type="number"
                                name="cantidad"
                                min="1"
                                className="form-control"
                                value={form.cantidad}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Observaciones</label>
                            <input name="observaciones" className="form-control" value={form.observaciones} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={sinDatosBase}>
                            Registrar
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="card shadow-sm p-3">
                <h5>Lista de movimientos (Kardex)</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Fecha / hora</th>
                                <th>Producto</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Usuario</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabla.visibles.map((m) => (
                                <tr key={m.id}>
                                    <td>{m.id}</td>
                                    <td>{formatearFecha(m)}</td>
                                    <td>{m.producto?.nombre ?? "-"}</td>
                                    <td>
                                        <span className={`badge ${claseTipo[m.tipo_movimiento] ?? "text-bg-secondary"}`}>
                                            {m.tipo_movimiento}
                                        </span>
                                    </td>
                                    <td>{cantidadConSigno(m)}</td>
                                    <td>{m.usuario?.nombre ?? "-"}</td>
                                    <td>{m.observaciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Paginacion tabla={tabla} nombre="movimientos" />
            </div>
        </div>
    );
};

export default Kardex;