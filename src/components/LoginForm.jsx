import React, { useState } from 'react';
// import './AuthForms.css'; // Se elimina esta línea para corregir el error

// 1. Eliminamos 'onCambioRegistro' de los props
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }
      
      onLogin(data); 

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
        {/* 2. Botón de registro del DOE eliminado de aquí */}
      </div>
  );
};

export default LoginForm;

