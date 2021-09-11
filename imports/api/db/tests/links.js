import Tests from "./collection";
import Clients from "../clients/collection";
import Favorites from "../favorites/collection";

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

// Tests.addLinks({
//   myfavorites: {
//     collection: Favorites,
//     inversedBy: "tests",
//   },
// });
