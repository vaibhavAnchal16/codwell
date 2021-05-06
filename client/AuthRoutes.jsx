import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthLayout from "../imports/ui/Layouts/AuthLayout";
import { RouteConstants } from "./RouteConstants";

const AuthRoutes = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <AuthLayout>
          {!Meteor.userId() ? (
            <Redirect to={RouteConstants.Login} />
          ) : (
            <Component {...props} />
          )}
        </AuthLayout>
      )}
    />
  );
};

export default AuthRoutes;
