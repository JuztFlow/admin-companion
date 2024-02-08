////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// - IMPORTANT: Change the following configuration values to match your needs!
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// - Application name (used for IndexedDB database name), should not be changed after first use:
const application_name = "v4s-admin-companion"
//
// - URL to the template repository, must be a valid GitHub API URL with the following structure: "https://api.github.com/repos/<username>/<repository>/contents/<path>"
const template_repository_url = "https://api.github.com/repos/JuztFlow/v4s-admin-companion/contents/templates"
//
// - Uncomment to: disable specific logging output
// console.log = function () {}
// console.warn = function () {}
// console.error = function () {}
// console.debug = function () {} // <- [DEBUG] logging currently disabled
//
// - Uncomment to: flush database on every page load (will certainly cause issues with rate limit on github, therefore not recommended unless you know what you're doing)
// await idb.deleteDB(application_name);
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// !!! Don't change anything below this line unless you know what you're doing !!!
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
;(function () {
  "use strict"

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  class Time {
    static now() {
      const options = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        millisecond: "numeric",
      }
      return new Intl.DateTimeFormat(navigator.language, options).format(new Date())
    }
  }

  // info, debug, warn, error
  class Log {
    static info(message) {
      console.log(Time.now() + " | [INFO] " + message)
    }
    static debug(message) {
      console.debug(Time.now() + " | [DEBUG] " + message)
    }
    static warn(message) {
      console.warn(Time.now() + " | [WARN] " + message)
    }
    static error(message) {
      console.error(Time.now() + " | [ERROR] " + message)
    }
  }

  class TemplateRepository {
    #dbConnectionPromise

    async getAll() {
      Log.debug("TemplateRepository: getAll() called; fetching all templates from DB")
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readonly")
      const object_store = transaction.objectStore("templates")
      const result = await object_store.getAll()
      await transaction.done
      const templates = await this.getMapFromResult(result)
      Log.debug("TemplateRepository: getAll() called; returning all templates from DB")
      return templates
    }

    async getMapFromResult(result) {
      Log.debug("TemplateRepository: getAll() called; Converting templates from DB into Map")
      const templates = new Map()
      for (const template of result) {
        if (!templates.has(template.category_name)) {
          templates.set(template.category_name, new Map())
        }
        templates.get(template.category_name).set(template.template_name, template.content)
      }
      Log.debug("TemplateRepository: getAll() called; Templates from DB successfully converted into Map")
      return templates
    }

    constructor(url) {
      Log.debug("TemplateRepository: Initializing")
      this.#initializeRepository(url)
      Log.debug("TemplateRepository: Initialized")
    }

    async #initializeRepository(url) {
      this.#dbConnectionPromise = await this.#getDBConnection()
      const template_repo_metadata = await this.#getTemplateRepoMetadata(url)
      for (const entry of template_repo_metadata) {
        await this.#processTemplateRepoMetadataEntry(entry)
      }
      await this.#deleteObsoleteTemplates(template_repo_metadata)
    }

    async #deleteObsoleteTemplates(template_repo_metadata) {
      Log.debug("TemplateRepository: Deleting obsolete templates from DB")
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readonly")
      const object_store = transaction.objectStore("templates")
      const result = await object_store.getAll()
      let deleted_templates = 0
      await transaction.done
      for (const template_db of result) {
        if (!template_repo_metadata.some((template_metadata) => template_metadata.name === template_db.full_template_name)) {
          await this.#deleteTemplateFromDB(template_db.full_template_name)
          deleted_templates++
        }
      }
      Log.debug("TemplateRepository: Deleted " + deleted_templates + " obsolete templates from DB")
    }

    async #processTemplateRepoMetadataEntry(entry) {
      const [category_name, template_name] = entry.name.replaceAll(".html", "").split("_")
      if (!(await this.#templateExistsInDB(entry.name))) {
        Log.debug("TemplateRepository: Template does not exist in DB yet ... creating: " + entry.name)
        const template_content = await this.#fetchTemplateContent(entry.download_url)
        await this.#createTemplateInDB(entry.name, category_name, template_name, entry.sha, template_content)
        return
      }
      if (await this.#fileHashHasChanged(entry.name, entry.sha)) {
        Log.debug("TemplateRepository: Template hash has changed ... updating: " + entry.name)
        const template_content = await this.#fetchTemplateContent(entry.download_url)
        await this.#updateTemplateInDB(entry.name, category_name, template_name, entry.sha, template_content)
        return
      }
    }

    async #getTemplateRepoMetadata(url) {
      Log.debug("TemplateRepository: Fetching template repository metadata from: " + url)
      const response = await fetch(url)
      if (!response.ok) {
        Log.error("TemplateRepository: Failed to fetch template repository metadata from: " + url)
        return {}
      }
      const metadata = await response.json()
      Log.debug("TemplateRepository: Template repository metadata successfully fetched from: " + url)
      return metadata
    }

    async #getDBConnection() {
      Log.debug("TemplateRepository: Opening IndexedDB connection")
      const db_connection = idb.openDB(application_name, 1, {
        upgrade(db) {
          const store = db.createObjectStore("templates", { keyPath: "full_template_name" })
          store.createIndex("category_name", "category_name", { unique: false })
          store.createIndex("template_name", "template_name", { unique: false })
          store.createIndex("hash", "hash", { unique: false })
          store.createIndex("content", "content", { unique: false })
        },
      })
      Log.debug("TemplateRepository: IndexedDB connection opened")
      return db_connection
    }

    async #createTemplateInDB(full_name, category_name, template_name, hash, content) {
      Log.debug("TemplateRepository: Creating template in DB: " + full_name)
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
      Log.debug("TemplateRepository: Template created in DB: " + full_name)
    }

    async #deleteTemplateFromDB(full_name) {
      Log.debug("TemplateRepository: Deleting template from DB: " + full_name)
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readwrite")
      const object_store = transaction.objectStore("templates")
      await object_store.delete(full_name)
      await transaction.done
      Log.debug("TemplateRepository: Template deleted from DB: " + full_name)
    }

    async #updateTemplateInDB(full_name, category_name, template_name, hash, content) {
      Log.debug("TemplateRepository: Updating template in DB: " + full_name)
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
      Log.debug("TemplateRepository: Template updated in DB: " + full_name)
    }

    async #templateExistsInDB(full_name) {
      Log.debug("TemplateRepository: Checking if template exists in DB: " + full_name)
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readonly")
      const object_store = transaction.objectStore("templates")
      const result = await object_store.get(full_name)
      await transaction.done
      const exists = result !== undefined
      Log.debug("TemplateRepository: " + (exists ? "Template already exists in DB: " : "Template does not exist in DB yet: ") + full_name)
      return exists
    }

    async #fetchTemplateContent(url) {
      Log.debug("TemplateRepository: Fetching template content from: " + url)
      const response = await fetch(url)
      if (!response.ok) {
        Log.error("TemplateRepository: Failed to fetch template content from: " + url)
      }
      const content = await response.text()
      Log.debug("TemplateRepository: Template content successfully fetched from: " + url)
      return content
    }

    async #fileHashHasChanged(full_name, new_hash) {
      Log.debug("TemplateRepository: Checking if template hash has changed: " + full_name)
      const database = await this.#dbConnectionPromise
      const transaction = database.transaction("templates", "readonly")
      const object_store = transaction.objectStore("templates")
      const result = await object_store.get(full_name)
      await transaction.done
      const has_hash_changed = result.hash !== new_hash
      let log_message = "TemplateRepository: Template hash has"
      log_message += has_hash_changed ? "changed for: " : "not changed for: "
      log_message += full_name
      log_message += has_hash_changed ? " (old: " + result.hash + ", new: " + new_hash + ")" : ""
      Log.debug(log_message)
      return has_hash_changed
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  class PageElementManager {
    #template_repository
    #observer = new MutationObserver(() => {
      if (!this.#elementIsPresent("#ticket-templates") && this.#elementIsPresent(".angular-editor-wrapper")) {
        Log.debug("PageElementManager: Ticket text editor detected -> we are on a specific Ticket page!")
        this.#deleteReadingDirectionSwitcher()
        this.#removeInputFields()
        this.#addTemplatesToNav()
        return
      }
      if (
        !this.#elementIsPresent("#gm-name") &&
        this.#elementIsPresent(".header-container") &&
        !this.#elementIsPresent(".angular-editor-wrapper")
      ) {
        Log.debug(
          "PageElementManager: Absence of ticket text editor detected and header container present -> we are on the Dashboard or Ticket Overview page!"
        )
        this.#deleteReadingDirectionSwitcher()
        this.#removeTemplatesFromNav()
        this.#addInputFields()
        return
      }
    })

    constructor(url) {
      Log.debug("PageElementManager: Initializing")
      this.#template_repository = new TemplateRepository(url)
      this.#observer.observe(document.documentElement, { childList: true, subtree: true })
      Log.debug("PageElementManager: Initialized")
    }

    #elementIsPresent(selector) {
      return document.querySelector(selector) !== null
    }

    #addTemplatesToNav() {
      Log.debug("PageElementManager: Adding Ticket Templates Menu Item to navigation")
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
      Log.debug("PageElementManager: Ticket Templates added Menu Item to navigation")
    }

    #removeTemplatesFromNav() {
      Log.debug("PageElementManager: Removing Ticket Templates Menu Item from navigation")
      this.#removeElementBy("#ticket-templates")
      Log.debug("PageElementManager: Ticket Templates removed Menu Item from navigation")
    }

    #addInputFields() {
      Log.debug("PageElementManager: Adding Phrase and GM Name input fields")
      this.#addInputField("phrase", "Kind regards", true)
      this.#addInputField("gm-name", "[GM]Example", false)
      Log.debug("PageElementManager: Phrase and GM Name input fields added")
    }

    #addInputField(id, placeholder, do_margin_left) {
      Log.debug("PageElementManager: Adding input field with id: " + id)
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
      Log.debug("PageElementManager: Input field with id: " + id + " added")
    }

    #removeInputFields() {
      Log.debug("PageElementManager: Removing Phrase and GM Name input fields")
      this.#removeElementBy("#phrase")
      this.#removeElementBy("#gm-name")
      Log.debug("PageElementManager: Phrase and GM Name input fields removed")
    }

    #removeElementBy(selector) {
      let element_to_remove = document.querySelector(selector)
      if (element_to_remove) {
        element_to_remove.remove()
      }
    }

    #deleteReadingDirectionSwitcher() {
      Log.debug("PageElementManager: Deleting reading direction switcher")
      this.#removeElementBy(".direction-switcher")
      Log.debug("PageElementManager: Reading direction switcher deleted")
    }

    #createCategoryItem(name, content) {
      Log.debug("PageElementManager: Creating category item: " + name)
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
          if (text_editor_placeholder) {
            text_editor_placeholder.style.display = "none"
          }
          if (text_editor_area) {
            text_editor_area.setAttribute("data-placeholder-disabled", "true")
            const saved_phrase = localStorage.getItem("phrase")
            const saved_gm_name = localStorage.getItem("gm-name")
            let final_content = content + "<div><br></div><div>"
            final_content += saved_phrase ? saved_phrase : ""
            final_content += "</div>"
            final_content += saved_gm_name ? saved_gm_name : ""
            text_editor_area.innerHTML = "" + final_content
          }
        }
      })
      item_link.appendChild(item_title)
      item.appendChild(item_link)
      Log.debug("PageElementManager: Category item created: " + name)
      return item
    }

    #createCategory(name) {
      Log.debug("PageElementManager: Creating category: " + name)
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
      Log.debug("PageElementManager: Category created: " + name)
      return category
    }

    #createMenuItem(name) {
      Log.debug("PageElementManager: Creating menu item: " + name)
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
      Log.debug("PageElementManager: Menu item created: " + name)
      return menu_item
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function applyTheme(theme, is_initial_load = false) {
    Log.debug(is_initial_load ? "Applying pre-loaded theme ..." : "Applying theme ...")
    const updated_body_classname = document.body.className.includes("pace-done") ? " " + theme + " pace-done" : "pace-running " + theme
    document.body.className = updated_body_classname
    Log.debug(is_initial_load ? "Pre-loaded theme applied: " + theme : "Theme applied: " + theme)
  }

  class ThemeManager {
    constructor() {
      Log.debug("ThemeManager: Initializing")
      this.#update_theme_switcher.observe(document.documentElement, { childList: true, subtree: true, attributes: true })
      this.#update_selected_theme.observe(document.documentElement, { childList: true, subtree: true, attributes: true })
      Log.debug("ThemeManager: Initialized")
    }

    #saved_theme = this.#loadTheme(true)

    #update_theme_switcher = new MutationObserver(() => {
      if (!this.#documentIsReady()) {
        return
      }
      if (!this.#elementIsPresent("#cdk-overlay-0 .option-list")) {
        return
      }

      Log.debug("ThemeManager: Document is ready and theme switcher is present ... pausing observer for update to avoid infinite loop ...")

      this.#update_theme_switcher.disconnect()

      let drowpdown_menu = document.querySelector("#cdk-overlay-0 .option-list")
      let menu_options = drowpdown_menu.children

      if (!this.#elementIsPresent(".updated-theme-switcher")) {
        Log.debug("ThemeManager: Theme switcher is also not updated yet ... updating theme switcher ...")
        for (let option of menu_options) {
          option.addEventListener("click", this.#onThemeSwitcherClick)
        }
        drowpdown_menu.classList.add("updated-theme-switcher")

        Log.debug("ThemeManager: Theme switcher updated")
      }

      Log.debug("ThemeManager: Update highlighting for selected theme")

      for (let option of menu_options) {
        option.classList.remove("selected")
        if (option.textContent.toLowerCase() === this.#saved_theme.replaceAll("nb-theme-", "").replaceAll("-", " ")) {
          option.classList.add("selected")
        }
      }

      Log.debug("ThemeManager: All updates complete, resuming observer ...")

      this.#update_selected_theme.observe(document.documentElement, { childList: true, subtree: true, attributes: true })
    })

    #update_selected_theme = new MutationObserver(() => {
      if (!this.#documentIsReady()) {
        return
      }
      if (!this.#elementIsPresent(".select-button nb-icon")) {
        return
      }
      let select_theme_button = document.querySelector(".select-button")
      if (!select_theme_button.firstChild.nodeType === Node.TEXT_NODE || select_theme_button.firstChild.textContent === "") {
        return
      }

      Log.debug("ThemeManager: Document is ready and select button is present - updating selected theme")

      let theme_name = this.#saved_theme
        .replaceAll("nb-theme-", "")
        .replaceAll("-", " ")
        .replace("default", "light")
        .replace(/\b\w/g, (c) => c.toUpperCase())
      select_theme_button.firstChild.textContent = theme_name

      Log.debug("ThemeManager: Selected theme updated: " + theme_name)

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
      Log.debug("ThemeManager: Theme switcher clicked")
      let last_selected_theme = ""
      for (let current_css_class of document.body.classList) {
        if (current_css_class.includes("nb-theme-")) {
          last_selected_theme = current_css_class
        }
      }
      localStorage.setItem("theme", last_selected_theme)
      applyTheme(last_selected_theme)
    }

    #loadTheme(is_initial_load = false) {
      Log.debug(is_initial_load ? "ThemeManager: Pre-Loading theme ..." : "ThemeManager: Loading theme ...")
      const saved_theme = localStorage.getItem("theme")
      const actual_theme = saved_theme ? saved_theme : "nb-theme-default"
      Log.debug(is_initial_load ? "ThemeManager: Pre-Loaded theme: " + actual_theme : "ThemeManager: Loaded theme: " + actual_theme)
      applyTheme(actual_theme, is_initial_load)
      return actual_theme
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  class StartAdminCompanion {
    constructor() {
      Log.info("Starting " + application_name + " ...")
      const page_manager = new PageElementManager(template_repository_url)
      const theme_manager = new ThemeManager()
      Log.info(application_name + " is running now!")
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  new StartAdminCompanion()

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
})()
