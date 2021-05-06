import Tests from "./collection";

Meteor.methods({
  addTest(obj) {
    check(obj, Object);
    return Tests.insert(obj);
  },
});
