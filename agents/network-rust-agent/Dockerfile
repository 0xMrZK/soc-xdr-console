FROM rust:1.86-bookworm AS builder

WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim

WORKDIR /app
COPY --from=builder /app/target/release/network-rust-agent /app/network-rust-agent

ENV AGENT_ID=network-rust-agent-01
ENV AGENT_TYPE=network
ENV AGENT_VERSION=0.1.0
ENV LTS_CHANNEL=experimental
ENV MANAGER_API_URL=http://manager-api-service:5000/api/v1/events

CMD ["./network-rust-agent"]