(function () {

// ==UserScript==
// @name          RFC 2606§3 - Hello, World!
// @namespace     http://localhost.localdomain
// @description   JavaScript alert box saying Hello, World!
// @copyright     2007+, Marti Martz (http://userscripts.org/users/37004)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       0.0.2
// @icon          https://s3.amazonaws.com/uso_ss/icon/13701/large.png
// @author        Marti Martz <somewhere@example.com> (https://openuserjs.org/users/Marti)

// @homepageURL   http://userscripts.org/scripts/show/13701
// @homepageURL   https://github.com/Martii/UserScripts/tree/master/src/RFC%202606%C2%A73/Hello%2C%20World
// @homepageURL   https://openuserjs.org/scripts/Marti/RFC_2606%C2%A73_-_Hello,_World!
// @supportURL    http://userscripts.org/topics/23566

// @include   http://www.example.com/*
// @include   http://www.example.net/*
// @include   http://www.example.org/*

// @updateURL https://openuserjs.org/meta/Marti/RFC_2606%C2%A73_-_Hello,_World!.meta.js

// ==/UserScript==

// ==OpenUserJS==
// @author Marti
// ==/OpenUserJS==

  alert('Hello, World!');

})();

// Test for https://openuserjs.org/garage/Problems_pushing_scripts_from_Github with .meta.js mirror created on GH PASS
// One more time of actual source change without version... PASS
// One additional test for matching version bumps... GH cache not allowing fast successive changes still... rechecked payload... potential issue detected with those authors definining their own GH .meta.js and webhook...
// Applied patch https://github.com/OpenUserJS/OpenUserJS.org/commit/95bfec7189f9fd492227b46f97060f9b42130ab1 and version bumped
