(function() {

// ==UserScript==
// @name          uso - installWith
// @namespace     http://userscripts.org/users/37004
// @description   Adds option to install script with an updater
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.0.3
// @include   http://userscripts.org/scripts/*/*
// @include   https://userscripts.org/scripts/*/*
// @include   http://userscripts.org/topics/*
// @include   https://userscripts.org/topics/*
// ==/UserScript==

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
                  [, name, value] = line.match(/\/\/ @(\S+)\s*(.*)/);
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

                var knownUpdaters = [
                  "http:\/\/usocheckup\.dune\.net/",
                  "http:\/\/updater\.usotools\.co\.cc/",
                  "http:\/\/sizzlemctwizzle\.com/updater\.php",
                  "http:\/\/buzzy.260mb.com/AutoUpdater.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/2296\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/8877\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/12193\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/16144\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/16338\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/20145\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/22372\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/26062\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/29878\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/29880\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/35611\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/36259\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/37853\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/38788\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/38017\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/41075\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/45266\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/45904\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/45989\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/51513\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/52251\.user\.js",
                  "http:\/\/userscripts\.org\/scripts\/source\/57756\.user\.js"
                ];

                if (headers["require"]) {
                  if (typeof headers["require"] == "string")
                    requires = [headers["require"]];
                  else
                    requires = headers["require"];

                  for each (var require in requires) {
                    for each (var updater in knownUpdaters) {
                      var rex = new RegExp(updater + ".*", "i");
                      if (require.match(rex))
                        return;
                    }
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

                thisNode.setAttribute("style", "width: 16px; height: 16px; margin-top: 0.6em; background: transparent url(" + qmark + ") no-repeat center center; float: right;");
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

                    var message = "Are you sure this script doesn't already have an updater?";

                    switch (ev.target.value) {
                      case "AnotherAutoUpdater":
                        thisNode.setAttribute("href", "http://usocheckup.dune.net/" + scriptid + ".user.js?updater=AnotherAutoUpdater&is=.user.js");
                        thisNode.setAttribute("title", message);
                        break;
                      case "USOUpdater":
                        thisNode.setAttribute("href", "http://usocheckup.dune.net/" + scriptid + ".user.js?updater=USOUpdater&is=.user.js");
                        thisNode.setAttribute("title", message);
                        break;
                      case "usoCheckup":
                        thisNode.setAttribute("href", "http://usocheckup.dune.net/" + scriptid + ".user.js");
                        thisNode.setAttribute("title", message);
                        break;
                      case "usoCheckupDOMNotify":
                        thisNode.setAttribute("href", "http://usocheckup.dune.net/" + scriptid + ".user.js?updater=usoCheckupDOMNotify&is=.user.js");
                        thisNode.setAttribute("title", message);
                        break;
                      default:
                        thisNode.setAttribute("href", "/scripts/source/" + scriptid + ".user.js");
                        thisNode.setAttribute("title", "");
                        break;
                    }
                  }
                }, true);

                var updaterNode = document.createElement("option");

                var defaultNode = updaterNode;
                updaterNode.setAttribute("value", "");
                updaterNode.textContent = "* populating list *";
                selectNode.appendChild(updaterNode);

                updaterNode = document.createElement("option");
                updaterNode.setAttribute("value", "AnotherAutoUpdater");
                updaterNode.textContent = "Another Auto Updater";
                selectNode.appendChild(updaterNode);

                updaterNode = document.createElement("option");
                updaterNode.setAttribute("value", "USOUpdater");
                updaterNode.textContent = "USO Updater";
                selectNode.appendChild(updaterNode);

                updaterNode = document.createElement("option");
                updaterNode.setAttribute("value", "usoCheckup");
                updaterNode.textContent = "usoCheckup";
                selectNode.appendChild(updaterNode);

                updaterNode = document.createElement("option");
                updaterNode.setAttribute("value", "usoCheckupDOMNotify");
                updaterNode.textContent = "usoCheckup + DOMNotify";
                selectNode.appendChild(updaterNode);

                thisNode.parentNode.insertBefore(selectNode, thisNode);
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
