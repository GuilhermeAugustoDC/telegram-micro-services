# Telegram Micro Services - Automação de Mensagens

Este é um projeto de automação para encaminhar mensagens entre grupos e canais do Telegram, construído com uma arquitetura moderna de micros serviços.

## 🚀 Arquitetura

O projeto é dividido em duas partes principais:

-   **Backend**: Uma API RESTful construída com **FastAPI** (Python), responsável por toda a lógica de negócio, gerenciamento de automações, comunicação com a API do Telegram e persistência de dados.
-   **Frontend**: Uma Single-Page Application (SPA) desenvolvida com **React**, **Vite** e **Tailwind CSS**, que consome a API do backend para fornecer uma interface de usuário rica e interativa.

## 🏗️ Estrutura do Projeto

```
telegram-micro-services/
├── backend/                # Aplicação Backend (FastAPI)
│   ├── app/
│   ├── sessions/
│   ├── .env
│   └── requirements.txt
├── frontend/               # Aplicação Frontend (React)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── venv/                   # Ambiente virtual Python
└── README.md               # Este arquivo
```

## 📋 Pré-requisitos

-   Python 3.8+
-   Node.js 18+ e npm
-   Conta de desenvolvedor do Telegram (API ID e API HASH)

---

## 🛠️ Instalação e Execução

Para rodar o projeto, você precisará iniciar o backend e o frontend em terminais separados.

### 1. Backend (API FastAPI)

a. **Navegue até o diretório do backend:**
```sh
cd backend
```

b. **Crie e configure o ambiente virtual:**
```sh
# Crie o ambiente (se ainda não existir)
python -m venv ../venv

# Ative o ambiente
# Windows (PowerShell):
..\venv\Scripts\Activate.ps1
# Linux/macOS:
source ../venv/bin/activate
```

c. **Instale as dependências Python:**
```sh
pip install -r requirements.txt
```

d. **Configure as variáveis de ambiente:**
   - Renomeie o arquivo `backend/.env.example` para `backend/.env`.
   - Edite o arquivo `.env` com suas credenciais da API do Telegram (`API_ID` e `API_HASH`).

e. **Inicie o servidor backend:**
```sh
python run.py
```
O backend estará rodando em `http://localhost:8000`.

### 2. Frontend (Aplicação React)

a. **Abra um novo terminal e navegue até o diretório do frontend:**
```sh
cd frontend
```

b. **Instale as dependências do Node.js:**
```sh
npm install
```

c. **Inicie o servidor de desenvolvimento:**
```sh
npm run dev
```
A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

## 📝 Como Obter as Credenciais da API do Telegram

1.  Acesse https://my.telegram.org/
2.  Faça login com sua conta do Telegram
3.  Vá para "API development tools"
4.  Preencha o formulário para criar um novo aplicativo
5.  Anote o `api_id` e `api_hash` gerados para usar no arquivo `.env` do backend.
