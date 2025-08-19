import os
import asyncio
from pyrogram import Client, filters
from pyrogram.types import Message
import logging
from dotenv import load_dotenv

from ..models.database import (
    SessionLocal,
    UserSession,
    Automation,
    Chat,
    automation_destinations,
)

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Carrega as variáveis de ambiente
load_dotenv()


class TelegramWorker:
    def __init__(self):
        self.clients = {}
        self.db = SessionLocal()
        self.running = False

    async def initialize(self):
        """Inicializa o worker e carrega as sessões ativas"""
        self.running = True
        await self.load_sessions()
        logger.info("Worker inicializado")

    async def load_sessions(self):
        """Carrega as sessões ativas do banco de dados"""
        sessions = (
            self.db.query(UserSession).filter(UserSession.is_active).all()
        )

        for session in sessions:
            await self.start_client(session)

    async def start_client(self, session):
        """Inicia um cliente Pyrogram para uma sessão"""
        session_path = os.path.join("sessions", session.session_file)

        # Verifica se o arquivo de sessão existe
        if not os.path.exists(session_path):
            logger.error(f"Arquivo de sessão não encontrado: {session_path}")
            return

        try:
            # Cria o cliente Pyrogram
            client = Client(
                name=session_path.replace(".session", ""),
                api_id=os.getenv("API_ID"),
                api_hash=os.getenv("API_HASH"),
            )

            # Adiciona os handlers de mensagem
            self.add_handlers(client)

            # Inicia o cliente
            await client.start()
            self.clients[session.id] = client
            logger.info(f"Cliente iniciado para a sessão: {session.phone_number}")

            # As automações são carregadas dinamicamente quando necessário
            logger.info(f"Automações para a sessão {session.phone_number} serão carregadas sob demanda.")

        except Exception as e:
            logger.error(
                f"Erro ao iniciar cliente para {session.phone_number}: {str(e)}"
            )

    def add_handlers(self, client):
        """Adiciona os handlers de mensagem ao cliente"""

        @client.on_message(filters.group | filters.channel)
        async def handle_message(client: Client, message: Message):
            # Verifica se há automações ativas para este chat de origem
            db = SessionLocal()
            try:
                # Primeiro, busca as automações ativas para o chat de origem
                automations = (
                    db.query(Automation)
                    .filter(
                        Automation.source_chat_id == str(message.chat.id),
                        Automation.is_active,
                    )
                    .all()
                )

                # Para cada automação, carrega os chats de destino
                for automation in automations:
                    automation.destination_chats = (
                        db.query(Chat)
                        .join(
                            automation_destinations,
                            Chat.chat_id == automation_destinations.c.chat_id,
                        )
                        .filter(
                            automation_destinations.c.automation_id == automation.id
                        )
                        .all()
                    )

                    # Processa a automação com os chats de destino carregados
                    await self.process_automation(automation, message, client)

            except Exception as e:
                logger.error(f"Erro ao processar mensagem: {str(e)}", exc_info=True)
            finally:
                db.close()

    async def process_automation(
        self, automation: Automation, message: Message, client: Client
    ):
        """Processa uma mensagem de acordo com as regras da automação"""
        try:
            # Para cada chat de destino, encaminha a mensagem
            for chat in automation.destination_chats:
                try:
                    await message.forward(chat.chat_id)
                    logger.info(
                        f"Mensagem {message.id} encaminhada para {chat.chat_id}"
                    )
                except Exception as e:
                    logger.error(
                        f"Erro ao encaminhar mensagem para {chat.chat_id}: {str(e)}"
                    )

        except Exception as e:
            logger.error(f"Erro ao processar automação {automation.id}: {str(e)}")


    async def stop(self):
        """Para o worker e todos os clientes"""
        self.running = False
        for client in self.clients.values():
            try:
                await client.stop()
            except Exception as e:
                logger.error(f"Erro ao parar cliente: {str(e)}")

        self.db.close()
        logger.info("Worker parado")


# Função para iniciar o worker
async def start_worker():
    worker = TelegramWorker()
    try:
        await worker.initialize()
        # Mantém o worker rodando
        while worker.running:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        await worker.stop()
    except Exception as e:
        logger.error(f"Erro no worker: {str(e)}")
        await worker.stop()


if __name__ == "__main__":
    asyncio.run(start_worker())
