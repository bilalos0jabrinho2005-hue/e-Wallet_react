
import { DashboardPage } from "./pages/dashboardpage";
import { IndexPage } from "./pages/indexpage";
import { LoginPage } from "./pages/loginpage";
import { useState } from "react";
export default function App(){   
    const [isLoggedIn , setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    
    const handleLogin = (user) => {
        setUserData(user);
        setIsLoggedIn(true);
    };
    
    return(
    <>
    {
      isLoggedIn ? (
        <DashboardPage userData={userData} />
      ) 
      : (
        <LoginPage setIsLoggedIn={handleLogin}/>
      )
    }
    </>
    )
}

