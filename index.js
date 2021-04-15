#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var discordDir = '/home/pi/CompilerDiscord';
var homeDir = '/home/pi';
var logFilePath = path_1.default.resolve(discordDir, 'log');
var errorlogFilePath = path_1.default.resolve(discordDir, 'errorlog');
var adminlogFilePath = path_1.default.resolve(discordDir, 'adminlog');
var erroradminlogFilePath = path_1.default.resolve(discordDir, 'erroradminlog');
var logJsonFilePath = path_1.default.resolve(homeDir, 'log.json');
var adminlogJsonFilePath = path_1.default.resolve(homeDir, 'adminlog.json');
var regexp = /^(\w)\((.+)\)$/;
var logFileSize = 0;
var errorlogFileSize = 0;
var adminlogFileSize = 0;
var erroradminlogFileSize = 0;
var logJson = [];
fs_1.default.readFile(logJsonFilePath, function (err, data) {
    if (err)
        console.log(err);
    else {
        var jsonData = JSON.parse(data.toString());
        if (Array.isArray(jsonData)) {
            logJson = logJson.concat(jsonData);
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
            adminlogJson = adminlogJson.concat(jsonData);
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
fs_1.default.readFile(errorlogFilePath, function (err, data) {
    if (err)
        console.log(err);
    else {
        errorlogFileSize = data.toString().length;
    }
});
fs_1.default.readFile(adminlogFilePath, function (err, data) {
    if (err)
        console.log(err);
    else {
        adminlogFileSize = data.toString().length;
    }
});
fs_1.default.readFile(erroradminlogFilePath, function (err, data) {
    if (err)
        console.log(err);
    else {
        erroradminlogFileSize = data.toString().length;
    }
});
fs_1.default.watchFile(logFilePath, function (curr, prev) {
    fs_1.default.readFile(logFilePath, function (err, data) {
        if (err)
            console.log(err);
        else {
            var fileChange = data.toString().slice(logFileSize);
            var match = fileChange.match(regexp);
            if (match) {
                if (match[2].endsWith(')')) {
                    var logInstance = {
                        server: 'main',
                        category: 'info',
                        value: match[2].substring(0, match.length - 1),
                        timestamp: curr.mtimeMs,
                        title: match[1]
                    };
                    logJson.push(logInstance);
                    fs_1.default.writeFile(logJsonFilePath, JSON.stringify(logJson), function (err) {
                        if (err)
                            console.log(err);
                    });
                }
            }
            logFileSize = data.toString().length;
        }
    });
});
fs_1.default.watchFile(errorlogFilePath, function (curr, prev) {
    fs_1.default.readFile(errorlogFilePath, function (err, data) {
        if (err)
            console.log(err);
        else {
            var fileChange = data.toString().slice(errorlogFileSize);
            var match = fileChange.match(regexp);
            if (match) {
                if (match[2].endsWith(')')) {
                    var logInstance = {
                        server: 'main',
                        category: 'error',
                        value: match[2].substring(0, match.length - 1),
                        timestamp: curr.mtimeMs,
                        title: match[1]
                    };
                    logJson.push(logInstance);
                    fs_1.default.writeFile(logJsonFilePath, JSON.stringify(logJson), function (err) {
                        if (err)
                            console.log(err);
                    });
                }
            }
            errorlogFileSize = data.toString().length;
        }
    });
});
fs_1.default.watchFile(adminlogFilePath, function (curr, prev) {
    fs_1.default.readFile(adminlogFilePath, function (err, data) {
        if (err)
            console.log(err);
        else {
            var fileChange = data.toString().slice(adminlogFileSize);
            var match = fileChange.match(regexp);
            if (match) {
                if (match[2].endsWith(')')) {
                    var logInstance = {
                        server: 'admin',
                        category: 'info',
                        value: match[2].substring(0, match.length - 1),
                        timestamp: curr.mtimeMs,
                        title: match[1]
                    };
                    adminlogJson.push(logInstance);
                    fs_1.default.writeFile(adminlogJsonFilePath, JSON.stringify(adminlogJson), function (err) {
                        if (err)
                            console.log(err);
                    });
                }
            }
            adminlogFileSize = data.toString().length;
        }
    });
});
fs_1.default.watchFile(erroradminlogFilePath, function (curr, prev) {
    fs_1.default.readFile(erroradminlogFilePath, function (err, data) {
        if (err)
            console.log(err);
        else {
            var fileChange = data.toString().slice(erroradminlogFileSize);
            var match = fileChange.match(regexp);
            if (match) {
                if (match[2].endsWith(')')) {
                    var logInstance = {
                        server: 'admin',
                        category: 'error',
                        value: match[2].substring(0, match.length - 1),
                        timestamp: curr.mtimeMs,
                        title: match[1]
                    };
                    adminlogJson.push(logInstance);
                    fs_1.default.writeFile(adminlogJsonFilePath, JSON.stringify(adminlogJson), function (err) {
                        if (err)
                            console.log(err);
                    });
                }
            }
            erroradminlogFileSize = data.toString().length;
        }
    });
});
