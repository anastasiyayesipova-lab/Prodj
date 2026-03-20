"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
let nextId = 1;
const users = [];
function list() {
    return users;
}
function getById(id) {
    return users.find((u) => u.id === Number(id));
}
function create(data) {
    const newUser = {
        id: nextId++,
        name: data.name,
        email: data.email,
        role: data.role,
    };
    users.push(newUser);
    return newUser;
}
function update(id, data) {
    const user = users.find((u) => u.id === Number(id));
    if (!user)
        return null;
    user.name = data.name;
    user.email = data.email;
    user.role = data.role;
    return user;
}
function remove(id) {
    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1)
        return false;
    users.splice(index, 1);
    return true;
}
