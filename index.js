#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var discordDir = '/home/pi/CompilerDiscord';
var adminDir = '/home/pi/AdminCompilerServer';
var logFilePath = path_1.default.resolve(discordDir, 'log');
var adminlogFilePath = path_1.default.resolve(discordDir, 'adminlog');
var logJsonFilePath = path_1.default.resolve(adminDir, 'log.json');
var adminlogJsonFilePath = path_1.default.resolve(adminDir, 'adminlog.json');
var logFileSize = 0;
var adminlogFileSize = 0;
var logJson = [];
fs_1.default.readFile(logJsonFilePath, function (err, data) {
    if (err)
        console.log(err);
    else {
        var jsonData = JSON.parse(data.toString());
        if (Array.isArray(jsonData)) {
            logJson.concat(jsonData);
        }
        else if (typeof jsonData === 'object' && jsonData != null) {
            logJson.push(jsonData);
        }
    }
});
var adminlogJson = [];
fs_1.default.readFile(adminlogJsonFilePath, function (err, data) {
    if (err)
        console.log(err);
    else {
        var jsonData = JSON.parse(data.toString());
        if (Array.isArray(jsonData)) {
            adminlogJson.concat(jsonData);
        }
        else if (typeof jsonData === 'object' && jsonData != null) {
            adminlogJson.push(jsonData);
        }
    }
});
fs_1.default.readFile(logFilePath, function (err, data) {
    if (err)
        console.log(err);
    else {
        logFileSize = data.toString().length;
    }
});
fs_1.default.readFile(adminlogFilePath, function (err, data) {
    if (err)
        console.log(err);
    else {
        adminlogFileSize = data.toString().length;
    }
});
fs_1.default.watchFile(logFilePath, function (curr, prev) {
    fs_1.default.readFile(logFilePath, function (err, data) {
        if (err)
            console.log(err);
        else {
            var fileChange = data.toString().slice(logFileSize);
            var logInstance = {
                category: 'info',
                value: fileChange,
                timestamp: curr.mtimeMs
            };
            logJson.push(logInstance);
            fs_1.default.writeFile(logJsonFilePath, JSON.stringify(logJson), function (err) {
                if (err)
                    console.log(err);
            });
            logFileSize = data.toString().length;
        }
    });
});
fs_1.default.watchFile(adminlogFilePath, function (curr, prev) {
    fs_1.default.readFile(adminlogFilePath, function (err, data) {
        if (err)
            console.log(err);
        else {
            var fileChange = data.toString().slice(adminlogFileSize);
            var logInstance = {
                category: 'info',
                value: fileChange,
                timestamp: curr.mtimeMs
            };
            adminlogJson.push(logInstance);
            fs_1.default.writeFile(adminlogJsonFilePath, JSON.stringify(adminlogJson), function (err) {
                if (err)
                    console.log(err);
            });
            adminlogFileSize = data.toString().length;
        }
    });
});
