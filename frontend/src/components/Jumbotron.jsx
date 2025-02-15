import React, { useEffect, useState } from "react";
import AgregarPronostico from "./AgregarPronostico";
import ActualizarPronostico from "./ActualizarPronostico";

const Jumbotron = ({ token }) => {
  const [pronosticos, setPronosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPronosticos = async () => {
      try {
        const response = await fetch("https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/pronosticos", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("No se pudieron obtener los pronósticos.");
        }

        const data = await response.json();
        setPronosticos(data.slice(-3)); 
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPronosticos();
  }, [token]);

  return (
    <div className="jumbotron text-center p-5 bg-light shadow-lg rounded">
      <h1 className="display-5">🔥 Pronósticos Gratuitos 🔥</h1>
      <p className="lead">Aquí tienes los pronósticos deportivos más recientes.</p>

  

      {loading ? (
        <p>Cargando pronósticos...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : (
        <ul className="list-group mt-3">
          {pronosticos.length === 0 ? (
            <p>No hay pronósticos disponibles en este momento.</p>
          ) : (
            pronosticos.map((p) => (
              <li key={p.id} className="list-group-item">
                <strong>{p.equipoLocal}</strong> vs <strong>{p.equipoVisitante}</strong> - {p.fecha} <br />
                <span className="badge bg-danger">{p.pronostico}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Jumbotron;
