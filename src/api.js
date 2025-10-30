// --- chat/src/api.js ---
// Usamos la URL de Render que ya está desplegada
const API_BASE_URL = 'https://chat-backend-zjq4.onrender.com';

// Función genérica para manejar las peticiones fetch
const apiFetch = async (endpoint, method = 'GET', body = null, token = null) => {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error en la petición a la API');
    }
    
    return data;
  } catch (error) {
    console.error(`Error en apiFetch (${endpoint}):`, error.message);
    throw error;
  }
};

// --- Autenticación (Funciones existentes) ---
export const registerUser = (userData) => {
  return apiFetch('/auth/register', 'POST', userData);
};

export const loginUser = (credentials) => {
  return apiFetch('/auth/login', 'POST', credentials);
};

// --- Usuarios (Función existente) ---
export const getAllUsers = (token, searchTerm = '') => {
  return apiFetch(`/users?search=${searchTerm}`, 'GET', null, token);
};

// --- Mensajes (No la necesitamos aquí, pero estaría bien moverla) ---
// (Tu lógica de mensajes está en otro lado, la omitimos por ahora)

// --- ¡NUEVO! Alumnos (Para RegistroDOE) ---
// --- CORRECCIÓN: Reescribimos las funciones para no depender de 'apiFetch' y evitar el error ---
export const getAlumnos = async () => {
  const url = `${API_BASE_URL}/api/alumnos`;
  try {
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al obtener alumnos');
    }
    return data;
  } catch (error) {
    console.error(`Error en getAlumnos:`, error.message);
    throw error;
  }
};

export const createAlumno = async (alumnoData) => {
  const url = `${API_BASE_URL}/api/alumnos`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alumnoData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al crear alumno');
    }
    return data;
  } catch (error) {
    console.error(`Error en createAlumno:`, error.message);
    throw error;
  }
};

// --- ¡NUEVO! Observaciones (Para AlumnoDetalle) ---
export const addObservacion = async (alumnoId, observacionData) => {
  const url = `${API_BASE_URL}/api/alumnos/${alumnoId}/observaciones`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(observacionData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al agregar observación');
    }
    return data;
  } catch (error) {
    console.error(`Error en addObservacion:`, error.message);
    throw error;
  }
};

