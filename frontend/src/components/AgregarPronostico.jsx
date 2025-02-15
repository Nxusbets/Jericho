import React, { useState } from "react";

const AgregarPronostico = ({ token }) => {
  const [equipoLocal, setEquipoLocal] = useState("");
  const [equipoVisitante, setEquipoVisitante] = useState("");
  const [fecha, setFecha] = useState("");
  const [pronostico, setPronostico] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pronosticoData = {
      equipoLocal,
      equipoVisitante,
      fecha,
      pronostico,
    };

    try {
      const response = await fetch("https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/pronosticos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pronosticoData),
      });

      if (response.ok) {
        alert("Pronóstico agregado correctamente.");
      } else {
        alert("No autorizado para agregar pronósticos.");
      }
    } catch (error) {
      console.error("Error al agregar pronóstico:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Agregar Pronóstico</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Equipo Local</label>
          <input
            type="text"
            className="form-control"
            value={equipoLocal}
            onChange={(e) => setEquipoLocal(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Equipo Visitante</label>
          <input
            type="text"
            className="form-control"
            value={equipoVisitante}
            onChange={(e) => setEquipoVisitante(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Pronóstico</label>
          <input
            type="text"
            className="form-control"
            value={pronostico}
            onChange={(e) => setPronostico(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Agregar Pronóstico
        </button>
      </form>
    </div>
  );
};

export default AgregarPronostico;
