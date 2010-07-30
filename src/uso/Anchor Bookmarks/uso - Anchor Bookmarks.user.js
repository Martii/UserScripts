(function() {

// ==UserScript==
// @name          uso - Anchor Bookmarks
// @namespace     http://userscripts.org/users/37004
// @description   Converts anchor tags with no attributes into bookmarks via the next available text node line
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.2.10
// @include http://userscripts.org/*
// @include https://userscripts.org/*
// @exclude http://userscripts.org/login*
// @exclude https://userscripts.org/login*
// @exclude http://userscripts.org/scripts/source/*.meta.js
// @exclude https://userscripts.org/scripts/source/*.meta.js
// @exclude http://userscripts.org/scripts/diff/*
// @exclude https://userscripts.org/scripts/diff/*
// @exclude http://userscripts.org/scripts/version/*
// @exclude https://userscripts.org/scripts/version/*
// @require http://usocheckup.redirectme.net/69725.js?method=install&open=window&maxage=14&custom=yes&topicid=46797&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  var pathname, portion;
  switch ((pathname = window.location.pathname)) {
    case undefined:
    default:
      break;

    case (portion = pathname.match(/^\/scripts(.*)/i)) ? portion[0] : undefined:
      var tabid = (portion = portion[1].match(/^\/(show|reviews|issues)\/(.*)/i)) ? portion[1] : undefined;
      switch (tabid) {
        case "show":
          var contextNode = document.evaluate(
            "//div[@id='full_description']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          if (contextNode && contextNode.singleNodeValue) {
            contextNode = contextNode.singleNodeValue;
            addBookmarks(contextNode, "bookmark-");
          }
          break;
        case "reviews":
          var contextNode = document.evaluate(
            "//div[@class='review']/div[@class='body']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          );
          for (var i = 0; i < contextNode.snapshotLength; ++i) {
            var thisNode = contextNode.snapshotItem(i);

            var reviewid = thisNode.previousSibling.previousSibling.previousSibling.previousSibling.getAttribute("id").match(/reviews-(\d+)-status/i)[1];
            addBookmarks(thisNode, "bookmark-" + reviewid + "-");
          }
          break;
        case "issues":
          var contextNode = document.evaluate(
            "//p[contains(@id, 'issuecomments-')]",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          );
          for (var i = 0; i < contextNode.snapshotLength; ++i) {
            var thisNode = contextNode.snapshotItem(i);

            var commentid = thisNode.getAttribute("id").match(/issuecomments-(\d+)/i)[1];
            addBookmarks(thisNode.nextSibling, "bookmark-" + commentid + "-");
          }
          break;
      }
      break;

    case (portion = pathname.match(/^\/jetpacks(.*)/i)) ? portion[0] : undefined:
      var jetpackid = (portion = portion[1].match(/^\/(.*)/i)) ? portion[1] : undefined;
      if (jetpackid) {
        var contextNode = document.evaluate(
          "//p/b/text()['Summary:']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        if (contextNode && contextNode.singleNodeValue) {
          contextNode = contextNode.singleNodeValue.parentNode.parentNode;
          addBookmarks(contextNode, "bookmark-");
        }
      }
      break;

    case (portion = pathname.match(/^\/articles(.*)/i)) ? portion[0] : undefined:
      var articleid = (portion = portion[1].match(/^\/(\d+).*/i)) ? portion[1] : undefined;
      if (articleid) {
        var contextNode = document.evaluate(
          "//div[contains(@id, 'comment-body')]",
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        for (var i = 0; i < contextNode.snapshotLength; ++i) {
          var thisNode = contextNode.snapshotItem(i);

          var commentid = thisNode.getAttribute("id").match(/comment-body-(\d+)/i)[1];
          addBookmarks(thisNode, "bookmark-" + commentid + "-");
        }

        contextNode = document.evaluate(
          "//p[@class='summary']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        if (contextNode && contextNode.singleNodeValue) {
          contextNode = contextNode.singleNodeValue;
          addBookmarks(contextNode, "bookmark-");
        }
      }
      break;

    case (portion = pathname.match(/^\/groups(.*)/i)) ? portion[0] : undefined:
      var groupid = (portion = portion[1].match(/^\/(\d+)$/i)) ? portion[1] : undefined;
      if (groupid) {
        var contextNode = document.evaluate(
          "//div[@class='description']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        if (contextNode && contextNode.singleNodeValue) {
          contextNode = contextNode.singleNodeValue;
          addBookmarks(contextNode, "bookmark-");
        }
      }
      break;

    case (portion = pathname.match(/^\/guides(.*)/i)) ? portion[0] : undefined:
      var guideid = (portion = portion[1].match(/^\/(\d+)$/i)) ? portion[1] : undefined;
      if (guideid) {
        var contextNode = document.evaluate(
          "//div[@class='script-info']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        if (contextNode && contextNode.singleNodeValue) {
          contextNode = contextNode.singleNodeValue;
          addBookmarks(contextNode, "bookmark-");
        }

        contextNode = document.evaluate(
          "//div[contains(@id, 'comment-body')]",
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        for (var i = 0; i < contextNode.snapshotLength; ++i) {
          var thisNode = contextNode.snapshotItem(i);

          var commentid = thisNode.getAttribute("id").match(/comment-body-(\d+)/i)[1];
          addBookmarks(thisNode, "bookmark-" + commentid + "-");
        }
      }
      break;

    case (portion = pathname.match(/^\/topics(.*)/i)) ? portion[0] : undefined:
      var topicid = (portion = portion[1].match(/^\/(\d+)$/i)) ? portion[1] : undefined;
      if (topicid) {
        var contextNode = document.evaluate(
          "//td[contains(@id, 'post-body')]",
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        for (var i = 0; i < contextNode.snapshotLength; ++i) {
          var thisNode = contextNode.snapshotItem(i);

          var postid = thisNode.getAttribute("id").match(/post-body-(\d+)/i)[1];
          addBookmarks(thisNode, "bookmark-" + postid + "-");
        }
      }
      break;

    case (portion = pathname.match(/^\/reviews(.*)/i)) ? portion[0] : undefined:
      var reviewid = (portion = portion[1].match(/^\/(\d+)$/i)) ? portion[1] : undefined;
      if (reviewid) {
        var contextNode = document.evaluate(
          "//div[@class='body']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        if (contextNode && contextNode.singleNodeValue) {
          contextNode = contextNode.singleNodeValue;
          addBookmarks(contextNode, "bookmark-");
        }

        contextNode = document.evaluate(
          "//div[contains(@id, 'comment-body')]",
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        for (var i = 0; i < contextNode.snapshotLength; ++i) {
          var thisNode = contextNode.snapshotItem(i);

          var commentid = thisNode.getAttribute("id").match(/comment-body-(\d+)/i)[1];
          addBookmarks(thisNode, "bookmark-" + commentid + "-");
        }
      }
      break;
  }


function addBookmarks(contextNode, prefixAttribute) {
  var xpr = document.evaluate(
    "../descendant::a[not(@href)][not(@name)][not(@id)]",
    contextNode,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  var thisNode, thatNode;
  if (xpr) {
    var img = "data:image/png;base64,"
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

    var headNode = document.evaluate(
      "//head",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );

    if (headNode && headNode.singleNodeValue) {
      var styleNode = document.createElement("style");
      styleNode.setAttribute("type", "text/css");
      styleNode.setAttribute("media", "screen, projection");
      styleNode.textContent = ".bookmark { width: 16px; height: 16px; margin: 0.1em 0.2em 0; float: left; background: transparent url(" + img + ") no-repeat top left; opacity: 0.4; } .bookmark:hover { opacity: 1.0; }";
      headNode.singleNodeValue.appendChild(styleNode);

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

            if (!newbookmark.match(/^about:.*/i)) {
              newbookmark = newbookmark.replace(/^\s*/, "");
              if (newbookmark.match(/(.{1,64})/i)) {
                newbookmark = newbookmark.match(/(.{1,64})/i)[1];
                newbookmark = newbookmark.replace(/\s*$/, "");
                newbookmark = newbookmark.replace(/\s{2,}/g, " ");

                newbookmark = newbookmark.replace(/\.*/g, "");

                newbookmark = encodeURIComponent(newbookmark.toLowerCase());
                newbookmark = newbookmark.replace(/\%20/g, "-");
                newbookmark = newbookmark.replace(/\%/g, ".");
                newbookmark = prefixAttribute + newbookmark;

                var suffix;
                if ((suffix = checkBookmark(bookmarks, newbookmark)))
                  newbookmark += "-" + suffix;

                bookmarks[newbookmark] = newbookmark;
              }

              thisNode.setAttribute("name", newbookmark);
              thisNode.setAttribute("id", newbookmark);

              var imgNode = document.createElement("img");
              imgNode.setAttribute("class", "bookmark");
              imgNode.setAttribute("title", "link");
              imgNode.setAttribute("alt", "link");
              imgNode.setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");

              var anchorNode = document.createElement("a");
              anchorNode.setAttribute("href", "#" + newbookmark);

              anchorNode.appendChild(imgNode);
              thisNode.parentNode.insertBefore(anchorNode, thisNode);
            }
            break;
          }
          thatNode = thatNode.nextSibling;
        }
      }
    }
  }
}
  var hash = window.location.hash.match(/^#(bookmark-.*)/);
  if (hash) {
    var anchorNode = document.evaluate(
      "//a[@id='" + hash[1] + "']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    if (anchorNode && anchorNode.singleNodeValue)
      anchorNode.singleNodeValue.scrollIntoView();
  }

})();
