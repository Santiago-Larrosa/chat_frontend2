import React, { useState } from 'react';

function AlumnoDetalle({ alumno, onBack, onUpdate }) {
    const [titulo, setTitulo] = useState('');
    const [texto, setTexto] = useState('');
    const [error, setError] = useState('');

    const handleAgregarObservacion = async (e) => {
        e.preventDefault();
        setError('');
        if (!titulo || !texto) {
            setError('El título y el texto son obligatorios.');
            return;
        }

        try {
            const res = await fetch(`/api/alumnos/${alumno._id}/observaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, texto }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Error al agregar observación');
            }

            const alumnoActualizado = await res.json();
            
            // Usamos la función onUpdate para notificar al padre
            onUpdate(alumnoActualizado); 
            
            // Limpiamos el formulario
            setTitulo('');
            setTexto('');

        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div className="alumno-detalle-container">
            <button onClick={onBack}>Volver a la lista</button>

            <h2>Registro de {alumno.nombre}</h2>
            
            {/* Sección de datos del alumno */}
            <div className="alumno-info">
                <p><strong>Curso:</strong> {alumno.curso}</p>
                <p><strong>Fecha de Ingreso:</strong> {alumno.fecha}</p>
                <p><strong>DNI:</strong> {alumno.dni}</p>
                <p><strong>Edad:</strong> {alumno.edad}</p>
                <p><strong>Dirección:</strong> {alumno.direccion}</p>
                <p><strong>Teléfono:</strong> {alumno.telefono}</p>
                <p><strong>Tutor:</strong> {alumno.tutor}</p>
            </div>

            {/* Sección de Observaciones */}
            <div className="observaciones-section">
                <h3>Observaciones</h3>

                {/* Formulario para agregar nueva observación */}
                <form onSubmit={handleAgregarObservacion} className="observacion-form">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input
                        type="text"
                        placeholder="Título de la observación"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <textarea
                        placeholder="Escribe el texto de la observación..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                    ></textarea>
                    <button type="submit">Agregar observación</button>
                </form>

                {/* Lista de observaciones existentes */}
                <div className="observaciones-lista">
                    {alumno.observaciones && alumno.observaciones.length > 0 ? (
                        alumno.observaciones.map((obs, index) => (
                            <div key={index} className="observacion-item">
                                <strong>{obs.titulo}</strong> ({obs.fecha})
                                <p>{obs.texto}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay observaciones para este alumno.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AlumnoDetalle;
