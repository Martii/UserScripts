// ==UserScript==
// @namespace     https://openuserjs.org/users/Marti
// @exclude       *
// @author        Marti Martz (https://openuserjs.org/users/Marti)
// @icon          https://gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396&r=G&s=48&default=identicon

// ==UserLibrary==
// @name          GM_setStyle
// @description   Alternative to GM_addStyle for Greasemonkey
// @copyright     2011+, Marti Martz (https://openuserjs.org/users/Marti)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       0.0.17.007b

// ==/UserScript==

// ==/UserLibrary==

// ==OpenUserJS==
// @author        Marti
// @collaborator  sizzle
// ==/OpenUserJS==

/* jshint esversion: 5 */

  function GM_setStyle(aObject) {
    "use strict";
    // **
    function validateCSS(aData, aSpace) {
      // ** Create a core html5 document implementation for sanitizing
      var dt = document.implementation.createDocumentType("html", "", ""),
          doc = document.implementation.createDocument("", "", dt),
          body = doc.createElement("body"),
          head = doc.createElement("head"),
          html = doc.createElement("html")
      ;
      html.setAttribute("lang", "en-US");
      html.appendChild(body);
      html.insertBefore(head, html.firstChild);
      doc.appendChild(html);

      // ** Create some specifics for this implementation
      var meta = doc.createElement("meta");
      meta.setAttribute("http-equiv", "Content-Type");
      meta.setAttribute("content", "text/html; charset=UTF-8");
      head.appendChild(meta);

      var nodeStyle = doc.createElement("style");
      nodeStyle.setAttribute("type", "text/css");
      nodeStyle.textContent = aData;
      head.appendChild(nodeStyle);

      var css = [];
      if (doc.styleSheets && doc.styleSheets.length) {
        for (var rule = 0, styleSheet = doc.styleSheets[0], rules = doc.styleSheets[0].cssRules.length; rule < rules ; rule++)
          css.push(styleSheet.cssRules[rule].cssText);

        return (css.length) ? css.join(aSpace) : "";
      }

      return aData;
    }

    function onDOMContentLoaded(ev, aObject) {
      if (typeof aObject.data == "undefined")
        aObject.data = "";

      if (typeof aObject.space == "undefined")
        aObject.space = "\n";

      if (typeof aObject.data == "xml")
        aObject.data = aObject.data.toString();

      if (typeof aObject.media == "xml")
        aObject.media = aObject.media.toString();

      if (typeof aObject.node == "undefined") {
        var nodeStyle = document.createElement("style");
        nodeStyle.setAttribute("type", "text/css");
        if (aObject.media)
          nodeStyle.setAttribute("media", aObject.media);
        nodeStyle.textContent = validateCSS(aObject.data, aObject.space);

        var headNode = document.documentElement.firstChild;
        while (headNode && headNode.nodeName != "HEAD")
          headNode = headNode.nextSibling;

        if (headNode && headNode.nodeName == "HEAD")
          headNode.appendChild(nodeStyle);
        else
          document.body.insertBefore(nodeStyle, document.body.firstChild);

        if (aObject.callback) {
          aObject.data = nodeStyle.textContent;
          aObject.node = nodeStyle;
          aObject.callback();
        }
        return nodeStyle;
      }
      else if (aObject.node !== null && aObject.node.nodeName == "STYLE") {
        aObject.node.textContent = validateCSS(
            aObject.node.textContent + aObject.space + aObject.data, aObject.space
        );

        if (aObject.callback) {
          aObject.data = aObject.node.textContent;
          aObject.callback();
        }
        return aObject.node;
      }
      else {
        var cssText = validateCSS(aObject.data, aObject.space);
        if (aObject.callback) {
          aObject.data = cssText;
          aObject.callback();
        }
        return cssText;
      }
    }

    if (window.document && window.document.documentElement || aObject.node === null)
      return onDOMContentLoaded(null, aObject);
    else
      window.addEventListener("DOMContentLoaded", function(ev) { onDOMContentLoaded(ev, aObject); }, false);

    return undefined;
  }
