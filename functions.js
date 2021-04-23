"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var regexp = /^(([^\(]|\s)+)\((.*)\)$/;
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
                fileChange = fileChange.replace(/\n/g, '<br>');
                if (!isError) {
                    var logs = fileChange.split('\`');
                    logs.forEach(function (element) {
                        console.log(element, 1);
                        if (element.startsWith("<br>")) {
                            element = element.slice(4);
                        }
                        var match = element.match(regexp);
                        console.log(match, 2);
                        if (match) {
                            var valueArray = [];
                            if (match[3].length < 8000) {
                                valueArray.push(match[3]);
                            }
                            else {
                                var temp = match[3];
                                while (temp.length > 8000) {
                                    valueArray.push(temp.slice(0, 8000));
                                    temp = temp.slice(8000);
                                }
                                valueArray.push(temp);
                            }
                            var logInstance = {
                                server: server,
                                category: 'info',
                                value: valueArray,
                                timestamp: time,
                                title: match[1]
                            };
                            logJson.push(logInstance);
                        }
                    });
                    fs_1.default.writeFile(jsonPath, JSON.stringify(logJson), function (err) {
                        if (err)
                            console.log(err);
                    });
                }
                else {
                    var valueArray = [];
                    if (fileChange.length < 8000) {
                        valueArray.push(fileChange);
                    }
                    else {
                        var temp = fileChange;
                        while (temp.length > 8000) {
                            valueArray.push(temp.slice(0, 8000));
                            temp = temp.slice(8000);
                        }
                        valueArray.push(temp);
                    }
                    var logInstance = {
                        server: server,
                        category: 'error',
                        value: valueArray,
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
