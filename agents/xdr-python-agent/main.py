import json
import os
import random
import time
from datetime import datetime, timezone

AGENT_ID = os.getenv("AGENT_ID", "xdr-python-agent-01")
AGENT_TYPE = os.getenv("AGENT_TYPE", "xdr")
AGENT_VERSION = os.getenv("AGENT_VERSION", "0.1.0")
LTS_CHANNEL = os.getenv("LTS_CHANNEL", "lts")

SCENARIOS = [
    {
        "event_type": "xdr_process_detection",
        "message": "Suspicious PowerShell execution detected",
        "mitre": "T1059.001",
        "asset": "win-workstation-042",
    },
    {
        "event_type": "xdr_lateral_movement",
        "message": "Possible lateral movement over SMB detected",
        "mitre": "T1021.002",
        "asset": "file-server-01",
    },
    {
        "event_type": "xdr_credential_access",
        "message": "Abnormal credential access pattern detected",
        "mitre": "T1003",
        "asset": "domain-controller-01",
    },
    {
        "event_type": "xdr_c2_detection",
        "message": "Potential command and control beaconing detected",
        "mitre": "T1071",
        "asset": "linux-endpoint-018",
    },
]

print(f"Starting {AGENT_ID} ({AGENT_TYPE}) v{AGENT_VERSION}", flush=True)

while True:
    scenario = random.choice(SCENARIOS)
    risk_score = random.randint(20, 100)

    if risk_score < 40:
        severity = "low"
    elif risk_score < 70:
        severity = "medium"
    elif risk_score < 90:
        severity = "high"
    else:
        severity = "critical"

    event = {
        "agent_id": AGENT_ID,
        "agent_type": AGENT_TYPE,
        "version": AGENT_VERSION,
        "lts_channel": LTS_CHANNEL,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "healthy",
        "severity": severity,
        "risk_score": risk_score,
        "asset": scenario["asset"],
        "event_type": scenario["event_type"],
        "message": scenario["message"],
        "mitre_attack_technique": scenario["mitre"],
        "xdr_sources": [
            "endpoint",
            "identity",
            "network",
        ],
        "recommended_action": "Open investigation and correlate with recent authentication and network telemetry"
    }

    print(json.dumps(event), flush=True)
    time.sleep(5)
