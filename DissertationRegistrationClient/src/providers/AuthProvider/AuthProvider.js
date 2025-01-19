import React from "react";
import { checkSession, login as loginApi, register as registerApi, logout as logoutApi } from "../../api/authenticationApi";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [initialCheckLoading, setInitialCheckLoading] = React.useState(true);

  React.useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await checkSession();
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } finally {
        setLoading(false);
        setInitialCheckLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginApi(username, password);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerApi(userData);
      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await logoutApi();
      if (response.ok) {
        setUser(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!initialCheckLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
