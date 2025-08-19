from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime,
    Table,
    UniqueConstraint,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv() # .env file is now at the backend root

Base = declarative_base()

# Tabela de associação para relacionamento muitos-para-muitos
automation_destinations = Table(
    "automation_destinations",
    Base.metadata,
    Column("id", Integer, primary_key=True),
    Column("automation_id", Integer, ForeignKey("automations.id", ondelete="CASCADE")),
    Column("chat_id", String(255), ForeignKey("chats.chat_id", ondelete="CASCADE")),
    UniqueConstraint("automation_id", "chat_id", name="uix_automation_chat"),
)


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_file = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String(20), unique=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    automations = relationship("Automation", back_populates="session")


class Automation(Base):
    __tablename__ = "automations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    source_chat_id = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    session_id = Column(Integer, ForeignKey("user_sessions.id", ondelete="CASCADE"))
    session = relationship("UserSession", back_populates="automations")

    # Relacionamento muitos-para-muitos com destinos
    destination_chats = relationship(
        "Chat",
        secondary=automation_destinations,
        back_populates="automations",
        lazy="dynamic",
        cascade="all, delete",
        passive_deletes=True,
    )


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(255))
    is_channel = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    automations = relationship(
        "Automation",
        secondary=automation_destinations,
        back_populates="destination_chats",
        lazy="dynamic",
    )


# Configuração do banco de dados

# O diretório base do projeto agora é a pasta 'backend'
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Define o caminho do banco de dados dentro da pasta 'backend'
DB_NAME = "telegram_automation.db"
DB_PATH = str(BASE_DIR / DB_NAME)

# Usa o caminho absoluto para o SQLite
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# Garante que o diretório 'backend' existe (redundante, mas seguro)
os.makedirs(BASE_DIR, exist_ok=True)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
