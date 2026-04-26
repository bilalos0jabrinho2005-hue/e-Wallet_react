import Footer from "../components/index/footer";
import Header2 from "../components/dashboard/header2";
import MainSection2 from "../components/dashboard/mainsection2";

export function DashboardPage(props){
    return(
        <>
        <Header2 userData={props.userData}/>
        <MainSection2 userData={props.userData}/>
        <Footer/>
        </>
    )
}