import { useEffect, useState, useRef, useMemo } from 'react';
import { getMessages, sendMessage } from '../api';
import './Chat.css';


function Chat({ user, chatType, allUsers, onBack, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const chatBoxRef = useRef(null);
  
  const capitalize = (s) => (s && s.charAt(0).toUpperCase() + s.slice(1)) || "";

  // --- CAMBIO 2: Lógica para determinar el título del chat ---
  const chatTitle = useMemo(() => {
    if (chatType.includes('_')) {
      const otherUserId = chatType.split('_').find(id => id !== user.id);
      // Asegúrate de que allUsers exista antes de usar 'find'
      const otherUser = allUsers?.find(u => u._id === otherUserId);
      return otherUser ? `Chat con ${otherUser.username}` : 'Chat Privado';
    }
    return `Chat de ${capitalize(chatType)}`;
  }, [chatType, user.id, allUsers]);


  useEffect(() => {
    if (!user?.token || !chatType) return;

    const loadMessages = async () => {
      try {
        setError(null); // Limpiar error anterior
        const data = await getMessages(user.token, chatType);
        setMessages(data);
      } catch (err) {
        setError("No se pudieron cargar los mensajes.");
        console.error(err); // Añadido para depuración
      }
    };
    
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [user?.token, chatType]);
  
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    setIsSending(true);
    setError(null);
    const tempId = Date.now();
    
    const messageData = {
      author: user.username,
      content: input,
      userType: user.userType,
      chatType: chatType,
    };
  
    try {
      // Actualización optimista: añade el mensaje temporalmente
      setMessages(prev => [...prev, { _id: tempId, ...messageData, isTemp: true }]);
      setInput('');
  
      // Envía el mensaje real
      const saved = await sendMessage(user.token, messageData);
  
      // Reemplaza el mensaje temporal con el mensaje guardado del servidor
      setMessages(prev => prev.map(msg => (msg._id === tempId ? saved : msg)));
  
    } catch (err) {
      // Si falla, quita el mensaje temporal
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setError('Error al enviar. Intenta nuevamente.');
      console.error(err); // Añadido para depuración
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <header>
        {/* --- CAMBIO 3: Usamos el título dinámico --- */}
        <h2>{chatTitle}</h2>
        <p>Conectado como: <strong>{user?.username}</strong> ({capitalize(user?.userType)})</p>
        <div className="chat-actions">
          <button onClick={onBack}>Volver al Menú</button>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <p>Aún no hay mensajes en este chat.</p>
        ) : (
          messages.map((msg) => (
            // --- INICIO DE LA ACTUALIZACIÓN (HORA DE ENVÍO) ---
            <div key={msg._id} className={`message ${msg.isTemp ? 'sending' : ''}`}>
              <div className="message-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <strong>{msg.author}</strong> 
                  <span className="user-type"> ({capitalize(msg.userType || 'Usuario')}):</span> 
                </div>
                <span className="message-time" style={{ fontSize: '0.75rem', color: '#888', marginLeft: '10px' }}>
                  {/* Verificamos si 'createdAt' existe (los mensajes del servidor lo tienen) */}
                  {msg.createdAt 
                    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : 'Enviando...'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0' }}>{msg.content}</p>
            </div>
            // --- FIN DE LA ACTUALIZACIÓN ---
          ))
        )}
      </div>

      <form onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={isSending}
        />
        <button type="submit" disabled={isSending || !input.trim()}>
          {isSending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default Chat;
