import { useState } from 'react';
// CORRECCIÓN: Asumiendo 'api.js' está en 'src/'
import { registerUser } from '../api.js'; 
// CORRECCIÓN: Asumiendo 'AuthForms.css' está en la MISMA CARPETA ('src/components/')
import './AuthForms.css'; 

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('regente');
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
    <div className="auth-form-container"> {/* <div> de apertura agregado */}
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
        <label htmlFor="userType" style={{ marginBottom: '5px' }}>Tipo de Usuario:</label>
        <select
          id="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
          style={{ marginBottom: '15px', padding: '8px' }}
        >
          <option value="regente">Regente</option>
          <option value="DOE">DOE (Admin)</option>
          {/* Opciones 'alumno', 'profesor', 'preceptor' eliminadas */}
        </select>
        
        <button type="submit" disabled={loading} style={{ padding: '10px', marginBottom: '10px' }}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        {/* El botón 'onBack' ahora funcionará porque lo agregamos a los props */}
        <button type="button" onClick={onBack} className="auth-toggle-btn">
          Volver al Menú
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;


