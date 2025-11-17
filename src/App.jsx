import { useState, useEffect } from 'react';

// --- CORRECCIÓN ---
// Asumimos que TODOS los archivos están en la misma carpeta 'src/'
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Chat from './components/Chat';
import Informe from './components/Informe';
import MenuPrincipal from './components/MenuPrincipal';
import RegistroDOE from './components/RegistroDOE';
import GestionInformes from './components/GestionInformes.jsx';

// Asumimos que api.js y los CSS también están en 'src/'
import { getAllUsers } from './api.js';

function App() {
  const [user, setUser] = useState(null);
  // 2. --- CORRECCIÓN ---
  // 'informe' es ahora una vista válida
  const [view, setView] = useState('login'); // 'login', 'register', 'menu', 'chat', 'informe'
  const [chatType, setChatType] = useState('general');
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState('');

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.token) {
        setUser(parsedUser);
        setView('menu');
      }
    }
  }, []);

  // Cargar lista de usuarios si estamos logueados
  useEffect(() => {
    if (user && user.token) {
      getAllUsers(user.token)
        .then(setAllUsers)
        .catch(err => console.error("Error al cargar usuarios:", err));
    }
  }, [user]);

  const handleLogin = (userData) => {
    localStorage.setItem('chatUser', JSON.stringify(userData));
    setUser(userData);
    setView('menu');
    setError('');
  };

  const handleRegister = (userData) => {
    setView('login');
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('chatUser');
    setUser(null);
    setView('login');
  };

  // Función de navegación principal
  const handleNavigate = (targetView, targetChatType = null) => {
    if (targetView === 'chat' && targetChatType) {
      setChatType(targetChatType);
    }
    setView(targetView);
  };

  // --- Vistas de Login / Registro ---
  if (!user) {
    return (
      <div className="app-container auth-mode">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {view === 'login' && (
          <LoginForm onLogin={handleLogin} onNavigate={() => setView('register')} />
        )}
        {view === 'register' && (
          <RegisterForm onRegister={handleRegister} onBack={() => setView('login')} />
        )}
      </div>
    );
  }

  // --- Vistas de Usuario Autenticado ---
  return (
    <div className="app-container">
      {view === 'menu' && (
        <MenuPrincipal
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      
      {view === 'chat' && (
        <Chat
          user={user}
          chatType={chatType}
          allUsers={allUsers}
          onBack={() => setView('menu')}
          onLogout={handleLogout}
        />
      )}
      
      {/* 3. --- CORRECCIÓN --- */}
      {/* Ahora, cuando la vista es 'informe' (desde el botón del menú), 
        renderizamos tu componente 'Informe.jsx' y, 
        crucialmente, le pasamos el 'user'.
      */}
      {view === 'informe' && (
        <Informe
          user={user} // <-- ¡AQUÍ ESTÁ LA SOLUCIÓN!
          onBack={() => setView('menu')}
        />
      )}
      
      {view === 'registro' && (
         <RegisterForm onRegister={handleRegister} onBack={() => setView('menu')} />
      )}
    </div>
  );
}

export default App;
