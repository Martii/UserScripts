(function() {

// ==UserScript==
// @name          uso - Anchor Bookmarks
// @namespace     http://userscripts.org/users/37004
// @description   With null anchor tags, finds next available text node line and converts it into a bookmark
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.0.8
// @include   http://userscripts.org/*
// @include   https://userscripts.org/*
// @require http://usocheckup.dune.net/69725.js?method=install&open=window&maxage=14&custom=yes&topicid=46797&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  var xpr = document.evaluate(
    "//a[not(@href)][not(@name)][not(@id)]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  var thisNode, thatNode;
  if (xpr)
    for (var i = xpr.snapshotLength - 1; thisNode = xpr.snapshotItem(i); --i) {
      var thatNode = thisNode;
      while (thatNode) {
        if (thatNode.textContent != "") {
          var bookmark = thatNode.textContent;

          bookmark = bookmark.replace(/^\s*/, "");
            if (bookmark.match(/(.{1,128})/i))
              bookmark = bookmark.match(/(.{1,128})/i)[1];
            else
              break;
          bookmark = bookmark.replace(/\s*$/, "");
          bookmark = bookmark.replace(/\s{2,}/g, " ");

          bookmark = encodeURIComponent(bookmark.toLowerCase());
          bookmark = bookmark.replace(/%20/g, "-");
          bookmark = bookmark.replace(/%/g, ".");
          bookmark = "bookmark-" + bookmark;

          thisNode.setAttribute("id", bookmark);
          thisNode.setAttribute("name", bookmark);
            break;
        }
        thatNode = thatNode.nextSibling;
      }
    }

    if (window.location.hash.match(/^#bookmark-/))
      window.location.hash = window.location.hash;

})();
