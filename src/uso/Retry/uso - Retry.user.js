(function () {
  "use strict";

// ==UserScript==
// @run-at      document-start
// @name        uso - Retry
// @namespace   http://userscripts.org/users/37004
// @description Auto-Refreshes current URI on USO when a non-200 response code is encountered.
// @copyright   2011+, Marti Martz (http://userscripts.org/users/37004)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version     0.1.5.1eol
// @icon  https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @homepageURL   https://github.com/Martii/UserScripts/tree/master/src/uso/Retry
// @homepageURL   https://openuserjs.org/scripts/Marti/uso_-_Retry
// @homepageURL   http://userscripts.org/scripts/show/162319
// @supportURL    http://userscripts.org/topics/124034

// @include /^https?://userscripts\.org(?::\d{1,5})?/?/

// @include http://userscripts.org:8080/*

// @include http://userscripts.org/*

// @include https://userscripts.org/*

// ==/UserScript==

  let
      MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
      min = 750,
      max = 5000,
      timeout = min + Math.round(Math.random() * (max - min)),
      blocking = false
  ;

  if (MutationObserver) {
    let observer = new MutationObserver(
      function (aMutations) {
        aMutations.forEach(
          function (aMutation) {
            if (!blocking) {
              switch (aMutation.type) {
                case "childList":
                  let xpr = document.evaluate(
                    "//title",
                    headNode,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                  );
                  if (xpr && xpr.singleNodeValue) {
                    blocking = true;
                    observer.disconnect();

                    let thisNode = xpr.singleNodeValue;

                    switch (thisNode.textContent) {
                      case "502 Bad Gateway":
                      case "503 Service Unavailable":
                      case "404 Not Found":
                        setTimeout(function () { location.reload(); }, timeout);
                        break;
                    }
                  }
                  break;
              }
            }
          }
        );
      }
    );

    let headNode = document.head || document.getElementsByTagName("head")[0];
    if (headNode) {
      let config = { childList: true };
      observer.observe(headNode, config);
    }
    else
      console.error("Failed to get headNode");
  }
  else
    console.error("MutationObserver does not exist");

})();
