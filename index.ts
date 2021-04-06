#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const discordDir = '/home/pi/CompilerDiscord';
const logFilePath = path.resolve(discordDir, 'log');
const adminlogFilePath = path.resolve(discordDir, 'adminlog');

let logFileSize = 0;
let adminlogFileSize = 0;

fs.readFile(logFilePath, (err, data) => {
    if(err)
    {
        console.log(err);
    }
    else
    {
        logFileSize = data.toString().length;
    }
});

fs.readFile(adminlogFilePath, (err, data) => {
    if(err)
    {
        console.log(err);
    }
    else
    {
        adminlogFileSize = data.toString().length;
    }
});

fs.watchFile(logFilePath, (curr, prev) => {
    fs.readFile(logFilePath, (err, data) => {
        if(err){
            console.log(err);
        }
        else
        {
            let time = new Date(Math.floor(curr.mtimeMs));
            let fileChange = data.toString().slice(logFileSize);
            console.log(fileChange);
            console.log(curr.atimeMs, time.getMinutes());
        }
    })
});

fs.watchFile(adminlogFilePath, (curr, prev) => {
    console.log(curr.atimeMs);
});