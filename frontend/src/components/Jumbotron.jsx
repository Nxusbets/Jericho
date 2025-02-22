import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Jumbotron = ({ token, isAdmin }) => {
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

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/pronosticos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el estado del pronóstico.");
      }

      setPronosticos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const record = {
    ganado: pronosticos.filter(p => p.estado === "Ganado").length,
    perdido: pronosticos.filter(p => p.estado === "Perdido").length,
    reembolsado: pronosticos.filter(p => p.estado === "Reembolsado").length,
  };

  return (
    <motion.div
      className="jumbotron text-center p-5 shadow-lg rounded"
      style={{ backgroundColor: "#FFC107", color: "#000000", fontFamily: 'Arial Narrow' }} // Added font family here
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="display-5"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
      >
        🔥 Pronósticos Gratuitos 🔥
      </motion.h1>
      <motion.p className="lead" animate={{ opacity: [0, 1] }} transition={{ duration: 1.8 }}>
        Aquí tienes los pronósticos deportivos más recientes.
      </motion.p>

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
              <motion.li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <strong>{p.equipoLocal}</strong> vs <strong>{p.equipoVisitante}</strong> - {p.fecha} <br />
                  <span className="badge bg-danger">{p.pronostico}</span>
                </div>
                {isAdmin && (
                  <div>
                    <button className="btn btn-success btn-sm mx-1" onClick={() => actualizarEstado(p.id, "Ganado")}>Ganado</button>
                    <button className="btn btn-danger btn-sm mx-1" onClick={() => actualizarEstado(p.id, "Perdido")}>Perdido</button>
                    <button className="btn btn-warning btn-sm mx-1" onClick={() => actualizarEstado(p.id, "Reembolsado")}>Reembolsado</button>
                  </div>
                )}
              </motion.li>
            ))
          )}
        </ul>
      )}

      <div className="record mt-4">
        <h3>📊 Récord de Pronósticos</h3>
        <p><span className="badge bg-success">Ganados: {record.ganado}</span></p>
        <p><span className="badge bg-danger">Perdidos: {record.perdido}</span></p>
        <p><span className="badge bg-primary text-white">Reembolsados: {record.reembolsado}</span></p>
      </div>
    </motion.div>
  );
};

export default Jumbotron;