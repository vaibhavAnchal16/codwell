import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  getAllClient,
  getClientByName,
} from "../../api/queries/clients/clientQueries";
import { useTracker } from "meteor/react-meteor-data";
import { RouteConstants } from "../../../client/RouteConstants";
import {
  CheckmarkCircleOutline,
  ChevronBackCircleOutline,
} from "react-ionicons";
import qs from "query-string";
import { useToasts } from "react-toast-notifications";
import { Link } from "react-router-dom";

function AddClient(props) {
  const queryParam = qs.parse(props.location.search);
  const { clients, loading } = useTracker(() => {
    const clientsQuery = getAllClient.clone();
    const subs = clientsQuery.subscribe();
    return {
      loading: !subs.ready(),
      clients: clientsQuery.fetch(),
    };
  });
  const { addToast } = useToasts();
  const formik = useFormik({
    initialValues: {
      clientName: "",
    },
    onSubmit: (values) => {
      const { clientName } = values;
      try {
        const query = getClientByName.clone({
          clientName: clientName.toLowerCase(),
        });
        query.getCount(async (_, count) => {
          console.log(count);
          if (count == 0) {
            await Meteor.callWithPromise("addClient", {
              clientName: clientName.toLowerCase(),
              createdAt: new Date(),
              createdBy: Meteor.userId(),
            });
            addToast(`New Client Added`, {
              appearance: "success",
            });
            formik.setFieldValue("clientName", "");
          } else {
            addToast(`Client Already Exists`, {
              appearance: "error",
            });
          }
        });
      } catch (error) {
        addToast(`${error}`, {
          appearance: "error",
        });
      }
    },
  });

  if (loading) {
    return null;
  }
  return (
    <div className="container">
      <div className="col-md-6 mx-auto col-12">
        <Link to={RouteConstants.Dashboard} className="mt-2 d-block">
          <button className="btn btn-sm btn-outline-primary d-flex align-items-center">
            <ChevronBackCircleOutline
              title="Go Back"
              style={{ marginRight: "4px" }}
            />
            Go Back
          </button>
        </Link>
        <div className="card shadow mt-3">
          <div className="card-body">
            <h3 className="text-center font-weight-bold"> Add New Client</h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Client Name"
                  name="clientName"
                  {...formik.getFieldProps("clientName")}
                  // onChange={formik.handleChange}
                  // defaultValue={formik.values.clientName}
                />
              </div>
              <button type="submit" className="btn btn-primary mx-auto d-block">
                Add Now
              </button>
            </form>
          </div>
        </div>

        <div className="card shadow mt-3 all-clients-card custom-scollbar">
          <div className="card-body px-0">
            <h3 className="text-center font-weight-bold"> Clients List</h3>
            <div className="list-group">
              {clients?.map((at, i) => (
                <a
                  href=""
                  onClick={(_) => {
                    _.preventDefault();
                    const newQueryParam = {
                      ...queryParam,
                      clientId: at._id,
                    };
                    props.history.push({
                      pathname: RouteConstants.Dashboard,
                      search: qs.stringify(newQueryParam),
                    });
                  }}
                  key={`testnames-${i}`}
                  className="list-group-item list-group-item-action flex-column align-items-start border-0 mb-1"
                >
                  <div className="d-flex w-100 align-items-center">
                    <CheckmarkCircleOutline color={"#00000"} />
                    <p className="mb-0 ml-2">{at.clientName}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddClient;
