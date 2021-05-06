import Favorites from "./collection";
import Tests from "./collection";

Favorites.addLinks({
  tests: {
    type: "one",
    collection: Tests,
    field: "testId",
  },
});
