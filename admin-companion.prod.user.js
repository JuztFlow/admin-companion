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
// @require https://cdn.jsdelivr.net/npm/idb@8.0.0/build/umd.min.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 607:
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Hello, world!');
    });
}
main();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[607]();
/******/ 	
/******/ })()
;