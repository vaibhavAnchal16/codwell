import React, { useEffect, useState } from "react";
import {
  CheckmarkCircleOutline,
  ChevronForwardOutline,
  CloseCircleOutline,
  LayersSharp,
  PushSharp,
  SearchCircleOutline,
} from "react-ionicons";
import { useTracker } from "meteor/react-meteor-data";
import LeftSticky from "../Components/LeftSticky";
import TopHeader from "../Components/TopHeader";
import { myAllFavorites } from "../../api/queries/favorites/favoritesQueries";
import qs from "query-string";
import Modal from "react-bootstrap4-modal";
import CopyToClipboard from "react-copy-to-clipboard";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useToasts } from "react-toast-notifications";
import { getTestDetail } from "../../api/queries/tests/testQueries";
import { useHistory } from "react-router";

function MyFavorites(props) {
  const [modalScreen, setModalScreen] = useState("");
  const queryParam = qs.parse(props.location.search);
  const { addToast } = useToasts();
  const history = useHistory();
  var { tests, loading } = useTracker(() => {
    const queryDetail = myAllFavorites.clone({
      favoriteBy: Meteor.userId(),
    });
    const handle = queryDetail.subscribe();
    return {
      loading: !handle.ready(),
      tests: queryDetail.fetch(),
    };
  }, [Meteor.userId()]);

  var { testDetail } = useTracker(() => {
    const testDetailQuery = getTestDetail.clone({
      testId: queryParam.testId,
    });
    const handle2 = testDetailQuery.subscribe();
    const singleTestDetail = testDetailQuery.fetchOne();

    return {
      testDetail: singleTestDetail,
    };
  }, [queryParam.testId, tests]);

  const codeBlocks = (code, title, type) => {
    return (
      <div className="code-blocks px-2" style={{ maxWidth: "100%" }}>
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="font-weight-bold"> {title}</h4>
          <CopyToClipboard
            text={code}
            onCopy={() =>
              addToast(`${title} Copied`, {
                appearance: "success",
              })
            }
          >
            <button className="d-flex ml-auto my-2 btn btn-outline-primary btn-sm">
              Copy Code
            </button>
          </CopyToClipboard>
        </div>

        <SyntaxHighlighter
          language={type}
          style={docco}
          wrapLines={true}
          showLineNumbers={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const assetBlocks = (url, title, icon) => {
    return (
      <div className="test-detailing-inner">
        <div className="input-group">
          <label className="w-100">{title}</label>
          <div className="input-group-prepend">
            <div className="detail-icon">{icon}</div>
          </div>
          <input
            type="text"
            className="form-control"
            disabled
            defaultValue={url}
          />
          <div className="input-group-append">
            <CopyToClipboard
              text={url}
              onCopy={() =>
                addToast(`${title} Copied`, {
                  appearance: "success",
                })
              }
            >
              <button className="btn btn-outline-secondary" type="button">
                Copy
              </button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="main-dashboard">
      <TopHeader />
      <div className="dashboard-content">
        <div className="dashboard-left-sticky">
          <LeftSticky />
        </div>
        <Modal
          visible={modalScreen !== "" ? true : false}
          dialogClassName="modal-lg"
        >
          <div className="modal-header">
            <h5 className="modal-title" style={{ textTransform: "capitalize" }}>
              {modalScreen} Screnshot
            </h5>
            <CloseCircleOutline
              color={"#00000"}
              title="Close"
              height="25px"
              width="25px"
              style={{ cursor: "pointer" }}
              onClick={(_) => setModalScreen("")}
            />
          </div>
          <div className="modal-body p-0">
            {modalScreen == "control" ? (
              <img
                src={testDetail?.controlScreenshot}
                style={{ maxWidth: "100%", width: "100%" }}
              />
            ) : (
              <img
                src={testDetail?.mockupScreenshot}
                style={{ maxWidth: "100%", width: "100%" }}
              />
            )}
          </div>
        </Modal>
        <div className="dashboard-inner">
          <div className="dashboard-inner-content d-flex">
            {/* Clients List */}
            <div className="clients-lists">
              <div className="search-client mb-2">
                <div className="input-group mb-3">
                  <input
                    type="search"
                    onInput={(_) => setFilterKey(_.currentTarget.value)}
                    id="searchClients"
                    className="form-control"
                    placeholder="Search Tests.."
                  />
                </div>
              </div>
              <div className="list-group">
                {tests?.map((t, i) => (
                  <a
                    href=""
                    id={queryParam?.testId === t?.testId ? `activeclient` : ``}
                    onClick={(_) => {
                      _.preventDefault();
                      const newQueryParam = {
                        ...queryParam,
                        testId: t.testId,
                      };
                      props.history.push({
                        pathname: `${window.location.pathname}`,
                        search: qs.stringify(newQueryParam),
                      });
                    }}
                    key={`clientnames-${i}`}
                    className="list-group-item list-group-item-action flex-column align-items-start border-0 mb-1"
                  >
                    <div className="d-flex w-100 align-items-center">
                      <CheckmarkCircleOutline color={"#00000"} />
                      <p className="mb-0 ml-2">{t?.alltests?.testName}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* DETAILS */}
            <React.Fragment>
              {queryParam?.testId && testDetail && (
                <div className="code-content-wrapper">
                  <div className="code-content-inner shadow">
                    <div className="p-2 border-bottom d-flex align-items-center justify-content-between">
                      <h4 className="mb-0 text-muted">
                        {testDetail?.client?.clientName}{" "}
                        <ChevronForwardOutline color={"#00000"} />
                        <small> {testDetail.testName} </small>
                      </h4>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-danger mr-2"
                          title="Remove from favorites"
                          onClick={async (_) => {
                            const unfav = await Meteor.callWithPromise(
                              "removeFavorite",
                              queryParam?.testId
                            );
                            if (unfav) {
                              addToast("Removed from Favorites", {
                                appearance: "success",
                              });
                              history.push("/myfavorites");
                            }
                          }}
                        >
                          {" "}
                          unfavourite
                        </button>
                        <CopyToClipboard
                          text={window.location.href}
                          onCopy={() =>
                            addToast("Link Copied Successfully", {
                              appearance: "success",
                            })
                          }
                        >
                          <button className="d-flex ml-auto my-2 btn btn-outline-primary btn-sm">
                            Copy Repository Link
                          </button>
                        </CopyToClipboard>
                      </div>
                    </div>
                    <div className="test-detailing px-2 py-4">
                      <div className="test-detailing-inner">
                        <div className="input-group">
                          <div className="d-flex justify-content-between w-100">
                            <label className="w-100 text-center font-weight-bold pb-2">
                              Control Screen Shot
                            </label>
                          </div>

                          <div
                            className="screenshotwrapper"
                            onClick={(_) => {
                              setModalScreen("control");
                            }}
                            style={{
                              backgroundImage:
                                "url(" + testDetail?.controlScreenshot + ")",
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="test-detailing-inner">
                        <div className="input-group">
                          <div className="d-flex justify-content-between w-100">
                            <label className="w-100 text-center font-weight-bold pb-2">
                              Mock Up Screen Shot
                            </label>
                          </div>
                          <div
                            className="screenshotwrapper"
                            onClick={(_) => {
                              setModalScreen("mockup");
                            }}
                            style={{
                              backgroundImage:
                                "url(" + testDetail?.mockupScreenshot + ")",
                            }}
                          ></div>
                        </div>
                      </div>

                      {testDetail?.gitUrl &&
                        testDetail?.gitUrl !== "" &&
                        assetBlocks(
                          testDetail?.gitUrl,
                          "Git Url",
                          <PushSharp
                            color={"#1e91d6"}
                            title="Git Code Url"
                            height="20px"
                            width="20px"
                          />
                        )}
                      {testDetail?.assetsUrl &&
                        testDetail?.assetsUrl !== "" &&
                        assetBlocks(
                          testDetail?.assetsUrl,
                          "Cloudinary Url",
                          <LayersSharp
                            color={"#1e91d6"}
                            title="Assets Url"
                            height="20px"
                            width="20px"
                          />
                        )}
                    </div>
                  </div>

                  {testDetail?.jsCode !== undefined &&
                    testDetail?.jsCode !== "" &&
                    codeBlocks(
                      testDetail?.jsCode,
                      "Javascript / Jquery Code",
                      "javascript"
                    )}
                  {testDetail?.cssCode !== undefined &&
                    testDetail?.cssCode !== "" &&
                    codeBlocks(testDetail?.cssCode, "Css Code", "css")}

                  {testDetail?.htmlCode !== undefined &&
                    testDetail?.htmlCode !== "" &&
                    codeBlocks(testDetail?.htmlCode, "HTML Code", "css")}
                </div>
              )}
            </React.Fragment>
            {/* DETAILS */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyFavorites;
