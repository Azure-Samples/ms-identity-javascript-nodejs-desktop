/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require("path");
const { app, ipcMain, BrowserWindow } = require("electron");

const AuthProvider = require("./AuthProvider");

const { IPC_MESSAGES } = require("./constants");
const { protectedResources, msalConfig, persistenceConfiguration } = require("./authConfig");
const getGraphClient = require("./graph");

const {
    DataProtectionScope,
    PersistenceCreator,
    PersistenceCachePlugin,
} = require("@azure/msal-node-extensions");

let authProvider;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { preload: path.join(__dirname, "preload.js") },
    });

    PersistenceCreator
        .createPersistence(persistenceConfiguration)
        .then((persistence) => {
            msalConfig.cache.cachePlugin = new PersistenceCachePlugin(persistence);
            
            // Initialize the electron authenticator
            authProvider = new AuthProvider(msalConfig);
        });
}

app.on("ready", () => {
    createWindow();
    mainWindow.loadFile(path.join(__dirname, "./index.html"));
});

app.on("window-all-closed", () => {
    app.quit();
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


// Event handlers
ipcMain.on(IPC_MESSAGES.LOGIN, async () => {
    const account = await authProvider.login({
        scopes: [],
    });

    await mainWindow.loadFile(path.join(__dirname, "./index.html"));
    mainWindow.show();

    mainWindow.webContents.send(IPC_MESSAGES.SHOW_WELCOME_MESSAGE, account);
});

ipcMain.on(IPC_MESSAGES.LOGOUT, async () => {
    await authProvider.logout();

    await mainWindow.loadFile(path.join(__dirname, "./index.html"));
    mainWindow.show();
});

ipcMain.on(IPC_MESSAGES.GET_PROFILE, async () => {
    const tokenRequest = {
        scopes: protectedResources.graphMe.scopes
    };

    const tokenResponse = await authProvider.getToken(tokenRequest);
    const account = authProvider.account;

    await mainWindow.loadFile(path.join(__dirname, "./index.html"));
    mainWindow.show();

    const graphResponse = await getGraphClient(tokenResponse.accessToken).api(protectedResources.graphMe.endpoint).get();

    mainWindow.webContents.send(IPC_MESSAGES.SHOW_WELCOME_MESSAGE, account);
    mainWindow.webContents.send(IPC_MESSAGES.SET_PROFILE, graphResponse);
});