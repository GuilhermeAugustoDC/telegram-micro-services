import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SessionList from '../components/SessionList';

const SessionsPage = () => {
    const [sessions, setSessions] = useState([]);

    const fetchSessions = async () => {
        try {
            const response = await fetch('/api/sessions/');
            if (!response.ok) throw new Error('Falha ao buscar sessões');
            const data = await response.json();
            setSessions(data);
        } catch (error) {
            console.error(error);
            alert(`Erro: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Sessões</h1>
                <Link 
                    to='/create-session'
                    className='inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors'
                >
                    🆕 Criar Nova Sessão
                </Link>
            </div>
            <div>
                <SessionList sessions={sessions} onSessionDeleted={fetchSessions} />
            </div>
        </div>
    );
};

export default SessionsPage;
