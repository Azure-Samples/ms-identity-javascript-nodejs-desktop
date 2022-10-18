/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { PublicClientApplication } = require('@azure/msal-node');
const { msalConfig } = require('./authConfig');
const open = require('open');

class AuthProvider {
    clientApplication;
    loginRequest;
    account;

    constructor() {
        /**
         * Initialize a public client application. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-public-client-application.md
         */
        this.clientApplication = new PublicClientApplication(msalConfig);
        this.account = null;

        this.setRequestObjects();
    }

    /**
     * Initialize request objects used by this AuthModule.
     */
    setRequestObjects() {
        const requestScopes = ['User.Read', 'Mail.Read'];

        this.loginRequest = {
            scopes: requestScopes,
            openBrowser: this.openBrowser,
        };
    }

    async openBrowser(url) {
        // You can open a browser window with any library or method you wish to use - the 'open' npm package is used here for demonstration purposes.
        open(url);
    }

    async login() {
        const authResult = await this.clientApplication.acquireTokenInteractive(this.loginRequest);
        return this.handleResponse(authResult);
    }

    async logout() {
        if (this.account) {
            await this.clientApplication.getTokenCache().removeAccount(this.account);
            this.account = null;
        }
    }

    async getToken(tokenRequest) {
        let authResponse;
        const account = this.account || (await this.getAccount());
        if (account) {
            tokenRequest.account = account;
            authResponse = await this.getTokenSilent(tokenRequest);
        } else {
            console.log('get token interactive');
            const authCodeRequest = {
                ...this.loginRequest,
                ...tokenRequest,
                successTemplate: 'Acquired token interactive.',
            };
            authResponse = await this.clientApplication.acquireTokenInteractive(authCodeRequest);
        }

        return authResponse.accessToken || null;
    }

    async getTokenSilent(tokenRequest) {
        try {
            return await this.clientApplication.acquireTokenSilent(tokenRequest);
        } catch (error) {
            console.log('Silent token acquisition failed, acquiring token interactive');
            const authCodeRequest = {
                ...this.loginRequest,
                ...tokenRequest,
                successTemplate: 'Acquired token interactive.',
            };
            return await this.clientApplication.acquireTokenInteractive(authCodeRequest);
        }
    }

    /**
     * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
     * @param response
     */
    async handleResponse(response) {
        if (response !== null) {
            this.account = response.account;
        } else {
            this.account = await this.getAccount();
        }

        return this.account;
    }

    /**
     * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    async getAccount() {
        const cache = this.clientApplication.getTokenCache();
        const currentAccounts = await cache.getAllAccounts();

        if (currentAccounts === null) {
            console.log('No accounts detected');
            return null;
        }

        if (currentAccounts.length > 1) {
            // Add choose account code here
            console.log('Multiple accounts detected, need to add choose account code.');
            return currentAccounts[0];
        } else if (currentAccounts.length === 1) {
            return currentAccounts[0];
        } else {
            return null;
        }
    }
}

module.exports = AuthProvider;
