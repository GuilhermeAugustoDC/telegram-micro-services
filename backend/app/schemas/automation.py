from pydantic import BaseModel
from typing import List
from datetime import datetime

class AutomationBase(BaseModel):
    name: str
    source_chat_id: str
    destination_chats: List[str]
    session_id: int

class AutomationCreate(AutomationBase):
    pass

class Automation(AutomationBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
