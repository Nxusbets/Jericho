import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate para redirigir

const Login = ({ setToken }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      usuario: usuario,
      contrasena: contrasena,
    };

    try {
      const response = await fetch('https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Guardar el token y el rol en localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("rol", data.rol); // Guardamos el rol

        setToken(data.access_token); // Almacenar token en el estado global si es necesario
        setError('');

        // Redirigir según el rol
        if (data.rol === "admin") {
          navigate('/dashboard');  // Redirigir al dashboard si es admin
        } else {
          navigate('/');  // Redirigir a la página de inicio si es un usuario normal
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      setError('Ocurrió un error al intentar iniciar sesión.');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="usuario" className="form-label">
            Usuario
          </label>
          <input
            type="text"
            id="usuario"
            className="form-control"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contrasena" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            id="contrasena"
            className="form-control"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Iniciar sesión
        </button>

        {/* Enlace para registrarse */}
        <p className="mt-3">
          ¿No tienes cuenta todavía?{' '}
          <Link to="/register" className="text-primary">
            ¡Créala gratis aquí!
          </Link>
        </p>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default Login;
