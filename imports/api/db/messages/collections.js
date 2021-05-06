import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
// import TimestampsSchama from "./shared/timestamps";

// Collection
const Messages = new Mongo.Collection("messages");

export default Messages;
