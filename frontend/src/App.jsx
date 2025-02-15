import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from './components/navbar';
import  Jumbotron  from './components/Jumbotron';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://potential-space-spork-v6pxg47j7pj62x4w7-5000.app.github.dev/")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error("Error al conectar con la API:", error));
  }, []);

  return (
    <div className="container ">
      <Navbar />
      <Jumbotron />
      
      <p>{message}</p>
    </div>
  );
}

export default App;