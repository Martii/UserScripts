(function() {

// ==UserScript==
// @name          uso - installWith
// @namespace     http://userscripts.org/users/37004
// @description   Adds option to install script with an updater. "So easy, a cavemonkey can do it"
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.13.10
// @icon          http://s3.amazonaws.com/uso_ss/icon/68219/large.png
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
//
// @require http://usocheckup.redirectme.net/68219.js?method=install&open=window&maxage=1&custom=yes&topicid=45479&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// @require https://raw.github.com/sizzlemctwizzle/GM_config/165a1f15d907c21d389cb037c24824885d278693/gm_config.js
// ==/UserScript==

  var frameless = false;
  try {
    frameless = (window == window.top);
  }
  catch (e) {}

  // Clean up USO for framed presentation
  if (!frameless && window.location.href.match(/^https?:\/\/userscripts\.org\/scripts\/show\/.*#heading/i)) {
    // Change all links to _top
    let xpr = document.evaluate(
      "//a",
      document.body,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    if (xpr)
      for (let i = 0, thisNode; thisNode = xpr.snapshotItem(i++);)
        thisNode.setAttribute("target", "_top");

      GM_addStyle(<><![CDATA[
        div.container { width: auto; margin: 0; }
        div#content { width: 100% !important; left: 0; }
        div#heading { height: 66px; min-height: 0; }
        div#details h1.title { max-height: 2.05em; overflow: hidden; }
      ]]></> + "");
  }

  var securityAdvisory = {
    "checking": {
      "index": 0,
      "title": 'Security Advisory: CHECKING, Please Wait',
      "background-image": decodeURIComponent(GM_getResourceURL("checking"))
    },
    "low": {
      "index": 1,
      "title": 'Security Advisory: LOW',
      "background-image": decodeURIComponent(GM_getResourceURL("low"))
    },
    "guarded": {
      "index": 2,
      "title": 'Security Advisory: GUARDED',
      "background-image": decodeURIComponent(GM_getResourceURL("guarded"))
    },
    "elevated": {
      "index": 3,
      "title": 'Security Advisory: ELEVATED',
      "background-image": decodeURIComponent(GM_getResourceURL("elevated"))
    },
    "high": {
      "index": 4,
      "title": 'Security Advisory: HIGH',
      "background-image": decodeURIComponent(GM_getResourceURL("high"))
    },
    "severe": {
      "index": 5,
      "title": 'Security Advisory: SEVERE',
      "background-image": decodeURIComponent(GM_getResourceURL("severe"))
    },
    "undetermined": {
      "index": 6,
      "title": 'Security Advisory: UNDETERMINED',
      "background-image": decodeURIComponent(GM_getResourceURL("undetermined"))
    }
};

  var installNode = document.evaluate(
    "//div[@id='install_script']/a[@class='userjs']",
    document.body,
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
    let scriptid = window.location.pathname.match(/\/scripts\/.+\/(\d+)/i);
    if (!scriptid) {
      let titleNode = document.evaluate(
        "//h1[@class='title']/a",
        document.body,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );

      if (titleNode && titleNode.singleNodeValue) {
        scriptid = titleNode.singleNodeValue.pathname.match(/\/scripts\/show\/(\d+)/i);
      }
    }
    return (scriptid) ? scriptid[1] : undefined;
  }

  function getAvatarid() {
    let xpr = document.evaluate(
      "//span[@class='author']/a",
      document.body,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );

    if (xpr && xpr.singleNodeValue) {
      let matches = xpr.singleNodeValue.getAttribute("gravatar").match(/^.+gravatar_id\=(.+?)\&/, "");
      if (matches && matches[1])
        return matches[1];
    }
    return undefined;
  }

  function getIcontype() {
    let xpr = document.evaluate(
      "//a[@id='icon']",
      document.body,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );

    if (xpr && xpr.singleNodeValue) {
      let matches = xpr.singleNodeValue.getAttribute("href").match(/^http:\/\/s3.amazonaws.com\/uso_ss\/icon\/\d+\/(?:thumb|large)\.(\w+)\?\d+/, "");
      if (matches && matches[1])
        return matches[1];
    }
    return undefined;
  }

    if (typeof GM_configStruct != "undefined") {
      // Reclaim some memory
      delete GM_config;

      var gmc = new GM_configStruct();
      gmc.id = "gmc68219";

      let divNode = document.getElementById("full_description");

      /* Nearest fix for a glitch on USO */
      let scriptNav = document.getElementById("script-nav");
      if (scriptNav && divNode && scriptNav.clientWidth != divNode.clientWidth)
        GM_addStyle("div #full_description { width: 95.84%; }");

      let screenShots = document.getElementById("screenshots");
      if (screenShots)
        GM_addStyle("#full_description { clear: left; }");

      /* Nearest fix for userscripts.org Alternate CSS */
      let fullDescription = document.getElementById("full_description");
      if (fullDescription && screenShots && fullDescription.clientWidth > parseInt(screenShots.clientWidth * 1.05))
        GM_addStyle("#screenshots { width: 95.6% !important; }");

      if (divNode && !divNode.firstChild) {
        let newdivNode = document.createElement("div");
        divNode = divNode.appendChild(newdivNode);
      }
      else {
        let newdivNode = document.createElement("div");
        if (divNode)
          divNode = divNode.insertBefore(newdivNode, divNode.firstChild);
        else
          divNode = document.body.appendChild(newdivNode);
      }

      gmc.onSave = function() {
        let write = false;
        let reopen = false;
          if (gmc.get("updaterMinage") > gmc.get("updaterMaxage") * 24 ) {
            gmc.set("updaterMinage", 1);
            write = true;
          }
        if (write) gmc.write();
        if (reopen) { gmc.close(); gmc.open(); }

        let ev = document.createEvent("HTMLEvents");
        ev.initEvent("change", true, true);
        let selectNode = document.getElementById("updater_select");
        selectNode.dispatchEvent(ev);
      }

      gmc.init(divNode,
          <><![CDATA[
            <a href="/scripts/show/68219"><img src="http://s3.amazonaws.com/uso_ss/11759/medium.png" style="vertical-align: middle; width: 43px; height: 32px;" title="uso - installWith" alt="uso - installWith"/></a> Options
            <span style="float: right; margin: 0.4em 0.5em;"><a href="http://github.com/sizzlemctwizzle/GM_config"><img src="http://s3.amazonaws.com/uso_ss/9849/large.png" title="Powered in part by GM_config" /></a></span>
          ]]></>.toString(),
          {
            "updaterMaxage": {
                "type": "unsigned integer",
                "label": 'day(s) maximum between checks for this script',
                "default": 30
            },
            "updaterMinage": {
              "type": "unsigned integer",
              "label": 'hour(s) minimum before starting a check for this script <em class="gmc68219-yellownote">Not all updaters support this</em>',
              "default": 1
            },
            "useGravatarIcon": {
              "type": "checkbox",
              "label": '',
              "default": false
            },
            "useScriptIcon": {
              "type": "checkbox",
              "label": '',
              "default": false
            },
            "skipEmbeddedScan": {
              "section": [, ""],
              "type": "checkbox",
              "label": 'Skip the embedded updater scan<p style="margin: 0 0 0 2.0em;"><em class="gmc68219-yellownote"><strong>WARNING</strong>: Skipping the embedded updater scan will produce undesired effects when other embedded updaters are present and wrapping a script in an additional updater</em></p>',
              "default": false
            }
          },
          <><![CDATA[
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

            #gmc68219_wrapper {
              background-color: #eee;
              padding-bottom: 0.25em;
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
              margin: 0.5em 1em;
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
              width: 2.5em; min-height: 0.8em; max-height: 2.1em; height: 1em; margin: -0.35em 0.25em 0.25em; text-align: right;
            }

            .gmc68219-yellownote
            {
              background-color: #FFD;
              font-size: 0.66em !important;
            }

            #gmc68219_field_useGravatarIcon,
            #gmc68219_field_useScriptIcon,
            #gmc68219_field_skipEmbeddedScan
            {
              top: 0.05em;
              margin-right: 0.5em;
            }

            #gmc68219_useGravatarIcon_var,
            #gmc68219_useScriptIcon_var
            {
              margin-right: 0 !important;
              display: inline !important;
            }

            #gmc68219_useScriptIcon_var
            {
              margin-left: 0 !important;
            }

            .section_desc
            {
              margin: 0.25em 1.5em !important;
            }

            #gmc68219_saveBtn { margin: 0.4em 1.2em !important; padding: 0 3.0em !important; }
            #gmc68219_resetLink { margin-right: 2.5em; }
            #gmc68219_closeBtn { display: none; }

          ]]></>.toString()
      );
    }

  let scriptid;
  if ((scriptid = getScriptid()))
    GM_xmlhttpRequest({
      retry: 5,
      url: ((gmc && gmc.get("skipEmbeddedScan")) ? "http://userscripts.org/scripts/source/" + scriptid + ".meta.js" : "http://userscripts.org/scripts/review/" + scriptid + "?format=txt"),
      method: "GET",
      onload: function(xhr) {
        switch(xhr.status) {
          case 404:
          case 502:
          case 503:
            if (--this.retry > 0)
              setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
            break;
          case 200:
            let possibleEmbedded, DDoS;

            if (xhr.responseText.match(
                "("
              +   "\\.meta\\.js"
              +   "|" + scriptid + "\\.user\\.js"
              +   "|(\"|')https?:\\/\\/userscripts\\.org\\/scripts\\/show\\/" + scriptid
              +   "|(\"|')(?:https?:\\/\\/userscripts\\.org\\/)?scripts\\/source\\/.+\\.user\\.js"
              +   "|https?:\\/\\/www\\.monkeyupdater\\.com"
              +   "|https?:\\/\\/mekan\\.dreamhosters\\.com\\/eksi\\+\\+\\/version\\.php\\?"
              +   "|\\/version\\.xml"
              +   "|https?:\\/\\/www\\.playerscripts\\.com\\/rokdownloads\\/mwapmeta.js"
              +   "|https?:\\/\\/www\\.SecureWorldHosting\\.com\\/MWAutoHelper\\/Update.html"
              +   "|https?:\\/\\/jobmine-plus\\.googlecode\\.com\\/svn\\/trunk\\/scripts"
              +   "|https?:\\/\\/pipes\\.yahoo\\.com\\/pipes"

              + ")", "gmi"))
                possibleEmbedded = true;

              if (possibleEmbedded && xhr.responseText.match(
                "("
              +   "https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/103455\\.user\\.js"

              + ")", "gmi")) {
                installNode.setAttribute("title", "Security Advisory: SEVERE, Possible malicious code and no script homepage for referenced user.js.");
                GM_addStyle(
                    "#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                  + securityAdvisory["severe"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}"
                );
                return;
              }

            function isKey(e, i, a) { return (e.match(/^\s*\/\/ @\S+/)); }
            let
              metadataBlock = xhr.responseText,
              headers = {},
              name, prefix, header, key, value,
              lines = metadataBlock.split(/[\r\n]+/).filter(isKey)
            ;

            for each (let line in lines) {
              [, name, value] = line.match(/^\s*\/\/ @(\S*)\s*(.*)/);
              value = value.trim().replace(/\s+/g, " ");
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

            if (headers["exclude"])
              for each (let exclude in (typeof headers["exclude"] == "string") ? [headers["exclude"]] : headers["exclude"])
                if (exclude == "*") {
                  installNode.setAttribute("title", "Security Advisory: NON-RUNNING, Possible library support file detected");
                  function nag(ev) {
                    ev.preventDefault();
                    if (confirm('This script won\'t execute on any page.\n\nAre you sure?'))
                      if (confirm('This script is a library file and won\'t run by itself.\n\nAre you really sure?'))
                        if(confirm('Are you really, really sure?\n\nIf you continue then the next Install button click will work.'))
                          ev.target.removeEventListener("click", nag, true);
                  }
                  installNode.addEventListener("click", nag, true);
                  GM_addStyle(<><![CDATA[
                    #install_script a.userjs, #install_script a.userjs:hover { background: #FFF none repeat scroll 0 0; }
                    #install_script a.userjs:hover { color: black; }
                  ]]></> + "");
                  return;
                }

            let updaters = {
              "uso": {
                "value": "uso",
                "textContent": 'userscripts.org (default)',
                "iconUrl": decodeURIComponent(GM_getResourceURL("script")),
                "title": 'Use native meta.js',
                "securityAdvisory": {
                  "advisory": "undetermined",
                  "title": ""
                },
                "border-bottom": "thin dotted #666"
              },
              "AnotherAutoUpdater": {
                "value": "AnotherAutoUpdater",
                "textContent": 'Another Auto Updater',
                "iconUrl": "8603ded5ba12590f2231b13d5c07c45b",
                "title": 'by sizzlemctwizzle (27715)',
                "updater": "anotherautoupdater",
                "rex": [
                  "^http:\\/\\/sizzlemctwizzle\\.com\\/updater\\.php\\?id=(\\d+)",
                  "^http:\\/\\/vulcan\\.ist\\.unomaha\\.edu\\/~medleymj\\/updater\\/(\\d+)\\.js"
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
              "alex7kom.ru": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "title": 'by (alex7kom.ru)',
                "rex": [
                  "https?:\\/\\/alex7kom\\.ru\\/wwwjdic2\\/us_updater\\.php"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (crea7or.spb.ru)"
                }
              },
              "crea7or.spb.ru": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "title": 'by (crea7or.spb.ru)',
                "rex": [
                  "^http:\\/\\/crea7or\\.spb\\.ru\\/scripts\\/user\\.js\\.updater\\.php\\?id=(\\d+)"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (crea7or.spb.ru)"
                }
              },
              "bsm.oldtu.com": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "title": 'by (bsm.oldtu.com)',
                "rex": [
                  "^http:\\/\\/bsm\\.oldtu\\.com\\/updater\\.php\\?id=(\\d+)"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (bsm.oldtu.com)"
                }
              },
              "koc.god-like.info": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "title": 'by (koc.god-like.info)',
                "rex": [
                  "^https?:\\/\\/koc\\.god\\-like\\.info\\/update\\/auto\\-updater\\.php\\?id=(\\d+)"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (koc.god-like.info)"
                }
              },
              "mekan.dreamhosters.com": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "title": 'by (mekan.dreamhosters.com)',
                "rex": [
                  "^https?:\\/\\/mekan\\.dreamhosters\\.com\\/eksi\\+\\+\\/updater\\.js\\?id=(\\d+)"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (mekan.dreamhosters.com)"
                }
              },
              "tomchapin.me": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "title": 'by (tomchapin.me)',
                "rex": [
                  "^https?:\\/\\/tomchapin\\.me\\/auto\\-updater\\.php\\?id=(\\d+)"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (tomchapin.me)"
                }
              },
              "www.hitotext.com": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "title": 'by (http://www.hitotext.com/mh/ff)',
                "rex": [
                  "^http:\\/\\/www\\.hitotext\\.com\\/mh\\/ff\\/updater\\.php\\?id=(\\d+)"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (www.hitotext.com/mh/ff)"
                }
              },
              "www.jeffersonscher.com": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "iconUrl": 'b171e9282909b6a1f7030411674f0058',
                "title": 'by Jefferson Scher (281305)',
                "rex": [
                  "^http:\\/\\/www\\.jeffersonscher\\.com\\/gm\\/AnotherAutoUpdater\\.php\\?id=(\\d+)"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (www.jeffersonscher.com)"
                }
              },
              "www.nodeka411.net": {
                "derivative": 1,
                "textContent": 'Another Auto Updater',
                "title": 'by (www.nodeka411.net)',
                "rex": [
                  "^http:\\/\\/www\\.nodeka411\\.net\\/public\\/gmupdater\\/(\\d+)\\.js",
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Derivative of AAU (www.nodeka411.net)"
                }
              },
              "75442": {
                "textContent": 'AEG Userscript AutoUpdater',
                "iconUrl": 'df1c1d7d1c968bc8ea4324d1d4d3f557',
                "title": 'by ArmEagle (111132)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/75442\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", i/frame vulnerability"
                }
              },
              "16338": {
                "textContent": 'AutoUpdate Test',
                "iconUrl": 'b4f3c9552954780fb7b2eb68bb043297',
                "title": 'by TastyFlySoup (39661)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/16338\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "45904": {
                "textContent": 'Easy Update Code',
                "iconUrl": '2d5c92476e067787fc7e06f5970dda22',
                "title": 'by shoecream (74855)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/45904\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "45266": {
                "textContent": 'easy userscript updater snippet',
                "iconUrl": '9fffdbad0ef6d1493ed098c9ae5b619a',
                "title": 'by thomd (43919)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/45266\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "35611": {
                "textContent": 'GM Script Update Control',
                "iconUrl": '0b7d633463490424d235837976a4f915',
                "title": 'by Sylvain Comte (21175)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/35611\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "51513": {
                "textContent": 'GM_ScriptUpdater',
                "iconUrl": 'e2b29bd68eb03763a0e18c691ecf9fa5',
                "title": 'by IzzySoft (89585)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/51513\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "ikariamscriptresources.googlecode.com": {
                "textContent": 'AutoUpdater.js',
                "title": 'by MartynT0 (http://code.google.com/u/MartynT0/)',
                "rex": [
                  "^http:\\/\\/ikariamscriptresources\\.googlecode\\.com\\/svn\\/tags\\/Latest\\/AutoUpdater\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", i/frame vulnerability"
                }
              },
              "38788": {
                "textContent": 'Includes : CheckForUpdate',
                "iconUrl": '81269f79d21e612f9f307d16b09ee82b',
                "title": 'by w35l3y (55607)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/38788\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "33024": {
                "textContent": 'Javascript Library 1',
                "iconUrl": 'c1eeac01273ee6125e79b2948f184c8b',
                "title": 'by Aquilax (28612)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/33024\\.user\\.js",
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/version\\/33024\\/(\\d+)\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Top-level script may have update check init for this lib"
                }
              },
              "47852": {
                "derivative": 1,
                "textContent": 'Javascript Library+',
                "iconUrl": '2c0ccbb35186e3ccfb59c9bb49fcde76',
                "title": 'by BlackDiamond (75873)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/47852\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Top-level script may have update check init for this lib, Derivative of Aquilax lib"
                }
              },
              "jobmine-plus.googlecode.com": {
                "textContent": 'jobmine_plus_core.js (http://code.google.com/p/jobmine-plus/)',
                "title": 'by matthewn4444 (http://code.google.com/u/@VhdUQlFZDhNNXgh4/)',
                "rex": [
                  "https?:\\/\\/jobmine-plus\\.googlecode\\.com\\/svn\\/trunk\\/scripts\\/js\\/jobmine_plus_core\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", References another script to install (80771), Uses cookies"
                }
              },
              "js-addon.googlecode.com": {
                "textContent": 'js-addon.googlecode.com',
                "title": 'by DuoHuZai (http://code.google.com/u/DuoHuZai/)',
                "rex": [
                  "^https?:\\/\\/js-addon\\.googlecode\\.com\\/files\\/autoupdatehelper\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "high",
                  "title": ", Possible Security/Privacy Risk"
                }
              },
              "pennerstore.de": {
                "textContent": 'pennerstore.de',
                "title": 'by (pennerstore.de)',
                "rex": [
                  "^https?:\\/\\/scripte\\.pennerstore\\.de\\/JS\\/updater\\.class\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "high",
                  "title": ", Possible Security Risk"
                }
              },
              "36259": {
                "textContent": 'Script AutoUpdater',
                "iconUrl": 'bb3f204908e461a17a0efebbe8907ad8',
                "title": 'by Eyal Soha (8105)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/36259\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "20145": {
                "textContent": 'Script Update Checker',
                "iconUrl": 'bee96081cd4a9e03a60d362c48da7f04',
                "title": 'by Jarett (38602)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/20145\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "8857": {
                "textContent": 'Script Updater',
                "iconUrl": '1fbd08e29b195146539a4e2c04746cbc',
                "title": 'by alien scum (8158)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/8857\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "high",
                  "title": ", BROKEN"
                }
              },
              "41075": {
                "textContent": 'Script Version Checker',
                "iconUrl": 'ba841339fac46cbddd6e571550500946',
                "title": 'by littlespark (75320)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/41075\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "high",
                  "title": ", Ability to use non-meta.js routine"
                }
              },
              "29878": {
                "textContent": 'SelfUpdaterExample',
                "iconUrl": 'f9695e2508d5064bb5fb781416913759',
                "title": 'by ScroogeMcPump (51934)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/29878\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "29880": {
                "textContent": 'SelfUpdaterExampleOpera',
                "iconUrl": 'f9695e2508d5064bb5fb781416913759',
                "title": 'by ScroogeMcPump (51934)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/29880\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "94511": {
                "textContent": 'Simpler Script Auto-Updater',
                "iconUrl": 'f93d3a59adb946dad69f577531cb5701',
                "title": 'by Karandaras (265255)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/94511\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "high",
                  "title": ", iframe vulnerability, Possible non-use of meta.js routine"
                }
              },
              "street-kicker-eu": {
                "textContent": 'street-kicker-eu',
                "title": 'by (street-kicker-eu)',
                "rex": [
                  "^https?:\\/\\/street\\-kicker\\.eu\\/js\\/updater\\.class\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "high",
                  "title": ", Possible Security Risk"
                }
              },
              "45989": {
                "textContent": 'SVC Script Version Checker',
                "iconUrl": '8c298802a4b4aa3d68217b3dc7ccd529',
                "title": 'by devnull69 (75950)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/45989\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "42456": {
                "textContent": 'Tester',
                "iconUrl": '4c2fe87eefaf73fb1c12e7d2ea09c2f5',
                "title": 'by realfree (77866)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/42456\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", Multiple search hosts, Interval vulnerability"
                }
              },
              "94712": {
                "textContent": 'update',
                "iconUrl": '9aca9fe2994da1a9ddd5ebd8aa23d4f0',
                "title": 'by abcdefgh (151532)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/94712\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "severe",
                  "title": ", Currently obfuscated, Abstraction of URL to meta.js routine, offsite xhr"
                }
              },
              "94713": {
                "textContent": 'updater',
                "iconUrl": '9aca9fe2994da1a9ddd5ebd8aa23d4f0',
                "title": 'by abcdefgh (151532)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/94713\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "high",
                  "title": ", Currently obfuscated, VAGUE and possible risk"
                }
              },
              "62036": {
                "textContent": 'update Test',
                "iconUrl": 'e112ac971d83dd545268142bc2320a3c',
                "title": 'by hirak99 (36905)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/62036\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", Interval vulnerability"
                }
              },
              "22372": {
                "textContent": 'Userscript Auto-Update Add-in',
                "iconUrl": '7f3bb64a80ac40cfb3eeb72aca9ab4c3',
                "title": 'by psycadelik (41688)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/22372\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "UserscriptAutoupdateHelper": {
                "textContent": 'userscript-autoupdate-helper',
                "title": 'by ch.null (http://code.google.com/u/ch.null/)',
                "rex": [
                  "^https?:\\/\\/userscript-autoupdate-helper\\.googlecode\\.com\\/svn\\/trunk\\/autoupdatehelper\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", i/frame vulnerability"
                }
              },
              "50390": {
                "textContent": 'Userscripts Updater',
                "iconUrl": '5e6ac8007e5f74f23bc55815ac4092ee',
                "title": 'by oneweirdkid90 (73205)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/50390\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", Outdated copy of local checker"
                }
              },
              "UserscriptUpdaterGenerator": {
                "textContent": 'Userscript Updater Generator',
                "iconUrl": '780eb60a65688584794bd832b7bde567',
                "title": 'by ΙδεΠÐ (136989)',
                "rex": [
                  "^http:\\/\\/userscript-updater-generator\\.appspot\\.com\\/\\?id=(\\d+)"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", Closed-Source"
                }
              },
              "52251": {
                "textContent": 'Userscripts - AutoUpdater',
                "iconUrl": 'af235ccf4ed8ed97b021b7c2d2501e83',
                "title": 'by Buzzy (57340)',
                "rex": [
                  "^http:\\/\\/buzzy\\.260mb\\.com\\/AutoUpdater\\.js",
                  "^http:\\/\\/buzzy\\.hostoi\\.com\\/AutoUpdater\\.js",
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/52251\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", i/frame vulnerability"
                }
              },
              "87942": {
                "derivative": 1,
                "textContent": 'Includes : Updater',
                "iconUrl": 'd1591dc87321de30c9504e7793779db1',
                "title": 'by w35l3y (55607)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/87942\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", i/frame vulnerability, derivative of Userscripts - AutoUpdater"
                }
              },
              "57756": {
                "derivative": 1,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": 'd1591dc87321de30c9504e7793779db1',
                "title": 'by PhasmaExMachina (106144)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/57756\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "severe",
                  "title": ", i/frame vulnerability, derivative of Userscripts - AutoUpdater, Possible malicious code and no script homepage."
                }
              },
              "PhasmaExMachina": {
                "textContent": 'Known PhasmaExMachina Scripts',
                "iconUrl": 'd1591dc87321de30c9504e7793779db1',
                "title": 'by PhasmaExMachina (106144)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/(?:56757|56765|56817|56869|57148|57197|57377|57786|57849|57995|58160|58179|58191|58203|58205|58710|58855|59008|59720|59879|59936|60601|62718|67294|80545)\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "severe",
                  "title": ", Possible malicious code and no script homepage."
                }
              },
              "98729": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": '5abb7219be469df175c3da5f6c3d1257',
                "title": 'by pitmm (278057)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/98729\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "95997": {
                "derivative": 3,
                "textContent": 'Script Updater (userscripts.org) BY HAKAN -MM-',
                "iconUrl": 'd5dc66cdb6f419bfeb3a04ee5e9190c1',
                "title": 'by deniz-1 (287110)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/95997\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "95992": {
                "derivative": 2,
                "textContent": 'Script Updater**',
                "iconUrl": 'fc8c1777adb39ee3002a31e448afeaba',
                "title": 'by Sathington Willoughby (281685)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/95992\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "94724": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": '5f2c16e2998a1b3c470697a791d3ad54',
                "title": 'by hachichin (128042)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/94724\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "94662": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": 'a5716130c063f76ddb42c9e93d33f5f6',
                "title": 'by AubergineAnodyne (127662)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/94662\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "94703": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": '5922688ad6ad825fe6f4ed612f220c43',
                "title": 'by MaiD450 (130846)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/94703\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "95007": {
                "derivative": 2,
                "textContent": 'Script Updater -SAFE-(userscripts.org)',
                "iconUrl": '8f6a0c6feceb4a71de649d89e31c5776',
                "title": 'by mindfox (69388)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/95007\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "99735": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": '17ab6e678b7d5079a6d3a7a5d7f3a2ac',
                "title": 'by Isgard (118652)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/99735\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "103196": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": '22dda30f2e2fcf88a42ab1dcb0f4d65a',
                "title": 'by thejackal454 (177652)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/103196\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "bealegend.c0.pl": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "title": 'used by ircdirk (214722)',
                "rex": [
                  "^https?:\\/\\/bealegend\\.c0\\.pl\\/gm_scripts\\/57756user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, offsite derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "files.kkhweb.com": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": 'c63ef58d11993cfc0f8ca5c832650b68',
                "title": 'used by Empty_Soul (100960)',
                "rex": [
                  "^https?:\\/\\/files\\.kkhweb\\.com\\/greasemonkey\\/57756\\.safe\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, offsite derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "pc-expert.pl": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": '8d5ff205fe5b06d82a7fe2ef3597e0c6',
                "title": 'used by ircdirk (214722)',
                "rex": [
                  "^https?:\\/\\/pc\\-expert\\.pl\\/sb\\/us\\/57756\\.user\\.js",
                  "^https?:\\/\\/bealegend\\.dns\\d*\\.pl\\/gm_scripts\\/57756user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, offsite derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "www.betawarriors.com": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": 'd0b4b33ed5ac937609ab837d7d525486',
                "title": 'by holyschmidt (93493)',
                "rex": [
                  "^https?:\\/\\/www\\.betawarriors\\.com\\/bin\\/gm\\/57756user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, offsite derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "xavier.hinfray.free.fr": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": '8740f823c9eadfc4cffb853115a84f05',
                "title": 'used by Fregate (126058)',
                "rex": [
                  "^https?:\\/\\/xavier\\.hinfray\\.free\\.fr\\/ikariam\\/57756\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, offsite derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "thogamerscripts.webs.com": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": 'ae864b7167d901766892a665632d75e4',
                "title": 'by thogamer (138765)',
                "rex": [
                  "^https?:\\/\\/thogamerscripts\\.webs\\.com\\/scriptupdater\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, offsite derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "home.arcor.de": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "title": 'by Multiple Authors',
                "rex": [
                  "^https?:\\/\\/home\\.arcor\\.de\\/.+\\/577user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, offsite derivative of Script Updater (userscripts.org), Possible malicious code, hashed download url"
                }
              },
              "60663": {
                "derivative": 2,
                "textContent": 'Script actualizador',
                "iconUrl": '335a5b24fbf27c9e20989a053e42f11c',
                "title": 'by Juampi_yoel (99372) es-ES',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/60663\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, es-ES derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "74144": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "iconUrl": '6eb8cf6b5065df1306ea572147ac11c7',
                "title": 'by TheSpy (106188)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/74144\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", localStorage vulnerability, i/frame vulnerability, derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "66255": {
                "derivative": 2,
                "textContent": 'Script Updater RU (userscripts.org)',
                "iconUrl": 'f9e36c9af86d922678ac91b037201d5f',
                "title": 'by liquid ghost (126462) ru-RU',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/66255\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, ru-RU derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "88544": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org) ua-UA',
                "iconUrl": '09f914766759c13acf6b88d093e0ef27',
                "title": 'by ibobalo (237833) ua-UA',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/88544\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, ua-UA derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "ika-info.ucoz.ru": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "title": 'by (ika-info.ucoz.ru)',
                "rex": [
                  "^http:\\/\\/ika-info.ucoz.ru\\/scripts\\/Script_updater\\/script_updater.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, Offsite derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "91400": {
                "derivative": 2,
                "textContent": 'Script Updater (userscripts.org)',
                "title": 'by Piyush Soni (105136)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/91400\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", i/frame vulnerability, Onsite Better Loopy derivative of Script Updater (userscripts.org), Possible malicious code"
                }
              },
              "37853": {
                "textContent": 'Userscripts.org Timed Updater',
                "iconUrl": '620d4d8ec857b915057847eeb7f248b9',
                "title": 'by jerone (31497)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/37853\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "26062": {
                "textContent": 'Userscripts Updater',
                "iconUrl": '068b7fb5725f061512446cf09aa0599e',
                "title": 'by lazyttrick (20871)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/26062\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "12193": {
                "textContent": 'UserScript Update Notification',
                "iconUrl": '0796a8386f0889176a443c8ddeef113c',
                "title": 'by Seifer (33118)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/12193\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "2296": {
                "textContent": 'User Script Updates',
                "iconUrl": 'f16d4602c1c90646438a0b534ff61889',
                "title": 'by Richard Gibson (336)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/2296\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "high",
                  "title": ", Doesn't use meta.js routine - Bandwidth waster"
                }
              },
              "39678": {
                "textContent": 'US Framework',
                "iconUrl": '620d4d8ec857b915057847eeb7f248b9',
                "title": 'by jerone (31497)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/39678\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "USOUpdater": {
                "value": "USOUpdater",
                "textContent": 'USO Updater',
                "iconUrl": "05f6e5c5e440e8513c86538ddb834096",
                "title": 'by Tim Smart (63868)',
                "updater": "usoupdater",
                "rex": [
                  "^http:\\/\\/updater\\.usotools\\.co\\.cc\\/(\\d+)\\.js"
                ],
                "url": "http://updater.usotools.co.cc/" + scriptid + ".js",
                "qsmax": "interval",
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Possible security risk"
                }
              },
              "16144": {
                "textContent": 'US Update',
                "iconUrl": '620d4d8ec857b915057847eeb7f248b9',
                "title": 'by jerone (31497)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/16144\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "46384": {
                "textContent": 'VeriVersion (module)',
                "iconUrl": 'ad95a3d96cd1986fafe1bbff032bfe1d',
                "title": 'by bluflonalgul (75209)',
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/46384\\.user\\.js"
                ],
                "securityAdvisory": {
                  "advisory": "elevated",
                  "title": ", Interval vulnerability"
                }
              },
              "zahlii.independent-irc.com": {
                "textContent": 'updater.class.js',
                "title": 'by (http://zahlii.independent-irc.com/)',
                "rex": [
                  "^https?:\\/\\/zahlii\\.independent-irc\\.com\\/.*",
                  "^https?:\\/\\/(?:raw\\.)?github\\.com\\/Zahlii/.*",
                  "^https?:\\/\\/dabei\\.kilu\\.de/.*",
                  "^https?:\\/\\/kuestenpenner\\.ku\\.ohost\\.de/.*"
                ],
                "securityAdvisory": {
                  "advisory": "severe",
                  "title": ", Updates to offsite script; Multiple redirections"
                }
              },
              "github.com-justan-gmscrobber": {
                "textContent": 'usoCheckup',
                "iconUrl": '165d78a59b842dcde5d6485f1b753de7',
                "title": 'by youmaker (265341)',
                "rex": [
                  "^https?:\\/\\/(?:raw\\.)?github\\.com\\/justan\\/gmscrobber\\/.*"
                ],
                "securityAdvisory": {
                  "advisory": "guarded",
                  "title": ", Partial and Unlicensed derivative of usoCheckup"
                }
              },
              "usoCheckup": {
                "value": "usoCheckup",
                "textContent": 'usoCheckup',
                "iconUrl": decodeURIComponent(GM_getResourceURL("usoCheckup")),
                "title": 'by tHE gREASEmONKEYS (multiple contributors)',
                "updater": "usocheckup",
                "rex": [
                  "^http:\\/\\/usocheckup\\.redirectme\\.net\\/(\\d+)\\.js",
                  "^http:\\/\\/usocheckup\\.dune\\.net\\/(\\d+)\\.js",  // This is deprecated DO NOT USE
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
                "iconUrl": decodeURIComponent(GM_getResourceURL("usoCheckupBeta")),
                "title": 'by tHE gREASEmONKEYS (multiple contributors)',
                "updater": "usocheckup",
                "rex": [
                  "^http:\\/\\/beta\\.usocheckup\\.dune\\.net\\/(\\d+)\\.js"
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
                "iconUrl": "e615596ec6d7191ab628a1f0cec0006d",
                "title": 'themed by Marti Martz (37004)',
                "updater": "usocheckup",
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/show\\/82206"
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
                "iconUrl": "e615596ec6d7191ab628a1f0cec0006d",
                "title": 'themed by Marti Martz (37004)',
                "updater": "usocheckup",
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/show\\/60926"
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
                "iconUrl": "e615596ec6d7191ab628a1f0cec0006d",
                "title": 'themed by Marti Martz (37004)',
                "updater": "usocheckup",
                "rex": [
                  "^https?:\\/\\/userscripts\\.org\\/scripts\\/show\\/68506"
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
                "iconUrl": "e615596ec6d7191ab628a1f0cec0006d",
                "title": 'themed by Marti Martz (37004)',
                "updater": "usocheckup",
                "rex": [
                  "^http:\\/\\/userscripts\\.org\\/scripts\\/show\\/61794"
                ],
                "url": "http://usocheckup.redirectme.net/" + scriptid + ".js",
                "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=61794,66530,67771,74732&custom=yes&trim=de,pt&id=usoCheckup",
                "qsmax": "maxage",
                "qsmin": "minage",
                "securityAdvisory": {
                  "advisory": "low",
                  "title": ""
                }
              },
              "PotentialSpammer": {
                "textContent": 'PotentialSpammer',
                "title": 'by potential spammer',
                "rex": [
                  " ",
                  "http:\\/\\/0rz\\.tw",
                  "http:\\/\\/2tu\\.us",
                  "http:\\/\\/3\\.ly",
                  "http:\\/\\/55c\\.cc",
                  "http:\\/\\/6url\\.com",
                  "http:\\/\\/adf\\.ly",
                  "http:\\/\\/alturl\\.com",
                  "http:\\/\\/arm\\.in",
                  "http:\\/\\/awe\\.sm",
                  "http:\\/\\/b23\\.ru",
                  "http:\\/\\/bacn\\.me",
                  "http:\\/\\/bit\\.ly",
                  "http:\\/\\/bitly\\.com",
                  "http:\\/\\/budurl\\.com",
                  "http:\\/\\/chilp\\.it",
                  "http:\\/\\/cli\\.gs",
                  "http:\\/\\/cuthut\\.com",
                  "http:\\/\\/digg\\.com",
                  "http:\\/\\/doiop\\.com",
                  "http:\\/\\/elfurl\\.com",
                  "http:\\/\\/fat\\.ly",
                  "http:\\/\\/ff\\.im",
                  "http:\\/\\/fileups\\.net",
                  "http:\\/\\/fur\\.ly",
                  "http:\\/\\/fwd4\\.me",
                  "http:\\/\\/gol\\.ly",
                  "http:\\/\\/good\\.ly",
                  "http:\\/\\/goo\\.gl",
                  "http:\\/\\/i5\\.be",
                  "http:\\/\\/icanhaz\\.com",
                  "http:\\/\\/idek\\.net",
                  "http:\\/\\/is\\.gd",
                  "http:\\/\\/kl\\.am",
                  "http:\\/\\/korta\\.nu",
                  "http:\\/\\/linkbee\\.com",
                  "http:\\/\\/liurl\\.cn",
                  "http:\\/\\/lnk\\.by",
                  "http:\\/\\/lnk\\.in",
                  "http:\\/\\/ln-s\\.net",
                  "http:\\/\\/m2lb\\.info",
                  "http:\\/\\/merky\\.de",
                  "http:\\/\\/migre\\.me",
                  "http:\\/\\/minify\\.me",
                  "http:\\/\\/minurl\\.org",
                  "http:\\/\\/moourl\\.com",
                  "http:\\/\\/myurl\\.in",
                  "http:\\/\\/ninjalink\\.com",
                  "http:\\/\\/no1\\.in",
                  "http:\\/\\/nsfw\\.in",
                  "http:\\/\\/oneclip\\.jp",
                  "http:\\/\\/ow\\.ly",
                  "http:\\/\\/ping\\.fm",
                  "http:\\/\\/p\\.ly",
                  "http:\\/\\/pnt\\.me",
                  "http:\\/\\/ponyurl\\.com",
                  "http:\\/\\/p\\.zurl\\.ws",
                  "http:\\/\\/reallytinyurl\\.com",
                  "http:\\/\\/retwt\\.me",
                  "http:\\/\\/r\\.im",
                  "http:\\/\\/ri\\.ms",
                  "http:\\/\\/rubyurl\\.com",
                  "http:\\/\\/sexyurl\\.to",
                  "http:\\/\\/short\\.ie",
                  "http:\\/\\/short\\.to",
                  "http:\\/\\/shorturl\\.com",
                  "http:\\/\\/simurl\\.com",
                  "http:\\/\\/slnk\\.me",
                  "http:\\/\\/sn\\.im",
                  "http:\\/\\/snipr\\.com",
                  "http:\\/\\/snipurl\\.com",
                  "http:\\/\\/snurl\\.com",
                  "http:\\/\\/su\\.ly",
                  "http:\\/\\/su\\.pr",
                  "http:\\/\\/tcrn\\.ch",
                  "http:\\/\\/thecow\\.me",
                  "http:\\/\\/tighturl\\.com",
                  "http:\\/\\/tiny\\.cc",
                  "http:\\/\\/tinyftw\\.com",
                  "http:\\/\\/tinyurl\\.com",
                  "http:\\/\\/togoto\\.us",
                  "http:\\/\\/to\\.ly",
                  "http:\\/\\/traceurl\\.com",
                  "http:\\/\\/tra\\.kz",
                  "http:\\/\\/tr\\.im",
                  "http:\\/\\/tweetburner\\.com",
                  "http:\\/\\/twurl\\.nl",
                  "http:\\/\\/unhub\\.com",
                  "http:\\/\\/u\\.nu",
                  "http:\\/\\/ur1\\.ca",
                  "http:\\/\\/url\\.az",
                  "http:\\/\\/urlcut\\.com",
                  "http:\\/\\/urlenco\\.de",
                  "http:\\/\\/url\\.ie",
                  "http:\\/\\/urlpass\\.com\\/",
                  "http:\\/\\/viigo\\.im",
                  "http:\\/\\/w3t\\.org",
                  "http:\\/\\/wurl\\.ws",
                  "http:\\/\\/www\\.cloakreferer\\.com",
                  "http:\\/\\/www\\.x\\.se",
                  "http:\\/\\/xr\\.com",
                  "http:\\/\\/xrl\\.us",
                  "http:\\/\\/yatuc\\.com",
                  "http:\\/\\/yep\\.it",
                  "http:\\/\\/zurl\\.ws",
                  "http:\\/\\/sharecash.org"
                ],
                "securityAdvisory": {
                  "advisory": "severe",
                  "title": ", POSSIBLE DANGEROUS SCRIPT"
                }
              }
            }

            let lastAdvisory = 0;
            let lastUpdater = {};
            if (headers["require"])
              for each (let require in (typeof headers["require"] == "string") ? [headers["require"]] : headers["require"])
                for each (let updater in updaters)
                  for each (let rex in updater["rex"]) {
                    let sid = require.match(new RegExp(rex  + ".*", "i"));
                    if (sid) {
                      if (sid[1] == scriptid || sid[1] == null) {
                        if (lastAdvisory < securityAdvisory[updater["securityAdvisory"]["advisory"]]["index"]) {
                          lastAdvisory = securityAdvisory[updater["securityAdvisory"]["advisory"]]["index"];
                          lastUpdater = updater;
                        }
                        installNode.setAttribute("title", securityAdvisory[updater["securityAdvisory"]["advisory"]]["title"] + updater["securityAdvisory"]["title"]);
                        GM_addStyle(
                            "#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                          + securityAdvisory[updater["securityAdvisory"]["advisory"]]["background-image"]
                          + "); } #install_script a.userjs:hover { color: black;}"
                        );
                      }
                      else {
                        installNode.setAttribute("title", "Security Advisory: GUARDED, Possible malformed updater syntax, Possible Security Risk");
                        GM_addStyle(
                            "#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                          + securityAdvisory["guarded"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}"
                        );
                        return;
                      }
                    }
                  }
            if (lastAdvisory > 0) {
              installNode.setAttribute("title", securityAdvisory[lastUpdater["securityAdvisory"]["advisory"]]["title"] + lastUpdater["securityAdvisory"]["title"]);
              GM_addStyle(
                  "#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                + securityAdvisory[lastUpdater["securityAdvisory"]["advisory"]]["background-image"]
                + "); } #install_script a.userjs:hover { color: black;}");
              return;
            }

            if (headers["include"])
              for each (let include in (typeof headers["include"] == "string") ? [headers["include"]] : headers["include"])
                for each (let updater in updaters)
                  for each (let rex in updater["rex"])
                    if (include.match(new RegExp(rex  + ".*", "i"))) {
                      installNode.setAttribute("title",
                        securityAdvisory[updater["securityAdvisory"]["advisory"]]["title"] + updater["securityAdvisory"]["title"]);
                      GM_addStyle(
                          "#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                        + securityAdvisory[updater["securityAdvisory"]["advisory"]]["background-image"]
                        + "); } #install_script a.userjs:hover { color: black;}");
                      return;
                    }

            let rex = new RegExp("https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/" + scriptid + "\\.user\\.js", "i");
            if (headers["updateURL"] && headers["updateURL"].match(rex))
                DDoS = true;

            let helpNode = document.evaluate(
              "//div[@id='install_script']/a[@class='help']",
              document.body,
              null,
              XPathResult.ANY_UNORDERED_NODE_TYPE,
              null
            );

            if (helpNode && helpNode.singleNodeValue)
              helpNode = helpNode.singleNodeValue;
            else
              return;

            let thisNode = installNode;
            thisNode.textContent += ' with';
            thisNode.style.setProperty("font-size", "1.0em", "");

            thisNode = helpNode;
            let qmark = decodeURIComponent(GM_getResourceURL("qmark"));

            thisNode.style.setProperty("width", "16px", "");
            thisNode.style.setProperty("height", "16px", "");
            thisNode.style.setProperty("margin-top", "0.6em", "");
            thisNode.style.setProperty("background", "transparent url(" + qmark + ") no-repeat scroll top left", "");
            thisNode.style.setProperty("float", "right", "");

            thisNode.textContent = "";

            let selectNode = document.createElement("select");
            selectNode.setAttribute("id", "updater_select");
            selectNode.style.setProperty("width", "90%", "");
            selectNode.style.setProperty("height", "1.6em", "");
            selectNode.style.setProperty("font-size", "0.9em", "");
            selectNode.addEventListener("change", function(ev) {
              let thisUpdater = updaters[this.value];
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

                  function appendListItem(list, item) {
                    if (item)
                      list += (!list) ? item : "," + item;
                    return list;
                  }

                  let qs = "";
                  qs = appendQSP(qs, ((!thisUpdater["value"].match(/usoCheckup.*/i)) ? "updater=" + thisUpdater["value"] : "") );
                  qs = appendQSP(qs, ((thisUpdater["qsmax"]) ? thisUpdater["qsmax"] + "=" + parseInt(Math.abs(gmc.get("updaterMaxage"))) : ""));
                  if (thisUpdater["qsmin"] && gmc.get("updaterMinage") != 1)
                    qs = appendQSP(qs, (thisUpdater["qsmin"] + "=" + parseInt(Math.abs(gmc.get("updaterMinage")))));
                  qs = appendQSP(qs, thisUpdater["qs"]);

                  let gravatar = getAvatarid();
                  let icontype = getIcontype();

                  if (gravatar)
                    gmc.fields["useGravatarIcon"].settings.label = "<img style='vertical-align: middle; width: 32px; height: 32px; margin-right: 0.5em;' src='http://www.gravatar.com/avatar.php?gravatar_id=" + gravatar + "&r=PG&s=32&default=identicon' alt='Use this authors gravatar when available' title='Use this authors gravatar when available' />";
                  else
                    gmc.fields["useGravatarIcon"].settings.label = "<img style='vertical-align: middle; width: 32px; height: 32px; margin-right: 0.5em;' alt='Use this authors gravatar when available' title='Use this authors gravatar when available' />";


                  if (icontype)
                    gmc.fields["useScriptIcon"].settings.label = "<img style='vertical-align: middle; width: 32px; height: 32px;' src='http://s3.amazonaws.com/uso_ss/icon/" + scriptid + "/thumb." + icontype + "'  alt='Favor this scripts USO icon when available' title='Favor this scripts USO icon when available'/>";
                  else
                    gmc.fields["useScriptIcon"].settings.label = "<img style='vertical-align: middle; width: 32px; height: 32px;' alt='Favor this scripts USO icon when available' title='Favor this scripts USO icon when available'/>";




                  let icon = "";
                  if (gmc.get("useGravatarIcon") && gravatar)
                    icon = appendListItem(icon, gravatar);

                  if (gmc.get("useScriptIcon") && icontype)
                    icon = appendListItem(icon, icontype);


                  if (icon)
                    qs = appendQSP(qs, "icon=" + icon);


                  let frag = "#.user.js";

                  let url = "http://" + ((thisUpdater["beta"]) ? "beta.usocheckup.dune" : "usocheckup.redirectme") + ".net/" + scriptid + ".user.js" + qs + frag;
                  installNode.setAttribute("href", url);

                  if (DDoS) {
                    installNode.setAttribute("title", "Security Advisory: SEVERE, DDoS attack script via updateURL metadata block key, Check source for additional embedded updaters");
                    GM_addStyle(
                        "#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                      + securityAdvisory["severe"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}"
                    );
                  }
                  else if (possibleEmbedded) {
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

            let updaterNode, iconNode, textNode;
            for each (let updater in updaters)
              if (updater["value"]) {

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
                iconNode.style.setProperty("background", "transparent url(" + ((updater["iconUrl"]) ? (updater["iconUrl"].match(/^(?:http:|data:)/) ? updater["iconUrl"] : "http://www.gravatar.com/avatar.php?gravatar_id=" + updater["iconUrl"] + "&r=PG&s=16&default=identicon") : "") + ") no-repeat center center", "");

                updaterNode.appendChild(iconNode);
                iconNode.setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");

                updaterNode.appendChild(textNode);
                selectNode.appendChild(updaterNode);
              }

            selectNode.selectedIndex = 0;

            let updaterPreference = GM_getValue(":updaterPreference", "uso");
            for (let i = 0, len = selectNode.options.length; i < len; ++i)
              if (selectNode.options[i].value == updaterPreference) {
                selectNode.selectedIndex = i;
                break;
              }

            let ev = document.createEvent("HTMLEvents");
            ev.initEvent("change", true, true);
            selectNode.dispatchEvent(ev);

            break;
          case 403:
            installNode.setAttribute("title", securityAdvisory["elevated"]["title"] + ', UNLISTED');
            GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                + securityAdvisory["elevated"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}");

            break;
          default:
            installNode.setAttribute("title", securityAdvisory["undetermined"]["title"]);
            GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url("
                + securityAdvisory["undetermined"]["background-image"] + ") !important; } #install_script a.userjs:hover { color: black;}");

            break;
        }
      }
    });

})();
