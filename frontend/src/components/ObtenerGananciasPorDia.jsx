const obtenerGananciasPorDia = (pronosticos) => {
    const gananciasPorDia = {};
    pronosticos.forEach((pronostico) => {
        const fecha = pronostico.fecha.split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD
        const ganancia = calcularGananciaPronostico(pronostico);
        if (gananciasPorDia[fecha]) {
            gananciasPorDia[fecha] += ganancia;
        } else {
            gananciasPorDia[fecha] = ganancia;
        }
    });
    return gananciasPorDia;
};

const calcularGananciaPronostico = (pronostico) => {
    if (pronostico.estado === "Ganado") {
        return 100 * (pronostico.momio - 1);
    } else if (pronostico.estado === "Perdido") {
        return -100;
    } else {
        return 0; // Reembolsado
    }
};