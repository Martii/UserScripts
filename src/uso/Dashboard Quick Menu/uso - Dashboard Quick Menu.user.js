(function() {

// ==UserScript==
// @name          uso - Dashboard Quick Menu
// @namespace     http://userscripts.org/users/37004
// @description   Enables user dropdown menu
// @copyright     2011+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @icon          http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=48&default=identicon
// @version       0.1.1
// @include http://userscripts.org/*
// @include https://userscripts.org/*
// @require http://usocheckup.redirectme.net/105402.js?method=install&open=window&maxage=1&custom=yes&topicid=77715&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

/*

CHANGELOG
=========
http://userscripts.org/topics/77715

Please note this script uses native JSON and native classList which requires Firefox 3.6.x+

*/

  // Initialize the menu
  if (window.location.pathname == "/home") {
    let menu = {}, xpr = document.evaluate(
    "//ul[@class='subnav']//li[@class='menu']/a",
    document.body,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
    );
    if (xpr) {
      for (let i = 0, thisNode; thisNode = xpr.snapshotItem(i++);)
        menu[thisNode.textContent] = thisNode.pathname;

      GM_setValue(":/home", JSON.stringify(menu));
    }
  }

  // Attach the menu
  let xpr = document.evaluate(
    "//ul[@class='login_status']//a[@href='/home']",
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  if (xpr && xpr.singleNodeValue) {
    let thisNode = xpr.singleNodeValue.parentNode;

    function onmouseover(ev) {
      let divNode = document.getElementById("menu-home");
      if (divNode)
        divNode.classList.remove("hide");
    }

    function onmouseout(ev) {
      let divNode = document.getElementById("menu-home");
      if (divNode)
        divNode.classList.add("hide");
    }

    thisNode.addEventListener("mouseover", onmouseover, false);
    thisNode.addEventListener("mouseout", onmouseout, false);

    GM_addStyle(<><![CDATA[
      #top ul.login_status>li { margin-bottom: 0 !important; }
      #top ul.login_status>li>a { padding-bottom: 24px; }

      div.menu- { background-color: #ff7c00; margin: 0; padding: 0; position: fixed; z-index: 1; margin-left: -1.5em; }
      div.menu- ul { margin: 0; list-style: none outside none; }
      div.menu- ul li { float: none !important; margin: 0 !important; padding-left: 1.5em; padding-right: 1.5em; background: #ff7c00 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAZCAQAAABamYz0AAAAAXNSR0IArs4c6QAAAB5JREFUCNdjuOfAxPCPieEvDP1D4v5DIv/iEEcIAgClTRkR4R/Z1AAAAABJRU5ErkJggg==) repeat-x scroll left top; }
      .hide { display: none; }

    ]]></> + '');

    let ulNode = document.createElement("ul");

    let menu = JSON.parse(GM_getValue(":/home", "{}"));
    for (let item in menu) {
      let aNode = document.createElement("a");
      aNode.textContent = item;
      aNode.href = menu[item];

      let liNode = document.createElement("li");
      liNode.appendChild(aNode);

      ulNode.appendChild(liNode);
    }

    let divNode = document.createElement("div");
    divNode.id = "menu-home";
    divNode.className = "menu-";
    divNode.classList.add("hide");

    divNode.appendChild(ulNode);
    thisNode.appendChild(divNode);
  }

})();
