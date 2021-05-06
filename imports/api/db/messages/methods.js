import Messages from "./collections";
import { check } from "meteor/check";
Meteor.methods({
  addMessage(obj) {
    check(obj, Object);
    return Messages.insert(obj);
  },
});
