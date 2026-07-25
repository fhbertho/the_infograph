# 🕸️ InfraGraph AI — Visualizador Interativo de Topologia e Análise de Infraestrutura com IA

Um projeto moderno de **DevOps / Infraestrutura como Código (IaC) / SRE** que converte arquivos de configuração (`docker-compose.yml`, Kubernetes Manifests `.yaml`) em um **diagrama de topologia interativo de nós e conexões**, integrado com um **Copiloto de Inteligência Artificial (Google Gemini 2.0)**.

![InfraGraph Architecture](https://img.shields.io/badge/Stack-Python%20%7C%20FastAPI%20%7C%20React%20%7C%20ReactFlow%20%7C%20Gemini%20AI-blue)

---

## ✨ Funcionalidades Principais

- 📊 **Visualização Dinâmica de Topologia:** Renderização interativa de servidores, bancos de dados, réplicas de cache, proxies, redes e volumes via ReactFlow.
- ⚡ **Support Multi-formato:** Suporta parsing de `docker-compose.yml` e manifestos de Kubernetes (`Deployments`, `Services`, `Ingress`, `ConfigMaps`).
- 🤖 **Copiloto AI (Google Gemini):**
  - **Auditoria de IA Automática:** Identificação de Pontos Únicos de Falha (SPOF), riscos de segurança e recomendações.
  - **Chat Interativo:** Faça perguntas como *"O que acontece se o banco cair?"* ou *"Como aplicar Alta Disponibilidade (HA)?"*.
- 🔍 **Inspetor de Componentes:** Clique em qualquer nó para ver portas expostas, imagens de contêiner e variáveis de ambiente.

---

## 🚀 Como Executar o Projeto

### Pró-requisitos
- Python 3.10+
- Node.js 18+

### 1. Iniciar o Backend (Python FastAPI)
No terminal na pasta `backend/`:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*O servidor FastAPI estará rodando em `http://localhost:8000`.*

> 💡 **Configuração da IA (Opcional):**
> Crie um arquivo `.env` dentro de `backend/` com sua chave gratuita do Google Gemini:
> ```env
> GEMINI_API_KEY=sua_chave_aqui
> ```
> *(Obtenha gratuitamente em [Google AI Studio](https://aistudio.google.com/))*

### 2. Iniciar o Frontend (React + Vite)
Em outro terminal na pasta `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
*O app web abrirá em `http://localhost:5173`.*

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Python 3, FastAPI, PyYAML, Google GenAI SDK (`google-genai`), Uvicorn.
- **Frontend:** React 19, Vite, `@xyflow/react` (ReactFlow), `lucide-react`, Axios.
