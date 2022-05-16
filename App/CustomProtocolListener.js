// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const AuthCodeListener = require("./AuthCodeListener");
const { protocol } = require("electron");

/**
 * CustomProtocolListener can be instantiated in order
 * to register and unregister a custom typed protocol on which
 * MSAL can listen for Auth Code reponses.
 *
 * For information on available protocol types, check the Electron
 * protcol docs: https://www.electronjs.org/docs/latest/api/protocol/
 */
class CustomProtocolListener extends AuthCodeListener {
  constructor(hostName) {
    super(hostName);
  }
  /**
   * Registers a custom string protocol on which the library will
   * listen for Auth Code response.
   */
  start() {
    const codePromise = new Promise((resolve, reject) => {
      protocol.registerStringProtocol(this.host, (req, callback) => {
        const requestUrl = new URL(req.url);
        const authCode = requestUrl.searchParams.get("code");
        authCode
          ? resolve(authCode)
          : reject(new Error("No code found in URL"));
      });
    });

    return codePromise;
  }

  /**
   * Unregisters a custom file protocol to stop listening for
   * Auth Code response.
   */
  close() {
    protocol.unregisterProtocol(this.host);
  }
}

module.exports = CustomProtocolListener;
