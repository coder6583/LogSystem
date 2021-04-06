#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

interface logObject
{
    category: string,
    value: string,
    timestamp: number
}

const discordDir = '/home/pi/CompilerDiscord';
const adminDir = '/home/pi/AdminCompilerServer';
const logFilePath = path.resolve(discordDir, 'log');
const adminlogFilePath = path.resolve(discordDir, 'adminlog');
const logJsonFilePath = path.resolve(adminDir, 'log.json');
const adminlogJsonFilePath = path.resolve(adminDir, 'adminlog.json');

let logFileSize = 0;
let adminlogFileSize = 0;

var logJson: logObject[] = [];
fs.readFile(logJsonFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        let jsonData = JSON.parse(data.toString());
        if(Array.isArray(jsonData))
        {
            logJson.concat(jsonData);
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
            adminlogJson.concat(jsonData);
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

fs.readFile(adminlogFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        adminlogFileSize = data.toString().length;
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

fs.watchFile(adminlogFilePath, (curr, prev) => {
    fs.readFile(adminlogFilePath, (err, data) => {
        if(err) console.log(err);
        else
        {
            let fileChange = data.toString().slice(adminlogFileSize);
            const logInstance: logObject = 
            {
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