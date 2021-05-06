import Clients from "../../db/clients/collection";

// Queries
export const getAllClients = Clients.createQuery("getAllClients", {
  $filter({ filters, params }) {
    if (params.clientName) {
      filters.clientName = { $regex: new RegExp(params.clientName) };
    }
  },
  clientName: 1,
  createdAt: 1,
});

export const getClientByName = Clients.createQuery("getClientByName", {
  $filter({ filters, params }) {
    if (params.clientName) {
      filters.clientName = params.clientName;
    }
  },
  clientName: 1,
  createdAt: 1,
});

export const getAllClient = Clients.createQuery("getAllClient", {
  clientName: 1,
  createdAt: 1,
  createBy: 1,
});
