import Clients from "./collection";
import { check } from "meteor/check";

Meteor.methods({
  addClient(obj) {
    check(obj, Object);
    return Clients.insert(obj);
  },
});
