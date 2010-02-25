(function() {

// ==UserScript==
// @name          uso - Anchor Bookmarks
// @namespace     http://userscripts.org/users/37004
// @description   With null anchor tags, finds next available text node line and converts it into a bookmark
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.0.11
// @include   http://userscripts.org/*
// @include   https://userscripts.org/*
// @require http://usocheckup.dune.net/69725.js?method=install&open=window&maxage=14&custom=yes&topicid=46797&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  var xpr = document.evaluate(
    "//a[not(@href)][not(@name)][not(@id)]",
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  var thisNode, thatNode;
  if (xpr) {
    var bookmarks = {};

    function checkBookmark(bookmarks, newbookmark, suffix) {
      for (var bookmark in bookmarks) {
        if (newbookmark + ((suffix) ? "-" + suffix : "") == bookmarks[bookmark]) {
          suffix = (suffix) ? suffix + 1 : 1;
          checkBookmark(bookmarks, newbookmark, suffix);
        }
      }
      return suffix;
    }

    for (var i = 0; i < xpr.snapshotLength; ++i) {
      var thatNode = thisNode = xpr.snapshotItem(i);

      while (thatNode) {
        if (thatNode.textContent != "") {
          var newbookmark = thatNode.textContent;

          newbookmark = newbookmark.replace(/^\s*/, "");
            if (newbookmark.match(/(.{1,128})/i))
              newbookmark = newbookmark.match(/(.{1,128})/i)[1];
            else
              break;
          newbookmark = newbookmark.replace(/\s*$/, "");
          newbookmark = newbookmark.replace(/\s{2,}/g, " ");

          newbookmark = encodeURIComponent(newbookmark.toLowerCase());
          newbookmark = newbookmark.replace(/\%20/g, "-");
          newbookmark = newbookmark.replace(/\%/g, ".");
          newbookmark = "bookmark-" + newbookmark;

          var suffix;
          if ((suffix = checkBookmark(bookmarks, newbookmark)))
            newbookmark += "-" + suffix;

          bookmarks[newbookmark] = newbookmark;

          thisNode.setAttribute("id", newbookmark);
          thisNode.setAttribute("name", newbookmark);
            break;
        }
        thatNode = thatNode.nextSibling;
      }
    }
  }

  var hash = window.location.hash.match(/^#(bookmark-.*)/);
  if (hash) {
    document.evaluate(
      "//a[@id='" + hash[1] + "']",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      xpr
    );
    if (xpr && xpr.singleNodeValue)
      xpr.singleNodeValue.scrollIntoView();
  }

})();
