import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const userData = { usuario, correo, contrasena };

    try {
      const response = await fetch('https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Registro exitoso. Redirigiendo al inicio de sesión...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message || 'Error al registrar usuario.');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setError('Ocurrió un error al intentar registrar.');
    }
  };

  return (
    <div className="container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="usuario" className="form-label">Usuario</label>
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
          <label htmlFor="correo" className="form-label">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contrasena" className="form-label">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            className="form-control"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmarContrasena"
            className="form-control"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Registrarse</button>

        <p className="mt-3">
          ¿Ya tienes una cuenta? <a href="/login" className="text-primary">Inicia sesión aquí</a>
        </p>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
    </div>
  );
};

export default Register;
