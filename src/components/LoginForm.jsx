import React, { useState } from 'react';
// 1. CORRECCIÓN: Subimos un nivel (de 'components' a 'src')
import { loginUser } from '../api.js'; 
// 2. CORRECCIÓN: Subimos un nivel (asumiendo que está en 'src/')
import './AuthForms.css'; 

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 3. ¡AQUÍ ESTÁ LA CORRECCIÓN! 
      // Usamos la función importada 'loginUser' que apunta a Render
      const data = await loginUser({ email, password });
      
      onLogin(data); // Avisa a App.jsx que el login fue exitoso

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    return (
      <div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
          <h2>Iniciar Sesión</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
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
          <button type="submit" disabled={loading} style={{ padding: '10px' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
  );
};

export default LoginForm;


