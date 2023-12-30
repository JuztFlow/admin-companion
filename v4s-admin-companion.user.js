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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // IMPORTANT: Change the following URL to your respective template repository:
  const template_repository_url = "https://api.github.com/repos/JuztFlow/v4s-admin-companion/contents/templates";

  //############################################################################################################//

  // DEBUG PRINTS: Uncomment the following line to DISABLE console output!
  // console.log = function () {};

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // !!! Don't change anything below this line unless you know what you're doing !!!

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // This class is responsible for fetching the template repository structure from the specified github URL
  // and storing it in a private field.
  //
  // The structure is a map in another map with the following format:
  // Map<category_name, Map<template_name, template_content>>
  //
  // The template_content is the actual html template text that will be inserted 1:1 into the tickets' text editor.
  // NOTE: The filname of the template files in the repository MUST be in the following format:
  //       <category_name>_<template_name>.txt
  //       Example: "GM Stuff_Ban Response.txt" -> category_name = "GM Stuff", template_name = "Ban Response"
  //
  // The category name and template name will be extracted from the filename:
  // - Proper capitalization and use of whitespaces is absolutely necessary!
  // - ALWAYS use ONLY ONE underscore!
  //
  class TemplateRepository {
    #categories = new Map();
    #already_added = false;

    get already_added() {
      return this.#already_added;
    }

    set already_added(value) {
      this.#already_added = value;
    }

    get() {
      return this.#categories;
    }

    constructor(url) {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            alert("Failed to access template repository via: " + url);
          }
        })
        .then((response_json) => {
          response_json.forEach((entry) => {
            const [category_name, template_name] = entry.name.split(".")[0].split("_");
            if (!this.#categories.has(category_name)) {
              this.#categories.set(category_name, new Map());
            }
            fetch(entry.download_url)
              .then((response) => {
                if (response.ok) {
                  return response.text();
                } else {
                  alert("Failed to fetch template from: " + entry.download_url);
                }
              })
              .then((response_text) => {
                this.#categories.get(category_name).set(template_name, response_text);
              })
              .catch((error) => {
                console.error(error);
              });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  // This is the first code in this script that actually gets executed.
  // It creates an instance of the TemplateRepository for use in the main application below.
  const template_repository = new TemplateRepository(template_repository_url);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let main_application_interval_id;
  let inputFieldAdded = false;
  let GMName = "";

  function removeInputField() {
    var inputField = document.querySelector(".custom-input");
    if (inputField) {
      inputField.remove();
    }
  }

  function createInputField() {
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
      if (!regex.test(GMName)) {
        // Input doesn't match the pattern, clear the field
        inputField.value = GMName.slice(0, -1);
      } else {
        localStorage.setItem("GMName", GMName); // Store the input value in local storage
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

  function createCategoryItem(name, content) {
    let item = Object.assign(document.createElement("li"), { className: "menu_item ng-tns-c72-4 ng-star-inserted" });
    let item_link = Object.assign(document.createElement("a"), { href: "#", title: name, className: "ng-tns-c72-4 ng-star-inserted" });
    let item_title = Object.assign(document.createElement("span"), { className: "menu-title ng-tns-c72-5", textContent: name });
    item_link.addEventListener("click", function (event) {
      event.preventDefault();
      let text_editor = document.querySelector(".angular-editor-wrapper.show-placeholder");
      if (text_editor) {
        let text_editor_area = text_editor.querySelector(".angular-editor-textarea");
        let text_editor_placeholder = text_editor.querySelector(".angular-editor-placeholder");
        if (text_editor_area) {
          text_editor_area.setAttribute("data-placeholder-disabled", "true");
          text_editor_area.innerHTML = "" + content;
        }
        if (text_editor_placeholder) {
          text_editor_placeholder.style.display = "none";
        }
      }
    });
    item_link.appendChild(item_title);
    item.appendChild(item_link);
    return item;
  }

  function createCategory(name) {
    let category = Object.assign(document.createElement("li"), { className: "menu-item ng-tns-c72-3 ng-star-inserted" });
    let category_link = Object.assign(document.createElement("a"), { href: "#", title: name, className: "ng-tns-c72-3 ng-star-inserted" });
    let category_title = Object.assign(document.createElement("span"), { className: "menu-title ng-tns-c72-3" });
    category_title.textContent = name;

    let expand_icon = Object.assign(document.createElement("nb-icon"), { className: "expand-state ng-tns-c72-3" });
    expand_icon.setAttribute("pack", "nebular-essentials");
    expand_icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="100%" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-down"><rect width="24" height="24" opacity="0"></rect><path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path></g></g></svg>';

    category_link.appendChild(category_title);
    category_link.appendChild(expand_icon);

    let category_items = Object.assign(document.createElement("ul"), {
      className: "menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted",
      style: "display: none;",
    });

    category_link.addEventListener("click", function (event) {
      event.preventDefault();
      if (category_items.style.display === "none") {
        category_items.style.display = "block";
        category_items.className = "menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted expanded";
      } else {
        category_items.style.display = "none";
        category_items.className = "menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted collapsed";
      }
    });

    category.appendChild(category_link);
    category.appendChild(category_items);

    return category;
  }

  function createMenuItem(name) {
    let menu_item = Object.assign(document.createElement("li"), { className: "menu-item ng-tns-c72-1 ng-star-inserted" });
    menu_item.id = name;

    let menu_item_link = Object.assign(document.createElement("a"), { href: "#", title: name, className: "ng-tns-c72-2 ng-star-inserted" });

    let menu_item_title = Object.assign(document.createElement("span"), { className: "menu-title ng-tns-c72-2" });
    menu_item_title.textContent = name;

    let expand_icon = Object.assign(document.createElement("nb-icon"), { className: "expand-state ng-tns-c72-2" });
    expand_icon.setAttribute("pack", "nebular-essentials");
    expand_icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="100%" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-down"><rect width="24" height="24" opacity="0"></rect><path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path></g></g></svg>';

    menu_item_link.appendChild(menu_item_title);
    menu_item_link.appendChild(expand_icon);

    let categories = Object.assign(document.createElement("ul"), {
      className: "menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted",
      style: "display: none;",
    });

    menu_item_link.addEventListener("click", function (event) {
      event.preventDefault();
      if (categories.style.display === "none") {
        categories.style.display = "block";
        categories.className = "menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted expanded";
      } else {
        categories.style.display = "none";
        categories.className = "menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted collapsed";
      }
    });

    menu_item.appendChild(menu_item_link);
    menu_item.appendChild(categories);

    return menu_item;
  }

  function addTemplateRepositoryStructureToNavigationMenu() {
    let existing_menu_items = document.querySelector("nb-menu").querySelector(".menu-items");
    let ticket_template_menu_item = createMenuItem("Ticket Templates");
    template_repository.get().forEach((templates, category_name) => {
      let category = createCategory(category_name);
      templates.forEach((template_content, template_name) => {
        console.log(" << Template content: " + template_content);
        let template = createCategoryItem(template_name, template_content);
        category.querySelector("ul").appendChild(template);
      });
      ticket_template_menu_item.querySelector("ul").appendChild(category);
    });

    existing_menu_items.appendChild(ticket_template_menu_item);
  }

  function remove_element(id) {
    let element_to_remove = document.getElementById(id);
    if (element_to_remove) {
      element_to_remove.remove();
    }
  }

  function removeTemplateRepositoryStructureFromNavigationMenu() {
    remove_element("Ticket Templates");
  }

  function applyScriptLogic() {
    // Specific Ticket Page
    if (window.location.hash.startsWith("#/pages/ticket/") && !template_repository.already_added) {
      addTemplateRepositoryStructureToNavigationMenu();
      template_repository.already_added = true;
      if (inputFieldAdded) {
        removeInputField();
        inputFieldAdded = false;
      }
      return;
    }
    // Dashboard/Landing Page
    if (window.location.hash.startsWith("#/pages/dashboard") && !inputFieldAdded) {
      createInputField();
      inputFieldAdded = true;
      if (template_repository.already_added) {
        removeTemplateRepositoryStructureFromNavigationMenu();
        template_repository.already_added = false;
      }
      return;
    }
    // Any other page -> remove all custom elements
    if (!window.location.hash.startsWith("#/pages/ticket/") && !window.location.hash.startsWith("#/pages/dashboard")) {
      if (template_repository.already_added) {
        template_repository.already_added = false;
        removeTemplateRepositoryStructureFromNavigationMenu();
      }
      if (inputFieldAdded) {
        inputFieldAdded = false;
        removeInputField();
      }
      return;
    }
  }

  function stopApplicationLoop() {
    if (main_application_interval_id) {
      clearInterval(main_application_interval_id);
      main_application_interval_id = null;
    }
  }

  function startMainApplication() {
    if (!main_application_interval_id) {
      main_application_interval_id = setInterval(applyScriptLogic, 100);
    }
  }

  // This is the second piece of code that gets executed.
  // Before this, the only thing that already happened was the fetching of the template repository structure, see
  // But now we start the actual main application loop that continuously tries to apply the script logic.
  // This is necessary because page elements are loaded asynchronously, and the elements we need are not available
  // on page load when this script starts executing, so we need to wait until they become available.
  // However, the logic is then only applied once per page. If the user navigates to another page, the logic changes.
  startMainApplication();
})();
