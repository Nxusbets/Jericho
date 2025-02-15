import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, contrasena }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          // Guardar el token en el localStorage o en el estado
          localStorage.setItem('token', data.access_token);
          onLogin();
        } else {
          alert('Credenciales incorrectas');
        }
      })
      .catch((error) => {
        console.error('Error al autenticar:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default Login;
