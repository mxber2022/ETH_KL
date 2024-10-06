import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from '../../../utils/verifySignature';

export async function POST(req: NextRequest) {
    console.log("Entering verify endpoint");

    // Parse the request body as JSON
    const reqJson = await req.json();
    console.log("reqJson: ", reqJson);
    // Destructure the necessary parameters from the parsed JSON
    const { idCommit, publicKeyPem, signatureHex } = reqJson;

    // Check for missing parameters
    if (!idCommit || !publicKeyPem || !signatureHex) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Verify the signature
    const isValid = verifySignature(idCommit, publicKeyPem, signatureHex);

    // Return appropriate response based on signature validity
    if (isValid) {
        return NextResponse.json({ message: 'Signature is valid!' }, { status: 200 });
    } else {
        return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
    }
}
