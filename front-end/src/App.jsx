
import { DashboardPage } from "./pages/dashboardpage";
import { IndexPage } from "./pages/indexpage";
import { LoginPage } from "./pages/loginpage";
import { useState } from "react";
export default function App(){   
    const [isLoggedIn , setIsLoggedIn] = useState(false)
    return(
    <>
    {
      isLoggedIn ? (
        <DashboardPage  />
      ) 
      : (
        <LoginPage setIsLoggedIn={setIsLoggedIn}/>
      )
    }
    </>
    )
}

