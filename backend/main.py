import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from dotenv import load_dotenv

from parsers.docker_parser import parse_docker_compose
from parsers.k8s_parser import parse_k8s_manifests
from services.ai_service import analyze_infrastructure, query_copilot

load_dotenv()

app = FastAPI(title="InfraGraph API", version="1.0.0")

# Habilita CORS para o frontend em React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CopilotQuery(BaseModel):
    infra_data: Dict[str, Any]
    question: str

SAMPLE_DOCKER_COMPOSE = """
version: '3.8'

services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - web-app
      - api-service
    networks:
      - frontend-net

  web-app:
    image: node:18-alpine
    environment:
      - NODE_ENV=production
      - API_URL=http://api-service:3000
    networks:
      - frontend-net
      - backend-net

  api-service:
    image: python:3.11-slim
    environment:
      - DB_HOST=postgres-db
      - REDIS_HOST=redis-cache
    depends_on:
      - postgres-db
      - redis-cache
    networks:
      - backend-net

  postgres-db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_PASSWORD=secret
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend-net

  redis-cache:
    image: redis:7-alpine
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:

volumes:
  db_data:
"""

@app.get("/")
def root():
    return {"status": "online", "message": "InfraGraph API rodando com sucesso!"}

@app.get("/api/sample")
def get_sample_infra():
    """Retorna um exemplo pré-configurado de Docker Compose para teste rápido."""
    parsed = parse_docker_compose(SAMPLE_DOCKER_COMPOSE)
    parsed["raw_yaml"] = SAMPLE_DOCKER_COMPOSE
    return parsed

@app.post("/api/parse-file")
async def parse_file(file: UploadFile = File(...)):
    """Recebe um arquivo YAML e realiza o parsing conforme o tipo (Docker ou Kubernetes)."""
    filename = file.filename.lower()
    content_bytes = await file.read()
    content_str = content_bytes.decode("utf-8")

    try:
        if "docker" in filename or "compose" in filename or "services:" in content_str:
            parsed = parse_docker_compose(content_str)
        elif "kind:" in content_str:
            parsed = parse_k8s_manifests(content_str)
        else:
            # Tenta Docker Compose por padrão
            parsed = parse_docker_compose(content_str)
        
        parsed["raw_yaml"] = content_str
        return parsed
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Falha ao processar arquivo: {str(e)}")

@app.post("/api/ai-analyze")
def ai_analyze(infra_data: Dict[str, Any]):
    """Análise estruturada da topologia via Gemini AI."""
    result = analyze_infrastructure(infra_data)
    return result

@app.post("/api/copilot")
def copilot_chat(query: CopilotQuery):
    """Chatbot de perguntas e respostas sobre a infraestrutura."""
    response = query_copilot(query.infra_data, query.question)
    return {"answer": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
