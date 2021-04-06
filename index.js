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
var logFileSize = 0;
var adminlogFileSize = 0;
fs_1.default.readFile(logFilePath, function (err, data) {
    if (err) {
        console.log(err);
    }
    else {
        logFileSize = data.toString().length;
    }
});
fs_1.default.readFile(adminlogFilePath, function (err, data) {
    if (err) {
        console.log(err);
    }
    else {
        adminlogFileSize = data.toString().length;
    }
});
fs_1.default.watchFile(logFilePath, function (curr, prev) {
    fs_1.default.readFile(logFilePath, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            var time = new Date(Math.floor(curr.mtimeMs));
            var fileChange = data.toString().slice(logFileSize);
            console.log(fileChange);
            console.log(curr.atimeMs, time.getMinutes());
        }
    });
});
fs_1.default.watchFile(adminlogFilePath, function (curr, prev) {
    console.log(curr.atimeMs);
});
