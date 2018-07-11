(function () {

// ==UserScript==
// @name          RFC 2606§3 - GM_listValues Unit Test
// @namespace     http://localhost.localdomain
// @description   Tests GM_listValues by displaying an alert of the values
// @copyright     2007+, Marti Martz (https://openuserjs.org/users/Marti)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       0.0.2
// @icon          https://www.gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?r=G&s=48&default=identicon

// @include   http://www.example.com/*
// @include   http://www.example.net/*
// @include   http://www.example.org/*

// @grant GM_setValue
// @grant GM_listValues

// @updateURL  https://openuserjs.org/meta/Marti/RFC_2606%C2%A73_-_GM_listValues_Unit_Test.meta.js

// ==/UserScript==

  GM_setValue('one', 1);
  GM_setValue('two', 2);
  GM_setValue('three', 3);

  alert(GM_listValues());


})();
