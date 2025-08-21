import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaUsers } from 'react-icons/fa';

const CreateAutomationPage = () => {
    // State for sessions and channels
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [channels, setChannels] = useState([]);
    const [loadingChannels, setLoadingChannels] = useState(false);
    const [errorChannels, setErrorChannels] = useState(null);

    // State for automation form
    const [automationName, setAutomationName] = useState('');
    const [sourceChannels, setSourceChannels] = useState('');
    const [destinationChannels, setDestinationChannels] = useState('');

    // Fetch sessions on component mount
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('/api/sessions/');
                if (!response.ok) throw new Error('Falha ao buscar sessões');
                const data = await response.json();
                setSessions(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSessions();
    }, []);

    // Handle session selection to fetch channels
    const handleSessionChange = async (e) => {
        const sessionId = e.target.value;
        setSelectedSession(sessionId);
        setChannels([]);
        setErrorChannels(null);

        if (sessionId) {
            await fetchChannels(sessionId, false);
        }
    };

    // Fetch channels function
    const fetchChannels = async (sessionId, incremental = false) => {
        setLoadingChannels(true);
        setErrorChannels(null);
        try {
            const url = incremental 
                ? `/api/sessions/${sessionId}/channels?incremental=true`
                : `/api/sessions/${sessionId}/channels`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao buscar canais');
            }
            const data = await response.json();
            if (incremental) {
                setChannels(prev => [...prev, ...data]);
            } else {
                setChannels(data);
            }
        } catch (err) {
            setErrorChannels(err.message);
        } finally {
            setLoadingChannels(false);
        }
    };

    // Add channel ID to the correct textarea
    const handleAddChannel = (id, type) => {
        const channelId = String(id);
        if (type === 'source') {
            setSourceChannels(prev => prev.split('\n').includes(channelId) ? prev : (prev ? `${prev}\n${channelId}` : channelId));
        } else {
            setDestinationChannels(prev => prev.split('\n').includes(channelId) ? prev : (prev ? `${prev}\n${channelId}` : channelId));
        }
    };

    // Handle form submission
    const handleCreateAutomation = async (e) => {
        e.preventDefault();
        if (!selectedSession || !automationName || !sourceChannels || !destinationChannels) {
            alert('Por favor, preencha todos os campos: nome, sessão, origem e destino.');
            return;
        }

        const source_chat_ids = sourceChannels.split('\n').filter(id => id.trim() !== '').map(id => parseInt(id));
        const destination_chat_ids = destinationChannels.split('\n').filter(id => id.trim() !== '').map(id => parseInt(id));

        try {
            const response = await fetch('/api/automations/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: automationName,
                    session_id: parseInt(selectedSession),
                    source_chat_ids: source_chat_ids,
                    destination_chat_ids: destination_chat_ids,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Falha ao criar automação');
            }
            
            alert('Automação criada com sucesso!');
            setAutomationName('');
            setSourceChannels('');
            setDestinationChannels('');
        } catch (error) {
            console.error(error);
            alert(`Erro: ${error.message}`);
        }
    };

        return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-gray-800">Criar Nova Automação</h1>

                {/* Automation Form */}
                <form onSubmit={handleCreateAutomation} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="session-select" className="block text-sm font-medium text-gray-700 mb-2">Sessão</label>
                            <select id="session-select" value={selectedSession} onChange={handleSessionChange} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required>
                                <option value="">-- Selecione uma Sessão --</option>
                                {sessions.map((session) => (
                                    <option key={session.id} value={session.id}>{session.phone_number}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="automation-name" className="block text-sm font-medium text-gray-700 mb-2">Nome da Automação</label>
                            <input type="text" id="automation-name" value={automationName} onChange={(e) => setAutomationName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="source-channels" className="block text-sm font-medium text-gray-700 mb-2">Canais de Origem (um ID por linha)</label>
                            <textarea id="source-channels" value={sourceChannels} onChange={(e) => setSourceChannels(e.target.value)} rows="5" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required></textarea>
                        </div>
                        <div>
                            <label htmlFor="destination-channels" className="block text-sm font-medium text-gray-700 mb-2">Canais de Destino (um ID por linha)</label>
                            <textarea id="destination-channels" value={destinationChannels} onChange={(e) => setDestinationChannels(e.target.value)} rows="5" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition" required></textarea>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">Criar Automação</button>
                </form>

                {/* Channels List */}
                {selectedSession && (
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-3xl font-bold text-gray-800">Canais e Grupos Disponíveis ({channels.length})</h2>
                            <div className="flex flex-wrap gap-2">
                                <button 
                                    onClick={() => fetchChannels(selectedSession, false)}
                                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300 text-sm"
                                    disabled={loadingChannels}
                                >
                                    🔄 Atualizar Tudo
                                </button>
                                <button 
                                    onClick={() => fetchChannels(selectedSession, true)}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300 text-sm"
                                    disabled={loadingChannels}
                                    title="Buscar apenas novos canais"
                                >
                                    ➕ Buscar Novos
                                </button>
                            </div>
                        </div>
                        {loadingChannels && <p className="text-center text-gray-500 py-4">Carregando canais...</p>}
                        {errorChannels && <p className="text-center text-red-600 font-semibold py-4">Erro: {errorChannels}</p>}
                        {!loadingChannels && !errorChannels && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {channels.map(channel => (
                                    <div key={channel.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col justify-between transition-shadow hover:shadow-xl">
                                        <div className="flex items-center mb-4">
                                            {channel.photo_url ? (
                                                <img 
                                                    src={`http://localhost:8000${channel.photo_url}`} 
                                                    alt={channel.title} 
                                                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200 shadow-md"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-md">
                                                    {channel.title.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-bold text-gray-900 truncate flex items-center" title={channel.title}>
                                                    {channel.is_channel ? <FaBullhorn className="mr-2 text-blue-500 flex-shrink-0" /> : <FaUsers className="mr-2 text-green-500 flex-shrink-0" />}
                                                    {channel.title}
                                                </p>
                                                <p className="text-sm text-gray-500">ID: {channel.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2 mt-auto pt-4 border-t border-gray-200">
                                            <button type="button" onClick={() => handleAddChannel(channel.id, 'source')} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm font-semibold transition-transform transform hover:scale-105">+ Origem</button>
                                            <button type="button" onClick={() => handleAddChannel(channel.id, 'destination')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-semibold transition-transform transform hover:scale-105">+ Destino</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateAutomationPage;
