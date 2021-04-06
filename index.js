#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var discordDir = '/home/pi/CompilerDiscord';
var logFilePath = path_1.default.resolve(discordDir, 'log');
var adminlogFilePath = path_1.default.resolve(discordDir, 'adminlog');
fs_1.default.watchFile(logFilePath, function (curr, prev) {
    var time = new Date(Math.floor(curr.atimeMs));
    console.log(time.getDate());
});
fs_1.default.watchFile(adminlogFilePath, function (curr, prev) {
    console.log(curr.atimeMs);
});
