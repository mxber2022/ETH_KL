use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};
use verifier::run_server;

const TRACING_FILTER: &str = "DEBUG";

const VERIFIER_HOST: &str = "0.0.0.0";
const VERIFIER_PORT: u16 = 9816;

/// Make sure the following domain is the same on the prover side
const SERVER_DOMAIN: &str = "api.devfolio.co";
//const HOTEL_NAME: &str = "V Hotel Bencoolen"; 

#[tokio::main]
async fn main() -> Result<(), eyre::ErrReport> {
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| TRACING_FILTER.into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    run_server(
        VERIFIER_HOST,
        VERIFIER_PORT,
        SERVER_DOMAIN,
        //HOTEL_NAME,
    )
    .await?;

    Ok(())
}
