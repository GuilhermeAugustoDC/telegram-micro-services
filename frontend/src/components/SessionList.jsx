import { useNavigate } from 'react-router-dom';

const SessionList = ({ sessions, onSessionDeleted }) => {
	const navigate = useNavigate();
	const handleDownload = (phoneNumber) => {
		window.location.href = `/api/sessions/download/${phoneNumber}`;
	};

	const handleDelete = async (sessionId) => {
		if (!window.confirm('Deseja realmente apagar esta sessão?')) return;
		try {
			const response = await fetch(`/api/sessions/${sessionId}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Erro ao apagar sessão');
			alert('Sessão apagada com sucesso!');
			if (onSessionDeleted) onSessionDeleted();
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md mt-8'>
			<h3 className='text-xl font-bold mb-4'>Sessões Salvas</h3>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Número de Telefone
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Ações
							</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{sessions.map((session) => (
							<tr key={session.id}>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
									{session.phone_number}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
																		<button
										onClick={() => handleDownload(session.phone_number)}
										className='text-blue-600 hover:text-blue-800'
									>
										Baixar
									</button>
									<button
										onClick={() => handleDelete(session.id)}
										className='text-red-600 hover:text-red-800'
									>
										Apagar
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

export default SessionList;
