(function () {
  "use strict";

// ==UserScript==
// @name          uso - To…From…To
// @namespace     http://userscripts.org/users/37004
// @description   Shows the date range in the subtitle if present for a page
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       1.0.1
// @icon          https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @include       http://userscripts.org/*
// @include       https://userscripts.org/*

// @updateURL   https://userscripts.org/scripts/source/396490.meta.js
// @installURL  https://userscripts.org/scripts/source/396490.user.js
// @downloadURL https://userscripts.org/scripts/source/396490.user.js

// @grant         none

// ==/UserScript==

  var xpr = document.evaluate( // NOTE: Equivalent document.querySelect("#root p.subtitle") but no text nodes
    "//*[@id='root']//p[contains(concat(' ', normalize-space(@class), ' '), ' subtitle ')]",
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  if (xpr && xpr.singleNodeValue) {
    var thisNode = xpr.singleNodeValue;

    var abbrNodes = document.evaluate( // NOTE: Equivalent document.querySelectAll("tr abbr.updated") but no text nodes
      "//tr//abbr[contains(concat(' ', normalize-space(@class), ' '), ' updated ')]",
      document.body,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    if (abbrNodes.snapshotLength > 0) {
      var firstNode = abbrNodes.snapshotItem(0);
      var lastNode = abbrNodes.snapshotItem(abbrNodes.snapshotLength - 1);

      var lastTextNode = document.createTextNode(
          " " + (lastNode.textContent ? "from " + lastNode.textContent.trim() : "to " + lastNode.nextSibling.textContent.trim())
      );


      var firstTextNode = document.createTextNode(
          ", this page " + (firstNode.textContent ? "to " + firstNode.textContent.trim() : "from " + firstNode.nextSibling.textContent.trim())
      );

      thisNode.lastChild.textContent = thisNode.lastChild.textContent.replace(/\s*$/, "");

      thisNode.appendChild(firstTextNode);
      thisNode.appendChild(lastTextNode);
    }
  }

})();
