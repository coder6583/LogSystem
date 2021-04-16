#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var func = require('./functions');
var discordDir = '/home/pi/CompilerDiscord';
var homeDir = '/home/pi';
var logFilePath = path_1.default.resolve(discordDir, 'log');
var errorlogFilePath = path_1.default.resolve(discordDir, 'errorlog');
var adminlogFilePath = path_1.default.resolve(discordDir, 'adminlog');
var erroradminlogFilePath = path_1.default.resolve(discordDir, 'erroradminlog');
var logJsonFilePath = path_1.default.resolve(homeDir, 'log.json');
var adminlogJsonFilePath = path_1.default.resolve(homeDir, 'adminlog.json');
var logFileSize = 0;
var errorlogFileSize = 0;
var adminlogFileSize = 0;
var erroradminlogFileSize = 0;
var logJson = [];
logJson = func.initLog(logJsonFilePath);
var adminlogJson = [];
adminlogJson = func.initLog(adminlogJsonFilePath);
logFileSize = func.initFileSize(logFilePath);
errorlogFileSize = func.initFileSize(errorlogFilePath);
adminlogFileSize = func.initFileSize(adminlogFilePath);
erroradminlogFileSize = func.initFileSize(erroradminlogFilePath);
fs_1.default.watchFile(logFilePath, function (curr, prev) {
    logFileSize = func.updateLog(logFilePath, logJsonFilePath, logFileSize, curr.mtimeMs, logJson, false, 'main');
});
fs_1.default.watchFile(errorlogFilePath, function (curr, prev) {
    errorlogFileSize = func.updateLog(errorlogFilePath, logJsonFilePath, errorlogFileSize, curr.mtimeMs, logJson, true, 'main');
});
fs_1.default.watchFile(adminlogFilePath, function (curr, prev) {
    adminlogFileSize = func.updateLog(adminlogFilePath, adminlogJsonFilePath, adminlogFileSize, curr.mtimeMs, adminlogJson, false, 'admin');
});
fs_1.default.watchFile(erroradminlogFilePath, function (curr, prev) {
    erroradminlogFileSize = func.updateLog(erroradminlogFilePath, adminlogJsonFilePath, erroradminlogFileSize, curr.mtimeMs, adminlogJson, true, 'admin');
});
