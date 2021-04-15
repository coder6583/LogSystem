import fs from 'fs';
import path from 'path';

const regexp = /^(\w)\((.+)\)$/;

interface logObject {
    server: string,
    category: string,
    value: string,
    timestamp: number,
    title: string
}

function initLog(path: string) {
    let logJson: logObject[] = [];
    fs.readFile(path, (err, data) => {
        if (err) console.log(err);
        else {
            let jsonData = JSON.parse(data.toString() || "null");
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
function initFileSize(path: string) {
    let logFileSize = 0;
    fs.readFile(path, (err, data) => {
        if (err) console.log(err);
        else {
            logFileSize = data.toString().length;
        }
    });
    return logFileSize;
}
function updateLog(path: string, jsonPath: string, size: number, time: number, logJson: logObject[]) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) console.log(err);
            else {
                let fileChange = data.toString().slice(size);
                let logs: string[] = fileChange.split('\`');
                logs.forEach((element: string) => {
                    let match = element.match(regexp);
                    if (match) {
                        const logInstance: logObject =
                        {
                            server: 'main',
                            category: 'info',
                            value: match[2].substring(0, match.length - 1),
                            timestamp: time,
                            title: match[1]
                        };
                        logJson.push(logInstance);
                        fs.writeFile(jsonPath, JSON.stringify(logJson), (err) => {
                            if (err) console.log(err);
                        });
                    }
                })
            }
            size = data.toString().length;
            resolve(size);
        });
    })
}
module.exports = { initLog, initFileSize, updateLog };