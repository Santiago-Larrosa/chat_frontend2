import { useState, useEffect } from 'react';
// Asumiendo que api.js está en src/ (un nivel arriba)
import { getInformes, createInforme } from '../api.js';
// Asumiendo que AuthForms.css está en src/components/
import './AuthForms.css'; 



// --- ¡CAMBIO CLAVE! ---
// Este componente AHORA SOLO BUSCA Y MUESTRA.
function GestionInformes({ user, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [informes, setInformes] = useState([]);
  const [informeSeleccionado, setInformeSeleccionado] = useState(null); // Para ver detalle
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Lógica de Búsqueda (Busca por 'alumnoNombre') ---
  useEffect(() => {
    // No buscar la primera vez (solo cuando se escribe)
    if (!searchTerm) {
      setInformes([]);
      return;
    }
    
    if (!user?.token) return;

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      // 'getInformes' ahora busca por 'alumnoNombre' gracias a los cambios en el backend
      getInformes(user.token, searchTerm)
        .then(data => {
          setInformes(data);
          setError('');
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
        
    }, 500); // Espera medio segundo después de teclear

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, user?.token]);

  // Si se selecciona un informe, mostramos el detalle (usando estilos de Informe.jsx)
  if (informeSeleccionado) {
    const inf = informeSeleccionado; // Alias corto
    return (
      <div className="container" style={{ maxWidth: '800px', textAlign: 'left', margin: 'auto' }}>
        <div className="button-back">
          <button onClick={() => setInformeSeleccionado(null)}>
            VOLVER A LA BÚSQUEDA
          </button>
        </div>
        
        <h2>Detalle del Informe: {inf.alumnoNombre}</h2>
        <p><strong>Fecha Guardado:</strong> {new Date(inf.createdAt).toLocaleString()}</p>
        <hr/>
        
        <div className="form-group">
          <label>1.- El alumno/a:</label>
          <p>{inf.alumnoNombre} (Año: {inf.alumnoAnio}, División: {inf.alumnoDivision})</p>
        </div>
        <div className="form-group">
          <label>2.- Acción:</label>
          <p>{inf.descripcionAccion}</p>
        </div>
        <div className="form-group">
          <label>3.- Sanción Solicitada:</label>
          <p>{inf.solicitudSancion}</p>
        </div>
        <div className="form-group">
          <label>Docente:</label>
          <p>{inf.docenteNombre} ({inf.docenteCargo}) - Fecha: {inf.docenteFecha}</p>
        </div>
        <div className="form-group">
          <label>4.- Descargo Alumno:</label>
          <p>{inf.descargoAlumno}</p>
        </div>
        <div className="form-group">
          <label>5.- Informe C. Aula:</label>
          <p>{inf.informeConsejoAula}</p>
        </div>
        <div className="form-group">
          <label>6.- Informe C. Convivencia:</label>
          <p>{inf.informeConsejoConvivencia}</p>
        </div>
        <div className="form-group">
          <label>7.- Observaciones:</label>
          <p>{inf.observaciones}</p>
        </div>
        <div className="form-group">
          <label>8.- Instancia:</label>
          <p>{inf.instancia} {inf.otraConsideracion ? `(${inf.otraConsideracion})` : ''}</p>
        </div>
        <div className="form-group">
          <label>9.- Notificación:</label>
          <p>Alumno: {inf.notificacionAlumno} / Tutor: {inf.notificacionTutor} / Fecha: {inf.notificacionFecha}</p>
        </div>
      </div>
    );
  }

  // Vista principal (Búsqueda)
  return (
    <div className="auth-form-container" style={{ maxWidth: '800px' }}>
      <button onClick={onBack} className="auth-toggle-btn" style={{ marginBottom: '20px' }}>
        Volver al Menú
      </button>
      <h2>Búsqueda de Informes de Convivencia</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* --- Sección de Búsqueda --- */}
      <div className="informe-search" style={{ marginTop: '30px' }}>
        <h3>Buscar Informes por Nombre de Alumno</h3>
        <input
          type="text"
          placeholder="Escribe el nombre del alumno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="auth-form-input"
        />
        {loading && searchTerm && <p>Buscando...</p>}
        
        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '20px' }}>
          {informes.length > 0 ? (
            informes.map(informe => (
              <li key={informe._id} className="informe-list-item">
                <div>
                  <strong>{informe.alumnoNombre}</strong>
                  <br/>
                  <small style={{ color: '#777' }}>
                    Guardado: {new Date(informe.createdAt).toLocaleString()}
                  </small>
                </div>
                <button onClick={() => setInformeSeleccionado(informe)}>
                  Ver Detalle
                </button>
              </li>
            ))
          ) : (
            <p>{searchTerm ? 'No se encontraron informes.' : (loading ? 'Buscando...' : 'Escribe para buscar informes guardados.')}</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default GestionInformes;
