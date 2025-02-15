import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ token, rol, user, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Inicio</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            {token && rol === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
            )}
            {token && user && (
              <li className="nav-item">
                <span className="nav-link">Hola, {user.username}</span>
              </li>
            )}
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registrarse</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>Cerrar sesión</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
