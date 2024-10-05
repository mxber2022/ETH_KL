"use client"

import { useRouter } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"
import Stepper from "@/components/Stepper"
import LogsContext from "@/context/LogsContext"
import Image from "next/image"
import { Identity } from "@semaphore-protocol/core"

export default function GroupPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const [_loading, setLoading] = useState(false)
    const [_submitted, setSubmitted] = useState(false)
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const privateKey = localStorage.getItem("identity")

        if (privateKey) {
            const identity = new Identity(privateKey)

            setLogs("Your Semaphore identity has been retrieved from the browser cache 👌🏽")

            setIdentity(identity)
        } else {
            const identity = new Identity()

            localStorage.setItem("identity", identity.privateKey.toString())

            setLogs("Your new Semaphore identity has just been created 🎉")

            setIdentity(identity)
        }
    }, [setLogs])

    const submitAttestation = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!_identity) {
            return
        }

        const file = event.target.files?.[0];

        if (!file) {
            setLogs('Please select a file.');
            return;
        }

        if (file.type !== 'application/json') {
            setLogs('Please upload a valid JSON file.');
            return;
        }

        setLoading(true)

        setLogs(`Submitting TLSN attestation...`)

        const fileContent = await file.text();

        let response = await fetch("api/prove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "proof": JSON.parse(fileContent),
                "identityCommitment": {
                    "commit": _identity.commitment.toString()
                }
            })
        })

        if (response.status === 200) {
            setLogs(`You proved that you've booked this hotel before!`)
            setSubmitted(true)

            let data = await response.json()
            localStorage.setItem("signature", data.signature.toString())

            router.push("/group")
        } else {
            setLogs("Some error occurred, please try again!")
        }

        setLoading(false)
    }, [setLogs, _identity])

    const triggerFileInput = useCallback(async () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.click()
    }, []);

    return (
        <>
            <h2>Prove Yourself</h2>
            <div className="summary">
                To post a review, you must first prove that you have previously booked{" "}
                <a
                    href="https://www.agoda.com/v-hotel-bencoolen/hotel/singapore-sg.html"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                >
                    V Hotel Bencoolen
                </a>{" "} in Agoda.
            </div>

            <div className="summary">
                You need to obtain a{" "}
                <a
                    href="https://tlsnotary.org"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                >
                    TLSNotary
                </a>{" "}
                attestation by using the{" "}
                <a
                    href="https://chromewebstore.google.com/detail/tlsn-extension/gcfkkledipjbgdbimfpijgbkhajiaaph"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                >
                    TLSN extension
                </a>{" "}
                on the Agoda website.
            </div>

            <div className="banner-container">
                <Image
                    src="/tlsn-banner.png"
                    alt="tlsn logo"
                    width={500}
                    height={200}
                    priority={true}
                />
            </div>

            <div className="summary">
                Then, submit the attestation file below.
            </div>

            <div className="divider"></div>

            <div>
                <input
                    type="file"
                    id="fileInput"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={submitAttestation}
                />
                <button
                    className="button"
                    type="submit"
                    disabled={_loading || _submitted }
                    onClick={triggerFileInput}
                >
                    <span>
                        {
                            !_submitted
                                ? (_loading ? 'Uploading...' : 'Upload TLSN Attestation')
                                : 'Submitted!'
                        }
                    </span>
                </button>
                {_loading && <div className="loader"></div>}
            </div>

            <div className="divider"></div>

            <Stepper
                step={2}
                onPrevClick={() => router.push("/")}
            />
        </>
    )
}
