import {ReactNode, useContext} from "react";
import { Navigate } from "react-router-dom";
import {Ctx} from "../context/context.tsx";

const ProtectedRoute = ({children}: {children: ReactNode}) => {

    const context = useContext(Ctx);
    const isAuthtenticated = context?.state?.user.isAuthenticated;

    return isAuthtenticated ? children : <Navigate to="/login" />;

}

export default ProtectedRoute;