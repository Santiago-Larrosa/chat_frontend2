import { useState, useEffect } from 'react';
import AlumnoDetalle from './AlumnoDetalle'; // Importamos el componente de detalle

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
    const [error, setError] = useState(""); // Estado para mensajes de error

    // 🔹 Cargar alumnos desde la API al montar el componente
    const cargarAlumnos = () => {
        setError("");
        fetch('/api/alumnos')
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar datos");
                return res.json();
            })
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
            const res = await fetch('/api/alumnos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoAlumno)
            });

            // --- ¡LA CLAVE ESTÁ AQUÍ! ---
            // Comprobamos si la respuesta fue exitosa
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Error al guardar el alumno');
            }

            // Si todo salió bien, el 'data' es el alumno guardado
            const data = await res.json();
            setAlumnos([...alumnos, data]); // Agregamos el alumno real a la lista

            // Limpiamos el formulario
            setNuevoAlumno({
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

    // Esta función permite que AlumnoDetalle actualice la lista
    const handleActualizarAlumno = (alumnoActualizado) => {
        setAlumnos(alumnos.map(a => a._id === alumnoActualizado._id ? alumnoActualizado : a));
        setAlumnoSeleccionado(alumnoActualizado); // Mantenemos el detalle abierto
    };

    // Si hay un alumno seleccionado, mostramos el detalle
    if (alumnoSeleccionado) {
        return (
            <AlumnoDetalle
                alumno={alumnoSeleccionado}
                onBack={() => setAlumnoSeleccionado(null)}
                onUpdate={handleActualizarAlumno} // Pasamos la función de actualizar
            />
        );
    }

    // Vista principal (lista y formulario)
    return (
        <div className="registro-container">
            <h2>Registro DOE</h2>
            <button onClick={onBack}>Volver</button>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <form onSubmit={handleAgregar} className="registro-form">
                {/* (Tu formulario no cambia) */}
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
                        {/* Ahora 'a.nombre' y 'a.curso' deberían tener datos */}
                        <strong>{a.nombre}</strong> ({a.curso})
                        <button onClick={() => handleAbrirAlumno(a)}>Ver registro</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RegistroDOE;
