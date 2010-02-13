(function() {

// ==UserScript==
// @name          uso - installWith
// @namespace     http://userscripts.org/users/37004
// @description   Adds option to install script with an updater
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.0.21
// @include http://userscripts.org/scripts/show/*
// @include https://userscripts.org/scripts/show/*
// @require http://usocheckup.dune.net/68219.js?method=install&open=window&maxage=14&custom=yes&topicid=45479&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  var frameless = false;
  try {
    frameless = (window === window.top);
  }
  catch (e) {}

  // Clean up USO for framed presentation
  if (!frameless && window.location.href.match(/^http[s]{0,1}:\/\/userscripts\.org\/scripts\/show\/.*/i)) {
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
  }

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
    return scriptid[1];
  }

  var scriptid = getScriptid();
  GM_xmlhttpRequest({
    url: "http://userscripts.org/scripts/source/" + scriptid + ".user.js?",
    method: "HEAD",
    onload: function(xhr) {
      if (xhr.status == 200) {
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
                  } else
                    header = headers;
                  if (header[key] && !(header[key] instanceof Array))
                    header[key] = new Array(header[key]);
                  if (header[key] instanceof Array)
                    header[key].push(value);
                  else
                    header[key] = value;
                }
                headers["licence"] = headers["license"];

                var updaters = {
                  "AnotherAutoUpdater": {
                    "value": "AnotherAutoUpdater",
                    "textContent": 'Another Auto Updater',
                    "title": 'by sizzlemctwizzle (27715)',
                    "updater": "anotherautoupdater",
                    "url": [
                      "^http:\\/\\/sizzlemctwizzle\\.com\\/updater\\.php\\?id=" + scriptid,
                      "^http:\\/\\/vulcan\\.ist\\.unomaha\\.edu\\/~medleymj\\/updater\\/" + scriptid + "\\.js"
                    ],
                    "qs": "show"
                  },
                  "16338": {
                    "value": "",
                    "textContent": 'AutoUpdate Test',
                    "title": 'by TastyFlySoup (39661)',
                    "updater": "16338",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/16338\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "45904": {
                    "value": "",
                    "textContent": 'Easy Update Code',
                    "title": 'by shoecream (74855)',
                    "updater": "45904",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/45904\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "45266": {
                    "value": "",
                    "textContent": 'easy userscript updater snippet',
                    "title": 'by thomd (43919)',
                    "updater": "45266",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/45266\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "35611": {
                    "value": "",
                    "textContent": 'GM Script Update Control',
                    "title": 'by Sylvain Comte (21175)',
                    "updater": "35611",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/35611\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "51513": {
                    "value": "",
                    "textContent": 'GM_ScriptUpdater',
                    "title": 'by IzzySoft (89585)',
                    "updater": "51513",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/51513\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "38788": {
                    "value": "",
                    "textContent": 'Includes : CheckForUpdate',
                    "title": 'by w35l3y (55607)',
                    "updater": "38788",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/38788\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "36259": {
                    "value": "",
                    "textContent": 'Script AutoUpdater',
                    "title": 'by Eyal Soha (8105)',
                    "updater": "36259",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/36259\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "20145": {
                    "value": "",
                    "textContent": 'Script Update Checker',
                    "title": 'by Jarett (38602)',
                    "updater": "20145",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/20145\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "8857": {
                    "value": "",
                    "textContent": 'Script Updater',
                    "title": 'by alien scum (8158)',
                    "updater": "8857",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/8857\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "57756": {
                    "value": "",
                    "textContent": 'Script Updater (userscripts.org)',
                    "title": 'by PhasmaExMachina (106144)',
                    "updater": "57756",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/57756\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "41075": {
                    "value": "",
                    "textContent": 'Script Version Checker',
                    "title": 'by littlespark (75320)',
                    "updater": "41075",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/41075\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "29878": {
                    "value": "",
                    "textContent": 'SelfUpdaterExample',
                    "title": 'by ScroogeMcPump (51934)',
                    "updater": "29878",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/29878\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "29880": {
                    "value": "",
                    "textContent": 'SelfUpdaterExampleOpera',
                    "title": 'by ScroogeMcPump (51934)',
                    "updater": "29880",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/29880\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "45989": {
                    "value": "",
                    "textContent": 'SVC Script Version Checker',
                    "title": 'by devnull69 (75950)',
                    "updater": "45989",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/45989\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "22372": {
                    "value": "",
                    "textContent": 'Userscript Auto-Update Add-in',
                    "title": 'by psycadelik (41688)',
                    "updater": "22372",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/22372\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "52251": {
                    "value": "",
                    "textContent": 'Userscripts - AutoUpdater',
                    "title": 'by Buzzy (57340)',
                    "updater": "52251",
                    "url": [
                      "^http:\\/\\/buzzy\\.260mb\\.com\\/AutoUpdater\\.js",
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/52251\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "37853": {
                    "value": "",
                    "textContent": 'Userscripts.org Timed Updater',
                    "title": 'by jerone (31497)',
                    "updater": "37853",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/37853\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "26062": {
                    "value": "",
                    "textContent": 'Userscripts Updater',
                    "title": 'by lazyttrick (20871)',
                    "updater": "26062",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/26062\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "12193": {
                    "value": "",
                    "textContent": 'UserScript Update Notification',
                    "title": 'by Seifer (33118)',
                    "updater": "12193",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/12193\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "2296": {
                    "value": "",
                    "textContent": 'User Script Updates',
                    "title": 'by Richard Gibson (336)',
                    "updater": "2296",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/2296\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "39678": {
                    "value": "",
                    "textContent": 'US Framework',
                    "title": 'by jerone (31497)',
                    "updater": "39678",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/39678\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "USOUpdater": {
                    "value": "USOUpdater",
                    "textContent": 'USO Updater',
                    "title": 'by Tim Smart (63868)',
                    "updater": "usoupdater",
                    "url": [
                      "^http:\\/\\/updater\\.usotools\\.co\\.cc\\/" + scriptid + "\\.js"
                    ],
                    "qs": ""
                  },
                  "16144": {
                    "value": "",
                    "textContent": 'US Update',
                    "title": 'by jerone (31497)',
                    "updater": "16144",
                    "url": [
                      "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/16144\\.user\\.js"
                    ],
                    "qs": ""
                  },
                  "usoCheckup": {
                    "value": "usoCheckup",
                    "textContent": 'usoCheckup',
                    "title": 'by tHE gREASEmONKEYS (multiple contributors)',
                    "updater": "usocheckup",
                    "url": [
                      "^http:\\/\\/usocheckup\\.dune\\.net\\/" + scriptid + "\\.js",
                      "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                    ],
                    "qs": "wrapper=" + scriptid
                  },
                  "usoCheckupbottomsUp": {
                    "value": "usoCheckupbottomsUp",
                    "textContent": 'usoCheckup + bottomsUp',
                    "title": 'themed by Marti Martz (37004)',
                    "updater": "usocheckup",
                    "url": [
                      "^http:\\/\\/usocheckup\\.dune\\.net\\/" + scriptid + "\\.js",
                      "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                    ],
                    "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=68506&custom=yes&id=usoCheckup"
                  },
                  "usoCheckupDOMNotify": {
                    "value": "usoCheckupDOMNotify",
                    "textContent": 'usoCheckup + DOMNotify',
                    "title": 'themed by Marti Martz (37004)',
                    "updater": "usocheckup",
                    "url": [
                      "^http:\\/\\/usocheckup\\.dune\\.net\\/" + scriptid + "\\.js",
                      "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                    ],
                    "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=61794&custom=yes&id=usoCheckup"
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
                      for each (var url in updater["url"]) {
                        var rex = new RegExp(url  + ".*", "i");
                        if (require.match(rex))
                          return;
                      }

                }

                var installNode = document.evaluate(
                  "//div[@id='install_script']/a[@class='userjs']",
                  document,
                  null,
                  XPathResult.ANY_UNORDERED_NODE_TYPE,
                  null
                );

                if (installNode && installNode.singleNodeValue)
                  installNode = installNode.singleNodeValue;
                else
                  return;

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
                thisNode.setAttribute("style", "font-size: 1.0em;");

                thisNode = helpNode;
                var qmark = "data:image/png;base64,"
                  + "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A"
                  + "/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oCBhUpFGSrs1gAAANFSURBVDjL"
                  + "bZNdTFt1HIaf3/lqz2jlo8CAwYSJorBEJSY2McvGBWZkMZipkUQzP4jezZhwI15qDIkGExNuZkac"
                  + "mWKUaMQEP4IfmXObxEy8YHW6iatYSqGlh5aWtpxz/t4w44XP1Xvx5L16XxkcHGRmZobJyUkZHh5W"
                  + "AO+fOdXseao7mcntq5RLiFtKXIldiX0wPZMEGBsbY3R0FAABmJubo7+/nxOPH9WjfY+9tLqefb5Q"
                  + "LO63vCKe71NwdXzf/XNrc+Pts+9OvgVss4uMj4/LyMiImnrnVTuRjXyxmkwevkO7TNS+6kYC20qM"
                  + "IOt+g1xwOoyFTCPZrPP1x9Nnh4CMUgpRSiEijL0+8bmzfn3g4c7PiLbFFbaJm0d8D2XVGaA1c/7a"
                  + "fpma7+C368nZ776ZHVJKbRkiwmtjbz67lkoNPHT3LNHeJYpFU/6Y9lm9KCiFRHrKdJ1Y4tARnaJp"
                  + "cDrbeKzjQNfTIjKhAWYmk3uqPhSj74FrqhyGtW8Vy2/oBIoQtn21PqWT+NTDtf7mwSMrqq2pQkNj"
                  + "85NAi/bCyWc6M+lsT8+BRQjdjmYfItQK3c/tcN/pCp3HFI2+hr1t4KktMg607c2g68ZtukaPkc/l"
                  + "qzfz6pZwME25FJWyNsB29w2M3mVW3jOpnDKkLuoRekSxEgcNT+rDFSplqizLaDCWlxN+RdVXkvGg"
                  + "mWu6hBcsKbZcKhmT/PcG2kGFdlKkqJuI41O9N0CpsIOzWXB3dlxNW1yMpVKpZOLnX8NEjIIysuel"
                  + "ipyEfUtqWpHaHo1QrY5d0gibVdTYtrq0UGJjI+24HmltdW0znlxZ/nHmXJGleEjq94SwlIWZM/B/"
                  + "UvgLCqtoEvAUkch+Lv+i5KsfUjhO5ipwQwcolwrJbLZ8fD7m28d7LVUTssSvCGazTvAug0CtyJ66"
                  + "FuKJiHr05Zgs/ZXeRLkTwLze3t6O4zgJcCuJ9M7RTy6UpSNscrDVVvatFnZTFeLV89E5ZOiVmCwl"
                  + "tgDOAB+KSOLmpAnoWMCLwAqgmmt01XdnUB3uCqrG6oACFJASmADuAYx/z/QfqoD7gSeAe4GaXScP"
                  + "/A58CVzcze7/FQCYQK3APk1oUWD4CgdYB1YBB/Bvyv8Asu15fjeIVHcAAAAASUVORK5CYII=";

                thisNode.setAttribute("style", "width: 16px; height: 16px; margin-top: 0.6em; background: transparent url("
                  + qmark
                  + ") no-repeat center center; float: right;");
                thisNode.textContent = "";

                var selectNode = document.createElement("select");
                selectNode.setAttribute("style", "width: 90%; font-size: 0.9em;");
                selectNode.addEventListener("change", function(ev) {
                  var installNode = document.evaluate(
                    "//div[@id='install_script']/a[@class='userjs']",
                    document,
                    null,
                    XPathResult.ANY_UNORDERED_NODE_TYPE,
                    null
                  );

                  if (installNode && installNode.singleNodeValue) {
                    var thisNode = installNode.singleNodeValue;
                    thisNode.style.backgroundRepeat = "repeat-x";

                    var pathtoWrapper = "http://usocheckup.dune.net/" + scriptid + ".user.js";

                    if (ev.target.value == "") {
                      thisNode.setAttribute("href", "/scripts/source/" + scriptid + ".user.js");
                      thisNode.removeAttribute("title");
                    }
                    else {
                      var updater = updaters[ev.target.value]["updater"];
                      var qs =  updaters[ev.target.value]["qs"];

                      thisNode.setAttribute("href", "http://usocheckup.dune.net/" + scriptid + ".user.js"
                        + ((updater != "usocheckup") ? "?updater=" + updater : "")
                        + ((qs) ? ((updater == "usocheckup") ? "?" : "&") + qs : "")
                        + ((updater == "usocheckup" && !qs) ? "?is=.user.js" : "&is=.user.js"));
                      thisNode.setAttribute("title", "Are you sure this script doesn't have an updater?");
                    }
                  }
                }, true);

                var defaultNode = document.createElement("option");
                defaultNode.setAttribute("value", "");
                defaultNode.textContent = "* populating list *";
                selectNode.appendChild(defaultNode);

              thisNode.parentNode.insertBefore(selectNode, thisNode);

                var updaterNode;
                for each (var updater in updaters)
                  if (updater["value"] != "") {
                    updaterNode = document.createElement("option");
                    updaterNode.setAttribute("value", updater["value"]);
                    updaterNode.setAttribute("title", updater["title"]);
                    updaterNode.textContent = updater["textContent"];
                    selectNode.appendChild(updaterNode);
                  }

                defaultNode.textContent = "userscripts.org (default)";
                selectNode.selectedIndex = 0;

                var ev = document.createEvent("HTMLEvents");
                ev.initEvent("change", true, true);
                selectNode.dispatchEvent(ev);
            }
          }
        });
      }
    }
  });
})();
