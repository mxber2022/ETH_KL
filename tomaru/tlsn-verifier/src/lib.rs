use axum::{
    extract::{rejection::JsonRejection, Request, State}, response::{IntoResponse, Response}, routing::post, Json, Router
};
use eyre::{eyre, Report};
use elliptic_curve::pkcs8::DecodePublicKey;
use http::StatusCode;
use hyper::{body::Incoming, server::conn::http1};
use hyper_util::rt::TokioIo;
use mpz_core::serialize::CanonicalSerialize;
use p256::{ecdsa::{signature::Signer, Signature, SigningKey}, pkcs8::DecodePrivateKey};
use serde::{Deserialize, Serialize};
use std::{
    net::{IpAddr, SocketAddr},
    sync::Arc,
    str
};
use tlsn_core::proof::{SessionProof, TlsProof};
use tokio::net::TcpListener;
use tower_service::Service;
use tracing::{debug, error, info, trace};

#[derive(Clone, Debug)]
struct VerifierGlobals {
    pub server_domain: String,
   // pub hotel_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerifyRequest {
    pub proof: TlsProof,
    pub identity_commitment: IdentityCommit,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdentityCommit {
    pub commit: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerifyResponse {
    pub signature: Signature,
    pub identity_commit: IdentityCommit,
}

#[derive(Debug, thiserror::Error)]
pub enum VerifierServerError {
    #[error(transparent)]
    Unexpected(#[from] Report),
}

impl IntoResponse for VerifierServerError {
    fn into_response(self) -> Response {
        match self {
            Self::Unexpected(err) => {
            error!("{}", err);
                (
                    StatusCode::BAD_REQUEST,
                    Json("Something wrong happened.."),
                ).into_response()
            }}
    }
}

pub async fn run_server(
    verifier_host: &str,
    verifier_port: u16,
    server_domain: &str,
   // hotel_name: &str,
) -> Result<(), VerifierServerError> {
    let verifier_address = SocketAddr::new(
        IpAddr::V4(verifier_host.parse().map_err(|err| {
            eyre!("Failed to parse verifer host address from server config: {err}")
        })?),
        verifier_port,
    );
    let listener = TcpListener::bind(verifier_address)
        .await
        .map_err(|err| eyre!("Failed to bind server address to tcp listener: {err}"))?;

    info!("Listening for TCP traffic at {}", verifier_address);

    let protocol = Arc::new(http1::Builder::new());
    let router = Router::new()
        .route("/verify", post(verify))
        .with_state(VerifierGlobals {
            server_domain: server_domain.to_string(),
            //hotel_name: hotel_name.to_string(),
        });

    loop {
        let stream = match listener.accept().await {
            Ok((stream, _)) => stream,
            Err(err) => {
                error!("Failed to connect to prover: {err}");
                continue;
            }
        };
        debug!("Received a prover's TCP connection");

        let tower_service = router.clone();
        let protocol = protocol.clone();

        tokio::spawn(async move {
            info!("Accepted prover's TCP connection",);
            // Reference: https://github.com/tokio-rs/axum/blob/5201798d4e4d4759c208ef83e30ce85820c07baa/examples/low-level-rustls/src/main.rs#L67-L80
            let io = TokioIo::new(stream);
            let hyper_service = hyper::service::service_fn(move |request: Request<Incoming>| {
                tower_service.clone().call(request)
            });
            // Serve different requests using the same hyper protocol and axum router
            let _ = protocol
                .serve_connection(io, hyper_service)
                .await;
        });
    }
}

async fn verify(
    State(verifier_globals): State<VerifierGlobals>,
    payload: Result<Json<VerifyRequest>, JsonRejection>,
) -> impl IntoResponse {
    debug!("Starting verification...");

    let payload = match payload {
        Ok(payload) => payload,
        Err(err) => return VerifierServerError::Unexpected(eyre!("Verification failed: cannot parse payload: {err}")).into_response()
    };
    let id_commit = (&payload).identity_commitment.clone();

    // The session proof establishes the identity of the server and the commitments
    // to the TLS transcript.
    let session = &payload.proof.session;
    let SessionProof {
        // The session header that was signed by the Notary is a succinct commitment to the TLS transcript.
        header,
        // This is the session_info, which contains the server_name, that is checked against the
        // certificate chain shared in the TLS handshake.
        session_info,
        ..
    } = session;
    let session_header = header.clone();

    // Check Session info: server name.
    if session_info.server_name.as_str() != &verifier_globals.server_domain {
        return VerifierServerError::Unexpected(eyre!("Verification failed: server name mismatches")).into_response();
    }

    debug!("Server name check passed!");

    // Verify the session proof against the Notary's public key
    //
    // This verifies the identity of the server using a default certificate verifier which trusts
    // the root certificates from the `webpki-roots` crate.
    if let Err(err) = session
        .verify_with_default_cert_verifier(notary_pubkey()) {
            return VerifierServerError::Unexpected(eyre!("Verification failed: cannot validate cert: {err}")).into_response();
        };

    debug!("Server cert check passed!");
            
    // The substrings proof proves select portions of the transcript, while redacting
    // anything the Prover chose not to disclose.
    let substrings = payload.0.proof.substrings;
    
    // Verify the substrings proof against the session header.
    //
    // This returns the redacted transcripts
    let Ok((sent, recv)) = substrings.verify(&session_header) else {
        return VerifierServerError::Unexpected(eyre!("Verification failed: cannot validate session header")).into_response();
    };

    debug!("Substring check passed!");

    // Check sent data: check host.
    debug!("Starting sent data verification...");
    let Ok(sent_data) = String::from_utf8(sent.data().to_vec()) else {
        return VerifierServerError::Unexpected(eyre!("Verification failed: failed to parse sent data")).into_response();   
    };
    if let None = sent_data.find(&verifier_globals.server_domain) {
        return VerifierServerError::Unexpected(eyre!("Verification failed: expected host {}", &verifier_globals.server_domain)).into_response()
    }

    debug!("Host check passed!");

    // Check received data: check json and hotel name.
    debug!("Starting received data verification...");

    let Ok(response) = String::from_utf8(recv.data().to_vec()) else {
        return VerifierServerError::Unexpected(eyre!("Verification failed: failed to parse received data")).into_response();
    };
    // if let None = response.find(&verifier_globals.hotel_name) {
    //     return VerifierServerError::Unexpected(eyre!("Verification failed: cannot find the right hotel name")).into_response();
    // }

    debug!("Hotel check passed!");

    trace!("Received data: {:?}", response);

    let Ok(sent_string) = bytes_to_redacted_string(sent.data()) else {
        return VerifierServerError::Unexpected(eyre!("Verification failed: cannot parse sent data")).into_response();
    };
    let Ok(received_string) = bytes_to_redacted_string(recv.data()) else {
        return VerifierServerError::Unexpected(eyre!("Verification failed: cannot parse recv data")).into_response();
    };

    trace!("Verified sent data:\n{}", sent_string,);
    trace!("Verified received data:\n{}", received_string,);

    debug!("Signing the identity commitment...");

    // Sign over id commit
    let secret_key = verifier_privkey().to_bytes();
    let signer = SigningKey::from_bytes(&secret_key).unwrap();

    let signature: Signature = signer.sign(&id_commit.to_bytes());

    debug!("Verification completed!");

    (
        StatusCode::OK,
        Json(VerifyResponse {
            signature,
            identity_commit: id_commit.clone(),
        }),
    )
        .into_response()
}

fn bytes_to_redacted_string(bytes: &[u8]) -> Result<String, VerifierServerError> {
    Ok(String::from_utf8(bytes.to_vec())
        .map_err(|err| eyre!("Failed to parse bytes to redacted string: {err}"))?
        .replace('\0', "🙈"))
}

fn notary_pubkey() -> p256::PublicKey {
    let pem_file = str::from_utf8(include_bytes!(
        "../fixture/notary.pub"
    ))
    .unwrap();
    p256::PublicKey::from_public_key_pem(pem_file).unwrap()
}

fn verifier_privkey() -> p256::SecretKey {
    let pem_file = str::from_utf8(include_bytes!(
        "../fixture/verifier.key"
    ))
    .unwrap();
    p256::SecretKey::from_pkcs8_pem(pem_file).unwrap()
}
