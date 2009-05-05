/*
userscripts.org - Cancellable Editor

NOTE: This uses object existence tests on unsafeWindow, but NEVER CALLS those objects

LICENSE
=======
This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; version 3 of the License or any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA


CHANGELOG
=========
{}

*/

// ==UserScript==
// @name          uso - Cancellable Editor
// @namespace     http://userscripts.org/users/37004
// @description   Allows cancelling of the Editor while viewing offline with site JavaScript disabled
// @copyright     2009+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       (CC) Attribution Non-Commercial Share Alike; http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version       0.0.1
// @include       http://userscripts.org/topics/*
// @include       https://userscripts.org/topics/*
// @exclude       http://userscripts.org/topics/new*
// @exclude       https://userscripts.org/topics/new*
// ==/UserScript==

(function() {

  //  ***************************************************************************
  function cancelReply(ev) {
    this.removeEventListener("click", cancelReply, false);

    this.setAttribute("onclick", "$('reply').hide(); return false;");
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

  if (unsafeWindow instanceof Object && typeof unsafeWindow.Prototype == "object")
    return;
  
  if (document.evaluate(
    "//a[starts-with(@href,'/login')]",
    document,
    null,
    XPathResult.BOOLEAN_TYPE,
    null
  ).booleanValue) {

    var xpr = document.evaluate(
      '//a[starts-with(@onclick,"$(\'reply\').hide();")]',
      document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    if (xpr)
      for (var i = xpr.snapshotLength - 1; thisNode = xpr.snapshotItem(i); --i ) {
        thisNode.setAttribute("onclick", "javascript:void(0);");
        thisNode.setAttribute("href", "javascript:void(0);");
        thisNode.addEventListener("click", cancelReply, false);
      }
  }

})();