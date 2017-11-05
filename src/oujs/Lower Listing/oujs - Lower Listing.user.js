// ==UserScript==
// @name          oujs - Lower Listing
// @namespace     https://openuserjs.org/users/Marti
// @description   Trial to see if this is a benefit with script lists
// @copyright     2016+, Marti Martz (https://openuserjs.org/users/Marti)
// @attribution   Jerone (https://github.com/OpenUserJs/OpenUserJS.org/commit/4481c19b2457625c41904e9eb7560711bb10626b)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       0.0.1.0eol
// @icon          https://www.gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?r=G&s=48&default=identicon

// @homepageURL  https://github.com/Martii/UserScripts/tree/master/src/oujs/Lower%20Listing
// @homepageURL  https://openuserjs.org/scripts/marti/oujs_-_Lower_Listing
// @supportURL   https://github.com/OpenUserJs/OpenUserJS.org/issues/469

// @updateURL    https://openuserjs.org/meta/Marti/oujs_-_Lower_Listing.meta.js
// @downloadURL  https://openuserjs.org/src/scripts/Marti/oujs_-_Lower_Listing.min.user.js

// @include  /^https?://openuserjs\.org(?::\d{1,5})?//
// @include  /^http://localhost(?::\d{1,5})?//

// @include  https://openuserjs.org/*
// @include  http://localhost:8080/*

// @grant none

// ==/UserScript==

(function() {
  'use strict';

  var nodeStyle = document.createElement('style');
  nodeStyle.setAttribute("type", "text/css");
  nodeStyle.textContent = '.rating .progress { margin-bottom: 0; }';

  document.head.appendChild(nodeStyle);

})();
