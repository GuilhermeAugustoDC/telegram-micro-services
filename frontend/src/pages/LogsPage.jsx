import React, { useEffect, useMemo, useState } from 'react';

function LevelBadge({ level }) {
  const color = useMemo(() => {
    switch ((level || '').toUpperCase()) {
      case 'ERROR':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'DEBUG':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300'; // INFO
    }
  }, [level]);
  return <span className={`px-2 py-0.5 text-xs rounded border ${color}`}>{level}</span>;
}

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('');
  const [source, setSource] = useState('');
  const [limit, setLimit] = useState(200);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (level) params.append('level', level);
      if (source) params.append('source', source);
      if (limit) params.append('limit', String(limit));

      const res = await fetch(`/api/logs?${params.toString()}`);
      if (!res.ok) throw new Error('Falha ao buscar logs');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Logs do Sistema</h1>
        <div className="flex items-center gap-2">
          <button onClick={fetchLogs} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Atualizar</button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nível</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">Todos</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
              <option value="DEBUG">DEBUG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Origem</label>
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="ex: channels" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Limite</label>
            <input type="number" min={1} max={1000} value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex items-end">
            <button onClick={fetchLogs} className="w-full px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Filtrar</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Data/Hora</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Nível</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Origem</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Mensagem</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">Carregando...</td>
                </tr>
              )}
              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">Sem logs para exibir</td>
                </tr>
              )}
              {!loading && logs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2"><LevelBadge level={log.level} /></td>
                  <td className="px-4 py-2 text-sm text-gray-700">{log.source || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
