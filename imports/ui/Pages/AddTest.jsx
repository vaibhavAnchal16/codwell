import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { pageTypes, testTypes } from "../Constants";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { RouteConstants } from "../../../client/RouteConstants";
import { WithContext as ReactTags } from "react-tag-input";
import { useToasts } from "react-toast-notifications";
import $ from "jquery";

import { getAllClients } from "../../api/queries/clients/clientQueries";
import { useUser } from "../../api/shared/userHook";

function AddTest(props) {
  const [tags, setTags] = useState([]);
  const [controlScreenshot, setControlScreenshot] = useState("");
  const [mockupScreenshot, setMockupScreenshot] = useState("");
  const { addToast } = useToasts();
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  const { email } = useUser();
  const userName = () => {
    var name = email?.match(/^([^@]*)@/)[1];
    return name;
  };

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags((tags) => [...tags, tag]);
  };
  const pasteScreenshot = (elem) => {
    const targetTag = $(elem.currentTarget).find("img");
    var imageFor = "";
    imageFor = $(elem.currentTarget).hasClass("controlScreenshot")
      ? "controlScreenshot"
      : "mockupScreenshot";
    document.onpaste = function (event) {
      var items = (event.clipboardData || event.originalEvent.clipboardData)
        .items; // might give you mime types
      for (var index in items) {
        var item = items[index];
        if (item.kind === "file") {
          var blob = item.getAsFile();
          var reader = new FileReader();
          reader.onload = function (event) {
            event.preventDefault();
            // console.log(event.target.result); // data url!
            console.log(imageFor);
            if (imageFor === "controlScreenshot") {
              setControlScreenshot(event.target.result);
              $(targetTag).attr("src", event.target.result);
            } else {
              setMockupScreenshot(event.target.result);
              $(targetTag).attr("src", event.target.result);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    };
  };

  const { loading, allClients } = useTracker(() => {
    const query = getAllClients.clone();
    const handle = query.subscribe();
    return {
      loading: !handle.ready(),
      allClients: query.fetch(),
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      clientId: "",
      testName: "",
      testType: "",
      pageType: "",
      gitUrl: "",
      assetsUrl: "",
      testCases: "",
      cssCode: "",
      jsCode: "",
      htmlCode: "",
    },
    onSubmit: async (values) => {
      const {
        clientId,
        testName,
        testType,
        pageType,
        gitUrl,
        assetsUrl,
        testCases,
        cssCode,
        jsCode,
        htmlCode,
      } = values;
      try {
        if (controlScreenshot === "" || mockupScreenshot === "") {
          addToast(`Please add screnshots !!`, {
            appearance: "error",
          });
          return;
        }
        await Meteor.callWithPromise("addTest", {
          clientId,
          testName,
          testType,
          pageType,
          controlScreenshot,
          mockupScreenshot,
          gitUrl,
          assetsUrl,
          testCases,
          tags: tags.map((tg) => tg.text).join(","),
          cssCode,
          jsCode,
          htmlCode,
          createdAt: new Date(),
          createdBy: Meteor.userId(),
          creatorName: userName(),
        });
        addToast(`Code Added !!`, {
          appearance: "success",
        });
        props.history.push(RouteConstants.Dashboard);
        formik.resetForm({ value: "" });
      } catch (error) {
        console.log(error);
      }
      //   alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="login-background">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mx-auto login-outer">
            <div className="addtest-wrapper bg-white shadow w-100 px-3">
              <div className=" mb-3 pb-3 border-bottom text-center">
                <Link
                  className="spiralyze-logo d-line-flex align-items-center justify-content-center"
                  title="Spiralyze"
                  to="/"
                >
                  <svg
                    width="105"
                    height="28"
                    viewBox="0 0 105 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 8.09596V5.32821L11.3267 0L22.4002 5.32821L22.4611 8.13719L11.3124 2.8655L0 8.09596Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M22.4002 27.9999L11.3626 22.733L0 27.9999V25.0555L11.4558 19.8416L19.8914 23.8778V20.8556L11.3924 16.7169L0 22.0522V13.1601L11.396 7.83423L22.4002 13.1012V15.8101L11.4223 10.7127L2.44909 15.0834V17.9595L11.4259 13.8432L22.4002 18.9311V27.9999Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M33.6062 17.86C34.3635 18.2409 35.1992 18.446 36.0493 18.4595C37.0624 18.4595 37.5964 18.0461 37.5964 17.4183C37.5964 16.82 37.1341 16.4761 35.9633 16.0792C34.3433 15.508 33.2741 14.6247 33.2741 13.2278C33.2741 11.5896 34.6766 10.3494 36.9609 10.3494C38.0743 10.3494 38.8723 10.5625 39.447 10.8334L38.956 12.573C38.3262 12.2688 37.6335 12.1124 36.9322 12.116C35.9765 12.116 35.5153 12.5577 35.5153 13.0429C35.5153 13.6554 36.0493 13.9262 37.3217 14.3973C39.0432 15.0239 39.8376 15.9072 39.8376 17.2617C39.8376 18.8729 38.594 20.2402 35.9203 20.2402C34.8069 20.2402 33.7078 19.9411 33.1582 19.6419L33.6062 17.86Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M41.7898 10.6199C42.7752 10.472 43.7714 10.405 44.7681 10.4197C46.1277 10.4197 47.0954 10.6765 47.7465 11.19C48.382 11.674 48.787 12.4725 48.787 13.4136C48.787 14.3546 48.4836 15.1661 47.891 15.6937C47.1396 16.378 46.0261 16.7054 44.7251 16.7054C44.473 16.7111 44.2208 16.6922 43.9725 16.6489V20.0974H41.7898V10.6199ZM43.9725 14.9777C44.2157 15.0236 44.4633 15.0425 44.7108 15.0342C45.8816 15.0342 46.6043 14.4453 46.6043 13.4807C46.6043 12.5974 45.9831 12.0674 44.8697 12.0674C44.5688 12.0569 44.2677 12.0811 43.9725 12.1392V14.9777Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M52.8504 10.4919V20.0978H50.6545V10.4919H52.8504Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M55.2065 10.62C56.1779 10.4792 57.1589 10.4123 58.1407 10.4197C59.5862 10.4197 60.5993 10.6341 61.2922 11.1759C61.8896 11.6317 62.2038 12.316 62.2038 13.1993C62.2038 14.4112 61.3221 15.2521 60.4834 15.5548V15.5972C61.162 15.8681 61.5383 16.4958 61.7844 17.3792C62.0879 18.4768 62.3818 19.7347 62.5646 20.101H60.3102C60.1645 19.816 59.9195 19.0469 59.6448 17.8632C59.37 16.6525 58.9507 16.338 58.0403 16.3239H57.3892V20.101H55.2065V10.62ZM57.3892 14.7527H58.2566C59.3557 14.7527 60.0056 14.211 60.0056 13.3701C60.0056 12.5009 59.3987 12.0451 58.3868 12.0451C58.0526 12.0313 57.718 12.055 57.3892 12.1157V14.7527Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M66.6282 17.6327L65.9341 20.0978H63.6642L66.6282 10.4919H69.5193L72.5562 20.0978H70.1668L69.4154 17.6327H66.6282ZM69.1 16.0074L68.4931 13.9699C68.3198 13.3987 68.1466 12.6861 68.0021 12.1161H67.977C67.8324 12.6861 67.6879 13.4116 67.529 13.9699L66.9507 16.0074H69.1Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M74.3086 10.4919H76.5068V18.2734H80.3776V20.0978H74.3086V10.4919Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M83.0806 20.0978V16.1641L80.0007 10.4919H82.5311L83.5143 12.8004C83.8177 13.4988 84.0352 14.0123 84.2657 14.6389H84.2956C84.5118 14.0406 84.7436 13.4846 85.0327 12.8004L86.0159 10.4919H88.4877L85.2776 16.0934V20.0978H83.0806Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M89.385 18.9295L94.0216 12.3446V12.288H89.8043V10.4919H96.8744V11.7463L92.3347 18.2452V18.3017H96.9473V20.0978H89.385V18.9295Z"
                      fill="#1E91D6"
                    ></path>
                    <path
                      d="M104.581 16.0357H100.997V18.317H105V20.0978H98.7996V10.4919H104.797V12.2727H100.994V14.2749H104.578L104.581 16.0357Z"
                      fill="#1E91D6"
                    ></path>
                  </svg>
                </Link>
              </div>

              <form
                className="w-100 formfields-wrapper"
                onSubmit={formik.handleSubmit}
              >
                <div className="form-group">
                  <label>Client Name</label>
                  <select
                    className="form-control"
                    required
                    name="clientId"
                    {...formik.getFieldProps("clientId")}
                  >
                    <option value=""> Select </option>
                    {allClients?.map((ac) => (
                      <option value={ac._id} key={ac._id}>
                        {ac.clientName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Test Name</label>
                  <input
                    type="text"
                    required
                    name="testName"
                    {...formik.getFieldProps("testName")}
                    className="form-control"
                    placeholder="Test #12 ..."
                  />
                </div>
                <div className="form-group">
                  <label>Test Type</label>
                  <select
                    required
                    className="form-control"
                    name="testType"
                    {...formik.getFieldProps("testType")}
                  >
                    <option value=""> Select </option>
                    {testTypes.map((tt, i) => (
                      <option key={i}> {tt} </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Page Type</label>
                  <select
                    required
                    className="form-control"
                    name="pageType"
                    {...formik.getFieldProps("pageType")}
                  >
                    <option value=""> Select </option>
                    {pageTypes.map((pt, i) => (
                      <option key={i}> {pt} </option>
                    ))}
                  </select>
                </div>
                <div className="form-group w-100 screenshot-wrapper d-flex align-items-center justify-content-between">
                  <div>
                    <label>Control Screenshot</label>
                    <div
                      className=""
                      id="controlScreenshot"
                      className="controlScreenshot"
                      onClick={(e) => pasteScreenshot(e)}
                    >
                      <img className="css" src="" />
                    </div>
                  </div>
                  <div>
                    <label>Mock-up Screenshot</label>
                    <div
                      className=""
                      id="mockupScreenshot"
                      className="mockupScreenshot"
                      onClick={(e) => pasteScreenshot(e)}
                    >
                      <img src="" className="mss" />
                    </div>
                  </div>
                </div>
                <div className="form-group w-100">
                  <label>Add Appropriate tags for this test</label>
                  <ReactTags
                    tags={tags}
                    handleDelete={handleDelete}
                    handleAddition={(tag) => handleAddition(tag)}
                    // handleDrag={this.handleDrag}
                    delimiters={delimiters}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Version Control Link{" "}
                    <small>(gitlab/github/bitbucket etc)</small>
                  </label>
                  <input
                    type="url"
                    {...formik.getFieldProps("gitUrl")}
                    name="gitUrl"
                    className="form-control"
                    placeholder="https://...."
                  />
                </div>
                <div className="form-group">
                  <label>
                    Assets Folder url
                    <small>(Cloudinary)</small>
                  </label>
                  <input
                    type="url"
                    {...formik.getFieldProps("assetsUrl")}
                    name="assetsUrl"
                    className="form-control"
                    placeholder="https://...."
                  />
                </div>
                <div className="form-group w-100">
                  <label>Test Cases (if any)</label>
                  <textarea
                    className="form-control"
                    {...formik.getFieldProps("testCases")}
                    name="testCases"
                    placeholder="Test Cases"
                  ></textarea>
                </div>

                <div className="form-group w-100">
                  <label>Css Code Snippet</label>
                  <div className="card bg-dark">
                    <div className="card-body p-1">
                      <textarea
                        className="form-control border-0 shadow"
                        {...formik.getFieldProps("cssCode")}
                        name="cssCode"
                        rows="10"
                        placeholder="body{background-color:#fff;box-sizing:border-box; }"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-group w-100">
                  <label>JS Code Snippet</label>
                  <div className="card bg-dark">
                    <div className="card-body p-1">
                      <textarea
                        className="form-control border-0 shadow"
                        {...formik.getFieldProps("jsCode")}
                        name="jsCode"
                        rows="10"
                        placeholder="$(document).ready(function(){......})"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-group w-100">
                  <label>HTML Code Snippet</label>
                  <div className="card bg-dark">
                    <div className="card-body p-1">
                      <textarea
                        className="form-control border-0 shadow"
                        {...formik.getFieldProps("htmlCode")}
                        name="htmlCode"
                        rows="10"
                        placeholder="<form><small>Format: 123-45-678</small><br><br></form>s"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="float-bottom-fixed shadow bg-light border-top">
                  <button type="submit" className="create-code-submit">
                    SAVE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTest;

// Tags
// Person's
//
