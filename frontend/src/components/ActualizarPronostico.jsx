import React, { useState } from "react";

const ActualizarPronostico = ({ token, pronosticos }) => {
  const [estados, setEstados] = useState({});

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/pronosticos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: estados[id] }), // Enviamos el estado actualizado para ese pronóstico
      });

      if (response.ok) {
        alert("Pronóstico actualizado correctamente.");
      } else {
        alert("Error al actualizar el pronóstico.");
      }
    } catch (error) {
      console.error("Error al actualizar el pronóstico:", error);
    }
  };

  const handleEstadoChange = (id, value) => {
    setEstados({
      ...estados,
      [id]: value,
    });
  };

  return (
    <div className="container mt-5">
      <h2>Actualizar Estado del Pronóstico</h2>
      <div className="list-group">
        {pronosticos.map((p) => (
          <div key={p.id} className="list-group-item">
            <h5>{p.equipoLocal} vs {p.equipoVisitante}</h5>
            <p>{p.fecha}</p>
            <select
              className="form-select"
              value={estados[p.id] || ''} // Asegúrate de que el estado se maneje correctamente
              onChange={(e) => handleEstadoChange(p.id, e.target.value)}
            >
              <option value="">Seleccionar Estado</option>
              <option value="Ganado">Ganado</option>
              <option value="Perdido">Perdido</option>
              <option value="Reembolsado">Reembolsado</option>
            </select>
            <button
              className="btn btn-success mt-2"
              onClick={() => handleUpdate(p.id)}
            >
              Actualizar Estado
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActualizarPronostico;
