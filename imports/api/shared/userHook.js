import React, { createContext, useContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(true);
  useTracker(() => {
    if (Meteor.userId()) {
      setEmail(Meteor.user()?.emails[0]?.address);
    }
  }, []);
  return (
    <UserContext.Provider value={{ email, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
