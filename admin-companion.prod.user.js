// ==UserScript==
// @name admin-companion
// @version 1.0.1
// @namespace http://tampermonkey.net/
// @description A tampermonkey script that extends the functionality of the 4V and 4C admin pages.
// @author Mind@vision4s.net
// @homepage https://github.com/JuztFlow/admin-companion#readme
// @license https://opensource.org/licenses/MIT
// @match https://admin.vision4s.com/*
// @match https://admin.4classic.eu/*
// @require https://cdn.jsdelivr.net/npm/idb@8/build/umd.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 137:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TemplateDB_db;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateDB = void 0;
const idb_1 = __webpack_require__(269);
const main_1 = __webpack_require__(519);
const logger_1 = __webpack_require__(473);
class TemplateDB {
    constructor() {
        _TemplateDB_db.set(this, null);
    }
    static async getInstance() {
        if (!TemplateDB.instance) {
            logger_1.Log.debug("[TemplateRepositoryDB.getInstance] Creating instance");
            const templateRepositoryDB = new TemplateDB();
            await templateRepositoryDB.initizalize();
            TemplateDB.instance = templateRepositoryDB;
        }
        logger_1.Log.debug("[TemplateRepositoryDB.getInstance] Returning instance");
        return TemplateDB.instance;
    }
    async initizalize() {
        logger_1.Log.debug("[TemplateRepositoryDB.initizalize] Initializing IDB");
        __classPrivateFieldSet(this, _TemplateDB_db, await (0, idb_1.openDB)(main_1.application_name, 1, {
            upgrade(db) {
                logger_1.Log.debug("[TemplateRepositoryDB.initizalize] Upgrading IDB");
                const object_store = db.createObjectStore("templates", { keyPath: "full_template_name" });
                object_store.createIndex("category_name", "category_name", { unique: false });
                object_store.createIndex("template_name", "template_name", { unique: false });
                object_store.createIndex("hash", "hash", { unique: false });
                object_store.createIndex("content", "content", { unique: false });
            },
        }), "f");
    }
    async getTemplate(full_template_name) {
        if (!__classPrivateFieldGet(this, _TemplateDB_db, "f")) {
            logger_1.Log.error("[TemplateRepositoryDB.getTemplate] Database not initialized!");
            throw new Error("Database not initialized!");
        }
        logger_1.Log.debug("[TemplateRepositoryDB.getTemplate] Retrieving template from IDB with name: " + full_template_name);
        const transaction = __classPrivateFieldGet(this, _TemplateDB_db, "f").transaction(["templates"], "readonly");
        const object_store = transaction.objectStore("templates");
        const result = await object_store.get(full_template_name);
        await transaction.done;
        return result;
    }
    async getAllTemplates() {
        if (!__classPrivateFieldGet(this, _TemplateDB_db, "f")) {
            logger_1.Log.error("[TemplateRepositoryDB.getAllTemplates] Database not initialized!");
            throw new Error("Database not initialized!");
        }
        logger_1.Log.debug("[TemplateRepositoryDB.getAllTemplates] Retrieving all templates from IDB");
        const transaction = __classPrivateFieldGet(this, _TemplateDB_db, "f").transaction(["templates"], "readonly");
        const object_store = transaction.objectStore("templates");
        const result = await object_store.getAll();
        await transaction.done;
        return result;
    }
    async deleteTemplate(full_template_name) {
        if (!__classPrivateFieldGet(this, _TemplateDB_db, "f")) {
            logger_1.Log.error("[TemplateRepositoryDB.deleteTemplate] Database not initialized!");
            throw new Error("Database not initialized!");
        }
        logger_1.Log.debug("[TemplateRepositoryDB.deleteTemplate] Deleting template from IDB with name: " + full_template_name);
        const transaction = __classPrivateFieldGet(this, _TemplateDB_db, "f").transaction(["templates"], "readwrite");
        const object_store = transaction.objectStore("templates");
        await object_store.delete(full_template_name);
        await transaction.done;
    }
    async exists(full_template_name) {
        if (!__classPrivateFieldGet(this, _TemplateDB_db, "f")) {
            logger_1.Log.error("[TemplateRepositoryDB.exists] Database not initialized!");
            throw new Error("Database not initialized!");
        }
        logger_1.Log.debug("[TemplateRepositoryDB.exists] Checking if template exists in IDB with name: " + full_template_name);
        const transaction = __classPrivateFieldGet(this, _TemplateDB_db, "f").transaction(["templates"], "readonly");
        const object_store = transaction.objectStore("templates");
        const result = await object_store.get(full_template_name);
        await transaction.done;
        return result !== undefined;
    }
    async updateTemplate(full_template_name, category_name, template_name, hash, content) {
        if (!__classPrivateFieldGet(this, _TemplateDB_db, "f")) {
            logger_1.Log.error("[TemplateRepositoryDB.updateTemplate] Database not initialized!");
            throw new Error("Database not initialized!");
        }
        logger_1.Log.debug("[TemplateRepositoryDB.updateTemplate] Updating template in IDB with name: " + full_template_name);
        const transaction = __classPrivateFieldGet(this, _TemplateDB_db, "f").transaction(["templates"], "readwrite");
        const object_store = transaction.objectStore("templates");
        await object_store.put({
            full_template_name: full_template_name,
            category_name: category_name,
            template_name: template_name,
            hash: hash,
            content: content,
        });
        await transaction.done;
    }
    async createTemplate(full_template_name, category_name, template_name, hash, content) {
        if (!__classPrivateFieldGet(this, _TemplateDB_db, "f")) {
            logger_1.Log.error("[TemplateRepositoryDB.createTemplate] Database not initialized!");
            throw new Error("Database not initialized!");
        }
        logger_1.Log.debug("[TemplateRepositoryDB.createTemplate] Creating template in IDB with name: " + full_template_name);
        const transaction = __classPrivateFieldGet(this, _TemplateDB_db, "f").transaction(["templates"], "readwrite");
        const object_store = transaction.objectStore("templates");
        await object_store.put({
            full_template_name: full_template_name,
            category_name: category_name,
            template_name: template_name,
            hash: hash,
            content: content,
        });
        await transaction.done;
    }
    async hasFileHashChanged(full_template_name, new_hash) {
        if (!__classPrivateFieldGet(this, _TemplateDB_db, "f")) {
            logger_1.Log.error("[TemplateRepositoryDB.hasFileHashChanged] Database not initialized!");
            throw new Error("Database not initialized!");
        }
        logger_1.Log.debug("[TemplateRepositoryDB.hasFileHashChanged] Checking if file hash has changed for template in IDB with name: " + full_template_name);
        const transaction = __classPrivateFieldGet(this, _TemplateDB_db, "f").transaction(["templates"], "readonly");
        const object_store = transaction.objectStore("templates");
        const result = await object_store.get(full_template_name);
        await transaction.done;
        if (!result) {
            logger_1.Log.error("[TemplateRepositoryDB.hasFileHashChanged] Template to check file hash for does not exist in IDB with name: " + full_template_name);
            throw new Error("Template to check file hash for does not exist in IDB with name: " + full_template_name);
        }
        return result.hash !== new_hash;
    }
}
exports.TemplateDB = TemplateDB;
_TemplateDB_db = new WeakMap();
TemplateDB.instance = null;


