import Tests from "../../db/tests/collection";

// Queries
export const getTestsByClient = Tests.createQuery("getTestsByClient", {
  $filters: {
    clientId: "",
  },
  $filter({ filters, params }) {
    if (params.clientId) {
      filters.clientId = params.clientId;
    }
  },
  testName: 1,
  createdAt: 1,
  tags: 1,
  createdBy: 1,
  creatorName: 1,
});
export const getTestDetail = Tests.createQuery("getTestDetail", {
  $filters: {
    _id: "",
  },
  $filter({ filters, params }) {
    if (params.testId) {
      filters._id = params.testId;
    }
  },
  testName: 1,
  testType: 1,
  pageType: 1,
  controlScreenshot: 1,
  mockupScreenshot: 1,
  gitUrl: 1,
  assetsUrl: 1,
  testCases: 1,
  cssCode: 1,
  jsCode: 1,
  htmlCode: 1,
  createdAt: 1,
  clientId: 1,
  client: {
    clientName: 1,
  },
  tags: 1,
  creatorName: 1,
});
export const getMyTests = Tests.createQuery("getMyTests", {
  $filter({ filters, params }) {
    if (params.userId) {
      filters.createdBy = params.userId;
    }
  },
  testName: 1,
  testType: 1,
  pageType: 1,
  controlScreenshot: 1,
  mockupScreenshot: 1,
  gitUrl: 1,
  assetsUrl: 1,
  testCases: 1,
  cssCode: 1,
  jsCode: 1,
  htmlCode: 1,
  createdAt: 1,
  clientId: 1,
  tags: 1,
  client: {
    clientName: 1,
  },
  creatorName: 1,
});
