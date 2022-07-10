import React, { useEffect, useState, useContext } from "react";
import style from "./dashboard.module.css";
import Logout from "./Logout";

import { UserDataContext } from "./useContext/UserContext";

const DashBoard = () => {
  const { updateUserData, userData } = useContext(UserDataContext);
  return (
    <div>
      <div>
        <div className={`${style.card}  my-5`}>
          <img
            src={userData.photo}
            alt={userData.name}
            style={{ width: "100%" }}
          />
          <h1>{userData.name}</h1>
          <p className={style.title}>{`Mo. ${userData.mobileNumber}`}</p>
          <p className={style.title}>{`Address = ${userData.address}`}</p>
        </div>
      </div>
      <div>
        <Logout style={{ display: "flex", alignItems: "center" }} />
      </div>
    </div>
  );
};

export default DashBoard;
