// Componente App
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navbar';
import Jumbotron from './components/Jumbotron';
import Login from './components/Login';
import Register from './components/Register';
import AgregarPronostico from './components/AgregarPronostico';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [rol, setRol] = useState(localStorage.getItem("rol") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.sub, rol: decoded.rol });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setToken(null);
        setRol(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
      }
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setRol(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
  };

  return (
    <Router>
      <div className="container">
        {/* Pasamos el token, rol y usuario al Navbar */}
        <Navbar token={token} rol={rol} user={user} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={!token ? <Login setToken={setToken} setRol={setRol} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              token ? (
                <div>
                  <h3>Bienvenido {user?.username}</h3>
                  <Jumbotron token={token} />
                  
                  {/* Si el rol es admin, mostramos la opción de agregar pronóstico */}
                  {rol === 'admin' && <AgregarPronostico token={token} />}
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
