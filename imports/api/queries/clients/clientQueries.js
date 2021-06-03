import Clients from "../../db/clients/collection";

// Queries
export const getAllClients = Clients.createQuery("getAllClients", {
  $filter({ filters, params }) {
    if (params.clientName) {
      filters.clientName = { $regex: new RegExp(params.clientName) };
    }
  },
  $paginate: true,
  clientName: 1,
  createdAt: 1,
});

export const getAllClientsCount = Clients.createQuery("getAllClientsCount", {
  $filter({ filters, params }) {
    if (params.clientName) {
      filters.clientName = { $regex: new RegExp(params.clientName) };
    }
  },
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
