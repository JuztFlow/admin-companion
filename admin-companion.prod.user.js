// ==UserScript==
// @name admin-companion
// @version 1.0.1
// @namespace http://tampermonkey.net/
// @description A tampermonkey script that extends the functionality of the 4V and 4C admin pages.
// @author Mind@vision4s.com
// @license https://opensource.org/licenses/MIT
// @match https://admin.vision4s.com/*
// @match https://admin.4classic.eu/*
// @require https://cdn.jsdelivr.net/npm/idb@8/build/umd.js
// ==/UserScript==
/******/(()=>{// webpackBootstrap
/******/"use strict";
/******/var e={
/***/137:
/***/function(e,t,n){var a,i=this&&this.__classPrivateFieldSet||function(e,t,n,a,i){if("m"===a)throw new TypeError("Private method is not writable");if("a"===a&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===a?i.call(e,n):i?i.value=n:t.set(e,n),n},r=this&&this.__classPrivateFieldGet||function(e,t,n,a){if("a"===n&&!a)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?a:"a"===n?a.call(e):a?a.value:t.get(e)};Object.defineProperty(t,"__esModule",{value:!0}),t.TemplateDB=void 0;const o=n(269),s=n(519),l=n(473);class c{constructor(){a.set(this,null)}static async getInstance(){if(!c.instance){l.Log.debug("[TemplateRepositoryDB.getInstance] Creating instance");const e=new c;await e.initizalize(),c.instance=e}return l.Log.debug("[TemplateRepositoryDB.getInstance] Returning instance"),c.instance}async initizalize(){l.Log.debug("[TemplateRepositoryDB.initizalize] Initializing IDB"),i(this,a,await(0,o.openDB)(s.application_name,1,{upgrade(e){l.Log.debug("[TemplateRepositoryDB.initizalize] Upgrading IDB");const t=e.createObjectStore("templates",{keyPath:"full_template_name"});t.createIndex("category_name","category_name",{unique:!1}),t.createIndex("template_name","template_name",{unique:!1}),t.createIndex("hash","hash",{unique:!1}),t.createIndex("content","content",{unique:!1})}}),"f")}async getTemplate(e){if(!r(this,a,"f"))throw l.Log.error("[TemplateRepositoryDB.getTemplate] Database not initialized!"),new Error("Database not initialized!");l.Log.debug("[TemplateRepositoryDB.getTemplate] Retrieving template from IDB with name: "+e);const t=r(this,a,"f").transaction(["templates"],"readonly"),n=t.objectStore("templates"),i=await n.get(e);return await t.done,i}async getAllTemplates(){if(!r(this,a,"f"))throw l.Log.error("[TemplateRepositoryDB.getAllTemplates] Database not initialized!"),new Error("Database not initialized!");l.Log.debug("[TemplateRepositoryDB.getAllTemplates] Retrieving all templates from IDB");const e=r(this,a,"f").transaction(["templates"],"readonly"),t=e.objectStore("templates"),n=await t.getAll();return await e.done,n}async deleteTemplate(e){if(!r(this,a,"f"))throw l.Log.error("[TemplateRepositoryDB.deleteTemplate] Database not initialized!"),new Error("Database not initialized!");l.Log.debug("[TemplateRepositoryDB.deleteTemplate] Deleting template from IDB with name: "+e);const t=r(this,a,"f").transaction(["templates"],"readwrite"),n=t.objectStore("templates");await n.delete(e),await t.done}async exists(e){if(!r(this,a,"f"))throw l.Log.error("[TemplateRepositoryDB.exists] Database not initialized!"),new Error("Database not initialized!");l.Log.debug("[TemplateRepositoryDB.exists] Checking if template exists in IDB with name: "+e);const t=r(this,a,"f").transaction(["templates"],"readonly"),n=t.objectStore("templates"),i=await n.get(e);return await t.done,void 0!==i}async updateTemplate(e,t,n,i,o){if(!r(this,a,"f"))throw l.Log.error("[TemplateRepositoryDB.updateTemplate] Database not initialized!"),new Error("Database not initialized!");l.Log.debug("[TemplateRepositoryDB.updateTemplate] Updating template in IDB with name: "+e);const s=r(this,a,"f").transaction(["templates"],"readwrite"),c=s.objectStore("templates");await c.put({full_template_name:e,category_name:t,template_name:n,hash:i,content:o}),await s.done}async createTemplate(e,t,n,i,o){if(!r(this,a,"f"))throw l.Log.error("[TemplateRepositoryDB.createTemplate] Database not initialized!"),new Error("Database not initialized!");l.Log.debug("[TemplateRepositoryDB.createTemplate] Creating template in IDB with name: "+e);const s=r(this,a,"f").transaction(["templates"],"readwrite"),c=s.objectStore("templates");await c.put({full_template_name:e,category_name:t,template_name:n,hash:i,content:o}),await s.done}async hasFileHashChanged(e,t){if(!r(this,a,"f"))throw l.Log.error("[TemplateRepositoryDB.hasFileHashChanged] Database not initialized!"),new Error("Database not initialized!");l.Log.debug("[TemplateRepositoryDB.hasFileHashChanged] Checking if file hash has changed for template in IDB with name: "+e);const n=r(this,a,"f").transaction(["templates"],"readonly"),i=n.objectStore("templates"),o=await i.get(e);if(await n.done,!o)throw l.Log.error("[TemplateRepositoryDB.hasFileHashChanged] Template to check file hash for does not exist in IDB with name: "+e),new Error("Template to check file hash for does not exist in IDB with name: "+e);return o.hash!==t}}t.TemplateDB=c,a=new WeakMap,c.instance=null},
/***/473:
/***/(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Log=void 0;const a=n(193);t.Log=class{static info(e){console.log(a.Time.now()+" | [INFO] "+e)}static debug(e){console.debug(a.Time.now()+" | [DEBUG] "+e)}static warn(e){console.warn(a.Time.now()+" | [WARN] "+e)}static error(e){console.error(a.Time.now()+" | [ERROR] "+e)}}}
/***/,
/***/519:
/***/(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.template_repository_url=t.application_name=void 0,t.application_name="admin-companion",t.template_repository_url="https://api.github.com/repos/JuztFlow/admin-companion/contents/templates";const a=n(473),i=n(523),r=n(505);!async function(){a.Log.info("Starting "+t.application_name+" ..."),await i.PageElementManager.getInstance(),await r.ThemeManager.getInstance(),a.Log.info(t.application_name+" is running now!")}()}
/***/,
/***/523:
/***/function(e,t,n){var a,i=this&&this.__classPrivateFieldGet||function(e,t,n,a){if("a"===n&&!a)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?a:"a"===n?a.call(e):a?a.value:t.get(e)};Object.defineProperty(t,"__esModule",{value:!0}),t.PageElementManager=void 0;const r=n(473),o=n(909);class s{constructor(){a.set(this,new MutationObserver((()=>{if(!this.elementIsPresent("#ticket-templates")&&this.elementIsPresent(".angular-editor-wrapper")&&this.isTicketViewPresent()&&(r.Log.debug("PageElementManager: Ticket text editor detected -> we are on a specific Ticket page!"),this.deleteReadingDirectionSwitcher(),this.removeInputFields(),this.addTemplatesToNav(),this.addCopyTemplateButtons()),this.elementIsPresent("#gm-name")||!this.elementIsPresent(".header-container")||this.elementIsPresent(".angular-editor-wrapper")||(r.Log.debug("PageElementManager: Absence of ticket text editor detected and header container present -> we are on the Dashboard or Ticket Overview page!"),this.deleteReadingDirectionSwitcher(),this.removeCopyTemplateButtons(),this.removeTemplatesFromNav(),this.addInputFields()),!this.elementIsPresent("#mail")&&!this.elementIsPresent("#status")&&this.elementIsPresent('input[name="mail"]')&&this.elementIsPresent('nb-select[name="status"]')){r.Log.debug("PageElementManager: Mail input and filter status select detected -> we are on the Ticket Overview page!");const e=document.querySelector('input[name="mail"]'),t=document.querySelector('nb-select[name="status"]');return this.loadSavedFilters(e,t),this.addSaveFunctionalityToFilters(e,t),this.updateFiltersStyle(e,t),void this.addResetButtons(e,t)}})))}static async getInstance(){if(!s.instance){r.Log.debug("PageElementManager: Creating instance");const e=new s;s.template_repository=await o.TemplateRepository.getInstance(),await e.initialize(),s.instance=e}return r.Log.debug("PageElementManager: Returning instance"),s.instance}async initialize(){r.Log.debug("[PageElementManager.initialize]: Initializing"),i(this,a,"f").observe(document.documentElement,{childList:!0,subtree:!0}),r.Log.debug("[PageElementManager.initialize]: PageElementManager is now observing")}elementIsPresent(e){return null!==document.querySelector(e)}isTicketViewPresent(){r.Log.debug("[PageElementManager.isTicketViewPresent]: Checking if ticket view is present");const e=document.querySelector("ngx-ticket-view");return!!e&&e.childElementCount>=4}addTemplatesToNav(){r.Log.debug("[PageElementManager.addTemplatesToNav]: Adding Ticket Templates to navigation");let e=document.querySelector("nb-menu")?.querySelector(".menu-items"),t=this.createMenuItem("Ticket Templates");s.template_repository?.getAll().then((e=>{e.forEach(((e,n)=>{let a=this.createCategory(n);e.forEach(((e,t)=>{let n=this.createCategoryItem(t,e);a.querySelector("ul")?.appendChild(n)})),t.querySelector("ul")?.appendChild(a)}))})),e?.appendChild(t)}removeTemplatesFromNav(){r.Log.debug("[PageElementManager.removeTemplatesFromNav]: Removing Ticket Templates from navigation"),this.removeElementBy("#ticket-templates")}addInputFields(){r.Log.debug("[PageElementManager.addInputFields]: Adding input fields"),this.addInputField("phrase","Kind regards",!0),this.addInputField("gm-name","[GM]Example",!1)}addInputField(e,t,n){r.Log.debug("[PageElementManager.addInputField]: Adding input field with id: "+e);let a=Object.assign(document.createElement("input"),{id:e,type:"text",placeholder:t,className:"size-medium status-basic shape-rectangle ng-pristine ng-valid nb-transition ng-touched cdk-focused cdk-mouse-focused"});a.setAttribute("nbinput",""),a.style.cssText=n?"margin: 10px; margin-left: 2em;":"margin: 10px;";const i=localStorage.getItem(e);i&&(a.value=i),a.addEventListener("input",(function(){localStorage.setItem(e,a.value)}));let o=document.querySelector(".header-container");o?.appendChild(a)}removeInputFields(){r.Log.debug("[PageElementManager.removeInputFields]: Removing input fields"),this.removeElementBy("#phrase"),this.removeElementBy("#gm-name")}removeElementBy(e){let t=document.querySelector(e);t&&t.remove()}removeElementsBy(e){let t=document.querySelectorAll(e);t&&t.forEach((e=>{e.remove()}))}deleteReadingDirectionSwitcher(){r.Log.debug("[PageElementManager.deleteReadingDirectionSwitcher]: Deleting reading direction switcher"),this.removeElementBy(".direction-switcher")}addCopyTemplateButtons(){r.Log.debug("[PageElementManager.addCopyTemplateButtons]: Adding copy template buttons");const e=document.querySelector("ngx-ticket-view");if(!e)return void r.Log.debug("[PageElementManager.addCopyTemplateButtons]: Ticket view not found, skipping ...");const t=e.querySelectorAll("nb-card");Array.from(t).slice(1,-1).forEach((e=>{let t=e.querySelector("nb-card-header"),n=e.querySelector("nb-card-body");if(!t)return void r.Log.error("[PageElementManager.addCopyTemplateButtons]: Ticket answer header not found, skipping ...");if(!n)return void r.Log.error("[PageElementManager.addCopyTemplateButtons]: Ticket answer body not found, skipping ...");t.style.display="flex",t.style.alignItems="center",t.innerHTML='<div style="flex: 1;">'+t.innerHTML+"</div>";let a=this.createCopyButton(n);t.appendChild(a),r.Log.debug("PageElementManager: Copy button added to ticket answer")}));let n=document.querySelector("nb-card-footer button");n&&n.addEventListener("click",(()=>{const e=new MutationObserver((()=>{document.body.className.includes("pace-running")&&(r.Log.debug("PageElementManager: Pace running detected, starting to wait for pace-done ..."),e.disconnect(),t.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0}))})),t=new MutationObserver((()=>{document.body.className.includes("pace-done")&&this.isTicketViewPresent()&&(r.Log.debug("PageElementManager: All ticket answers present, re-adding copy buttons ..."),this.addCopyTemplateButtons(),t.disconnect())}));e.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0})}))}removeCopyTemplateButtons(){r.Log.debug("[PageElementManager.removeCopyTemplateButtons]: Removing copy template buttons"),this.removeElementsBy(".copy-button")}createCopyButton(e){r.Log.debug("[PageElementManager.createCopyButton]: Creating copy button");let t=Object.assign(document.createElement("button"),{className:"copy-button appearance-filled size-medium status-basic shape-rectangle nb-transition",style:"float: right; margin-right: 1em;",textContent:"Copy Template"});return t.setAttribute("nbbutton",""),t.addEventListener("click",(function(){let t=e.innerHTML;navigator.clipboard.writeText(t),r.Log.info("Template with length "+t.length+" copied to clipboard!")})),r.Log.debug("PageElementManager: Copy button created"),t}loadSavedFilters(e,t){r.Log.debug("PageElementManager: Loading saved filters");const n=localStorage.getItem("mail"),a=localStorage.getItem("status");if(n&&(e.value=n,e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("blur",{bubbles:!0}))),a){t.click();const e=document.querySelector(".option-list");if(e){e.querySelectorAll("nb-option").forEach((e=>{e.innerText===a&&e.click()}))}t.click()}r.Log.debug("PageElementManager: Saved filters loaded")}addSaveFunctionalityToFilters(e,t){r.Log.debug("[PageElementManager.addSaveFunctionalityToFilters]: Adding save functionality to filters"),e.addEventListener("keypress",(function(t){"Enter"===t.key&&localStorage.setItem("mail",e.value)})),t.click();const n=document.querySelector(".option-list");if(n){n.querySelectorAll("nb-option").forEach((e=>{e.addEventListener("click",(function(){localStorage.setItem("status",e.innerText)}))}))}r.Log.debug("PageElementManager: Save functionality added")}updateFiltersStyle(e,t){r.Log.debug("PageElementManager: Updating filters style"),e.id="mail",e.placeholder="user@domain.com",e.style.width="320px";let n=e.previousElementSibling;n&&(n.innerText+=":",n.style.width="6em"),t.id="status";let a=t.previousElementSibling;a.innerText+=":",a.style.width="6em"}addResetButtons(e,t){r.Log.debug("PageElementManager: Adding reset buttons");let n=this.createMailResetButton(e);e.insertAdjacentElement("afterend",n);let a=this.createStatusResetButton(t);t.insertAdjacentElement("afterend",a),r.Log.debug("PageElementManager: Reset buttons added")}createMailResetButton(e){r.Log.debug("PageElementManager: Creating email reset button");let t=Object.assign(document.createElement("button"),{className:"reset-button appearance-filled size-medium status-danger shape-rectangle nb-transition",style:"margin-left: 1em;",textContent:"⟳"});return t.setAttribute("nbbutton",""),t.addEventListener("click",(function(){e.value="",localStorage.removeItem("mail"),e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("blur",{bubbles:!0})),r.Log.info("Email filter reset!")})),r.Log.debug("PageElementManager: Email reset button created"),t}createStatusResetButton(e){r.Log.debug("PageElementManager: Creating status reset button");let t=Object.assign(document.createElement("button"),{className:"reset-button appearance-filled size-medium status-danger shape-rectangle nb-transition",style:"margin-left: 1em;",textContent:"⟳"});return t.setAttribute("nbbutton",""),t.addEventListener("click",(function(){e.click();const t=document.querySelector(".option-list");if(t){t.querySelectorAll("nb-option").forEach((e=>{"Open"===e.innerText&&e.click()}))}e.click(),localStorage.setItem("status","Open"),r.Log.info("Status filter reset!")})),r.Log.debug("PageElementManager: Status reset button created"),t}createCategoryItem(e,t){r.Log.debug("PageElementManager: Creating category item: "+e);let n=Object.assign(document.createElement("li"),{className:"menu_item ng-tns-c72-4 ng-star-inserted"}),a=Object.assign(document.createElement("a"),{href:"#",title:e,className:"ng-tns-c72-4 ng-star-inserted"}),i=Object.assign(document.createElement("span"),{className:"menu-title ng-tns-c72-5",textContent:e});return a.addEventListener("click",(function(e){e.preventDefault();let n=document.querySelector(".angular-editor-wrapper.show-placeholder");if(n){let e=n.querySelector(".angular-editor-textarea"),a=n.querySelector(".angular-editor-placeholder");if(a&&(a.style.display="none"),e){e.setAttribute("data-placeholder-disabled","true");const n=localStorage.getItem("phrase"),a=localStorage.getItem("gm-name");let i=t+"<div><br></div><div>";i+=n||"",i+="</div>",i+=a||"",e.innerHTML=""+i}}})),a.appendChild(i),n.appendChild(a),r.Log.debug("PageElementManager: Category item created: "+e),n}createCategory(e){r.Log.debug("PageElementManager: Creating category: "+e);let t=Object.assign(document.createElement("li"),{className:"menu-item ng-tns-c72-3 ng-star-inserted"}),n=Object.assign(document.createElement("a"),{href:"#",title:e,className:"ng-tns-c72-3 ng-star-inserted"}),a=Object.assign(document.createElement("span"),{className:"menu-title ng-tns-c72-3"});a.textContent=e;let i=Object.assign(document.createElement("nb-icon"),{className:"expand-state ng-tns-c72-3"});i.setAttribute("pack","nebular-essentials"),i.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="100%" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-down"><rect width="24" height="24" opacity="0"></rect><path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path></g></g></svg>',n.appendChild(a),n.appendChild(i);let o=Object.assign(document.createElement("ul"),{className:"menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted",style:"display: none;"});return n.addEventListener("click",(function(e){e.preventDefault(),"none"===o.style.display?(o.style.display="block",o.className="menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted expanded"):(o.style.display="none",o.className="menu-items ng-tns-c72-3 ng-trigger ng-trigger-toggle ng-star-inserted collapsed")})),t.appendChild(n),t.appendChild(o),r.Log.debug("PageElementManager: Category created: "+e),t}createMenuItem(e){r.Log.debug("PageElementManager: Creating menu item: "+e);let t=Object.assign(document.createElement("li"),{id:"ticket-templates",className:"menu-item ng-tns-c72-1 ng-star-inserted"}),n=Object.assign(document.createElement("a"),{href:"#",title:e,className:"ng-tns-c72-2 ng-star-inserted"}),a=Object.assign(document.createElement("span"),{className:"menu-title ng-tns-c72-2"});a.textContent=e;let i=Object.assign(document.createElement("nb-icon"),{className:"expand-state ng-tns-c72-2"});i.setAttribute("pack","nebular-essentials"),i.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="100%" height="100%" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-down"><rect width="24" height="24" opacity="0"></rect><path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path></g></g></svg>',n.appendChild(a),n.appendChild(i);let o=Object.assign(document.createElement("ul"),{className:"menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted",style:"display: none;"});return n.addEventListener("click",(function(e){e.preventDefault(),"none"===o.style.display?(o.style.display="block",o.className="menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted expanded"):(o.style.display="none",o.className="menu-items ng-tns-c72-2 ng-trigger ng-trigger-toggle ng-star-inserted collapsed")})),t.appendChild(n),t.appendChild(o),r.Log.debug("PageElementManager: Menu item created: "+e),t}}t.PageElementManager=s,a=new WeakMap,s.instance=null,s.template_repository=null},
/***/909:
/***/(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.TemplateRepository=void 0;const a=n(473),i=n(137),r=n(519);class o{constructor(){}static async getInstance(){if(!o.instance){a.Log.debug("[TemplateRepository.getInstance] Creating instance");const e=new o;await e.initialize(r.template_repository_url),o.instance=e}return a.Log.debug("[TemplateRepository.getInstance] Returning instance"),o.instance}async getAll(){a.Log.debug("[TemplateRepository.getAll]: Getting all templates");const e=await i.TemplateDB.getInstance(),t=await e.getAllTemplates();return this.templatesAsMap(t)}async templatesAsMap(e){a.Log.debug("[TemplateRepository.templatesAsMap]: Packing templates to map");const t=new Map;return e.forEach((e=>{t.has(e.category_name)||t.set(e.category_name,new Map),t.get(e.category_name).set(e.template_name,e.content)})),t}async initialize(e){a.Log.debug("[TemplateRepository.initializeRepository]: Initializing template repository");const t=await this.getTemplateRepositoryMetadata(e),n=await i.TemplateDB.getInstance();t.forEach((async(e,t)=>{this.processTemplateRepositoryMetadataEntry(n,t,e)})),await this.deleteObsoleteTemplates(t)}async getTemplateRepositoryMetadata(e){a.Log.debug("[TemplateRepository.getTemplateRepositoryMetadata]: Retrieving template repository metadata from "+e);const t=await fetch(e);if(!t.ok)throw a.Log.error("[TemplateRepository.getTemplateRepositoryMetadata]: Failed to retrieve template repository metadata from "+e),new Error("Failed to retrieve template repository metadata from "+e);return await t.json()}async processTemplateRepositoryMetadataEntry(e,t,n){a.Log.debug("[TemplateRepository.processTemplateRepositoryMetadataEntry]: Processing template repository metadata entry["+t+"]");const[i,r]=n.name.replaceAll(".html","").split("_");if(await e.exists(n.name))if(await e.hasFileHashChanged(n.name,n.sha)){a.Log.debug("TemplateRepository: Template hash has changed ... updating: "+n.name);const t=await this.fetchTemplateContent(n.download_url);await e.updateTemplate(n.name,i,r,n.sha,t)}else;else{a.Log.debug("TemplateRepository: Template does not exist in DB yet ... creating: "+n.name);const t=await this.fetchTemplateContent(n.download_url);await e.createTemplate(n.name,i,r,n.sha,t)}}async fetchTemplateContent(e){a.Log.debug("[TemplateRepository.fetchTemplateContent]: Fetching template content from "+e);const t=await fetch(e);if(!t.ok)throw a.Log.error("[TemplateRepository.fetchTemplateContent]: Failed to fetch template content from "+e),new Error("Failed to fetch template content from "+e);return await t.text()}async deleteObsoleteTemplates(e){a.Log.debug("[TemplateRepository.deleteObsoleteTemplates]: Checking if obsolete templates exist in IDB");const t=await i.TemplateDB.getInstance(),n=await t.getAllTemplates();let r=0;n.forEach((async n=>{e.some((e=>n.full_template_name===e.name))||(a.Log.debug("[TemplateRepository.deleteObsoleteTemplates]: Template does not exist in template repository, but exists in IDB, therefore deleting: "+n.full_template_name),await t.deleteTemplate(n.full_template_name),r++)})),a.Log.info("[TemplateRepository.deleteObsoleteTemplates]: Deleted "+r+" obsolete templates")}}t.TemplateRepository=o,o.instance=null}
/***/,
/***/505:
/***/function(e,t,n){var a,i,r,o=this&&this.__classPrivateFieldGet||function(e,t,n,a){if("a"===n&&!a)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?a:"a"===n?a.call(e):a?a.value:t.get(e)};Object.defineProperty(t,"__esModule",{value:!0}),t.ThemeManager=void 0;const s=n(473);function l(e,t=!1){s.Log.debug(t?"Applying pre-loaded theme: "+e:"Applying theme: "+e);const n=document.body.className.includes("pace-done")?" "+e+" pace-done":"pace-running "+e;s.Log.debug("Applying updated body class name: "+n),document.body.className=n,s.Log.debug(t?"Pre-loaded theme applied: "+e:"Theme applied: "+e)}class c{constructor(){a.set(this,this.loadTheme(!0)),i.set(this,new MutationObserver((()=>{if(!this.documentIsReady())return;if(!this.elementIsPresent(".option-list"))return;s.Log.debug("ThemeManager: Document is ready and theme switcher is present ... pausing observer for update to avoid infinite loop ..."),o(this,i,"f").disconnect();let e=document.querySelector(".cdk-overlay-connected-position-bounding-box");if(!e)return s.Log.debug("ThemeManager: Overlay container not found, resuming observer ..."),void o(this,i,"f").observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});let t=e.querySelector(".cdk-overlay-pane");if(!t)return s.Log.debug("ThemeManager: Overlay pane not found, resuming observer ..."),void o(this,i,"f").observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});let n=t.querySelector(".option-list");if(!n)return s.Log.debug("ThemeManager: Dropdown menu not found, resuming observer ..."),void o(this,i,"f").observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});let l=n.children;if(!this.elementIsPresent(".updated-theme-switcher")){s.Log.debug("ThemeManager: Theme switcher is also not updated yet ... updating theme switcher ...");for(let e of l)e.addEventListener("click",this.onThemeSwitcherClick);n.classList.add("updated-theme-switcher"),s.Log.debug("ThemeManager: Theme switcher updated")}s.Log.debug("ThemeManager: Update highlighting for selected theme");for(let e of l)e.classList.remove("selected"),e.textContent&&e.textContent.toLowerCase()===o(this,a,"f").replaceAll("nb-theme-","").replaceAll("-"," ")&&e.classList.add("selected");s.Log.debug("ThemeManager: All updates complete, resuming observer ..."),o(this,r,"f").observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0})}))),r.set(this,new MutationObserver((()=>{if(!this.documentIsReady())return void s.Log.debug("ThemeManager: Document is not ready yet ...");if(!this.elementIsPresent(".select-button nb-icon"))return void s.Log.debug("ThemeManager: Select button not found ...");let e=document.querySelector(".select-button");if(e?.firstChild?.nodeType!==Node.TEXT_NODE||""===e.firstChild.textContent)return void s.Log.debug("ThemeManager: Select button is present but empty ...");s.Log.debug("ThemeManager: Document is ready and select button is present - updating selected theme");let t=o(this,a,"f").replaceAll("nb-theme-","").replaceAll("-"," ").replace("default","light").replace(/\b\w/g,(e=>e.toUpperCase()));e.firstChild.textContent=t,s.Log.debug("ThemeManager: Selected theme updated: "+t),l(o(this,a,"f")),o(this,r,"f").disconnect()})))}static async getInstance(){if(!c.instance){s.Log.debug("[ThemeManager.getInstance] Creating instance");const e=new c;await e.initialize(),c.instance=e}return s.Log.debug("[ThemeManager.getInstance] Returning instance"),c.instance}initialize(){s.Log.debug("[ThemeManager.initialize] Initializing"),o(this,i,"f").observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0}),o(this,r,"f").observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0}),s.Log.debug("[ThemeManager.initialize] ThemeManager is now observing")}documentIsReady(){return!document.body.className.includes("pace-running")}elementIsPresent(e){return null!==document.querySelector(e)}onThemeSwitcherClick(){s.Log.debug("ThemeManager: Theme switcher clicked");let e="";for(let t of document.body.classList)t.includes("nb-theme-")&&(e=t);localStorage.setItem("theme",e),l(e)}loadTheme(e=!1){s.Log.debug(e?"ThemeManager: Pre-Loading theme ...":"ThemeManager: Loading theme ...");const t=localStorage.getItem("theme"),n=t||"nb-theme-default";return s.Log.debug(e?"ThemeManager: Pre-Loaded theme: "+n:"ThemeManager: Loaded theme: "+n),l(n,e),n}}t.ThemeManager=c,a=new WeakMap,i=new WeakMap,r=new WeakMap,c.instance=null},
/***/193:
/***/(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Time=void 0;t.Time=class{static now(){const e={timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"};return new Intl.DateTimeFormat(navigator.language,e).format(new Date)}}}
/***/,
/***/269:
/***/(e,t,n)=>{n.r(t),
/* harmony export */n.d(t,{
/* harmony export */deleteDB:()=>/* binding */b
/* harmony export */,openDB:()=>/* binding */h
/* harmony export */,unwrap:()=>/* binding */p
/* harmony export */,wrap:()=>/* binding */u
/* harmony export */});const a=(e,t)=>t.some((t=>e instanceof t));let i,r;const o=new WeakMap,s=new WeakMap,l=new WeakMap;let c={get(e,t,n){if(e instanceof IDBTransaction){
// Special handling for transaction.done.
if("done"===t)return o.get(e);
// Make tx.store return the only store in the transaction, or undefined if there are many.
if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}
// Else transform whatever we get back.
return u(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function d(e){c=e(c)}function g(e){
// Due to expected object equality (which is enforced by the caching in `wrap`), we
// only create one new func per func.
// Cursor methods are special, as the behaviour is a little more different to standard IDB. In
// IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
// cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
// with real promises, so each advance methods returns a new promise for the cursor object, or
// undefined if the end of the cursor has been reached.
return(r||(r=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){
// Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
// the original object.
return e.apply(p(this),t),u(this.request)}:function(...t){
// Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
// the original object.
return u(e.apply(p(this),t))}}function m(e){return"function"==typeof e?g(e):(
// This doesn't return, it just creates a 'done' promise for the transaction,
// which is later returned for transaction.done (see idbObjectHandler).
e instanceof IDBTransaction&&function(e){
// Early bail if we've already created a done promise for this transaction.
if(o.has(e))return;const t=new Promise(((t,n)=>{const a=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",r),e.removeEventListener("abort",r)},i=()=>{t(),a()},r=()=>{n(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",i),e.addEventListener("error",r),e.addEventListener("abort",r)}));
// Cache it for later retrieval.
o.set(e,t)}(e),a(e,i||(i=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]))?new Proxy(e,c):e)}function u(e){
// We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
// IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const a=()=>{e.removeEventListener("success",i),e.removeEventListener("error",r)},i=()=>{t(u(e.result)),a()},r=()=>{n(e.error),a()};e.addEventListener("success",i),e.addEventListener("error",r)}));
// This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
// is because we create many promises from a single IDBRequest.
return l.set(t,e),t}(e);
// If we've already transformed this value before, reuse the transformed value.
// This is faster, but it also provides object equality.
if(s.has(e))return s.get(e);const t=m(e);
// Not all types are transformed.
// These may be primitive types, so they can't be WeakMap keys.
return t!==e&&(s.set(e,t),l.set(t,e)),t}const p=e=>l.get(e)
/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */;function h(e,t,{blocked:n,upgrade:a,blocking:i,terminated:r}={}){const o=indexedDB.open(e,t),s=u(o);return a&&o.addEventListener("upgradeneeded",(e=>{a(u(o.result),e.oldVersion,e.newVersion,u(o.transaction),e)})),n&&o.addEventListener("blocked",(e=>n(
// Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
e.oldVersion,e.newVersion,e))),s.then((e=>{r&&e.addEventListener("close",(()=>r())),i&&e.addEventListener("versionchange",(e=>i(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),s}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */function b(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",(e=>t(
// Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
e.oldVersion,e))),u(n).then((()=>{}))}const y=["get","getKey","getAll","getAllKeys","count"],f=["put","add","delete","clear"],w=new Map;function v(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(w.get(t))return w.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,i=f.includes(n);if(
// Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
!(n in(a?IDBIndex:IDBObjectStore).prototype)||!i&&!y.includes(n))return;const r=async function(e,...t){
// isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
const r=this.transaction(e,i?"readwrite":"readonly");let o=r.store;
// Must reject if op rejects.
// If it's a write operation, must reject if tx.done rejects.
// Must reject with op rejection first.
// Must resolve with op value.
// Must handle both promises (no unhandled rejections)
return a&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&r.done]))[0]};return w.set(t,r),r}d((e=>({...e,get:(t,n,a)=>v(t,n)||e.get(t,n,a),has:(t,n)=>!!v(t,n)||e.has(t,n)})));const T=["continue","continuePrimaryKey","advance"],E={},L=new WeakMap,M=new WeakMap,I={get(e,t){if(!T.includes(t))return e[t];let n=E[t];return n||(n=E[t]=function(...e){L.set(this,M.get(this)[t](...e))}),n}};async function*D(...e){
// tslint:disable-next-line:no-this-assignment
let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;const n=new Proxy(t,I);for(M.set(n,t),
// Map this double-proxy back to the original, so other cursor methods work.
l.set(n,p(t));t;)yield n,
// If one of the advancing methods was not called, call continue().
t=await(L.get(n)||t.continue()),L.delete(n)}function P(e,t){return t===Symbol.asyncIterator&&a(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&a(e,[IDBIndex,IDBObjectStore])}d((e=>({...e,get:(t,n,a)=>P(t,n)?D:e.get(t,n,a),has:(t,n)=>P(t,n)||e.has(t,n)})))}
/***/
/******/},t={};
/************************************************************************/
/******/ // The module cache
/******/
/******/
/******/ // The require function
/******/function n(a){
/******/ // Check if module is in cache
/******/var i=t[a];
/******/if(void 0!==i)
/******/return i.exports;
/******/
/******/ // Create a new module (and put it into the cache)
/******/var r=t[a]={
/******/ // no module.id needed
/******/ // no module.loaded needed
/******/exports:{}
/******/};
/******/
/******/ // Execute the module function
/******/
/******/
/******/ // Return the exports of the module
/******/return e[a].call(r.exports,r,r.exports,n),r.exports;
/******/}
/******/
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/
/******/ // define getter functions for harmony exports
/******/n.d=(e,t)=>{
/******/for(var a in t)
/******/n.o(t,a)&&!n.o(e,a)&&
/******/Object.defineProperty(e,a,{enumerable:!0,get:t[a]})
/******/;
/******/},
/******/n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)
/******/,
/******/ // define __esModule on exports
/******/n.r=e=>{
/******/"undefined"!=typeof Symbol&&Symbol.toStringTag&&
/******/Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})
/******/,Object.defineProperty(e,"__esModule",{value:!0})}
/******/;
/******/
/************************************************************************/
/******/
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module is referenced by other modules so it can't be inlined
/******/n(519);
/******/
/******/})();