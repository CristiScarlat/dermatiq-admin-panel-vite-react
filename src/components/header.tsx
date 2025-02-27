import {useContext} from "react";
import {useLocation} from "react-router-dom";
import {Ctx} from "../context/context.tsx"
import { Button } from "react-bootstrap";

const Header = () => {

    const context = useContext(Ctx);
    const location = useLocation();

    const handleLogout = async () => {
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
            if(res.status === 200 && context){
                sessionStorage.removeItem("user");
                context.dispatch({type: "SET_AUTH", payload: {user: {isAuthenticated: false, username: "", role: "user"}}})
            }
        }
        catch(error){
            console.log(error)
        }

    }
    if(context?.state.user.isAuthenticated || location.pathname !== "/login") {
        return(
            <header>
                <Button variant="outline-dark" onClick={handleLogout}>Logout</Button>
            </header>
        )
    }
    return null;
}

export default Header