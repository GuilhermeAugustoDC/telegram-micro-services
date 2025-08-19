from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.automation import Automation, AutomationCreate
from app.models.database import Automation as AutomationModel, Chat, UserSession
from app.api.dependencies import get_db

router = APIRouter()

@router.post("/automations/", response_model=Automation)
async def create_automation(
    automation: AutomationCreate, db: Session = Depends(get_db)
):
    """Cria uma nova automação"""
    db_session = (
        db.query(UserSession).filter(UserSession.id == automation.session_id).first()
    )
    if not db_session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")

    db_automation = AutomationModel(
        name=automation.name,
        source_chat_id=automation.source_chat_id,
        is_active=False,
        session_id=automation.session_id,
    )

    for chat_id in automation.destination_chats:
        chat = db.query(Chat).filter(Chat.chat_id == chat_id).first()
        if not chat:
            chat = Chat(chat_id=chat_id)
            db.add(chat)
        db_automation.destination_chats.append(chat)

    db.add(db_automation)
    db.commit()
    db.refresh(db_automation)

    return db_automation


@router.get("/automations/", response_model=List[Automation])
async def list_automations(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Lista todas as automações"""
    automations = db.query(AutomationModel).offset(skip).limit(limit).all()
    return automations


@router.put("/automations/{automation_id}/start")
async def start_automation(automation_id: int, db: Session = Depends(get_db)):
    """Inicia uma automação"""
    automation = (
        db.query(AutomationModel).filter(AutomationModel.id == automation_id).first()
    )
    if not automation:
        raise HTTPException(status_code=404, detail="Automação não encontrada")

    automation.is_active = True
    db.commit()

    return {"message": f"Automação {automation_id} iniciada com sucesso"}


@router.put("/automations/{automation_id}/stop")
async def stop_automation(automation_id: int, db: Session = Depends(get_db)):
    """Para uma automação"""
    automation = (
        db.query(AutomationModel).filter(AutomationModel.id == automation_id).first()
    )
    if not automation:
        raise HTTPException(status_code=404, detail="Automação não encontrada")

    automation.is_active = False
    db.commit()

    return {"message": f"Automação {automation_id} parada com sucesso"}
