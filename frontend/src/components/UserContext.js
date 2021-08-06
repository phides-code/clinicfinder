import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [requestAppointment, setRequestAppointment] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  
  return (
    <UserContext.Provider value={{
      currentUser, setCurrentUser,
      requestAppointment, setRequestAppointment,
      messageSuccess, setMessageSuccess,
    }}>
      {children}
    </UserContext.Provider>
  );
};
