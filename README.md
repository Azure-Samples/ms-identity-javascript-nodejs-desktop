---
page_type: sample
languages:
- javascript
products:
- nodejs
- electron
- ms-graph
- azure-active-directory
description: "Demonstrates how to use MSAL Node to sign-in users and acquire access tokens for a protected resource such as Microsoft Graph in an Electron desktop application using the OAuth 2.0 authorization code flow with PKCE."
urlFragment: "ms-identity-javascript-nodejs-desktop"
---

# An Electron desktop application secured by MSAL Node (Preview) on Microsoft identity platform

This sample demonstrates how to use [MSAL Node (Preview)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to sign-in a user and acquire an access token for a protected resource such as Microsoft Graph in an Electron desktop application using the [authorization code grant with PKCE](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow).

> :information_source: Looking for a TypeScript implementation? See: [ElectronTestApp](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/standalone-samples/ElectronTestApp)

## Features

This sample demonstrates the following **MSAL Node** concepts:

* Configuration
* Login and logout
* Acquiring an access token
* Calling a web API

## Contents

| File/folder           | Description                                                  |
|-----------------------|--------------------------------------------------------------|
| `AppCreationScripts/` | Contains Powershell scripts for automating app registration. |
| `App/authProvider.js` | Main authentication logic resides here.                      |
| `App/main.js`         | Application main process.                                    |
| `App/fetch.js`        | Axios HTTP client for calling endpoints with a bearer token. |
| `App/renderer.js`     | Renderer processes and UI methods.                           |
| `App/constants.js`    | Example user accounts in JSON                                |
| `.env`                | Environment variables of authentication parameters.          |

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) must be installed to run this sample.
* [Visual Studio Code](https://code.visualstudio.com/download) is recommended for running and editing this sample.

### Setup

1. Register a [desktop app that calls web APIs](https://docs.microsoft.com/azure/active-directory/develop/scenario-desktop-app-registration) in the [Azure Portal](https://portal.azure.com).
    * Navigate to the **Authentication** blade in the app registration.
    * Click add a platform and choose **Mobile and Desktop application**
    * For the **redirect URI**, enter `msal://redirect` into the input box.
1. Clone this repository `git clone https://github.com/Azure-Samples/ms-identity-javascript-nodejs-desktop.git`
1. Open the [.env](.env) file and provide the required configuration values.
    1. Replace the string `Enter_the_Application_Id_Here` with your app/client ID on Azure AD portal.
    1. Replace the string `Enter_the_Tenant_Id_Here` with your tenant ID on Azure AD portal.
    1. Replace the string `Enter_the_Client_Secret_Here` with the client secret you created on Azure AD portal.
    1. Replace the string `Enter_the_Cloud_Instance_Id_Here` with `https://login.microsoftonline.com/` (see **note** below).
    1. Replace the string `Enter_the_Graph_Endpoint_Here`. with `https://graph.microsoft.com/` (see **note** below).

> :information_source: *note*: This is for multi-tenant applications located on the global Azure cloud. For more information, see: [Use MSAL in a national cloud environment](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v2-javascript-auth-code)

> :information_source: *note*: This is for MS Graph instance located on the global Azure cloud. For more information, see: [Use Microsoft Graph in a national cloud environment](https://docs.microsoft.com/en-us/graph/deployments)

1. On the command line, navigate to the root of the repository, and type `npm install`. This will install application dependencies via npm.

## Run the sample

1. On the command line, run the sample application with `npm start`.

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](./CONTRIBUTING.md).

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
