import { useState } from "react";

// Búsqueda + paginación del lado del cliente.
// obtenerTextos: función que recibe un item y devuelve los textos donde se busca.
const useTabla = (datos, obtenerTextos, porPagina = 5) => {
    const [busqueda, setBusqueda] = useState("");
    const [pagina, setPagina] = useState(1);

    const termino = busqueda.trim().toLowerCase();
    const filtrados = termino
        ? datos.filter((item) =>
              obtenerTextos(item).some((t) => String(t ?? "").toLowerCase().includes(termino))
          )
        : datos;

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
    const paginaActual = Math.min(pagina, totalPaginas);
    const inicio = (paginaActual - 1) * porPagina;
    const visibles = filtrados.slice(inicio, inicio + porPagina);

    const buscar = (texto) => {
        setBusqueda(texto);
        setPagina(1);
    };

    return { busqueda, buscar, visibles, total: filtrados.length, inicio, paginaActual, totalPaginas, irAPagina: setPagina };
};

export default useTabla;
