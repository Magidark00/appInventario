import { useEffect, useState } from "react";
import api from "../../services/api";
import useTabla from "../../hooks/useTabla";
import Paginacion from "./Paginacion";

// CRUD reutilizable para tablas simples (Categorías, Proveedores, Usuarios)
const CrudGenerico = ({
    titulo,
    nombreLista,
    nombrePlural,
    botonNuevo,
    textoEliminar,
    endpoint,
    columnas,
    campos,
    placeholderBusqueda,
}) => {
    const formVacio = () => Object.fromEntries(campos.map((c) => [c.name, c.defaultValue ?? ""]));

    const [items, setItems] = useState([]);
    const [form, setForm] = useState(formVacio());
    const [editandoId, setEditandoId] = useState(null);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [error, setError] = useState("");

    const tabla = useTabla(items, (item) => columnas.map((c) => item[c.clave]));

    const cargar = async () => {
        try {
            const respuesta = await api.get(endpoint);
            setItems(respuesta.data);
            setError("");
        } catch {
            setError(`No se pudo cargar ${nombrePlural}. Verifica que el backend esté en ejecución.`);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const cancelar = () => {
        setForm(formVacio());
        setEditandoId(null);
        setMostrarForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const datos = { ...form };
        // Al editar, una contraseña vacía significa "no cambiarla"
        if (editandoId) {
            campos.filter((c) => c.type === "password").forEach((c) => {
                if (!datos[c.name]) delete datos[c.name];
            });
        }

        try {
            if (editandoId) {
                await api.put(`${endpoint}/${editandoId}`, datos);
            } else {
                await api.post(endpoint, datos);
            }
            cancelar();
            cargar();
        } catch (err) {
            setError(err.response?.data?.error || "No se pudo guardar. Revisa los datos e inténtalo de nuevo.");
        }
    };

    const handleEdit = (item) => {
        setForm(
            Object.fromEntries(
                campos.map((c) => [c.name, c.type === "password" ? "" : item[c.name] ?? ""])
            )
        );
        setEditandoId(item.id);
        setMostrarForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(textoEliminar)) return;
        try {
            await api.delete(`${endpoint}/${id}`);
            cargar();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                    "No se pudo eliminar. Es posible que tenga registros relacionados."
            );
        }
    };

    return (
        <div>
            <h3 className="mb-3">{titulo}</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between gap-3 mb-3">
                <input
                    type="search"
                    className="form-control w-50"
                    placeholder={placeholderBusqueda}
                    value={tabla.busqueda}
                    onChange={(e) => tabla.buscar(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => (mostrarForm ? cancelar() : setMostrarForm(true))}>
                    {mostrarForm ? "Cerrar formulario" : `+ ${botonNuevo}`}
                </button>
            </div>

            {mostrarForm && (
                <form onSubmit={handleSubmit} className="card p-3 mb-3 shadow-sm">
                    <h5>{editandoId ? "Editar" : botonNuevo}</h5>
                    <div className="row">
                        {campos.map((c) => (
                            <div className="col-md-6 mb-3" key={c.name}>
                                <label className="form-label">{c.label}</label>
                                {c.type === "select" ? (
                                    <select
                                        name={c.name}
                                        className="form-select"
                                        value={form[c.name]}
                                        onChange={handleChange}
                                        required={c.required}
                                    >
                                        {c.opciones.map((o) => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={c.type || "text"}
                                        name={c.name}
                                        className="form-control"
                                        value={form[c.name]}
                                        onChange={handleChange}
                                        required={c.required && !(c.type === "password" && editandoId)}
                                        placeholder={c.type === "password" && editandoId ? "Dejar vacío para no cambiarla" : ""}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            {editandoId ? "Actualizar" : "Guardar"}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="card shadow-sm p-3">
                <h5>{nombreLista}</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                {columnas.map((c) => (
                                    <th key={c.clave}>{c.titulo}</th>
                                ))}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabla.visibles.map((item) => (
                                <tr key={item.id}>
                                    {columnas.map((c) => (
                                        <td key={c.clave}>{c.render ? c.render(item) : item[c.clave]}</td>
                                    ))}
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Paginacion tabla={tabla} nombre={nombrePlural} />
            </div>
        </div>
    );
};

export default CrudGenerico;
