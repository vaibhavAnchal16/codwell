import {
  getAllClient,
  getAllClients,
  getClientByName,
} from "./queries/clients/clientQueries";
import {
  myAllFavorites,
  userFavorites,
} from "./queries/favorites/favoritesQueries";
import { testMessages } from "./queries/messages/messagesQueries";
import {
  getAllUsersProfileQuery,
  getUserProfileQuery,
} from "./queries/profiles/profileQueries";
import {
  getMyTests,
  getTestDetail,
  getTestsByClient,
} from "./queries/tests/testQueries";

Meteor.startup(() => {
  if (Meteor.isServer) {
    getUserProfileQuery.expose();
    getAllUsersProfileQuery.expose();

    getAllClients.expose();
    getClientByName.expose();
    getAllClient.expose();

    getTestsByClient.expose();

    getTestDetail.expose();
    getMyTests.expose();

    userFavorites.expose();
    myAllFavorites.expose();
    testMessages.expose();
  }
});
