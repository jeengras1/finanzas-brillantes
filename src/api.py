# Archivo principal de la API RAG (Generación Aumentada por Recuperación)
# Usa FastAPI para servir las peticiones del monitor web.

import os
from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# CORRECCIÓN CLAVE: Usamos langchain_community.chains para compatibilidad
from langchain_community.chains import ConversationalRetrievalChain 

from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
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
    chat_history: list = [] # Para el contexto de la conversación

# Inicialización diferida de componentes RAG
vectorstore = None
rag_chain = None
LLM_READY = False

# --- FUNCIÓN DE INICIALIZACIÓN RAG ---

def initialize_rag():
    global vectorstore, rag_chain, LLM_READY
    
    if not GEMINI_API_KEY:
        print("ERROR: Clave GEMINI_API_KEY no encontrada.")
        LLM_READY = False
        return False
        
    print("Inicializando componentes RAG...")
    
    # 1. Carga de Documentos (de la carpeta 'docs' y archivos markdown en la raíz)
    # Se añade un manejo de error para archivos binarios
    loader = DirectoryLoader(
        ".", 
        glob="**/*.md", 
        loader_cls=None,
        recursive=True
    )
    
    try:
        documents = loader.load()
    except Exception as e:
        print(f"Error al cargar documentos: {e}. Usando documento vacío.")
        documents = []
    
    if not documents:
        print("ADVERTENCIA: No se encontraron documentos para indexar. Usando texto base.")
        from langchain_core.documents import Document
        documents = [Document(page_content="El proyecto Nexus es un monitor de IA Open-Source. Su base es un sistema de Generación Aumentada por Recuperación (RAG).")]


    # 2. División de Texto (Chunking)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)
    
    # 3. Embeddings (Modelo Open-Source)
    EMBEDDINGS = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # 4. Base de Datos Vectorial (ChromaDB)
    CHROMA_PATH = "./data/chroma_db"
    if not os.path.exists(CHROMA_PATH):
        print(f"-> [RAG Core] Documentos cargados: {len(texts)} chunks. Creando embeddings...")
        vectorstore = Chroma.from_documents(texts, EMBEDDINGS, persist_directory=CHROMA_PATH)
    else:
        print("-> [RAG Core] Cargando Base de datos ChromaDB desde el disco.")
        vectorstore = Chroma(persist_directory=CHROMA_PATH, embedding_function=EMBEDDINGS)


    # 5. Modelo LLM (Generación)
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3, api_key=GEMINI_API_KEY)

    # 6. Retriever y Chain RAG
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    # Prompt para dar contexto a la IA
    custom_prompt = PromptTemplate(
        template="""Eres Nexus, el monitor de IA Open-Source de este repositorio de GitHub. Tu misión es actuar como un asistente técnico y organizador de proyectos, basando todas tus respuestas en el contexto provisto por los documentos de este repositorio.

        Instrucciones:
        1. Responde de forma concisa y profesional.
        2. Si la respuesta está en el contexto, úsalo para responder.
        3. Si la respuesta NO está en el contexto, indica amablemente que la información no se encuentra en el repositorio (la fuente de tu conocimiento).
        4. No menciones que utilizas LangChain, ChromaDB o HuggingFace.

        Contexto del Repositorio: {context}
        Pregunta del Usuario: {question}
        Respuesta:""",
        input_variables=["context", "question"]
    )
    
    rag_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        return_source_documents=True,
        combine_docs_chain_kwargs={"prompt": custom_prompt},
    )
    
    print("✅ Inicialización RAG completa. Cerebro Nexus listo.")
    LLM_READY = True
    return True

# Llama a la inicialización al inicio de la aplicación
is_rag_ready = initialize_rag()


# ---------------------------------------------------------------------
# ENDPOINTS
# ---------------------------------------------------------------------

# Endpoint de verificación de estado
@app.get("/api/status")
async def get_status():
    """Devuelve el estado del RAG Core y si la clave de API está lista."""
    return {
        "status": "ready" if LLM_READY else "unconfigured",
        "llm": "Gemini 2.5 Flash",
        "embeddings": "all-MiniLM-L6-v2",
        "docs_ready": LLM_READY and os.path.exists("./data/chroma_db")
    }


# Endpoint principal para la interacción de la IA
@app.post("/api/ask")
async def ask_ai(query: Query):
    if not LLM_READY:
        raise HTTPException(
            status_code=503, 
            detail="Nexus RAG Core está fuera de línea. Por favor, asegúrese de que GEMINI_API_KEY esté configurada."
        )

    try:
        # Ejecutar la cadena RAG. El ConversationalRetrievalChain maneja el historial.
        result = rag_chain.invoke({
            "question": query.question, 
            "chat_history": [] # Se podría expandir para usar el historial del Query model
        })
        
        # Extraer las fuentes para citación
        sources = [
            os.path.basename(doc.metadata['source']) # Solo el nombre del archivo
            for doc in result.get('source_documents', [])
        ]
        
        return {
            "response": result['answer'],
            "sources": list(set(sources)) # Devuelve solo fuentes únicas
        }
        
    except Exception as e:
        print(f"Error al procesar la query RAG: {e}")
        # En caso de error de conexión con Gemini, etc.
        raise HTTPException(status_code=500, detail="Error interno del Cerebro RAG. Verifique la conexión a la API.")
