// ==UserScript==
// @name         4Vision Admin Ticket-Templates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Tampermonkey script that provides templates for tickets on the admin page of v4s.
// @author       GA.Mind, GM.Gripan
// @match        https://admin.vision4s.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vision4s.com
// @updateURL    https://github.com/JuztFlow/v4s-admin-companion/raw/main/v4s-admin-companion.user.js
// @downloadURL  https://github.com/JuztFlow/v4s-admin-companion/raw/main/v4s-admin-companion.user.js
// ==/UserScript==

(function () {
  "use strict";

  const url = "https://raw.githubusercontent.com/JuztFlow/v4s-admin-companion/main/templates/";

  // Define a variable to store the interval ID
  var intervalID;
  var elementsAdded = false; // Flag to track whether elements are already added
  var inputFieldAdded = false; // Flag to track whether the input field is added
  var GMName = "";
  var Theme = "";

  function applyScriptLogic() {
    if (window.location.hash.startsWith("#/pages/ticket/") && !elementsAdded) {
      // Find the parent menu where you want to add the category
      var parentMenu = document.querySelector("nb-menu");
      var menuItems = parentMenu.querySelector(".menu-items");

      // Create the "Ticket Templates" category with a sub-menu
      var ticketTemplatesCategory = createCategory("Ticket Templates", "Ticket Templates", "MyElement");

      // Create the "Battle Mode" sub-menu within "Ticket Templates"
      var battleModeSubMenu = createSubMenu("Battle Mode", "Battle Mode");

      // Create additional items for the "Battle Mode" sub-menu
      var battleModeItem1 = createMenuItem("Report Response", "#", url + "report_response.html");
      var battleModeItem2 = createMenuItem("Ban Response", "#", url +  "ban_response.html");

      // Append the additional items to the "Battle Mode" sub-menu
      battleModeSubMenu.querySelector("ul").appendChild(battleModeItem1);
      battleModeSubMenu.querySelector("ul").appendChild(battleModeItem2);

      // Create the "RWT" sub-menu
      var rwtSubMenu = createSubMenu("RWT", "RWT");

      // Create additional items for the "RWT" sub-menu
      var rwtItem1 = createMenuItem("Default Case", "#", url + "rwt_default.html");
      var rwtItem2 = createMenuItem("Second Account", "#", url + "rwt_second_account.html");
      var rwtItem3 = createMenuItem("RWT Item 3", "#", "Message");

      // Append the additional items to the "RWT" sub-menu
      rwtSubMenu.querySelector("ul").appendChild(rwtItem1);
      rwtSubMenu.querySelector("ul").appendChild(rwtItem2);
      rwtSubMenu.querySelector("ul").appendChild(rwtItem3);

      // Create the "RWT" sub-menu
      var TechnicalSubMenu = createSubMenu("Technical", "Technical");

      // Create additional items for the "RWT" sub-menu
      var TechnicalIssuesItem1 = createMenuItem("Technical Item 1", "#", "Message");
      var TechnicalIssuesItem2 = createMenuItem("Technical Item 2", "#", "Message");

      // Append the additional items to the "RWT" sub-menu
      TechnicalSubMenu.querySelector("ul").appendChild(TechnicalIssuesItem1);
      TechnicalSubMenu.querySelector("ul").appendChild(TechnicalIssuesItem2);

      // Create the "RWT" sub-menu
      var AccountSubMenu = createSubMenu("Account", "Account");

      // Create additional items for the "RWT" sub-menu
      var AccountIssuesItem1 = createMenuItem("Account Item 1", "#", "Message");
      var AccountIssuesItem2 = createMenuItem("Account Item 2", "#", "Message");

      // Append the additional items to the "RWT" sub-menu
      AccountSubMenu.querySelector("ul").appendChild(AccountIssuesItem1);
      AccountSubMenu.querySelector("ul").appendChild(AccountIssuesItem2);
      // Append the "Battle Mode" and "RWT" sub-menus to "Ticket Templates"
      ticketTemplatesCategory.querySelector("ul").appendChild(battleModeSubMenu);
      ticketTemplatesCategory.querySelector("ul").appendChild(rwtSubMenu);
      ticketTemplatesCategory.querySelector("ul").appendChild(TechnicalSubMenu);
      ticketTemplatesCategory.querySelector("ul").appendChild(AccountSubMenu);

      // Append the modified "Ticket Templates" category to the menu
      menuItems.appendChild(ticketTemplatesCategory);
      function createCategory(categoryName, linkText, categoryId) {
        var category = document.createElement("li");
        category.className = "menu-item ng-tns-c72-7 ng-star-inserted";
        category.setAttribute("_ngcontent-dkm-c73", "");
        category.id = categoryId; // Assign an ID to the category element

        var categoryLink = document.createElement("a");
        categoryLink.href = "#";
        categoryLink.title = linkText;

        var categoryTitle = document.createElement("span");
        categoryTitle.className = "menu-title ng-tns-c72-7";
        categoryTitle.textContent = categoryName;

        var expandIcon = document.createElement("nb-icon");
        expandIcon.className = "expand-state ng-tns-c72-7";
        expandIcon.setAttribute("pack", "nebular-essentials");
        expandIcon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="100%" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-down"><rect width="24" height="24" opacity="0"></rect><path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path></g></g></svg>';

        categoryLink.appendChild(categoryTitle);
        categoryLink.appendChild(expandIcon);

        // Create the sub-menu for the category
        var subMenu = document.createElement("ul");
        subMenu.className = "menu-items ng-tns-c72-7 ng-trigger ng-trigger-toggle ng-star-inserted";

        // Initially hide the sub-menu
        subMenu.style.display = "none";

        // Toggle the sub-menu when the category link is clicked
        categoryLink.addEventListener("click", function (event) {
          event.preventDefault();
          if (subMenu.style.display === "none") {
            subMenu.style.display = "block";
            subMenu.className = "menu-items ng-tns-c72-4 ng-trigger ng-trigger-toggle ng-star-inserted expanded";
          } else {
            subMenu.style.display = "none";
            subMenu.className = "menu-items ng-tns-c72-4 ng-trigger ng-trigger-toggle ng-star-inserted collapsed";
          }
        });

        category.appendChild(categoryLink);
        category.appendChild(subMenu);

        return category;
      }

      function createSubMenu(subMenuName, linkText) {
        var subMenu = document.createElement("li");
        subMenu.className = "menu-item ng-tns-c72-7 ng-star-inserted";
        subMenu.setAttribute("_ngcontent-dkm-c73", "");

        var subMenuLink = document.createElement("a");
        subMenuLink.href = "#";
        subMenuLink.title = linkText;

        var subMenuTitle = document.createElement("span");
        subMenuTitle.className = "menu-title ng-tns-c72-7";
        subMenuTitle.textContent = subMenuName;

        // Create the icon element and set its attributes
        var subMenuIcon = document.createElement("nb-icon");
        subMenuIcon.className = "expand-state ng-tns-c72-7";
        subMenuIcon.setAttribute("pack", "nebular-essentials");
        subMenuIcon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="100%" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-down"><rect width="24" height="24" opacity="0"></rect><path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path></g></g></svg>';

        subMenuLink.appendChild(subMenuTitle);
        subMenuLink.appendChild(subMenuIcon);

        // Create the sub-sub-menu for the category
        var subSubMenu = document.createElement("ul");
        subSubMenu.className = "menu-items ng-tns-c72-7 ng-trigger ng-trigger-toggle ng-star-inserted";

        // Initially hide the sub-menu
        subSubMenu.style.display = "none";

        // Toggle the sub-menu when the sub-menu link is clicked
        subMenuLink.addEventListener("click", function (event) {
          event.preventDefault();
          if (subSubMenu.style.display === "none") {
            subSubMenu.style.display = "block";
            subSubMenu.className = "menu-items ng-tns-c72-4 ng-trigger ng-trigger-toggle ng-star-inserted expanded";
          } else {
            subSubMenu.style.display = "none";
            subSubMenu.className = "menu-items ng-tns-c72-4 ng-trigger ng-trigger-toggle ng-star-inserted collapsed";
          }
        });

        subMenu.appendChild(subMenuLink);
        subMenu.appendChild(subSubMenu);

        return subMenu;
      }

      // Function to create a menu item with preset text content
      function createMenuItem(itemName, itemUrl, presetURL) {
        var menuItem = document.createElement("li");
        menuItem.className = "menu-item ng-tns-c72-8 ng-tns-c72-7 ng-star-inserted";

        var itemLink = document.createElement("a");
        itemLink.href = itemUrl;
        itemLink.title = itemName;

        var itemTitle = document.createElement("span");
        itemTitle.className = "menu-title ng-tns-c72-8";
        itemTitle.textContent = itemName;

        // Use the fetch API to make a GET request to the URL
        fetch(presetURL)
          .then((response) => {
            if (response.ok) {
              // If the response is successful, parse the response text as HTML
              return response.text();
            } else {
              alert("Failed to fetch the HTML template file from " + presetURL);
            }
          })
          .then((htmlText) => {
            // You now have the HTML text in the 'htmlText' variable
            // Add a click event listener to fill the preset text into the div element
            itemLink.addEventListener("click", function (event) {
              event.preventDefault();
              fillPresetText(htmlText + localStorage.getItem("GMName"));
            }); // You can manipulate or use the HTML text as needed
          })
          .catch((error) => {
            console.error(error);
          });

        itemLink.appendChild(itemTitle);
        menuItem.appendChild(itemLink);

        return menuItem;
      }

      // Function to fill preset text into the div element
      // Function to fill preset text into the div element and remove the placeholder span
      function fillPresetText(text) {
        var targetElement = document.querySelector(".angular-editor-wrapper.show-placeholder");

        if (targetElement) {
          // Find the child div and span elements within the target element
          var divElement = targetElement.querySelector(".angular-editor-textarea");
          var placeholderSpan = targetElement.querySelector(".angular-editor-placeholder");

          // Disable the placeholder by adding the data-placeholder-disabled attribute
          if (divElement) {
            divElement.setAttribute("data-placeholder-disabled", "true");
            divElement.innerHTML = "" + text; // Add 'a' in front of the text
          }

          // hiding the placeholderSpan
          if (placeholderSpan) {
            placeholderSpan.style.display = "none";
          }
        }
      }

      console.log("Script logic applied.");
      elementsAdded = true; // Set the flag to true after adding elements
      removeInputField();
      inputFieldAdded = false;
    } else if (window.location.hash.startsWith("#/pages/dashboard") && !inputFieldAdded) {
      // Create an input field on the dashboard page
      createInputField();
      inputFieldAdded = true;
    } else if (!window.location.hash.startsWith("#/pages/ticket/")) {
      // If not on the specific URL, reset the flag
      elementsAdded = false;
      // Remove the custom category and sub-menu
      removeCustomCategory();
    }
  }

  // Function to remove the custom category and sub-menu
  function removeCustomCategory() {
    var customCategory = document.getElementById("MyElement");
    if (customCategory) {
      customCategory.remove();
      console.log("Custom category and sub-menu removed.");
    }
  }

  // Function to start the interval
  function startInterval() {
    if (!intervalID) {
      intervalID = setInterval(applyScriptLogic, 500); // Adjust the interval as needed
    }
  }

  // Function to stop the interval
  function stopInterval() {
    if (intervalID) {
      clearInterval(intervalID);
      intervalID = null;
    }
  }

  function createInputField() {
    console.log("createInputField called"); // Add this line for debugging
    var inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "[GM]Example"; // Set a placeholder text
    inputField.className = "custom-input"; // Add the desired classes

    // Add CSS styles to the input field
    inputField.style.width = "250px"; // Adjust the width as needed
    inputField.style.padding = "10px";
    inputField.style.border = "1px solid #ccc";
    inputField.style.borderRadius = "5px";
    inputField.style.fontSize = "16px";
    inputField.style.marginLeft = "2em"; // Add some space on the right
    inputField.style.backgroundColor = "#222b45";
    inputField.style.color = "#fff"; // Text color set to white

    // Retrieve the saved input value from local storage
    var savedGMName = localStorage.getItem("GMName");
    if (savedGMName) {
      inputField.value = savedGMName;
      GMName = savedGMName;
    }

    // Add an event listener to capture input changes
    inputField.addEventListener("input", function (event) {
      GMName = event.target.value;
      var regex = /^\[?(?:[A-Z]{2,3}])?[A-Za-z]*$/; // Regex pattern /^\[[A-Z]{0,3}[[[A-Za-z\[\]]{0,17}$/
      localStorage.setItem("GMName", GMName); // Store the input value in local storage
      console.log("Input value: " + GMName); // Display the input value in the console (for testing)
      if (!regex.test(GMName)) {
        // Input doesn't match the pattern, clear the field
        inputField.value = GMName.slice(0, -1);
      } else {
        localStorage.setItem("GMName", GMName); // Store the input value in local storage
        console.log("current GM Name: " + GMName); // Display the input value in the console (for testing)
      }
    });
    // Find the header-container element
    var headerContainer = document.querySelector(".header-container");

    // Check if the header-container element exists
    if (headerContainer) {
      // Append the input field right after the logo-container
      headerContainer.appendChild(inputField);
    }
  }

  function removeInputField() {
    var inputField = document.querySelector(".custom-input");
    if (inputField) {
      inputField.remove();
    }
  }

  // Start the interval initially
  startInterval();
})();
