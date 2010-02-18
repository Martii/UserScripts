(function() {

// ==UserScript==
// @name          uso - countIssues
// @namespace     http://userscripts.org/users/37004
// @description   Counts the issues and places the appropriate count on the Issues tab
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.0.1
// @include   http://userscripts.org/scripts/*/*
// @include   https://userscripts.org/scripts/*/*
// @include   http://userscripts.org/topics/*
// @include   https://userscripts.org/topics/*
// @require http://usocheckup.dune.net/69307.js?method=install&open=window&maxage=14&custom=yes&topicid=45479&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  function getScriptid() {
    var scriptid = window.location.pathname.match(/\/scripts\/.+\/(\d+)/i);
    if (!scriptid) {
      var titleNode = document.evaluate(
        "//h1[@class='title']/a",
        document,
        null,
        XPathResult.ANY_UNORDERED_NODE_TYPE,
        null
      );

      if (titleNode && titleNode.singleNodeValue)
        scriptid = titleNode.singleNodeValue.pathname.match(/\/scripts\/show\/(\d+)/i);
    }
    return (scriptid) ? scriptid[1] : undefined;
  }

  var scriptid = getScriptid();
  if (scriptid) {

    function getDocument(url, callback) {
      var rex = new RegExp(url + ".*", "i");
      var uri = "http://" + window.location.host + window.location.pathname + window.location.search + window.location.hash;
      if (uri.match(rex)) {
        callback(document);
      }
      else {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          onload: function (xhr) {
            var doc = document.implementation.createDocument("", "", null);
            var html = document.createElement("html");
            html.innerHTML = xhr.responseText;
            doc.appendChild(html);
            callback(doc);
          }
        });
      }
    }

    getDocument("http://userscripts.org/scripts/issues/" + scriptid, function(doc) {
      var votes = {
        "broken":  "broken_votes",
        "copy":    "copy_votes",
        "harmful": "harmful_votes",
        "spam":    "spam_votes",
        "vague":   "vague_votes"
      };

      var yesCount = 0;
      var noCount = 0;
      for each (var vote in votes) {
        var xpr = doc.evaluate(
          "//a[contains(@href,'/scripts/issues/" + scriptid + "#" + vote + "')]",
          doc,
          null,
          XPathResult.ANY_UNORDERED_NODE_TYPE,
          null
        );

        if (xpr && xpr.singleNodeValue) {
          thisNode = xpr.singleNodeValue;

          matches = thisNode.textContent.match(/(\d+) of (\d+) voted yes/i);
          if (matches) {
            yesCount += parseInt(matches[1]);
            noCount += parseInt(matches[2]) - parseInt(matches[1]);
          }
        }
      }

      if (yesCount == 0)
        return;

      var issuesNode;

      if (document == doc) {
        issuesNode = document.evaluate(
            "//li/text()['Issues']",
            document,
            null,
            XPathResult.ANY_UNORDERED_NODE_TYPE,
            null
        );

        if (issuesNode && issuesNode.singleNodeValue) {
          thisNode = issuesNode.singleNodeValue;
          thisNode.textContent += " ";

          thisNode = thisNode.parentNode;
        }
      }
      else {
        issuesNode = document.evaluate(
            "//li/a[contains(@href,'/scripts/issues/" + scriptid + "')]",
            document,
            null,
            XPathResult.ANY_UNORDERED_NODE_TYPE,
            null
        );

        if (issuesNode && issuesNode.singleNodeValue) {
          thisNode = issuesNode.singleNodeValue;
          thisNode.textContent += " ";
        }
      }

      var spanNode = document.createElement("span");
      if (yesCount > noCount)
        spanNode.setAttribute("style", "color: red");
      spanNode.textContent = yesCount;

      thisNode.appendChild(spanNode);
    });

  }
})();
