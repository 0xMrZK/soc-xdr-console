# Mini Cyber Defense Platform

Cloud-native SOC/XDR proof of concept built with Docker, k3s and AWS.

This project demonstrates a lightweight cybersecurity monitoring platform using containerized detection agents deployed on Kubernetes (k3s).

## Stack

### Infrastructure

* AWS EC2
* k3s
* Docker
* Kubernetes
* Traefik

### Frontend

* Next.js 16
* React
* TypeScript
* TailwindCSS
* shadcn/ui

### Backend

* Flask
* Gunicorn

### Agents

* Rust
* Python

---

# Architecture

```txt id="r4uzjv"
AWS EC2
└── k3s
    ├── manager-front
    ├── manager-api
    ├── network-rust-agent
    ├── web-python-agent
    └── xdr-python-agent
```

---

# Features

* SOC/XDR-style monitoring dashboard
* Multi-agent telemetry ingestion
* Incident aggregation
* Lifecycle / LTS strategy visualization
* Kubernetes-native deployment
* Mocked cyber telemetry and attack scenarios

---

# API

```txt id="zztxv3"
GET  /health
POST /api/v1/events
GET  /api/v1/agents
GET  /api/v1/incidents
GET  /api/v1/lifecycle
```

---

# Project Structure

```txt id="jlwm3n"
agents/
infra/
manager-api/
manager-front/
```

---

# Deployment

Apply Kubernetes manifests:

```bash id="63x4rt"
kubectl apply -f infra/k8s/
```

Frontend environment variable:

```env id="v7o5om"
NEXT_PUBLIC_API_URL=http://manager-api-service:5000/api/v1
```

---

# Notes

This project focuses on:

* cloud-native architecture
* modularity
* container orchestration
* DevSecOps-oriented engineering

Telemetry and attack detections are intentionally mocked for demonstration purposes.

