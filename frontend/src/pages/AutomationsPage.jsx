import { useState, useEffect } from 'react';
import AutomationList from '../components/AutomationList';

const AutomationsPage = () => {
    const [automations, setAutomations] = useState([]);
    
    const fetchAutomations = async () => {
        try {
            const response = await fetch('/api/automations/');
            if (!response.ok) throw new Error('Falha ao buscar automações');
            const data = await response.json();
            setAutomations(data);
        } catch (error) {
            console.error(error);
            alert(`Erro: ${error.message}`);
        }
    };

    
    useEffect(() => {
        fetchAutomations();
            }, []);

    const handleToggleAutomation = async (id, isRunning) => {
        const action = isRunning ? 'stop' : 'start';
        try {
            const response = await fetch(`/api/automations/${id}/${action}`, { method: 'PUT' });
            if (!response.ok) throw new Error(`Falha ao ${action} a automação`);
            fetchAutomations();
        } catch (error) {
            console.error(error);
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDeleteAutomation = async (id) => {
        if (!window.confirm('Deseja realmente remover esta automação?')) return;
        try {
            const response = await fetch(`/api/automations/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao remover a automação');
            fetchAutomations();
            alert('Automação removida com sucesso!');
        } catch (error) {
            console.error(error);
            alert(`Erro: ${error.message}`);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gerenciar Automações</h1>
            <div>
                <AutomationList
                    automations={automations}
                    onToggleAutomation={handleToggleAutomation}
                    onDeleteAutomation={handleDeleteAutomation}
                />
            </div>
        </div>
    );
};

export default AutomationsPage;
