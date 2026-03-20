import * as passesStore from "../store/passes.store";

type PassInput = {
  userName: string;
  reason: string;
  validDate: string;
  comment: string;
  issuer: string;
};

export function getAllPasses() {
  return passesStore.list();
}

export function getPassById(id: string) {
  return passesStore.getById(id);
}

export function createPass(data: PassInput) {
  return passesStore.create(data);
}

export function updatePass(id: string, data: PassInput) {
  return passesStore.update(id, data);
}

export function deletePass(id: string) {
  return passesStore.remove(id);
}