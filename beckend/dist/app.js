"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passes_routes_1 = __importDefault(require("./routes/passes.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const errorMiddleware_1 = require("./infrastructure/errorMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use("/api", passes_routes_1.default);
app.use("/api", users_routes_1.default);
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
