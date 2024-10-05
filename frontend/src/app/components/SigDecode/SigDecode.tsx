"use client"
import {ethers} from "ethers"

function SigDecode() {

    function calllme() {
        const privateKeyBytes = [43, 126, 243, 107, 164, 248, 121, 115, 207, 86, 55, 186, 165, 44, 113, 24, 95, 152, 139, 15, 26, 188, 240, 146, 217, 144, 118, 149, 24, 234, 0, 13];
        const privateKeyHex = privateKeyBytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
        console.log("Private Key (Hex):", privateKeyHex);


        const message = "mxber2022";
        const signature = "0x98D9A98AF69D51F9BF56998E36606B61510BDB00E506F27739C6D3888D324FF622C449FAE7090AA0377AA3C18FEBF43C2603715533F89077539F5DE6AA5CCC42";

        // Recover the signer's address from the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);

        console.log("Recovered Address:", recoveredAddress);
        //console.log("Wallet Address:", wallet.address);
        //console.log("Signature is valid:", recoveredAddress === wallet.address);
    }

    

    return(
        <>
            <button onClick={calllme}> verify signature </button>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        </>
    )
}

export default SigDecode

/**
 

{
  43, 126, 243, 107, 164, 248, 121, 115, 207, 86, 55, 186, 165, 44, 113, 24, 95, 152, 139, 15, 26, 188, 240, 146, 217, 144, 118, 149, 24, 234, 0, 13,

  [3696394036342335745084272160162745224747760696844925557880335396249621383200n, 16086147413255653584919553454135521569857186617607846611586694485306048703163n]


   98D9A98AF69D51F9BF56998E36606B61510BDB00E506F27739C6D3888D324FF622C449FAE7090AA0377AA3C18FEBF43C2603715533F89077539F5DE6AA5CCC42 - sig
}
 */