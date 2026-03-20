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
exports.getAllPasses = getAllPasses;
exports.getPassById = getPassById;
exports.createPass = createPass;
exports.updatePass = updatePass;
exports.deletePass = deletePass;
const passesService = __importStar(require("../services/passes.service"));
function getAllPasses(req, res) {
    res.json({ items: passesService.getAllPasses() });
}
function getPassById(req, res) {
    const pass = passesService.getPassById(String(req.params.id));
    if (!pass) {
        return res.status(404).json({ message: "Not found" });
    }
    res.json(pass);
}
function createPass(req, res) {
    const { userName, reason, validDate, comment, issuer } = req.body;
    if (!userName || !reason || !validDate || !issuer) {
        return res.status(400).json({ message: "Invalid data" });
    }
    const newPass = passesService.createPass(req.body);
    res.status(201).json(newPass);
}
function updatePass(req, res) {
    const updated = passesService.updatePass(String(req.params.id), req.body);
    if (!updated) {
        return res.status(404).json({ message: "Not found" });
    }
    res.json(updated);
}
function deletePass(req, res) {
    const success = passesService.deletePass(String(req.params.id));
    if (!success) {
        return res.status(404).json({ message: "Not found" });
    }
    res.status(204).send();
}
