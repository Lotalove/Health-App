import { Navigate } from "react-router-dom";
import useAuth  from "./useAuth";

const RequireAuth = ({ children }) => {
  const { auth } = useAuth(); // Assume this hook checks if the user is authenticated

  if (!auth.user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;