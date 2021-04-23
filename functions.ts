import fs from "fs";

const regexp = /^([\w|\s]+)\((.*)\)$/;

interface logObject {
    server: string,
    category: string,
    value: string[],
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
                fileChange = fileChange.replace(/\n/g, '<br>');
                if(!isError)
                {
                    let logs: string[] = fileChange.split('\`');
                    logs.forEach((element: string) => {
                        console.log(element, 1);
                        if(element.startsWith("<br>"))
                        {
                            element = element.slice(4);
                        }
                        let match = element.match(regexp);
                        console.log(match, 2);
                        if (match) {
                            let valueArray = [];
                            if(match[2].length < 8000)
                            {
                                valueArray.push(match[2]);
                            }
                            else
                            {
                                let temp = match[2];
                                while(temp.length > 8000)
                                {
                                    valueArray.push(temp.slice(0, 8000));
                                    temp = temp.slice(8000);
                                }
                                valueArray.push(temp);
                            }
                            const logInstance: logObject =
                            {
                                server: server,
                                category: 'info',
                                value: valueArray,
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
                    let valueArray = [];
                    if(fileChange.length < 8000)
                    {
                        valueArray.push(fileChange);
                    }
                    else
                    {
                        let temp = fileChange;
                        while(temp.length > 8000)
                        {
                            valueArray.push(temp.slice(0, 8000));
                            temp = temp.slice(8000);
                        }
                        valueArray.push(temp);
                    }
                    const logInstance: logObject =
                    {
                        server: server,
                        category: 'error',
                        value: valueArray,
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