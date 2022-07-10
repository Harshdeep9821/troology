import React, { useEffect, useState, useContext } from "react";

import { gapi } from "gapi-script";
import Login from "./components/Login";
import IsLoading from "./components/reusableComponent/isLoading/IsLoading";
import Dashboard from "./components/DashBoard";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "./components/useContext/UserContext";

const client_id =
  "580007398769-mj0kg9hh42h4n0cep3evvm64lfb5vtpn.apps.googleusercontent.com";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { updateUserData, userData } = useContext(UserDataContext);

  const getUserDataApi = async () => {
    try {
      const res = await axios.get("/api/v1/users/getUserData");
      navigate("/");
      updateUserData(res.data.user);

      setIsLoading(false);
    } catch (error) {
      navigate("/login");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clinitId: client_id,
        scope: "",
      });
    };
    gapi.load("client:auth2", start);
    getUserDataApi();
  }, []);

  // useEffect(() => {
  //   const start = () => {
  //     gapi.client.init({
  //       clinitId: client_id,
  //       scope: "",
  //     });
  //   };
  //   gapi.load("client:auth2", start);
  // });

  // let accessToken = gapi.auth.getToken().accessToken;
  return (
    <>
      {isLoading ? (
        <IsLoading />
      ) : (
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Dashboard adminData={userData} />} />
        </Routes>
      )}
    </>
    // <div>
    //   <Login />
    //   <Logout />
    // </div>
  );
}

export default App;
