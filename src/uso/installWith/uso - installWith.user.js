(function() {

// ==UserScript==
// @name          uso - installWith
// @namespace     http://userscripts.org/users/37004
// @description   Adds option to install script with an updater
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.1.6
// @include   http://userscripts.org/scripts/*/*
// @include   https://userscripts.org/scripts/*/*
// @include   http://userscripts.org/topics/*
// @include   https://userscripts.org/topics/*
// @include   http://userscripts.org/reviews/*
// @include   https://userscripts.org/reviews/*
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
    return (scriptid) ? scriptid[1] : undefined;
  }

  var scriptid = getScriptid();
  if (scriptid) {
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
                    "uso": {
                      "value": "uso",
                      "textContent": 'userscripts.org (default)',
                      "title": '',
                      "updater": "",
                      "rex": [],
                      "url": "",
                      "qs": ""
                    },
                    "-": {
                      "value": "-",
                      "textContent": '---------------',
                      "title": '',
                      "updater": "",
                      "rex": [],
                      "url": "",
                      "qs": ""
                    },
                    "AnotherAutoUpdater": {
                      "value": "AnotherAutoUpdater",
                      "textContent": 'Another Auto Updater',
                      "title": 'by sizzlemctwizzle (27715)',
                      "updater": "anotherautoupdater",
                      "rex": [
                        "^http:\\/\\/sizzlemctwizzle\\.com\\/updater\\.php\\?id=\\d+",
                        "^http:\\/\\/vulcan\\.ist\\.unomaha\\.edu\\/~medleymj\\/updater\\/\\d+\\.js"
                      ],
                      "url": "http://sizzlemctwizzle.com/updater.php?id=" + scriptid,
                      "qs": "show"
                    },
                    "16338": {
                      "value": "",
                      "textContent": 'AutoUpdate Test',
                      "title": 'by TastyFlySoup (39661)',
                      "updater": "16338",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/16338\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "45904": {
                      "value": "",
                      "textContent": 'Easy Update Code',
                      "title": 'by shoecream (74855)',
                      "updater": "45904",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/45904\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "45266": {
                      "value": "",
                      "textContent": 'easy userscript updater snippet',
                      "title": 'by thomd (43919)',
                      "updater": "45266",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/45266\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "35611": {
                      "value": "",
                      "textContent": 'GM Script Update Control',
                      "title": 'by Sylvain Comte (21175)',
                      "updater": "35611",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/35611\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "51513": {
                      "value": "",
                      "textContent": 'GM_ScriptUpdater',
                      "title": 'by IzzySoft (89585)',
                      "updater": "51513",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/51513\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "38788": {
                      "value": "",
                      "textContent": 'Includes : CheckForUpdate',
                      "title": 'by w35l3y (55607)',
                      "updater": "38788",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/38788\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "36259": {
                      "value": "",
                      "textContent": 'Script AutoUpdater',
                      "title": 'by Eyal Soha (8105)',
                      "updater": "36259",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/36259\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "20145": {
                      "value": "",
                      "textContent": 'Script Update Checker',
                      "title": 'by Jarett (38602)',
                      "updater": "20145",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/20145\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "8857": {
                      "value": "",
                      "textContent": 'Script Updater',
                      "title": 'by alien scum (8158)',
                      "updater": "8857",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/8857\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "57756": {
                      "value": "",
                      "textContent": 'Script Updater (userscripts.org)',
                      "title": 'by PhasmaExMachina (106144)',
                      "updater": "57756",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/57756\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "41075": {
                      "value": "",
                      "textContent": 'Script Version Checker',
                      "title": 'by littlespark (75320)',
                      "updater": "41075",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/41075\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "29878": {
                      "value": "",
                      "textContent": 'SelfUpdaterExample',
                      "title": 'by ScroogeMcPump (51934)',
                      "updater": "29878",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/29878\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "29880": {
                      "value": "",
                      "textContent": 'SelfUpdaterExampleOpera',
                      "title": 'by ScroogeMcPump (51934)',
                      "updater": "29880",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/29880\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "45989": {
                      "value": "",
                      "textContent": 'SVC Script Version Checker',
                      "title": 'by devnull69 (75950)',
                      "updater": "45989",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/45989\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "22372": {
                      "value": "",
                      "textContent": 'Userscript Auto-Update Add-in',
                      "title": 'by psycadelik (41688)',
                      "updater": "22372",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/22372\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "52251": {
                      "value": "",
                      "textContent": 'Userscripts - AutoUpdater',
                      "title": 'by Buzzy (57340)',
                      "updater": "52251",
                      "rex": [
                        "^http:\\/\\/buzzy\\.260mb\\.com\\/AutoUpdater\\.js",
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/52251\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "37853": {
                      "value": "",
                      "textContent": 'Userscripts.org Timed Updater',
                      "title": 'by jerone (31497)',
                      "updater": "37853",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/37853\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "26062": {
                      "value": "",
                      "textContent": 'Userscripts Updater',
                      "title": 'by lazyttrick (20871)',
                      "updater": "26062",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/26062\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "12193": {
                      "value": "",
                      "textContent": 'UserScript Update Notification',
                      "title": 'by Seifer (33118)',
                      "updater": "12193",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/12193\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "2296": {
                      "value": "",
                      "textContent": 'User Script Updates',
                      "title": 'by Richard Gibson (336)',
                      "updater": "2296",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/2296\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "39678": {
                      "value": "",
                      "textContent": 'US Framework',
                      "title": 'by jerone (31497)',
                      "updater": "39678",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/39678\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "USOUpdater": {
                      "value": "USOUpdater",
                      "textContent": 'USO Updater',
                      "title": 'by Tim Smart (63868)',
                      "updater": "usoupdater",
                      "rex": [
                        "^http:\\/\\/updater\\.usotools\\.co\\.cc\\/\\d+\\.js"
                      ],
                      "url": "http://updater.usotools.co.cc/" + scriptid + ".js",
                      "qs": ""
                    },
                    "16144": {
                      "value": "",
                      "textContent": 'US Update',
                      "title": 'by jerone (31497)',
                      "updater": "16144",
                      "rex": [
                        "^http[s]{0,1}:\\/\\/userscripts\\.org\\/scripts\\/source\\/16144\\.user\\.js"
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "--": {
                      "value": "-",
                      "textContent": '---------------',
                      "title": '',
                      "updater": "",
                      "rex": [
                      ],
                      "url": "",
                      "qs": ""
                    },
                    "usoCheckup": {
                      "value": "usoCheckup",
                      "textContent": 'usoCheckup',
                      "title": 'by tHE gREASEmONKEYS (multiple contributors)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/\\d+\\.js",
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                      ],
                      "url": "http://usocheckup.dune.net/" + scriptid + ".js",
                      "qs": "wrapper=" + scriptid
                    },
                    "usoCheckupbottomsUp": {
                      "value": "usoCheckupbottomsUp",
                      "textContent": 'usoCheckup + bottomsUp',
                      "title": 'themed by Marti Martz (37004)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/\\d+\\.js",
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                      ],
                      "url": "http://usocheckup.dune.net/" + scriptid + ".js",
                      "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=68506&custom=yes&id=usoCheckup"
                    },
                    "usoCheckupDOMNotify": {
                      "value": "usoCheckupDOMNotify",
                      "textContent": 'usoCheckup + DOMNotify',
                      "title": 'themed by Marti Martz (37004)',
                      "updater": "usocheckup",
                      "rex": [
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/\\d+\\.js",
                        "^http:\\/\\/usocheckup\\.dune\\.net\\/index.php\\?"  // This is deprecated DO NOT USE
                      ],
                      "url": "http://usocheckup.dune.net/" + scriptid + ".js",
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
                        for each (var rex in updater["rex"])
                          if (updater["value"] != "-" && require.match(new RegExp(rex  + ".*", "i")))
                            return;
                  }

                  var skipVerify = GM_getValue(":skipVerify", false);

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

                  if (!skipVerify) {
                    thisNode.setAttribute("href", "javascript:void(0);");
                    thisNode.addEventListener("click", function(ev) {
                      var xpr = document.evaluate(
                        "//select[@id='usoCWrap']",
                        document,
                        null,
                        XPathResult.ANY_UNORDERED_NODE_TYPE,
                        null
                      );

                      if (xpr && xpr.singleNodeValue) {
                        selectNode = xpr.singleNodeValue;

                        var thisUpdater = updaters[selectNode.options[selectNode.selectedIndex].value];

                        if (thisUpdater.value == "uso") {
                          var url = window.location.protocol + "//userscripts.org/scripts/source/" + scriptid + ".user.js";
                          window.location.href = url;
                        }
                        else {
                          GM_xmlhttpRequest({
                            url: thisUpdater["url"],
                            method: "HEAD",
                            onload: function(xhr) {
                              if (xhr.status == 200) {
                                GM_xmlhttpRequest({
                                  url: "http://usocheckup.dune.net/" + scriptid + ".user.js",
                                  method: "HEAD",
                                  onload: function(xhr) {
                                    if (xhr.status == 200) {
                                      var rex = /usoCheckup.*/i;
                                      var url = "http://usocheckup.dune.net/" + scriptid + ".user.js"
                                        + ((!thisUpdater["value"].match(rex)) ? "?updater=" + thisUpdater["value"] : "")
                                        + ((thisUpdater["qs"]) ? ((thisUpdater["value"].match(rex)) ? "?" : "&") + thisUpdater["qs"] : "")
                                        + ((thisUpdater["value"].match(rex) && !thisUpdater["qs"]) ? "?" : "&") + "is=.user.js";
                                      window.location.href = url;
                                    }
                                    else {
                                      GM_deleteValue(":updaterPreference");
                                      selectNode.selectedIndex = 0;

                                      var ev = document.createEvent("HTMLEvents");
                                      ev.initEvent("change", true, true);
                                      selectNode.dispatchEvent(ev);

                                      alert('The script wrapper is unavailable at this time.\nDefaulting back to userscripts.org.\n\nPlease try again later.');
                                    }
                                  }
                                });
                              }
                              else {
                                GM_deleteValue(":updaterPreference");
                                selectNode.selectedIndex = 0;

                                var ev = document.createEvent("HTMLEvents");
                                ev.initEvent("change", true, true);
                                selectNode.dispatchEvent(ev);

                                alert(thisUpdater["textContent"] + ' is unavailable at this time.\nDefaulting back to userscripts.org.\n\nPlease try again later.');
                              }
                            }
                          });
                        }
                      }
                    }, true);
                  }

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

                  thisNode.setAttribute("style", "width: 16px; height: 16px; margin-top: 0.6em; background: transparent url(" + qmark + ") no-repeat center center; float: right;");
                  thisNode.textContent = "";

                  var selectNode = document.createElement("select");
                  selectNode.setAttribute("style", "width: 90%; font-size: 0.9em;");
                  if (!skipVerify)
                    selectNode.setAttribute("id", "usoCWrap");

                  selectNode.addEventListener("change", function(ev) {
                    switch(this.value) {
                      case "-":
                        selectNode.selectedIndex = 0;
                      case "uso":
                        GM_deleteValue(":updaterPreference");
                        installNode.setAttribute("title", "");
                        if (skipVerify)
                          installNode.setAttribute("href", "/scripts/source/" + scriptid + ".user.js");
                        break;
                      default:
                        GM_setValue(":updaterPreference", this.value);
                        installNode.setAttribute("title", "Are you sure this script doesn't have an updater?");
                        if (skipVerify) {
                          var thisUpdater = updaters[this.value];
                          var rex = /usoCheckup.*/i;
                          var url = "http://usocheckup.dune.net/" + scriptid + ".user.js"
                            + ((!thisUpdater["value"].match(rex)) ? "?updater=" + thisUpdater["value"] : "")
                            + ((thisUpdater["qs"]) ? ((thisUpdater["value"].match(rex)) ? "?" : "&") + thisUpdater["qs"] : "")
                            + ((thisUpdater["value"].match(rex) && !thisUpdater["qs"]) ? "?" : "&") + "is=.user.js";
                          installNode.setAttribute("href", url);
                        }
                        break;
                    }
                  }, true);

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
            }
          });
        }
      }
    });
  }
})();
