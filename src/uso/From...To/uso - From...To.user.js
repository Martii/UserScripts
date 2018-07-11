(function () {
  "use strict";

// ==UserScript==
// @name          uso - From…To
// @namespace     http://userscripts.org/users/37004
// @description   Shows the date range in the subtitle if present for a page
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       1.0.9.1eol
// @icon          https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @homepageURL   https://github.com/Martii/UserScripts/tree/master/src/uso/From...To
// @homepageURL   https://openuserjs.org/scripts/Marti/uso_-_From…To
// @homepageURL   http://userscripts.org/scripts/show/396490
// @supportURL    http://userscripts.org/topics/196657

// @include       /^https?://userscripts\.org(?::\d{1,5})?//

// @include       http://userscripts.org:8080/*

// @include       http://userscripts.org/*

// @include       https://userscripts.org/*

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
      if (thisNode.lastChild.nodeType == 3)
        thisNode.lastChild.textContent = thisNode.lastChild.textContent.replace(/\s*$/, "");

      var firstNode = abbrNodes.snapshotItem(0);
      var lastNode = abbrNodes.snapshotItem(abbrNodes.snapshotLength - 1);

      var firstNodeAbbr = document.createElement("abbr");
      firstNodeAbbr.title = firstNode.title;
      firstNodeAbbr.textContent = (firstNode.textContent ? firstNode.textContent.trim() : firstNode.nextSibling.textContent.trim());

      var lastNodeAbbr = document.createElement("abbr");
      lastNodeAbbr.title = lastNode.title;
      lastNodeAbbr.textContent = (lastNode.textContent ? lastNode.textContent.trim() : lastNode.nextSibling.textContent.trim());

      thisNode.appendChild(document.createTextNode(", this page from "));
      thisNode.appendChild(firstNodeAbbr);
      thisNode.appendChild(document.createTextNode(" to "));
      thisNode.appendChild(lastNodeAbbr);
      thisNode.appendChild(document.createTextNode(" "));
    }
  }

})();
