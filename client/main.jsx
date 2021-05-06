import React from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import "../imports/libs/callWithPromise";
import Routes from "./Routes";
import "../node_modules/bootstrap/dist/css/bootstrap";
import "../imports/ui/main.css";

Meteor.startup(() => {
  ReactDOM.render(<Routes />, document.getElementById("app"));
});
