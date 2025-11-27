import { useState , useRef} from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// ¡Importamos la nueva función de la API!
import { addObservacion } from '../api.js'; 
import './AuthForms.css'; // Usamos el mismo CSS

function AlumnoDetalle({ alumno, onBack, onUpdate }) {
    const [nuevaObs, setNuevaObs] = useState({ titulo: '', texto: '' });
    const [error, setError] = useState('');

    // --- 3. Crear el Ref para el contenedor principal ---
    const pdfRef = useRef();

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
    
    // --- NUEVA FUNCIÓN ---
    // Pequeña función para formatear la fecha y hora
    const formatFecha = (isoString) => {
        if (!isoString) return 'Fecha desconocida';
        const fecha = new Date(isoString);
        // Formato: "11/11/2025, 14:30 hs"
        return fecha.toLocaleString('es-AR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --- 4. NUEVA FUNCIÓN DE DESCARGA PDF ---
    const descargarPDFAlumnos = () => {
        const input = pdfRef.current;
        if (!input) return;

        // Ocultar botones y formulario de "Agregar Observación"
        const btnVolver = input.querySelector('.btn-volver-pdf');
        const btnDescargar = input.querySelector('.btn-descargar-pdf');
        const formObs = input.querySelector('.observacion-form');

        if (btnVolver) btnVolver.style.display = 'none';
        if (btnDescargar) btnDescargar.style.display = 'none';
        if (formObs) formObs.style.display = 'none';

        html2canvas(input, { 
            scale: 2, // Mejorar resolución
            useCORS: true 
        })
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            const ratio = pdfPageWidth / canvasWidth;
            const canvasPageHeight = canvasHeight * ratio;
            
            let heightLeft = canvasPageHeight;
            let position = 0; 

            pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, canvasPageHeight);
            heightLeft -= pdfPageHeight;

            while (heightLeft > 0) {
              position = heightLeft - canvasPageHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, canvasPageHeight);
              heightLeft -= pdfPageHeight;
            }
            
            const safeName = (alumno.nombre || 'alumno').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            pdf.save(`observaciones_${safeName}.pdf`);

            // Volver a mostrar botones y formulario
            if (btnVolver) btnVolver.style.display = 'block';
            if (btnDescargar) btnDescargar.style.display = 'block';
            if (formObs) formObs.style.display = 'block';
          })
          .catch(err => {
            console.error("Error al generar PDF:", err);
            // Asegurarse de mostrar todo de nuevo si hay error
            if (btnVolver) btnVolver.style.display = 'block';
            if (btnDescargar) btnDescargar.style.display = 'block';
            if (formObs) formObs.style.display = 'block';
          });
    };

    return (
        // --- 5. Añadir el ref al div principal ---
        <div className="registro-container" ref={pdfRef}>
            {/* --- 6. Añadir botones y clases para ocultarlos --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <button onClick={onBack} className="btn-volver-pdf">
                    Volver a la lista
                </button>
                <button onClick={descargarPDFAlumnos} className="btn-descargar-pdf">
                    Descargar PDF
                </button>
            </div>
            
            <h2>Detalle de: {alumno.nombre}</h2>
            
            <div className="alumno-info">
                <p><strong>Curso:</strong> {alumno.curso}</p>
                <p><strong>DNI:</strong> {alumno.dni}</p>
                <p><strong>Edad:</strong> {alumno.edad}</p>
                <p><strong>Dirección:</strong> {alumno.direccion}</p>
                <p><strong>Teléfono:</strong> {alumno.telefono}</p>
                <p><strong>Tutor:</strong> {alumno.tutor}</p>
            </div>
            
            <hr />

            <h3>Observaciones</h3>
            <ul className="registro-lista">
                {alumno.observaciones && alumno.observaciones.length > 0 ? (
                    alumno.observaciones.map((obs, index) => (
                        <li key={index} className="observacion-item">
                            <strong>{obs.titulo}</strong> 
                            <span className="observacion-fecha">({formatFecha(obs.fecha)})</span>
                            <p>{obs.texto}</p>
                        </li>
                    ))
                ) : (
                    <p>No hay observaciones para este alumno.</p>
                )}
            </ul>

            {/* --- 7. Añadir clase para ocultar el formulario --- */}
            <form onSubmit={handleAddObservacion} className="registro-form observacion-form">
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




