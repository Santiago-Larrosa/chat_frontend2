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

    {/* ⚠️ IMPORTANTE → agregar el <form> acá */}
    <form onSubmit={handleGuardar}>

      {/* ------------------------- ALUMNO ------------------------ */}
      <div className="form-group">
        <label>1.- El alumno/a:</label>
        <div className="inline-group">
          <input
            type="text"
            className="input-line"
            name="alumnoNombre"
            placeholder="Nombre del alumno/a"
            value={formData.alumnoNombre}
            onChange={handleChange}
          />

          <input
            type="text"
            className="input-line"
            name="alumnoAnio"
            placeholder="Año"
            value={formData.alumnoAnio}
            onChange={handleChange}
          />

          <input
            type="text"
            className="input-line"
            name="alumnoDivision"
            placeholder="División"
            value={formData.alumnoDivision}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ------------------------- ACCIÓN ------------------------ */}
      <div className="form-group">
        <label>2.- Ha realizado la acción que se describe a continuación:</label>
        <textarea
          className="textarea-expand"
          name="descripcionAccion"
          placeholder="Describa la acción realizada"
          value={formData.descripcionAccion}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-group">
        <label>Transgrediendo Normas del Reglamento de Convivencia de la escuela.</label>
      </div>

      {/* ------------------------- SANCIÓN ------------------------ */}
      <div className="form-group">
        <label>3.- Solicitud de sanción:</label>
        <textarea
          className="textarea-expand"
          name="solicitudSancion"
          placeholder="Descripción de la sanción"
          value={formData.solicitudSancion}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* ------------------------- DOCENTE ------------------------ */}
      <div className="form-group">
        <label>Docente:</label>
        <div className="inline-group">

          <input
            type="text"
            className="input-line"
            name="docenteNombre"
            placeholder="Nombre del docente"
            value={formData.docenteNombre}
            onChange={handleChange}
          />

          <input
            type="text"
            className="input-line"
            name="docenteCargo"
            placeholder="Cargo/Función"
            value={formData.docenteCargo}
            onChange={handleChange}
          />

          <input
            type="text"
            className="input-line"
            name="docenteFecha"
            placeholder="Fecha"
            value={formData.docenteFecha}
            onChange={handleChange}
          />

          <input
            type="text"
            className="input-line"
            name="docenteFirma"
            placeholder="Firma"
            value={formData.docenteFirma}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ------------------------- DESCARGO ------------------------ */}
      <div className="form-group">
        <label>4.- Descargo del Alumno/a:</label>
        <textarea
          className="textarea-expand"
          name="descargoAlumno"
          placeholder="Descargo del alumno/a"
          value={formData.descargoAlumno}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* ------------------- CONSEJO DE AULA ---------------------- */}
      <div className="form-group">
        <label>5.- Informe de Consejo de Aula:</label>
        <textarea
          className="textarea-expand"
          name="informeConsejoAula"
          placeholder="Informe del Consejo de Aula"
          value={formData.informeConsejoAula}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* ------------------- CONSEJO DE CONVIVENCIA --------------- */}
      <div className="form-group">
        <label>6.- Informe de Consejo de Convivencia:</label>
        <textarea
          className="textarea-expand"
          name="informeConsejoConvivencia"
          placeholder="Informe del Consejo de Convivencia"
          value={formData.informeConsejoConvivencia}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* ------------------------- OBSERVACIONES ------------------------ */}
      <div className="form-group">
        <label>7.- Observaciones:</label>
        <textarea
          className="textarea-expand"
          name="observaciones"
          placeholder="Observaciones adicionales"
          value={formData.observaciones}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* ------------------------- INSTANCIA ------------------------ */}
      <div className="form-group">
        <label>8.- Se considera que corresponde:</label>

        <div className="inline-checks">

          <label>
            <input
              type="radio"
              name="instancia"
              value="LEVE"
              checked={formData.instancia === "LEVE"}
              onChange={handleChange}
            /> 1ª Instancia LEVE
          </label>

          <label>
            <input
              type="radio"
              name="instancia"
              value="GRAVE"
              checked={formData.instancia === "GRAVE"}
              onChange={handleChange}
            /> 2ª Instancia GRAVE
          </label>

          <label>
            <input
              type="radio"
              name="instancia"
              value="MUY GRAVE"
              checked={formData.instancia === "MUY GRAVE"}
              onChange={handleChange}
            /> 3ª Instancia MUY GRAVE
          </label>

        </div>

        <label>Otra Consideración:</label>
        <textarea
          className="textarea-expand"
          name="otraConsideracion"
          value={formData.otraConsideracion}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* ---------------------- FIRMA DIRECTIVO -------------------- */}
      <div className="form-group">
        <label>Firma Directivo:</label>

        <input
          type="text"
          className="input-line small-input"
          name="firmaDirectivo"
          value={formData.firmaDirectivo}
          onChange={handleChange}
        />

        <label>Fecha:</label>

        <input
          type="text"
          className="input-line small-input"
          name="fechaDirectivo"
          value={formData.fechaDirectivo}
          onChange={handleChange}
        />
      </div>

      {/* ---------------------- NOTIFICACIÓN ---------------------- */}
      <div className="form-group">
        <label>9.- Notificación:</label>

        <label>Alumno:</label>
        <input
          type="text"
          className="input-line small-input"
          name="notificacionAlumno"
          value={formData.notificacionAlumno}
          onChange={handleChange}
        />

        <label>Padre/Madre/Tutor:</label>
        <input
          type="text"
          className="input-line small-input"
          name="notificacionTutor"
          value={formData.notificacionTutor}
          onChange={handleChange}
        />

        <label>Fecha:</label>
        <input
          type="text"
          className="input-line small-input"
          name="notificacionFecha"
          value={formData.notificacionFecha}
          onChange={handleChange}
        />
      </div>

      {/* ---------------------- MENSAJES ---------------------- */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* ---------------------- BOTONES ---------------------- */}
      <div className="button-container">
        <button type="submit" className="print-button" disabled={loading}>
          {loading ? "Guardando..." : "Guardar en Base de Datos"}
        </button>

        <button type="button" className="print-button" onClick={imprimirInforme}>
          Imprimir
        </button>
      </div>

    </form>

    {/* ---------------------- BUSQUEDA ---------------------- */}
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



