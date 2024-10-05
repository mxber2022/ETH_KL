"use client"

import { useState } from "react";
import "./styles.css"
import Image from 'next/image';

function Presentation() {
        const [currentSlide, setCurrentSlide] = useState(0);

        const slides = [
            {
                title: "",
                content: (
                    <>
                        <p><strong>Name:</strong> MX</p>
                        <p><strong>Date:</strong> 06.Oct 2024</p>
                        <p><strong>Project: </strong> ProofOfWin</p>
                        <p><strong>Goal: </strong> Every Hacker Goes Home Winning </p>
                    </>
                ),
            },
            {
                title: "About ProofOfWin",
                content: (
                    <>
                        <h2></h2>
                        <p><strong></strong> The decentralized voting platform is designed for Devfolio hackers, enabling them to cast votes on hackathon projects. Hackers can cast their votes before the winners are officially announced, with voting closing immediately after the announcement. The project with the highest number of votes will receive 50% of the total reward pool as a prize, while the remaining 50% will be distributed among projects that did not win any bounties, ensuring support for all participants. The platform incorporates TLS Notary to verify voter identity, confirming that only legitimate Devfolio hackers can participate in the voting process. </p>
                    </>
                ),
            },
            {
                title: "Why ProofOfWin",
                content: (
                    <>
                        <h2></h2>
                        <p><strong></strong> Every Hacker even who did not win goes home winning </p>
                    </> 
                ),
            },
    
            {
              title: "Design",
              content: (
                  <>
                    <h2></h2>
                    {/* <p><strong> </strong>Snap helps web2 platform like twitter, facebook etc to bring Web3 functionalities like blockchain transactions and smart contract interactions in the form of tweet(twitter) and post(facebook) </p> */}
                    <Image
        src="/TlSNotary.png" // Local image path in the `public` folder or an external link
        alt="Description of the image"
        width={1000} // Width of the image
        height={1000} // Height of the image
      />
                  </> 
              ),
            },
    
    
            {
                title: "Demo",
                content: (
                    <>
                       {/* <h2></h2>
                       <p><strong>Goal:</strong> is to make crosschain donation using wormhole on twitter(post). </p>
                       <p><strong></strong> We will donate 1 USDC from Ethereum sepolia to optimism sepolia. </p>
                       <br></br>
                       <video width="600" controls>
                        <br></br>
                    <source src="/finalsnapha.mov" type="video/mp4" />
                    Your browser does not support the video tag.
                </video> */}
                    </>
                ),
            },

                  
            {
                title: "Thank You",
                content: (
                    <>
                        <h2></h2>
                    </>
                ),
            },
        ];
    
        const nextSlide = () => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        };
    
        const prevSlide = () => {
            setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        };
      return (
        <>
        <header className="header">
                <div className="header__container">
                    <div className="slider">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`slide ${index === currentSlide ? "active" : ""}`}
                            >
                                <h3>{slide.title}</h3>
                                <div>{slide.content}</div>
                            </div>
                        ))}
                    </div>
                    <button className="prev" onClick={prevSlide}>
                        &#10094;
                    </button>
                    <button className="next" onClick={nextSlide}>
                        &#10095;
                    </button>
                </div>
            </header>
        </>
      );
}

export default Presentation;