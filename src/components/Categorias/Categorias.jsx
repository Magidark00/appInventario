import { useEffect, useState } from "react";
import api from "../../services/api";
import CrudGenerico from "../Comunes/CrudGenerico";

const Categorias = () => {
    const [conteo, setConteo] = useState({});

    // Cantidad de productos por categoría
    useEffect(() => {
        api.get("/productos")
            .then((r) => {
                const c = {};
                r.data.forEach((p) => {
                    c[p.categoria_id] = (c[p.categoria_id] || 0) + 1;
                });
                setConteo(c);
            })
            .catch(() => {});
    }, []);

    return (
        <CrudGenerico
            titulo="Categorías"
            nombreLista="Lista de categorías"
            nombrePlural="categorías"
            botonNuevo="Nueva categoría"
            textoEliminar="¿Seguro que deseas eliminar esta categoría?"
            placeholderBusqueda="Buscar por nombre..."
            endpoint="/categorias"
            columnas={[
                { clave: "id", titulo: "ID" },
                { clave: "nombre", titulo: "Nombre" },
                { clave: "descripcion", titulo: "Descripción" },
                { clave: "cantidad", titulo: "Cant. productos", render: (item) => conteo[item.id] ?? 0 },
            ]}
            campos={[
                { name: "nombre", label: "Nombre", required: true },
                { name: "descripcion", label: "Descripción" },
            ]}
        />
    );
};

export default Categorias;
