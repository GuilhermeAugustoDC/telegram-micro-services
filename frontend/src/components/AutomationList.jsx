const AutomationList = ({ automations, onToggleAutomation, onDeleteAutomation }) => {

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Automações Criadas</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {automations.map((auto) => (
              <tr key={auto.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{auto.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${auto.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {auto.is_active ? 'Rodando' : 'Parado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    onClick={() => onToggleAutomation(auto.id, auto.is_active)}
                    className={`text-white py-1 px-3 rounded ${auto.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {auto.is_active ? 'Parar' : 'Iniciar'}
                  </button>
                  <button 
                    onClick={() => window.open(`/media-viewer/${auto.id}`, '_blank')}
                    className="text-white py-1 px-3 rounded bg-blue-500 hover:bg-blue-600">
                    Ver Mídias
                  </button>
                  <button 
                    onClick={() => onDeleteAutomation(auto.id)}
                    className="text-white py-1 px-3 rounded bg-red-600 hover:bg-red-700">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutomationList;
