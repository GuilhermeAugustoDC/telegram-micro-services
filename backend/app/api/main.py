from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.models.database import create_tables
from app.api.routes import automations, sessions

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Garante que o diretório de sessões existe
    os.makedirs("sessions", exist_ok=True)
    # Cria as tabelas do banco de dados
    create_tables()
    print("Startup complete. Database tables created and sessions directory ensured.")
    yield
    # Código para rodar no shutdown (se necessário)
    print("Shutdown complete.")

app = FastAPI(
    title="Telegram Automation API",
    description="API para automação de encaminhamento de mensagens do Telegram",
    lifespan=lifespan,
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os roteadores
app.include_router(automations.router, prefix="/api", tags=["Automations"])
app.include_router(sessions.router, prefix="/api", tags=["Sessions"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
