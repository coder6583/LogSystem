#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

interface logObject
{
    server: string,
    category: string,
    value: string,
    timestamp: number
}

const discordDir = '/home/pi/CompilerDiscord';
const homeDir = '/home/pi';
const logFilePath = path.resolve(discordDir, 'log');
const errorlogFilePath = path.resolve(discordDir, 'errorlog');
const adminlogFilePath = path.resolve(discordDir, 'adminlog');
const erroradminlogFilePath = path.resolve(discordDir, 'erroradminlog');
const logJsonFilePath = path.resolve(homeDir, 'log.json');
const adminlogJsonFilePath = path.resolve(homeDir, 'adminlog.json');

let logFileSize = 0;
let errorlogFileSize = 0;
let adminlogFileSize = 0;
let erroradminlogFileSize = 0;

var logJson: logObject[] = [];
fs.readFile(logJsonFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        let jsonData = JSON.parse(data.toString());
        if(Array.isArray(jsonData))
        {
            logJson = logJson.concat(jsonData);
        }
        else if(typeof jsonData === 'object' && jsonData != null)
        {
            logJson.push(jsonData);
        }
    }
})

var adminlogJson: logObject[] = [];
fs.readFile(adminlogJsonFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        let jsonData = JSON.parse(data.toString());
        if(Array.isArray(jsonData))
        {
            adminlogJson = adminlogJson.concat(jsonData);
        }
        else if(typeof jsonData === 'object' && jsonData != null)
        {
            adminlogJson.push(jsonData);
        }
    }
})

fs.readFile(logFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        logFileSize = data.toString().length;
    }
});
fs.readFile(errorlogFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        errorlogFileSize = data.toString().length;
    }
});

fs.readFile(adminlogFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        adminlogFileSize = data.toString().length;
    }
});
fs.readFile(erroradminlogFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        erroradminlogFileSize = data.toString().length;
    }
});
fs.watchFile(logFilePath, (curr, prev) => {
    fs.readFile(logFilePath, (err, data) => {
        if(err) console.log(err);
        else
        {
            let fileChange = data.toString().slice(logFileSize);
            const logInstance: logObject = 
            {
                server: 'main',
                category: 'info',
                value: fileChange,
                timestamp: curr.mtimeMs
            };
            logJson.push(logInstance);
            fs.writeFile(logJsonFilePath, JSON.stringify(logJson), (err) => {
                if(err) console.log(err);
            });
            logFileSize = data.toString().length;
        }
    })
});

fs.watchFile(errorlogFilePath, (curr, prev) => {
    fs.readFile(errorlogFilePath, (err, data) => {
        if(err) console.log(err);
        else
        {
            let fileChange = data.toString().slice(errorlogFileSize);
            const logInstance: logObject = 
            {
                server: 'main',
                category: 'error',
                value: fileChange,
                timestamp: curr.mtimeMs
            };
            logJson.push(logInstance);
            fs.writeFile(logJsonFilePath, JSON.stringify(logJson), (err) => {
                if(err) console.log(err);
            });
            errorlogFileSize = data.toString().length;
        }
    })
});

fs.watchFile(adminlogFilePath, (curr, prev) => {
    fs.readFile(adminlogFilePath, (err, data) => {
        if(err) console.log(err);
        else
        {
            let fileChange = data.toString().slice(adminlogFileSize);
            console.log(adminlogFileSize);
            const logInstance: logObject = 
            {
                server: 'admin',
                category: 'info',
                value: fileChange,
                timestamp: curr.mtimeMs
            };
            adminlogJson.push(logInstance);
            fs.writeFile(adminlogJsonFilePath, JSON.stringify(adminlogJson), (err) => {
                if(err) console.log(err);
            });
            adminlogFileSize = data.toString().length;
        }
    })
});

fs.watchFile(erroradminlogFilePath, (curr, prev) => {
    fs.readFile(erroradminlogFilePath, (err, data) => {
        if(err) console.log(err);
        else
        {
            let fileChange = data.toString().slice(erroradminlogFileSize);
            const logInstance: logObject = 
            {
                server: 'admin',
                category: 'error',
                value: fileChange,
                timestamp: curr.mtimeMs
            };
            adminlogJson.push(logInstance);
            fs.writeFile(adminlogJsonFilePath, JSON.stringify(adminlogJson), (err) => {
                if(err) console.log(err);
            });
            erroradminlogFileSize = data.toString().length;
        }
    })
});