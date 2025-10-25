# Archivo principal de la API RAG (Generación Aumentada por Recuperación)
# Usa FastAPI para servir las peticiones del monitor web.

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleWARE
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

# --- CONFIGURACIÓN E INICIALIZACIÓN DE LA API ---

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
    chat_history: list = [] # Para el contexto de la conversación

# --- SISTEMA RAG CORE (CEREBRO DE LA IA) ---

# Variables globales para el RAG
CHROMA_PATH = "data/chroma_db"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    # Si la clave no está, lanzamos un error que se mostrará en el log.
    print("\n🚨 ERROR CRÍTICO: La variable GEMINI_API_KEY no está configurada. El LLM no funcionará.")
    LLM_READY = False
else:
    # 1. Modelo de Embeddings (Open-Source y Local)
    # Este modelo convierte nuestros documentos en vectores numéricos.
    EMBEDDINGS = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 2. Modelo de Lenguaje (LLM) para la generación (Simulación Open-Source + API)
    # Usamos Gemini Flash por su velocidad y capacidad de citación, simulando una IA Open Source de alto rendimiento.
    LLM = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash", 
        google_api_key=GEMINI_API_KEY, 
        temperature=0.3
    )
    
    LLM_READY = True

# ---------------------------------------------------------------------
# FUNCIÓN DE INICIALIZACIÓN DE DATOS (Solo se ejecuta una vez al inicio)
# ---------------------------------------------------------------------

def initialize_database():
    """Carga los documentos, los divide, vectoriza y almacena en ChromaDB."""
    
    if not os.path.exists(CHROMA_PATH):
        print("-> [RAG Core] Base de datos no encontrada. Iniciando carga de documentos...")
        
        # Carga de documentos (Lee todos los archivos .md y .txt en el repo)
        loader = DirectoryLoader(
            path='./', 
            glob="**/*.md", 
            loader_kwargs={'silent_errors': True} # Ignora errores de archivos binarios/grandes
        )
        documents = loader.load()
        
        # Divisor de Texto (Crea "chunks" pequeños para una mejor búsqueda)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        texts = text_splitter.split_documents(documents)
        
        # Almacenamiento en Base de Datos Vectorial (ChromaDB)
        print(f"-> [RAG Core] Documentos cargados: {len(texts)} chunks. Creando embeddings...")
        Chroma.from_documents(
            documents=texts, 
            embedding=EMBEDDINGS, 
            persist_directory=CHROMA_PATH
        )
        print("-> [RAG Core] Base de datos ChromaDB creada y lista.")
    else:
        print("-> [RAG Core] Base de datos ChromaDB cargada exitosamente desde el disco.")

# Intentar inicializar la base de datos al inicio (si el LLM está listo)
if LLM_READY:
    initialize_database()

# ---------------------------------------------------------------------
# ENDPOINT PRINCIPAL
# ---------------------------------------------------------------------

# Endpoint principal para la interacción de la IA
@app.post("/api/ask")
async def ask_ai(query: Query):
    """
    Recibe la pregunta del usuario, la procesa a través del sistema RAG
    y devuelve una respuesta informada por los documentos del repositorio.
    """
    if not LLM_READY:
        raise HTTPException(
            status_code=503,
            detail="Error: GEMINI_API_KEY no configurada. El Cerebro RAG no puede funcionar."
        )

    # Cargar el vectorstore (la base de datos de documentos)
    vectorstore = Chroma(persist_directory=CHROMA_PATH, embedding_function=EMBEDDINGS)
    
    # Crear el Retriever (el buscador de documentos relevantes)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3}) # Busca los 3 chunks más relevantes

    # Prompt para guiar a la IA (Personalidad de Nexus)
    custom_prompt = PromptTemplate(
        template="""Eres Nexus, el monitor de IA Open-Source de este repositorio de GitHub. Tu misión es actuar como un asistente técnico y organizador de proyectos, basando todas tus respuestas en el contexto provisto por los documentos de este repositorio.

        Instrucciones:
        1. Responde de forma concisa y profesional.
        2. Si la respuesta está en el contexto, úsalo para responder.
        3. Si la respuesta NO está en el contexto, indica amablemente que la información no se encuentra en el repositorio (la fuente de tu conocimiento).
        4. No menciones que utilizas LangChain, ChromaDB o HuggingFace.

        Historial de Chat: {chat_history}
        Contexto del Repositorio: {context}
        Pregunta del Usuario: {question}
        Respuesta:""",
        input_variables=["context", "question", "chat_history"]
    )

    # Crear la cadena de conversación RAG
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=LLM,
        retriever=retriever,
        return_source_documents=True,
        combine_docs_chain_kwargs={"prompt": custom_prompt},
    )

    # Formatear el historial de chat para la cadena
    formatted_history = [
        (msg["query"], msg["response"]) 
        for msg in query.chat_history
    ]
    
    # Ejecutar la cadena RAG
    result = qa_chain.invoke({
        "question": query.question, 
        "chat_history": formatted_history
    })
    
    # Extraer las fuentes para citación
    sources = [
        doc.metadata['source']
        for doc in result['source_documents']
    ]
    
    return {
        "response": result['answer'],
        "sources": list(set(sources)) # Devuelve solo fuentes únicas
    }

# Endpoint de verificación de estado
@app.get("/api/status")
async def get_status():
    """Devuelve el estado del RAG Core y si la clave de API está lista."""
    return {
        "status": "ready" if LLM_READY else "unconfigured",
        "llm": "Gemini 2.5 Flash",
        "embeddings": "all-MiniLM-L6-v2",
        "db": "ChromaDB",
        "docs_loaded": os.path.exists(CHROMA_PATH)
    }
