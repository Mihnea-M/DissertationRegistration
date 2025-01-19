import React from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import AuthContext from "../../providers/AuthProvider";

function PublicRoute() {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user !== null) {
      toast.error("You are already logged in");
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default PublicRoute;
