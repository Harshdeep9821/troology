import React, { useState, useContext } from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "./useContext/UserContext";

const client_id =
  "580007398769-mj0kg9hh42h4n0cep3evvm64lfb5vtpn.apps.googleusercontent.com";
export const Login = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [token, setToken] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const { updateUserData, userData } = useContext(UserDataContext);

  const addressHandler = (e) => {
    setAddress(e.target.value);
  };
  const mobileHandler = (e) => {
    setMobileNumber(e.target.value);
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("/api/v1/users/register", {
        token,
        address,
        mobileNumber,
      });
      updateUserData(res.data.data.user);
      navigate("/");
    } catch (error) {}
  };
  const login = async () => {
    try {
      const res = await axios.post("/api/v1/users/login", {
        token,
      });
      updateUserData(res.data.data.user);

      navigate("/");
    } catch (error) {
      setIndex(0);
    }
  };
  const checkUser = async (email) => {
    try {
      await axios.post("/api/v1/users/check", {
        email,
      });
      login();
    } catch (error) {
      setIndex(1);
    }
  };

  const onSuccess = async (res) => {
    await checkUser(res.profileObj.email);
    setToken(res.tokenId);
  };

  const onFailure = (res) => {
    alert(`Failed to login.`);
    navigate("/login");
  };

  return (
    <div>
      {index === 0 ? (
        <div className="row d-flex justify-content-center">
          <div className="col-md-2 m-5 col-sm-8 ">
            <GoogleLogin
              clientId={client_id}
              buttonText="Google Login"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              style={{ marginTop: "100px" }}
              isSignedIn={false}
            />
          </div>
        </div>
      ) : index === 1 ? (
        <div className="row d-flex justify-content-center text-center  ">
          <div className="col-md-4 col-sm-10 p-2 my-5 rounded border bg-white rounded">
            <Form className="" onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Enter Your Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Your Address"
                  onChange={addressHandler}
                  value={address}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Enter your Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Mobile Number"
                  onChange={mobileHandler}
                  value={mobileNumber}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Register
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default Login;
