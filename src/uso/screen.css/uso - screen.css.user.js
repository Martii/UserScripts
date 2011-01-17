// ==UserScript==
// @name          uso - screen.css
// @namespace     http://userscripts.org/users/37004
// @description   Corrects any discovered issues with screen.css that come into my scope until uso gets around to fixing and sometimes it will do nothing.
// @copyright     2009+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       0.0.6
// @include       http://userscripts.org/*
//
// @require       http://usocheckup.redirectme.net/48071.js
// ==/UserScript==

(function() {

  // Right to left fix
  var CSS = <><![CDATA[

    td { text-align: inherit; }

  ]]></> + "";

  GM_addStyle(CSS);

  // Script icons if custom... change back to thumb
  if (window.location.pathname.match(/(.+)scripts\/show\/\d+/)) {
    var iconNode = document.evaluate(
      "//a[@id='icon']/img",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    );

    if (iconNode && iconNode.singleNodeValue) {
      var thisNode = iconNode.singleNodeValue;

      var url = thisNode.getAttribute("src");
      if (url.match(/http:\/\/s3\.amazonaws\.com\/uso_ss\/icon\/\d+\/(large)\.png\?\d+/)) {
        url = url.replace("large", "thumb");

        thisNode.removeAttribute("width");
        thisNode.setAttribute("src", url);
      }
    }
  }

  // New search form metrics
  var q = document.getElementsByName("q");
  for each (var name in q) {
    if (name.getAttribute("size") == 31)
      name.setAttribute("size", "21");

    GM_addStyle("#header #script_search { margin-top: -6px; padding: 0; }");
    GM_addStyle('input.text, input.title, input[type="text"] { padding: 3px; }');
  }

})();
