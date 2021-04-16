#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const func = require('./functions.ts');

interface logObject
{
    server: string,
    category: string,
    value: string,
    timestamp: number,
    title: string
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
logJson = func.initLog(logJsonFilePath);

var adminlogJson: logObject[] = [];
adminlogJson = func.initLog(adminlogJsonFilePath);

logFileSize = func.initFileSize(logFilePath);
errorlogFileSize = func.initFileSize(errorlogFilePath);
adminlogFileSize = func.initFileSize(adminlogFilePath);
erroradminlogFileSize = func.initFileSize(erroradminlogFilePath);

fs.watchFile(logFilePath, (curr, prev) => {
    logFileSize = func.updateLog(logFilePath, logJsonFilePath, logFileSize, curr.mtimeMs, logJson, false, 'main');
});

fs.watchFile(errorlogFilePath, (curr, prev) => {
    errorlogFileSize = func.updateLog(errorlogFilePath, logJsonFilePath, errorlogFileSize, curr.mtimeMs, logJson, true, 'main');
});

fs.watchFile(adminlogFilePath, (curr, prev) => {
    adminlogFileSize = func.updateLog(adminlogFilePath, adminlogJsonFilePath, adminlogFileSize, curr.mtimeMs, adminlogJson, false, 'admin');
});

fs.watchFile(erroradminlogFilePath, (curr, prev) => {
    erroradminlogFileSize = func.updateLog(erroradminlogFilePath, adminlogJsonFilePath, erroradminlogFileSize, curr.mtimeMs, adminlogJson, true, 'admin');
});