import {
  getAllClient,
  getAllClients,
  getAllClientsCount,
  getClientByName,
} from "./queries/clients/clientQueries";
import {
  myAllFavorites,
  userFavorites,
} from "./queries/favorites/favoritesQueries";
import { testMessages } from "./queries/messages/messagesQueries";
import { getUsersEmailQuery } from "./queries/profiles/profileQueries";
import {
  getMyTests,
  getTestDetail,
  getTestsByClient,
} from "./queries/tests/testQueries";

Meteor.startup(() => {
  if (Meteor.isServer) {
    getAllClients.expose();
    getClientByName.expose();
    getAllClient.expose();

    getTestsByClient.expose();
    getAllClientsCount.expose();
    getTestDetail.expose();
    getMyTests.expose();

    userFavorites.expose();
    myAllFavorites.expose();
    testMessages.expose();
    getUsersEmailQuery.expose();
  }
});
