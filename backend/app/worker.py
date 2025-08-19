import asyncio
import logging
import signal
import sys
from pathlib import Path

# Configuração do logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("worker.log")],
)
logger = logging.getLogger(__name__)

# Adiciona o diretório raiz ao path para importações
sys.path.append(str(Path(__file__).parent.parent))

from app.workers.telegram_worker import TelegramWorker
from app.config import settings


def handle_shutdown(sig, frame):
    logger.info("Recebido sinal de desligamento. Encerrando...")
    if "worker" in globals():
        asyncio.create_task(worker.stop())
    sys.exit(0)


async def main():
    global worker

    # Configura os manipuladores de sinal
    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)

    logger.info("Iniciando o worker do Telegram...")

    try:
        worker = TelegramWorker()
        await worker.initialize()

        # Mantém o worker rodando
        while True:
            await asyncio.sleep(1)

    except asyncio.CancelledError:
        logger.info("Worker cancelado")
    except Exception as e:
        logger.error(f"Erro no worker: {str(e)}", exc_info=True)
    finally:
        if "worker" in globals():
            await worker.stop()
        logger.info("Worker encerrado")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Worker interrompido pelo usuário")
    except Exception as e:
        logger.error(f"Erro fatal: {str(e)}", exc_info=True)
        sys.exit(1)
