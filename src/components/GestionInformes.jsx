import { useState, useEffect } from 'react';
// Asumiendo que api.js está en src/ (un nivel arriba)
import { getInformes, createInforme } from '/.../api.js';
// Asumiendo que AuthForms.css está en src/components/
import './AuthForms.css'; 



function GestionInformes({ user, onBack }) {
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [informes, setInformes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Lógica de Búsqueda ---
  useEffect(() => {
    // Usamos un temporizador para no buscar en cada pulsación
    const delayDebounceFn = setTimeout(() => {
      if (!user?.token) return;
      
      setLoading(true);
      getInformes(user.token, searchTerm)
        .then(data => {
          setInformes(data);
          setError('');
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
        
    }, 500); // Espera 500ms después de dejar de teclear

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, user?.token]); // Se re-ejecuta cuando searchTerm o user cambian

  // --- Lógica de Creación ---
  const handleCrearInforme = async (e) => {
    e.preventDefault();
    if (!nombre || !contenido) {
      setError('El nombre y el contenido no pueden estar vacíos.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const nuevoInforme = await createInforme(user.token, { nombre, contenido });
      // Añade el nuevo informe a la lista y limpia el formulario
      setInformes([nuevoInforme, ...informes]);
      setNombre('');
      setContenido('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container" style={{ maxWidth: '800px' }}>
      <button onClick={onBack} className="auth-toggle-btn" style={{ marginBottom: '20px' }}>
        Volver al Menú
      </button>
      <h2>Gestión de Informes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* --- Formulario de Creación --- */}
      <form onSubmit={handleCrearInforme} className="auth-form">
        <h3>Crear Nuevo Informe</h3>
        <input
          type="text"
          placeholder="Nombre del informe"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          placeholder="Contenido del informe..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows="5"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Informe'}
        </button>
      </form>

      {/* --- Sección de Búsqueda --- */}
      <div className="informe-search" style={{ marginTop: '30px' }}>
        <h3>Buscar Informes</h3>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="auth-form-input"
        />
        {loading && searchTerm && <p>Buscando...</p>}
        
        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '20px' }}>
          {informes.length > 0 ? (
            informes.map(informe => (
              <li key={informe._id} style={{ background: '#f4f4f4', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <strong>{informe.nombre}</strong>
                <p style={{ whiteSpace: 'pre-wrap', margin: '5px 0 0' }}>{informe.contenido}</p>
                <small style={{ color: '#777' }}>
                  Creado: {new Date(informe.createdAt).toLocaleString()}
                </small>
              </li>
            ))
          ) : (
            <p>{searchTerm ? 'No se encontraron informes.' : 'Escribe para buscar informes.'}</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default GestionInformes;
