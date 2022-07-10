import React from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const client_id =
  "580007398769-mj0kg9hh42h4n0cep3evvm64lfb5vtpn.apps.googleusercontent.com";
export const Logout = () => {
  const navigate = useNavigate();
  const logoutHandler = async (res) => {
    try {
      await axios.get("/api/v1/users/logout");
      navigate("/login");
    } catch (err) {}
  };
  const onSuccess = async (res) => {
    try {
      await axios.get("/api/v1/users/logout");
      navigate("/login");
    } catch (err) {}
  };

  return (
    <div onClick={logoutHandler} className="row d-flex justify-content-center">
      <div className="col-md-1 col-sm-10 p-2 ">
        <GoogleLogin
          clientId={client_id}
          buttonText="Logout"
          onLogoutSuccess={onSuccess}
        />
      </div>
    </div>
  );
};
export default Logout;
