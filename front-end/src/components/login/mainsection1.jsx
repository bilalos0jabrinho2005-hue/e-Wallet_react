import { useState } from "react";
import Header1 from "./header1";
import Footer from "../index/footer";
import { findbeneficiarieByid,getbeneficiaries,finduserbymail,finduserbyaccount} from "../../../database";
export default function Mainsection1(props) {

    const [password , setPassword] = useState("");
    const [email , setEmail] = useState("");
    const user = finduserbymail(email,password);
    const handleLogin = () => {
    if (user) {
      props.setIsLoggedIn(true);
    } else {
      props.setIsLoggedIn(false);
    }
  };

  return (
          <>
            <main>
                <section className="hero">
                    <div className="hero-content">
                        <h1>Connexion</h1>
                        <p>Accédez à votre E-Wallet en toute sécurité et gérez vos transactions en toute confiance.</p>
                    <div id="error"></div>
                        <form className="login-form">
                    <div className="input-group">
                    <input id="mail" type="email" placeholder="Adresse e-mail" required onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className="input-group">
            <input id="password" type="password" placeholder="Mot de passe" required onChange={(e)=>setPassword(e.target.value)}/>
            <span id="display" className="toggle-password">👁</span>
          </div>
          <p id="result"></p>
          <button id="submitbtn" type="button" className="btn btn-primary" onClick={handleLogin}>Se connecter</button>
        </form>
        <p style={{ marginTop: "15px", fontSize: "0.9rem" }}>
          Vous n'avez pas encore de compte ?
        </p>
      </div>

      <div className="hero-image">
        <img src={null} alt="Illustration de connexion"/>
      </div>

    </section>
  </main>
        </>
  );
}