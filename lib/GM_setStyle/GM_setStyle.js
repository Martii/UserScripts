// ==UserScript==
// @name          GM_addGlobalStyle
// @namespace     http://userscripts.org/users/37004
// @description   Alternative to GM_addStyle for Greasemonkey
// @copyright     2011+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version       0.0.5
// @icon          http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=48&default=identicon
//
// @exclude   *
// ==/UserScript==


  function GM_addGlobalStyle(details) {
    if (typeof details.data == "undefined")
      details.data = "";

    if (typeof details.data == "xml")
      details.data = details.data.toString();

    if (typeof details.media == "xml")
      details.media = details.media.toString();

    // ** Local helper function
    function cssText(aOwnedDoc, aSpace, aDefault) {
      let css = [];
      if (aOwnedDoc.styleSheets && aOwnedDoc.styleSheets.length) {
        for (let sheet = 0, sheets = aOwnedDoc.styleSheets.length; sheet < sheets; sheet++) {
          let styleSheet = aOwnedDoc.styleSheets[sheet];
          for (let rule = 0, rules = styleSheet.cssRules.length; rule < rules ; rule++)
            css.push(styleSheet.cssRules[rule].cssText);
        }
        return (css.length) ? css.join((aSpace) ? aSpace : " ") : "";
      }
      return aDefault;
    }

    // ** Create document.implementation for sanitizing
    let
      dt = document.implementation.createDocumentType("html", "", ""),
      doc = document.implementation.createDocument("", "", dt)
    ;

    // ** Create core html5 document implementation
    let body = doc.createElement("body");

    let head = doc.createElement("head");

    let html = doc.createElement("html");
    html.setAttribute("lang", "en-US");

    html.appendChild(body);
    html.insertBefore(head, html.firstChild);

    doc.appendChild(html);

    // ** Create some specifics for this implementation
    let meta = doc.createElement("meta");
    meta.setAttribute("http-equiv", "Content-Type");
    meta.setAttribute("content", "text/html; charset=UTF-8");

    head.appendChild(meta);

    let style = doc.createElement("style");
    head.appendChild(style);

    // ** Start twiddling with real document
    if (details.node && details.node.nodeName == "STYLE") {
      style.textContent = details.node.textContent + " " + details.data;
      details.node.textContent = cssText(doc, details.space, details.node.textContent + " " + details.data);
      return details.node;
    }

    style.textContent = details.data;

    if (typeof details.node == "undefined") {
      let styleNode = document.createElement("style");
      styleNode.setAttribute("type", "text/css");
      if (details.media)
        styleNode.setAttribute("media", details.media);
      styleNode.textContent = cssText(doc, details.space, details.data);

      let headNode = document.documentElement.firstChild;
      while (headNode && headNode.nodeName != "HEAD")
        headNode = headNode.nextSibling;

      if (headNode && headNode.nodeName == "HEAD")
        headNode.appendChild(styleNode);
      else
        document.body.insertBefore(styleNode, document.body.firstChild);

      return styleNode;
    }
    else
      return cssText(doc, details.space, details.data);
  }
