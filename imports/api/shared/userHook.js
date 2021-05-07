import React, { createContext, useContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { getUsersEmailQuery } from "../queries/profiles/profileQueries";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(true);
  useTracker(() => {
    if (Meteor.userId()) {
      const userQuery = getUsersEmailQuery.clone();
      const userQuerySubs = userQuery.subscribe();
      const user = userQuery.fetchOne();
      setEmail(user?.services?.google?.email);
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
