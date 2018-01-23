const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;
const dev = false;

global.dev = dev;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        resizable: true
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools();


    win.on('closed', () => {
        win = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});