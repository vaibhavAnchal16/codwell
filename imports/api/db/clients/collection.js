import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
// Collection
const Clients = new Mongo.Collection("clients");

ClientsSchema = new SimpleSchema({
  clientName: { type: String },
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
});

Clients.attachSchema(ClientsSchema);
export default Clients;
