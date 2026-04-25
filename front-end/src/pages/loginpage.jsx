import Footer from "../components/index/footer";
import Header1 from "../components/login/header1";
import Mainsection1 from "../components/login/mainsection1";

export function LoginPage(props){
    return(
        <>
        <Header1/>
        <Mainsection1 setIsLoggedIn={props.setIsLoggedIn}/>
        <Footer/>
        </>
    )
}