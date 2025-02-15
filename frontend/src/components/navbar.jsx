import React from "react";

export function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">NxuS Bets</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Inicio</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Servicio premium</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Youtube</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Contactame</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
