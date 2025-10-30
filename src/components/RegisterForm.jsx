import { useState } from 'react';
// CORRECCIÓN: Asumiendo 'api.js' está en 'src/'
import { registerUser } from '../api.js'; 
// CORRECCIÓN: Asumiendo 'AuthForms.css' está en la MISMA CARPETA ('src/components/')
import './AuthForms.css'; 

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('alumno');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // --- ¡LA PRUEBA CLAVE! ---
    // Esto debe aparecer en tu consola del navegador (F12)
    console.log('¡handleSubmit SE ESTÁ EJECUTANDO!');
    // ------------------------

    setError('');
    setLoading(true);

    try {
      console.log('Enviando datos a la API...');
      const data = await registerUser({ 
        username, 
        email, 
        password, 
        userType 
      });

      console.log('Respuesta recibida:', data);
      onRegister(data); // Avisa a App.jsx que el registro fue exitoso

    } catch (err) {
      console.error('Error en el bloque catch:', err);
      setError(err.message);
    } finally {
      console.log('Bloque finally: setLoading(false)');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ marginBottom: '10px', padding: '8px' }}
      />
      <select 
        value={userType} 
        onChange={(e) => setUserType(e.target.value)} 
        required
        style={{ marginBottom: '10px', padding: '8px' }}
      >
        <option value="alumno">Alumno</option>
        <option value="profesor">Profesor</option>
        <option value="preceptor">Preceptor</option>
        <option value="DOE">DOE</option>
      </select>
      <button type="submit" disabled={loading} style={{ padding: '10px' }}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
}

export default RegisterForm;


