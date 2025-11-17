import React, { useRef, useState, useEffect } from 'react';
import { createInforme, getInformes } from '../api.js';

// ❌ Eliminamos AuthForms.css para evitar estilos mezclados
// import './AuthForms.css';

import './informe.component.css';   // ✔ Todo el estilo unificado aquí

function Informe({ user, onBack }) {
  const containerRef = useRef();

  // --- FORMULARIO ---
  const [formData, setFormData] = useState({
    alumnoNombre: '', alumnoAnio: '', alumnoDivision: '',
    descripcionAccion: '', solicitudSancion: '',
    docenteNombre: '', docenteCargo: '', docenteFecha: '', docenteFirma: '',
    descargoAlumno: '', informeConsejoAula: '', informeConsejoConvivencia: '',
    observaciones: '', instancia: '', otraConsideracion: '',
    firmaDirectivo: '', fechaDirectivo: '',
    notificacionAlumno: '', notificacionTutor: '', notificacionFecha: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // --- BUSQUEDA ---
  const [searchTerm, setSearchTerm] = useState('');
  const [informes, setInformes] = useState([]);
  const [informeSeleccionado, setInformeSeleccionado] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // --- Debounce de búsqueda ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setInformes([]);
      return;
    }

    const delay = setTimeout(() => {
      if (!user?.token) return;

      setLoadingSearch(true);
      getInformes(user.token, searchTerm)
        .then(data => setInformes(data))
        .catch(err => setError(err.message))
        .finally(() => setLoadingSearch(false));
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm, user?.token]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (e.target.tagName === 'TEXTAREA') {
      autoGrow(e);
    }
  };

  const handleRadioChange = (e) => {
    setFormData(prev => ({ ...prev, instancia: e.target.value }));
  };

  const autoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = (e.target.scrollHeight) + "px";
  };

  const imprimirInforme = () => {
    window.print();
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.alumnoNombre) {
      setError('El "Nombre del alumno/a" es obligatorio para guardar.');
      return;
    }

    setLoading(true);
    try {
      await createInforme(user.token, formData);
      setSuccess('¡Informe guardado con éxito!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- VISTA DETALLE ---
  if (informeSeleccionado) {
    const inf = informeSeleccionado;
    return (
      <div className="container" style={{ maxWidth: '800px', textAlign: 'left', margin: '20px auto' }}>
        <div className="button-back">
          <button onClick={() => setInformeSeleccionado(null)}>VOLVER AL FORMULARIO</button>
        </div>

        <h2 style={{ marginTop: '20px' }}>Detalle del Informe: {inf.alumnoNombre}</h2>
        <p><strong>Fecha Guardado:</strong> {new Date(inf.createdAt).toLocaleString()}</p>
        <hr />

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

  // --- FORMULARIO + BUSQUEDA ---
  return (
    <div ref={containerRef} className="container">

      {/* Botón volver */}
      <div className="button-back" style={{ marginBottom: '20px' }}>
        <button onClick={onBack}>VOLVER AL MENÚ</button>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleGuardar}>
        <h1>INFORME DE CONVIVENCIA</h1>
        <p>Gobierno de la Ciudad Autónoma de Buenos Aires<br />
          Ministerio de Educación<br />
          E.T. Nº 35 D.E. 18, "Ing. Eduardo Latizna"</p>

        {/* Alumno */}
        <div className="form-group">
          <label>1.- El alumno/a:</label>
          <div className="inline-group">
            <input name="alumnoNombre" value={formData.alumnoNombre} onChange={handleChange}
              type="text" className="input-line" placeholder="Nombre del alumno/a" />
            <input name="alumnoAnio" value={formData.alumnoAnio} onChange={handleChange}
              type="text" className="input-line" placeholder="Año" />
            <input name="alumnoDivision" value={formData.alumnoDivision} onChange={handleChange}
              type="text" className="input-line" placeholder="División" />
          </div>
        </div>

        {/* Acción */}
        <div className="form-group">
          <label>2.- Ha realizado la acción que se describe a continuación:</label>
          <textarea name="descripcionAccion" value={formData.descripcionAccion} onChange={handleChange}
            className="textarea-expand" placeholder="Describa la acción realizada"></textarea>
        </div>

        <div className="form-group">
          <label>Transgrediendo Normas del Reglamento de Convivencia de la escuela.</label>
        </div>

        {/* Sanción */}
        <div className="form-group">
          <label>3.- Solicitud de sanción:</label>
          <textarea name="solicitudSancion" value={formData.solicitudSancion} onChange={handleChange}
            className="textarea-expand" placeholder="Descripción de la sanción" />
        </div>

        {/* Docente */}
        <div className="form-group">
          <label>Docente:</label>
          <div className="inline-group">
            <input name="docenteNombre" value={formData.docenteNombre} onChange={handleChange}
              type="text" className="input-line" placeholder="Nombre del docente" />
            <input name="docenteCargo" value={formData.docenteCargo} onChange={handleChange}
              type="text" className="input-line" placeholder="Cargo/Función" />
            <input name="docenteFecha" value={formData.docenteFecha} onChange={handleChange}
              type="text" className="input-line" placeholder="Fecha" />
            <input name="docenteFirma" value={formData.docenteFirma} onChange={handleChange}
              type="text" className="input-line" placeholder="Firma" />
          </div>
        </div>

        {/* Descargo */}
        <div className="form-group">
          <label>4.- Descargo del Alumno/a:</label>
          <textarea name="descargoAlumno" value={formData.descargoAlumno} onChange={handleChange}
            className="textarea-expand" placeholder="Descargo del alumno/a" />
        </div>

        {/* Informe Aula */}
        <div className="form-group">
          <label>5.- Informe de Consejo de Aula:</label>
          <textarea name="informeConsejoAula" value={formData.informeConsejoAula} onChange={handleChange}
            className="textarea-expand" placeholder="Informe del Consejo de Aula" />
        </div>

        {/* Informe Convivencia */}
        <div className="form-group">
          <label>6.- Informe de Consejo de Convivencia:</label>
          <textarea name="informeConsejoConvivencia" value={formData.informeConsejoConvivencia} onChange={handleChange}
            className="textarea-expand" placeholder="Informe del Consejo de Convivencia" />
        </div>

        {/* Observaciones */}
        <div className="form-group">
          <label>7.- Observaciones:</label>
          <textarea name="observaciones" value={formData.observaciones} onChange={handleChange}
            className="textarea-expand" placeholder="Observaciones adicionales" />
        </div>

        {/* Instancia */}
        <div className="form-group">
          <label>8.- Se considera que corresponde:</label>
          <div className="inline-checks">
            <label><input type="radio" name="instancia" value="LEVE" onChange={handleRadioChange} checked={formData.instancia === 'LEVE'} /> 1ª Instancia LEVE</label>
            <label><input type="radio" name="instancia" value="GRAVE" onChange={handleRadioChange} checked={formData.instancia === 'GRAVE'} /> 2ª Instancia GRAVE</label>
            <label><input type="radio" name="instancia" value="MUY GRAVE" onChange={handleRadioChange} checked={formData.instancia === 'MUY GRAVE'} /> 3ª Instancia MUY GRAVE</label>
          </div>
        </div>

        {/* Otra consideración */}
        <div className="form-group">
          <label>Otra Consideración:</label>
          <textarea name="otraConsideracion" value={formData.otraConsideracion} onChange={handleChange}
            className="textarea-expand" />
        </div>

        {/* Firma directivo */}
        <div className="form-group">
          <label>Firma Directivo:</label>
          <input name="firmaDirectivo" value={formData.firmaDirectivo} onChange={handleChange}
            type="text" className="input-line small-input" />
          <label>Fecha:</label>
          <input name="fechaDirectivo" value={formData.fechaDirectivo} onChange={handleChange}
            type="text" className="input-line small-input" />
        </div>

        {/* Notificación */}
        <div className="form-group">
          <label>9.- Notificación:</label>
          <label>Alumno:</label>
          <input name="notificacionAlumno" value={formData.notificacionAlumno} onChange={handleChange}
            type="text" className="input-line small-input" />
          <label>Padre/Madre/Tutor:</label>
          <input name="notificacionTutor" value={formData.notificacionTutor} onChange={handleChange}
            type="text" className="input-line small-input" />
          <label>Fecha:</label>
          <input name="notificacionFecha" value={formData.notificacionFecha} onChange={handleChange}
            type="text" className="input-line small-input" />
        </div>

        {/* Mensajes */}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}

        {/* Botones */}
        <div className="button-container">
          <button type="submit" className="print-button" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar en Base de Datos'}
          </button>
          <button type="button" className="print-button" onClick={imprimirInforme}>
            Imprimir
          </button>
        </div>
      </form>

      {/* --- BUSQUEDA DE INFORMES --- */}
      <div className="form-group" style={{ marginTop: '40px' }}>
        <h2>Búsqueda de Informes Guardados</h2>

        <div className="informe-search">
          <label>Buscar Informes por Nombre de Alumno:</label>

          <input
            type="text"
            placeholder="Escribe el nombre del alumno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  // ✔ CORREGIDO
            className="input-line"
            style={{ width: '100%' }}
          />

          {loadingSearch && <p>Buscando...</p>}

          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '20px' }}>
            {informes.length > 0 ? (
              informes.map(inf => (
                <li key={inf._id} className="informe-list-item" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div>
                    <strong>{inf.alumnoNombre}</strong>
                    <br />
                    <small style={{ color: '#777' }}>
                      Guardado: {new Date(inf.createdAt).toLocaleString()}
                    </small>
                  </div>

                  <button className="print-button" onClick={() => setInformeSeleccionado(inf)}>
                    Ver Detalle
                  </button>
                </li>
              ))
            ) : (
              <p>{searchTerm ? 'No se encontraron informes.' : 'Escribe para buscar informes.'}</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Informe;
