"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
let nextId = 1;
const passes = [];
function list() {
    return passes;
}
function getById(id) {
    return passes.find((p) => p.id === Number(id));
}
function create(data) {
    const newPass = {
        id: nextId++,
        userName: data.userName,
        reason: data.reason,
        validDate: data.validDate,
        comment: data.comment,
        issuer: data.issuer,
    };
    passes.push(newPass);
    return newPass;
}
function update(id, data) {
    const pass = passes.find((p) => p.id === Number(id));
    if (!pass)
        return null;
    pass.userName = data.userName;
    pass.reason = data.reason;
    pass.validDate = data.validDate;
    pass.comment = data.comment;
    pass.issuer = data.issuer;
    return pass;
}
function remove(id) {
    const index = passes.findIndex((p) => p.id === Number(id));
    if (index === -1)
        return false;
    passes.splice(index, 1);
    return true;
}
