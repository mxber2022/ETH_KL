"use client"
import "./Footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faXTwitter, 
    faFacebook, 
    faTelegram, 
    faDiscord, 
    faYoutube, 
    faGithub, 
    faMedium 
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe as faGlobeSolid } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return(
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__copyright">
                    © Copyright 2024
                </div>
                <div className="footer__links">
                    <a href="https://snap.com/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGlobeSolid} /> Website
                    </a>
                    <a href="https://x.com/snap" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faXTwitter} /> 
                    </a>
                    <a href="https://www.facebook.com/snap/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} /> Facebook
                    </a>
                    <a href="https://www.facebook.com/snap/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTelegram} /> Telegram
                    </a>
                    <a href="https://discord.com/invite/snap" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faDiscord} /> Discord
                    </a>
                    <a href="https://www.youtube.com/snap" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faYoutube} /> YouTube
                    </a>
                    <a href="https://github.com/snap" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} /> GitHub
                    </a>
                    <a href="https://medium.com/snap" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faMedium} /> Medium
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;