import re
from typing import Dict, Any, List

def parse_terraform(content_str: str) -> Dict[str, Any]:
    """Parser simplificado para arquivos Terraform (.tf HCL). Extrai recursos, tipos e conexões."""
    nodes = []
    edges = []
    
    # Regex para capturar blocos resource "tipo" "nome"
    resource_pattern = re.compile(r'resource\s+"([^"]+)"\s+"([^"]+)"\s*\{([^}]*)\}', re.DOTALL)
    matches = resource_pattern.findall(content_str)
    
    col_idx = 0
    row_idx = 0
    grid_cols = 3

    resource_ids = {}

    for res_type, res_name, body in matches:
        full_label = f"{res_type}.{res_name}"
        node_id = f"tf_{res_type}_{res_name}"
        resource_ids[res_name] = node_id
        resource_ids[full_label] = node_id

        # Categorização de tipo de nó
        node_category = "generic"
        res_type_lower = res_type.lower()
        if any(k in res_type_lower for k in ["db", "rds", "dynamo", "database"]):
            node_category = "database"
        elif any(k in res_type_lower for k in ["redis", "elasticache"]):
            node_category = "cache"
        elif any(k in res_type_lower for k in ["instance", "server", "vm"]):
            node_category = "api"
        elif any(k in res_type_lower for k in ["vpc", "subnet", "network", "security_group", "sg"]):
            node_category = "network"
        elif any(k in res_type_lower for k in ["s3", "bucket", "storage"]):
            node_category = "generic"
        elif any(k in res_type_lower for k in ["lb", "alb", "elb", "ingress"]):
            node_category = "proxy"

        nodes.append({
            "id": node_id,
            "type": "customNode",
            "data": {
                "label": full_label,
                "name": res_name,
                "kind": res_type,
                "nodeType": node_category,
                "rawConfig": body.strip()
            },
            "position": {"x": 100 + col_idx * 280, "y": 150 + row_idx * 160}
        })

        col_idx += 1
        if col_idx >= grid_cols:
            col_idx = 0
            row_idx += 1

    # Segunda passagem para encontrar conexões/referências entre recursos (ex: aws_security_group.web_sg.id)
    for res_type, res_name, body in matches:
        source_id = f"tf_{res_type}_{res_name}"
        for target_label, target_id in resource_ids.items():
            if target_id != source_id and target_label in body:
                edges.append({
                    "id": f"e_{source_id}_{target_id}",
                    "source": source_id,
                    "target": target_id,
                    "label": "referência IaC",
                    "animated": True,
                    "style": {"stroke": "#10b981", "strokeWidth": 2}
                })

    return {
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_resources": len(nodes),
            "format": "Terraform (HCL)"
        }
    }
