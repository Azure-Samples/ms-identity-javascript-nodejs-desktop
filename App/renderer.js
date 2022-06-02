// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License

/**
 * The renderer API is exposed by the preload script found in the preload.ts
 * file in order to give the renderer access to the Node API in a secure and 
 * controlled way
 */
const api = window
api.renderer.startUiManager();

// UI event handlers
document.querySelector('#signIn').addEventListener('click', () => {
    api.renderer.sendLoginMessage();
});

document.querySelector('#signOut').addEventListener('click', () => {
    api.renderer.sendSignoutMessage();
});

document.querySelector('#seeProfile').addEventListener('click', () => {
    api.renderer.sendSeeProfileMessage();
});

document.querySelector('#readMail').addEventListener('click', () => {
    api.renderer.sendReadMailMessage();
});