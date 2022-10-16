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

# An Electron desktop application using MSAL Node on Microsoft identity platform

This sample demonstrates how to use [MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to sign-in a user and acquire an access token for a protected resource such as Microsoft Graph in an Electron desktop application using the [authorization code grant with PKCE](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow) flow.

> :information_source: Looking for a TypeScript implementation? See: [ElectronTestApp](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/ElectronTestApp)

## Features

This sample demonstrates the following **MSAL Node** concepts:

* Configuration
* Login and logout
* Acquiring an access token
* Calling a web API

## Contents

| File/folder                  | Description                                                  |
|------------------------------|--------------------------------------------------------------|
| `AppCreationScripts/`        | Contains Powershell scripts for automating app registration. |
| `App/authProvider.js`        | Main authentication logic resides here.                      |
| `App/main.js`                | Application main process.                                    |
| `App/fetch.js`               | Axios HTTP client for calling endpoints with a bearer token. |
| `App/renderer.js`            | Renderer processes and UI methods.                           |
| `App/constants.js`           | Example user accounts in JSON .                              |
| `App/UIManager.js`           | Application UI and elements.                                 |
| `App/preload.js`             | Give the Renderer process controlled access to some Node API.|
| `App/authConfig.js`          | Configuration objects to be passed to MSAL instanc.          |

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) must be installed to run this sample.
* [Visual Studio Code](https://code.visualstudio.com/download) is recommended for running and editing this sample.

### Register and Setup the application

#### Step 1: Register the application

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
     * In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `msal-node-desktop`.
     * In the **Supported account types** section, select **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.
     * Select **Register** to create the application.
1. In the list of pages for the app, select **Authentication**.
1. Select **Add a platform**, select **Mobile and desktop applications**
1. In the **Redirect URIs** section enter the following redirect URI `http://localhost`
1. Select **Configure**.

#### Step 2: Clone the repository  

Clone this repository `git clone https://github.com/Azure-Samples/ms-identity-javascript-nodejs-desktop.git`

#### Step 3: Configure the Electron sample project

1. Open the [.authConfig.js](./App/authConfig.js) file and provide the required configuration values.
    1. Replace the string `Enter_the_Application_Id_Here` with your app/client ID on Azure AD portal.
    1. Replace the string `Enter_the_Tenant_Info_Here` with your tenant ID on Azure AD portal.
    1. Replace the string `Enter_the_Cloud_Instance_Id_Here` with `https://login.microsoftonline.com/` (see **note** below).
    1. Replace the string `Enter_the_Graph_Endpoint_Here`. with `https://graph.microsoft.com/` (see **note** below).

> :information_source: *note*: This is for multi-tenant applications located on the Global Azure cloud. For more information, see: [Use MSAL in a national cloud environment](https://docs.microsoft.com/azure/active-directory/develop/authentication-national-cloud)

> :information_source: *note*: This is for MS Graph instance located on the Global Azure cloud. For more information, see: [Use Microsoft Graph in a national cloud environment](https://docs.microsoft.com/graph/deployments)

#### step 4: Run  the sample

1. You'll need to install the dependencies of this sample once:

    ```console
    cd ms-identity-javascript-nodejs-desktop
    npm install
    ```

1. Then, run the application via command prompt or console:

    ```console
    npm start
    ```

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](./CONTRIBUTING.md).

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
