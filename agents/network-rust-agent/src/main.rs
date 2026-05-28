use chrono::Utc;
use rand::Rng;
use serde_json::json;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let agent_id = std::env::var("AGENT_ID").unwrap_or("network-rust-agent-01".to_string());
    let agent_type = std::env::var("AGENT_TYPE").unwrap_or("network".to_string());
    let version = std::env::var("AGENT_VERSION").unwrap_or("0.1.0".to_string());
    let lts_channel = std::env::var("LTS_CHANNEL").unwrap_or("experimental".to_string());

    println!("Starting {} ({}) v{}", agent_id, agent_type, version);

    loop {
        let mut rng = rand::thread_rng();

        let risk_score: u8 = rng.gen_range(1..=100);
        let severity = match risk_score {
            0..=39 => "low",
            40..=69 => "medium",
            70..=89 => "high",
            _ => "critical",
        };

        let event = json!({
            "agent_id": agent_id,
            "agent_type": agent_type,
            "version": version,
            "lts_channel": lts_channel,
            "timestamp": Utc::now().to_rfc3339(),
            "status": "healthy",
            "event_type": "network_detection",
            "severity": severity,
            "risk_score": risk_score,
            "message": "Mock suspicious network activity detected"
        });

        println!("{}", event);

        sleep(Duration::from_secs(5)).await;
    }
}