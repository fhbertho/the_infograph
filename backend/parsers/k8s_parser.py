import yaml
from typing import Dict, Any, List

def parse_k8s_manifests(content_str: str) -> Dict[str, Any]:
    """Processa documentos YAML de Kubernetes (Deployments, Services, Ingress, Pods)."""
    try:
        documents = list(yaml.safe_load_all(content_str))
    except Exception as e:
        raise ValueError(f"Erro de sintaxe no YAML de Kubernetes: {str(e)}")

    nodes = []
    edges = []
    summary_counts = {"deployments": 0, "services": 0, "ingress": 0, "other": 0}

    col_idx = 0
    row_idx = 0
    grid_cols = 3

    for idx, doc in enumerate(documents):
        if not isinstance(doc, dict) or "kind" not in doc:
            continue

        kind = doc.get("kind", "Unknown")
        metadata = doc.get("metadata", {})
        name = metadata.get("name", f"resource-{idx}")
        namespace = metadata.get("namespace", "default")
        node_id = f"k8s_{kind.lower()}_{name}"

        # Classificação visual
        node_type = "generic"
        if kind in ["Deployment", "StatefulSet", "DaemonSet"]:
            node_type = "api"
            summary_counts["deployments"] += 1
        elif kind == "Service":
            node_type = "proxy"
            summary_counts["services"] += 1
        elif kind == "Ingress":
            node_type = "frontend"
            summary_counts["ingress"] += 1
        elif kind in ["ConfigMap", "Secret", "PersistentVolumeClaim"]:
            node_type = "database"
            summary_counts["other"] += 1

        nodes.append({
            "id": node_id,
            "type": "customNode",
            "data": {
                "label": f"[{kind}] {name}",
                "name": name,
                "kind": kind,
                "namespace": namespace,
                "nodeType": node_type,
                "rawConfig": doc
            },
            "position": {"x": 100 + col_idx * 280, "y": 150 + row_idx * 160}
        })

        col_idx += 1
        if col_idx >= grid_cols:
            col_idx = 0
            row_idx += 1

        # Relacionamento de Ingress -> Service -> Deployment por Selectors
        if kind == "Ingress":
            rules = doc.get("spec", {}).get("rules", [])
            for r in rules:
                for path in r.get("http", {}).get("paths", []):
                    backend_svc = path.get("backend", {}).get("service", {}).get("name")
                    if backend_svc:
                        target_id = f"k8s_service_{backend_svc}"
                        edges.append({
                            "id": f"e_{node_id}_{target_id}",
                            "source": node_id,
                            "target": target_id,
                            "label": "roteia_para",
                            "animated": True,
                            "style": {"stroke": "#10b981", "strokeWidth": 2}
                        })

    return {
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_resources": len(nodes),
            "kinds": summary_counts,
            "format": "Kubernetes Manifests"
        }
    }
