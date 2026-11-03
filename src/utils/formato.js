export const soles = (valor) => `S/ ${Number(valor).toFixed(2)}`;

// El backend puede devolver fecha_hora o, si no existe, createdAt
export const fechaDe = (movimiento) => movimiento.fecha_hora ?? movimiento.createdAt;

export const formatearFecha = (movimiento) =>
    new Date(fechaDe(movimiento)).toLocaleString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
