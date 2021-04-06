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
            console.log('array');
            logJson.concat(jsonData);
        }
        else if(typeof jsonData === 'object' && jsonData != null)
        {
            console.log('object');
            logJson.push(jsonData);
            console.log(logJson);
        }
    }
})

var adminlogJson: logObject[] = [];
fs.readFile(adminlogJsonFilePath, (err, data) => {
    if(err) console.log(err);
    else
    {
        adminlogJson = JSON.parse(data.toString());
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
            let time = new Date(Math.floor(curr.mtimeMs));
            let fileChange = data.toString().slice(logFileSize);
            console.log(fileChange);
            console.log(curr.mtimeMs, time.getMinutes());
            const logInstance: logObject = 
            {
                category: 'Info',
                value: fileChange,
                timestamp: curr.mtimeMs
            };
            logJson.push(logInstance);
            fs.writeFile(logJsonFilePath, JSON.stringify(logInstance), (err) => {
                if(err) console.log(err);
            });
            logFileSize = data.toString().length;
        }
    })
});

fs.watchFile(adminlogFilePath, (curr, prev) => {
    console.log(curr.atimeMs);
});