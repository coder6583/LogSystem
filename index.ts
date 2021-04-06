#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const discordDir = '/home/pi/CompilerDiscord';
const logFilePath = path.resolve(discordDir, 'log');
const adminlogFilePath = path.resolve(discordDir, 'adminlog');

fs.watchFile(logFilePath, (curr, prev) => {
    let time = new Date(Math.floor(curr.atimeMs));
    console.log(time.getDate());
});

fs.watchFile(adminlogFilePath, (curr, prev) => {
    console.log(curr.atimeMs);
});