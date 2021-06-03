import Favorites from "../../db/favorites/collection";

export const userFavorites = Favorites.createQuery("userFavorites", {
  $filter({ filters, params }) {
    if (params.testId) {
      filters.testId = params.testId;
    }
    if (params.favoriteBy) {
      filters.favoriteBy = params.favoriteBy;
    }
  },
  testId: 1,
});

export const myAllFavorites = Favorites.createQuery("myAllFavorites", {
  $filter({ filters, params }) {
    if (params.favoriteBy) {
      filters.favoriteBy = params.favoriteBy;
    }
  },
  testId: 1,
  clientId: 1,
  tests: {
    testName: 1,
  },
});
