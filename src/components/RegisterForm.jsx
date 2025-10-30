import { useState } from 'react';
import { registerUser } from '../api.js'; 

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('alumno');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // 2. ¡ESTA LÍNEA ES LA SOLUCIÓN CRÍTICA!
    // Previene que el formulario recargue la página.
    e.preventDefault(); 
    
    setError('');
    setLoading(true);

    try {
      // 3. Llama a la función de la API (con la URL de Render)
      const data = await registerUser({ 
        username, 
        email, 
        password, 
        userType 
      });

      onRegister(data); // Avisa a App.jsx que el registro fue exitoso

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
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
        {/* AÑADIDO: La opción DOE que tenías */}
        <option value="DOE">DOE</option>
      </select>
      <button type="submit" disabled={loading} style={{ padding: '10px' }}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </div>
  );
}

export default RegisterForm;


