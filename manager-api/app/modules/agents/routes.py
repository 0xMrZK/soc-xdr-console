from flask import Blueprint, request

from app.core.store import AGENTS, INCIDENTS, now_iso

agents_bp = Blueprint("agents", __name__)


@agents_bp.post("/events")
def ingest_event():
    event = request.get_json(force=True)

    agent_id = event.get("agent_id", "unknown-agent")
    risk_score = int(event.get("risk_score", 0))
    severity = event.get("severity", "low")

    AGENTS[agent_id] = {
        "agent_id": agent_id,
        "agent_type": event.get("agent_type", "unknown"),
        "status": event.get("status", "healthy"),
        "version": event.get("version", "unknown"),
        "lts_channel": event.get("lts_channel", "unknown"),
        "last_seen": now_iso(),
        "last_event": event.get("message", ""),
        "risk_score": risk_score,
        "severity": severity,
    }

    if severity in ["high", "critical"]:
        INCIDENTS.insert(0, {
            "id": f"inc-{len(INCIDENTS) + 1}",
            "created_at": now_iso(),
            "source_agent": agent_id,
            "severity": severity,
            "risk_score": risk_score,
            "event_type": event.get("event_type", "unknown"),
            "message": event.get("message", ""),
            "asset": event.get("asset"),
            "mitre_attack_technique": event.get("mitre_attack_technique"),
            "recommended_action": event.get("recommended_action"),
            "status": "open",
        })

    return {"status": "accepted", "agent_id": agent_id}


@agents_bp.get("/agents")
def list_agents():
    return {
        "count": len(AGENTS),
        "items": list(AGENTS.values()),
    }
