import React from "react";
import { FaYoutube, FaTelegramPlane, FaEnvelope } from "react-icons/fa"; // Importa los íconos
import { motion } from "framer-motion"; // Importamos framer-motion

const RedesSociales = () => {
  return (
    <motion.div
      className="container mt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="row justify-content-center">
        {/* Card de información */}
        <div className="col-md-6">
          <div
            className="card shadow-lg rounded"
            style={{
              backgroundColor: "#FFC107", // Fondo amarillo
              color: "#000000", // Texto negro
              fontFamily: "'Arial Narrow', sans-serif", // Fuente Arial Narrow
            }}
          >
            <div className="card-body text-center">
              {/* Imagen cuadrada de tu proyecto */}
              <img
                src="https://placekitten.com/300/300" // Reemplaza con la URL de tu imagen
                alt="Proyecto"
                className="img-fluid rounded-circle mb-3"
                style={{ maxWidth: "200px", height: "200px" }}
              />
              <h4 className="card-title mb-3">¡Hola! Soy NxuS</h4>
              <p className="card-text">
                Desde el 2017 me he dedicado a aprender a cómo ganar dinero con
                los deportes y los pronósticos deportivos. Puedes acompañarme en
                este camino de victorias, aprendizajes y mucha pasión por los
                deportes.
              </p>

              {/* Íconos de redes sociales */}
              <div className="d-flex justify-content-around align-items-center">
                <a
                  href="https://youtube.com/@nxusbets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{ fontSize: "2rem", color: "#FF0000" }}
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://t.me/nxus_bets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{ fontSize: "2rem", color: "#0088cc" }}
                >
                  <FaTelegramPlane />
                </a>
                <a
                  href="mailto:nxusbets@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{ fontSize: "2rem", color: "#D44638" }}
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RedesSociales;
