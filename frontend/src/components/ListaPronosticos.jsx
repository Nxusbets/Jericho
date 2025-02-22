import React, { useState, useEffect } from 'react';

const ListaPronosticos = ({ token }) => {
  const [pronosticos, setPronosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Cargando pronósticos...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h2>Lista de Pronósticos</h2>
      <ul className="list-group">
        {pronosticos.map((pronostico) => (
          <li key={pronostico.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{pronostico.equipoLocal} vs {pronostico.equipoVisitante}</strong> - {pronostico.fecha}
              <br />
              Pronóstico: <span className="badge bg-info">{pronostico.pronostico}</span>
              <br />
              Estado: <span className={`badge ${getEstadoBadgeClass(pronostico.estado)}`}>{pronostico.estado}</span>
            </div>
          </li>
        ))}
      </ul>
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