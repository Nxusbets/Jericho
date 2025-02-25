import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navbar';
import Jumbotron from './components/Jumbotron';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/dashboard';
import { jwtDecode } from 'jwt-decode';
import RedesSociales from './components/Redessociales';
import ListaPronosticos from './components/ListaPronosticos';
import './App.css';
import Footer from './components/Footer';

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
      <div className="app-container">
        <Navbar token={token} rol={rol} user={user} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={!token ? <Login setToken={setToken} setRol={setRol} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              token ? (
                <div>
                  <h5>Bienvenido {user?.username}</h5>
                  <Jumbotron token={token} isAdmin={rol === "admin"} />
                  {rol === 'admin' && <Dashboard />}
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/pronosticos"
            element={
              token ? (
                <ListaPronosticos token={token} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        <RedesSociales />

        <Footer />
      </div>
    </Router>
  );
}

export default App;