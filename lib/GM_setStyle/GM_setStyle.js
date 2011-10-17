// ==UserScript==
// @name          GM_addGlobalStyle
// @namespace     http://userscripts.org/users/37004
// @description   Alternative to GM_addStyle for Greasemonkey
// @copyright     2011+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version       0.0.7
// @icon          http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=48&default=identicon
//
// @exclude   *
// ==/UserScript==

  function GM_addGlobalStyle(aObject) {
    // **
    function validateCSS(aCss, aSpace) {
      // ** Create a core html5 document implementation for sanitizing
      let dt = document.implementation.createDocumentType("html", "", ""),
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
      let meta = doc.createElement("meta");
      meta.setAttribute("http-equiv", "Content-Type");
      meta.setAttribute("content", "text/html; charset=UTF-8");
      head.appendChild(meta);

      let style = doc.createElement("style");
      style.setAttribute("type", "text/css");
      style.textContent = aCss;
      head.appendChild(style);

      let css = [];
      if (doc.styleSheets && doc.styleSheets.length) {
        for (let rule = 0, styleSheet = doc.styleSheets[0], rules = doc.styleSheets[0].cssRules.length; rule < rules ; rule++)
          css.push(styleSheet.cssRules[rule].cssText);
        return (css.length) ? css.join((aSpace) ? aSpace : "\n") : "";
      }
      return aCss;
    }

    if (typeof aObject.data == "undefined")
      aObject.data = "";

    if (typeof aObject.data == "xml")
      aObject.data = aObject.data.toString();

    if (typeof aObject.media == "xml")
      aObject.media = aObject.media.toString();

    if (aObject.node && aObject.node.nodeName == "STYLE") {
      aObject.node.textContent = validateCSS(
          aObject.node.textContent + ((aObject.space) ? aObject.space : "\n") + aObject.data, aObject.space
      );
      return aObject.node;
    }
    else if (typeof aObject.node == "undefined") {
      let styleNode = document.createElement("style");
      styleNode.setAttribute("type", "text/css");
      if (aObject.media)
        styleNode.setAttribute("media", aObject.media);
      styleNode.textContent = validateCSS(aObject.data, aObject.space);

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
      return validateCSS(aObject.data, aObject.space);
  }
