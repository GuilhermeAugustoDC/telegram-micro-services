import { useState } from 'react';

const SessionUploader = ({ onSessionUploaded }) => {
	const [phoneNumber, setPhoneNumber] = useState('');
	const [sessionFile, setSessionFile] = useState(null);

	const handleFileChange = (e) => {
		setSessionFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!sessionFile) {
			alert('Por favor, selecione um arquivo de sessão.');
			return;
		}
		const formData = new FormData();
		formData.append('phone_number', phoneNumber);
		formData.append('session_file', sessionFile);

		try {
			const response = await fetch('/api/sessions/', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || 'Falha ao enviar sessão');
			}

			// Limpa o formulário e atualiza a lista
			setPhoneNumber('');
			setSessionFile(null);
			document.getElementById('sessionFile').value = ''; // Limpa o input de arquivo
			onSessionUploaded();
			alert('Sessão enviada com sucesso!');
		} catch (error) {
			console.error(error);
			alert(`Erro: ${error.message}`);
		}
	};

	return (
		<div className='bg-blue-800 p-6 rounded-lg shadow-xl mb-6'>
			<h3 className='text-2xl font-extrabold pb-4 text-blue-100 text-center tracking-wide drop-shadow'>
				Fazer Upload de Sessão
			</h3>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label
						htmlFor='phoneNumberUpload'
						className='block text-base font-semibold text-white mb-2 tracking-wide'
					>
						Número de Telefone
					</label>
					<input
						type='text'
						id='phoneNumberUpload'
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						required
						className='w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition'
					/>
				</div>
				<div>
					<label
						htmlFor='sessionFile'
						className='block text-base font-semibold text-white mb-2 tracking-wide'
					>
						Arquivo .session
					</label>
					<div
						className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md bg-blue-50 px-4 py-6 cursor-pointer transition hover:border-blue-400 hover:bg-blue-100`}
						onClick={() => document.getElementById('sessionFile').click()}
					>
						<input
							type="file"
							id="sessionFile"
							onChange={handleFileChange}
							required
							accept=".session"
							className="hidden"
						/>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12l8-8 8 8M12 4v12" />
						</svg>
						<span className="text-blue-700 font-semibold mb-1">
							Clique ou arraste para selecionar
						</span>
						<span className={`text-sm ${sessionFile ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
							{sessionFile ? sessionFile.name : 'Nenhum arquivo selecionado'}
						</span>
					</div>
				</div>
				<button
					type='submit'
					className='w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg font-bold tracking-wide shadow-md hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition'
				>
					Fazer Upload
				</button>
			</form>
		</div>
	);
};

export default SessionUploader;