/***/ }),

/***/ 473:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Log = void 0;
const time_1 = __webpack_require__(193);
class Log {
    static info(message) {
        console.log(time_1.Time.now() + " | [INFO] " + message);
    }
    static debug(message) {
        console.debug(time_1.Time.now() + " | [DEBUG] " + message);
    }
    static warn(message) {
        console.warn(time_1.Time.now() + " | [WARN] " + message);
    }
    static error(message) {
        console.error(time_1.Time.now() + " | [ERROR] " + message);
    }
}
exports.Log = Log;


/***/ }),

/***/ 519:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.template_repository_url = exports.application_name = void 0;
exports.application_name = "admin-companion";
exports.template_repository_url = "https://api.github.com/repos/JuztFlow/admin-companion/contents/templates";
const logger_1 = __webpack_require__(473);
const page_manager_1 = __webpack_require__(523);
const theme_manager_1 = __webpack_require__(505);
async function main() {
    logger_1.Log.info("Starting " + exports.application_name + " ...");
    const page_manager = await page_manager_1.PageElementManager.getInstance();
    const theme_manager = await theme_manager_1.ThemeManager.getInstance();
    logger_1.Log.info(exports.application_name + " is running now!");
}
main();


/***/ }),

/***/ 523:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PageElementManager_observer;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PageElementManager = void 0;
const logger_1 = __webpack_require__(473);
const template_repository_1 = __webpack_require__(909);
class PageElementManager {
    constructor() {
        _PageElementManager_observer.set(this, new MutationObserver(() => {
            if (!this.elementIsPresent("#ticket-templates") && this.elementIsPresent(".angular-editor-wrapper") && this.isTicketViewPresent()) {
                logger_1.Log.debug("PageElementManager: Ticket text editor detected -> we are on a specific Ticket page!");
                this.deleteReadingDirectionSwitcher();
                this.removeInputFields();
                this.addTemplatesToNav();
                this.addCopyTemplateButtons();
            }
            if (!this.elementIsPresent("#gm-name") && this.elementIsPresent(".header-container") && !this.elementIsPresent(".angular-editor-wrapper")) {
                logger_1.Log.debug("PageElementManager: Absence of ticket text editor detected and header container present -> we are on the Dashboard or Ticket Overview page!");
                this.deleteReadingDirectionSwitcher();
                this.removeCopyTemplateButtons();
                this.removeTemplatesFromNav();
                this.addInputFields();
            }
            if (!this.elementIsPresent("#mail") &&
                !this.elementIsPresent("#status") &&
                this.elementIsPresent('input[name="mail"]') &&
                this.elementIsPresent('nb-select[name="status"]')) {
                logger_1.Log.debug("PageElementManager: Mail input and filter status select detected -> we are on the Ticket Overview page!");
                const mail_input = document.querySelector('input[name="mail"]');
                const status_select = document.querySelector('nb-select[name="status"]');
                this.loadSavedFilters(mail_input, status_select);
                this.addSaveFunctionalityToFilters(mail_input, status_select);
                this.updateFiltersStyle(mail_input, status_select);
                this.addResetButtons(mail_input, status_select);
                return;
            }
        }));
    }
    static async getInstance() {
        if (!PageElementManager.instance) {
            logger_1.Log.debug("PageElementManager: Creating instance");
            const pageElementManager = new PageElementManager();
            PageElementManager.template_repository = await template_repository_1.TemplateRepository.getInstance();
            await pageElementManager.initialize();
            PageElementManager.instance = pageElementManager;
        }
        logger_1.Log.debug("PageElementManager: Returning instance");
        return PageElementManager.instance;
    }
    async initialize() {
        logger_1.Log.debug("[PageElementManager.initialize]: Initializing");
        __classPrivateFieldGet(this, _PageElementManager_observer, "f").observe(document.documentElement, { childList: true, subtree: true });
        logger_1.Log.debug("[PageElementManager.initialize]: PageElementManager is now observing");
    }
    elementIsPresent(selector) {
        return document.querySelector(selector) !== null;
    }
    isTicketViewPresent() {
        logger_1.Log.debug("[PageElementManager.isTicketViewPresent]: Checking if ticket view is present");
        const ticket_view = document.querySelector("ngx-ticket-view");
        if (!ticket_view) {
            return false;
        }
        return ticket_view.childElementCount >= 4;
    }
    addTemplatesToNav() {
        logger_1.Log.debug("[PageElementManager.addTemplatesToNav]: Adding Ticket Templates to navigation");
        let existing_menu_items = document.querySelector("nb-menu")?.querySelector(".menu-items");
        let new_menu_item = this.createMenuItem("Ticket Templates");
        PageElementManager.template_repository?.getAll().then((templates) => {
            templates.forEach((templates, category_name) => {
                let category = this.createCategory(category_name);
                templates.forEach((template_content, template_name) => {
                    let template = this.createCategoryItem(template_name, template_content);
                    category.querySelector("ul")?.appendChild(template);
                });
                new_menu_item.querySelector("ul")?.appendChild(category);
            });
        });
        existing_menu_items?.appendChild(new_menu_item);
    }
    removeTemplatesFromNav() {
        logger_1.Log.debug("[PageElementManager.removeTemplatesFromNav]: Removing Ticket Templates from navigation");
        this.removeElementBy("#ticket-templates");
    }
    addInputFields() {
        logger_1.Log.debug("[PageElementManager.addInputFields]: Adding input fields");
        this.addInputField("phrase", "Kind regards", true);
        this.addInputField("gm-name", "[GM]Example", false);
    }
    addInputField(id, placeholder, do_margin_left) {
        logger_1.Log.debug("[PageElementManager.addInputField]: Adding input field with id: " + id);
        let input_field = Object.assign(document.createElement("input"), {
            id: id,
            type: "text",
            placeholder: placeholder,
            className: "size-medium status-basic shape-rectangle ng-pristine ng-valid nb-transition ng-touched cdk-focused cdk-mouse-focused",
        });
        input_field.setAttribute("nbinput", "");
        input_field.style.cssText = do_margin_left ? "margin: 10px; margin-left: 2em;" : "margin: 10px;";
        const saved_name = localStorage.getItem(id);
        if (saved_name) {
            input_field.value = saved_name;
        }
        input_field.addEventListener("input", function () {
            localStorage.setItem(id, input_field.value);
        });
        let header_container = document.querySelector(".header-container");
        header_container?.appendChild(input_field);
    }
    removeInputFields() {
        logger_1.Log.debug("[PageElementManager.removeInputFields]: Removing input fields");
        this.removeElementBy("#phrase");
        this.removeElementBy("#gm-name");
    }
    removeElementBy(selector) {
        let element_to_remove = document.querySelector(selector);
        if (element_to_remove) {
            element_to_remove.remove();
        }
    }
    removeElementsBy(selector) {
        let elements_to_remove = document.querySelectorAll(selector);
        if (elements_to_remove) {
            elements_to_remove.forEach((element) => {
                element.remove();
            });
        }
    }
    deleteReadingDirectionSwitcher() {
        logger_1.Log.debug("[PageElementManager.deleteReadingDirectionSwitcher]: Deleting reading direction switcher");
        this.removeElementBy(".direction-switcher");
    }
    addCopyTemplateButtons() {
        logger_1.Log.debug("[PageElementManager.addCopyTemplateButtons]: Adding copy template buttons");
        const ticket_view = document.querySelector("ngx-ticket-view");
        if (!ticket_view) {
            logger_1.Log.debug("[PageElementManager.addCopyTemplateButtons]: Ticket view not found, skipping ...");
            return;
        }
        const ticket_entries = ticket_view.querySelectorAll("nb-card");
        let ticket_answers = Array.from(ticket_entries).slice(1, -1);
        ticket_answers.forEach((ticket_answer) => {
            let ticket_answer_header = ticket_answer.querySelector("nb-card-header");
            let ticket_answer_body = ticket_answer.querySelector("nb-card-body");
            if (!ticket_answer_header) {
                logger_1.Log.error("[PageElementManager.addCopyTemplateButtons]: Ticket answer header not found, skipping ...");
                return;
            }
            if (!ticket_answer_body) {
                logger_1.Log.error("[PageElementManager.addCopyTemplateButtons]: Ticket answer body not found, skipping ...");
                return;
            }
            ticket_answer_header.style.display = "flex";
            ticket_answer_header.style.alignItems = "center";
            ticket_answer_header.innerHTML = '<div style="flex: 1;">' + ticket_answer_header.innerHTML + "</div>";
            let copy_button = this.createCopyButton(ticket_answer_body);
            ticket_answer_header.appendChild(copy_button);
            logger_1.Log.debug("PageElementManager: Copy button added to ticket answer");
        });
        let submit_button = document.querySelector("nb-card-footer button");
        if (submit_button) {
            submit_button.addEventListener("click", () => {
                const wait_for_pace_running = new MutationObserver(() => {
                    if (document.body.className.includes("pace-running")) {
                        logger_1.Log.debug("PageElementManager: Pace running detected, starting to wait for pace-done ...");
                        wait_for_pace_running.disconnect();
                        wait_for_pace_done_and_all_ticket_answers.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
                    }
                });
                const wait_for_pace_done_and_all_ticket_answers = new MutationObserver(() => {
                    if (document.body.className.includes("pace-done") && this.isTicketViewPresent()) {
                        logger_1.Log.debug("PageElementManager: All ticket answers present, re-adding copy buttons ...");
                        this.addCopyTemplateButtons();
                        wait_for_pace_done_and_all_ticket_answers.disconnect();
                    }
                });
                wait_for_pace_running.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
            });
        }
    }
    removeCopyTemplateButtons() {
        logger_1.Log.debug("[PageElementManager.removeCopyTemplateButtons]: Removing copy template buttons");
        this.removeElementsBy(".copy-button");
    }
    createCopyButton(ticket_answer_body) {
        logger_1.Log.debug("[PageElementManager.createCopyButton]: Creating copy button");
        let copy_button = Object.assign(document.createElement("button"), {
            className: "copy-button appearance-filled size-medium status-basic shape-rectangle nb-transition",
            style: "float: right; margin-right: 1em;",
            textContent: "Copy Template",
        });
        copy_button.setAttribute("nbbutton", "");
        copy_button.addEventListener("click", function () {
            let text_to_copy = ticket_answer_body.innerHTML;
            navigator.clipboard.writeText(text_to_copy);
            logger_1.Log.info("Template with length " + text_to_copy.length + " copied to clipboard!");
        });
        logger_1.Log.debug("PageElementManager: Copy button created");
        return copy_button;
    }
    loadSavedFilters(mail_input, status_select) {
        logger_1.Log.debug("PageElementManager: Loading saved filters");
        const saved_mail = localStorage.getItem("mail");
        const saved_status = localStorage.getItem("status");
        if (saved_mail) {
            mail_input.value = saved_mail;
            mail_input.dispatchEvent(new Event("input", { bubbles: true }));
            mail_input.dispatchEvent(new Event("change", { bubbles: true }));
            mail_input.dispatchEvent(new Event("blur", { bubbles: true }));
        }
        if (saved_status) {
            status_select.click();
            const option_list = document.querySelector(".option-list");
            if (option_list) {
                const status_options = option_list.querySelectorAll("nb-option");
                status_options.forEach((status_option) => {
                    if (status_option.innerText === saved_status) {
                        status_option.click();
                    }
                });
            }
            status_select.click();
        }
        logger_1.Log.debug("PageElementManager: Saved filters loaded");
    }
    addSaveFunctionalityToFilters(mail_input, status_select) {
        logger_1.Log.debug("[PageElementManager.addSaveFunctionalityToFilters]: Adding save functionality to filters");
        mail_input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                localStorage.setItem("mail", mail_input.value);
            }
        });
        status_select.click();
        const option_list = document.querySelector(".option-list");
        if (option_list) {
            const status_options = option_list.querySelectorAll("nb-option");
            status_options.forEach((status_option) => {
                status_option.addEventListener("click", function () {
                    localStorage.setItem("status", status_option.innerText);
                });
            });
        }
        logger_1.Log.debug("PageElementManager: Save functionality added");
    }
    updateFiltersStyle(mail_input, status_select) {
        logger_1.Log.debug("PageElementManager: Updating filters style");
        mail_input.id = "mail";
        mail_input.placeholder = "user@domain.com";
        mail_input.style.width = "320px";
        let mail_label = mail_input.previousElementSibling;
        if (mail_label) {
            mail_label.innerText += ":";
            mail_label.style.width = "6em";
        }
        status_select.id = "status";
        let status_label = status_select.previousElementSibling;
        status_label.innerText += ":";
        status_label.style.width = "6em";
    }
    addResetButtons(mail_input, status_select) {
        logger_1.Log.debug("PageElementManager: Adding reset buttons");
        let reset_button_mail = this.createMailResetButton(mail_input);
        mail_input.insertAdjacentElement("afterend", reset_button_mail);
        let reset_button_status = this.createStatusResetButton(status_select);
        status_select.insertAdjacentElement("afterend", reset_button_status);
        logger_1.Log.debug("PageElementManager: Reset buttons added");
    }
    createMailResetButton(mail_input) {
        logger_1.Log.debug("PageElementManager: Creating email reset button");
        let reset_button = Object.assign(document.createElement("button"), {
            className: "reset-button appearance-filled size-medium status-danger shape-rectangle nb-transition",
            style: "margin-left: 1em;",
            textContent: "⟳",
        });
        reset_button.setAttribute("nbbutton", "");
        reset_button.addEventListener("click", function () {
            mail_input.value = "";
            localStorage.removeItem("mail");
            mail_input.dispatchEvent(new Event("input", { bubbles: true }));
            mail_input.dispatchEvent(new Event("change", { bubbles: true }));
            mail_input.dispatchEvent(new Event("blur", { bubbles: true }));
            logger_1.Log.info("Email filter reset!");
        });
        logger_1.Log.debug("PageElementManager: Email reset button created");
        return reset_button;
    }
    createStatusResetButton(status_select) {
        logger_1.Log.debug("PageElementManager: Creating status reset button");
        let reset_button = Object.assign(document.createElement("button"), {
            className: "reset-button appearance-filled size-medium status-danger shape-rectangle nb-transition",
            style: "margin-left: 1em;",
            textContent: "⟳",
        });
        reset_button.setAttribute("nbbutton", "");
        reset_button.addEventListener("click", function () {
            status_select.click();
            const option_list = document.querySelector(".option-list");
            if (option_list) {
                const status_options = option_list.querySelectorAll("nb-option");
                status_options.forEach((status_option) => {
                    if (status_option.innerText === "Open") {
                        status_option.click();
                    }
                });
            }
            status_select.click();
            localStorage.setItem("status", "Open");
            logger_1.Log.info("Status filter reset!");
        });
        logger_1.Log.debug("PageElementManager: Status reset button created");
        return reset_button;
    }
    createCategoryItem(name, content) {
        logger_1.Log.debug("PageElementManager: Creating category item: " + name);
        let item = Object.assign(document.createElement("li"), {
            className: "menu_item ng-tns-c72-4 ng-star-inserted",
        });
        let item_link = Object.assign(document.createElement("a"), {
            href: "#",
            title: name,
            className: "ng-tns-c72-4 ng-star-inserted",
        });
        let item_title = Object.assign(document.createElement("span"), {
            className: "menu-title ng-tns-c72-5",
            textContent: name,
        });
        item_link.addEventListener("click", function (event) {
            event.preventDefault();
            let text_editor = document.querySelector(".angular-editor-wrapper.show-placeholder");
            if (text_editor) {
                let text_editor_area = text_editor.querySelector(".angular-editor-textarea");
                let text_editor_placeholder = text_editor.querySelector(".angular-editor-placeholder");
                if (text_editor_placeholder) {
                    text_editor_placeholder.style.display = "none";
                }
                if (text_editor_area) {
                    text_editor_area.setAttribute("data-placeholder-disabled", "true");
                    const saved_phrase = localStorage.getItem("phrase");
                    const saved_gm_name = localStorage.getItem("gm-name");
                    let final_content = content + "<div><br></div><div>";
                    final_content += saved_phrase ? saved_phrase : "";
                    final_content += "</div>";
                    final_content += saved_gm_name ? saved_gm_name : "";
                    text_editor_area.innerHTML = "" + final_content;
                }
            }
        });
        item_link.appendChild(item_title);
        item.appendChild(item_link);
        logger_1.Log.debug("PageElementManager: Category item created: " + name);
        return item;
    }
    createCategory(name) {
        logger_1.Log.debug("PageElementManager: Creating category: " + name);
        let category = Object.assign(document.createElement("li"), {
            className: "menu-item ng-tns-c72-3 ng-star-inserted",
        });
        let category_link = Object.assign(document.createElement("a"), {
            href: "#",
            title: name,
            className: "ng-tns-c72-3 ng-star-inserted",
        });
        let category_title = Object.assign(document.createElement("span"), {
            className: "menu-title ng-tns-c72-3",
        });
        category_title.textContent = name;
        let expand_icon = Object.assign(document.createElement("nb-icon"), {
            className: "expand-state ng-tns-c72-3",
        });
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
            }
            else {
                category_items.style.display = "none";
                category_items.className = "menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted collapsed";
            }
        });
        category.appendChild(category_link);
        category.appendChild(category_items);
        logger_1.Log.debug("PageElementManager: Category created: " + name);
        return category;
    }
    createMenuItem(name) {
        logger_1.Log.debug("PageElementManager: Creating menu item: " + name);
        let menu_item = Object.assign(document.createElement("li"), {
            id: "ticket-templates",
            className: "menu-item ng-tns-c72-1 ng-star-inserted",
        });
        let menu_item_link = Object.assign(document.createElement("a"), {
            href: "#",
            title: name,
            className: "ng-tns-c72-2 ng-star-inserted",
        });
        let menu_item_title = Object.assign(document.createElement("span"), {
            className: "menu-title ng-tns-c72-2",
        });
        menu_item_title.textContent = name;
        let expand_icon = Object.assign(document.createElement("nb-icon"), {
            className: "expand-state ng-tns-c72-2",
        });
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
            }
            else {
                categories.style.display = "none";
                categories.className = "menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted collapsed";
            }
        });
        menu_item.appendChild(menu_item_link);
        menu_item.appendChild(categories);
        logger_1.Log.debug("PageElementManager: Menu item created: " + name);
        return menu_item;
    }
}
exports.PageElementManager = PageElementManager;
_PageElementManager_observer = new WeakMap();
PageElementManager.instance = null;
PageElementManager.template_repository = null;


