import CrudGenerico from "../Comunes/CrudGenerico";

const Proveedores = () => (
    <CrudGenerico
        titulo="Proveedores"
        nombreLista="Lista de proveedores"
        nombrePlural="proveedores"
        botonNuevo="Nuevo proveedor"
        textoEliminar="¿Seguro que deseas eliminar este proveedor?"
        placeholderBusqueda="Buscar por razón social o contacto..."
        endpoint="/proveedores"
        columnas={[
            { clave: "id", titulo: "ID" },
            { clave: "razon_social", titulo: "Razón social" },
            { clave: "contacto", titulo: "Contacto" },
            { clave: "telefono", titulo: "Teléfono" },
            { clave: "email", titulo: "Email" },
        ]}
        campos={[
            { name: "razon_social", label: "Razón social", required: true },
            { name: "contacto", label: "Contacto" },
            { name: "telefono", label: "Teléfono" },
            { name: "email", label: "Email", type: "email" },
        ]}
    />
);

export default Proveedores;
