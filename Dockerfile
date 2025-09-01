# Usamos la imagen oficial de Ollama como base
FROM ollama/ollama:latest

# Exponemos el puerto estándar de Ollama
EXPOSE 11434

# Al iniciar, descargamos el modelo ligero si aún no existe
# Luego, iniciamos el servidor para que esté siempre escuchando
CMD ["/bin/sh", "-c", "ollama pull phi3:3.8b && ollama serve"]
