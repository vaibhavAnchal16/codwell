import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
// import TimestampsSchama from "./shared/timestamps";

// Collection
const Profiles = new Mongo.Collection("Profiles");
// Schema
// const ProfilesSchema = new SimpleSchema({
//   userId: String,
//   email: String,
// });

// ProfilesSchema.extend(TimestampsSchama);
// Profiles.attachSchema(ProfilesSchema);

export default Profiles;
