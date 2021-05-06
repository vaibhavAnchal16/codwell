import React from "react";
import {
  AlbumsOutline,
  CropSharp,
  LayersOutline,
  PowerOutline,
} from "react-ionicons";
import { Link } from "react-router-dom";
import { RouteConstants } from "../../../client/RouteConstants";

function LeftSticky() {
  return (
    <ul className="left-sticky-bar pl-0 ml-0">
      <li className="text-center  mb-4">
        <Link to={RouteConstants.Dashboard}>
          <AlbumsOutline
            color={"#00000"}
            title="Dashboard"
            height="30px"
            width="30px"
          />
        </Link>
      </li>

      <li className="text-center">
        <Link to={RouteConstants.AddClients}>
          <CropSharp
            color={"#00000"}
            title="Clients List"
            height="30px"
            width="30px"
          />
        </Link>
      </li>
      <li className="text-center mt-4">
        <Link to={RouteConstants.AddTest}>
          <LayersOutline
            color={"#00000"}
            title="Add Code"
            height="30px"
            width="30px"
          />
        </Link>
      </li>
      <li className="text-center mt-4">
        <a
          type="button"
          className="d-flex"
          onClick={(_) => {
            Meteor.logout((error) => {
              if (!error) {
                history.push(RouteConstants.Login);
              }
            });
          }}
        >
          <PowerOutline height="30px" width="30px" title="Logout" />
        </a>
      </li>
    </ul>
  );
}

export default LeftSticky;
