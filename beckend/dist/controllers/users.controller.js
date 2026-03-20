"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const usersService = __importStar(require("../services/users.service"));
function getAllUsers(req, res) {
    res.json({ items: usersService.getAllUsers() });
}
function getUserById(req, res) {
    const user = usersService.getUserById(String(req.params.id));
    if (!user) {
        return res.status(404).json({ message: "Not found" });
    }
    res.json(user);
}
function createUser(req, res) {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
        return res.status(400).json({ message: "Invalid data" });
    }
    const user = usersService.createUser(req.body);
    res.status(201).json(user);
}
function updateUser(req, res) {
    const updated = usersService.updateUser(String(req.params.id), req.body);
    if (!updated) {
        return res.status(404).json({ message: "Not found" });
    }
    res.json(updated);
}
function deleteUser(req, res) {
    const success = usersService.deleteUser(String(req.params.id));
    if (!success) {
        return res.status(404).json({ message: "Not found" });
    }
    res.status(204).send();
}
