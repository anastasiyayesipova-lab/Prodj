import * as passesStore from "../store/passes.store";

type CurrentUser = {
  userId: number;
  role: string;
};

type PassInput = {
  userId: number;
  reasonId: number;
  statusId: number;
  validDate: string;
  comment: string;
  issuer: string;
};

export function getAllPasses(currentUser: CurrentUser) {
  return passesStore.list(currentUser);
}

export function getPassById(id: string, currentUser: CurrentUser) {
  return passesStore.getById(id, currentUser);
}

export function createPass(data: PassInput) {
  return passesStore.create(data);
}

export function updatePass(id: string, currentUser: CurrentUser, data: PassInput) {
  return passesStore.update(id, currentUser, data);
}

export function deletePass(id: string, currentUser: CurrentUser) {
  return passesStore.remove(id, currentUser);
}

export function getPassStats(currentUser: CurrentUser) {
  return passesStore.getStats(currentUser);
}
