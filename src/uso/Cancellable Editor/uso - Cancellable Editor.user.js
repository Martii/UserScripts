(function () {
  "use strict"

// ==UserScript==
// @name          uso - Cancellable Editor
// @namespace     http://userscripts.org/users/37004
// @description   Allows cancelling of the reply editor while viewing on or offline with site JavaScript disabled
// @copyright     2009+, Marti Martz (http://userscripts.org/users/37004)
// @license       (CC) Attribution Non-Commercial Share Alike; http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       0.2.4
// @icon          https://raw.githubusercontent.com/Martii/UserScripts/master/src/uso/Cancellable%20Editor/res/icon48.png

// @homepageURL   https://github.com/Martii/UserScripts/tree/master/src/uso/Cancellable%20Editor
// @homepageURL   https://openuserjs.org/scripts/Marti/uso_-_Cancellable_Editor
// @homepageURL   http://userscripts.org/scripts/show/48200
// @supportURL    http://userscripts.org/topics/26204

// @include  /^https?://userscripts\.org(?::\d{1,5})?/topics//

// @include  http://userscripts.org:8080/topics/*

// @include  http://userscripts.org/topics/*

// @include  https://userscripts.org/topics/*

// ==/UserScript==

/**
 * NOTE: This script uses object existence tests on the wrappedJSObject, but NEVER CALLS those objects
 */

  function cancelReply(aEv) {
    aEv.preventDefault();

    let xpr = document.evaluate(
        "//div[@id='reply']",
        document.body,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );

    if (xpr && xpr.singleNodeValue)  {
      let thisNode = xpr.singleNodeValue;

      thisNode.style.setProperty("display", "none", "");
    }
  }

  if (typeof window.wrappedJSObject == "object" && typeof window.wrappedJSObject.jQuery == "function")
    return;

  let xpr = document.evaluate(
      '//a[starts-with(@onclick,"$(\'#reply\').hide();")]',
      document.body,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
  );

  if (xpr)
    for (let i = 0, thisNode; thisNode = xpr.snapshotItem(i++);) {
      thisNode.removeAttribute("onclick");
      thisNode.addEventListener("click", cancelReply, false);
    }

})();