/***/ }),

/***/ 909:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateRepository = void 0;
const logger_1 = __webpack_require__(473);
const idb_1 = __webpack_require__(137);
const main_1 = __webpack_require__(519);
class TemplateRepository {
    constructor() { }
    static async getInstance() {
        if (!TemplateRepository.instance) {
            logger_1.Log.debug("[TemplateRepository.getInstance] Creating instance");
            const templateRepository = new TemplateRepository();
            await templateRepository.initialize(main_1.template_repository_url);
            TemplateRepository.instance = templateRepository;
        }
        logger_1.Log.debug("[TemplateRepository.getInstance] Returning instance");
        return TemplateRepository.instance;
    }
    async getAll() {
        logger_1.Log.debug("[TemplateRepository.getAll]: Getting all templates");
        const templateDB = await idb_1.TemplateDB.getInstance();
        const all_templates = await templateDB.getAllTemplates();
        return this.templatesAsMap(all_templates);
    }
    async templatesAsMap(templates) {
        logger_1.Log.debug("[TemplateRepository.templatesAsMap]: Packing templates to map");
        const template_map = new Map();
        templates.forEach((template) => {
            if (!template_map.has(template.category_name)) {
                template_map.set(template.category_name, new Map());
            }
            template_map.get(template.category_name).set(template.template_name, template.content);
        });
        return template_map;
    }
    async initialize(repository_url) {
        logger_1.Log.debug("[TemplateRepository.initializeRepository]: Initializing template repository");
        const template_repository_metadata = await this.getTemplateRepositoryMetadata(repository_url);
        template_repository_metadata.forEach(async (entry, index) => {
            this.processTemplateRepositoryMetadataEntry(entry, index);
        });
        await this.deleteObsoleteTemplates(template_repository_metadata);
    }
    async getTemplateRepositoryMetadata(repository_url) {
        logger_1.Log.debug("[TemplateRepository.getTemplateRepositoryMetadata]: Retrieving template repository metadata from " + repository_url);
        const response = await fetch(repository_url);
        if (!response.ok) {
            logger_1.Log.error("[TemplateRepository.getTemplateRepositoryMetadata]: Failed to retrieve template repository metadata from " + repository_url);
            throw new Error("Failed to retrieve template repository metadata from " + repository_url);
        }
        const template_repository_metadata = await response.json();
        return template_repository_metadata;
    }
    async processTemplateRepositoryMetadataEntry(index, entry) {
        logger_1.Log.debug("[TemplateRepository.processTemplateRepositoryMetadataEntry]: Processing template repository metadata entry[" + index + "]");
        const [category_name, template_name] = entry.name.replaceAll(".html", "").split("_");
        const templateDB = await idb_1.TemplateDB.getInstance();
        if (!(await templateDB.exists(entry.name))) {
            logger_1.Log.debug("TemplateRepository: Template does not exist in DB yet ... creating: " + entry.name);
            const template_content = await this.fetchTemplateContent(entry.download_url);
            await templateDB.createTemplate(entry.name, category_name, template_name, entry.sha, template_content);
            return;
        }
        if (await templateDB.hasFileHashChanged(entry.name, entry.sha)) {
            logger_1.Log.debug("TemplateRepository: Template hash has changed ... updating: " + entry.name);
            const template_content = await this.fetchTemplateContent(entry.download_url);
            await templateDB.updateTemplate(entry.name, category_name, template_name, entry.sha, template_content);
            return;
        }
    }
    async fetchTemplateContent(download_url) {
        logger_1.Log.debug("[TemplateRepository.fetchTemplateContent]: Fetching template content from " + download_url);
        const response = await fetch(download_url);
        if (!response.ok) {
            logger_1.Log.error("[TemplateRepository.fetchTemplateContent]: Failed to fetch template content from " + download_url);
            throw new Error("Failed to fetch template content from " + download_url);
        }
        const template_content = await response.text();
        return template_content;
    }
    async deleteObsoleteTemplates(template_repository_metadata) {
        logger_1.Log.debug("[TemplateRepository.deleteObsoleteTemplates]: Checking if obsolete templates exist in IDB");
        const templateDB = await idb_1.TemplateDB.getInstance();
        const all_templates_in_idb = await templateDB.getAllTemplates();
        let deleted_templates = 0;
        all_templates_in_idb.forEach(async (template_in_db) => {
            if (!template_repository_metadata.some((template_in_repo) => template_in_db.full_template_name === template_in_repo.name)) {
                logger_1.Log.debug("[TemplateRepository.deleteObsoleteTemplates]: Template does not exist in template repository, but exists in IDB, therefore deleting: " + template_in_db.full_template_name);
                await templateDB.deleteTemplate(template_in_db.full_template_name);
                deleted_templates++;
            }
        });
        logger_1.Log.info("[TemplateRepository.deleteObsoleteTemplates]: Deleted " + deleted_templates + " obsolete templates");
    }
}
exports.TemplateRepository = TemplateRepository;
TemplateRepository.instance = null;


