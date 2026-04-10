import * as usersStore from "../store/users.store";

type UserInput = {
  name: string;
  email: string;
  role: string;
};

export function getAllUsers() {
  return usersStore.list();
}

export function getUserById(id: string) {
  return usersStore.getById(id);
}

export function createUser(data: UserInput) {
  return usersStore.create(data);
}

export function deleteUser(id: string) {
  return usersStore.remove(id);
}

export function updateUser(id: string, data: UserInput) {
  return usersStore.update(id, data);
}