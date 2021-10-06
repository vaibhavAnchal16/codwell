import React, { useEffect, useState } from "react";
import TopHeader from "../Components/TopHeader";
import {
  BanOutline,
  ChatboxOutline,
  CheckmarkCircleOutline,
  ChevronForwardOutline,
  CloseCircleOutline,
  HeartOutline,
  LayersSharp,
  PushSharp,
  SearchCircleOutline,
  TvOutline,
} from "react-ionicons";
import { useTracker } from "meteor/react-meteor-data";
import { useHistory } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Modal from "react-bootstrap4-modal";
import qs from "query-string";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToasts } from "react-toast-notifications";
import SpzLoader from "../Components/SpzLoader";
import LeftSticky from "../Components/LeftSticky";
import {
  getAllClients,
  getAllClientsCount,
} from "../../api/queries/clients/clientQueries";
import {
  getTestDetail,
  getTestsByClient,
} from "../../api/queries/tests/testQueries";
import { useUser } from "../../api/shared/userHook";
import { userFavorites } from "../../api/queries/favorites/favoritesQueries";
import { testMessages } from "../../api/queries/messages/messagesQueries";

function Dashboard(props) {
  const [searchClient, setSearchClient] = useState("");
  const [searchTest, setSearchTest] = useState(false);
  const [action, setAction] = useState(false);
  const [loaderFavorite, setLoaderFavorite] = useState(false);
  // const [perPage, setPerPage] = useState(10);
  // const [skip, setSkip] = useState(0);
  // const [page, setPage] = useState(1);
  const [modalScreen, setModalScreen] = useState("");
  const history = useHistory();
  const { addToast } = useToasts();
  const { email } = useUser();
  const queryParam = qs.parse(props.location.search);
  useEffect(() => {}, []);
  const { loading, allClients, allTests, clientsCount } = useTracker(() => {
    const parsed = qs.parse(props.location.search);
    const query = getAllClients.clone({
      clientName: searchClient.toString().toLowerCase(),
      // limit: perPage,
      // skip: (page - 1) * perPage,
    });
    const clientCountQuery = getAllClientsCount.clone({
      clientName: searchClient.toString().toLowerCase(),
    });
    const queryTests = getTestsByClient.clone({
      clientId: parsed.clientId,
    });
    const handle =
      query.subscribe() &&
      queryTests.subscribe() &&
      clientCountQuery.subscribe();
    return {
      loading: !handle.ready(),
      allClients: query.fetch(),
      allTests: queryTests.fetch(),
      clientsCount: clientCountQuery.fetch()?.length,
    };
  }, [searchClient, props.location.search]);

  const { loadingDetails, testDetails } = useTracker(() => {
    const parsed = qs.parse(props.location.search);
    const queryDetail = getTestDetail.clone({
      testId: parsed.testId,
    });
    const handle = queryDetail.subscribe();
    return {
      loadingDetails: !handle.ready(),
      testDetails: queryDetail.fetchOne(),
    };
  }, [props.location.search]);

  const { filteredTests } = useTracker(() => {
    var filteredTests = [];
    if (searchTest.length > 0) {
      let matchesFilter = new RegExp(searchTest.trim(), "i");
      const item = allTests.filter(
        (at) => matchesFilter.test(at.testName) || matchesFilter.test(at.tags)
      );
      filteredTests = item;
    } else {
      filteredTests = allTests;
    }
    return {
      filteredTests,
    };
  }, [searchTest]);
  const { ifFavorite, favoritesLoader } = useTracker(() => {
    const favQuery = userFavorites.clone({
      testId: testDetails?._id,
      favoriteBy: Meteor.userId(),
    });
    const favhandle = favQuery.subscribe();
    return {
      favoritesLoader: !favhandle.ready(),
      ifFavorite: favQuery.fetchOne(),
    };
  }, [loaderFavorite, props.location.search]);

  const { messages, loadingMessages } = useTracker(() => {
    const messageQuery = testMessages.clone({
      testId: testDetails?._id,
      $options: {
        sort: { createdAt: -1 },
      },
    });
    const subscribemessages = messageQuery.subscribe();
    return {
      loadingMessages: !subscribemessages.ready(),
      messages: messageQuery.fetch(),
    };
  }, [props.location.search]);
  const showTests = searchTest.length > 1 ? filteredTests : allTests;
  const userName = (getemail) => {
    var name = getemail.match(/^([^@]*)@/)[1];
    return name;
  };
  const codeBlocks = (code, title, type) => {
    return (
      <div className="code-blocks px-2" style={{ maxWidth: "100%" }}>
        <div className="d-flex align-items-center justify-content-between border-bottom">
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
        <div className="dashboard-inner">
          <Modal
            visible={modalScreen !== "" ? true : false}
            dialogClassName="modal-lg"
          >
            <div className="modal-header">
              <h5
                className="modal-title"
                style={{ textTransform: "capitalize" }}
              >
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
                  src={testDetails?.controlScreenshot}
                  style={{ maxWidth: "100%", width: "100%" }}
                />
              ) : (
                <img
                  src={testDetails?.mockupScreenshot}
                  style={{ maxWidth: "100%", width: "100%" }}
                />
              )}
            </div>
          </Modal>
          <div className="dashboard-inner-content d-flex">
            {/* Clients List */}
            <div className="clients-lists">
              <div className="search-client mb-2">
                <div className="input-group mb-3">
                  <input
                    type="search"
                    id="searchClients"
                    className="form-control"
                    placeholder="Search Clients"
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={(_) =>
                        setSearchClient(
                          document.querySelector("#searchClients").value
                        )
                      }
                    >
                      <SearchCircleOutline
                        color={"#fff"}
                        title="Search"
                        height="25px"
                        width="25px"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="list-group">
                {allClients?.map((ac, i) => (
                  <a
                    href=""
                    id={queryParam?.clientId === ac?._id ? `activeclient` : ``}
                    onClick={(_) => {
                      _.preventDefault();
                      setSearchTest("");
                      const newQueryParam = {
                        ...queryParam,
                        clientId: ac._id,
                        testId: "",
                      };

                      history.push({
                        pathname: `${window.location.pathname}`,
                        search: qs.stringify(newQueryParam),
                      });
                    }}
                    key={`clientnames-${i}`}
                    className="list-group-item list-group-item-action flex-column align-items-start border-0 mb-1"
                  >
                    <div className="d-flex w-100 align-items-center">
                      <CheckmarkCircleOutline color={"#00000"} />
                      <p className="mb-0 ml-2">{ac.clientName}</p>
                    </div>
                  </a>
                ))}
                {/* {(clientsCount !== perPage || clientsCount < perPage) && (
                  <button
                    className="btn btn-sm btn-primary mt-1"
                    onClick={(_) => setPerPage(perPage + 10)}
                  >
                    Load More
                  </button>
                )} */}
              </div>
            </div>
            {/* Clients List Ends */}
            {/* Tests Lists */}
            {Object.keys(queryParam).length > 0 && queryParam.clientId !== "" && (
              <div className="tests-lists bg-light">
                <div className="search-tests mb-2">
                  <input
                    type="search"
                    placeholder="Search Tests.."
                    onKeyUp={(e) => setSearchTest(e.currentTarget.value)}
                    className="form-control"
                  />
                </div>
                {showTests?.length > 0 ? (
                  <div className="list-group">
                    {showTests?.map((at, i) => (
                      <a
                        href=""
                        id={queryParam?.testId === at?._id ? `activecode` : ``}
                        onClick={(_) => {
                          _.preventDefault();
                          const newQueryParam = {
                            ...queryParam,
                            testId: at._id,
                          };
                          history.push({
                            pathname: `${window.location.pathname}`,
                            search: qs.stringify(newQueryParam),
                          });
                        }}
                        key={`testnames-${i}`}
                        className="list-group-item list-group-item-action flex-column align-items-start border-0 mb-1"
                      >
                        <div className="d-flex w-100 align-items-center">
                          <CheckmarkCircleOutline color={"#00000"} />
                          <p className="mb-0 ml-2">{at.testName}</p>
                        </div>
                        <span className="d-block text-right">
                          <small>Created By :{at?.creatorName}</small>
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <BanOutline
                      color={"#00000"}
                      title="No tests Found"
                      height="50px"
                      width="50px"
                    />
                    <p className="text-center font-weight-bold mt-3">
                      No Tests Found
                    </p>
                  </div>
                )}
              </div>
            )}
            {!loadingDetails ? (
              <React.Fragment>
                {testDetails && (
                  <div className="code-content-wrapper">
                    <div className="code-content-inner shadow">
                      <div className="p-2 border-bottom d-flex align-items-center justify-content-between">
                        <h4 className="mb-0 text-muted">
                          {testDetails?.client?.clientName}
                          <ChevronForwardOutline color={"#00000"} />
                          <small> {testDetails.testName} </small>
                        </h4>
                        <div className="d-flex align-items-center">
                          {!loaderFavorite ? (
                            <span className="mr-2">
                              {ifFavorite?.testId === testDetails?._id ? (
                                <HeartOutline
                                  color={"red"}
                                  title="Favourited"
                                  height="25px"
                                  width="25px"
                                  style={{ cursor: "pointer" }}
                                  onClick={async (_) => {
                                    setLoaderFavorite(true);
                                    try {
                                      await Meteor.call(
                                        `removeFavorite`,
                                        testDetails?._id
                                      );
                                      addToast(`Removed from your favorites!`, {
                                        appearance: "success",
                                      });
                                      setLoaderFavorite(false);
                                    } catch (error) {
                                      console.log(error);
                                      setLoaderFavorite(false);
                                    }
                                  }}
                                />
                              ) : (
                                <HeartOutline
                                  color={"#00000"}
                                  style={{ cursor: "pointer" }}
                                  title="Favourites"
                                  height="25px"
                                  width="25px"
                                  onClick={async (_) => {
                                    setLoaderFavorite(true);
                                    try {
                                      await Meteor.call(`addToFavorite`, {
                                        favoriteBy: Meteor.userId(),
                                        clientId: testDetails?.clientId,
                                        testId: testDetails?._id,
                                        createdAt: new Date(),
                                      });
                                      addToast(`Added to your favorites!`, {
                                        appearance: "success",
                                      });
                                      setLoaderFavorite(false);
                                    } catch (error) {
                                      console.log(error);
                                      setLoaderFavorite(false);
                                    }
                                  }}
                                />
                              )}
                            </span>
                          ) : (
                            "loading..."
                          )}

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

                      <div className="test-detailing px-2 py-2">
                        <div className="test-detailing-inner">
                          <div className="input-group">
                            <div className="d-flex justify-content-between w-100">
                              <label className="w-100 text-center font-weight-bold pb-2">
                                Control Screen Shot
                              </label>
                            </div>

                            <div
                              className="screenshotwrapper"
                              onClick={(_) => setModalScreen("control")}
                              style={{
                                backgroundImage:
                                  "url(" + testDetails?.controlScreenshot + ")",
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
                              onClick={(_) => setModalScreen("mockup")}
                              style={{
                                backgroundImage:
                                  "url(" + testDetails?.mockupScreenshot + ")",
                              }}
                            ></div>
                          </div>
                        </div>
                        {testDetails?.gitUrl &&
                          testDetails?.gitUrl !== "" &&
                          assetBlocks(
                            testDetails?.gitUrl,
                            "Git Url",
                            <PushSharp
                              color={"#1e91d6"}
                              title="Git Code Url"
                              height="20px"
                              width="20px"
                            />
                          )}
                        {testDetails?.assetsUrl &&
                          testDetails?.assetsUrl !== "" &&
                          assetBlocks(
                            testDetails?.assetsUrl,
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
                    <div className="p-2 d-flex justify-content-between align-items-center bg-light">
                      <div>
                        {testDetails?.tags?.split(",").map((td, i) => (
                          <span
                            className="badge badge-primary mr-1 font-weight-normal"
                            style={{ fontSize: "14px" }}
                            key={i}
                          >
                            {" "}
                            {td}{" "}
                          </span>
                        ))}
                      </div>
                      {testDetails?.testCases && (
                        <div>
                          <a
                            data-toggle="collapse"
                            href="#collapseExample"
                            role="button"
                            className="text-primary font-weight-bold"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                          >
                            SHOW TEST CASES
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="pl-2 pr-2">
                      <div className="collapse mt-2" id="collapseExample">
                        <div className="card card-body">
                          {testDetails?.testCases}
                        </div>
                      </div>
                    </div>

                    {testDetails?.jsCode !== undefined &&
                      testDetails?.jsCode !== "" &&
                      codeBlocks(
                        testDetails?.jsCode,
                        "Javascript / Jquery Code",
                        "javascript"
                      )}
                    {testDetails?.cssCode !== undefined &&
                      testDetails?.cssCode !== "" &&
                      codeBlocks(testDetails?.cssCode, "Css Code", "css")}

                    {testDetails?.htmlCode !== undefined &&
                      testDetails?.htmlCode !== "" &&
                      codeBlocks(testDetails?.htmlCode, "HTML Code", "css")}

                    {/* MESSAGE */}
                    <div className="floating-messanger-wrapper">
                      <div className="floating-messanger-inner">
                        {action ? (
                          <div className="floating-form bg-light">
                            <div className="text-right close-icon-floating">
                              {" "}
                              <CloseCircleOutline
                                onClick={(_) => setAction(!action)}
                                color={"red"}
                                height="25px"
                                width="25px"
                              />
                            </div>
                            <form
                              className=""
                              onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                  await Meteor.call("addMessage", {
                                    type: "message",
                                    message: e.currentTarget.message.value,
                                    testId: testDetails._id,
                                    clientId: testDetails?.clientId,
                                    commentor: email,
                                    createdAt: new Date(),
                                    createdBy: Meteor.userId(),
                                  });
                                  setAction(false);
                                  addToast(`New Comment Added!`, {
                                    appearance: "success",
                                  });
                                } catch (error) {
                                  setAction(false);
                                  console.log(error);
                                }
                              }}
                            >
                              <label className="font-weight-bold text-center d-block">
                                Leave a comment
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="message"
                                placeholder="Write something..."
                              />
                              <button className="btn btn-primary btn-sm mx-auto d-flex align-items-center mt-2">
                                Leave a Comment
                              </button>
                            </form>
                            <div className="messages-wrapper mt-2 custom-scollbar">
                              {messages?.length > 0 &&
                                messages?.map((msg, i) => (
                                  <div className="comment-box" key={i}>
                                    <p> {msg.message} </p>
                                    <div className="d-flex justify-content-between message-meta">
                                      <span className="user">
                                        Sent by :{" "}
                                        <i> {userName(msg.commentor)}</i>
                                      </span>
                                      <span className="time">
                                        {moment(msg.createdAt).fromNow()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <div className="floating-action">
                            <button
                              className="btn btn-danger"
                              onClick={(_) => setAction(!action)}
                            >
                              <ChatboxOutline
                                color={"#00000"}
                                title="Leave a Comment"
                                height="25px"
                                width="25px"
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* MESSAGE */}
                  </div>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <SpzLoader />
              </React.Fragment>
            )}

            {/* Code Wrapper Ends */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
