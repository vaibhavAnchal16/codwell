import React from "react";
import { Route } from "react-router-dom";
import PublicLayout from "../imports/ui/Layouts/PublicLayout";

const PublicRoutes = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <PublicLayout>
          <Component {...props} />
        </PublicLayout>
      )}
    />
  );
};

export default PublicRoutes;
