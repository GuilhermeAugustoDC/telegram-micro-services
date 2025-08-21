# Telegram MicroSaaS - Sistema de Automação de Mensagens

Sistema completo de automação para encaminhamento de mensagens entre canais e grupos do Telegram, com interface web moderna e funcionalidades avançadas de cache e logs.

## ✨ Funcionalidades

- 🔄 **Automações de Encaminhamento** - Configure encaminhamento automático entre múltiplos canais
- 🗂️ **Gerenciamento de Sessões** - Crie e gerencie sessões do Telegram via interface web
- 📋 **Cache Inteligente de Canais** - Sistema de cache com busca incremental para novos canais
- 📊 **Sistema de Logs** - Visualização completa de logs e atividades do sistema
- 🎨 **Interface Moderna** - Dashboard responsivo com Tailwind CSS
- 🔍 **Busca Incremental** - Adicione novos canais sem recarregar toda a lista

## 🚀 Arquitetura

**Backend**: FastAPI (Python) + SQLite + Pyrogram para integração Telegram
**Frontend**: React + Vite + Tailwind CSS + React Router

## 🏗️ Estrutura do Projeto

```
telegram-micro-services/
├── backend/                # Backend FastAPI
│   ├── app/
│   │   ├── api/           # Rotas da API
│   │   ├── models/        # Modelos do banco de dados
│   │   ├── schemas/       # Schemas Pydantic
│   │   ├── static/        # Arquivos estáticos (fotos de perfil)
│   │   └── utils/         # Utilitários (logger)
│   ├── sessions/          # Sessões do Telegram
│   ├── start.ps1          # Script PowerShell para iniciar backend
│   ├── .env.example       # Exemplo de configuração
│   └── requirements.txt   # Dependências Python
├── frontend/              # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   └── layouts/       # Layouts
│   ├── start.ps1          # Script PowerShell para iniciar frontend
│   ├── package.json       # Dependências Node.js
│   └── vite.config.js     # Configuração Vite
├── venv/                  # Ambiente virtual Python (raiz)
└── README.md              # Este arquivo
```

## 📋 Pré-requisitos

-   Python 3.8+
-   Node.js 18+ e npm
-   Conta de desenvolvedor do Telegram (API ID e API HASH)

---

## 🛠️ Instalação e Execução

### 🚀 Execução Rápida (Recomendado)

Utilizamos scripts PowerShell para facilitar a execução:

#### **Backend:**
```powershell
cd backend
.\start.ps1
```

#### **Frontend:**
```powershell
cd frontend  
.\start.ps1
```

### 📦 Instalação Manual

#### **1. Configuração Inicial**

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd telegram-micro-services

# Crie o ambiente virtual na raiz
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
```

#### **2. Backend (FastAPI)**

```bash
cd backend

# Instale as dependências
pip install -r requirements.txt

# Configure o arquivo .env (opcional)
# cp .env.example .env
# Edite .env com suas credenciais se necessário

# Inicie o servidor
python -m uvicorn app.api.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend disponível em:** `http://localhost:8000`
**API Docs:** `http://localhost:8000/docs`

#### **3. Frontend (React + Vite)**

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

**Frontend disponível em:** `http://localhost:5173`

## 🎯 Como Usar o Sistema

### **1. Primeira Configuração**
1. Acesse `http://localhost:5173` após iniciar frontend e backend
2. Vá em **"Sessões"** → **"Criar Nova Sessão"**
3. Insira suas credenciais da API do Telegram (veja seção abaixo)
4. Complete o processo de autenticação (SMS + 2FA se necessário)

### **2. Gerenciando Canais**
- Acesse **"Listar Canais"** no menu lateral
- Selecione uma sessão para ver seus canais/grupos
- Use **"🔄 Atualizar Tudo"** para recarregar a lista completa
- Use **"➕ Buscar Novos"** para adicionar apenas canais recém-entrados

### **3. Criando Automações**
- Na página "Listar Canais", clique nos botões **"+ Origem"** e **"+ Destino"**
- Configure o nome da automação
- Ative/desative automações na página **"Automações"**

### **4. Monitoramento**
- Acesse **"Logs do Sistema"** para ver atividades em tempo real
- Visualize cache de canais, erros e sucessos das operações

## 📝 Credenciais da API do Telegram

1. Acesse https://my.telegram.org/
2. Faça login com sua conta do Telegram
3. Vá para "API development tools"
4. Preencha o formulário para criar um novo aplicativo
5. Anote o `api_id` e `api_hash` para usar na criação da sessão

## 🔧 Tecnologias Utilizadas

**Backend:**
- FastAPI - Framework web moderno para Python
- Pyrogram - Cliente Telegram assíncrono
- SQLAlchemy - ORM para banco de dados
- SQLite - Banco de dados local
- Pydantic - Validação de dados

**Frontend:**
- React 18 - Biblioteca para interfaces
- Vite - Build tool rápido
- Tailwind CSS - Framework CSS utilitário
- React Router - Roteamento SPA
- React Icons - Ícones

## 📊 Funcionalidades Técnicas

- ✅ **Cache Inteligente** - Sistema de cache com TTL para canais
- ✅ **Busca Incremental** - Adiciona novos canais sem recarregar
- ✅ **Sistema de Logs** - Logging completo com interface web
- ✅ **Sessões Persistentes** - Gerenciamento automático de sessões Telegram
- ✅ **Interface Responsiva** - Funciona em desktop e mobile
- ✅ **API RESTful** - Documentação automática com FastAPI

## 🚀 Deploy e Produção

Para deploy em produção, considere:
- Usar PostgreSQL ao invés de SQLite
- Configurar variáveis de ambiente adequadas
- Usar serviços como Heroku, Railway ou VPS
- Configurar proxy reverso (Nginx)
- Implementar HTTPS
