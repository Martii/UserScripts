(function() {

// ==UserScript==
// @name          uso - installWith
// @namespace     http://userscripts.org/users/37004
// @description   Adds option to install script with an updater. "So easy, a cavemonkey can do it"
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.5.8
// @include http://userscripts.org/scripts/*/*
// @include https://userscripts.org/scripts/*/*
// @include http://userscripts.org/topics/*
// @include https://userscripts.org/topics/*
// @include http://userscripts.org/reviews/*
// @include https://userscripts.org/reviews/*
// @include http://userscripts.org/scripts/versions/*
// @include https://userscripts.org/scripts/versions/*
//
// @exclude http://userscripts.org/scripts/source/*.meta.js
// @exclude https://userscripts.org/scripts/source/*.meta.js
// @exclude http://userscripts.org/scripts/diff/*
// @exclude https://userscripts.org/scripts/diff/*
// @exclude http://userscripts.org/scripts/version/*
// @exclude https://userscripts.org/scripts/version/*
//
// @resource usoCheckup http://usocheckup.redirectme.net/res/usoCheckup.png
// @resource usoCheckupBeta http://usocheckup.redirectme.net/res/usoCheckupBeta.png
// @resource qmark http://usocheckup.redirectme.net/res/qmark.png
// @resource script http://usocheckup.redirectme.net/res/script.png
// @resource checking http://usocheckup.redirectme.net/res/checking.png
// @resource low http://usocheckup.redirectme.net/res/low.png
// @resource guarded http://usocheckup.redirectme.net/res/guarded.png
// @resource elevated http://usocheckup.redirectme.net/res/elevated.png
// @resource high http://usocheckup.redirectme.net/res/high.png
// @resource severe http://usocheckup.redirectme.net/res/severe.png
// @resource undetermined http://usocheckup.redirectme.net/res/undetermined.png
// @require http://usocheckup.redirectme.net/68219.js?method=install&open=window&maxage=1&custom=yes&topicid=45479&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// @require http://github.com/sizzlemctwizzle/GM_config/raw/fa194bc0ffdd65dfd7bbda0beea2832cf32e021e/gm_config.js
// ==/UserScript==

  var frameless = false;
  try {
    frameless = (window === window.top);
  }
  catch (e) {}

  // Clean up USO for framed presentation
  if (!frameless && window.location.href.match(/^https?:\/\/userscripts\.org\/scripts\/show\/.*#heading/i)) {
    var thisNode;

    // Change all links to _top
    var xpr = document.evaluate(
      "//a",
      document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    if (xpr)
      for (var i = xpr.snapshotLength - 1; thisNode = xpr.snapshotItem(i); --i)
        thisNode.setAttribute("target", "_top");

    GM_addStyle("div.container { width: auto; margin: 0; }");
    GM_addStyle("div#content { width: 100% !important; left: 0; }");
    GM_addStyle("div#heading { height: 66px; min-height: 0; }");
    GM_addStyle("div#details h1.title { max-height: 2.05em; overflow: hidden; }");
  }

  var securityAdvisory = {
    "checking": {
      "title": 'Security Advisory: CHECKING, Please Wait',
      "background-image": GM_getResourceURL("checking")
    },
    "low": {
      "title": 'Security Advisory: LOW',
      "background-image": GM_getResourceURL("low")
    },
    "guarded": {
      "title": 'Security Advisory: GUARDED',
      "background-image": GM_getResourceURL("guarded")
    },
    "elevated": {
      "title": 'Security Advisory: ELEVATED',
      "background-image": GM_getResourceURL("elevated")
    },
    "high": {
      "title": 'Security Advisory: HIGH',
      "background-image": GM_getResourceURL("high")
    },
    "severe": {
      "title": 'Security Advisory: SEVERE',
      "background-image": GM_getResourceURL("severe")
    },
    "undetermined": {
      "title": 'Security Advisory: UNDETERMINED',
      "background-image": GM_getResourceURL("undetermined")
    },
  };

  var installNode = document.evaluate(
    "//div[@id='install_script']/a[@class='userjs']",
    document,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null
  );

  if (installNode && installNode.singleNodeValue) {
    installNode = installNode.singleNodeValue;

    installNode.setAttribute("title", securityAdvisory["checking"]["title"]);
    GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
        + securityAdvisory["checking"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}");
  }
  else
    return;

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

      if (titleNode && titleNode.singleNodeValue) {
        scriptid = titleNode.singleNodeValue.pathname.match(/\/scripts\/show\/(\d+)/i);
      }
    }
    return (scriptid) ? scriptid[1] : undefined;
  }

    if (typeof GM_configStruct != "undefined") {
      // Save some memory
      delete GM_config;

      var gmc = new GM_configStruct();
      gmc.id = "gmc68219";

      // Migrate preferences for a while
      if (GM_getValue("GM_config")) {
        GM_setValue("gmc68219", GM_getValue("GM_config", ""));
        GM_deleteValue("GM_config");
      }

      var divNode = document.getElementById("full_description");

      /* Nearest fix for a glitch on USO */
      var scriptNav = document.getElementById("script-nav");
      if (scriptNav && divNode && scriptNav.clientWidth != divNode.clientWidth)
        GM_addStyle("div #full_description { width: 95.84%; }");

      var screenShots =  document.getElementById("screenshots");
      if (screenShots)
        GM_addStyle("#full_description { clear: left; }");

      /* Nearest fix for userscripts.org Alternate CSS */
      var fullDescription = document.getElementById("full_description");
      if (fullDescription && screenShots && fullDescription.clientWidth > parseInt(screenShots.clientWidth * 1.05))
        GM_addStyle("#screenshots { width: 95.6% !important; }");

      if (divNode && !divNode.firstChild) {
        var newdivNode = document.createElement("div");
        divNode = divNode.appendChild(newdivNode);
      }
      else {
        var newdivNode = document.createElement("div");
        if (divNode)
          divNode = divNode.insertBefore(newdivNode, divNode.firstChild);
        else
          divNode = document.body.appendChild(newdivNode);
      }

      gmc.onSave = function() {
        var write = false;

        if (Math.abs(gmc.get("updaterMaxage")) != gmc.get("updaterMaxage")) {
          gmc.set("updaterMaxage", Math.abs(gmc.get("updaterMaxage")));
          write = true;
        }

        if (Math.abs(gmc.get("updaterMinage")) != gmc.get("updaterMinage")) {
          gmc.set("updaterMinage", Math.abs(gmc.get("updaterMinage")));
          write = true;
        }

        if (gmc.get("updaterMinage") > gmc.get("updaterMaxage") * 24 ) {
          gmc.set("updaterMinage", 1);
          write = true;
        }

        if (write) { gmc.write(); gmc.close(); gmc.open(); }

        var ev = document.createEvent("HTMLEvents");
        ev.initEvent("change", true, true);
        var selectNode = document.getElementById("updater_select");
        selectNode.dispatchEvent(ev);
      }
      gmc.init('Options' /* Script title */,
          divNode,
          /* Custom CSS */
          <><![CDATA[

            /* GM_config specific fixups */
            #gmc68219 {
              position: static !important;
              z-index: 0 !important;
              width: auto !important;
              height: auto !important;
              max-height: none !important;
              max-width: none !important;
              margin: 0 0 0.5em 0 !important;
              border: 1px solid #ddd !important;
              clear: right !important;
            }

            #gmc68219 .config_header {
              color: white;
              background-color: #333;
              text-align: left;
              margin: 0 0 0.4em 0;
              padding: 0 0 0 0.5em;
              font-size: 1.57em;
            }

            #gmc68219 .config_var {
              margin: 0.8em 1em;
              padding: 0;
              clear: both;
            }

            #gmc68219 .field_label {
              color: #333;
              font-weight: normal;
              font-size: 100%;
            }

            #gmc68219_field_updaterMaxage,
            #gmc68219_field_updaterMinage
            {
              width: 2.5em; height: 0.8em; margin: -0.35em 0.25em 0.25em; float: left; text-align: right;
            }

            #gmc68219_buttons_holder, #gmc68219 .saveclose_buttons { margin-bottom: 0.25em; }
            #gmc68219_saveBtn { margin: 0.4em 1.2em !important; padding: 0 3.0em !important; }
            #gmc68219_resetLink { margin-right: 2.5em; }
            #gmc68219_closeBtn { display: none; }

          ]]></>.toString(),

          /* Settings object */
          {
            'updaterMaxage': {
                "label": 'days maximum between checks for this script using installWith',
                "type": 'int',
                "default": 30
            },
            'updaterMinage': {
              "label": 'hours minimum before starting a check for this script using installWith',
              "type": 'int',
              "default": 1
            }
          }
      );
    }
    else {
      GM_log('Something went wrong. Please let me know how to reproduce');
    }

  var scriptid = getScriptid();
  if (scriptid) {
    GM_xmlhttpRequest({
      url: "http://userscripts.org/scripts/source/" + scriptid + ".user.js?",
      method: "GET",
      onload: function(xhr) {
        if (xhr.status == 403) {
          installNode.setAttribute("title", securityAdvisory["elevated"]["title"] + ", UNLISTED");
          GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
              + securityAdvisory["elevated"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}");
        }
        else { // Assume listed due to a USO rate limiting bug in cache stack
					var possibleEmbedded;
					if(xhr.responseText.match(/\.meta\.js/gm))
						possibleEmbedded = true;

          var scriptid = getScriptid();
          GM_xmlhttpRequest({
            url: "http://userscripts.org/scripts/source/" + scriptid + ".meta.js",
            method: "GET",
            onload: function(xhr) {
              if (xhr.status == 200) {
                var metadataBlock = xhr.responseText.toString();
                var headers = {};
                var line, name, prefix, header, key, value;
                  var lines = metadataBlock.split(/\n/).filter(/\/\/ @/);
                  for each (line in lines) {
                    [, name, value] = line.match(/\/\/ @(\S*)\s*(.*)/);
                    switch (name) {
                      case "licence":
                        name = "license";
                        break;
                    }
                    [key, prefix] = name.split(/:/).reverse();
                    if (prefix) {
                      if (!headers[prefix])
                        headers[prefix] = new Object;
                      header = headers[prefix];
                    }
                    else
                      header = headers;
                    if (header[key]) {
                      if (!(header[key] instanceof Array))
                        header[key] = new Array(header[key]);
                      header[key].push(value);
                    }
                    else
                      header[key] = value;
                  }

                  if (headers["license"])
                    headers["licence"] = headers["license"];

                  var updaters = {
                    "uso": {
                      "value": "uso",
                      "textContent": 'userscripts.org (default)',
                      "iconUrl": GM_getResourceURL("script"),
                      "title": '',
                      "updater": "",
                      "rex": [],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      },
                      "border-bottom": "thin dotted #666"
                    },
                    "AnotherAutoUpdater": {
                      "value": "AnotherAutoUpdater",
                      "textContent": 'Another Auto Updater',
                      "iconUrl": "http://www.gravatar.com/avatar.php?gravatar_id=8603ded5ba12590f2231b13d5c07c45b&r=PG&s=16&default=identicon",
                      "title": 'by sizzlemctwizzle (27715)',
                      "updater": "anotherautoupdater",
                      "rex": [
                        "^http:\\/\\/sizzlemctwizzle\\.com\\/updater\\.php\\?id=\\d+",
                        "^http:\\/\\/vulcan\\.ist\\.unomaha\\.edu\\/~medleymj\\/updater\\/\\d+\\.js"
                      ],
                      "url": "http://sizzlemctwizzle.com/updater.php?id=" + scriptid,
                      "qs": "show&uso",
                      "qsmax": "days",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      },
                      "border-bottom": "thin dotted #666"
                    },
                    "75442": {
                      "value": "",
                      "textContent": 'AEG Userscript AutoUpdater',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=df1c1d7d1c968bc8ea4324d1d4d3f557&r=PG&s=16&default=identicon',
                      "title": 'by ArmEagle (111132)',
                      "updater": "75442",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/75442\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "high",
                        "title": ", i/frame vulnerability"
                      }
                    },
                    "16338": {
                      "value": "",
                      "textContent": 'AutoUpdate Test',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=b4f3c9552954780fb7b2eb68bb043297&r=PG&s=16&default=identicon',
                      "title": 'by TastyFlySoup (39661)',
                      "updater": "16338",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/16338\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "45904": {
                      "value": "",
                      "textContent": 'Easy Update Code',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=2d5c92476e067787fc7e06f5970dda22&r=PG&s=16&default=identicon',
                      "title": 'by shoecream (74855)',
                      "updater": "45904",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/45904\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "45266": {
                      "value": "",
                      "textContent": 'easy userscript updater snippet',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=9fffdbad0ef6d1493ed098c9ae5b619a&r=PG&s=16&default=identicon',
                      "title": 'by thomd (43919)',
                      "updater": "45266",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/45266\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "35611": {
                      "value": "",
                      "textContent": 'GM Script Update Control',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=0b7d633463490424d235837976a4f915&r=PG&s=16&default=identicon',
                      "title": 'by Sylvain Comte (21175)',
                      "updater": "35611",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/35611\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "51513": {
                      "value": "",
                      "textContent": 'GM_ScriptUpdater',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=e2b29bd68eb03763a0e18c691ecf9fa5&r=PG&s=16&default=identicon',
                      "title": 'by IzzySoft (89585)',
                      "updater": "51513",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/51513\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "ikariamscriptresources.googlecode.com": {
                      "value": "",
                      "textContent": 'ikariamscriptresources.googlecode.com AutoUpdater',
                      "iconUrl": "",
                      "title": 'by MartynT0 (http://code.google.com/u/MartynT0/)',
                      "updater": "ikariamscriptresources.googlecode.com",
                      "rex": [
                        "^http:\\/\\/ikariamscriptresources\\.googlecode\\.com\\/svn\\/tags\\/Latest\\/AutoUpdater\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", i/frame vulnerability"
                      }
                    },
                    "38788": {
                      "value": "",
                      "textContent": 'Includes : CheckForUpdate',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=81269f79d21e612f9f307d16b09ee82b&r=PG&s=16&default=identicon',
                      "title": 'by w35l3y (55607)',
                      "updater": "38788",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/38788\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "33024": {
                      "value": "",
                      "textContent": 'Javascript Library 1',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=c1eeac01273ee6125e79b2948f184c8b&r=PG&s=16&default=identicon',
                      "title": 'by Aquilax (28612)',
                      "updater": "33024",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/33024\\.user\\.js",
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/version\\/33024\\/\\d+\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", Top-level script may have update check init for this lib"
                      }
                    },
										"47852": {
                      "value": "",
                      "textContent": 'Javascript Library+',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=2c0ccbb35186e3ccfb59c9bb49fcde76&r=PG&s=16&default=identicon',
                      "title": 'by BlackDiamond (75873)',
                      "updater": "47852",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/47852\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", Top-level script may have update check init for this lib, Derivative of Aquilax lib"
                      }
                    },
                    "mekan.dreamhosters.com": {
                      "value": "",
                      "textContent": 'mekan.dreamhosters.com',
                      "title": 'by mekan.dreamhosters.com (external derivative of sizzlemctwizzles)',
                      "updater": "mekan.dreamhosters.com",
                      "rex": [
                        "^https?:\\/\\/mekan\\.dreamhosters\\.com\\/eksi\\+\\+\\/updater\\.js\\?id=\\d+"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": ", Possible Security Risk"
                      }
                    },
                    "pennerstore.de": {
                      "value": "",
                      "textContent": 'pennerstore.de',
                      "title": 'by pennerstore.de (external)',
                      "updater": "pennerstore.de",
                      "rex": [
                        "^https?:\\/\\/scripte\\.pennerstore\\.de\\/JS\\/updater\\.class\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "high",
                        "title": ", Possible Security Risk"
                      }
                    },
                    "60663": {
                      "value": "",
                      "textContent": 'Script actualizador',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=335a5b24fbf27c9e20989a053e42f11c&r=PG&s=16&default=identicon',
                      "title": 'by Juampi_yoel (99372) es derivative of PhasmaExMachina (106144)',
                      "updater": "60663",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/60663\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "36259": {
                      "value": "",
                      "textContent": 'Script AutoUpdater',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=bb3f204908e461a17a0efebbe8907ad8&r=PG&s=16&default=identicon',
                      "title": 'by Eyal Soha (8105)',
                      "updater": "36259",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/36259\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "20145": {
                      "value": "",
                      "textContent": 'Script Update Checker',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=bee96081cd4a9e03a60d362c48da7f04&r=PG&s=16&default=identicon',
                      "title": 'by Jarett (38602)',
                      "updater": "20145",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/20145\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "8857": {
                      "value": "",
                      "textContent": 'Script Updater',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=1fbd08e29b195146539a4e2c04746cbc&r=PG&s=16&default=identicon',
                      "title": 'by alien scum (8158)',
                      "updater": "8857",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/8857\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "high",
                        "title": ", BROKEN"
                      }
                    },
                    "57756": {
                      "value": "",
                      "textContent": 'Script Updater (userscripts.org)',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=d1591dc87321de30c9504e7793779db1&r=PG&s=16&default=identicon',
                      "title": 'by PhasmaExMachina (106144)',
                      "updater": "57756",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/57756\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "66255": {
                      "value": "",
                      "textContent": 'Script Updater RU (userscripts.org)',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=f9e36c9af86d922678ac91b037201d5f&r=PG&s=16&default=identicon',
                      "title": 'by liquid ghost (126462)',
                      "updater": "66255",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/66255\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", RU Derivative of PhasmaExMachinas, May also not be in sync"
                      }
                    },
                    "ika-info.ucoz.ru": {
                      "value": "",
                      "textContent": 'Script Updater (userscripts.org)',
                      "iconUrl": '',
                      "title": 'static derivative of PhasmaExMachina (106144)',
                      "updater": "ika-info.ucoz.ru",
                      "rex": [
                        "^http:\\/\\/ika-info.ucoz.ru\\/scripts\\/Script_updater\\/script_updater.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": ", Offsite static derivative of PhasmaExMachinas"
                      }
                    },
                    "74144": {
                      "value": "",
                      "textContent": 'Script Updater (userscripts.org)',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=6eb8cf6b5065df1306ea572147ac11c7&r=PG&s=16&default=identicon',
                      "title": 'by TheSpy (106188)',
                      "updater": "74144",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/74144\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", localStorage vulnerability"
                      }
                    },
                    "41075": {
                      "value": "",
                      "textContent": 'Script Version Checker',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=ba841339fac46cbddd6e571550500946&r=PG&s=16&default=identicon',
                      "title": 'by littlespark (75320)',
                      "updater": "41075",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/41075\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "29878": {
                      "value": "",
                      "textContent": 'SelfUpdaterExample',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=f9695e2508d5064bb5fb781416913759&r=PG&s=16&default=identicon',
                      "title": 'by ScroogeMcPump (51934)',
                      "updater": "29878",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/29878\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "29880": {
                      "value": "",
                      "textContent": 'SelfUpdaterExampleOpera',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=f9695e2508d5064bb5fb781416913759&r=PG&s=16&default=identicon',
                      "title": 'by ScroogeMcPump (51934)',
                      "updater": "29880",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/29880\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "45989": {
                      "value": "",
                      "textContent": 'SVC Script Version Checker',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=8c298802a4b4aa3d68217b3dc7ccd529&r=PG&s=16&default=identicon',
                      "title": 'by devnull69 (75950)',
                      "updater": "45989",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/45989\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "42456": {
                      "value": "",
                      "textContent": 'Tester',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=4c2fe87eefaf73fb1c12e7d2ea09c2f5&r=PG&s=16&default=identicon',
                      "title": 'by realfree (77866)',
                      "updater": "42456",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/42456\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": ",Multiple search hosts,Interval vulnerability"
                      }
                    },
                    "62036": {
                      "value": "",
                      "textContent": 'update Test',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=e112ac971d83dd545268142bc2320a3c&r=PG&s=16&default=identicon',
                      "title": 'by hirak99 (36905)',
                      "updater": "62036",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/62036\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": ", Interval vulnerability"
                      }
                    },
                    "22372": {
                      "value": "",
                      "textContent": 'Userscript Auto-Update Add-in',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=7f3bb64a80ac40cfb3eeb72aca9ab4c3&r=PG&s=16&default=identicon',
                      "title": 'by psycadelik (41688)',
                      "updater": "22372",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/22372\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "UserscriptAutoupdateHelper": {
                      "value": "",
                      "textContent": 'userscript-autoupdate-helper',
                      "iconUrl": '',
                      "title": 'by ch.null (http://code.google.com/u/ch.null/)',
                      "updater": "UserscriptAutoupdateHelper",
                      "rex": [
                        "^https?:\\/\\/userscript-autoupdate-helper\\.googlecode\\.com\\/svn\\/trunk\\/autoupdatehelper\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", i/frame vulnerability"
                      }
                    },
                    "50390": {
                      "value": "",
                      "textContent": 'Userscripts Updater',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=5e6ac8007e5f74f23bc55815ac4092ee&r=PG&s=16&default=identicon',
                      "title": 'by oneweirdkid90 (73205)',
                      "updater": "50390",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/50390\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": ",Outdated copy of local checker"
                      }
                    },
                    "UserscriptUpdaterGenerator": {
                      "value": "",
                      "textContent": 'Userscript Updater Generator',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=780eb60a65688584794bd832b7bde567&r=PG&s=16&default=identicon',
                      "title": 'by ΙδεΠÐ (136989)',
                      "updater": "userscriptupdatergenerator",
                      "rex": [
                        "^http:\\/\\/userscript-updater-generator\\.appspot\\.com\\/\\?id=\\d+"
                      ],
                      "url": "http://userscript-updater-generator.appspot.com/?" + scriptid,
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": ",Closed-Source"
                      }
                    },
                    "52251": {
                      "value": "",
                      "textContent": 'Userscripts - AutoUpdater',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=af235ccf4ed8ed97b021b7c2d2501e83&r=PG&s=16&default=identicon',
                      "title": 'by Buzzy (57340)',
                      "updater": "52251",
                      "rex": [
                        "^http:\\/\\/buzzy\\.260mb\\.com\\/AutoUpdater\\.js",
                        "^http:\\/\\/buzzy\\.hostoi\\.com\\/AutoUpdater\\.js",
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/52251\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "37853": {
                      "value": "",
                      "textContent": 'Userscripts.org Timed Updater',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=620d4d8ec857b915057847eeb7f248b9&r=PG&s=16&default=identicon',
                      "title": 'by jerone (31497)',
                      "updater": "37853",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/37853\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "26062": {
                      "value": "",
                      "textContent": 'Userscripts Updater',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=068b7fb5725f061512446cf09aa0599e&r=PG&s=16&default=identicon',
                      "title": 'by lazyttrick (20871)',
                      "updater": "26062",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/26062\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "12193": {
                      "value": "",
                      "textContent": 'UserScript Update Notification',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=0796a8386f0889176a443c8ddeef113c&r=PG&s=16&default=identicon',
                      "title": 'by Seifer (33118)',
                      "updater": "12193",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/12193\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "2296": {
                      "value": "",
                      "textContent": 'User Script Updates',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=f16d4602c1c90646438a0b534ff61889&r=PG&s=16&default=identicon',
                      "title": 'by Richard Gibson (336)',
                      "updater": "2296",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/2296\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "high",
                        "title": "Doesn't use meta.js routine - Bandwidth waster"
                      }
                    },
                    "39678": {
                      "value": "",
                      "textContent": 'US Framework',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=620d4d8ec857b915057847eeb7f248b9&r=PG&s=16&default=identicon',
                      "title": 'by jerone (31497)',
                      "updater": "39678",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/39678\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "USOUpdater": {
                      "value": "USOUpdater",
                      "textContent": 'USO Updater',
                      "iconUrl": "http://www.gravatar.com/avatar.php?gravatar_id=05f6e5c5e440e8513c86538ddb834096&r=PG&s=16&default=identicon",
                      "title": 'by Tim Smart (63868)',
                      "updater": "usoupdater",
                      "rex": [
                        "^http:\\/\\/updater\\.usotools\\.co\\.cc\\/\\d+\\.js"
                      ],
                      "url": "http://updater.usotools.co.cc/" + scriptid + ".js",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", Possible Security Risk, Custom Interval Failure"
                      }
                    },
                    "16144": {
                      "value": "",
                      "textContent": 'US Update',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=620d4d8ec857b915057847eeb7f248b9&r=PG&s=16&default=identicon',
                      "title": 'by jerone (31497)',
                      "updater": "16144",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/16144\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "46384": {
                      "value": "",
                      "textContent": 'VeriVersion (module)',
                      "iconUrl": 'http://www.gravatar.com/avatar.php?gravatar_id=ad95a3d96cd1986fafe1bbff032bfe1d&r=PG&s=16&default=identicon',
                      "title": 'by bluflonalgul (75209)',
                      "updater": "46384",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/46384\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": "Interval vulnerability"
                      }
                    },
                    "zahlii.independent-irc.com": {
                      "value": "",
                      "textContent": 'zahlii.independent-irc.com/updater.class.js',
                      "title": 'by http://zahlii.independent-irc.com/updater.class.js',
                      "updater": "zahlii.independent-irc.com",
                      "rex": [
                        "^https?:\\/\\/zahlii\\.independent-irc\\.com\\/.*",
                        "^https?:\\/\\/github\\.com\\/Zahlii/.*",
                        "^https?:\\/\\/dabei\\.kilu\\.de/.*",
                        "^https?:\\/\\/kuestenpenner\\.ku\\.ohost\\.de/.*"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "severe",
                        "title": ", Updates to offsite script; Multiple redirections"
                      }
                    },
                    "usoCheckup": {
                      "value": "usoCheckup",
                      "textContent": 'usoCheckup',
                      "iconUrl": GM_getResourceURL("usoCheckup"),
                      "title": 'by tHE gREASEmONKEYS (multiple contributors)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/usocheckup\\.redirectme\\.net\\/\\d+\\.js",
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/\\d+\\.js",  // This is deprecated DO NOT USE
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                      ],
                      "url": "http://usocheckup.redirectme.net/" + scriptid + ".js",
                      "qs": "wrapperid=" + scriptid,
                      "qsmax": "maxage",
                      "qsmin": "minage",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      },
                      "border-top": "thin dotted #666"
                    },
                    "usoCheckupbeta": {
                      "value": "usoCheckupbeta",
                      "textContent": 'usoCheckup \u03B2\u03B5\u03C4\u03B1',
                      "derivative": 1,
                      "iconUrl": GM_getResourceURL("usoCheckupBeta"),
                      "title": 'by tHE gREASEmONKEYS (multiple contributors)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/beta\\.usocheckup\\.dune\\.net\\/\\d+\\.js"
                      ],
                      "url": "http://beta.usocheckup.dune.net/" + scriptid + ".js",
                      "qs": "wrapperid=" + scriptid,
                      "qsmax": "maxage",
                      "qsmin": "minage",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", BETA runtime, MAY NOT ALWAYS WORK! :)"
                      },
                      "beta": true
                    },
                    "usoCheckupOttoShow": {
                      "value": "usoCheckupOttoShow",
                      "textContent": 'usoCheckup + Otto Show',
                      "derivative": 1,
                      "iconUrl": "http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=16&default=identicon",
                      "title": 'themed by Marti Martz (37004)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/usocheckup\\.redirectme\\.net\\/\\d+\\.js",
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/\\d+\\.js",  // This is deprecated DO NOT USE
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                      ],
                      "url": "http://usocheckup.redirectme.net/" + scriptid + ".js",
                      "qs": "wrapperid=" + scriptid + "&theme=82206,66530,67771,74732&trim=de,pt&id=usoCheckup",
                      "qsmax": "maxage",
                      "qsmin": "minage",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "usoCheckupOttoInstall": {
                      "value": "usoCheckupOttoInstall",
                      "textContent": 'usoCheckup + Otto Install',
                      "derivative": 1,
                      "iconUrl": "http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=16&default=identicon",
                      "title": 'themed by Marti Martz (37004)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/usocheckup\\.redirectme\\.net\\/\\d+\\.js",
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/\\d+\\.js",  // This is deprecated DO NOT USE
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                      ],
                      "url": "http://usocheckup.redirectme.net/" + scriptid + ".js",
                      "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=60926,66530,67771,74732&trim=de,pt&id=usoCheckup",
                      "qsmax": "maxage",
                      "qsmin": "minage",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": ", Implicit trust of script"
                      }
                    },
                    "usoCheckupbottomsUp": {
                      "value": "usoCheckupbottomsUp",
                      "textContent": 'usoCheckup + bottomsUp',
                      "derivative": 1,
                      "iconUrl": "http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=16&default=identicon",
                      "title": 'themed by Marti Martz (37004)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/usocheckup\\.redirectme\\.net\\/\\d+\\.js",
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/\\d+\\.js",  // This is deprecated DO NOT USE
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                      ],
                      "url": "http://usocheckup.redirectme.net/" + scriptid + ".js",
                      "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=68506,66530,67771,74732&custom=yes&trim=de,pt&id=usoCheckup",
                      "qsmax": "maxage",
                      "qsmin": "minage",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "usoCheckupDOMNotify": {
                      "value": "usoCheckupDOMNotify",
                      "textContent": 'usoCheckup + DOMNotify',
                      "derivative": 1,
                      "iconUrl": "http://www.gravatar.com/avatar.php?gravatar_id=e615596ec6d7191ab628a1f0cec0006d&r=PG&s=16&default=identicon",
                      "title": 'themed by Marti Martz (37004)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/usocheckup\\.redirectme\\.net\\/\\d+\\.js",
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/\\d+\\.js",  // This is deprecated DO NOT USE
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                      ],
                      "url": "http://usocheckup.redirectme.net/" + scriptid + ".js",
                      "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=61794,66530,67771,74732&custom=yes&trim=de,pt&id=usoCheckup",
                      "qsmax": "maxage",
                      "qsmin": "minage",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    }
                  }

                  var requires;
                  if (headers["require"]) {
                    if (typeof headers["require"] == "string")
                      requires = [headers["require"]];
                    else
                      requires = headers["require"];

                    for each (var require in requires)
                      for each (var updater in updaters)
                        for each (var rex in updater["rex"])
                          if (require.match(new RegExp(rex  + ".*", "i"))) {
                            installNode.setAttribute("title",
                                securityAdvisory[updater["securityAdvisory"]["advisory"]]["title"] + updater["securityAdvisory"]["title"]);
                            GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                                + securityAdvisory[updater["securityAdvisory"]["advisory"]]["background-image"]
                                + "); } #install_script a.userjs:hover { color: black;}");
                            return;
                          }
                  }

                  var helpNode = document.evaluate(
                    "//div[@id='install_script']/a[@class='help']",
                    document,
                    null,
                    XPathResult.ANY_UNORDERED_NODE_TYPE,
                    null
                  );

                  if (helpNode && helpNode.singleNodeValue)
                    helpNode = helpNode.singleNodeValue;
                  else
                    return;

                  var thisNode = installNode;
                  thisNode.textContent += " with";
                  thisNode.style.setProperty("font-size", "1.0em", "");

                  thisNode = helpNode;
                  var qmark = GM_getResourceURL("qmark")

                  thisNode.style.setProperty("width", "16px", "");
                  thisNode.style.setProperty("height", "16px", "");
                  thisNode.style.setProperty("margin-top", "0.6em", "");
                  thisNode.style.setProperty("background", "transparent url(" + qmark + ") no-repeat scroll top left", "");
                  thisNode.style.setProperty("float", "right", "");

                  thisNode.textContent = "";

                  var selectNode = document.createElement("select");
                  selectNode.setAttribute("id", "updater_select");
                  selectNode.style.setProperty("width", "90%", "");
                  selectNode.style.setProperty("height", "1.6em", "");
                  selectNode.style.setProperty("font-size", "0.9em", "");
                  selectNode.addEventListener("change", function(ev) {
                    var thisUpdater = updaters[this.value];
                    GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                        + securityAdvisory[thisUpdater["securityAdvisory"]["advisory"]]["background-image"]
                        + "); } #install_script a.userjs:hover { color: black;}");
                    switch(this.value) {
                      case "uso":
                        GM_deleteValue(":updaterPreference");
												installNode.setAttribute("title", "");
                        installNode.setAttribute("href", "/scripts/source/" + scriptid + ".user.js");
                        if (frameless && window.location.href.match(/^https?:\/\/userscripts\.org\/scripts\/show\/.*/i))
                          gmc.close();
                        break;
                      default:
                        GM_setValue(":updaterPreference", this.value);
                        installNode.setAttribute("title",
                            securityAdvisory[thisUpdater["securityAdvisory"]["advisory"]]["title"] + thisUpdater["securityAdvisory"]["title"]);

                        function appendQSP(qs, qsp) {
                          if (qsp)
                            qs += (!qs) ? "?" + qsp : "&" + qsp;
                          return qs;
                        }
                        var qs = "";
                        qs = appendQSP(qs, ((!thisUpdater["value"].match(/usoCheckup.*/i)) ? "updater=" + thisUpdater["value"] : "") );
                        qs = appendQSP(qs, ((thisUpdater["qsmax"]) ? thisUpdater["qsmax"] + "=" + parseInt(Math.abs(gmc.get("updaterMaxage"))) : ""));
                        if (thisUpdater["qsmin"] && gmc.get("updaterMinage") != 1)
                          qs = appendQSP(qs, (thisUpdater["qsmin"] + "=" + parseInt(Math.abs(gmc.get("updaterMinage")))));
                        qs = appendQSP(qs, thisUpdater["qs"]);
                        qs = appendQSP(qs, "is=.user.js");

                        var url = "http://" + ((thisUpdater["beta"]) ? "beta.usocheckup.dune" : "usocheckup.redirectme") + ".net/" + scriptid + ".user.js" + qs;
                        installNode.setAttribute("href", url);

												if (possibleEmbedded) {
													installNode.setAttribute("title", "POSSIBLE EMBEDDED UPDATER FOUND: Please check source");
													GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
															+ securityAdvisory["undetermined"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}");
												}

                        if (frameless && window.location.href.match(/^https?:\/\/userscripts\.org\/scripts\/show\/.*/i))
                          gmc.open();
                      break;
                    }
                  }, true);

                thisNode.parentNode.insertBefore(selectNode, thisNode);

                  var updaterNode, iconNode, textNode;
                  for each (var updater in updaters)
                    if (updater["value"] != "") {

                      updaterNode = document.createElement("option");
                      updaterNode.setAttribute("value", updater["value"]);
                      if (updater["border-bottom"])
                        updaterNode.style.setProperty("border-bottom", updater["border-bottom"], "");

                      if (updater["border-top"])
                        updaterNode.style.setProperty("border-top", updater["border-top"], "");

                      iconNode = document.createElement("img");
                      iconNode.style.setProperty("vertical-align", "middle", "");

                      textNode = document.createTextNode(updater["textContent"]);

                      updaterNode.setAttribute("title", updater["title"]);

                      iconNode.style.setProperty("margin", "0.25em 0.25em 0.25em " + ((updater["derivative"]) ? updater["derivative"] * 0.6 + "em" : "0"), "");
                      iconNode.style.setProperty("width", "16px", "");
                      iconNode.style.setProperty("height", "16px", "");
                      iconNode.style.setProperty("background", "transparent url(" + ((updater["iconUrl"]) ? updater["iconUrl"] : "") + ") no-repeat center center", "");

                      updaterNode.appendChild(iconNode);
                      iconNode.setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");

                      updaterNode.appendChild(textNode);
                      selectNode.appendChild(updaterNode);
                    }

                  selectNode.selectedIndex = 0;

                  var updaterPreference = GM_getValue(":updaterPreference", "uso");
                  for (var i = 0; i < selectNode.options.length; ++i)
                    if (selectNode.options[i].value == updaterPreference) {
                      selectNode.selectedIndex = i;
                      break;
                    }

                  var ev = document.createEvent("HTMLEvents");
                  ev.initEvent("change", true, true);
                  selectNode.dispatchEvent(ev);
              }
              else {
                installNode.setAttribute("title", securityAdvisory["undetermined"]["title"]);
                GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                    + securityAdvisory["undetermined"]["background-image"] + ") !important; } #install_script a.userjs:hover { color: black;}");
              }
            }
          });
        }
      }
    });
  }

})();
