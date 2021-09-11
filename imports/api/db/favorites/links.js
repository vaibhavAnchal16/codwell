import Tests from "../tests/collection";
import Favorites from "./collection";

Favorites.addLinks({
  alltests: {
    type: "one",
    collection: Tests,
    field: "testId",
  },
});
