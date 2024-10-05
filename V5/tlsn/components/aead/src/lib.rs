//! This crate provides implementations of 2PC AEADs for authenticated encryption with
//! a shared key.
//!
//! Both parties can work together to encrypt and decrypt messages with different visibility
//! configurations. See [`Aead`] for more information on the interface.
//!
//! For example, one party can privately provide the plaintext to encrypt, while both parties
//! can see the ciphertext and the tag. Or, both parties can cooperate to decrypt a ciphertext
//! and verify the tag, while only one party can see the plaintext.

#![deny(missing_docs, unreachable_pub, unused_must_use)]
#![deny(clippy::all)]
#![forbid(unsafe_code)]

pub mod aes_gcm;
pub mod msg;

pub use msg::AeadMessage;

use async_trait::async_trait;

use mpz_garble::value::ValueRef;
use utils_aio::duplex::Duplex;

/// A channel for sending and receiving AEAD messages.
pub type AeadChannel = Box<dyn Duplex<AeadMessage>>;

/// An error that can occur during AEAD operations.
#[derive(Debug, thiserror::Error)]
#[allow(missing_docs)]
pub enum AeadError {
    #[error(transparent)]
    BlockCipherError(#[from] block_cipher::BlockCipherError),
    #[error(transparent)]
    StreamCipherError(#[from] tlsn_stream_cipher::StreamCipherError),
    #[error(transparent)]
    UniversalHashError(#[from] tlsn_universal_hash::UniversalHashError),
    #[error("Corrupted Tag")]
    CorruptedTag,
    #[error("Validation Error: {0}")]
    ValidationError(String),
    #[error(transparent)]
    IoError(#[from] std::io::Error),
}

/// This trait defines the interface for AEADs.
#[async_trait]
pub trait Aead: Send {
    /// Sets the key for the AEAD.
    async fn set_key(&mut self, key: ValueRef, iv: ValueRef) -> Result<(), AeadError>;

    /// Decodes the key for the AEAD, revealing it to this party.
    async fn decode_key_private(&mut self) -> Result<(), AeadError>;

    /// Decodes the key for the AEAD, revealing it to the other party(s).
    async fn decode_key_blind(&mut self) -> Result<(), AeadError>;

    /// Sets the transcript id
    ///
    /// The AEAD assigns unique identifiers to each byte of plaintext
    /// during encryption and decryption.
    ///
    /// For example, if the transcript id is set to `foo`, then the first byte will
    /// be assigned the id `foo/0`, the second byte `foo/1`, and so on.
    ///
    /// Each transcript id has an independent counter.
    ///
    /// # Note
    ///
    /// The state of a transcript counter is preserved between calls to `set_transcript_id`.
    fn set_transcript_id(&mut self, id: &str);

    /// Preprocesses for the given number of bytes.
    async fn preprocess(&mut self, len: usize) -> Result<(), AeadError>;

    /// Performs any necessary one-time setup for the AEAD.
    ///
    /// This method must be called after the key has been set.
    async fn setup(&mut self) -> Result<(), AeadError>;

    /// Encrypts a plaintext message, returning the ciphertext and tag.
    ///
    /// The plaintext is provided by both parties.
    ///
    /// * `explicit_nonce` - The explicit nonce to use for encryption.
    /// * `plaintext` - The plaintext to encrypt.
    /// * `aad` - Additional authenticated data.
    async fn encrypt_public(
        &mut self,
        explicit_nonce: Vec<u8>,
        plaintext: Vec<u8>,
        aad: Vec<u8>,
    ) -> Result<Vec<u8>, AeadError>;

    /// Encrypts a plaintext message, hiding it from the other party, returning the ciphertext and tag.
    ///
    /// * `explicit_nonce` - The explicit nonce to use for encryption.
    /// * `plaintext` - The plaintext to encrypt.
    /// * `aad` - Additional authenticated data.
    async fn encrypt_private(
        &mut self,
        explicit_nonce: Vec<u8>,
        plaintext: Vec<u8>,
        aad: Vec<u8>,
    ) -> Result<Vec<u8>, AeadError>;

    /// Encrypts a plaintext message provided by the other party, returning
    /// the ciphertext and tag.
    ///
    /// * `explicit_nonce` - The explicit nonce to use for encryption.
    /// * `plaintext_len` - The length of the plaintext to encrypt.
    /// * `aad` - Additional authenticated data.
    async fn encrypt_blind(
        &mut self,
        explicit_nonce: Vec<u8>,
        plaintext_len: usize,
        aad: Vec<u8>,
    ) -> Result<Vec<u8>, AeadError>;

    /// Decrypts a ciphertext message, returning the plaintext to both parties.
    ///
    /// This method checks the authenticity of the ciphertext, tag and additional data.
    ///
    /// * `explicit_nonce` - The explicit nonce to use for decryption.
    /// * `payload` - The ciphertext and tag to authenticate and decrypt.
    /// * `aad` - Additional authenticated data.
    async fn decrypt_public(
        &mut self,
        explicit_nonce: Vec<u8>,
        payload: Vec<u8>,
        aad: Vec<u8>,
    ) -> Result<Vec<u8>, AeadError>;

    /// Decrypts a ciphertext message, returning the plaintext only to this party.
    ///
    /// This method checks the authenticity of the ciphertext, tag and additional data.
    ///
    /// * `explicit_nonce` - The explicit nonce to use for decryption.
    /// * `payload` - The ciphertext and tag to authenticate and decrypt.
    /// * `aad` - Additional authenticated data.
    async fn decrypt_private(
        &mut self,
        explicit_nonce: Vec<u8>,
        payload: Vec<u8>,
        aad: Vec<u8>,
    ) -> Result<Vec<u8>, AeadError>;

    /// Decrypts a ciphertext message, returning the plaintext only to the other party.
    ///
    /// This method checks the authenticity of the ciphertext, tag and additional data.
    ///
    /// * `explicit_nonce` - The explicit nonce to use for decryption.
    /// * `payload` - The ciphertext and tag to authenticate and decrypt.
    /// * `aad` - Additional authenticated data.
    async fn decrypt_blind(
        &mut self,
        explicit_nonce: Vec<u8>,
        payload: Vec<u8>,
        aad: Vec<u8>,
    ) -> Result<(), AeadError>;

    /// Verifies the tag of a ciphertext message.
    ///
    /// This method checks the authenticity of the ciphertext, tag and additional data.
    ///
    /// * `explicit_nonce` - The explicit nonce to use for decryption.
    /// * `payload` - The ciphertext and tag to authenticate and decrypt.
    /// * `aad` - Additional authenticated data.
    async fn verify_tag(
        &mut self,
        explicit_nonce: Vec<u8>,
        payload: Vec<u8>,
        aad: Vec<u8>,
    ) -> Result<(), AeadError>;

    /// Locally decrypts the provided ciphertext and then proves in ZK to the other party(s) that the
    /// plaintext is correct.
    ///
    /// Returns the plaintext.
    ///
    /// This method requires this party to know the encryption key, which can be achieved by calling
    /// the `decode_key_private` method.
    ///
    /// # Arguments
    ///
    /// * `explicit_nonce`: The explicit nonce to use for the keystream.
    /// * `payload`: The ciphertext and tag to decrypt and prove.
    /// * `aad`: Additional authenticated data.
    async fn prove_plaintext(
        &mut self,
        explicit_nonce: Vec<u8>,
        payload: Vec<u8>,
        aad: Vec<u8>,
    ) -> Result<Vec<u8>, AeadError>;

    /// Locally decrypts the provided ciphertext and then proves in ZK to the other party(s) that the
    /// plaintext is correct.
    ///
    /// Returns the plaintext.
    ///
    /// This method requires this party to know the encryption key, which can be achieved by calling
    /// the `decode_key_private` method.
    ///
    /// # WARNING
    ///
    /// This method does not verify the tag of the ciphertext. Only use this if you know what you're doing.
    ///
    /// # Arguments
    ///
    /// * `explicit_nonce`: The explicit nonce to use for the keystream.
    /// * `ciphertext`: The ciphertext to decrypt and prove.
    async fn prove_plaintext_no_tag(
        &mut self,
        explicit_nonce: Vec<u8>,
        ciphertext: Vec<u8>,
    ) -> Result<Vec<u8>, AeadError>;

    /// Verifies the other party(s) can prove they know a plaintext which encrypts to the given ciphertext.
    ///
    /// # Arguments
    ///
    /// * `explicit_nonce`: The explicit nonce to use for the keystream.
    /// * `payload`: The ciphertext and tag to verify.
    /// * `aad`: Additional authenticated data.
    async fn verify_plaintext(
        &mut self,
        explicit_nonce: Vec<u8>,
        payload: Vec<u8>,
        aad: Vec<u8>,
    ) -> Result<(), AeadError>;

    /// Verifies the other party(s) can prove they know a plaintext which encrypts to the given ciphertext.
    ///
    /// # WARNING
    ///
    /// This method does not verify the tag of the ciphertext. Only use this if you know what you're doing.
    ///
    /// # Arguments
    ///
    /// * `explicit_nonce`: The explicit nonce to use for the keystream.
    /// * `ciphertext`: The ciphertext to verify.
    async fn verify_plaintext_no_tag(
        &mut self,
        explicit_nonce: Vec<u8>,
        ciphertext: Vec<u8>,
    ) -> Result<(), AeadError>;
}
