const Paginacion = ({ tabla, nombre }) => {
    const { inicio, visibles, total, paginaActual, totalPaginas, irAPagina } = tabla;
    const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
                {total === 0
                    ? `No hay ${nombre} para mostrar`
                    : `Mostrando ${inicio + 1}-${inicio + visibles.length} de ${total} ${nombre}`}
            </small>

            <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => irAPagina(paginaActual - 1)}>‹</button>
                </li>
                {paginas.map((n) => (
                    <li key={n} className={`page-item ${n === paginaActual ? "active" : ""}`}>
                        <button className="page-link" onClick={() => irAPagina(n)}>{n}</button>
                    </li>
                ))}
                <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => irAPagina(paginaActual + 1)}>›</button>
                </li>
            </ul>
        </div>
    );
};

export default Paginacion;
