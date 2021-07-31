import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [invalidUser, setInvalidUser] = useState(null);

  // const [validUsername, setValidUsername] = useState(true);
  // const [allUsers, setAllUsers] = useState([]);

  return (
    <UserContext.Provider value={{
      currentUser, 
      setCurrentUser,
      // validUsername, 
      // setValidUsername,
      // allUsers, 
      // setAllUsers,
    }}>
      {children}
    </UserContext.Provider>
  );
};
