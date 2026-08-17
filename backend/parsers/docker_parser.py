import yaml
from typing import Dict, Any, List

def detect_node_type(service_name: str, service_config: Dict[str, Any]) -> str:
    """Detecta o tipo de nó para estilização no frontend (db, cache, web, api, queue, monitoring, generic)."""
    name_lower = service_name.lower()
    image = str(service_config.get("image", "")).lower()
    
    if any(k in name_lower or k in image for k in ["postgres", "mysql", "mongo", "mariadb", "db", "database"]):
        return "database"
    elif any(k in name_lower or k in image for k in ["redis", "memcached", "valkey"]):
        return "cache"
    elif any(k in name_lower or k in image for k in ["nginx", "caddy", "apache", "traefik", "gateway", "proxy"]):
        return "proxy"
    elif any(k in name_lower or k in image for k in ["rabbitmq", "kafka", "sqs", "queue"]):
        return "queue"
    elif any(k in name_lower or k in image for k in ["prometheus", "grafana", "loki", "jaeger"]):
        return "monitoring"
    elif any(k in name_lower or k in image for k in ["api", "backend", "app", "server", "service"]):
        return "api"
    elif any(k in name_lower or k in image for k in ["web", "frontend", "ui", "client"]):
        return "frontend"
    return "generic"

def parse_docker_compose(content_str: str) -> Dict[str, Any]:
    """Converte o conteúdo de um docker-compose.yml em Nós e Arestas para o ReactFlow."""
    try:
        data = yaml.safe_load(content_str)
    except Exception as e:
        raise ValueError(f"Erro de sintaxe no YAML do Docker Compose: {str(e)}")

    if not isinstance(data, dict):
        raise ValueError("Conteúdo inválido: o Docker Compose deve ser um dicionário YAML.")

    services = data.get("services", {})
    networks = data.get("networks", {})
    volumes = data.get("volumes", {})

    nodes = []
    edges = []
    
    # Posições iniciais em grade para renderização limpa
    x_offset = 100
    y_offset = 100
    grid_cols = 3
    col_idx = 0
    row_idx = 0

    # 1. Processa Redes (Networks) como Nós do tipo 'network'
    network_names = list(networks.keys()) if isinstance(networks, dict) else []
    if not network_names:
        network_names = ["default"]

    for net_name in network_names:
        net_id = f"net_{net_name}"
        nodes.append({
            "id": net_id,
            "type": "networkNode",
            "data": {
                "label": f"Rede: {net_name}",
                "name": net_name,
                "nodeType": "network"
            },
            "position": {"x": 50 + len(nodes) * 260, "y": 50}
        })

    # 2. Processa Serviços
    for service_name, config in services.items():
        if not isinstance(config, dict):
            config = {}

        node_id = f"srv_{service_name}"
        node_type = detect_node_type(service_name, config)
        
        ports = config.get("ports", [])
        formatted_ports = []
        if isinstance(ports, list):
            for p in ports:
                formatted_ports.append(str(p))

        image = config.get("image", "Build local")
        env_vars = list(config.get("environment", {}).keys()) if isinstance(config.get("environment"), dict) else []

        nodes.append({
            "id": node_id,
            "type": "customNode",
            "data": {
                "label": service_name,
                "name": service_name,
                "nodeType": node_type,
                "image": image,
                "ports": formatted_ports,
                "envCount": len(env_vars),
                "rawConfig": config
            },
            "position": {"x": 100 + col_idx * 280, "y": 200 + row_idx * 160}
        })

        col_idx += 1
        if col_idx >= grid_cols:
            col_idx = 0
            row_idx += 1

        # Arestas de Dependência (depends_on)
        depends_on = config.get("depends_on", [])
        dep_list = []
        if isinstance(depends_on, list):
            dep_list = depends_on
        elif isinstance(depends_on, dict):
            dep_list = list(depends_on.keys())

        for dep in dep_list:
            target_id = f"srv_{dep}"
            edges.append({
                "id": f"e_{node_id}_{target_id}",
                "source": node_id,
                "target": target_id,
                "label": "depends_on",
                "animated": True,
                "style": {"stroke": "#10b981", "strokeWidth": 2}
            })

        # Conexão com Redes
        srv_networks = config.get("networks", [])
        if isinstance(srv_networks, list):
            for net in srv_networks:
                net_id = f"net_{net}"
                edges.append({
                    "id": f"e_{node_id}_{net_id}",
                    "source": node_id,
                    "target": net_id,
                    "label": "conectado",
                    "style": {"stroke": "#059669", "strokeDasharray": "4,4"}
                })
        elif isinstance(srv_networks, dict):
            for net in srv_networks.keys():
                net_id = f"net_{net}"
                edges.append({
                    "id": f"e_{node_id}_{net_id}",
                    "source": node_id,
                    "target": net_id,
                    "label": "conectado",
                    "style": {"stroke": "#059669", "strokeDasharray": "4,4"}
                })

    return {
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_services": len(services),
            "total_networks": len(network_names),
            "total_volumes": len(volumes) if isinstance(volumes, dict) else 0,
            "format": "Docker Compose"
        }
    }
