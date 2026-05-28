FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

ENV AGENT_ID=xdr-python-agent-01
ENV AGENT_TYPE=xdr
ENV AGENT_VERSION=0.1.0
ENV LTS_CHANNEL=lts

CMD ["python", "main.py"]
