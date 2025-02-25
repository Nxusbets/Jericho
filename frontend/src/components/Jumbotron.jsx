import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Jumbotron = ({ token, isAdmin }) => {
    const [pronosticos, setPronosticos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.2 });

    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
            });
        }
    }, [controls, inView]);

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

            if (response.ok) {
                setPronosticos(prevPronosticos => prevPronosticos.map(p => p._id === id ? { ...p, estado: nuevoEstado } : p));
                alert("Estado actualizado correctamente.");
            } else {
                alert("Error al actualizar el estado.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al actualizar el estado.");
        }
    };

    const eliminarPronostico = async (id) => {
        try {
            const response = await fetch(`https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/pronosticos/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setPronosticos(prevPronosticos => prevPronosticos.filter(p => p._id !== id));
                alert("Pronóstico eliminado correctamente.");
            } else {
                alert("Error al eliminar el pronóstico.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al eliminar el pronóstico.");
        }
    };

    const record = {
        ganado: pronosticos.filter(p => p.estado === "Ganado").length,
        perdido: pronosticos.filter(p => p.estado === "Perdido").length,
        reembolsado: pronosticos.filter(p => p.estado === "Reembolsado").length,
    };

    return (
        <motion.div
            ref={ref}
            className="jumbotron text-center p-2 shadow-lg rounded"
            style={{
                backgroundColor: "yellow",
                color: "#000000",
                fontFamily: 'Arial Narrow, sans-serif',
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
        >
            <h6>Quieres ganar dinero con los deportes? Aquí te dejo pronósticos gratuitos todos los días.</h6>
            <motion.h3
                className="display-6 mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
            >
                 Pronósticos Gratuitos 
            </motion.h3>

            {loading ? (
                <p>Cargando pronósticos...</p>
            ) : error ? (
                <p className="text-danger">Error: {error}</p>
            ) : (
                <ul className="list-group mt-2">
                    {pronosticos.length === 0 ? (
                        <p>No hay pronósticos disponibles en este momento.</p>
                    ) : (
                        pronosticos.map((p) => (
                            <motion.li
                                key={p._id}
                                className="list-group-item d-flex justify-content-between align-items-center mb-1 rounded"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                style={{ backgroundColor: '#f8f8f8', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                            >
                                <div>
                                    <strong>{p.equipoLocal}</strong> vs <strong>{p.equipoVisitante}</strong> - {p.fecha} <br />
                                    <span className="badge bg-danger rounded-pill">{p.pronostico}</span>
                                </div>
                                {isAdmin && (
                                    <div>
                                        <button className="btn btn-success btn-sm mx-1 rounded-pill" onClick={() => actualizarEstado(p._id, "Ganado")}>Ganado</button>
                                        <button className="btn btn-danger btn-sm mx-1 rounded-pill" onClick={() => actualizarEstado(p._id, "Perdido")}>Perdido</button>
                                        <button className="btn btn-warning btn-sm mx-1 rounded-pill" onClick={() => actualizarEstado(p._id, "Reembolsado")}>Reembolsado</button>
                                        <button className="btn btn-outline-danger btn-sm mx-1 rounded-pill" onClick={() => eliminarPronostico(p._id)}>Eliminar</button>
                                    </div>
                                )}
                            </motion.li>
                        ))
                    )}
                </ul>
            )}

            {pronosticos.length > 0 && (
                <div className="record mt-2">
                    <h5 className="mb-3"> Récord de Pronósticos</h5>
                    <p><span className="badge bg-success rounded-pill">Ganados: {record.ganado}</span></p>
                    <p><span className="badge bg-danger rounded-pill">Perdidos: {record.perdido}</span></p>
                    <p><span className="badge bg-primary text-white rounded-pill">Reembolsados: {record.reembolsado}</span></p>
                </div>
            )}

            <div className="mt-2 ">
                <h4>Quieres tener los pronósticos premium?</h4>
                <a href="https://www.youtube.com/channel/UCcEGEN47YU8jrz3I6ZuxeDA/join" className="btn btn-danger mt-1">Únete a la membresía VIP aquí</a>
            </div>
        </motion.div>
    );
};

export default Jumbotron;