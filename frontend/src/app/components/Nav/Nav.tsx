"use client"
import "./Nav.css";
import Link from 'next/link';

function Nav() {
    return(
        <nav className="nav">
            <div className="nav__container">
                <div className="nav__left">
                    <div>
                        <Link href="/" style={{ color: 'black', textDecoration: 'none' } }>
                            <div className="nav__logo">
                                ProofOfWin
                                
                            </div>
                            
                        </Link>
                    </div>

                    <div >
                        <Link href="/Donate" style={{ color: 'black', textDecoration: 'none' }}>
                            
                        </Link>
                    </div>

                    <div >
                        <Link href="/Bridge" style={{ color: 'black', textDecoration: 'none' }}>
                        
                        </Link>
                    </div>

                    <div >
                        <Link href="/Presentation" style={{ color: 'black', textDecoration: 'none' }}>
                        
                        </Link>
                    </div>

                    <div >
                        <Link href="/Presentation" style={{ color: 'black', textDecoration: 'none' }}>
                        <p className="tagline" > Every Hacker Goes Home Winning 🖤 </p>

                        </Link>
                    </div>

                </div>
                <div className="nav__right">
                <w3m-button />
                </div>
            </div>
        </nav>
    )
}

export default Nav;