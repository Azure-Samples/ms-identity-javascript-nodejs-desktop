// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License

const { ipcRenderer } = require('electron');
const { IPC_MESSAGES } = require('./constants');

// UI event handlers
document.querySelector('#signIn').addEventListener('click', () => {
    ipcRenderer.send(IPC_MESSAGES.LOGIN);
});

document.querySelector('#signOut').addEventListener('click', () => {
    ipcRenderer.send(IPC_MESSAGES.LOGOUT);
});

document.querySelector('#seeProfile').addEventListener('click', () => {
    ipcRenderer.send(IPC_MESSAGES.GET_PROFILE);
});

document.querySelector('#readMail').addEventListener('click', () => {
    ipcRenderer.send(IPC_MESSAGES.GET_MAIL);
});


// Main process message subscribers
ipcRenderer.on(IPC_MESSAGES.SHOW_WELCOME_MESSAGE, (event, account) => {
    showWelcomeMessage(account);
});

ipcRenderer.on(IPC_MESSAGES.SET_PROFILE, (event, graphResponse) => {
    updateUI(graphResponse, `${process.env.GRAPH_ENDPOINT_HOST}${process.env.GRAPH_ME_ENDPOINT}`);
});

ipcRenderer.on(IPC_MESSAGES.SET_MAIL, (event, graphResponse) => {
    updateUI(graphResponse, `${process.env.GRAPH_ENDPOINT_HOST}${process.env.GRAPH_MAIL_ENDPOINT}`);
});

const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("signIn");
const signOutButton = document.getElementById("signOut");
const cardDiv = document.getElementById("cardDiv");
const mailButton = document.getElementById("readMail");
const profileButton = document.getElementById("seeProfile");
const profileDiv = document.getElementById("profileDiv");
const tabList = document.getElementById("list-tab");
const tabContent = document.getElementById("nav-tabContent");

function showWelcomeMessage(account) {
    // Reconfiguring DOM elements
    cardDiv.style.display = "initial";
    welcomeDiv.innerHTML = `Welcome ${account.name}`;
    signInButton.hidden = true;
    signOutButton.hidden = false;
}

function clearTabs() {
    tabList.innerHTML = "";
    tabContent.innerHTML = "";
}

function updateUI(data, endpoint) {
    
    console.log(`Graph API responded at: ${new Date().toString()}`);

    if (endpoint === `${process.env.GRAPH_ENDPOINT_HOST}${process.env.GRAPH_ME_ENDPOINT}`) {
        setProfile(data);
    } else if (endpoint === `${process.env.GRAPH_ENDPOINT_HOST}${process.env.GRAPH_MAIL_ENDPOINT}`) {
        setMail(data);
    }
}

function setProfile(data) {
    profileDiv.innerHTML = ''
    
    const title = document.createElement('p');
    const email = document.createElement('p');
    const phone = document.createElement('p');
    const address = document.createElement('p');

    title.innerHTML = "<strong>Title: </strong>" + data.jobTitle;
    email.innerHTML = "<strong>Mail: </strong>" + data.mail;
    phone.innerHTML = "<strong>Phone: </strong>" + data.businessPhones[0];
    address.innerHTML = "<strong>Location: </strong>" + data.officeLocation;
    
    profileDiv.appendChild(title);
    profileDiv.appendChild(email);
    profileDiv.appendChild(phone);
    profileDiv.appendChild(address);
}

function setMail(data) {
    const mailInfo = data;
    if (mailInfo.value.length < 1) {
        alert("Your mailbox is empty!")
    } else {
        clearTabs();
        mailInfo.value.slice(0, 10).forEach((d, i) => {
                createAndAppendListItem(d, i);
                createAndAppendContentItem(d, i);
        });
    }
}

function createAndAppendListItem(d, i) {
    const listItem = document.createElement("a");
    listItem.setAttribute("class", "list-group-item list-group-item-action")
    listItem.setAttribute("id", "list" + i + "list")
    listItem.setAttribute("data-toggle", "list")
    listItem.setAttribute("href", "#list" + i)
    listItem.setAttribute("role", "tab")
    listItem.setAttribute("aria-controls", i)
    listItem.innerHTML = d.subject;
    tabList.appendChild(listItem);
}

function createAndAppendContentItem(d, i) {
    const contentItem = document.createElement("div");
    contentItem.setAttribute("class", "tab-pane fade")
    contentItem.setAttribute("id", "list" + i)
    contentItem.setAttribute("role", "tabpanel")
    contentItem.setAttribute("aria-labelledby", "list" + i + "list")
    
    if (d.from) {
        contentItem.innerHTML = "<strong> from: " + d.from.emailAddress.address + "</strong><br><br>" + d.bodyPreview + "...";
        tabContent.appendChild(contentItem);
    }
}