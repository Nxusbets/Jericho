import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AgregarPronostico from './AgregarPronostico';
import ActualizarPronostico from './ActualizarPronostico';

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pronosticos, setPronosticos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    console.log("Rol obtenido del localStorage:", rol); // Verifica el rol
    if (rol === 'admin') {
      setIsAdmin(true);
      console.log("isAdmin:", true); // Verifica isAdmin

      const fetchPronosticos = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/pronosticos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPronosticos(data);
      };

      fetchPronosticos();
    } else {
      setIsAdmin(false);
      console.log("isAdmin:", false); // Verifica isAdmin
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="container">
      {isAdmin ? (
        <>
          <h2>Dashboard Admin</h2>
          <div>
            <h3>Gestión de pronósticos</h3>
            <AgregarPronostico token={localStorage.getItem('token')} />
            {pronosticos.length > 0 ? (
              <ActualizarPronostico token={localStorage.getItem('token')} pronosticos={pronosticos} />
            ) : (
              <p>No hay pronósticos para actualizar.</p>
            )}
          </div>
        </>
      ) : (
        <p>No tienes permisos para acceder a este contenido.</p>
      )}
    </div>
  );
};

export default Dashboard;