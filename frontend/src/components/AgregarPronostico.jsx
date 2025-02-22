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
    <div className="container mt-5" style={{ fontFamily: "Arial Narrow, sans-serif" }}>
      <h2 className="text-center mb-4" style={{ color: "#FFC107" }}>Agregar Pronóstico</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="mb-3">
          <label className="form-label" style={{ color: "#000" }}>Equipo Local</label>
          <input
            type="text"
            className="form-control"
            value={equipoLocal}
            onChange={(e) => setEquipoLocal(e.target.value)}
            style={{ borderColor: "#FFC107" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" style={{ color: "#000" }}>Equipo Visitante</label>
          <input
            type="text"
            className="form-control"
            value={equipoVisitante}
            onChange={(e) => setEquipoVisitante(e.target.value)}
            style={{ borderColor: "#FFC107" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" style={{ color: "#000" }}>Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{ borderColor: "#FFC107" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" style={{ color: "#000" }}>Pronóstico</label>
          <input
            type="text"
            className="form-control"
            value={pronostico}
            onChange={(e) => setPronostico(e.target.value)}
            style={{ borderColor: "#FFC107" }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100 mt-3"
          style={{
            backgroundColor: "#FFC107",
            borderColor: "#FFC107",
            color: "#000",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e0a800")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#FFC107")}
        >
          Agregar Pronóstico
        </button>
      </form>
    </div>
  );
};

export default AgregarPronostico;