/***/ }),

/***/ 505:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ThemeManager_saved_theme, _ThemeManager_update_theme_switcher, _ThemeManager_update_selected_theme;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThemeManager = void 0;
const logger_1 = __webpack_require__(473);
function applyTheme(theme, is_initial_load = false) {
    logger_1.Log.debug(is_initial_load ? "Applying pre-loaded theme: " + theme : "Applying theme: " + theme);
    const updated_body_classname = document.body.className.includes("pace-done") ? " " + theme + " pace-done" : "pace-running " + theme;
    logger_1.Log.debug("Applying updated body class name: " + updated_body_classname);
    document.body.className = updated_body_classname;
    logger_1.Log.debug(is_initial_load ? "Pre-loaded theme applied: " + theme : "Theme applied: " + theme);
}
class ThemeManager {
    constructor() {
        _ThemeManager_saved_theme.set(this, this.loadTheme(true));
        _ThemeManager_update_theme_switcher.set(this, new MutationObserver(() => {
            if (!this.documentIsReady()) {
                return;
            }
            if (!this.elementIsPresent(".option-list")) {
                return;
            }
            logger_1.Log.debug("ThemeManager: Document is ready and theme switcher is present ... pausing observer for update to avoid infinite loop ...");
            __classPrivateFieldGet(this, _ThemeManager_update_theme_switcher, "f").disconnect();
            let overlay_container = document.querySelector(".cdk-overlay-connected-position-bounding-box");
            if (!overlay_container) {
                logger_1.Log.debug("ThemeManager: Overlay container not found, resuming observer ...");
                __classPrivateFieldGet(this, _ThemeManager_update_theme_switcher, "f").observe(document.documentElement, { childList: true, subtree: true, attributes: true });
                return;
            }
            let overlay_pane = overlay_container.querySelector(".cdk-overlay-pane");
            if (!overlay_pane) {
                logger_1.Log.debug("ThemeManager: Overlay pane not found, resuming observer ...");
                __classPrivateFieldGet(this, _ThemeManager_update_theme_switcher, "f").observe(document.documentElement, { childList: true, subtree: true, attributes: true });
                return;
            }
            let drowpdown_menu = overlay_pane.querySelector(".option-list");
            if (!drowpdown_menu) {
                logger_1.Log.debug("ThemeManager: Dropdown menu not found, resuming observer ...");
                __classPrivateFieldGet(this, _ThemeManager_update_theme_switcher, "f").observe(document.documentElement, { childList: true, subtree: true, attributes: true });
                return;
            }
            let menu_options = drowpdown_menu.children;
            if (!this.elementIsPresent(".updated-theme-switcher")) {
                logger_1.Log.debug("ThemeManager: Theme switcher is also not updated yet ... updating theme switcher ...");
                for (let option of menu_options) {
                    option.addEventListener("click", this.onThemeSwitcherClick);
                }
                drowpdown_menu.classList.add("updated-theme-switcher");
                logger_1.Log.debug("ThemeManager: Theme switcher updated");
            }
            logger_1.Log.debug("ThemeManager: Update highlighting for selected theme");
            for (let option of menu_options) {
                option.classList.remove("selected");
                if (option.textContent && option.textContent.toLowerCase() === __classPrivateFieldGet(this, _ThemeManager_saved_theme, "f").replaceAll("nb-theme-", "").replaceAll("-", " ")) {
                    option.classList.add("selected");
                }
            }
            logger_1.Log.debug("ThemeManager: All updates complete, resuming observer ...");
            __classPrivateFieldGet(this, _ThemeManager_update_selected_theme, "f").observe(document.documentElement, { childList: true, subtree: true, attributes: true });
        }));
        _ThemeManager_update_selected_theme.set(this, new MutationObserver(() => {
            if (!this.documentIsReady()) {
                logger_1.Log.debug("ThemeManager: Document is not ready yet ...");
                return;
            }
            if (!this.elementIsPresent(".select-button nb-icon")) {
                logger_1.Log.debug("ThemeManager: Select button not found ...");
                return;
            }
            let select_theme_button = document.querySelector(".select-button");
            if (!(select_theme_button?.firstChild?.nodeType === Node.TEXT_NODE) || (select_theme_button.firstChild.textContent === "")) {
                logger_1.Log.debug("ThemeManager: Select button is present but empty ...");
                return;
            }
            logger_1.Log.debug("ThemeManager: Document is ready and select button is present - updating selected theme");
            let theme_name = __classPrivateFieldGet(this, _ThemeManager_saved_theme, "f")
                .replaceAll("nb-theme-", "")
                .replaceAll("-", " ")
                .replace("default", "light")
                .replace(/\b\w/g, (c) => c.toUpperCase());
            select_theme_button.firstChild.textContent = theme_name;
            logger_1.Log.debug("ThemeManager: Selected theme updated: " + theme_name);
            applyTheme(__classPrivateFieldGet(this, _ThemeManager_saved_theme, "f"));
            __classPrivateFieldGet(this, _ThemeManager_update_selected_theme, "f").disconnect();
        }));
    }
    static async getInstance() {
        if (!ThemeManager.instance) {
            logger_1.Log.debug("[ThemeManager.getInstance] Creating instance");
            const themeManager = new ThemeManager();
            await themeManager.initialize();
            ThemeManager.instance = themeManager;
        }
        logger_1.Log.debug("[ThemeManager.getInstance] Returning instance");
        return ThemeManager.instance;
    }
    initialize() {
        logger_1.Log.debug("[ThemeManager.initialize] Initializing");
        __classPrivateFieldGet(this, _ThemeManager_update_theme_switcher, "f").observe(document.documentElement, { childList: true, subtree: true, attributes: true });
        __classPrivateFieldGet(this, _ThemeManager_update_selected_theme, "f").observe(document.documentElement, { childList: true, subtree: true, attributes: true });
        logger_1.Log.debug("[ThemeManager.initialize] ThemeManager is now observing");
    }
    documentIsReady() {
        return !document.body.className.includes("pace-running");
    }
    elementIsPresent(selector) {
        return document.querySelector(selector) !== null;
    }
    onThemeSwitcherClick() {
        logger_1.Log.debug("ThemeManager: Theme switcher clicked");
        let last_selected_theme = "";
        for (let current_css_class of document.body.classList) {
            if (current_css_class.includes("nb-theme-")) {
                last_selected_theme = current_css_class;
            }
        }
        localStorage.setItem("theme", last_selected_theme);
        applyTheme(last_selected_theme);
    }
    loadTheme(is_initial_load = false) {
        logger_1.Log.debug(is_initial_load ? "ThemeManager: Pre-Loading theme ..." : "ThemeManager: Loading theme ...");
        const saved_theme = localStorage.getItem("theme");
        const actual_theme = saved_theme ? saved_theme : "nb-theme-default";
        logger_1.Log.debug(is_initial_load ? "ThemeManager: Pre-Loaded theme: " + actual_theme : "ThemeManager: Loaded theme: " + actual_theme);
        applyTheme(actual_theme, is_initial_load);
        return actual_theme;
    }
}
exports.ThemeManager = ThemeManager;
_ThemeManager_saved_theme = new WeakMap(), _ThemeManager_update_theme_switcher = new WeakMap(), _ThemeManager_update_selected_theme = new WeakMap();
ThemeManager.instance = null;


