/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const {
  PublicClientApplication,
  CryptoProvider,
} = require("@azure/msal-node");
const { BrowserWindow } = require("electron");
const CustomProtocolListener = require("./CustomProtocolListener");
const { msalConfig, REDIRECT_URI } = require('./authConfig')

class AuthProvider {
  clientApplication;
  cryptoProvider;
  authCodeUrlParams;
  authCodeRequest;
  pkceCodes;
  account;
  customFileProtocolName;

  constructor() {
    /**
     * Initialize a public client application. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-public-client-application.md
     */
    this.clientApplication = new PublicClientApplication(msalConfig);
    this.account = null;

    // Initialize CryptoProvider instance
    this.cryptoProvider = new CryptoProvider();

    /**
     * To demonstrate best security practices, this Electron sample application makes use of
     * a custom file protocol instead of a regular web (https://) redirect URI in order to
     * handle the redirection step of the authorization flow, as suggested in the OAuth2.0 specification for Native Apps.
     */
    this.customFileProtocolName = REDIRECT_URI.split(":")[0];

    this.setRequestObjects();
  }

  // Creates a "popup" window for interactive authentication
  static createAuthWindow() {
    return new BrowserWindow({
      width: 400,
      height: 600,
    });
  }

  /**
   * Initialize request objects used by this AuthModule.
   */
  setRequestObjects() {
    const requestScopes = ["User.Read"];

    this.authCodeUrlParams = {
      scopes: requestScopes,
      redirectUri: REDIRECT_URI,
    };

    this.authCodeRequest = {
      scopes: requestScopes,
      redirectUri: REDIRECT_URI,
      code: null,
    };

    this.pkceCodes = {
      challengeMethod: "S256", // Use SHA256 Algorithm
      verifier: "", // Generate a code verifier for the Auth Code Request first
      challenge: "", // Generate a code challenge from the previously generated code verifier
    };
  }

  async login() {
    const authResult = await this.getTokenInteractive(this.authCodeUrlParams);
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
      const authCodeRequest = {
        ...this.authCodeUrlParams,
        ...tokenRequest,
      };

      authResponse = await this.getTokenInteractive(authCodeRequest);
    }

    return authResponse.accessToken || null;
  }

  async getTokenSilent(tokenRequest) {
    try {
      return await this.clientApplication.acquireTokenSilent(tokenRequest);
    } catch (error) {
      console.log(
        "Silent token acquisition failed, acquiring token using pop up"
      );
      const authCodeRequest = {
        ...this.authCodeUrlParams,
        ...tokenRequest,
      };
      return await this.getTokenInteractive(authCodeRequest);
    }
  }

  async getTokenInteractive(tokenRequest) {
    /**
     * Proof Key for Code Exchange (PKCE) Setup
     *
     * MSAL enables PKCE in the Authorization Code Grant Flow by including the codeChallenge and codeChallengeMethod parameters
     * in the request passed into getAuthCodeUrl() API, as well as the codeVerifier parameter in the
     * second leg (acquireTokenByCode() API).
     *
     * MSAL Node provides PKCE Generation tools through the CryptoProvider class, which exposes
     * the generatePkceCodes() asynchronous API. As illustrated in the example below, the verifier
     * and challenge values should be generated previous to the authorization flow initiation.
     *
     * For details on PKCE code generation logic, consult the
     * PKCE specification https://tools.ietf.org/html/rfc7636#section-4
     */

    const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();
    this.pkceCodes.verifier = verifier;
    this.pkceCodes.challenge = challenge;
    const popupWindow = AuthProvider.createAuthWindow();

    // Add PKCE params to Auth Code URL request
    const authCodeUrlParams = {
      ...this.authCodeUrlParams,
      scopes: tokenRequest.scopes,
      codeChallenge: this.pkceCodes.challenge, // PKCE Code Challenge
      codeChallengeMethod: this.pkceCodes.challengeMethod, // PKCE Code Challenge Method
    };

    try {
      // Get Auth Code URL
      const authCodeUrl = await this.clientApplication.getAuthCodeUrl(
        authCodeUrlParams
      );
      const authCode = await this.listenForAuthCode(authCodeUrl, popupWindow);
      // Use Authorization Code and PKCE Code verifier to make token request
      const authResult = await this.clientApplication.acquireTokenByCode({
        ...this.authCodeRequest,
        code: authCode,
        codeVerifier: verifier,
      });

      popupWindow.close();
      return authResult;
    } catch (error) {
      popupWindow.close();
      throw error;
    }
  }

  async listenForAuthCode(navigateUrl, authWindow) {
    // Set up custom file protocol to listen for redirect response
    const authCodeListener = new CustomProtocolListener(
      this.customFileProtocolName
    );
    const codePromise = authCodeListener.start();
    authWindow.loadURL(navigateUrl);
    const code = await codePromise;
    authCodeListener.close();
    return code;
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
    // need to call getAccount here?
    const cache = this.clientApplication.getTokenCache();
    const currentAccounts = await cache.getAllAccounts();

    if (currentAccounts === null) {
      console.log("No accounts detected");
      return null;
    }

    if (currentAccounts.length > 1) {
      // Add choose account code here
      console.log(
        "Multiple accounts detected, need to add choose account code."
      );
      return currentAccounts[0];
    } else if (currentAccounts.length === 1) {
      return currentAccounts[0];
    } else {
      return null;
    }
  }
}

module.exports = AuthProvider;
