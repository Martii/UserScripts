(function () {

// ==UserScript==
// @name          RFC 2606§3 - ES6 Template String Unit Test
// @namespace     http://localhost.localdomain
// @description   Tests out ES6 Template Strings
// @copyright     2016+, Marti Martz (https://openuserjs.org/users/Marti)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       0.0.2

// @include   http://www.example.com/*
// @include   http://www.example.net/*
// @include   http://www.example.org/*

// @grant                none

// @updateURL  https://openuserjs.org/meta/Marti/RFC_2606%C2%A73_-_ES6_Template_String_Unit_Test.meta.js

// ==/UserScript==

  var CSS = `
    <style type="text/css">
      body { background-color: black; }
    </style>
  `;

  // NOTE: The splitting, mapping, slicing, and joining aren't really necessary
  //       but generated source is as appears without extra spaces in front of each line
  //       and would need to be maintained depending on spaced indention level

  document.head.innerHTML += CSS.split('\n').map(function (aEl) {
    return aEl.slice(4);
  }).join('\n');

  // Expected UI output should be a black body background instead of the default of #f0f0f2

})();
