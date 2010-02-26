(function() {

// ==UserScript==
// @name          uso - Anchor Bookmarks
// @namespace     http://userscripts.org/users/37004
// @description   With null anchor tags, finds next available text node line and converts it into a bookmark
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.0.15
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
            if (newbookmark.match(/(.{1,128})/i)) {
              newbookmark = newbookmark.match(/(.{1,128})/i)[1];
              newbookmark = newbookmark.replace(/\s*$/, "");
              newbookmark = newbookmark.replace(/\s{2,}/g, " ");

              newbookmark = newbookmark.replace(/\.*/g, "");

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

              var imgNode = document.createElement("img");
              imgNode.setAttribute("style", "margin: 0 0.2em 0 0; float: left;");
              imgNode.setAttribute("title", "link");
              imgNode.setAttribute("alt", "link");
              imgNode.setAttribute("src", "data:image/png;base64,"
                + "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A"
                + "/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9oCGRYCJ6c31rcAAAJbSURBVDjL"
                + "jZJLSNRRFMZ/997/mDY1ZuRjxpwkRbCwh4YuEgKNilpUq6CIkh7UokULEQwypAzfRbuUWkmbVi1q"
                + "EZhJgYjmozS10RbhG9KpcZyZ/jO3xYyTL8IPDvcezj3f/b57rtBaU1P38KRS6qlpmqmsAymlFkIE"
                + "DMPo9Pv9FWWl5e+iRa01dQ3VkzOz0/p/GB1z6c9f+vTjJw2e+saaeq01WmskgGmaKYk7khgeHWTY"
                + "NRBeRwcZWRa9vd3YHQ4uXSyxSilvVtdWHQfCBEtQUqKUgZIKQ6nwPhJCCXyLiyCg8HBhnGExKgGM"
                + "FQRqKRUIsbwisNsddHZ1YJoh0p3phIKhg2sJpAIhmPnppfHFJ/q/zYCA3Kxkbl/IIzPDite7SE7O"
                + "ft63t1nWWlCK2Xkf1+6/JjnFTekVP/du5ZOZMcvlyjdoZcXpdBK7KZZgMEh1bZWQqy3Ut3RzuthF"
                + "wd5RJtynMMU4BfvaOHdinPqWLpRSYVNCaECsUdA3PI09yUbH8Bmm53xsiW3F47ORljJD99AUhlrh"
                + "eiWBlGF2359CnNub8SzM8n08AYtw4fXlRy+JKGDdMR7ISuZDz2+2xv3AkdBB19BRPAtW2nus5GXb"
                + "o5Na14KUijtXj/B1ZIqBsUNsjjlG9k4brZ3F9A/OU3G9KKpgyYKx6s+zy76Nl7XnedDcxtuPXQDk"
                + "7tnNq0dFpCba/nVGFKx8ESEQQrDLHk/T3bPISC6EjNaWn40SWCyWSfcvtz3eFs9GsOBdAJgDAgZA"
                + "MBgsefa8qSkQCKRthCAmJmYiFArdKCst138BG630E1pVEUQAAAAASUVORK5CYII="
              );

              var anchorNode = document.createElement("a");
              anchorNode.setAttribute("href", "#" + newbookmark);

              anchorNode.appendChild(imgNode);

              if (!thatNode.tagName)
                thatNode.parentNode.insertBefore(anchorNode, thisNode);
              else
                thatNode.appendChild(anchorNode);

              break;
            }
        }
        thatNode = thatNode.nextSibling;
      }
    }
  }

  var hash = window.location.hash.match(/^#(bookmark-.*)/);
  if (hash) {
    var anchorNode = document.evaluate(
      "//a[@id='" + hash[1] + "']",
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    );
    if (anchorNode && anchorNode.singleNodeValue)
      anchorNode.singleNodeValue.scrollIntoView();
  }

})();
