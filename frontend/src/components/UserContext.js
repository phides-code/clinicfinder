import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [invalidUser, setInvalidUser] = useState(null);
  const [requestAppointment, setRequestAppointment] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);

  // const [validUsername, setValidUsername] = useState(true);
  // const [allUsers, setAllUsers] = useState([]);

  return (
    <UserContext.Provider value={{
      currentUser, 
      setCurrentUser,
      requestAppointment, setRequestAppointment,
      messageSuccess, setMessageSuccess
      // validUsername, 
      // setValidUsername,
      // allUsers, 
      // setAllUsers,
    }}>
      {children}
    </UserContext.Provider>
  );
};
