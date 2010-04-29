(function() {

// ==UserScript==
// @name          uso - installWith
// @namespace     http://userscripts.org/users/37004
// @description   Adds option to install script with an updater
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.3.0
// @include http://userscripts.org/scripts/*/*
// @include https://userscripts.org/scripts/*/*
// @include http://userscripts.org/topics/*
// @include https://userscripts.org/topics/*
// @include http://userscripts.org/reviews/*
// @include https://userscripts.org/reviews/*
// @exclude http://userscripts.org/scripts/source/*.meta.js
// @exclude https://userscripts.org/scripts/source/*.meta.js
// @exclude http://userscripts.org/scripts/diff/*
// @exclude https://userscripts.org/scripts/diff/*
// @exclude http://userscripts.org/scripts/version/*
// @exclude https://userscripts.org/scripts/version/*
// @require http://usocheckup.dune.net/68219.js?method=install&open=window&maxage=1&custom=yes&topicid=45479&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  var securityAdvisory = {
    "undetermined": {
      "title": 'Security Advisory: UNDETERMINED',
      "background-image": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAEFCAMAAAAVLX0ZAAAAAXNSR0IArs4c6QAAADNQTFRFfX19ioqKlJSUmZmZnp6epaWlrKyssbGxt7e3vLy8wsLCysrKz8/P1NTU2NjY29vb4ODgIPqwRwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oEHRInLN89FfMAAABFSURBVCjP1dCLDYAgEIPhioJ4vNx/WprziIQN6Jcu8KOiopisEkQveCjSTYE8XXQqR8dk372TRmuTpMSMKl+Xv8yos6kO+PgEEPaHx4wAAAAASUVORK5CYII='
    },
    "low": {
      "title": 'Security Advisory: LOW',
      "background-image": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAEFCAMAAAAVLX0ZAAAAAXNSR0IArs4c6QAAADNQTFRFj8swls5GoNVTpdhbrdpjsN1tsuB4uuN/veWKwuiRyOuaz++l1fCv2vK23fW74PbB5PfKP126HQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oDDhUgM+i3vCUAAABFSURBVCjP1dCJDcAgDARB84TwhJD+q+V8khFSKmCng5VXVIeHGlUqkOGGBBdFCeTBLSf3bQbYkb4d0Sftd8XO2Bu9c6gJ9tkEDz54A9sAAAAASUVORK5CYII='
    },
    "guarded": {
      "title": 'Security Advisory: GUARDED',
      "background-image": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAEFCAMAAAAVLX0ZAAAAAXNSR0IArs4c6QAAADZQTFRFMEvLRlzOU2jVW2/YY3jabYDdeIfgf4/jipflkZ7omqbrpbDvr7nwtsDyu8T1wcn2ytH30df4OWXj/AAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oDDhYqAdjJu3YAAABHSURBVCjP1dCLDYAgFEPRouCHB6j7L2tTIBg3oCdd4KKgIEsi0w1RTjpop40CeVplIfcx7x7czSW9SWrs12RU6WVqm1pnUi/yTQQLN2JVZQAAAABJRU5ErkJggg=='
    },
    "elevated": {
      "title": 'Security Advisory: ELEVATED',
      "background-image": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAEFCAMAAAAVLX0ZAAAAAXNSR0IArs4c6QAAADNQTFRFycswys5G0tVT1dhb2tpj291t2+B44ON/4eWK5OiR6Oua7O+l7vCv8fK28/W79PbB9ffK6M6iDgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oDDhUfLtNv+sAAAABBSURBVCjP1dCLEcAQFETRh/gkJPRfrc0mGDMacE8HVx553ZAowvU7IYAHB5YOMaRJdftWukzzke/J+ko7M95sqwL11wQNX63s2AAAAABJRU5ErkJggg=='
    },
    "high": {
      "title": 'Security Advisory: HIGH',
      "background-image": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAEFCAIAAACtkRp8AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oDDhYrJxPfD8oAAACASURBVDjL7ZKxDsJADEOf/P9/xFcw8QNMbAj1etdregwXAlTAVqYOlhI7zmIznA4CZLUKEKBlLgLUagoO0JyHmG0a3ddvl9I1c6+NvufkP/PTW/tc0u3tf+jXy0d+x2Ygn49qnt0DzTMG1Gz62pN1V1578qsroa86E3xOezb/xx0M5VZRPzRQRQAAAABJRU5ErkJggg=='
    },
    "severe": {
      "title": 'Security Advisory: SEVERE',
      "background-image": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAEFCAMAAAAVLX0ZAAAAAXNSR0IArs4c6QAAADNQTFRFyzcwzk9G1VtT2GNb2mhj3XRt4IF444Z/5ZKK6JiR66Ga76ul8LSv8rm29b+79sXB983Kf5TXQQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oDDhUjGoEod4oAAABCSURBVCjP1dCJEQAREADBvdd5DvlHa4qlCMF0BiNRovwqwMMpiw8GLx7cuKoTx7BzeZLQnwTlpyt2udLPtDftzqYK8I4ECjgUovgAAAAASUVORK5CYII='
    }
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

    installNode.setAttribute("title", securityAdvisory["undetermined"]["title"]);
    GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url(" + securityAdvisory["undetermined"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}");
  }
  else
    return;

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
        if (xhr.status != 200) {
          installNode.setAttribute("title", securityAdvisory["elevated"]["title"] + ",UNLISTED");
          GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url(" + securityAdvisory["elevated"]["background-image"] + "); } #install_script a.userjs:hover { color: black;}");
        }
        else {
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
                  headers["licence"] = headers["license"];

                  var updaters = {
                    "uso": {
                      "value": "uso",
                      "textContent": 'userscripts.org (default)',
                      "title": '',
                      "updater": "",
                      "rex": [],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "-": {
                      "value": "-",
                      "textContent": '---------------',
                      "title": '',
                      "updater": "",
                      "rex": [],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
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
                      "qs": "show&uso",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "UserscriptUpdaterGenerator": {
                      "value": "",
                      "textContent": 'Userscript Updater Generator',
                      "title": 'by ΙδεΠÐ (136989)',
                      "updater": "userscriptupdatergenerator",
                      "rex": [
                        "^http:\\/\\/userscript-updater-generator\\.appspot\\.com\\/\\?id=\\d+"
                      ],
                      "url": "http://userscript-updater-generator.appspot.com/?" + scriptid,
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": "Closed-Source"
                      }
                    },
                    "16338": {
                      "value": "",
                      "textContent": 'AutoUpdate Test',
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
                    "38788": {
                      "value": "",
                      "textContent": 'Includes : CheckForUpdate',
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
                    "36259": {
                      "value": "",
                      "textContent": 'Script AutoUpdater',
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
                      "title": 'by alien scum (8158)',
                      "updater": "8857",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/8857\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "high",
                        "title": "BROKEN"
                      }
                    },
                    "57756": {
                      "value": "",
                      "textContent": 'Script Updater (userscripts.org)',
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
                    "74144": {
                      "value": "",
                      "textContent": 'Script Updater (userscripts.org)',
                      "title": 'by TheSpy (106188)',
                      "updater": "74144",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/74144\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "guarded",
                        "title": "localStorage Vulnerability"
                      }
                    },
                    "41075": {
                      "value": "",
                      "textContent": 'Script Version Checker',
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
                    "22372": {
                      "value": "",
                      "textContent": 'Userscript Auto-Update Add-in',
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
                    "52251": {
                      "value": "",
                      "textContent": 'Userscripts - AutoUpdater',
                      "title": 'by Buzzy (57340)',
                      "updater": "52251",
                      "rex": [
                        "^http:\\/\\/buzzy\\.260mb\\.com\\/AutoUpdater\\.js",
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
                      "title": 'by Richard Gibson (336)',
                      "updater": "2296",
                      "rex": [
                        "^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/2296\\.user\\.js"
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
                    },
                    "39678": {
                      "value": "",
                      "textContent": 'US Framework',
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
                    "---": {
                      "value": "-",
                      "textContent": '---------------',
                      "title": '',
                      "updater": "",
                      "rex": [
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
                      "title": 'by Tim Smart (63868)',
                      "updater": "usoupdater",
                      "rex": [
                        "^http:\\/\\/updater\\.usotools\\.co\\.cc\\/\\d+\\.js"
                      ],
                      "url": "http://updater.usotools.co.cc/" + scriptid + ".js",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "elevated",
                        "title": ",Possible Security Risk"
                      }
                    },
                    "16144": {
                      "value": "",
                      "textContent": 'US Update',
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
                    "--": {
                      "value": "-",
                      "textContent": '---------------',
                      "title": '',
                      "updater": "",
                      "rex": [
                      ],
                      "url": "",
                      "qs": "",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
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
                      "qs": "wrapperid=" + scriptid,
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
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
                      "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=68506,66530,67771,74732&custom=yes&trim=de,pt&id=usoCheckup",
                      "securityAdvisory": {
                        "advisory": "low",
                        "title": ""
                      }
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
                      "qs": "wrapperid=" + scriptid + "&method=install&open=window&theme=61794,66530,67771,74732&custom=yes&trim=de,pt&id=usoCheckup",
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
                          if (updater["value"] != "-" && require.match(new RegExp(rex  + ".*", "i"))) {
                            installNode.setAttribute("title", securityAdvisory[updater["securityAdvisory"]["advisory"]]["title"] + updater["securityAdvisory"]["title"]);
                            GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url(" + securityAdvisory[updater["securityAdvisory"]["advisory"]]["background-image"] + "); } #install_script a.userjs:hover { color: black;}");
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

                  thisNode.style.setProperty("width", "16px", "");
                  thisNode.style.setProperty("height", "16px", "");
                  thisNode.style.setProperty("margin-top", "0.6em", "");
                  thisNode.style.setProperty("background", "transparent url(" + qmark + ") no-repeat scroll top left", "");
                  thisNode.style.setProperty("float", "right", "");

                  thisNode.textContent = "";

                  var selectNode = document.createElement("select");
                  selectNode.style.setProperty("width", "90%", "");
                  selectNode.style.setProperty("font-size", "0.9em", "");
                  selectNode.addEventListener("change", function(ev) {
                    var thisUpdater = updaters[this.value];
                    GM_addStyle("#install_script a.userjs, #install_script a.userjs:hover { background-repeat: repeat-x; background-image: url(" + securityAdvisory[thisUpdater["securityAdvisory"]["advisory"]]["background-image"] + "); } #install_script a.userjs:hover { color: black;}");
                    switch(this.value) {
                      case "-":
                        selectNode.selectedIndex = 0;
                      case "uso":
                        GM_deleteValue(":updaterPreference");
                        installNode.setAttribute("title", "");
                        installNode.setAttribute("href", "/scripts/source/" + scriptid + ".user.js");
                        break;
                      default:
                        GM_setValue(":updaterPreference", this.value);
                        installNode.setAttribute("title", securityAdvisory[thisUpdater["securityAdvisory"]["advisory"]]["title"] + thisUpdater["securityAdvisory"]["title"]);
                        var rex = /usoCheckup.*/i;
                        var url = "http://usocheckup.dune.net/" + scriptid + ".user.js"
                          + ((!thisUpdater["value"].match(rex)) ? "?updater=" + thisUpdater["value"] : "")
                          + ((thisUpdater["qs"]) ? ((thisUpdater["value"].match(rex)) ? "?" : "&") + thisUpdater["qs"] : "")
                          + ((thisUpdater["value"].match(rex) && !thisUpdater["qs"]) ? "?" : "&") + "is=.user.js";
                        installNode.setAttribute("href", url);
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
