import { useState } from 'react';

const AutomationForm = ({ onAutomationCreated }) => {
	const [automationName, setAutomationName] = useState('');
	const [sourceChatId, setSourceChatId] = useState('');
	const [destinationChatIds, setDestinationChatIds] = useState('');
	const [sessionId, setSessionId] = useState(''); // Novo estado

	const handleSubmit = async (e) => {
		e.preventDefault();
		const destinationIds = destinationChatIds
			.split('\n')
			.map((id) => id.trim())
			.filter((id) => id);

		try {
			const response = await fetch('/api/automations/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: automationName,
					source_chat_id: sourceChatId,
					destination_chat_ids: destinationIds,
					destination_chats: destinationIds,
					session_id: Number(sessionId),
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || 'Falha ao criar automação');
			}

			// Limpa o formulário e atualiza a lista
			setAutomationName('');
			setSourceChatId('');
			setDestinationChatIds('');
			onAutomationCreated();
			setSessionId('');
			alert('Automação criada com sucesso!');
		} catch (error) {
			console.error(error);
			alert(`Erro: ${error.message}`);
		}
	};

	return (
		<div className='bg-blue-800 p-6 rounded-lg shadow-xl mb-6'>
			<h3 className='text-2xl font-extrabold pb-4 text-blue-100 text-center tracking-wide drop-shadow'>
				Criar Nova Automação
			</h3>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label
						htmlFor='automationName'
						className='block text-base font-semibold text-white mb-2 tracking-wide'
					>
						Nome da Automação
					</label>
					<input
						type='text'
						id='automationName'
						value={automationName}
						onChange={(e) => setAutomationName(e.target.value)}
						required
						className='w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition'
					/>
				</div>
				<div>
					<label
						htmlFor='sourceChatId'
						className='block text-base font-semibold text-white mb-2 tracking-wide'
					>
						ID do Grupo/Canal de Origem
					</label>
					<input
						type='text'
						id='sourceChatId'
						value={sourceChatId}
						onChange={(e) => setSourceChatId(e.target.value)}
						required
						className='w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition'
					/>
				</div>
				<div>
					<label
						htmlFor='destinationChatIds'
						className='block text-base font-semibold text-white mb-2 tracking-wide'
					>
						IDs dos Grupos/Canais de Destino
					</label>
					<textarea
						id='destinationChatIds'
						rows='3'
						value={destinationChatIds}
						onChange={(e) => setDestinationChatIds(e.target.value)}
						required
						className='w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition'
					></textarea>
				</div>
				<button
					type='submit'
					className='w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg font-bold tracking-wide shadow-md hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition'
				>
					Criar Automação
				</button>
			</form>
		</div>
	);
};

export default AutomationForm;
