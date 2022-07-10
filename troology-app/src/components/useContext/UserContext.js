import React, { createContext, useState } from "react";
export const UserDataContext = createContext({
  updateUserData: () => {},
});

const UserContext = (props) => {
  const [userData, setUserData] = useState({});
  const updateUserData = (data) => {
    setUserData(data);
  };
  return (
    <UserDataContext.Provider value={{ updateUserData, userData }}>
      {props.children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
