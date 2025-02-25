import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const MyNavbar = ({ token, rol, user, handleLogout }) => {
  return (
    <Navbar expand="lg" style={{ backgroundColor: 'yellow', fontFamily: 'Arial Narrow' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">Inicio</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            
            <Nav.Link href="https://www.youtube.com/@nxusbets" target="_blank" rel="noopener noreferrer">Youtube</Nav.Link>
            {token && rol === 'admin' && (
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            )}
            {token && (
              <Nav.Link as={Link} to="/pronosticos">Pronósticos</Nav.Link>
            )}
            {token && user && (
              <Nav.Link disabled>Hola, {user.username}</Nav.Link>
            )}
            {!token ? (
              <>
                <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout}>Cerrar sesión</Nav.Link>
            )}
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;