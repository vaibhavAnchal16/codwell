import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import Clients from "../clients/collection";
import Favorites from "../favorites/collection";

// Collection
const Tests = new Mongo.Collection("tests");

TestsSchema = new SimpleSchema({
  clientId: { type: String },
  testName: { type: String },
  testType: { type: String },
  pageType: { type: String },
  controlScreenshot: { type: String, optional: true },
  mockupScreenshot: { type: String, optional: true },
  gitUrl: { type: String, optional: true },
  assetsUrl: { type: String, optional: true },
  testCases: { type: String, optional: true },
  tags: { type: String, optional: true },
  cssCode: { type: String, optional: true },
  jsCode: { type: String, optional: true },
  htmlCode: { type: String, optional: true },
  createdAt: {
    type: Date,
    autoValue() {
      return new Date();
    },
  },
  createdBy: {
    type: String,
    autoValue() {
      return Meteor.userId();
    },
  },
  creatorName: {
    type: String,
  },
});

Tests.attachSchema(TestsSchema);

Favorites.addLinks({
  alltests: {
    type: "one",
    collection: Tests,
    field: "testId",
  },
});

Favorites.addLinks({
  favorite: {
    type: "one",
    collection: Meteor.users,
    field: "favoriteBy",
  },
});

Tests.addLinks({
  favorites: {
    collection: Favorites,
    inversedBy: "alltests",
  },
});
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

export default Tests;
