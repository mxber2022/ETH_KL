"use client"

import { useRouter } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "@/context/SemaphoreContext"
import Image from "next/image"
import { Identity } from "@semaphore-protocol/core"

export default function HomePage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const { _reviews, _reviewers } = useContext(SemaphoreContext)
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const privateKey = localStorage.getItem("identity")

        if (privateKey) {
            const identity = new Identity(privateKey)

            setLogs("Your Semaphore identity has been retrieved from the browser cache 👌🏽")

            setIdentity(identity)
        }
    }, [setLogs])

    const createReview = useCallback(async () => {
        if (_identity && reviewerHasJoined(_identity)) {
            router.push("/review")
        } else {
            router.push("/prove")
        }
    }, [router, _reviewers, _identity])

    const reviewerHasJoined = useCallback((identity: Identity) => {
        return _reviewers.includes(identity.commitment.toString())
    }, [_reviewers])

    return (
        <>
            <h2 className="font-size: 3rem;">Authentic, Anonymous Hotel Reviews</h2>

            <div className="summary">
                All reviews are cryptographically guaranteed to be posted by reviewers who previously booked
                their hotels on{" "}
                <a
                    href="https://agoda.com"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                >
                    Agoda
                </a>{""}.
            </div>

            <div className="divider"></div>

            <div className="text-top">
                <h3><a
                        href="https://www.agoda.com/v-hotel-bencoolen/hotel/singapore-sg.html"
                        target="_blank"
                        rel="noreferrer noopener nofollow"
                    >V Hotel Bencoolen, Singapore</a>
                </h3>
                {_reviews.length > 0 && (
                    <button className="button-link" onClick={createReview}>
                        Add Review
                    </button>
                )}
            </div>

            <div className="image-container">
                <Image
                    src="https://pix8.agoda.net/hotelImages/433173/-1/830fe0338a493daade4983f2e0011966.jpg?ca=7&ce=1&s=450x302"
                    alt="hotel picture"
                    width={405}
                    height={302}
                    priority={true}
                />
            </div>

            {_reviews.length > 0 ? (
                <div>
                    {_reviews.map((f, i) => (
                        <div key={i}>
                            <p className="box box-text">{f}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button className="button" onClick={createReview}>
                        Create Review
                    </button>
                </div>
            )}

            <div className="divider"></div>

            <h3>Other hotels...</h3>

        </>
    )
}
