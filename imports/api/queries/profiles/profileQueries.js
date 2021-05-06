import Profiles from "../../db/profiles/collection";

export const getUserProfileQuery = Profiles.createQuery("getUserProfileQuery", {
  $filters: {
    email: "",
  },
  $filter({ filters, params }) {
    if (params.email) {
      filters.email = params.email;
    }
  },
  userId: 1,
});

export const getAllUsersProfileQuery = Profiles.createQuery(
  "getAllUsersProfileQuery",
  {
    user: {
      emails: 1,
    },
  }
);
