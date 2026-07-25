import os
from typing import Dict, Any, List

def get_gemini_client():
    """Instancia o cliente do Gemini se a chave de API estiver configurada."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "sua_chave_gemini_aqui":
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Aviso ao carregar SDK do Gemini: {e}")
        return None

def get_model_name():
    """Retorna o modelo do Gemini configurado ou gemini-2.0-flash por padrão."""
    return os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

def analyze_infrastructure(infra_data: Dict[str, Any]) -> Dict[str, Any]:
    """Realiza uma análise completa de arquitetura, SPOF e segurança usando IA."""
    client = get_gemini_client()
    summary = infra_data.get("summary", {})
    nodes = infra_data.get("nodes", [])
    edges = infra_data.get("edges", [])

    prompt = f"""
Você é um Arquiteto de Infraestrutura e especialista SRE / DevOps Sênior.
Analise a seguinte topologia de infraestrutura extraída de um arquivo de configuração:

Resumo: {summary}
Quantidade de Nós: {len(nodes)}
Conexões/Arestas: {len(edges)}

Lista de Componentes / Serviços:
{[n.get('data', {}).get('label') for n in nodes]}

Por favor, forneça uma análise técnica estruturada em Português no formato JSON com as seguintes chaves:
1. "overview": Um resumo conciso da arquitetura.
2. "spof": Lista de Pontos Únicos de Falha (Single Points of Failure) identificados.
3. "security_risks": Riscos potenciais de segurança ou más práticas observadas.
4. "recommendations": Recomendações práticas para tornar a infraestrutura resiliente e escalável.
"""

    if not client:
        return {
            "overview": f"Infraestrutura baseada em {summary.get('format', 'Containers')} com {len(nodes)} serviços detectados.",
            "spof": [
                "Serviços de Banco de Dados/Cache sem réplicas configuradas.",
                "Ponto de entrada único sem balanceador de carga redundante."
            ],
            "security_risks": [
                "Verifique se senhas/chaves não estão fixas no arquivo.",
                "Certifique-se de expor apenas as portas necessárias no host."
            ],
            "recommendations": [
                "Adicionar réplicas para serviços de leitura/escrita.",
                "Configurar Healthchecks automáticos nos contêineres.",
                "💡 Para ativar análises inteligentes com IA Gemini real, insira sua GEMINI_API_KEY no arquivo .env!"
            ],
            "is_mock": True
        }

    try:
        response = client.models.generate_content(
            model=get_model_name(),
            contents=prompt
        )
        return {
            "analysis_text": response.text,
            "is_mock": False
        }
    except Exception as e:
        return {
            "analysis_text": f"Erro ao consultar a API do Gemini: {str(e)}",
            "is_mock": True
        }

def query_copilot(infra_data: Dict[str, Any], user_prompt: str) -> str:
    """Responde perguntas do usuário sobre a infraestrutura (Chatbot Copiloto)."""
    client = get_gemini_client()
    nodes_info = [f"- {n['data']['label']} (Tipo: {n['data']['nodeType']})" for n in infra_data.get("nodes", [])]
    nodes_str = "\n".join(nodes_info)

    system_context = f"""
Você é o Copiloto AI do InfraGraph. O usuário está visualizando o diagrama da infraestrutura abaixo:

Componentes:
{nodes_str}

Responda de forma direta, técnica e prática para um engenheiro de DevOps/Infra.
Se o usuário perguntar o que acontece se um serviço cair, simule o impacto em cascata nos dependentes.
"""

    if not client:
        # Resposta Heurística de fallback caso não haja chave da API no momento
        return (
            f"🤖 **[Modo de Demonstração - Sem API Key]**\n\n"
            f"Analisando sua pergunta sobre: *\"{user_prompt}\"*\n\n"
            f"Com base na topologia atual com {len(infra_data.get('nodes', []))} nós:\n"
            f"- A queda de um serviço central pode afetar os componentes dependentes.\n"
            f"- Recomenda-se configurar réplicas e auto-restart.\n\n"
            f"*(Adicione sua `GEMINI_API_KEY` no arquivo `.env` para respostas dinâmicas do modelo Gemini)*"
        )

    try:
        response = client.models.generate_content(
            model=get_model_name(),
            contents=f"{system_context}\n\nPergunta do usuário: {user_prompt}"
        )
        return response.text
    except Exception as e:
        return f"Erro ao processar sua pergunta com a IA: {str(e)}"
