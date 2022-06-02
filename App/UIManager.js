const { protectedResources } = require("./authConfig");

class UIManager {
  welcomeDiv;
  signInButton;
  signOutButton;
  cardDiv;
  tabList;
  tabContent;

  constructor() {
      
    this.welcomeDiv = document.getElementById("WelcomeMessage");
    this.signInButton = document.getElementById("signIn");
    this.signOutButton = document.getElementById("signOut");
    this.cardDiv = document.getElementById("cardDiv");
    this.profileDiv = document.getElementById("profileDiv");
    this.tabList = document.getElementById("list-tab");
    this.tabContent = document.getElementById("nav-tabContent");
    
  }

    showWelcomeMessage(account) {
      // Reconfiguring DOM elements
      this.cardDiv.style.display = "initial";
      this.welcomeDiv.innerHTML = `Welcome ${account.name}`;
      this.signInButton.hidden = true;
      this.signOutButton.hidden = false;
      
    }

    clearTabs() {
      this.tabList.innerHTML = "";
      this.tabContent.innerHTML = "";
    }

    updateUI(data, endpoint) {
      console.log(`Graph API responded at: ${new Date().toString()}`);

      if (endpoint === protectedResources.graphMe.endpoint) {
        this.setProfile(data);
      } else if (endpoint === protectedResources.graphMessages.endpoint) {
        
        this.setMail(data);
      }
    }

    setProfile(data) {
      profileDiv.innerHTML = "";

      const title = document.createElement("p");
      const email = document.createElement("p");
      const phone = document.createElement("p");
      const address = document.createElement("p");

      title.innerHTML = "<strong>Title: </strong>" + data.jobTitle;
      email.innerHTML = "<strong>Mail: </strong>" + data.mail;
      phone.innerHTML = "<strong>Phone: </strong>" + data.businessPhones[0];
      address.innerHTML = "<strong>Location: </strong>" + data.officeLocation;

      this.profileDiv.appendChild(title);
      this.profileDiv.appendChild(email);
      this.profileDiv.appendChild(phone);
      this.profileDiv.appendChild(address);
    }

    setMail(data) {
      const mailInfo = data;
      if (mailInfo.value.length < 1) {
        alert("Your mailbox is empty!");
      } else {
        this.clearTabs();
        mailInfo.value.slice(0, 10).forEach((d, i) => {
          this.createAndAppendListItem(d, i);
          this.createAndAppendContentItem(d, i);
        });
      }
    }

    createAndAppendListItem(d, i) {
      const listItem = document.createElement("a");
      listItem.setAttribute("class", "list-group-item list-group-item-action");
      listItem.setAttribute("id", "list" + i + "list");
      listItem.setAttribute("data-toggle", "list");
      listItem.setAttribute("href", "#list" + i);
      listItem.setAttribute("role", "tab");
      listItem.setAttribute("aria-controls", i);
      listItem.innerHTML = d.subject;
      this.tabList.appendChild(listItem);
    }

    createAndAppendContentItem(d, i) {
      const contentItem = document.createElement("div");
      contentItem.setAttribute("class", "tab-pane fade");
      contentItem.setAttribute("id", "list" + i);
      contentItem.setAttribute("role", "tabpanel");
      contentItem.setAttribute("aria-labelledby", "list" + i + "list");

      if (d.from) {
        contentItem.innerHTML =
          "<strong> from: " +
          d.from.emailAddress.address +
          "</strong><br><br>" +
          d.bodyPreview +
          "...";
        this.tabContent.appendChild(contentItem);
      }
    }
}

module.exports = UIManager;
