import Messages from "../../db/messages/collections";

export const testMessages = Messages.createQuery("testMessages", {
  $filter({ filters, params }) {
    if (params.testId) {
      filters.testId = params.testId;
    }
  },
  $options: {
    sort: { createdAt: -1 },
  },
  message: 1,
  commentor: 1,
  createdAt: 1,
});
