import { useState, useEffect } from 'react';
import Header from '../components/Header';
import AutomationForm from '../components/AutomationForm';
import SessionUploader from '../components/SessionUploader';
import InteractiveSession from '../components/InteractiveSession';
import AutomationList from '../components/AutomationList';
import SessionList from '../components/SessionList';

const Home = () => {
	const [automations, setAutomations] = useState([]);
	const [sessions, setSessions] = useState([]);

	const fetchAutomations = async () => {
		try {
			const response = await fetch('/api/automations/');
			if (!response.ok) {
				throw new Error('Falha ao buscar automações');
			}
			const data = await response.json();
			setAutomations(data);
		} catch (error) {
			console.error(error);
			alert(`Erro: ${error.message}`);
		}
	};

	const fetchSessions = async () => {
		try {
			const response = await fetch('/api/sessions/');
			if (!response.ok) {
				throw new Error('Falha ao buscar sessões');
			}
			const data = await response.json();
			setSessions(data);
		} catch (error) {
			console.error(error);
			alert(`Erro: ${error.message}`);
		}
	};

	useEffect(() => {
		fetchAutomations();
		fetchSessions();
	}, []);

	const handleToggleAutomation = async (id, isRunning) => {
		const action = isRunning ? 'stop' : 'start';
		try {
			const response = await fetch(`/api/automations/${id}/${action}`, {
				method: 'POST',
			});
			if (!response.ok) {
				throw new Error(`Falha ao ${action} a automação`);
			}
			fetchAutomations(); // Recarrega a lista para refletir a mudança de estado
		} catch (error) {
			console.error(error);
			alert(`Erro: ${error.message}`);
		}
	};

	return (
		<div>
			<Header />
			<main className='container mx-auto p-4 bg-blue-400'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<div className='space-y-6'>
						<AutomationForm onAutomationCreated={fetchAutomations} />
						<SessionUploader onSessionUploaded={fetchSessions} />
						<InteractiveSession />
					</div>
					<div>
						<AutomationList
							automations={automations}
							onToggleAutomation={handleToggleAutomation}
						/>
						<SessionList sessions={sessions} />
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
