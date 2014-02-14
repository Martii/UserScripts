(function() {
  "use strict"

// ==UserScript==
// @name          uso - More Pages
// @namespace     http://userscripts.org/users/37004
// @description   Adds a link to the next page and optionally if detected as missing
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @icon          http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=48&default=identicon
// @version       1.0.0
// @icon          https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @include  http://userscripts.org/*
// @include  https://userscripts.org/*

// @updateURL   https://userscripts.org/scripts/source/385863.meta.js
// @installURL  https://userscripts.org/scripts/source/385863.user.js
// @downloadURL https://userscripts.org/scripts/source/385863.user.js

// @grant  none

// ==/UserScript==

  function qsReplace(aQs, aName, aValue) {
    var aQs = location.search.replace(/^\?/, "");
    var newQs = [];
    var found;

    var qsps = aQs.split("&");
    for (var i = 0, qsp; qsp = qsps[i++];) {
      var namevalue = qsp.split("=");
      var name = namevalue[0];
      var value = namevalue[1];

      if (name == aName) {
        found = true;
        value = aValue;
      }
      newQs.push(name + "=" + value);
    }

    if (!found)
      newQs.unshift(aName + "=" + aValue);

    var qs = newQs.join("&");

    if (qs)
      return "?" + qs;

    return "";
  }

  function headCheck(aUrl, aCb, aAnchorNode, aReferenceNode) {
    var req = new XMLHttpRequest();
    req.open('HEAD', aUrl);
    req.onreadystatechange = function () {
      if (this.readyState == this.DONE && this.status != 404)
        aCb(aUrl, aAnchorNode, aReferenceNode);
    };
    req.send();
  }

  function getCheck(aUrl, aCb, aAnchorNode, aReferenceNode) {
    var req = new XMLHttpRequest();
    req.open('GET', aUrl);
    req.onreadystatechange = function () {
      if (this.readyState == this.DONE && this.status != 404)
        aCb(aUrl, aAnchorNode, aReferenceNode, this.responseText);
    };
    req.send();
  }

  var paginationNodes = document.querySelectorAll("#content .pagination");
  for (var i = 0, paginationNode; paginationNode = paginationNodes[i++];) {
    var lastpageNode = paginationNode.lastChild;

    var endpageNode = lastpageNode.previousSibling.previousSibling;

    var matches = endpageNode.textContent.match(/(\d+)/);
    if (matches) {
      var morepage = parseInt(matches[1]) + 1;

      var url = location.pathname + qsReplace(location.search, "page", morepage);
      getCheck(url, function (aUrl, aAnchorNode, aReferenceNode, aResponseText) {
        if (/No\sresults\.\sSorry\!/i.test(aResponseText))
          ; // TODO:
        else {
          var nodeA = document.createElement("a");
          nodeA.href = aUrl
          nodeA.textContent = "\u2026";

          aAnchorNode.insertBefore(nodeA, aReferenceNode);
          aAnchorNode.insertBefore(document.createTextNode(" "), aReferenceNode);
        }
      }, paginationNode, lastpageNode);
    }
  }

  var pagesNodes = document.querySelectorAll("#content .pages");
  for (var i = 0, pagesNode; pagesNode = pagesNodes[i++];) {
    var lastpagesNode = pagesNode.lastChild;

    var endpageNode = lastpagesNode.previousSibling;

    var matches = endpageNode.textContent.match(/(\d+)/);
    if (matches) {
      var morepage = parseInt(matches[1]) + 1;

      var url = endpageNode.pathname + qsReplace(endpageNode.search, "page", morepage);
      headCheck(url, function (aUrl, aAnchorNode, aReferenceNode) {
        var nodeA = document.createElement("a");
        nodeA.href = aUrl;
        nodeA.textContent = "\u2026";

        aAnchorNode.insertBefore(document.createTextNode(" "), aReferenceNode);
        aAnchorNode.insertBefore(nodeA, aReferenceNode);

      }, pagesNode, lastpagesNode);
    }
  }

})();
