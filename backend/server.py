from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import subprocess
import aiohttp

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class TerminalCommand(BaseModel):
    command: str

class TerminalResponse(BaseModel):
    output: str
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AIMessage(BaseModel):
    message: str
    role: str = "user"  # user or assistant

class AIResponse(BaseModel):
    response: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Module(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    status: str = "inactive"  # active, inactive, pending
    config: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ModuleCreate(BaseModel):
    name: str
    description: str
    config: Dict[str, Any] = Field(default_factory=dict)

# Terminal Endpoints
@api_router.post("/terminal/execute", response_model=TerminalResponse)
async def execute_terminal_command(cmd: TerminalCommand):
    """Execute bash commands in the terminal"""
    try:
        result = subprocess.run(
            cmd.command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        # Save to history
        history_doc = {
            "command": cmd.command,
            "output": result.stdout,
            "error": result.stderr if result.stderr else None,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.terminal_history.insert_one(history_doc)
        
        return TerminalResponse(
            output=result.stdout,
            error=result.stderr if result.stderr else None
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Command timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/terminal/history")
async def get_terminal_history(limit: int = 50):
    """Get terminal command history"""
    history = await db.terminal_history.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    return history

# AI Endpoints
@api_router.post("/ai/chat", response_model=AIResponse)
async def chat_with_ai(msg: AIMessage):
    """Chat with Ollama AI"""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3.2:1b",
                    "prompt": msg.message,
                    "stream": False
                }
            ) as resp:
                if resp.status != 200:
                    raise HTTPException(status_code=500, detail="Ollama AI error")
                
                data = await resp.json()
                response_text = data.get("response", "")
                
                # Save conversation
                conversation_doc = {
                    "user_message": msg.message,
                    "ai_response": response_text,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
                await db.ai_conversations.insert_one(conversation_doc)
                
                return AIResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/ai/history")
async def get_ai_history(limit: int = 50):
    """Get AI conversation history"""
    history = await db.ai_conversations.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    return history

# Module Endpoints
@api_router.post("/modules", response_model=Module)
async def create_module(module_input: ModuleCreate):
    """Create a new module"""
    module = Module(**module_input.model_dump())
    doc = module.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.modules.insert_one(doc)
    return module

@api_router.get("/modules", response_model=List[Module])
async def get_modules():
    """Get all modules"""
    modules = await db.modules.find({}, {"_id": 0}).to_list(1000)
    for mod in modules:
        if isinstance(mod.get('created_at'), str):
            mod['created_at'] = datetime.fromisoformat(mod['created_at'])
        if isinstance(mod.get('updated_at'), str):
            mod['updated_at'] = datetime.fromisoformat(mod['updated_at'])
    return modules

@api_router.patch("/modules/{module_id}")
async def update_module(module_id: str, status: Optional[str] = None, config: Optional[Dict[str, Any]] = None):
    """Update module status or config"""
    update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if status:
        update_data["status"] = status
    if config:
        update_data["config"] = config
    
    result = await db.modules.update_one({"id": module_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module updated"}

@api_router.delete("/modules/{module_id}")
async def delete_module(module_id: str):
    """Delete a module"""
    result = await db.modules.delete_one({"id": module_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module deleted"}

# Health check
@api_router.get("/")
async def root():
    return {"message": "Finanzas Brillantes API - Sistema Soberano"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()