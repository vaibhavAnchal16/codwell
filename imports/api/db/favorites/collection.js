import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
// import TimestampsSchama from "./shared/timestamps";

// Collection
const Favorites = new Mongo.Collection("favorites");

export default Favorites;