/***/ }),

/***/ 193:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Time = void 0;
class Time {
    static now() {
        const options = {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        return new Intl.DateTimeFormat(navigator.language, options).format(new Date());
    }
}
exports.Time = Time;


/***/ }),

/***/ 269:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deleteDB": () => (/* binding */ deleteDB),
/* harmony export */   "openDB": () => (/* binding */ openDB),
/* harmony export */   "unwrap": () => (/* binding */ unwrap),
/* harmony export */   "wrap": () => (/* binding */ wrap)
/* harmony export */ });
const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const transactionDoneMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(this.request);
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);

/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event));
    }
    return wrap(request).then(() => undefined);
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));

const advanceMethodProps = ['continue', 'continuePrimaryKey', 'advance'];
const methodMap = {};
const advanceResults = new WeakMap();
const ittrProxiedCursorToOriginalProxy = new WeakMap();
const cursorIteratorTraps = {
    get(target, prop) {
        if (!advanceMethodProps.includes(prop))
            return target[prop];
        let cachedFunc = methodMap[prop];
        if (!cachedFunc) {
            cachedFunc = methodMap[prop] = function (...args) {
                advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
            };
        }
        return cachedFunc;
    },
};
async function* iterate(...args) {
    // tslint:disable-next-line:no-this-assignment
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
        cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
        return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    // Map this double-proxy back to the original, so other cursor methods work.
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
        yield proxiedCursor;
        // If one of the advancing methods was not called, call continue().
        cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
        advanceResults.delete(proxiedCursor);
    }
}
function isIteratorProp(target, prop) {
    return ((prop === Symbol.asyncIterator &&
        instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        (prop === 'iterate' && instanceOfAny(target, [IDBIndex, IDBObjectStore])));
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
        if (isIteratorProp(target, prop))
            return iterate;
        return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
        return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    },
}));




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(519);
/******/ 	
/******/ })()
;