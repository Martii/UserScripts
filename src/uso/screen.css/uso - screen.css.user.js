// ==UserScript==
// @name          uso - screen.css
// @namespace     http://userscripts.org/users/37004
// @description   Corrects any discovered issues with screen.css that come into my scope until USO gets around to fixing and sometimes it will do nothing.
// @copyright     2009+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.1.2
// @icon    http://s3.amazonaws.com/uso_ss/icon/48071/thumb.jpg
// @include http://userscripts.org/*
// @include https://userscripts.org/*
// @require http://usocheckup.redirectme.net/48071.js?method=install&open=window&maxage=7&custom=yes&topicid=26082&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

(function() {

  // Right to left fix
  GM_addStyle(<><![CDATA[

    td { text-align: inherit; }

  ]]></> + "");

  // Script icons if custom... change back to thumb
  if (window.location.pathname.match(/(.+)scripts\/show\/\d+/)) {
    let xpr = document.evaluate(
      "//a[@id='icon']/img",
      document.body,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );

    if (xpr && xpr.singleNodeValue) {
      let thisNode = xpr.singleNodeValue;

      let url = thisNode.getAttribute("src");
      if (url.match(/^http:\/\/s3\.amazonaws\.com\/uso_ss\/icon\/\d+\/(large)\.png\?\d+/)) {
        thisNode.removeAttribute("width");
        thisNode.setAttribute("src", url.replace("large", "thumb"));
      }
    }
  }

  // New search form metrics
  let xpr = document.evaluate(
    "//input[@name='q']",
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    xpr
  );

  if (xpr && xpr.singleNodeValue) {
    thisNode = xpr.singleNodeValue;

    thisNode.setAttribute("size", "20");
//     GM_addStyle(<><![CDATA[
//
//       #header #script_search { margin-top: -6px; padding: 0; }
//       input.text, input.title, input[type="text"] { padding: 3px; }
//
//     ]]></> + "");

    if (window.location.pathname == "/search") {
      document.evaluate(
        "//iframe[@name='googleSearchFrame']",
        document.body,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        xpr
      );

      if (xpr && xpr.singleNodeValue) {
        thisNode = xpr.singleNodeValue;

        thisNode.setAttribute("width", "100%");
      }
    }
  }

})();
