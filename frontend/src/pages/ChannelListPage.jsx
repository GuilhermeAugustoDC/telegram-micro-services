import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ChannelListPage = () => {
  const { sessionId } = useParams();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async (incremental = false) => {
      try {
        setLoading(true);
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchChannels();
    }
  }, [sessionId]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Canais e Grupos ({channels.length})</h1>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => fetchChannels(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300 text-sm"
                disabled={loading}
              >
                🔄 Atualizar Tudo
              </button>
              <button 
                onClick={() => fetchChannels(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300 text-sm"
                disabled={loading}
                title="Buscar apenas novos canais"
              >
                ➕ Buscar Novos
              </button>
              <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm">
                  Voltar
              </Link>
            </div>
        </div>
        
        {loading && <p className="text-center text-gray-600">Carregando canais...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded">Erro: {error}</p>}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Título</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Tipo</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Membros</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel) => (
                  <tr key={channel.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-gray-700">{channel.title}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{channel.is_channel ? 'Canal' : 'Grupo'}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{channel.members_count || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelListPage;

