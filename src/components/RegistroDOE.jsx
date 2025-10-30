// 1. ¡CORRECCIÓN! Faltaban useState y useEffect
import { useState, useEffect } from 'react';
import AlumnoDetalle from './AlumnoDetalle'; 
// 2. ¡CORRECCIÓN! Importamos las funciones de api.js
import { getAlumnos, createAlumno } from '../api.js'; 
// Asumo que tu AuthForms.css está en la misma carpeta
import './AuthForms.css'; 

function RegistroDOE({ onBack }) {
    const [alumnos, setAlumnos] = useState([]);
    const [nuevoAlumno, setNuevoAlumno] = useState({
        nombre: "",
        curso: "",
        fecha: "",
        dni: "",
        edad: "",
        direccion: "",
        telefono: "",
        tutor: ""
    });
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [error, setError] = useState(""); 

    // 🔹 Cargar alumnos (AHORA USA api.js)
    const cargarAlumnos = () => {
        setError("");
        // 3. ¡CORRECCIÓN! Usamos la función de la API
        getAlumnos()
            .then(data => setAlumnos(data))
            .catch(err => {
                console.error('Error al cargar alumnos:', err);
                setError(err.message);
            });
    };

    useEffect(() => {
        cargarAlumnos();
    }, []);

    const handleChange = (e) => {
        setNuevoAlumno({ ...nuevoAlumno, [e.target.name]: e.target.value });
    };

    const handleAgregar = async (e) => {
        e.preventDefault();
        setError("");
        if (!nuevoAlumno.nombre || !nuevoAlumno.curso) {
            setError("Nombre y Curso son obligatorios.");
            return;
        }

        try {
            // 4. ¡CORRECCIÓN! Usamos la función de la API
            const data = await createAlumno(nuevoAlumno);
            
            setAlumnos([...alumnos, data]); // Agregamos el alumno real a la lista
            setNuevoAlumno({ // Limpiamos el formulario
                nombre: "", curso: "", fecha: "", dni: "",
                edad: "", direccion: "", telefono: "", tutor: ""
            });
        } catch (err) {
            console.error('Error al agregar alumno:', err);
            setError(err.message);
        }
    };

    const handleAbrirAlumno = (alumno) => {
        setAlumnoSeleccionado(alumno);
    };

    const handleActualizarAlumno = (alumnoActualizado) => {
        setAlumnos(alumnos.map(a => a._id === alumnoActualizado._id ? alumnoActualizado : a));
        setAlumnoSeleccionado(alumnoActualizado); 
    };

    if (alumnoSeleccionado) {
        return (
            <AlumnoDetalle
                alumno={alumnoSeleccionado}
                onBack={() => setAlumnoSeleccionado(null)}
                onUpdate={handleActualizarAlumno} 
            />
        );
    }

    // (El resto de tu JSX es idéntico y está perfecto)
    return (
        <div className="registro-container"> 
            <h2>Registro DOE</h2>
            <button onClick={onBack}>Volver</button>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <form onSubmit={handleAgregar} className="registro-form">
                <input name="nombre" placeholder="Nombre del alumno" value={nuevoAlumno.nombre} onChange={handleChange} />
                <input name="curso" placeholder="Curso" value={nuevoAlumno.curso} onChange={handleChange} />
                <input type="date" name="fecha" value={nuevoAlumno.fecha} onChange={handleChange} />
                <input name="dni" placeholder="DNI" value={nuevoAlumno.dni} onChange={handleChange} />
                <input name="edad" placeholder="Edad" value={nuevoAlumno.edad} onChange={handleChange} />
                <input name="direccion" placeholder="Dirección" value={nuevoAlumno.direccion} onChange={handleChange} />
                <input name="telefono" placeholder="Teléfono" value={nuevoAlumno.telefono} onChange={handleChange} />
                <input name="tutor" placeholder="Tutor o responsable" value={nuevoAlumno.tutor} onChange={handleChange} />
                <button type="submit">Agregar Alumno</button>
            </form>

            <h3>Lista de alumnos</h3>
            <ul className="registro-lista">
                {alumnos.map((a) => (
                    <li key={a._id}>
                        <strong>{a.nombre}</strong> ({a.curso})
                        <button onClick={() => handleAbrirAlumno(a)}>Ver registro</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RegistroDOE;

