#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var discordDir = '/home/pi/CompilerDiscord';
var logFilePath = path_1["default"].resolve(discordDir, 'log');
var adminlogFilePath = path_1["default"].resolve(discordDir, 'adminlog');
fs_1["default"].watchFile(logFilePath, function (curr, prev) {
    console.log(curr.atimeMs);
});
fs_1["default"].watchFile(adminlogFilePath, function (curr, prev) {
    console.log(curr.atimeMs);
});
