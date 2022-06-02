// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License

const { contextBridge, ipcRenderer } = require("electron");
const { IPC_MESSAGES } = require("./constants");
const UIManager = require('./UIManager');
const { protectedResources } = require('./authConfig')
/**
 * This preload script exposes a "renderer" API to give
 * the Renderer process controlled access to some Node APIs
 * by leveraging IPC channels that have been configured for
 * communication between the Main and Renderer processes.
 */
contextBridge.exposeInMainWorld("renderer", {
  sendLoginMessage: () => {
    ipcRenderer.send(IPC_MESSAGES.LOGIN);
  },
  sendSignoutMessage: () => {
    ipcRenderer.send(IPC_MESSAGES.LOGOUT);
  },
  sendSeeProfileMessage: () => {
    ipcRenderer.send(IPC_MESSAGES.GET_PROFILE);
  },
  sendReadMailMessage: () => {
    ipcRenderer.send(IPC_MESSAGES.GET_MAIL);
  },
  startUiManager: () => {
    /**
     * The UI Manager is declared within this API because
     * although it's used in the listeners below, it must be initialized by the Renderer
     * process in order for the DOM to be accessible through JavaScript.
     */
    const uiManager = new UIManager();

    // Main process message subscribers
    ipcRenderer.on(IPC_MESSAGES.SHOW_WELCOME_MESSAGE, (event, account) => {
      uiManager.showWelcomeMessage(account);
    });
    ipcRenderer.on(IPC_MESSAGES.SET_PROFILE, (event, graphResponse) => {
      uiManager.updateUI(
        graphResponse,
        protectedResources.graphMe.endpoint
      );
    });
    ipcRenderer.on(IPC_MESSAGES.SET_MAIL, (event, graphResponse) => {
      uiManager.updateUI(
        graphResponse,
        protectedResources.graphMessages.endpoint
      );
    });
  }
});