import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "./context/auth-context";
import { useCallback } from "react";
import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";
import { MenuContext } from "./context/menu-context";

let logoutTimer;

const App = () => {

  const [token, setToken] = useState();
  const [userId, setuserId] = useState();
  const [tokenExp, setTokenExp] = useState();
  const [name, setName] = useState();
  const [role, setRole] = useState();
  const [companyId, setCompanyId] = useState();
  const [labId, setLabId] = useState();
  const [lab_logo_filename, setLab_logo_filename] = useState(null);  

  const login = useCallback((uid, token, name, role, companyid, labid, lab_logo_filename, expirationDate) => {
    setToken(token);
    setuserId(uid);
    setName(name);
    setRole(role);
    setCompanyId(companyid);
    setLabId(labid);
    setLab_logo_filename(lab_logo_filename);

    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExp(tokenExpirationDate);

    localStorage.setItem(
      "userData", JSON.stringify({
        userId: uid, token: token, name: name, role: role, companyId: companyid, labId: labid, lab_logo_filename: lab_logo_filename,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setuserId(null);
    setTokenExp(null);
    setName(null);
    setRole(null);
    setCompanyId(null);
    setLabId(null);
    setLab_logo_filename(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExp) {
      const remainingTime = tokenExp.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExp]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(
        storedData.userId, storedData.token,
        storedData.name, storedData.role, storedData.companyId,
        storedData.labId, storedData.lab_logo_filename, new Date(storedData.expiration)
      );
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/dashboard" exact component={Dashboard}></Route>
        <Redirect to="/dashboard" />;
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact component={LoginPage}></Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div className="App">
      <MenuContext.Provider>
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            token: token,
            userId: userId,
            name: name,
            role: role,
            companyId: companyId,
            labId: labId,
            lab_logo_filename: lab_logo_filename,
            login: login,
            logout: logout,
          }}
        >
          <Router>{routes}</Router>
        </AuthContext.Provider>
      </MenuContext.Provider>
    </div>
  );
};

export default App;
