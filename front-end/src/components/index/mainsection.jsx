import Header1 from "../login/header1";
import Footer from "./footer";

export default function Mainsection(){
    return(
        <>
        <section className="hero">
      <div className="hero-content" id="main">
        <h1>E-Wallet</h1>
        <p>Gérez vos finances facilement et en toute sécurité. Simplifiez vos paiements et transactions grâce à notre solution moderne.</p>
        <div className="buttons">
          <button className="btn btn-primary" id="Loginbtn" >Login</button>
          <button className="btn btn-secondary" id="Signinbtn">Sign in</button>
        </div>
      </div>
      <div className="hero-image">
        <img src="" alt="E-Wallet Illustration"/>
      </div>
    </section>
   
        </>
    )
}