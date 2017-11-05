(function () {
  "use strict";

// ==UserScript==
// @name          uso - screen.css
// @namespace     http://userscripts.org/users/37004
// @description   Corrects any discovered issues with screen.css that come into my scope until USO gets around to fixing and sometimes it will do nothing.
// @copyright     2009+, Marti Martz (http://userscripts.org/users/37004)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       0.4.3.1eol
// @icon          https://raw.githubusercontent.com/Martii/UserScripts/master/src/uso/screen.css/res/icon48.png

// @homepageURL   https://github.com/Martii/UserScripts/tree/master/src/uso/screen.css
// @homepageURL   https://openuserjs.org/scripts/Marti/uso_-_screen.css
// @homepageURL   http://userscripts.org/scripts/show/48071
// @supportURL    http://userscripts.org/topics/216498

// @include /^https?://userscripts\.org(?::\d{1,5})?/?/

// @include http://userscripts.org:8080/*

// @include http://userscripts.org/*

// @include https://userscripts.org/*

// @require https://raw.githubusercontent.com/Martii/UserScripts/master/lib/GM_setStyle/GM_setStyle.js

// ==/UserScript==

  let gCSS = GM_setStyle({
    media: "screen, projection, print"
  });

  // Right to left fix
  GM_setStyle({
    node: gCSS,
    data:
      [
        "td { text-align: inherit; }"

      ].join("\n")
  });

  // Padding left fix for menu on individual user pages
  GM_setStyle({
    node: gCSS,
    data:
      [
        ".users #root .container ul.subnav,",
        ".home #root .container ul.subnav",
        "{ padding-left: 0; }"

      ].join("\n")
  });

  // Turn off misc first spacers in topics due to spam removal
  GM_setStyle({
    node: gCSS,
    data:
      [
        "#root #content .posts tbody tr.spacer:first-child { display: none; }"

      ].join("\n")
  });

  // Fix tag cloud of userscripts
  GM_setStyle({
    node: gCSS,
    data:
      [
        "body#users-show #tag-cloud h4 { margin-left: 0; }"

      ].join("\n")
  });

  // Make lists in spam topic wide
  //   GM_setStyle({
  //     node: gCSS,
  //     data:
  //       [
  //         "#content .posts .entry-content ul { -moz-column-width: 10em; }"
  //
  //       ].join("\n")
  //   });


})();
