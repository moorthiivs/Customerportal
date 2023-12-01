import React, { useState, useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Avatar, Input, Button, Spinner } from "react-rainbow-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./LoginPage.css";
import background from "../images/background.jpg";
import LoginCard from "../components/LoginCard";
import { AuthContext } from "../context/auth-context";
import config from "../utils/config.json";

const avatarLarge = { width: 110, height: 110 };
const inputStyles = {
  width: 200,
};

const LoginPage = (props) => {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [requestOptions, setOptions] = useState();
  const [error, setError] = useState();
  const [redirect, setRedirect] = useState(false);
  const auth = useContext(AuthContext);
  const [isLoaded, setisLoaded] = useState(true);

  const emailHandler = (e) => {
    var value = e.target.value;
    setEmail(value);
    setError();
  };

  const passwordHandler = (e) => {
    var value = e.target.value;
    setPassword(value);
    setError();
  };

  useEffect(() => {
    setOptions({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });
  }, [email, password]);

  const loginHandler = (event) => {
    event.preventDefault();
    setisLoaded(false);
    fetch(config.SERVER.URL + "/api/users/login/", requestOptions)
      .then(async (response) => {
        const data = await response.json();
        setisLoaded(true);
        //console.log(data);
        if (data) {
          if (data.code === 200) {
            const data1 = data.data;
            //console.log(data1);
            auth.login(
              data1.email,
              data1.token,
              data1.name,
              data1.role,
              data1.companyId,
              data1.labId
            );
            setError();
            setRedirect(true);
          } else {
            setError(data.message);
          }
        }
      })
      .catch((error) => {
        setisLoaded(true);
        setError(error.message);
      });
  };
  if (redirect) {
    return <Redirect to="/dashboard" />;
  } else {
    return (
      <div
        className="background"
        style={{ backgroundImage: `url(${background})` }}
      >
        <LoginCard>
          <div className="flex-center">
            <Avatar
              style={avatarLarge}
              src="images/CalibMaster_Logo2.png"
              assistiveText="CertifyMaster"
              title="CertifyMaster"
            />
            <div className="topgap">
              <Input
                label="Email"
                placeholder="Email Address"
                type="email"
                className="rainbow-p-around_medium"
                style={inputStyles}
                onChange={emailHandler}
              />
              {isLoaded ? null : <Spinner size="medium" />}
              <Input
                label="Password"
                placeholder="**********"
                type="password"
                className="rainbow-p-around_medium"
                style={inputStyles}
                onChange={passwordHandler}
              />
            </div>
            <div className="topgap">
              <Button
                variant="brand"
                className="rainbow-m-around_medium"
                onClick={loginHandler}
              >
                Login &nbsp;
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="rainbow-m-left_medium"
                />
              </Button>
            </div>
          </div>
          <div className="topgap">
            <p className="redcolor">{error}</p>
          </div>
        </LoginCard>
      </div>
    );
  }
};

export default LoginPage;
