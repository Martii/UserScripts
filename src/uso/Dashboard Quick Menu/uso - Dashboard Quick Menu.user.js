(function() {

// ==UserScript==
// @name          uso - Dashboard Quick Menu
// @namespace     http://userscripts.org/users/37004
// @description   Enables user dropdown menu
// @copyright     2011+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @icon          http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=48&default=identicon
// @version       0.0.2
// @include http://userscripts.org/*
// @include https://userscripts.org/*
// @require http://usocheckup.redirectme.net/105402.js?method=install&open=window&maxage=1&custom=yes&topicid=77715&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  // Common function
  function addClass(thisNode, thisValue) {
    let c = thisNode.getAttribute("class");
    let re = new RegExp("\\b" + thisValue + "\\b");
    if (!c)
      thisNode.setAttribute("class", thisValue);
    else if (!c.match(re))
      thisNode.setAttribute("class", c + " " + thisValue);
  }

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

    function onmouseover() {
      GM_addStyle(<><![CDATA[
        #top div.menu-home { display: block; }
      ]]></> + "");
    }

    function onmouseout() {
      GM_addStyle(<><![CDATA[
        #top div.menu-home { display: none; }
      ]]></> + "");
    }

    thisNode.addEventListener("mouseover", onmouseover, false);
    thisNode.addEventListener("mouseout", onmouseout, false);

    GM_addStyle(<><![CDATA[

      #top ul.login_status li {
        margin: 0;
        padding-bottom: 0.25em;
      }

      #top ul.login_status li a {
        padding-bottom: 0.75em;
        padding-left: 1.5em;
        padding-right: 0.5em;
      }

      #top div.menu-home {
        background-color: #f80;
        display: none;
        margin: 0;
        position: fixed;
        z-index: 1;
      }

      #top div.menu-home ul {
        margin: 0;
      }

      #top div.menu-home ul li {
        background:  #f80 url(/images/fade_bg_comment.png) repeat-x scroll center bottom;
        display: block;
        float: none !important;
        margin: 0;
        padding-right: 1em;
        padding-top: 0.25em;
        white-space: nowrap;
      }

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
    addClass(divNode, "menu-home");
    divNode.addEventListener("mouseover", onmouseover, false);
    divNode.addEventListener("mouseout", onmouseout, false);

    divNode.appendChild(ulNode);

    thisNode.appendChild(divNode);
  }

})();
