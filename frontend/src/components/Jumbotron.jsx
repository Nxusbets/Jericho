import React, { useEffect, useState } from "react";

const Jumbotron = () => {
  const [pronosticos, setPronosticos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/pronosticos")
      .then((response) => response.json())
      .then((data) => {
        console.log("Pronósticos recibidos:", data);
        const ultimosTres = data.slice(-3); 
        setPronosticos(ultimosTres);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los pronósticos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="jumbotron text-center p-5 bg-light shadow-lg rounded">
      <h1 className="display-5">🔥 Pronósticos Gratuitos 🔥</h1>
      <p className="lead">Aquí tienes los pronósticos deportivos más recientes.</p>
      
      {loading ? (
        <p>Cargando pronósticos...</p>
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
