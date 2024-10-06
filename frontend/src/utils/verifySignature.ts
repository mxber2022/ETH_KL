// utils/verifySignature.ts
import { ec as EC } from 'elliptic';
import { createHash } from 'crypto';

const ec = new EC('p256');

/**
 * Verifies an ECDSA signature.
 * @param idCommit - The identity commitment to verify.
 * @param publicKeyPem - The public key in PEM format.
 * @param signatureHex - The signature to verify in hex format.
 * @returns {boolean} - Returns true if the signature is valid, false otherwise.
 */
export function verifySignature(
    idCommit: string,
    publicKeyPem: string,
    signatureHex: string
): boolean {
    // Convert identity commitment to bytes (Buffer)
    const idCommitBytes = Buffer.from(idCommit, 'utf-8');

    // Create a key from the public key PEM
    const publicKey = ec.keyFromPublic(publicKeyPem, 'pem');

    // Hash the identity commitment
    const hash = createHash('sha256').update(idCommitBytes).digest();

    // Convert the hex signature to an object
    const signature = {
        r: signatureHex.slice(0, signatureHex.length / 2),
        s: signatureHex.slice(signatureHex.length / 2),
    };

    // Verify the signature
    const isValid = publicKey.verify(hash, signature);

    return isValid;
}
