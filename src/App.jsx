import { useState, useEffect } from 'react';
import axios from 'axios';
//import './App.css';

function App() {
  const [specializations, setSpecializations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // La URL completa de tu endpoint en Django
    const apiUrl = 'http://127.0.0.1:8000/api/professionals/specializations/';

    axios.get(apiUrl)
      .then(response => {
        setSpecializations(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los datos:", error);
        setError('No se pudieron cargar las especialidades. ¿El servidor de Django está corriendo?');
      });
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  return (
    <>
      <h1>Psico SAS - Frontend</h1>
      <h2>Especialidades Cargadas desde el Backend</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {specializations.map(spec => (
          <li key={spec.id}>{spec.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;