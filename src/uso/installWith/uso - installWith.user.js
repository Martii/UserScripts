(function () {
  "use strict";

// ==UserScript==
// @name          uso - installWith
// @namespace     http://userscripts.org/users/37004
// @description   Adds option to install script with an icon and/or updater plus the original security advisory. "So easy, a cavemonkey can do it"
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       2.0.0.1
// @icon          https://s3.amazonaws.com/uso_ss/icon/68219/large.png

// @include /^https?://userscripts.org/?$/
// @include /^https?://userscripts\.org/scripts/
// @include /^https?://userscripts\.org/topics//
// @include /^https?://userscripts\.org/reviews//
// @include /^https?://userscripts\.org/users/\.*?/scripts/
// @include /^https?://userscripts\.org/users/\.*?/favorites/
// @include /^https?://userscripts\.org/groups/\d+/scripts/
// @include /^https?://userscripts\.org/tags//
// @include /^https?://userscripts\.org/home/(?:scripts|favorites)/

// @include http://userscripts.org/
// @include http://userscripts.org/scripts*
// @include http://userscripts.org/topics/*
// @include http://userscripts.org/reviews/*
// @include http://userscripts.org/users/*/scripts*
// @include http://userscripts.org/users/*/favorites*
// @include http://userscripts.org/groups/*/scripts*
// @include http://userscripts.org/tags/*
// @include http://userscripts.org/home/scripts*
// @include http://userscripts.org/home/favorites*

// @include https://userscripts.org/
// @include https://userscripts.org/scripts*
// @include https://userscripts.org/topics/*
// @include https://userscripts.org/reviews/*
// @include https://userscripts.org/users/*/scripts*
// @include https://userscripts.org/users/*/favorites*
// @include https://userscripts.org/groups/*/scripts*
// @include https://userscripts.org/tags/*
// @include https://userscripts.org/home/scripts*
// @include https://userscripts.org/home/favorites*


// @exclude /^https?://userscripts\.org/scripts/diff/.*/
// @exclude /^https?://userscripts\.org/scripts/version/.*/

// @exclude http://userscripts.org/scripts/diff/*
// @exclude http://userscripts.org/scripts/version/*

// @exclude https://userscripts.org/scripts/diff/*
// @exclude https://userscripts.org/scripts/version/*

// @updateURL   file:
// @installURL  file:
// @downloadURL file:

// @resource icon https://s3.amazonaws.com/uso_ss/icon/68219/large.png
// @resource gmc  https://s3.amazonaws.com/uso_ss/9849/large.png
// @resource usoc https://s3.amazonaws.com/uso_ss/1359/large.png
// @resource uso  http://s3.amazonaws.com/uso_ss/7996/large.png

// @resource list http://beta.usocheckup.dune.net/res/list.json

// @require https://secure.dune.net/usocheckup/68219.js?method=update&open=window&maxage=1&custom=yes&topicid=45479&id=usoCheckup
// @require https://userscripts.org/scripts/source/61794.user.js
// @require https://userscripts.org/scripts/source/115323.user.js
// @require https://raw.github.com/Martii/GM_config/a0d0066ffaefb5fbb3402c3d46ac705e8b4124d8/gm_config.js

// @grant GM_addStyle
// @grant GM_deleteValue
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_getValue
// @grant GM_log
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_xmlhttpRequest

// ==/UserScript==

  if (!document || !document.body || location.hash == "#posts-last")
    return;

  const
      gTHIS = this,
      gJSE = !!(typeof window.wrappedJSObject == "object" && typeof window.wrappedJSObject.jQuery == "function"),

      gPROTOCOL = location.protocol,
      gHOSTNAME = location.hostname,
      gPATHNAME = location.pathname,
      gISHOMEPAGE = /^\/scripts\/show\//.test(gPATHNAME),
      gHASH = location.hash,
      gCSS = GM_setStyle({
          media: "screen, projection",
          data: ".hid { display: none; } .HID { display: none !important }"
      }),
      gUAC = !!document.body.querySelector(".alt_topbottom"),
      gHALT404 = true,
      gRETRIES = 4,
      gDELAYRETRYMIN = 3000,
      gDELAYRETRYMAX = 8000,
      gGROUPS = JSON.parse(GM_getResourceText("list"))
  ;

  let
      gANODES,
      gQNODES,
      gIdle = true,
      gISFRAMELESS = false
  ;

  try {
    gISFRAMELESS = (window == window.top);
  }
  catch (e) {}

  /**
   *
   */
  function init() {

    gANODES = document.body.querySelectorAll(".script-meat, .userjs");
    gQNODES = [];

    /** Initial gCSS fix for tagging **/ // NOTE: This fix may be different in later FF versions
    GM_setStyle({
      node: gCSS,
      data:
        [
          "th { border-bottom-style: none; }"

        ].join("\n")
    });

    if (/(^\/users\/.*?\/(?:scripts|favorites)|^\/home\/(?:scripts|favorites))/.test(gPATHNAME) || (/^\/$/.test(gPATHNAME)) && gUAC)
      GM_setStyle({
        node: gCSS,
        data:
          [
            "#main th:first-child, #content th:first-child { border-left-width: 10px; padding-left: 7px; }",
            "table.forums tr td.script-meat { background-color: #eee; border-left: 10px solid #eee; }"

          ].join("\n")
      });
    else if (/^\/groups\/\d+\/scripts/.test(gPATHNAME))
      GM_setStyle({
        node: gCSS,
        data:
          [
            "#main th:first-child, #content th:first-child { border-right-width: 10px; padding-left: 7px; }",
            "table.forums tr td.script-meat { background-color: #eee; border-left: 10px solid #eee; }"

          ].join("\n")
      });
    else
      GM_setStyle({
        node: gCSS,
        data:
          [
            "#main th:first-child, #content th:first-child { padding-left: 16px; }",
            "table.forums tr td.script-meat { background-color: #eee; border-left: 18px solid #eee; }"

          ].join("\n")
      });

    GM_setStyle({
      node: gCSS,
      data:
        [
          "table.forums tr td.script-meat { background-color: #eee; border-left-color: #eee; }",
          "#install_script a.userjs { background: #ccc no-repeat scroll 0 0; border: 1px solid #ddd; border-left: 10px solid #888; border-radius: 0.25em; }",
          "#install_script a.userjs:hover { background: #ccc no-repeat scroll 0 0; }",

          "table.forums tr td.saU, #install_script a.saU { background-color: #ccc; border-left-color: #aaa; }",
          "table.forums .actions { float: right; font-size: 0.8em; }",
          "table.forums .actions .unhide { color: #aaa; }",

          "table.forums tr td.saEMBED, #install_script a.saEMBED { background-image: linear-gradient(to left, #888, rgba(136,136,136,0)) !important; }",

          "table.forums tr td.saXCLUDE, #install_script a.saXCLUDE { background: #fff none repeat scroll 0 0; color: #000; }",
          "#install_script a.saXCLUDE:hover { background: #fff none repeat scroll 0 0; color: #000; }",
          "table.forums tr td.sabXCLUDE, #install_script a.sabXCLUDE { border-left-color: #ddd; }",

          "table.forums tr td.saLOW, #install_script a.saLOW { background: #d6efc2 repeat scroll 0 0; }",
          "#install_script a.saLOW:hover { background: #d6efc2 repeat scroll 0 0; }",
          "table.forums tr td.sabLOW, #install_script a.sabLOW { border-left-color: #b0d813; }",

          "table.forums tr td.saGUARD, #install_script a.saGUARD { background: #d5edf8 repeat scroll 0 0; }",
          "#install_script a.saGUARD:hover { background: #d5edf8 repeat scroll 0 0; }",
          "table.forums tr td.sabGUARD, #install_script a.sabGUARD { border-left-color: #92cae4; }",

          "table.forums tr td.saELEVATE, #install_script a.saELEVATE, table tr.unlisted { background: #fbfad5 repeat scroll 0 0; }",
          "#install_script a.saELEVATE:hover { background: #fbfad5 repeat scroll 0 0; }",
          "table.forums tr td.sabELEVATE, #install_script a.sabELEVATE { border-left-color: #fbf700; }",

          "table.forums tr td.saHIGH, #install_script a.saHIGH { background: #fbe5b0 repeat scroll 0 0; }",
          "#install_script a.saHIGH:hover { background: #fbe5b0 repeat scroll 0 0; }",
          "table.forums tr td.sabHIGH, #install_script a.sabHIGH { border-left-color: #fbbf5d; }",

          "table.forums tr td.saSEVERE, #install_script a.saSEVERE { background: #fbe3e4 repeat scroll 0 0; }",
          "#install_script a.saSEVERE:hover { background: #fbe3e4 repeat scroll 0 0; }",
          "table.forums tr td.sabSEVERE, #install_script a.sabSEVERE { border-left-color: #fb7e83; }",

          "table.forums tr td.sabABORT, #install_script a.saABORT { background: #000 none repeat scroll 0 0; color: #fff; }",
          "#install_script a.saABORT:hover { background: #000 none repeat scroll 0 0; color: #fff; }",

          "@-moz-keyframes saB { from { background: #888; } to { background: #fff; } }",
          ".saB { background: transparent none repeat scroll 0 0; -moz-animation: 1.5s ease 0s alternate none infinite saB !important; }"

      ].join("\n")
    });


    if (!gJSE) {
      let contentNode = document.getElementById("content");
      if (contentNode) {
        let nodeA = document.createElement("a");
        nodeA.href = "/scripts/show/68219";
        nodeA.textContent = "installWith";

        let nodeSpan = document.createElement("span");
        nodeSpan.textContent = "Enabling this sites JavaScript is highly recommended to improve the experience with ";

        let nodeP = document.createElement("p");
        nodeP.classList.add("notice");
        nodeP.classList.add("info");

        nodeSpan.appendChild(nodeA);
        nodeSpan.appendChild(document.createTextNode("."));
        nodeP.appendChild(nodeSpan);

        if (/^\/users\/\d+\/scripts/.test(gPATHNAME))
          contentNode.parentNode.insertBefore(nodeP, contentNode);
        else
          contentNode.insertBefore(nodeP, contentNode.firstChild);
      }
    }

    addEventListener("resize", onViewportChange, false);
    addEventListener("scroll", onViewportChange, false);
    onViewportChange();
  }

  /**
   *
   */
  function firstValueOf(aMb, aKey, aPrefix) {
    if (aPrefix) {
      if (aMb[aPrefix] && aMb[aPrefix][aKey])
        return ((typeof aMb[aPrefix][aKey] == "string") ? aMb[aPrefix][aKey] : aMb[aPrefix][aKey][0]);
    }
    else {
      if (aMb[aKey])
        return ((typeof aMb[aKey] == "string") ? aMb[aKey] : aMb[aKey][0]);
    }

    return undefined;
  }

  /**
   *
   */
  function lastValueOf(aMb, aKey, aPrefix) {
    if (aPrefix) {
      if (aMb[aPrefix] && aMb[aPrefix][aKey])
        return ((typeof aMb[aPrefix][aKey] == "string") ? aMb[aPrefix][aKey] : aMb[aPrefix][aKey][aMb[aPrefix][aKey].length - 1]);
    }
    else {
      if (aMb[aKey])
        return ((typeof aMb[aKey] == "string") ? aMb[aKey] : aMb[aKey][aMb[aKey].length - 1]);
    }

    return undefined;
  }

  /**
   *
   */
  function toArray(aName, aMb) {
    if (aMb) {
      if (aMb[aName])
        return Array.isArray(aMb[aName]) ? aMb[aName] : [aMb[aName]];
    }
    else
      return [aName];

    return undefined;
  }

  /**
   *
   */
  function parseMeta(aString) {
    aString = aString.toString();
    let
        re = /\/\/ @(\S+)(?:\s+(.*))?/,
        headers = {},
        name, prefix, header, key, value,
        lines = aString.split(/[\r\n]+/).filter(function (e, i, a) {
          return (e.match(re));
        })
    ;
    for (let i = 0, line; line = lines[i++];) {
      [, name, value] = line.replace(/\s+$/, "").match(re);
      switch (name) {
        case "licence":
          name = "license";
          break;
      }
      [key, prefix] = name.split(/:/).reverse();
      if (key) {
        if (prefix) {
          if (!headers[prefix])
            headers[prefix] = new Object;
          header = headers[prefix];
        }
        else
          header = headers;

        if (header[key]) {
          if (!Array.isArray(header[key]))
            header[key] = new Array(header[key]);
          header[key].push(value || "");
        }
        else
          header[key] = value || "";
      }
    }
    if (headers["license"])
      headers["licence"] = headers["license"];

    return (headers.toSource() != "({})") ? headers : undefined;
  }

  /**
   *
   */
  function isViewing(thisNode) {
    if (!thisNode || thisNode.nodeType !== 1)
      return false;

    if (!gJSE)
      return true; /** Work-around for !javascript.enabled issue **/

    let html, rect;
    html = document.documentElement;
    rect = thisNode.getBoundingClientRect(); // BUG: Needs gJSE to return meaningful values on FF 20+?

    return (
      !!rect
      && rect.top <= html.clientHeight
      && rect.right >= 0
      && rect.bottom >= 0
      && rect.left <= html.clientWidth
    );
  }

  /**
   *
   */
  function addToQspList(aQsp, aItem) {
    if (aItem)
      aQsp += (!aQsp) ? aItem : "," + aItem;
    return aQsp;
  }

  /**
   *
   */
  function appendToQs(aQs, aQsp) {
    if (aQsp)
      aQs += (!aQs) ? "?" + aQsp : "&" + aQsp;
    return aQs;
  }

  /**
   *
   */
  function nag(ev) {
    ev.preventDefault();

    if (!gmcHome.get("skipVerifyExclusion"))
      if (confirm('Are you sure?'))
        if (confirm('Are you really sure?'))
          if(confirm('Are you really, really sure?\n\nLast chance before impending doom.')) {
            ev.target.removeEventListener("click", nag, false);
            ev.target.click();
          }
  }

  /**
   *
   */
  function pingCount(ev) {
    let matches = ev.target.pathname.match(/(\d+)(?:\/\d+)?\.user\.js$/)
    if (matches) {
      let scriptId;
      [, scriptId] = matches;

      GM_xmlhttpRequest({
        retry: 5,
        url: "http" + ((/^https:$/i.test(gPROTOCOL) || gmcHome.get("forceInstallSecure")) ? "s" : "") + "://userscripts.org/scripts/source/" + scriptId + ".user.js",
        method: "HEAD",
        onload: function(aR) {
          switch(aR.status) {
            case 403:
              console.warn('Recently unlisted script');
              break;
            case 404:
              if (gHALT404)
                this._retry = 0;
            case 500:
            case 502:
            case 503:
              if (this.retry-- > 0)
                setTimeout(GM_xmlhttpRequest, gDELAYRETRYMIN + Math.round(Math.random() * (gDELAYRETRYMAX - gDELAYRETRYMIN)), this); // NOTE: Detached
              else
                console.warn('Unable to increment script count for update method: ' + xhr.status);
              break;
            case 200:
              break;
          }
        }
      });

    }
  }
  /**
   *
   */
  function create(aNode, aScriptId, aMb, aProviders, aKU, aUsoCMethod) {

    let thisNode = aNode.parentNode;

    let userjsNode = thisNode.querySelector(".userjs");
    if (!userjsNode)
      return;

    GM_setStyle({
      node: gCSS,
      data:
        [
          "#install_script .userjs { font-size: 1.1em !important; }",
          "#install_script a.helpWith {",
          "  background: #5173d9 linear-gradient(to bottom, #92cae4, rgba(213,237,248,0)) repeat scroll 0 0;",
          "  border: 1px solid #999;",
          "  -moz-border-radius: 1em;",
          "  border-radius: 1em;",
          "  color: #fff;",
          "  float: right;",
          "  font-weight: bold;",
          "  height: 1.5em;",
          "  margin-top: 6px;",
          "  text-decoration: none;",
          "  width: 1.4em;",
          "}",
          "#install_script a.helpWith:hover { background: #ddd; }",
          "#install_script select.updateWith { height: 24px; font-size: 0.9em; width: 88%; border: 3px solid #888; }",
          "#install_script select.updateWith option.separator { border-top: thin dotted #666; }",
          "#install_script select.updateWith img { background: none no-repeat scroll center center transparent; height: 16px; margin: 0.25em 0.25em 0.25em 0; vertical-align: middle; width: 16px; }",
          "#install_script select.updateWith img.indent { margin-left: 0.6em; }"

        ].join("\n")
    });

    userjsNode.textContent = userjsNode.textContent + " with";

    let helpNode = thisNode.querySelector(".help");
    helpNode.classList.add("helpWith");
    helpNode.textContent = "?";

    let nodeImg = document.createElement("img");
    nodeImg.src = GM_getResourceURL("uso");

    let nodeText = document.createTextNode("userscripts.org (default)");

    let nodeOption = document.createElement("option");
    nodeOption.value = "uso";
    nodeOption.title = "Use native provider";

    let nodeSelect = document.createElement("select");
    nodeSelect.id = "provider_id";
    nodeSelect.classList.add("updateWith");
    nodeSelect.addEventListener("change", function (ev) {
      if (aKU)
        gmc.set("providerPref1", this.value);
      else
        gmc.set("providerPref2", this.value);

      gmc.write();

      switch (this.value) {
        case "uso":
          aNode.removeEventListener("click", pingCount, false);

          if (gISHOMEPAGE)
            gmc.close();

          aNode.href = "/scripts/source/" + aScriptId + ".user.js";
          if (gmcHome.get("forceInstallSecure"))
             aNode.protocol = "https:";

          if (gmcHome.get("forceInstallRecent")) {
            aNode.pathname = aNode.pathname
                .replace(/\/source\//, "/version/")
                .replace(/(\.user\.js)$/, "/" + lastValueOf(aMb, "version", "uso") + "$1");

            aNode.addEventListener("click", pingCount, false);
          }

          break;
        default:
          aNode.removeEventListener("click", pingCount, false);

          if (gISHOMEPAGE)
            gmc.close();

          let thisProvider, sname, qs, max, min;
          for (let i = 0, thisProvider; thisProvider = aProviders[i++];) {
            [,,,,, sname,, qs, max, min] = thisProvider;
            if (sname == this.value)
              break;
          }

          let origin, mirrorDomain = gmcHome.get("mirrorDomain"), useSSL = (mirrorDomain == "secure");
            if (this.value == "usoCB")
              origin =  "http://beta.usocheckup.dune.net";
            else {
              if (useSSL)
                origin = "https://secure.dune.net";
              else if (mirrorDomain == "primary")
                origin = "http://usocheckup.dune.net";
              else
                origin = "http://usocheckup.redirectme.net";
            }

          let pathname = (useSSL ? "/usocheckup/" : "/") + aScriptId + ".user.js";

          let search = "";
            search = appendToQs(search, /^usoC/.test(this.value) ? "": "updater=" + this.value);
            search = appendToQs(search, max ? max + "=" + gmc.get("updaterMaxage") : "");

            if (min && gmc.get("updaterMinage") != "1")
              search = appendToQs(search, min ? min + "=" + gmc.get("updaterMinage") : "");

            if (gmcHome.get("allowAOU"))
              search = appendToQs(search, "allow=aou");

            search = appendToQs(search, qs.replace(/\$1/, aScriptId));

            let
                atUsoAvatar = lastValueOf(aMb, "avatar", "uso"),
                atUsoIcontype = lastValueOf(aMb, "icontype", "uso"),
                iconQspList = ""
            ;
            iconQspList = addToQspList(iconQspList, atUsoAvatar);

            if (true && atUsoIcontype)
              iconQspList = addToQspList(iconQspList, atUsoIcontype);

            if (iconQspList)
              search = appendToQs(search, "icon=" + (gmc.get("useGravatarIcon") || gmc.get("useScriptIcon") ? "1," : "0,") + iconQspList);

          let hash = "#.user.js";

          aNode.href = origin + pathname + search + hash;

          /** Finish up gmc **/
          if (gISFRAMELESS && gISHOMEPAGE) {
            gmc.fields["useGravatarIcon"].settings.label = "<img style='margin-right: 0.5em;' src='" + (/^https:$/i.test(gPROTOCOL) ? "https://secure" : "http://www") + ".gravatar.com/avatar.php?gravatar_id=" + atUsoAvatar + "&r=pg&s=48&default=identicon' alt='Use this authors gravatar when available if not present' title='Use this authors gravatar when available if not present' />";
            gmc.fields["useScriptIcon"].settings.label = "<img src='" + gPROTOCOL + "//s3.amazonaws.com/uso_ss/icon/" + aScriptId + "/large." + atUsoIcontype + "'  alt='Favor this scripts USO icon when available if not present' title='Favor this scripts USO icon when available if not present'/>";

            gmc.open();

            if (max)
              gmc.fields["updaterMaxage"].node.parentNode.classList.remove("hid");
            else
              gmc.fields["updaterMaxage"].node.parentNode.classList.add("hid");

            if (min)
              gmc.fields["updaterMinage"].node.parentNode.classList.remove("hid");
            else
              gmc.fields["updaterMinage"].node.parentNode.classList.add("hid");

            if (/^usoC/.test(this.value)) {
              switch (this.value) {
                case "usoCOS":
                case "usoCbU":
                  gmc.fields["indirectMethod"].node.parentNode.classList.add("hid");
                  gmc.fields["directMethod"].node.parentNode.classList.add("hid");
                  break;
                case "usoCM":
                  if (aUsoCMethod) {
                    gmc.fields["indirectMethod"].node.parentNode.classList.add("hid");
                    gmc.fields["directMethod"].node.parentNode.classList.add("hid");
                  }
                  else {
                    gmc.fields["directMethod"].node.parentNode.classList.remove("hid");
                    gmc.fields["indirectMethod"].node.parentNode.classList.add("hid");
                  }
                  break;
                case "usoCOI":
                  gmc.fields["indirectMethod"].node.parentNode.classList.add("hid");
                  gmc.fields["directMethod"].node.parentNode.classList.remove("hid");
                  break;
                default:
                  gmc.fields["indirectMethod"].node.parentNode.classList.remove("hid");
                  gmc.fields["directMethod"].node.parentNode.classList.add("hid");
                  break;
              }
            }
            else {
              gmc.fields["indirectMethod"].node.parentNode.classList.add("hid");
              gmc.fields["directMethod"].node.parentNode.classList.add("hid");
            }
          }

          if (/^usoC/.test(this.value)) {
            switch (this.value) {
              case "usoCOS":
              case "usoCbU":
                aNode.search = aNode.search.replace(/method\=(?:show|install|update)/i, "method=show");
                break;
              case "usoCM":
                if (aUsoCMethod)
                  aNode.search = aNode.search.replace(/method\=(?:show|install|update)/i, "method=" + aUsoCMethod);
                else
                  aNode.search = aNode.search.replace(/method\=(?:show|install|update)/i, "method=" + gmc.get("directMethod"));

                if (/method\=update/.test(aNode.search))
                  aNode.addEventListener("click", pingCount, false);
                break;
              case "usoCOI":
                aNode.search = aNode.search.replace(/method\=(?:show|install|update)/i, "method=" + gmc.get("directMethod"));

                if (gmc.get("directMethod") == "update")
                  aNode.addEventListener("click", pingCount, false);
                break;
              default:
                aNode.search = aNode.search.replace(/method\=(?:show|install|update)/i, "method=" + gmc.get("indirectMethod"));

                if (gmc.get("directMethod") == "update")
                  aNode.addEventListener("click", pingCount, false);
                break;
            }
          }
          break;
      }
    }, false);

    nodeOption.appendChild(nodeImg);
    nodeOption.appendChild(nodeText);
    nodeSelect.appendChild(nodeOption);

    for (let i = 0, thisProvider; thisProvider = aProviders[i++];) {
      let stock, indent, icon, lname, separator, sname, tooltip;
      [stock, indent, icon, lname, separator, sname, tooltip] = thisProvider;

      nodeText = document.createTextNode(lname);

      nodeImg = document.createElement("img");
      nodeImg.src = /^http/.test(icon) ? icon : (/^https:$/i.test(gPROTOCOL) ? "https://secure" : "http://www") + ".gravatar.com/avatar/" + icon + "?r=PG&s=92&default=identicon";
      if (indent)
        nodeImg.classList.add("indent");

      nodeOption = document.createElement("option");
      nodeOption.value = sname;
      nodeOption.title = tooltip;
      if (separator)
        nodeOption.classList.add("separator");

      nodeOption.appendChild(nodeImg);
      nodeOption.appendChild(nodeText);

      if (stock)
        nodeSelect.insertBefore(nodeOption, nodeSelect.firstChild.nextSibling); // NOTE: Reversed order
      else if (!aKU)
        nodeSelect.appendChild(nodeOption);
    }

    thisNode.insertBefore(nodeSelect, helpNode);

    let providerPreference;

    if (aKU)
      providerPreference = gmc.get("providerPref1");
    else
      providerPreference = gmc.get("providerPref2");

    for (let i = 0, thatNode; thatNode = nodeSelect.options[i]; ++i)
      if (thatNode.value == providerPreference) {
        nodeSelect.selectedIndex = i;
        break;
      }

    let ev = new CustomEvent("change");
    nodeSelect.dispatchEvent(ev);
  }

  /**
   *
   */
  function advise(aSa, aNode, aEmbed, aReduce) {
    let
      title,
      max,
      advisories =
        [
          "ABORT",
          "SEVERE",
          "HIGH",
          "ELEVATE",
          "GUARD",
          "LOW",
          "EMBED",
          "XCLUDE"
        ]
    ;

    advisories.forEach(function (e, i, a) {
      if (aSa[e]) {
        if (!max)
          max = e;

        if (!title)
          title = e + ":";
        else
          title += "\n" + e + ":";

        title += "\n  " + aSa[e].join("\n  ");
      }
    });

    if (max) {
      if (aEmbed)
        aNode.classList.add("saEMBED");

      aNode.classList.add("sa" + max);
      aNode.classList.add("sab" + max);
    }

    if (title)
      aNode.title = title;
    else
      aNode.title = "UNDETERMINED";

    /** Sidebar **/
    if (gISHOMEPAGE) {
      let hookNode = document.getElementById("script_sidebar");
      if (hookNode) {

        GM_setStyle({
          node: gCSS,
          data:
            [
              "#script_sidebar h7 { display: block; font-weight: bold; }",
              "#script_sidebar h7 dl { margin-bottom: 0; font-size: 0.9em; }",
              "#script_sidebar h7 dt { font-weight: bold; padding: 0.25em 0.5em 0.5em 0.66em;  }",
              "#script_sidebar h7 dd { font-weight: normal; font-style: italic; padding-left: 0.5em; padding-right: 0.33em; }",

//               ".advisories { background-image: linear-gradient(to top, #ddd, rgba(255,255,255,0)); border: thin solid #aaa !important; border-radius: 0.25em 0.25em; cursor: default; font-family: sans-serif; font-weight: normal !important; padding: 0.25em 0.75em; text-align: left; width: auto; }",
//               ".advisories:hover { background-image: linear-gradient(to top, #bfe1ff, rgba(237,249,255,0)); }",
              ".advisories a { margin-top: -0.0625em; position: absolute; right: 0.5em; }",
              ".advisories img { max-height: 1.5em; }",

              ".barlight { background-color: #eee; }",
              ".barmedium { background-color: #ddd; }"
            ].join("\n")
        });

        advisories.reverse().forEach(function (e, i, a) {
          if (aSa[e]) {
            let nodeH7 = document.createElement("h7");
            nodeH7.textContent = e;
            hookNode.insertBefore(nodeH7, hookNode.firstChild);

            let nodeDiv = document.createElement("div");
            nodeDiv.classList.add("sa");

            for (let j = 0, thisSummary; thisSummary = aSa[e][j]; j++) {
  
              let thisDescription = thisSummary.split("\n").map(function (e) { return e.trim(); });

              let nodeDl = document.createElement("dl");

              let nodeDt = document.createElement("dt");
              nodeDt.textContent = thisDescription[0];
              if (j % 2 == 0)
                nodeDt.classList.add("barlight");

              for (let k = 1, thisClarification; thisClarification = thisDescription[k]; k++) {
                let nodeDd = document.createElement("dd");
                nodeDd.textContent = thisClarification;

                if (k % 2 == 1)
                  nodeDd.classList.add("barmedium");

                nodeDt.appendChild(nodeDd);
              }

              nodeDl.appendChild(nodeDt);
              nodeDiv.appendChild(nodeDl);
              nodeH7.appendChild(nodeDiv);
            }
          }
        });


        let nodeImg = document.createElement("img");
        nodeImg.src = GM_getResourceURL("icon");
        nodeImg.title = "uso - installWith";
        nodeImg.alt = "installWith";

        let nodeA = document.createElement("a");
        nodeA.href = "/scripts/show/68219";

        let nodeH6 = document.createElement("h6");
        nodeH6.classList.add("advisories");
        nodeH6.textContent = "Security Advisor";

        nodeA.appendChild(nodeImg);
        nodeH6.appendChild(nodeA);

        hookNode.insertBefore(nodeH6, hookNode.firstChild);
      }
    }
    else {
      if (aReduce) {
        let nodeA = document.createElement("a");
        nodeA.classList.add("unhide");
        nodeA.href = "#";
        nodeA.textContent = "show";
        nodeA.addEventListener("click", unhideClick, false);

        let nodeDiv = document.createElement("div");
        nodeDiv.classList.add("actions");

        nodeDiv.appendChild(nodeA);

        aNode.insertBefore(nodeDiv, aNode.lastChild.previousSibling);

        let descNode = aNode.querySelector(".desc");
        if (descNode)
          descNode.classList.add("hid");

        qNodes(gANODES);
      }
    }

  }

  /**
   *
   */
  function pushAdvisory(aSa, aAdvisory, aComment) {
    aComment = toArray(aComment);

    if (!aSa[aAdvisory])
      aSa[aAdvisory] = new Array();

    for (let i = 0, comment; comment = aComment[i++];)
      aSa[aAdvisory].push(comment);
  }

  /**
   *
   */
  function validateAOU(aURL, aScriptId, aRe1, aRe2, aCb) {
    let matches = aURL.match(aRe1), match, REL;
    if (matches) {
      REL = true;
      [, match] = matches;

      aURL = gPROTOCOL + "//" + gHOSTNAME + "/scripts/source/" + match;
    }

    let protocols = aURL.match(/^(\w+:)/), protocol;
    if (protocols) {
      [, protocol] = protocols;

      let SSL, sid, source, ISI, DDS, RHV, BT;
      switch (protocol) {
        case "https:":
          SSL = true;
        case "http:":
          let matches = aURL.match(aRe2);
          if (matches) {
            let sid, source;
            [, sid, source] = matches;

            if (sid != aScriptId)
              ISI = true;

            if (source && source != "meta")
              DDS = true;
          }
          else {
            if (/^https?:\/\/userscripts.org\/scripts\/\w+\/\d+.*\.(?:user|meta)\.js/.test(aURL))
              BT = true;
            else
              RHV = true;
          }
          break;
      }

      aCb(REL, SSL, ISI, RHV, BT, DDS);
    }
  }

  /**
   *
   */
  function parseList(aGroups, aCb) {
    for (let group in aGroups) {
      let scopes = gGROUPS[group];
      for (let scope in scopes) {
        let target = scopes[scope];

        for (let i = 0, len = target.length; i < len;) {
          let
              abstract,
              patterns,
              patternsx = {}
          ;
          [abstract, patterns] = [target[i], target[i + 1]];


          ++i;
          let
              advisory,
              summary
          ;
          if (typeof abstract == "string")
            [, advisory, summary] = abstract.match(/(\w+) (.*)/);
          else
            continue;


          ++i;
          if (typeof patterns == "object") {
            if (Array.isArray(patterns)) {
              if (typeof patterns[0] != "string")
                continue;

              for (let i = 0, pattern; pattern = patterns[i++];)
                patternsx[pattern] = "";
            }
            else
              patternsx = patterns;
          }
          else
            continue;

          let j = 0, tips, provider, block, reduce;
          for (; target[i + j] && typeof target[i + j] != "string"; ++j) {
            let optflag = target[i + j];

            if (!!optflag[0]) {
              let verb;
              [, verb] = optflag;

              switch (verb) {
                case "tip": // `tip1,tip2,...`
                  let comments;
                  [,, comments] = optflag;

                  if (typeof comments == "string")
                    tips = comments.split(",");

                  break;
                case "provide":
                  optflag.shift();
                  optflag.shift();

                  // NOTE: No validation

                  provider = optflag;

                  break;
                case "block":
                  block = true;
                  break;
                case "reduce":
                  reduce = true;
                  break;
              }
            }

          }

          i += (j - 1);

          aCb(scope, patternsx, advisory, summary, tips, block, reduce, provider);
        }

      }
    }
  }

  /**
   *
   */
  function unhideClick(ev) {
    ev.preventDefault();
    ev.target.removeEventListener("click", unhideClick, false);

    let descNode = ev.target.parentNode.parentNode.querySelector(".desc");
    if (descNode)
      descNode.classList.remove("hid");

    ev.target.parentNode.removeChild(ev.target);
  }

  /**
   *
   */
  function parse(aSa, aNode, aScriptId, aMb, aSource) {
    let
        block,

        KU,
        usoCMethod,
        ISI,
        DDS,
        RHV,
        BT,
        RN,
        REL,
        SSL,

        EMBED,
        REDUCE
    ;

    let excludes = toArray("exclude", aMb);
    if (excludes)
      for (let i = 0, exclude; exclude = excludes[i++];) {
        if (exclude == "*") {
          pushAdvisory(aSa, "XCLUDE", "Possible library support file detected");
          block = true;

          if (gISHOMEPAGE && !gmcHome.get("skipVerifyExclusion"))
            aNode.addEventListener("click", nag, false);

          break;
        }
      }

    let updateURL = lastValueOf(aMb, "updateURL");
    if (updateURL)
      validateAOU(
        updateURL,
        aScriptId,
        /^(\d+.*\.(?:meta|user)\.js)$/,
        /^https?:\/\/(?:.*\.)?userscripts\.org\/scripts\/source\/(\d+).*\.(meta|user)\.js/,
        function (aREL, aSSL, aISI, aRHV, aBT, aDDS) {
          if (aISI) { ISI = true; REDUCE = true; }
          if (aREL) REL = true;
          if (aSSL) SSL = true;
          if (aRHV) RHV = true;
          if (aBT) BT = true;
          if (aDDS) DDS = true;
          
        }
      );

    let
        downloadURL = lastValueOf(aMb, "downloadURL"),
        installURL = lastValueOf(aMb, "installURL")
    ;
    [
      installURL,
      downloadURL

    ].forEach(function (e, i, a) {
      if (e)
        validateAOU(
          e,
          aScriptId,
          /^(\d+.*\.user\.js)$/,
          /^https?:\/\/(?:.*\.)?userscripts\.org(?::\d+)?\/scripts\/source\/(\d+).*\.user\.js/,
          function (aREL, aSSL, aISI, aRHV, aBT) {
            if (aISI) { ISI = true; REDUCE = true; }
            if (aREL) REL = true;
            if (aSSL) SSL = true;
            if (aRHV) RHV = true;
            if (aBT) BT = true;
          }
        );
    });

    let grants = toArray("grant", aMb);
    if (grants)
      for (let i = 0, grant; grant = grants[i++];) {
        if (grant == "none") {
          block = !gmcHome.get("allowUpdatersOnAOUgrantnone");
          RN = true;
          break;
        }
      }

    let
        atRequires = toArray("require", aMb),
        atIncludes = toArray("include", aMb),
        atMatches = toArray("match", aMb),
        atUsoScript = lastValueOf(aMb, "script", "uso"),
        atUsoAuthor = lastValueOf(aMb, "author", "uso"),
        providers = []
    ;
    parseList(gGROUPS, function (aScope, aPatterns, aAdvisory, aSummary, aTips, aBlock, aReduce, aProvider) {
      for (let pattern in aPatterns) {

        let matches = pattern.match(/^\/(.*)\/(i?g?m?y?)$/), patternx = pattern;
        if (matches)
          patternx = new RegExp(matches[1].replace(/\$1/, aScriptId), matches[2]);

        if (aScope == "updater" && atRequires)
          for (let i = 0, atRequire; atRequire = atRequires[i++];) {
            let matches = (typeof patternx == "object") ? atRequire.match(patternx) : (atRequire == patternx) ? [atRequire, patternx] : null;
            if (matches) {
              if (/usocheckup/.test(matches[0])) {
                let matches = atRequire.match(/method\=(\w+)/);
                if (matches)
                  usoCMethod = matches[1];
                else
                  usoCMethod = "show";
              }

              let sid = matches[1];
              if (sid == aScriptId || sid == null) {
                pushAdvisory(aSa, aAdvisory, aSummary + (aPatterns[pattern] ? " " + aPatterns[pattern] : "") + (aTips ? "\n      " + aTips.join("\n      ") : ""));
                KU = true;
              }
              else {
                pushAdvisory(aSa, "SEVERE", aSummary + "\n    Possible malformed updater syntax");
                REDUCE = true;
                block = true;
                break;
              }
            }

          }

        if (aScope == "@include" && atIncludes)
          for (let i = 0, atInclude; atInclude = atIncludes[i++];)
            if ((typeof patternx == "object") ? atInclude.match(patternx) : (atInclude == patternx) ? [atInclude, patternx] : null) {
              pushAdvisory(aSa, aAdvisory, aSummary);
              if (aReduce) REDUCE = true;
              break;
            }

        if (aScope == "@include" && atMatches)
          for (let i = 0, atMatch; atMatch = atMatches[i++];)
            if ((typeof patternx == "object") ? atMatch.match(patternx) : (atMatch == patternx) ? [atMatch, patternx] : null) {
              pushAdvisory(aSa, aAdvisory, aSummary);
              if (aReduce) REDUCE = true;
              break;
            }

        if (aScope == "@uso:author" && atUsoAuthor)
          if (atUsoAuthor == patternx) {
            pushAdvisory(aSa, aAdvisory, aSummary + (aTips ? "\n      " + aTips.join("\n      ") : ""));
            if (aBlock)
              block = true;
          }

        if (aScope == "@uso:script" && atUsoScript)
          if (atUsoScript == patternx) {
            pushAdvisory(aSa, aAdvisory, aSummary + (aPatterns[pattern] ? " " + aPatterns[pattern] : "") + (aTips ? "\n      " + aTips.join("\n      ") : ""));
            if (aBlock)
              block = true;
          }

        if (aScope == "updaterEmbed" && aSource) {
          if (patternx.test(aSource) && aScriptId != 68219 && aScriptId != 69307) {
            EMBED = true;
            pushAdvisory(aSa, aAdvisory, aSummary + (aPatterns[pattern] ? " " + aPatterns[pattern] : "") + (aTips ? "\n      " + aTips.join("\n      ") : ""));
          }
        }

        if (aScope == "search" && aSource) {
          if (patternx.test(aSource)) {
            pushAdvisory(aSa, aAdvisory, aSummary + (aPatterns[pattern] ? " " + aPatterns[pattern] : "") + (aTips ? "\n      " + aTips.join("\n      ") : ""));

            if (aReduce) REDUCE = true;
          }
        }

        if (aProvider)
          providers.push(aProvider);

      }

    });


    /** **/
    let
        msgDDS = "AOU\n    Possible DDoS attack script and/or Privacy Loss",
        msgRHV = "AOU\n    Possible Remotely Hosted Version or bad target",
        msgBT =  "AOU\n    Possible bad target and/or Privacy Loss",
        msgISI = "AOU\n    Possible incorrect scriptid applied for updates",
        msgRN = "Restricted (content scope) namespace script"
    ;

    if (DDS)
      pushAdvisory(aSa, "SEVERE", msgDDS);
    if (RHV)
      pushAdvisory(aSa, "HIGH", msgRHV);
    if (BT)
      pushAdvisory(aSa, "HIGH", msgBT);
    if (RN)
      pushAdvisory(aSa, "ELEVATE", msgRN);
    if (ISI)
      pushAdvisory(aSa, "SEVERE", msgISI);

    if (KU && RN) {
      pushAdvisory(aSa, "ABORT", "Known updater and restricted (content scope) namespace are incompatible");
      block = true;
    }

    advise(aSa, aNode, EMBED, REDUCE);

    if (/^\/(?:scripts|topics)\//.test(gPATHNAME)) {
      if (block || (gmcHome.get("allowAOU") && (DDS || RHV || BT)) || (gmcHome.get("allowAOU") && ISI) || aMb["uso"]["unlisted"] == "") {
        if (gmcHome.get("forceInstallSecure"))
          aNode.protocol = "https:";

        if (gmcHome.get("forceInstallRecent"))
          aNode.pathname = aNode.pathname
              .replace(/\/source\//, "/version/")
              .replace(/(\.user\.js)$/, "/" + lastValueOf(aMb, "version", "uso") + "$1");
      }
      else
        create(aNode, atUsoScript, aMb, providers, KU, usoCMethod);
    }
  }

  /**
   *
   */
  function onLoad(aR) {
    switch (aR.status) {
      case 404:
        if (gHALT404)
          this._retry = 0;
      case 500:
      case 502:
      case 503:
        if (gJSE && this._retry-- > 0)
          setTimeout(GM_xmlhttpRequest, gDELAYRETRYMIN + Math.round(Math.random() * (gDELAYRETRYMAX - gDELAYRETRYMIN)), this); // NOTE: Detached
        else {
          if (/\.meta\.js$/.test(this.url))
            pushAdvisory(this._sa, "ABORT", "Unable to retrieve script metadata");
          else
            pushAdvisory(this._sa, "ABORT", "Unable to retrieve script source");

          advise(this._sa, this._node);

          this._node.classList.remove("saB");
          gQNODES.shift();
          xhr.call(gTHIS, this);
        }
        break;
      case 200:
        if (/\.meta\.js$/.test(this.url)) {

          this._mb = parseMeta(aR.responseText);
          if (!this._mb) {
            pushAdvisory(this._sa, "ABORT", "Unable to retrieve script metadata");
            advise(this._sa, this._node);

            this._node.classList.remove("saB");
            gQNODES.shift();
            xhr.call(gTHIS, this);
            return;
          }

          let pageMetaVersion = document.querySelector("meta[name='uso:version']");
          if (pageMetaVersion && gISHOMEPAGE)
            if (lastValueOf(this._mb, "version", "uso") != pageMetaVersion.content) {
              pushAdvisory(this._sa, "ABORT", "meta.js @uso:version and page @uso:version DO NOT MATCH");
              advise(this._sa, this._node);

              this._node.classList.remove("saB");
              gQNODES.shift();
              xhr.call(gTHIS, this);
              return;
            }

          /** Create phantom key(s) if detected **/
          if (this._node.classList.contains("userjs")) {
            if (/\?token=/.test(this._node))
              this._mb["uso"]["unlisted"] = "";
          }
          else {
            let emNode = this._node.querySelector("em");
            if (emNode && emNode.textContent == "unlisted")
              this._mb["uso"]["unlisted"] = "";
          }

          let user_idNode = document.body.querySelector("#heading .author a");
          if (user_idNode) {
            this._mb["uso"]["author"] = user_idNode.getAttribute("user_id");

            let matches = user_idNode.getAttribute("gravatar").match(/^.+gravatar_id\=(.+?)\&/);
            if (matches)
              this._mb["uso"]["avatar"] = matches[1];
          }

          let iconNode = document.getElementById("icon");
          if (iconNode) {
            let matches = iconNode.pathname.match(/\.(\w+)$/);
            if (matches)
              this._mb["uso"]["icontype"] = matches[1];
          }

          /** **/
          if (this._mb["uso"]["unlisted"] == "")
            pushAdvisory(this._sa, "ELEVATE", "Unlisted script");

          if ((
              /^\/$/.test(gPATHNAME) && gmcHome.get("scanMainDepth") == "deep" ||
              /^\/tags\//.test(gPATHNAME) && gmcHome.get("scanTagsDepth") == "deep" ||
              /^\/scripts/.test(gPATHNAME) && gmcHome.get("scanScriptsDepth") == "deep" ||
              /^\/groups\/\d+\/scripts/.test(gPATHNAME) && gmcHome.get("scanGroupsDepth") == "deep" ||
              /(^\/users\/.*?\/(?:scripts|favorites)|^\/home\/(?:scripts|favorites))/.test(gPATHNAME) && gmcHome.get("scanScriptWrightDepth") == "deep" ||
              /^\/(?:scripts\/show|topics)/.test(gPATHNAME) && !gmcHome.get("disableScanDeep")
              ) &&
              this._mb["uso"]["unlisted"] != ""
          ) {
            this.url = this.url.replace(/\/source\/(\d+)\.meta\.js$/, "/version/$1/" + lastValueOf(this._mb, "version", "uso") + ".user.js");
            this._retry = gRETRIES;
            GM_xmlhttpRequest.call(gTHIS, this);
          }
          else {
            parse(this._sa, this._node, this._scriptId, this._mb);

            this._node.classList.remove("saB");
            gQNODES.shift();
            xhr.call(gTHIS, this);
          }
        }
        else {
          /** Remove some keys **/
          let userjs = aR.responseText;
          userjs = userjs.replace(/\s+\/\/\s@(?:updateURL|installURL|downloadURL|exclude)\s+.*[^\n\r]/gm, "");

          parse(this._sa, this._node, this._scriptId, this._mb, userjs);

          this._node.classList.remove("saB");
          gQNODES.shift();
          xhr.call(gTHIS, this);
        }
        break;
      default:
        pushAdvisory(this._sa, "ABORT", "Untrapped status code" + aR.status);
        advise(this._sa, this._node);

        this._node.classList.remove("saB");
        gQNODES.shift();
        xhr.call(gTHIS, this);
        break;
    }
  }

  /**
   *
   */
  function xhr(aReq) {
    if (gQNODES.length > 0) {
      gIdle = false;

      let thisNode = gQNODES[0];
      if (thisNode) {
        thisNode.classList.add("saB");

        let thatNode;
        if (thisNode.classList.contains("userjs"))
          thatNode = thisNode;
        else
          thatNode = thisNode.querySelector(".title");

        let scriptId;
        [, scriptId] = thatNode.pathname.match(/(\d+).*$/);

        aReq._retry = gRETRIES;
        aReq._sa = {};
        aReq._node = thisNode;
        aReq._scriptId = scriptId;
        aReq._mb = null;
        aReq.url = "/scripts/source/" + scriptId + ".meta.js";

        GM_xmlhttpRequest(aReq);
      }
    }
    else
      gIdle = true;
  }

  /**
   *
   */
  function qNodes(aNodes) {
    for (let i = 0, thisNode; thisNode = aNodes[i++];)
      if (isViewing(thisNode) && !thisNode.classList.contains("saU")) {
        thisNode.classList.add("saU");
        gQNODES.push(thisNode);
      }

    if (gIdle)
      xhr({
        method: "GET",
        onload: onLoad
      });
  }

  /**
   *
   */
  function onViewportChange() {
    qNodes(gANODES);
  }

  /**
   *
   */
  function insertHook() {
    let hookNode = document.getElementById("full_description");

    if (hookNode && !hookNode.firstChild)
      return hookNode.appendChild(document.createElement("div"));
    else if (hookNode)
      return (hookNode.insertBefore(document.createElement("div"), hookNode.firstChild));
    else {
      hookNode = document.getElementById("content");

      if (hookNode) {
        let nodeDiv = document.createElement("div");

        let full_descriptionNodeDiv = document.createElement("div");
        full_descriptionNodeDiv.id = "full_description";

        full_descriptionNodeDiv.appendChild(nodeDiv);

        return hookNode.appendChild(full_descriptionNodeDiv);
      }
      else {
        console.log("ERROR: USO DOM change detected... appending GMC remote to EoD");
        return document.body.appendChild(document.createElement("div"));
      }
    }
  }

  /**
   *   main'ish
   */

  /** Clean up USO for framed presentation **/
  if (!gISFRAMELESS && /^\/scripts\/show\/\d+#heading/.test(gPATHNAME + gHASH)) {

    aNodes = document.body.querySelectorAll("a");
    for (let i = 0, thisNode; thisNode = aNodes[i++];)
      thisNode.target = "_top";

    GM_setStyle({
      node: gCSS,
      data:
        [
          "div.container { width: auto; margin: 0; }",
          "div#content { width: 100% !important; left: 0; }",
          "div#heading { height: 66px; min-height: 0; }",
          "div#details h1.title { max-height: 2.05em; overflow: hidden; }",
          "#section > .container { width: auto !important; }",
          "#section_search { display: none !important; }",
          "#install_script { bottom: auto !important; top: 10px !important; margin-right: 5px; }"

        ].join("\n")
    });
  }

  /** Nearest fix(es) for any glitches with UAC/USO **/
  if (gUAC)
    GM_setStyle({
      node: gCSS,
      data: [
        "div #full_description { width: 98.6%; }",

        "#screenshots { width: 98% !important; }",
        "#activity, #topics { float: inherit !important; }" // Alternative: "h6 { clear: both; }",

      ].join("\n")
    });
  else
    GM_setStyle({
      node: gCSS,
      data: [
        "div #full_description { width: 97.9%; }"

      ].join("\n")
    });


  /** **/
  if (typeof GM_configStruct == "undefined") {
    let msg = 'Fatal error. GM_config not found';
    console.error(msg);
    return;
  }

  GM_config = undefined;

  let gmcHome = new GM_configStruct();
  gmcHome.id = "gmc68219home";

  gmcHome.init(
    gISHOMEPAGE ? insertHook() : "",
    [
      '<img alt="installWith" title="uso &ndash; installWith" src="' + GM_getResourceURL("icon") + '" />',
      '<p>Preferences</p>',
      '<span>',
        '<a href="/guides/24/">',
          '<img alt="usoCheckup" title="Powered in part by usoCheckup" src="' + GM_getResourceURL("usoc") + '" />',
        '</a>',
        '<a href="' + gPROTOCOL + '//github.com/sizzlemctwizzle/GM_config/wiki/">',
            '<img alt="GM_config" title="Powered in part by GM_config" src="' + GM_getResourceURL("gmc") + '" />',
        '</a>',
      '</span>'

    ].join(""),

    GM_setStyle({
      node: null,
      data:
        [
          "@media screen, projection {",
                "#gmc68219home { position: static !important; z-index: 0 !important; width: auto !important; height: auto !important; max-height: none !important; max-width: none !important; margin: 0 0 0.5em 0 !important; border: 1px solid #ddd !important; clear: right !important; }",

                "#gmc68219home_header a { display: inline; }",
                "#gmc68219home_header img { max-height: 32px; margin-right: 0.125em; vertical-align: middle; }",
                "#gmc68219home_header > p { display: inline; margin: 0; vertical-align: middle; }",
                "#gmc68219home_header span { float: right; }",
                "#gmc68219home_header span > a { display: inline; margin-left: 0.25em; }",
                "#gmc68219home_wrapper { background-color: #eee; padding-bottom: 0.25em; }",
                "#gmc68219home .config_header { background-color: #333; color: #fff; font-size: 1.57em; margin: 0; padding: 0 0.5em; text-align: left; }",
                "#gmc68219home .config_var { clear: both; margin: 0.33em; padding: 0; }",
                "#gmc68219home .field_label { color: #333; font-size: 100%; font-weight: normal; margin: 0 0.25em; position: relative; top: -0.2em; }",
                "#gmc68219home .section_header_holder { margin: 0.25em 0.5em !important; }",
                "#gmc68219home .section_desc { margin: 0.25em 1.5em !important; }",

                    ".gmc-yellownote { background-color: #ffd; font-size: 0.66em !important; }",
                    ".gmc68219home-invisilink { text-decoration: none; color: #000; }",
                    ".gmc68219home-invisilink:hover { color: #000; }",

                    "#gmc68219home_wrapper textarea,",
                    "#gmc68219home_wrapper input",
                    "{ font-size: 1em; }",

                    "#gmc68219home_wrapper input[type='text']",
                    "{ text-align: right; width: 2em; }",

                    "#gmc68219home_scanScriptWrightDepth_var,",
                    "#gmc68219home_scanScriptsDepth_var,",
                    "#gmc68219home_scanGroupsDepth_var,",
                    "#gmc68219home_scanTagsDepth_var,",
                    "#gmc68219home_scanMainDepth_var",
                    "{ margin-left: 2em !important; }",


                "#gmc68219home .reset, #gmc68219home .reset a, #gmc68219home_buttons_holder { text-align: inherit; }",
                "#gmc68219home_buttons_holder { margin: 0.5em; }",
                "#gmc68219home_saveBtn { margin: 0.5em !important; padding: 0 3.0em !important; }",
                "#gmc68219home_resetLink { margin-right: 1.5em; }",
                "#gmc68219home_closeBtn { display: none; }",
          "}",

          "@media print {",
              "#gmc68219home { display: none !important; }",
          "}"

        ].join("\n")
    }),
    {
      'forceInstallSecure': {
          "section": [],
          "type": 'checkbox',
          "label": 'Force userscripts.org installations to use secure when browsing the site in unsecure',
          "default": false
      },
      'forceInstallRecent': {
          "type": 'checkbox',
          "label": 'Force userscripts.org installations to use the most recently detected version',
          "default": false
      },
      'mirrorDomain': {
          "section": [,''],
          "label": 'Mirror domain name for usoCheckup <em class="gmc-yellownote">Select primary ONLY or secure OPTIONALLY if behind a domain blocklist that prevents the redirect</em>',
          "type": 'radio',
          "options": ['redirect', 'primary', 'secure'],
          "default": 'redirect'
      },
      'allowAOU': {
          "type": 'checkbox',
          "label": 'Allow Add-on Updater <em class="gmc-yellownote">WARNING: Greasemonkey versions 0.9.13+ can be <strong>UNSAFE</strong> with invalid <a class="gmc68219home-invisilink" href="' + gPROTOCOL + '//sf.net/apps/mediawiki/greasemonkey/index.php?title=Metadata_Block#.40updateURL">@updateURL</a> values</em>',
          "default": false
      },
      'allowUpdatersOnAOUgrantnone': {
          "section": [,''],
          "type": 'checkbox',
          "label": 'Allow updaters to be added on scripts that have <code><a class="gmc68219home-invisilink" href="' + gPROTOCOL + '//sf.net/apps/mediawiki/greasemonkey/index.php?title=Metadata_Block#.40grant">@grant</a> none</code> <em class="gmc-yellownote">WARNING: Some scripts may not work properly</em>',
          "default": false
      },
      'skipVerifyExclusion': {
          "type": 'checkbox',
          "label": 'Skip verify for installation of exclusion scripts <em class="gmc-yellownote">Not recommended</em>',
          "default": false
      },
      'disableScanDeep': {
        "section": [,''],
        "type": "checkbox",
        "label": 'Disable deep scanning for individual script home pages <em class="gmc-yellownote">WARNING: Turning this option on may provide less accurate results</em>',
        "default": false
      },
      'limitMaxHeightSa': {
          "type": 'checkbox',
          "label": 'Limit maximum height of all shown item types in the sidebar',
          "default": false
      },
      'maxHeightListSa': {
          "type": 'unsigned number',
          "label": 'em maximum height of all shown item types',
          "default": 10
      },
      'enableScanScriptWright': {
        "section": [,''],
        "type": "checkbox",
        "label": 'Enable ScriptWright script pages scanning <em class="gmc-yellownote">WARNING: Deep scanning may be CPU and bandwidth intensive</em>',
        "default": false
      },
      'scanScriptWrightDepth': {
          "type": 'radio',
          "options": ['shallow', 'deep'],
          "default": 'shallow'
      },
      'enableScanGroups': {
        "section": [,''],
        "type": "checkbox",
        "label": 'Enable Group script pages scanning <em class="gmc-yellownote">WARNING: Deep scanning may be CPU and bandwidth intensive</em>',
        "default": false
      },
      'scanGroupsDepth': {
          "type": 'radio',
          "options": ['shallow', 'deep'],
          "default": 'shallow'
      },
      'enableScanScripts': {
        "type": "checkbox",
        "label": 'Enable Scripts pages scanning <em class="gmc-yellownote">WARNING: Deep scanning may be CPU and bandwidth intensive</em>',
        "default": false
      },
      'scanScriptsDepth': {
          "type": 'radio',
          "options": ['shallow', 'deep'],
          "default": 'shallow'
      },
      'enableScanTags': {
        "type": "checkbox",
        "label": 'Enable Tags pages scanning <em class="gmc-yellownote">WARNING: Deep scanning may be CPU and bandwidth intensive</em>',
        "default": false
      },
      'scanTagsDepth': {
          "type": 'radio',
          "options": ['shallow', 'deep'],
          "default": 'shallow'
      },
      'enableScanMain': {
        "type": "checkbox",
        "label": 'Enable Popular scripts pages scanning <em class="gmc-yellownote">WARNING: Deep scanning may be CPU and bandwidth intensive</em>',
        "default": false
      },
      'scanMainDepth': {
          "type": 'radio',
          "options": ['shallow', 'deep'],
          "default": 'shallow'
      }
    }
  );

  gmcHome.onSave = function() {
    let write = false;
    let reopen = false;
    
    GM_setStyle({
        node: gCSS,
        data:
          [
            "#script_sidebar h7 div.sa { max-height: " + (gmcHome.get("limitMaxHeightSa") ? gmcHome.get("maxHeightListSa") + "em" : "none") + "; }"

          ].join("\n")
    });
    
    if (write) gmc.write();
    if (reopen) { gmc.close(); gmc.open(); }
  }

  /** **/
  if (gmcHome.get("limitMaxHeightSa"))
    GM_setStyle({
        node: gCSS,
        data:
          [
            "#script_sidebar h7 div.sa { max-height: " + gmcHome.get("maxHeightListSa") + "em; overflow: auto; }"

          ].join("\n")
    });

  if (gISFRAMELESS && /\/scripts\/show\/68219\/?$/.test(gPATHNAME)) {
    gmcHome.open();
  }

  /**
   *
   */
  let gmc = new GM_configStruct();
  gmc.id = "gmc68219";

  gmc.init(
    gISHOMEPAGE ? insertHook() : "",
    (
      (
        (/\/scripts\/show\/68219\/?$/.test(gPATHNAME))
        ? [
            '<img alt="installWith" title="uso - installWith" src="' + GM_getResourceURL("icon") + '" />'

          ].join("")
        : [
            '<a href="/scripts/show/68219">',
              '<img alt="installWith" title="uso - installWith" src="' + GM_getResourceURL("icon") + '" />',
            '</a>'

          ].join("")
      )
      + [
          '<p>Options</p>',
          '<span>',
            '<a href="/guides/24/">',
              '<img alt="usoCheckup" title="Powered in part by usoCheckup" src="' + GM_getResourceURL("usoc") + '" />',
            '</a>',
            '<a href="' + gPROTOCOL + '//github.com/sizzlemctwizzle/GM_config/wiki">',
              '<img alt="GM_config" title="Powered in part by GM_config" src="' + GM_getResourceURL("gmc") + '" />',
            '</a>',
          '</span>'
        ].join("")
      ),
    /* Custom CSS */
    GM_setStyle({
        node: null,
        data:
          [
          "@media screen, projection {",
                "#gmc68219 { position: static !important; z-index: 0 !important; width: auto !important; height: auto !important; max-height: none !important; max-width: none !important; margin: 0 0 0.5em 0 !important; border: 1px solid #ddd !important; clear: right !important; }",

                "#gmc68219_header a { display: inline; }",
                "#gmc68219_header img { max-height: 32px; margin-right: 0.125em; vertical-align: middle; }",
                "#gmc68219_header > p { display: inline; margin: 0; vertical-align: middle; }",
                "#gmc68219_header span { float: right; }",
                "#gmc68219_header span > a { display: inline; margin-left: 0.25em; }",
                "#gmc68219_wrapper { background-color: #eee; padding-bottom: 0.25em; }",
                "#gmc68219 .config_header { background-color: #333; color: #fff; font-size: 1.57em; margin: 0; padding: 0 0.5em; text-align: left; }",
                "#gmc68219 .config_var { clear: both; margin: 0.33em; padding: 0; }",
                "#gmc68219 .field_label { color: #333; font-size: 100%; font-weight: normal; margin: 0 0.25em; position: relative; top: -0.2em; }",
                "#gmc68219 .section_header_holder { margin: 0.25em 0.5em !important; }",
                "#gmc68219 .section_desc { margin: 0.25em 1.5em !important; }",

                    ".gmc-yellownote { background-color: #ffd; font-size: 0.66em !important; }",
                    ".gmc68219-invisilink { text-decoration: none; color: #000; }",
                    ".gmc68219-invisilink:hover { color: #000; }",

                    "#gmc68219 .config_header { margin-bottom: 0.5em; }",

                    "#gmc68219_useGravatarIcon_var,",
                    "#gmc68219_useScriptIcon_var",
                    "{ display: inline !important; }",

                    "#gmc68219_useGravatarIcon_field_label img,",
                    "#gmc68219_useScriptIcon_field_label img",
                    "{ max-height: 48px; max-width: 48px; vertical-align: middle; }",

                    "#gmc68219_field_updaterMaxage,",
                    "#gmc68219_field_updaterMinage",
                    "{ height: 1em; margin: 0 0.25em; min-height: 0.8em; max-height: 2.1em; text-align: right; width: 2.5em; }",

                "#gmc68219 .reset, #gmc68219 .reset a, #gmc68219_buttons_holder { text-align: inherit; }",
                "#gmc68219_buttons_holder { margin: 0.5em; }",
                "#gmc68219_saveBtn { margin: 0.5em !important; padding: 0 3.0em !important; }",
                "#gmc68219_resetLink { margin-right: 1.5em; }",
                "#gmc68219_closeBtn { display: none; }",
          "}",

          "@media print {",
              "#gmc68219 { display: none !important; }",
          "}"

          ].join("\n")
    }),
    /* Settings Object */
    {
      "useGravatarIcon": {
        "section": [],
        "type": "checkbox",
        "label": '',
        "default": false
      },
      "useScriptIcon": {
        "type": "checkbox",
        "label": '',
        "default": false
      },
      "updaterMaxage": {
          "type": "unsigned integer",
          "label": 'day(s) maximum between checks for this script',
          "default": 30
      },
      "updaterMinage": {
        "type": "unsigned integer",
        "label": 'hour(s) minimum before starting a check for this script',
        "default": 1
      },
      'indirectMethod': {
          "label": 'Method <em class="gmc-yellownote">Select update to use the most recently detected version.</em>',
          "type": 'radio',
          "options": ['show', 'install', 'update'],
          "default": 'show'
      },
      'directMethod': {
          "label": 'Method <em class="gmc-yellownote">Select update to use the most recently detected version.</em>',
          "type": 'radio',
          "options": ['install', 'update'],
          "default": 'install'
      },

      'providerPref1': { "type": 'hidden', "default": "uso" },
      'providerPref2': { "type": 'hidden', "default": "uso" }
    }
  );

  gmc.onSave = function() {
    let write = false;
    let reopen = false;
      if (gmc.get("updaterMinage") > gmc.get("updaterMaxage") * 24 ) {
        gmc.set("updaterMinage", 1);
        write = true;
      }
    if (write) gmc.write();
    if (reopen) { gmc.close(); gmc.open(); }

    let ev = new CustomEvent("change");

    let selectNode = document.getElementById("provider_id");
    selectNode.dispatchEvent(ev);
  }

  /**
   *
   */
  GM_setStyle({
    node: gCSS,
    data:
      [
        "table.forums tr td.script-meat { background-color: #eee; }"

      ].join("\n")
  });

  if (
    /^\/$/.test(gPATHNAME) && gmcHome.get("enableScanMain")
    || /^\/tags\//.test(gPATHNAME) && gmcHome.get("enableScanTags")
    || /^\/scripts/.test(gPATHNAME) && gmcHome.get("enableScanScripts")
    || /^\/groups\/\d+\/scripts/.test(gPATHNAME) && gmcHome.get("enableScanGroups")
    || /(^\/users\/.*?\/(?:scripts|favorites)|^\/home\/(?:scripts|favorites))/.test(gPATHNAME) && gmcHome.get("enableScanScriptWright")
    || /^\/scripts\/show\//.test(gPATHNAME)
    || /^\/topics\//.test(gPATHNAME)
  ) {
    init();
  }

})();
