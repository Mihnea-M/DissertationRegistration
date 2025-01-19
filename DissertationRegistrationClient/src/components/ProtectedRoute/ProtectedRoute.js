import React from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

import AuthContext from "../../providers/AuthProvider";

function ProtectedRoute({ allowedRole }) {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user === null || (allowedRole && user.role !== allowedRole)) {
      toast.error("You are not allowed to access this page");
      navigate("/");
    }
  }, [user]);
  return <Outlet />;
}

export default ProtectedRoute;
