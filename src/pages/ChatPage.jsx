// src/pages/ChatPage.jsx

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const { appointmentId } = useParams();
    const webSocket = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const socketUrl = `ws://127.0.0.1:8000/ws/chat/${appointmentId}/?token=${token}`;
        webSocket.current = new WebSocket(socketUrl);

        webSocket.current.onopen = () => setIsConnected(true);
        webSocket.current.onclose = () => setIsConnected(false);
        webSocket.current.onerror = (error) => console.error("WebSocket error:", error);
        webSocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };

        return () => webSocket.current.close();
    }, [appointmentId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && isConnected) {
            webSocket.current.send(JSON.stringify({ 'message': newMessage }));
            setNewMessage('');
        }
    };

    return (
        <div className="main-content">
            <Link to="/my-appointments">{"< Volver"}</Link>
            <h1 className="page-title">Chat de la Cita</h1>
            <div className="chat-container professional-card">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <strong>{msg.user}: </strong>{msg.message}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="chat-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
                        disabled={!isConnected}
                    />
                    <button type="submit" className="btn-primary" disabled={!isConnected}>
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatPage;