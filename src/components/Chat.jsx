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

  const chatTitle = useMemo(() => {
    if (chatType.includes('_')) {
      const otherUserId = chatType.split('_').find(id => id !== user.id);
      const otherUser = allUsers?.find(u => u._id === otherUserId);
      return otherUser ? `Chat con ${otherUser.username}` : 'Chat Privado';
    }
    return `Chat de ${capitalize(chatType)}`;
  }, [chatType, user.id, allUsers]);


  useEffect(() => {
    if (!user?.token || !chatType) return;

    const loadMessages = async () => {
      try {
        setError(null); 
        const data = await getMessages(user.token, chatType);
        setMessages(data);
      } catch (err) {
        setError("No se pudieron cargar los mensajes.");
        console.error(err);
      }
    };
    
    loadMessages();
    // Refrescamos los mensajes cada 5 segundos
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
      setMessages(prev => [...prev, { _id: tempId, ...messageData, isTemp: true }]);
      setInput('');
  
      const saved = await sendMessage(user.token, messageData);
  
      setMessages(prev => prev.map(msg => (msg._id === tempId ? saved : msg)));
  
    } catch (err) {
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setError('Error al enviar. Intenta nuevamente.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <header>
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
            <div key={msg._id} className={`message ${msg.isTemp ? 'sending' : ''}`}>
              <div className="message-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <strong>{msg.author}</strong> 
                  <span className="user-type"> ({capitalize(msg.userType || 'Usuario')}):</span> 
                </div>
                
                {/* --- ¡AQUÍ ESTÁ EL CAMBIO! --- */}
                <span className="message-time" style={{ 
                  fontSize: '0.75rem', 
                  color: '#888', 
                  marginLeft: '10px', 
                  whiteSpace: 'nowrap' /* Para que la fecha y hora no se separen */ 
                }}>
                  {msg.createdAt 
                    ? new Date(msg.createdAt).toLocaleString('es-AR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) 
                    : 'Enviando...'}
                </span>
                {/* --- FIN DEL CAMBIO --- */}
                
              </div>
              <p style={{ margin: '4px 0 0' }}>{msg.content}</p>
            </div>
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
