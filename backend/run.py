import uvicorn
import sys
from pathlib import Path

# Adiciona o diretório 'backend' ao path para que as importações absolutas funcionem
sys.path.insert(0, str(Path(__file__).parent))

from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.api.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
