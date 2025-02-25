import React from 'react';
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
                borderColor: 'rgb(255, 99, 132)', // Cambia el color de la línea
                tension: 0.4, // Suaviza la línea
                pointBackgroundColor: 'rgb(255, 99, 132)', // Color de los puntos
                pointRadius: 5, // Tamaño de los puntos
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        height: 300,
        plugins: {
            title: {
                display: true,
                text: 'Ganancias por día', // Agrega un título
                font: {
                    size: 16,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y); // Formatea el valor como moneda
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return 'MXN ' + value; // Agrega "MXN" a las etiquetas del eje Y
                    },
                },
            },
        },
    };

    return <div style={{width:'80%', margin:'0 auto'}}><Line data={data} options={options} /></div>;
};

export default GraficaGanancias;