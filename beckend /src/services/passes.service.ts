import * as passesStore from "../store/passes.store";

type PassInput = {
  userId: number;
  reasonId: number;
  statusId: number;
  validDate: string;
  comment: string;
  issuer: string;
};

export function getAllPasses(currentUserId: number) {
  return passesStore.list(currentUserId);
}

export function getPassById(id: string, currentUserId: number) {
  return passesStore.getById(id, currentUserId);
}

export function createPass(data: PassInput) {
  return passesStore.create(data);
}

export function updatePass(id: string, currentUserId: number, data: PassInput) {
  return passesStore.update(id, currentUserId, data);
}

export function deletePass(id: string, currentUserId: number) {
  return passesStore.remove(id, currentUserId);
}

export function getPassStats(currentUserId: number) {
  return passesStore.getStats(currentUserId);
}