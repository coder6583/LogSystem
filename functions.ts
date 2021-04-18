import fs from "fs";

const regexp = /^(\w+)\(((\n | .)*)\)$/m;

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
function updateLog(path: string, jsonPath: string, size: number, time: number, logJson: logObject[], isError: boolean, server: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) console.log(err);
            else {
                let fileChange = data.toString().slice(size);
                if(!isError)
                {
                    let logs: string[] = fileChange.split('\`');
                    logs.forEach((element: string) => {
                        console.log(element);
                        let match = element.match(regexp);
                        console.log(match);
                        if (match) {
                            const logInstance: logObject =
                            {
                                server: server,
                                category: 'info',
                                value: match[2],
                                timestamp: time,
                                title: match[1]
                            };
                            logJson.push(logInstance);
                        }
                    })
                    fs.writeFile(jsonPath, JSON.stringify(logJson), (err) => {
                        if (err) console.log(err);
                    });
                }
                else
                {
                    const logInstance: logObject =
                    {
                        server: server,
                        category: 'error',
                        value: fileChange,
                        timestamp: time,
                        title: 'error'
                    };
                    logJson.push(logInstance);
                    fs.writeFile(jsonPath, JSON.stringify(logJson), (err) => {
                        if (err) console.log(err);
                    });
                }
            }
            size = data.toString().length;
            resolve(size);
        });
    })
}
module.exports = { initLog, initFileSize, updateLog };