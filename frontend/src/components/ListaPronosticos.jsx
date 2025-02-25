import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const obtenerGananciasPorDia = (pronosticos) => {
    const gananciasPorDia = {};
    pronosticos.forEach((pronostico) => {
        const fecha = pronostico.fecha.split('T')[0];
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

const GraficaGanancias = ({ datos }) => {
    const labels = Object.keys(datos);
    const valores = Object.values(datos);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Ganancias por día',
                data: valores,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        height: 300,
    };

    return <div style={{width:'80%', margin:'0 auto'}}><Line data={data} options={options} /></div>;
};

const ListaPronosticos = ({ token }) => {
    const [pronosticos, setPronosticos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ganancias, setGanancias] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pronosticosPerPage] = useState(10);

    useEffect(() => {
        const fetchPronosticos = async () => {
            try {
                const response = await fetch("https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/pronosticos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("No se pudieron obtener los pronósticos.");
                }

                const data = await response.json();
                setPronosticos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPronosticos();
    }, [token]);

    useEffect(() => {
        calcularGanancias();
    }, [pronosticos]);

    const calcularGanancias = () => {
        let totalGanancias = 0;
        pronosticos.forEach((pronostico) => {
            if (pronostico.estado === "Ganado") {
                totalGanancias += 100 * (pronostico.momio - 1);
            } else if (pronostico.estado === "Perdido") {
                totalGanancias -= 100;
            } else if (pronostico.estado === "Reembolsado") {
                // No se suma ni se resta nada
            }
        });
        setGanancias(totalGanancias);
    };

    const indexOfLastPronostico = currentPage * pronosticosPerPage;
    const indexOfFirstPronostico = indexOfLastPronostico - pronosticosPerPage;
    const currentPronosticos = pronosticos.slice(indexOfFirstPronostico, indexOfLastPronostico);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(pronosticos.length / pronosticosPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) return <p>Cargando pronósticos...</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;

    return (
        <div className="container-fluid mt-3" style={{ backgroundColor: 'yellow', color: 'black', fontFamily: 'Arial Narrow, sans-serif' }}>
            <h2>Lista de Pronósticos</h2>
            <h6>Récord de ganancias/perdidas apostando 100mxn por pick</h6>
            <p>Ganancias/Pérdidas Totales: {ganancias.toFixed(2)} MXN</p>
            <ul className="list-group">
                {currentPronosticos.map((pronostico) => (
                    <li key={pronostico.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{pronostico.equipoLocal} vs {pronostico.equipoVisitante}</strong> - {pronostico.fecha}
                            <br />
                            Pronóstico: <span className="badge bg-info">{pronostico.pronostico}</span>
                            <br />
                            Momio: {pronostico.momio}
                            <br />
                            Estado: <span className={`badge ${getEstadoBadgeClass(pronostico.estado)}`}>{pronostico.estado}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <nav>
                <ul className="pagination">
                    {pageNumbers.map((number) => (
                        <li key={number} className="page-item">
                            <button onClick={() => paginate(number)} className="page-link">
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <GraficaGanancias datos={obtenerGananciasPorDia(pronosticos)} />
        </div>
    );
};

const getEstadoBadgeClass = (estado) => {
    switch (estado) {
        case "Ganado":
            return "bg-success";
        case "Perdido":
            return "bg-danger";
        case "Reembolsado":
            return "bg-warning text-dark";
        default:
            return "bg-secondary";
    }
};

export default ListaPronosticos;