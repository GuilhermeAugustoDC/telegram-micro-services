import { useState, useRef } from 'react';

const InteractiveSession = () => {
	const [apiId, setApiId] = useState('');
	const [apiHash, setApiHash] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [step, setStep] = useState('credentials'); // credentials, code, password, done, error
	const [message, setMessage] = useState('');
	const [inputValue, setInputValue] = useState('');
	const ws = useRef(null);

	const startSessionGeneration = () => {
		ws.current = new WebSocket(
			`ws://${window.location.host}/api/ws/generate_session`
		);

		ws.current.onopen = () => {
			console.log('WebSocket connected');
			ws.current.send(
				JSON.stringify({
					api_id: apiId,
					api_hash: apiHash,
					phone_number: phoneNumber,
				})
			);
		};

		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setMessage(data.message);
			if (data.status === 'phone_code_needed') {
				setStep('code');
			} else if (data.status === 'password_needed') {
				setStep('password');
			} else if (data.status === 'success') {
				setStep('done');
				ws.current.close();
			} else if (data.status === 'error') {
				setStep('error');
				ws.current.close();
			}
		};

		ws.current.onclose = () => {
			console.log('WebSocket disconnected');
		};

		ws.current.onerror = (error) => {
			console.error('WebSocket error:', error);
			setMessage('Erro na conexão com o servidor.');
			setStep('error');
		};
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (step === 'credentials') {
			startSessionGeneration();
		} else {
			ws.current.send(JSON.stringify({ [step]: inputValue }));
			setInputValue('');
		}
	};

	return (
		<div className='bg-blue-800 p-6 rounded-lg shadow-xl mb-6'>
			<h3 className='text-2xl font-extrabold pb-4 text-blue-100 text-center tracking-wide drop-shadow'>
				Gerar Sessão Interativa
			</h3>
			{step === 'credentials' && (
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-4'>
						<div>
							<label
								htmlFor='apiId'
								className='block text-base font-semibold text-white mb-2 tracking-wide'
							>
								API ID
							</label>
							<input
								type='text'
								id='apiId'
								value={apiId}
								onChange={(e) => setApiId(e.target.value)}
								className='w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition'
								required
							/>
						</div>
						<div>
							<label
								htmlFor='apiHash'
								className='block text-base font-semibold text-white mb-2 tracking-wide'
							>
								API Hash
							</label>
							<input
								type='text'
								id='apiHash'
								value={apiHash}
								onChange={(e) => setApiHash(e.target.value)}
								className='w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition'
								required
							/>
						</div>
						<div>
							<label
								htmlFor='phoneNumber'
								className='block text-base font-semibold text-white mb-2 tracking-wide'
							>
								Número de Telefone (com código do país)
							</label>
							<input
								type='tel'
								id='phoneNumber'
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								placeholder='+5511999999999'
								className='w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition'
								required
							/>
						</div>
					</div>
					<button
						type='submit'
						className='w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-lg font-bold tracking-wide shadow-md hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition'
					>
						Iniciar
					</button>
				</form>
			)}
			{step !== 'credentials' && (
				<div>
					<p className='mb-2 text-blue-100'>{message}</p>
					{(step === 'code' || step === 'password') && (
						<form onSubmit={handleSubmit} className='flex space-x-2'>
							<input
								type={step === 'password' ? 'password' : 'text'}
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								className='w-full px-3 py-2 text-base rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300 transition'
								required
							/>
							<button
								type='submit'
								className='bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg font-bold tracking-wide shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition'
							>
								Enviar
							</button>
						</form>
					)}
				</div>
			)}
		</div>
	);
};

export default InteractiveSession;
