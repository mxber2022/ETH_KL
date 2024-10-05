"use client"
import { ethers } from "ethers";
import { Identity } from "@semaphore-protocol/identity"; // Semaphore's identity package

function SigDecode() {

    function calllme() {
        // Step 1: Semaphore Identity creation
        const privateKeyBytes = [135, 0, 53, 43, 143, 202, 55, 31, 85, 128, 30, 41, 207, 128, 150, 200, 107, 85, 14, 218, 112, 250, 211, 165, 93, 231, 127, 163, 25, 130, 40, 194];
        const privateKeyHex = privateKeyBytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
        console.log("Private Key (Hex):", privateKeyHex);

        // Create a Semaphore identity using the private key
        const identity = new Identity(privateKeyHex);
        
        // Step 2: Derive identity commitment and public key
        const publicKey = identity.publicKey;
        const identityCommitment = identity.commitment;

        console.log("Public Key (Semaphore Identity):", publicKey);
        console.log("Identity Commitment:", identityCommitment);

        // Step 3: Signature and Message Verification
        const message = "mxber2022";
        const signature = "C70EC388D866F17FC174B1B59CD5CFB19F81F594BBDD50898C646D936B92229DF373D27D67CBEC8704AB2DDF7982F7077285BE8957D8ACC3D0DC18CE24B2B684";

        // Recover the signer based on Semaphore’s proof verification (instead of normal message signature)
        // In the Semaphore system, you generally verify a zk-SNARK proof of identity or commitment
        // The verification flow might involve proof verification instead of regular signature comparison

        console.log("To verify signature, zk-SNARK proof or identity verification is needed.");
    }

    return (
        <>
            <button onClick={calllme}>Verify Semaphore Signature</button>
        </>
    )
}

export default SigDecode;
