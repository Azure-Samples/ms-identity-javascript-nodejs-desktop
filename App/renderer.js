// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License

/**
 * The renderer API is exposed by the preload script found in the preload.ts
 * file in order to give the renderer access to the Node API in a secure and 
 * controlled way
 */
 const api = window;
 const welcomeDiv = document.getElementById('WelcomeMessage');
 const signInButton = document.getElementById('signIn');
 const signOutButton = document.getElementById('signOut');
 const cardDiv = document.getElementById('cardDiv');
 const profileDiv = document.getElementById('profileDiv');
 const tabList = document.getElementById('list-tab');
 const tabContent = document.getElementById('nav-tabContent');

api.renderer.showWelcomeMessage((event, account) => {
    cardDiv.style.display = 'initial';
    welcomeDiv.innerHTML = `Welcome ${account.name}`;
    signInButton.hidden = true;
    signOutButton.hidden = false;
});

api.renderer.handleProfileData((event, graphResponse) => {
    console.log(`Graph API responded at: ${new Date().toString()}`);
    setProfile(graphResponse);
});


api.renderer.handleMailData((event, graphResponse) => {
    console.log(`Graph API responded at: ${new Date().toString()}`);
    setMail(graphResponse);
});


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


const setProfile = (data) => {

    profileDiv.innerHTML = '';

    const title = document.createElement('p');
    const email = document.createElement('p');
    const phone = document.createElement('p');
    const address = document.createElement('p');

    title.innerHTML = '<strong>Title: </strong>' + data.jobTitle;
    email.innerHTML = '<strong>Mail: </strong>' + data.mail;
    phone.innerHTML = '<strong>Phone: </strong>' + data.businessPhones[0];
    address.innerHTML = '<strong>Location: </strong>' + data.officeLocation;

    profileDiv.appendChild(title);
    profileDiv.appendChild(email);
    profileDiv.appendChild(phone);
    profileDiv.appendChild(address);

}

const setMail = (data) => {
     const mailInfo = data;
     if (mailInfo ===  null) {
         alert('Your mailbox is empty!');
     } else {
         clearTabs();
         mailInfo.value.slice(0, 10).forEach((d, i) => {
             createAndAppendListItem(d, i);
             createAndAppendContentItem(d, i);
         });
     }
};

const clearTabs = () => {
    tabList.innerHTML = '';
    tabContent.innerHTML = '';
}

const createAndAppendListItem = (d, i) => {
    const listItem = document.createElement('a');
    listItem.setAttribute('class', 'list-group-item list-group-item-action');
    listItem.setAttribute('id', 'list' + i + 'list');
    listItem.setAttribute('data-toggle', 'list');
    listItem.setAttribute('href', '#list' + i);
    listItem.setAttribute('role', 'tab');
    listItem.setAttribute('aria-controls', i);
    listItem.innerHTML = d.subject;
    tabList.appendChild(listItem);
};

const createAndAppendContentItem = (d, i) => {
    const contentItem = document.createElement('div');
    contentItem.setAttribute('class', 'tab-pane fade');
    contentItem.setAttribute('id', 'list' + i);
    contentItem.setAttribute('role', 'tabpanel');
    contentItem.setAttribute('aria-labelledby', 'list' + i + 'list');

    if (d.from) {
        contentItem.innerHTML =
            '<strong> from: ' + d.from.emailAddress.address + '</strong><br><br>' + d.bodyPreview + '...';
        tabContent.appendChild(contentItem);
    }
};