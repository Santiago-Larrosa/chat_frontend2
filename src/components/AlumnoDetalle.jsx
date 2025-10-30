import { useState } from 'react';
// ¡Importamos la nueva función de la API!
import { addObservacion } from '../api.js'; 
import './AuthForms.css'; // Usamos el mismo CSS

function AlumnoDetalle({ alumno, onBack, onUpdate }) {
    const [nuevaObs, setNuevaObs] = useState({ titulo: '', texto: '' });
    const [error, setError] = useState('');

    const handleObsChange = (e) => {
        setNuevaObs({ ...nuevaObs, [e.target.name]: e.target.value });
    };

    const handleAddObservacion = async (e) => {
        e.preventDefault();
        setError('');
        if (!nuevaObs.titulo || !nuevaObs.texto) {
            setError('El título y el texto son obligatorios.');
            return;
        }

        try {
            // ¡CORRECCIÓN! Usamos la función de la API
            const alumnoActualizado = await addObservacion(alumno._id, nuevaObs);
            
            onUpdate(alumnoActualizado); // Enviamos el alumno actualizado al componente padre
            setNuevaObs({ titulo: '', texto: '' }); // Limpiamos el formulario
        } catch (err) {
            console.error('Error al agregar observación:', err);
            setError(err.message);
        }
    };

    return (
        <div className="registro-container">
            <button onClick={onBack}>Volver a la lista</button>
            <h2>Detalle de: {alumno.nombre}</h2>
            <p><strong>Curso:</strong> {alumno.curso}</p>
            <p><strong>DNI:</strong> {alumno.dni}</p>
            <p><strong>Edad:</strong> {alumno.edad}</p>
            <p><strong>Dirección:</strong> {alumno.direccion}</p>
            <p><strong>Teléfono:</strong> {alumno.telefono}</p>
            <p><strong>Tutor:</strong> {alumno.tutor}</p>
            
            <hr />

            <h3>Observaciones</h3>
            <ul className="registro-lista">
                {alumno.observaciones && alumno.observaciones.length > 0 ? (
                    alumno.observaciones.map((obs, index) => (
                        <li key={index} className="observacion-item">
                            <strong>{obs.titulo}</strong> ({obs.fecha})
                            <p>{obs.texto}</p>
                        </li>
                    ))
                ) : (
                    <p>No hay observaciones para este alumno.</p>
                )}
            </ul>

            <form onSubmit={handleAddObservacion} className="registro-form">
                <h4>Agregar Nueva Observación</h4>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    name="titulo"
                    placeholder="Título de la observación"
                    value={nuevaObs.titulo}
                    onChange={handleObsChange}
                />
                <textarea
                    name="texto"
                    placeholder="Escribe la observación..."
                    value={nuevaObs.texto}
                    onChange={handleObsChange}
                />
                <button type="submit">Guardar Observación</button>
            </form>
        </div>
    );
}

export default AlumnoDetalle;
