# Archivo principal de la API RAG (Generación Aumentada por Recuperación)
# Usa FastAPI para servir las peticiones del monitor web.

import os
from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware # CORRECCIÓN: Usar starlette directamente
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage

# --- CONFIGURACIÓN E INICIALIZACIÓN DE LA API ---

# Clave de API. Se asume que se configura como un secreto de Codespaces.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Inicialización de la API
app = FastAPI(title="Nexus Open Source AI API RAG Core")

# Configuración de CORS para permitir peticiones desde el monitor web (cualquier origen)
origins = ["*"] # Permitir todo por ahora

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos para la pregunta del usuario
class Query(BaseModel):
    user_id: str
    question: str

# Inicialización diferida de componentes RAG
vectorstore = None
rag_chain = None

# --- FUNCIÓN DE INICIALIZACIÓN RAG ---

def initialize_rag():
    global vectorstore, rag_chain
    
    if not GEMINI_API_KEY:
        print("ERROR: Clave GEMINI_API_KEY no encontrada.")
        return False
        
    print("Inicializando componentes RAG...")
    
    # 1. Carga de Documentos (de la carpeta 'docs' y archivos markdown en la raíz)
    loader = DirectoryLoader(
        ".", 
        glob="**/*.md", 
        loader_cls=None,
        recursive=True
    )
    documents = loader.load()
    
    # 2. División de Texto (Chunking)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)
    
    # 3. Embeddings (Modelo Open-Source)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # 4. Base de Datos Vectorial (ChromaDB)
    vectorstore = Chroma.from_documents(texts, embeddings, persist_directory="./chroma_db")
    
    # 5. Modelo LLM (Generación - Usando Gemini Flash por velocidad y capacidad)
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3, api_key=GEMINI_API_KEY)

    # 6. Retriever y Chain RAG
    retriever = vectorstore.as_retriever()
    
    # Prompt para dar contexto a la IA (El monitor de código abierto)
    custom_system_prompt = (
        "Eres Nexus, un asistente de IA experto en código abierto y GitHub. Tu objetivo es responder "
        "preguntas basadas ÚNICAMENTE en el contexto de tu base de conocimiento proporcionada. "
        "Si la respuesta no está en el contexto, simplemente indica que no tienes esa información "
        "específica en tu documentación. Mantén un tono técnico y profesional. "
        "Contexto de la documentación: {context}"
    )
    
    # Crea el historial de chat simulado (solo para el prompt, ya que ConversationalRetrievalChain maneja el historial)
    system_message = SystemMessage(content=custom_system_prompt)
    
    rag_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        return_source_documents=False, # Podríamos cambiar a True para citación
        # No usamos el prompt directamente aquí, pero el retriever inyecta el contexto.
    )
    
    print("✅ Inicialización RAG completa. Cerebro Nexus listo.")
    return True

# Llama a la inicialización al inicio de la aplicación
is_rag_ready = initialize_rag()

# ---------------------------------------------------------------------
# ENDPOINT PRINCIPAL
# ---------------------------------------------------------------------

# Endpoint de verificación de estado
@app.get("/api/status")
async def get_status():
    return {"status": "ok" if is_rag_ready else "error", "message": "RAG Core is ready" if is_rag_ready else "API Key Missing or RAG initialization failed"}


# Endpoint principal para la interacción de la IA
@app.post("/api/ask")
async def ask_ai(query: Query):
    if not is_rag_ready:
        raise HTTPException(
            status_code=503, 
            detail="Nexus RAG Core está fuera de línea. Por favor, asegúrese de que GEMINI_API_KEY esté configurada."
        )

    # El ConversationalRetrievalChain espera un historial y una pregunta.
    # Como es un chat simple, simulamos un historial vacío por ahora.
    try:
        result = rag_chain.invoke({
            "question": query.question, 
            "chat_history": [] # Se podría implementar historial real aquí
        })
        
        response_text = result["answer"]
        return {"response": response_text}
        
    except Exception as e:
        print(f"Error al procesar la query RAG: {e}")
        raise HTTPException(status_code=500, detail="Error interno al procesar la IA. Verifique los logs.")
