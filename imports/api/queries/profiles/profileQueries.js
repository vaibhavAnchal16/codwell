import Profiles from "../../db/profiles/collection";

export const getUsersEmailQuery = Meteor.users.createQuery(
  "getUsersEmailQuery",
  {
    services: {
      google: {
        email: 1,
      },
    },
  }
);
