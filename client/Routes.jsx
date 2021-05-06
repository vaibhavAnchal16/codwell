import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Hello from "../imports/ui/Hello";
import AuthRoutes from "./AuthRoutes";
import PublicRoutes from "./PublicRoutes";
import Login from "../imports/ui/Login";
import AddClient from "../imports/ui/Pages/AddClient";
import { RouteConstants } from "./RouteConstants";
import AddTest from "../imports/ui/Pages/AddTest";
import Dashboard from "../imports/ui/Pages/Dashboard";
import { ToastProvider } from "react-toast-notifications";
import UserProvider from "../imports/api/shared/userHook";
import MyTests from "../imports/ui/Pages/MyTests";
import MyFavorites from "../imports/ui/Pages/MyFavorites";
import EditTest from "../imports/ui/Pages/EditTest";

const MyCustomToast = ({ appearance, children }) => (
  <div
    className={
      appearance === "error"
        ? `toastify-wrapper error bg-danger shadow`
        : `toastify-wrapper success bg-success shadow`
    }
  >
    {children}
  </div>
);

const Routes = () => {
  return (
    <UserProvider>
      <ToastProvider
        autoDismiss={true}
        autoDismissTimeout={2000}
        components={{ Toast: MyCustomToast }}
      >
        <Router>
          <Switch>
            <PublicRoutes exact path={RouteConstants.Login} component={Login} />
            {/* <AuthRoutes exact path="/hello" component={Hello} /> */}
            <AuthRoutes
              exact
              path={RouteConstants.AddClients}
              component={AddClient}
            />
            <AuthRoutes
              exact
              path={RouteConstants.AddTest}
              component={AddTest}
            />
            <AuthRoutes
              exact
              path={RouteConstants.Dashboard}
              component={Dashboard}
            />
            <AuthRoutes
              exact
              path={RouteConstants.MyTests}
              component={MyTests}
            />
            <AuthRoutes
              exact
              path={RouteConstants.MyFavorites}
              component={MyFavorites}
            />
            <AuthRoutes
              exact
              path={RouteConstants.EditTest}
              component={EditTest}
            />
          </Switch>
        </Router>
      </ToastProvider>
    </UserProvider>
  );
};

export default Routes;
