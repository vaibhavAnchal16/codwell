import React from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import {
  AlbumsOutline,
  ChevronBackCircleOutline,
  HeartOutline,
  LayersOutline,
  LogoNodejs,
  PeopleOutline,
  PowerOutline,
} from "react-ionicons";
import { RouteConstants } from "../../../client/RouteConstants";
import { useUser } from "../../api/shared/userHook";

function TopHeader() {
  const { email } = useUser();
  const history = useHistory();
  const userName = () => {
    var name = email?.match(/^([^@]*)@/)[1];
    return name;
  };
  return (
    <div className="d-flex justify-content-between px-2 py-2 border-bottom top-header-wrapper">
      <ul className="d-flex align-items-center header-list pl-0 header-list-actions">
        <li>
          <a
            href=""
            onClick={(_) => {
              _.preventDefault();
              history.goBack();
            }}
          >
            <ChevronBackCircleOutline title="Go Back" />
            Go Back
          </a>
        </li>

        <li className="">
          <NavLink to={RouteConstants.Dashboard} activeClassName="active-route">
            <AlbumsOutline title="Dashboard" />
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to={RouteConstants.MyTests} activeClassName="active-route">
            <PeopleOutline title="My Code Blocks" /> My Code Blocks
          </NavLink>
        </li>
        <li>
          <NavLink
            to={RouteConstants.MyFavorites}
            activeClassName="active-route"
          >
            <HeartOutline title="Favourites" /> My Favorites
          </NavLink>
        </li>
      </ul>
      <ul className="d-flex align-items-center header-list header-list-users">
        {/* <li>
          <form className="mr-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search ..."
            />
          </form>
        </li> */}
        <li>
          <NavLink to={RouteConstants.AddTest} activeClassName="active-route">
            <LayersOutline title="Add Test / Block" />
            Add Test/Code
          </NavLink>
        </li>
        <li>
          <div className="d-flex align-items-center ml-3">
            Hi,{" "}
            <span className="mr-2 ml-2">
              <strong> {userName()} </strong>
            </span>
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
              <PowerOutline title="Logout" color="red" />
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default TopHeader;
