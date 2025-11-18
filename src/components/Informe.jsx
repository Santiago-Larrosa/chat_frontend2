// src/components/Informe.jsx
import React, { useRef, useState, useEffect } from 'react';
import { createInforme, getInformes } from '../api.js';
import './informe.component.css';

function Informe({ user, onBack }) {
  const containerRef = useRef();

  // --- Estados del formulario ---
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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Estados de búsqueda ---
  const [searchTerm, setSearchTerm] = useState('');
  const [informes, setInformes] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [informeSeleccionado, setInformeSeleccionado] = useState(null);

  // --- BUSQUEDA ---
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

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (e.target.tagName === "TEXTAREA") autoGrow(e);
  };

  const autoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.alumnoNombre) {
      setError('El "Nombre del alumno/a" es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      await createInforme(user.token, formData);
      setSuccess("Informe guardado correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const imprimirInforme = () => window.print();

  // --- DETALLE ---
  if (informeSeleccionado) {
    const inf = informeSeleccionado;
    return (
      <div className="container">
        <button className="print-button" onClick={() => setInformeSeleccionado(null)}>VOLVER</button>
        <h2>Detalle del Informe</h2>

        {Object.entries(inf).map(([key, value]) => (
          <div className="form-group" key={key}>
            <label>{key}:</label>
            <p>{String(value)}</p>
          </div>
        ))}
      </div>
    );
  }

  // ---------------------------------------------------------
  //              FORMULARIO + ESTÉTICA ORIGINAL
  // ---------------------------------------------------------
  return (
     <div ref={containerRef} className="container">
      <h1>INFORME DE CONVIVENCIA</h1>
      <p>Gobierno de la Ciudad Autónoma de Buenos Aires<br />
        Ministerio de Educación<br />
        E.T. Nº 35 D.E. 18, "Ing. Eduardo Latizna"</p>

      <div className="form-group">
        <label>1.- El alumno/a:</label>
        <div className="inline-group">
          <input type="text" className="input-line" placeholder="Nombre del alumno/a" />
          <input type="text" className="input-line" placeholder="Año" />
          <input type="text" className="input-line" placeholder="División" />
        </div>
      </div>

      <div className="form-group">
        <label>2.- Ha realizado la acción que se describe a continuación:</label>
        <textarea className="textarea-expand" onInput={autoGrow} placeholder="Describa la acción realizada"></textarea>
      </div>

      <div className="form-group">
        <label>Transgrediendo Normas del Reglamento de Convivencia de la escuela.</label>
      </div>

      <div className="form-group">
        <label>3.- Solicitud de sanción:</label>
        <textarea className="textarea-expand" onInput={autoGrow} placeholder="Descripción de la sanción" />
      </div>

      <div className="form-group">
        <label>Docente:</label>
        <div className="inline-group">
          <input type="text" className="input-line" placeholder="Nombre del docente" />
          <input type="text" className="input-line" placeholder="Cargo/Función" />
          <input type="text" className="input-line" placeholder="Fecha" />
          <input type="text" className="input-line" placeholder="Firma" />
        </div>
      </div>

      <div className="form-group">
        <label>4.- Descargo del Alumno/a:</label>
        <textarea className="textarea-expand" onInput={autoGrow} placeholder="Descargo del alumno/a" />
      </div>

      <div className="form-group">
        <label>5.- Informe de Consejo de Aula:</label>
        <textarea className="textarea-expand" onInput={autoGrow} placeholder="Informe del Consejo de Aula" />
      </div>

      <div className="form-group">
        <label>6.- Informe de Consejo de Convivencia:</label>
        <textarea className="textarea-expand" onInput={autoGrow} placeholder="Informe del Consejo de Convivencia" />
      </div>

      <div className="form-group">
        <label>7.- Observaciones:</label>
        <textarea className="textarea-expand" onInput={autoGrow} placeholder="Observaciones adicionales" />
      </div>

      <div className="form-group">
        <label>8.- Se considera que corresponde (Indicar a continuación):</label>
        <div className="inline-checks">
          <label><input type="radio" name="instancia" /> 1ª Instancia LEVE</label>
          <label><input type="radio" name="instancia" /> 2ª Instancia GRAVE</label>
          <label><input type="radio" name="instancia" /> 3ª Instancia MUY GRAVE</label>
        </div>
      </div>

      <div className="form-group">
        <label>Otra Consideración:</label>
        <textarea className="textarea-expand" onInput={autoGrow} />
      </div>

      <div className="form-group">
        <label>Firma Directivo:</label>
        <input type="text" className="input-line small-input" />
        <label>Fecha:</label>
        <input type="text" className="input-line small-input" />
      </div>

      <div className="form-group">
        <label>9.- Notificación:</label>
        <label>Alumno:</label>
        <input type="text" className="input-line small-input" />
        <label>Padre/Madre/Tutor:</label>
        <input type="text" className="input-line small-input" />
        <label>Fecha:</label>
        <input type="text" className="input-line small-input" />
      </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div className="button-container">
          <button type="submit" className="print-button" disabled={loading}>
            {loading ? "Guardando..." : "Guardar en Base de Datos"}
          </button>

          <button type="button" className="print-button" onClick={imprimirInforme}>
            Imprimir
          </button>
        </div>
      </form>

      {/* --- BUSQUEDA --- */}
      <div className="form-group" style={{ marginTop: '40px' }}>
        <h2>Búsqueda de Informes Guardados</h2>

        <input
          className="input-line"
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%" }}
        />

        {loadingSearch && <p>Buscando...</p>}

        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "20px" }}>
          {informes.length > 0 ? (
            informes.map(inf => (
              <li key={inf._id} className="informe-list-item">
                <div>
                  <strong>{inf.alumnoNombre}</strong><br />
                  <small>{new Date(inf.createdAt).toLocaleString()}</small>
                </div>

                <button className="print-button" onClick={() => setInformeSeleccionado(inf)}>
                  Ver
                </button>
              </li>
            ))
          ) : (
            <p>{searchTerm ? "No se encontraron informes." : "Escribe para buscar."}</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Informe;

