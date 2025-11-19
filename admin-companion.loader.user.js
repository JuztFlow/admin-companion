// ==UserScript==
// @name         admin-companion Script Loader
// @version      1.0
// @description  Loads the admin-companion userscript from GitHub or a local development server.
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/JuztFlow/admin-companion#readme
// @license      https://opensource.org/licenses/MIT
// @author       Mind@vision4s.com
// @match        https://admin.vision4s.com/*
// @match        https://admin.4classic.eu/*
// ==/UserScript==
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// !!! IMPORTANT: Change the following configuration values to match your needs!
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// - Set to 'true' to load from local development server, 'false' to load from GitHub:
const is_development = false
//
// - Repository URL (must end with a slash, e.g. "https://api.github.com/repos/<username>/<repository>/contents/<path>/templates/"):
const repository_url = "https://api.github.com/repos/JuztFlow/admin-companion/contents/templates/"
//
// - Website Abbreviation (must be either "4V" or "4C"):
const website_abbreviation = "4V"
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
;(async function () {
  const script_url = is_development
    ? "http://127.0.0.1:5500/admin-companion.prod.user.js"
    : "https://raw.githubusercontent.com/JuztFlow/admin-companion/main/admin-companion.prod.user.js"
  const response = await fetch(script_url)
  const code = await response.text()
  const modified_code = code.replace(/t\.repository_url\s*=\s*"TO BE REPLACED BY SCRIPT LOADER"/, `t.repository_url="${repository_url}"`)
                            .replace(/t\.website_abbreviation\s*=\s*"TO BE REPLACED BY SCRIPT LOADER"/, `t.website_abbreviation="${website_abbreviation}"`)
  eval(modified_code)
})()
