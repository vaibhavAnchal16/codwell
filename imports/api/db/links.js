// import "../db/tests/links";
// import "../db/clients/links";
// import "../db/favorites/links";

import Clients from "./clients/collection";
import Favorites from "./favorites/collection";
import Tests from "./tests/collection";

if (Meteor.isServer) {
  //   console.log("Metor server");
  //   Tests.addLinks({
  //     client: {
  //       type: "one",
  //       collection: Clients,
  //       field: "clientId",
  //     },
  //   });
  //   Tests.addLinks({
  //     user: {
  //       type: "one",
  //       collection: Meteor.users,
  //       field: "createdBy",
  //     },
  //   });
  //   Favorites.addLinks({
  //     alltests: {
  //       type: "one",
  //       collection: Tests,
  //       field: "testId",
  //     },
  //   });
}
