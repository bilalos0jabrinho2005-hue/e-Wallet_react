import Logo from '../assets/e-wallet-logo.avif'
export default function Header2(){
    return(
        <>
        <nav className="navbar">
      <a href="/src/view/index.html" className="logo">
        <img src={Logo} alt="Logo E-Wallet"/>
      </a>
      <ul className="nav-links">
      </ul>
        </nav>
        </>
    )
}