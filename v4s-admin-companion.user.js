// ==UserScript==
// @name         vision4s Admin Companion
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Tampermonkey script that provides additional functionality for the vision4s admin page.
// @author       Mind and Gripan
// @match        https://admin.vision4s.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vision4s.com
// @updateURL    https://github.com/JuztFlow/v4s-admin-companion/raw/main/v4s-admin-companion.user.js
// @downloadURL  https://github.com/JuztFlow/v4s-admin-companion/raw/main/v4s-admin-companion.user.js
// @require      https://cdn.jsdelivr.net/npm/idb@8.0.0/build/umd.min.js
// @run-at document-end
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMPORTANT: Change the following configuration values to match your needs!
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const application_name = "v4s-admin-companion"

// "https://api.github.com/repos/<username>/<repository>/contents/<path>"
const template_repository_url = "https://api.github.com/repos/JuztFlow/v4s-admin-companion/contents/templates"

// Uncomment to: disable debug output
// console.log = function () {};

// Uncomment to: flush template database on every page load (will cause issues with rate limit on github)
// await idb.deleteDB(application_name);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// !!! Don't change anything below this line unless you know what you're doing !!!
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

;(function () {
  "use strict"

  class TemplateRepository {
    #dbConnectionPromise

    async getAll() {
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readonly")
      const object_store = transaction.objectStore("templates")
      const result = await object_store.getAll()
      await transaction.done
      return this.getMapFromResult(result)
    }

    async getMapFromResult(result) {
      const templates = new Map()
      for (const template of result) {
        if (!templates.has(template.category_name)) {
          templates.set(template.category_name, new Map())
        }
        templates.get(template.category_name).set(template.template_name, template.content)
      }
      return templates
    }

    constructor(url) {
      this.#initializeRepository(url)
    }

    async #initializeRepository(url) {
      this.#dbConnectionPromise = await this.#getDBConnection()
      const template_repo_metadata = await this.#getTemplateRepoMetadata(url)
      for (const entry of template_repo_metadata) {
        await this.#processTemplateRepoMetadataEntry(entry)
      }
    }

    async #processTemplateRepoMetadataEntry(entry) {
      const [category_name, template_name] = entry.name.replaceAll(".html", "").split("_")
      if (!(await this.#templateExistsInDB(entry.name))) {
        // If template does not exist in DB, create it
        const template_content = await this.#fetchTemplateContent(entry.download_url)
        await this.#createTemplateInDB(entry.name, category_name, template_name, entry.sha, template_content)
        return
      }
      if (await this.#fileHashHasChanged(entry.name, entry.sha)) {
        // If template exists in DB but has changed, update it
        const template_content = await this.#fetchTemplateContent(entry.download_url)
        await this.#updateTemplateInDB(entry.name, category_name, template_name, entry.sha, template_content)
        return
      }
    }

    async #getTemplateRepoMetadata(url) {
      const response = await fetch(url)
      if (!response.ok) {
        alert("Failed to access template repository via: " + url)
        return {}
      }
      return await response.json()
    }

    async #getDBConnection() {
      return idb.openDB(application_name, 1, {
        upgrade(db) {
          const store = db.createObjectStore("templates", { keyPath: "full_template_name" })
          store.createIndex("category_name", "category_name", { unique: false })
          store.createIndex("template_name", "template_name", { unique: false })
          store.createIndex("hash", "hash", { unique: false })
          store.createIndex("content", "content", { unique: false })
        },
      })
    }

    async #createTemplateInDB(full_name, category_name, template_name, hash, content) {
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readwrite")
      const object_store = transaction.objectStore("templates")
      await object_store.add({
        full_template_name: full_name,
        category_name: category_name,
        template_name: template_name,
        hash: hash,
        content: content,
      })
      await transaction.done
    }

    async #updateTemplateInDB(full_name, category_name, template_name, hash, content) {
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readwrite")
      const object_store = transaction.objectStore("templates")
      await object_store.put({
        full_template_name: full_name,
        category_name: category_name,
        template_name: template_name,
        hash: hash,
        content: content,
      })
      await transaction.done
    }

    async #templateExistsInDB(full_name) {
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readonly")
      const object_store = transaction.objectStore("templates")
      const result = await object_store.get(full_name)
      await transaction.done
      return result !== undefined
    }

    async #fetchTemplateContent(url) {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch template content from: " + url)
      }
      return await response.text()
    }

    async #fileHashHasChanged(full_name, new_hash) {
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readonly")
      const object_store = transaction.objectStore("templates")
      const result = await object_store.get(full_name)
      await transaction.done
      return result.hash !== new_hash
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  class PageElementManager {
    #template_repository
    #observer = new MutationObserver(() => {
      if (!this.#elementIsPresent("#ticket-templates") && this.#elementIsPresent(".angular-editor-wrapper.show-placeholder")) {
        this.#deleteReadingDirectionSwitcher()
        this.#removeInputFields()
        this.#addTemplatesToNav()
        return
      }
      if (
        !this.#elementIsPresent("#gm-name") &&
        this.#elementIsPresent(".header-container") &&
        !this.#elementIsPresent(".angular-editor-wrapper.show-placeholder")
      ) {
        this.#deleteReadingDirectionSwitcher()
        this.#removeTemplatesFromNav()
        this.#addInputFields()
        return
      }
    })

    constructor(url) {
      this.#template_repository = new TemplateRepository(url)
      this.#observer.observe(document.documentElement, { childList: true, subtree: true })
    }

    #elementIsPresent(selector) {
      return document.querySelector(selector) !== null
    }

    #addTemplatesToNav() {
      let existing_menu_items = document.querySelector("nb-menu").querySelector(".menu-items")
      let new_menu_item = this.#createMenuItem("Ticket Templates")
      this.#template_repository.getAll().then((templates) => {
        templates.forEach((templates, category_name) => {
          let category = this.#createCategory(category_name)
          templates.forEach((template_content, template_name) => {
            let template = this.#createCategoryItem(template_name, template_content)
            category.querySelector("ul").appendChild(template)
          })
          new_menu_item.querySelector("ul").appendChild(category)
        })
      })
      existing_menu_items.appendChild(new_menu_item)
    }

    #removeTemplatesFromNav() {
      this.#removeElementBy("#ticket-templates")
    }

    #addInputFields() {
      this.#addInputField("phrase", "Kind regards", true)
      this.#addInputField("gm-name", "[GM]Example", false)
    }

    #addInputField(id, placeholder, do_margin_left) {
      let input_field = Object.assign(document.createElement("input"), {
        id: id,
        type: "text",
        placeholder: placeholder,
        className: "size-medium status-basic shape-rectangle ng-pristine ng-valid nb-transition ng-touched cdk-focused cdk-mouse-focused",
      })
      input_field.setAttribute("nbinput", "")
      input_field.style = do_margin_left ? "margin: 10px; margin-left: 2em;" : "margin: 10px;"

      const saved_name = localStorage.getItem(id)
      if (saved_name) {
        input_field.value = saved_name
      }

      input_field.addEventListener("input", function () {
        localStorage.setItem(id, input_field.value)
      })

      let header_container = document.querySelector(".header-container")
      header_container.appendChild(input_field)
    }

    #removeInputFields() {
      this.#removeElementBy("#phrase")
      this.#removeElementBy("#gm-name")
    }

    #removeElementBy(selector) {
      let element_to_remove = document.querySelector(selector)
      if (element_to_remove) {
        element_to_remove.remove()
      }
    }

    #deleteReadingDirectionSwitcher() {
      this.#removeElementBy(".direction-switcher")
    }

    #createCategoryItem(name, content) {
      let item = Object.assign(document.createElement("li"), {
        className: "menu_item ng-tns-c72-4 ng-star-inserted",
      })
      let item_link = Object.assign(document.createElement("a"), {
        href: "#",
        title: name,
        className: "ng-tns-c72-4 ng-star-inserted",
      })
      let item_title = Object.assign(document.createElement("span"), {
        className: "menu-title ng-tns-c72-5",
        textContent: name,
      })
      item_link.addEventListener("click", function (event) {
        event.preventDefault()
        let text_editor = document.querySelector(".angular-editor-wrapper.show-placeholder")
        if (text_editor) {
          let text_editor_area = text_editor.querySelector(".angular-editor-textarea")
          let text_editor_placeholder = text_editor.querySelector(".angular-editor-placeholder")
          if (text_editor_area) {
            text_editor_area.setAttribute("data-placeholder-disabled", "true")
            text_editor_area.innerHTML = "" + content
          }
          if (text_editor_placeholder) {
            text_editor_placeholder.style.display = "none"
          }
        }
      })
      item_link.appendChild(item_title)
      item.appendChild(item_link)
      return item
    }

    #createCategory(name) {
      let category = Object.assign(document.createElement("li"), {
        className: "menu-item ng-tns-c72-3 ng-star-inserted",
      })
      let category_link = Object.assign(document.createElement("a"), {
        href: "#",
        title: name,
        className: "ng-tns-c72-3 ng-star-inserted",
      })
      let category_title = Object.assign(document.createElement("span"), {
        className: "menu-title ng-tns-c72-3",
      })
      category_title.textContent = name

      let expand_icon = Object.assign(document.createElement("nb-icon"), {
        className: "expand-state ng-tns-c72-3",
      })
      expand_icon.setAttribute("pack", "nebular-essentials")
      expand_icon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="100%" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-down"><rect width="24" height="24" opacity="0"></rect><path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path></g></g></svg>'

      category_link.appendChild(category_title)
      category_link.appendChild(expand_icon)

      let category_items = Object.assign(document.createElement("ul"), {
        className: "menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted",
        style: "display: none;",
      })

      category_link.addEventListener("click", function (event) {
        event.preventDefault()
        if (category_items.style.display === "none") {
          category_items.style.display = "block"
          category_items.className = "menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted expanded"
        } else {
          category_items.style.display = "none"
          category_items.className = "menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted collapsed"
        }
      })

      category.appendChild(category_link)
      category.appendChild(category_items)

      return category
    }

    #createMenuItem(name) {
      let menu_item = Object.assign(document.createElement("li"), {
        id: "ticket-templates",
        className: "menu-item ng-tns-c72-1 ng-star-inserted",
      })

      let menu_item_link = Object.assign(document.createElement("a"), {
        href: "#",
        title: name,
        className: "ng-tns-c72-2 ng-star-inserted",
      })

      let menu_item_title = Object.assign(document.createElement("span"), {
        className: "menu-title ng-tns-c72-2",
      })
      menu_item_title.textContent = name

      let expand_icon = Object.assign(document.createElement("nb-icon"), {
        className: "expand-state ng-tns-c72-2",
      })
      expand_icon.setAttribute("pack", "nebular-essentials")
      expand_icon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="100%" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-down"><rect width="24" height="24" opacity="0"></rect><path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path></g></g></svg>'

      menu_item_link.appendChild(menu_item_title)
      menu_item_link.appendChild(expand_icon)

      let categories = Object.assign(document.createElement("ul"), {
        className: "menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted",
        style: "display: none;",
      })

      menu_item_link.addEventListener("click", function (event) {
        event.preventDefault()
        if (categories.style.display === "none") {
          categories.style.display = "block"
          categories.className = "menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted expanded"
        } else {
          categories.style.display = "none"
          categories.className = "menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted collapsed"
        }
      })

      menu_item.appendChild(menu_item_link)
      menu_item.appendChild(categories)

      return menu_item
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function applyTheme(theme) {
    const updated_body_classname = document.body.className.includes("pace-done") ? " " + theme + " pace-done" : "pace-running " + theme
    console.log("Applying theme: " + updated_body_classname)
    document.body.className = updated_body_classname
  }

  class ThemeManager {
    constructor() {
      this.#update_theme_switcher.observe(document.documentElement, { childList: true, subtree: true, attributes: true })
      this.#update_selected_theme.observe(document.documentElement, { childList: true, subtree: true, attributes: true })
      console.log("ThemeManager initialized")
    }

    #saved_theme = this.#loadTheme()

    #update_theme_switcher = new MutationObserver(() => {
      if (!this.#documentIsReady()) {
        return
      }

      if (!this.#elementIsPresent("#cdk-overlay-0 .option-list")) {
        return
      }

      this.#update_theme_switcher.disconnect()

      console.log("Theme dropdown menu detected")
      let drowpdown_menu = document.querySelector("#cdk-overlay-0 .option-list")
      let menu_options = drowpdown_menu.children

      if (!this.#elementIsPresent(".updated-theme-switcher")) {
        console.log(" > First time the dropdown menu is detected, updating event listeners for each option")
        for (let option of menu_options) {
          option.addEventListener("click", this.#onThemeSwitcherClick)
        }
        drowpdown_menu.classList.add("updated-theme-switcher")
      }

      console.log(" > Updating selected theme")
      for (let option of menu_options) {
        option.classList.remove("selected")
        if (option.textContent.toLowerCase() === this.#saved_theme.replaceAll("nb-theme-", "").replaceAll("-", " ")) {
          option.classList.add("selected")
        }
      }

      this.#update_selected_theme.observe(document.documentElement, { childList: true, subtree: true, attributes: true })
    })

    #update_selected_theme = new MutationObserver(() => {
      if (!this.#documentIsReady()) {
        return
      }
      if (!this.#elementIsPresent(".select-button nb-icon")) {
        return
      }
      console.log("Theme button detected")
      let select_theme_button = document.querySelector(".select-button")
      if (!select_theme_button.firstChild.nodeType === Node.TEXT_NODE || select_theme_button.firstChild.textContent === "") {
        return
      }
      console.log("Default text in theme button detected: '" + select_theme_button.firstChild.textContent + "'")
      let theme_name = this.#saved_theme
        .replaceAll("nb-theme-", "")
        .replaceAll("-", " ")
        .replace("default", "light")
        .replace(/\b\w/g, (c) => c.toUpperCase())
      console.log("Updating theme button text to: " + theme_name)
      select_theme_button.firstChild.textContent = theme_name
      applyTheme(this.#saved_theme)
      this.#update_selected_theme.disconnect()
    })

    #documentIsReady() {
      return !document.body.className.includes("pace-running")
    }

    #elementIsPresent(selector) {
      return document.querySelector(selector) !== null
    }

    #onThemeSwitcherClick() {
      console.log(document.body.classList)
      let last_selected_theme = ""
      for (let current_css_class of document.body.classList) {
        if (current_css_class.includes("nb-theme-")) {
          last_selected_theme = current_css_class
        }
      }
      localStorage.setItem("theme", last_selected_theme)
      applyTheme(last_selected_theme)
    }

    #loadTheme() {
      const saved_theme = localStorage.getItem("theme")
      const actual_theme = saved_theme ? saved_theme : "nb-theme-default"
      applyTheme(actual_theme)
      return actual_theme
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  class StartAdminCompanion {
    constructor() {
      const page_manager = new PageElementManager(template_repository_url)
      const theme_manager = new ThemeManager()
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  new StartAdminCompanion()

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
})()
