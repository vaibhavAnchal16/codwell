import Clients from "../clients/collection";
import Favorites from "../favorites/collection";
import Messages from "../messages/collections";
import Tests from "./collection";

Tests.addLinks({
  client: {
    type: "one",
    collection: Clients,
    field: "clientId",
  },
});
Tests.addLinks({
  user: {
    type: "one",
    collection: Meteor.users,
    field: "createdBy",
  },
});

Tests.addLinks({
  myfavorites: {
    collection: Favorites,
    inversedBy: "tests",
  },
});
