import Favorites from "./collection";
import { check } from "meteor/check";
Meteor.methods({
  addToFavorite(obj) {
    check(obj, Object);
    return Favorites.insert(obj);
  },
});
