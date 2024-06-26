---
page_type: sample
languages:
- javascript
products:
- nodejs
- electron
- ms-graph
- microsoft-entra-id
description: "Demonstrates how to use MSAL Node to sign-in users and acquire access tokens for a protected resource such as Microsoft Graph in an Electron desktop application using the OAuth 2.0 authorization code flow with PKCE."
urlFragment: "ms-identity-javascript-nodejs-desktop"
---

# An Electron desktop application using MSAL Node on Microsoft identity platform

This sample demonstrates how to use [MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to sign-in a user and acquire an access token for a protected resource such as Microsoft Graph in an Electron desktop application using the [authorization code grant with PKCE](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow) flow.

This sample backs the following articles on Microsoft Docs:

- [Quickstart: Acquire a token and call Microsoft Graph API from a desktop application](https://learn.microsoft.com/azure/active-directory/develop/desktop-app-quickstart?pivots=devlang-nodejs-electron)
- [Tutorial: Sign in users and call the Microsoft Graph API in an Electron desktop app](https://learn.microsoft.com/azure/active-directory/develop/tutorial-v2-nodejs-desktop)

> :information_source: Looking for a TypeScript implementation? See: [ElectronTestApp](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/ElectronTestApp)

> :information_source: Looking for an Electron with React implementation? See: [ElectronSystemBrowserTestApp](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/ElectronSystemBrowserTestApp)

> :warning: This sample does not implement persistent caching. See [Caching with MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/caching.md) for more information.

## Features

This sample demonstrates the following **MSAL Node** concepts:

- Configuration
- Login and logout
- Acquiring an access token
- Calling a web API

## Contents

| File/folder                  | Description                                                  |
|------------------------------|--------------------------------------------------------------|
| `AppCreationScripts/`        | Contains Powershell scripts for automating app registration. |
| `App/authProvider.js`        | Main authentication logic resides here.                      |
| `App/main.js`                | Application main process.                                    |
| `App/graph.js`               | Instantiates Graph SDK client.                               |
| `App/renderer.js`            | Renderer processes and UI methods.                           |
| `App/constants.js`           | Example user accounts in JSON .                              |
| `App/preload.js`             | Give the Renderer process controlled access to some Node API.|
| `App/authConfig.js`          | Configuration objects to be passed to MSAL instance.         |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) must be installed to run this sample.
- [Visual Studio Code](https://code.visualstudio.com/download) is recommended for running and editing this sample.

### Register and Setup the application

#### Step 1: Register the application

1. Navigate to the [Microsoft Entra admin center](https://entra.microsoft.com) and select the **Microsoft Entra ID** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
    1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `msal-node-desktop`.
    1. In the **Supported account types** section, select **Accounts in this organizational directory only**.
    1. Select **Register** to create the application.
1. In the list of pages for the app, select **Authentication**.
1. Select **Add a platform**, select **Mobile and desktop applications**
1. In the **Redirect URIs** section enter the following redirect URI `http://localhost`
1. Select **Configure**.

##### Configure Optional Claims

1. Still on the same app registration, select the **Token configuration** blade to the left.
1. Select **Add optional claim**:
    1. Select **optional claim type**, then choose **ID**.
    1. Select the optional claim **login_hint**.
    > An opaque, reliable login hint claim. This claim is the best value to use for the login_hint OAuth parameter in all flows to get SSO. See $[optional claims](https://docs.microsoft.com/azure/active-directory/develop/active-directory-optional-claims) for more details.
    1. Select **Add** to save your changes.

#### Step 2: Clone the repository  

Clone this repository `git clone https://github.com/Azure-Samples/ms-identity-javascript-nodejs-desktop.git`

#### Step 3: Configure the Electron sample project

1. Open the [.authConfig.js](./App/authConfig.js) file and provide the required configuration values.
    1. Replace the string `Enter_the_Application_Id_Here` with your app/client ID on Microsoft Entra admin center.
    1. Replace the string `Enter_the_Tenant_Info_Here` with your tenant ID on Microsoft Entra admin center.
    1. Replace the string `Enter_the_Cloud_Instance_Id_Here` with `https://login.microsoftonline.com/` (include the trailing slash).
    1. Replace the string `Enter_the_Graph_Endpoint_Here`. with `https://graph.microsoft.com/` (include the trailing slash).

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
