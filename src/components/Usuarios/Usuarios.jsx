import CrudGenerico from "../Comunes/CrudGenerico";

const Usuarios = () => (
    <CrudGenerico
        titulo="Usuarios"
        nombreLista="Lista de usuarios"
        nombrePlural="usuarios"
        botonNuevo="Nuevo usuario"
        textoEliminar="¿Seguro que deseas eliminar este usuario?"
        placeholderBusqueda="Buscar por nombre o email..."
        endpoint="/usuarios"
        columnas={[
            { clave: "id", titulo: "ID" },
            { clave: "nombre", titulo: "Nombre" },
            { clave: "email", titulo: "Email" },
            { clave: "rol", titulo: "Rol" },
        ]}
        campos={[
            { name: "nombre", label: "Nombre", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Contraseña", type: "password", required: true },
            {
                name: "rol",
                label: "Rol",
                type: "select",
                opciones: ["Administrador", "Almacenero"],
                defaultValue: "Almacenero",
                required: true,
            },
        ]}
    />
);

export default Usuarios;
