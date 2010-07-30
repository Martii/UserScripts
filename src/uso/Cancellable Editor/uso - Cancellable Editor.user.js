(function () {

// ==UserScript==
// @name          uso - Cancellable Editor
// @namespace     http://userscripts.org/users/37004
// @description   Allows cancelling of the Editor while viewing offline with site JavaScript disabled
// @copyright     2009+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       (CC) Attribution Non-Commercial Share Alike; http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version       0.0.11
// @include  http://userscripts.org/topics/*
// @include  https://userscripts.org/topics/*
// @require  http://usocheckup.redirectme.net/48200.js?method=install&open=window&maxage=3&id=usoCheckup&custom=yes&topicid=26205
// @require  http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  if (typeof usoCheckup != "undefined") {
    usoCheckup.widgets("query");   // Activate the default query widget.
  }

/*
NOTE: This script uses object existence tests on unsafeWindow, but NEVER CALLS those objects

CHANGELOG
=========
http://userscripts.org/topics/26205

*/

  //  ***************************************************************************
  function cancelReply(ev) {
    this.removeEventListener("click", cancelReply, false);

    this.setAttribute("onclick", "$('#reply').hide(); return false;");
    this.setAttribute("href", "#");

    var xpr = document.evaluate(
      "//div[@id='reply']",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    );

    if (xpr && xpr.singleNodeValue)  {
      var thisNode = xpr.singleNodeValue;
      thisNode.setAttribute("style", "display: none;");
    }
  }
  //  ***************************************************************************

  if (typeof unsafeWindow == "object" && typeof unsafeWindow.jQuery == "function")
    return;
  
  if (document.evaluate(
    "//a[starts-with(@href,'/login')]",
    document,
    null,
    XPathResult.BOOLEAN_TYPE,
    null
  ).booleanValue) {

    var xpr = document.evaluate(
      '//a[starts-with(@onclick,"$(\'#reply\').hide();")]',
      document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    if (xpr)
      for (var i = xpr.snapshotLength - 1; thisNode = xpr.snapshotItem(i); --i) {
        thisNode.setAttribute("onclick", "javascript:void(0);");
        thisNode.setAttribute("href", "javascript:void(0);");
        thisNode.addEventListener("click", cancelReply, false);
      }
  }

})();