(function () {

// ==UserScript==
// @run-at        document-start
// @name          uso - Retry
// @namespace     http://userscripts.org/users/37004
// @description   Auto-Refreshes current URI on USO when a trapped page load failure is encountered.
// @copyright     2011+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.0.1
// @include  http://userscripts.org/*
// ==/UserScript==

  function retry () {
    let
      min = 750,
      max = 5000
    ;

    if (location.pathname.match(/^\/sessions/))
      setTimeout(function () {
        location.pathname = "/login";
      }, min + Math.round(Math.random() * max));
    else
      setTimeout(function () {
        location.reload();
      }, min + Math.round(Math.random() * max));

  }

  function retryCheck () {
    if (document.body) {
      let xpr = document.evaluate(
        "//title[.='502 Bad Gateway' or .='503 Service Unavailable' or .='404 Not Found']",
        document.documentElement,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      if (xpr && xpr.singleNodeValue) {
        removeEventListener("DOMNodeInserted", retryCheck, true);
        retry();
      }

      if (document.readyState == "complete")
        removeEventListener("DOMNodeInserted", retryCheck, true);
    }
  }

  switch (document.readyState) {
    case "loading":
      addEventListener("DOMNodeInserted", retryCheck, true); // NOTE: Deprecated
      break;
    case "complete":
      retryCheck();
      break;
    default:
      break;
  }

})();
