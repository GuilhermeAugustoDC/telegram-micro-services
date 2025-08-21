import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSession = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    apiId: '',
    apiHash: '',
    phoneNumber: ''
  });
  const [step, setStep] = useState('credentials'); // credentials, code, password, done, error
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const ws = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startSessionGeneration = () => {
    setLoading(true);
    console.log('Iniciando criação de sessão...');
    
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    ws.current = new WebSocket(`${wsProtocol}//${wsHost}/api/ws/generate_session`);

    ws.current.onopen = () => {
      console.log('WebSocket conectado');
      ws.current.send(JSON.stringify({
        type: 'start',
        api_id: parseInt(formData.apiId),
        api_hash: formData.apiHash,
        phone_number: formData.phoneNumber,
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensagem recebida:', data);
      
      setMessage(data.message);
      
      if (data.status === 'prompt') {
        setStep(data.message.includes('código') ? 'code' : 'password');
        setLoading(false);
      } else if (data.status === 'success') {
        setStep('done');
        setLoading(false);
        // Navegar de volta para home após 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else if (data.status === 'error') {
        setStep('error');
        setLoading(false);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket desconectado');
      setLoading(false);
    };

    ws.current.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      setMessage('Erro na conexão com o servidor. Certifique-se que o backend está rodando na porta 8000.');
      setStep('error');
      setLoading(false);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 'credentials') {
      startSessionGeneration();
    } else {
      setLoading(true);
      ws.current.send(JSON.stringify({ 
        value: inputValue 
      }));
      setInputValue('');
    }
  };

  const resetForm = () => {
    setFormData({
      apiId: '',
      apiHash: '',
      phoneNumber: ''
    });
    setStep('credentials');
    setMessage('');
    setInputValue('');
    setLoading(false);
    if (ws.current) {
      ws.current.close();
    }
  };

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <main className="container mx-auto p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-800 p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-100">
                Criar Nova Sessão
              </h2>
              <button
                onClick={() => navigate('/')}
                className="text-blue-200 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {step === 'credentials' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    API ID
                  </label>
                  <input
                    type="text"
                    name="apiId"
                    value={formData.apiId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Digite seu API ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    API Hash
                  </label>
                  <input
                    type="text"
                    name="apiHash"
                    value={formData.apiHash}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Digite seu API Hash"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Número de Telefone
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="+5511999999999"
                    required
                  />
                  <p className="text-xs text-blue-200 mt-1">
                    Inclua o código do país (ex: +55 para Brasil)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Conectando...' : 'Criar Sessão'}
                </button>
              </form>
            )}

            {step !== 'credentials' && (
              <div className="space-y-4">
                <div className="bg-blue-700 p-4 rounded">
                  <p className="text-blue-100">{message}</p>
                </div>

                {(step === 'code' || step === 'password') && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        {step === 'code' ? 'Código SMS' : 'Senha 2FA'}
                      </label>
                      <input
                        type={step === 'password' ? 'password' : 'text'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder={step === 'code' ? 'Digite o código recebido' : 'Digite sua senha'}
                        required
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Enviando...' : 'Confirmar'}
                    </button>
                  </form>
                )}

                {step === 'done' && (
                  <div className="text-center space-y-4">
                    <div className="text-green-300 text-lg font-medium">
                      ✅ Sessão criada com sucesso!
                    </div>
                    <p className="text-blue-200 text-sm">
                      Redirecionando para a página inicial...
                    </p>
                  </div>
                )}

                {step === 'error' && (
                  <div className="space-y-4">
                    <div className="text-red-300 font-medium">
                      ❌ Erro ao criar sessão
                    </div>
                    <button
                      onClick={resetForm}
                      className="w-full bg-gray-600 text-white py-3 px-4 rounded font-medium hover:bg-gray-700 transition-colors"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                )}

                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded font-medium hover:bg-gray-700 transition-colors"
                >
                  Voltar
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 bg-blue-700 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Como obter API ID e Hash:</h3>
            <ol className="text-blue-200 text-sm space-y-1">
              <li>1. Acesse https://my.telegram.org</li>
              <li>2. Faça login com seu número</li>
              <li>3. Vá em "API Development Tools"</li>
              <li>4. Crie um novo app</li>
              <li>5. Copie o API ID e API Hash</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateSession;
