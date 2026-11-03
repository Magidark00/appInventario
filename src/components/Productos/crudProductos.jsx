import { useEffect, useState } from "react";
import api from "../../services/api";
import useTabla from "../../hooks/useTabla";
import Paginacion from "../Comunes/Paginacion";
import { UMBRAL_BAJO_STOCK } from "../../config";
import { soles } from "../../utils/formato";

const formVacio = { id: null, nombre: "", descripcion: "", precio: "", stock: "", categoria_id: "", proveedor_id: "" };

const CrudProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState(formVacio);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [error, setError] = useState("");

    const tabla = useTabla(productos, (p) => [p.nombre, p.categoria?.nombre]);

    const cargar = async () => {
        try {
            // Las categorías llenan el <select> del formulario (reto técnico de la guía)
            const [prod, cat, pro] = await Promise.all([
                api.get("/productos"),
                api.get("/categorias"),
                api.get("/proveedores"),
            ]);
            setProductos(prod.data);
            setCategorias(cat.data);
            setProveedores(pro.data);
            setError("");
        } catch {
            setError("No se pudo cargar los productos. Verifica que el backend esté en ejecución.");
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
            if (form.id) {
                await api.put(`/productos/${form.id}`, form);
            } else {
                await api.post("/productos", form);
            }
            cancelar();
            cargar();
        } catch (err) {
            setError(err.response?.data?.error || "No se pudo guardar el producto.");
        }
    };

    const handleEdit = (p) => {
        setForm({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion ?? "",
            precio: p.precio,
            stock: p.stock,
            categoria_id: p.categoria_id ?? "",
            proveedor_id: p.proveedor_id ?? "",
        });
        setMostrarForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await api.delete(`/productos/${id}`);
            cargar();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                    "No se pudo eliminar. Es posible que tenga movimientos registrados en el Kardex."
            );
        }
    };

    return (
        <div>
            <h3 className="mb-3">Productos</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between gap-3 mb-3">
                <input
                    type="search"
                    className="form-control w-50"
                    placeholder="Buscar por nombre o categoría..."
                    value={tabla.busqueda}
                    onChange={(e) => tabla.buscar(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => (mostrarForm ? cancelar() : setMostrarForm(true))}>
                    {mostrarForm ? "Cerrar formulario" : "+ Nuevo producto"}
                </button>
            </div>

            {mostrarForm && (
                <form onSubmit={handleSubmit} className="card p-3 mb-3 shadow-sm">
                    <h5>{form.id ? "Editar producto" : "Nuevo producto"}</h5>

                    {categorias.length === 0 && (
                        <div className="alert alert-warning">
                            Aún no hay categorías. Crea una en la sección Categorías antes de registrar productos.
                        </div>
                    )}

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Nombre</label>
                            <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Categoría</label>
                            <select
                                name="categoria_id"
                                className="form-select"
                                value={form.categoria_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Proveedor (opcional)</label>
                            <select name="proveedor_id" className="form-select" value={form.proveedor_id} onChange={handleChange}>
                                <option value="">Sin proveedor</option>
                                {proveedores.map((pr) => (
                                    <option key={pr.id} value={pr.id}>{pr.razon_social}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Descripción</label>
                            <input name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Precio (S/)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="precio"
                                className="form-control"
                                value={form.precio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Stock inicial</label>
                            <input
                                type="number"
                                min="0"
                                name="stock"
                                className="form-control"
                                value={form.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={categorias.length === 0}>
                            {form.id ? "Actualizar" : "Guardar"}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="card shadow-sm p-3">
                <h5>Lista de productos</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Proveedor</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabla.visibles.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nombre}</td>
                                    <td>{p.categoria?.nombre ?? "-"}</td>
                                    <td>{p.proveedor?.razon_social ?? "-"}</td>
                                    <td>{soles(p.precio)}</td>
                                    <td>
                                        {Number(p.stock) <= UMBRAL_BAJO_STOCK ? (
                                            <span className="badge text-bg-danger">{p.stock}</span>
                                        ) : (
                                            p.stock
                                        )}
                                    </td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Paginacion tabla={tabla} nombre="productos" />
            </div>
        </div>
    );
};

export default CrudProductos;
