import Gif from '../assets/e-Wallet6.gif'

export default function Header(){
    return(
        <>
        <nav className="navbar">
        <a href="#" className="logo"><img src="/assets/e-wallet-logo.avif" alt="E-Wallet Logo"/></a>
        <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Contact</a></li>
        </ul>
        </nav>
        </>
    )
}