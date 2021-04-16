"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var regexp = /^(\w)\((.+)\)$/;
function initLog(path) {
    var logJson = [];
    fs_1.default.readFile(path, function (err, data) {
        if (err)
            console.log(err);
        else {
            var jsonData = JSON.parse(data.toString() || "null");
            if (Array.isArray(jsonData)) {
                logJson = logJson.concat(jsonData);
            }
            else if (typeof jsonData === 'object' && jsonData != null) {
                logJson.push(jsonData);
            }
        }
    });
    return logJson;
}
function initFileSize(path) {
    var logFileSize = 0;
    fs_1.default.readFile(path, function (err, data) {
        if (err)
            console.log(err);
        else {
            logFileSize = data.toString().length;
        }
    });
    return logFileSize;
}
function updateLog(path, jsonPath, size, time, logJson, isError, server) {
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(path, function (err, data) {
            if (err)
                console.log(err);
            else {
                var fileChange = data.toString().slice(size);
                if (!isError) {
                    var logs = fileChange.split('\`');
                    logs.forEach(function (element) {
                        var match = element.match(regexp);
                        console.log(match);
                        if (match) {
                            var logInstance = {
                                server: server,
                                category: 'info',
                                value: match[2].substring(0, match.length - 1),
                                timestamp: time,
                                title: match[1]
                            };
                            logJson.push(logInstance);
                            fs_1.default.writeFile(jsonPath, JSON.stringify(logJson), function (err) {
                                if (err)
                                    console.log(err);
                            });
                        }
                    });
                }
                else {
                    var logInstance = {
                        server: server,
                        category: 'error',
                        value: fileChange,
                        timestamp: time,
                        title: 'error'
                    };
                    logJson.push(logInstance);
                    fs_1.default.writeFile(jsonPath, JSON.stringify(logJson), function (err) {
                        if (err)
                            console.log(err);
                    });
                }
            }
            size = data.toString().length;
            resolve(size);
        });
    });
}
module.exports = { initLog: initLog, initFileSize: initFileSize, updateLog: updateLog };
