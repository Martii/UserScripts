(function() {

// ==UserScript==
// @name          uso - Count Issues
// @namespace     http://userscripts.org/users/37004
// @description   Counts issues on USO
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.2.1
// @include   http://userscripts.org/scripts/*/*
// @include   https://userscripts.org/scripts/*/*
// @include   http://userscripts.org/topics/*
// @include   https://userscripts.org/topics/*
// @include   http://userscripts.org/reviews/*
// @include   https://userscripts.org/reviews/*
// @exclude http://userscripts.org/scripts/source/*.meta.js
// @exclude https://userscripts.org/scripts/source/*.meta.js
// @exclude http://userscripts.org/scripts/diff/*
// @exclude https://userscripts.org/scripts/diff/*
// @exclude http://userscripts.org/scripts/version/*
// @exclude https://userscripts.org/scripts/version/*
// @require http://usocheckup.dune.net/69307.js?method=install&open=window&maxage=14&custom=yes&topicid=46434&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
// ==/UserScript==

  function nsResolver(prefix) {
    var ns = {
      "xhtml": "http://www.w3.org/1999/xhtml"
    };
    return ns[prefix] || null;
  }

  var xpr = document.evaluate(
   "//h1[@class='title']/a | //h1[@class='title']",
    document.documentElement,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  var titleNode = xpr.snapshotItem((xpr.snapshotLength > 1) ? 1 : 0);

  document.evaluate(
   "//div[@id='summary']/br",
    document.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    xpr
  );
  if (xpr && xpr.singleNodeValue && xpr.singleNodeValue.nextSibling)
    var summaryNode = xpr.singleNodeValue.nextSibling;

  function getScriptid() {
    var scriptid = window.location.pathname.match(/\/scripts\/.+\/(\d+)/i);
    if (!scriptid) {
      if (titleNode)
        scriptid = titleNode.pathname.match(/\/scripts\/show\/(\d+)/i);
    }
    return (scriptid) ? scriptid[1] : undefined;
  }

  var scriptid = getScriptid();
  if (scriptid) {

    var hookNode = document.getElementById("right");
    if (hookNode) {
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

              var sidebarNode = document.getElementById("script_sidebar");
              if (!sidebarNode) {
                sidebarNode = document.createElement("div");
                sidebarNode.setAttribute("id", "script_sidebar");
                hookNode.appendChild(sidebarNode);
              }

              GM_addStyle(<><![CDATA[
                span.metadata { color: #666; font-size: 0.7em; }
                span.metadataforced { color: red; }
                div.metadata { overflow: auto; max-height: 10em; }
                ul.metadata { font-size: x-small; width: 100%; border-width: 0; margin: 0; padding: 0 !important; }
                li.metadata { color: grey; white-space: nowrap; }
                .nameMismatch { color: red !important; }
                .resourceName { margin-right: 0.5em; }
                ]]></> + "");


              if (headers["name"] != titleNode.textContent) {
                titleNode.setAttribute("class", titleNode.getAttribute("class") + " titleWarn");

                if (name.toLowerCase() != titleNode.textContent.toLowerCase()) {
                  titleNode.setAttribute("class", titleNode.getAttribute("class") + " nameMismatch");
                  titleNode.setAttribute("title", "@name " + headers["name"]);
                }
                else
                  titleNode.setAttribute("title", "@uso:name " + headers["name"]);
              }


              function display(el, keys, filter, title, forced) {
                if (typeof keys == "string")
                  keys = new Array(keys);

                var headerNode = document.createElement("h6");
                headerNode.textContent = title + ' ';
                el.appendChild(headerNode);

                var spanNodeSection = document.createElement("span");
                spanNodeSection.setAttribute("class", "metadata" + ((forced) ? " metadataforced" : ""));
                spanNodeSection.textContent = keys.length;
                headerNode.appendChild(spanNodeSection);

                var divNode = document.createElement("div");
                divNode.setAttribute("class", "metadata");
                el.appendChild(divNode);

                var ulNode = document.createElement("ul");
                ulNode.setAttribute("class", "metadata");
                divNode.appendChild(ulNode);

                var namespaceCount = 0;
                for each (let key in keys) {
                  var liNode = document.createElement("li");
                  liNode.setAttribute("class", "metadata");

                  switch(filter) {
                    case "namespace":
                      if (++namespaceCount > 1)
                        spanNodeSection.setAttribute("class", "metadata metadataforced");

                      var matches = key.match(/^(https?:\/\/.*)/i);
                      if (matches) {
                        anchorNode = document.createElement("a");
                        anchorNode.setAttribute("href", matches[1]);
                        anchorNode.textContent = matches[1];

                        liNode.setAttribute("title", matches[1]);
                        liNode.appendChild(anchorNode);

                        ulNode.appendChild(liNode);
                      } else {
                        liNode.setAttribute("title", key);
                        liNode.textContent = key;
                        ulNode.appendChild(liNode);
                      }
                      break;
                    case "require":
                      var matches = key.match(/^https?:\/\/.*/i);
                      if (matches) {
                        matches = key.match(/https?:\/\/userscripts\.org\/scripts\/source\/(\d+)\.user\.js/i);
                        var anchorNode = document.createElement("a");
                        anchorNode.setAttribute("href", (matches)
                            ? window.location.protocol + "//userscripts.org/scripts/show/" + matches[1]
                                : key);
                        anchorNode.textContent = key;
                        liNode.setAttribute("title", key);
                        liNode.appendChild(anchorNode);
                        ulNode.appendChild(liNode);
                        break;
                      }
                      else {
                        var xpr = document.evaluate(
                          "//div[@id='summary']/p/a[.='Remotely hosted version']",
                          document.documentElement,
                          null,
                          XPathResult.FIRST_ORDERED_NODE_TYPE,
                          null
                        );
                        if (xpr && xpr.singleNodeValue) {
                          var thisNode = xpr.singleNodeValue;
                          var url = thisNode.href.match(/(.*\/).*\.user\.js$/i);
                          if (url) {
                            spanNodeSection.setAttribute("class", "metadata metadataforced");

                            anchorNode = document.createElement("a");
                            anchorNode.setAttribute("href", url[1] + key);
                            anchorNode.style.setProperty("color", "red", "");
                            anchorNode.textContent = key;

                            liNode.setAttribute("title", url[1]);
                            liNode.appendChild(anchorNode);

                            ulNode.appendChild(liNode);
                          } else {
                            liNode.setAttribute("title", key);
                            liNode.textContent = key;
                            ulNode.appendChild(liNode);
                          }
                        } else {
                          liNode.setAttribute("title", key);
                          liNode.textContent = key;
                          ulNode.appendChild(liNode);
                        }
                      }
                      break;
                    case "resource":
                      var matches = key.match(/^([\w\.]+)\s*(https?:\/\/.*)/i);
                      if (matches) {
                        var spanNode = document.createElement("span");
                        spanNode.setAttribute("class", "resourceName");
                        spanNode.textContent = matches[1];
                        liNode.appendChild(spanNode);

                        anchorNode = document.createElement("a");
                        anchorNode.setAttribute("href", matches[2]);
                        anchorNode.textContent = matches[2];

                        liNode.setAttribute("title", matches[2]);
                        liNode.appendChild(anchorNode);

                        ulNode.appendChild(liNode);
                        break;
                      }
                      else {
                        var xpr = document.evaluate(
                          "//div[@id='summary']/p/a[.='Remotely hosted version']",
                          document.documentElement,
                          null,
                          XPathResult.FIRST_ORDERED_NODE_TYPE,
                          null
                        );
                        if (xpr && xpr.singleNodeValue) {
                          var thisNode = xpr.singleNodeValue;
                          var url = thisNode.href.match(/(.*\/).*\.user\.js$/i);
                          if (url) {
                            spanNodeSection.setAttribute("class", "metadata metadataforced");

                            anchorNode = document.createElement("a");
                            anchorNode.setAttribute("href", url[1] + key);
                            anchorNode.style.setProperty("color", "red", "");
                            anchorNode.textContent = key;

                            liNode.setAttribute("title", url[1]);
                            liNode.appendChild(anchorNode);

                            ulNode.appendChild(liNode);
                            break;
                          }
                        }
                      }
                    default:
                      liNode.setAttribute("title", key);
                      liNode.textContent = key;
                      ulNode.appendChild(liNode);
                      break;
                  }
                }
              }

              var mbx = document.createElement("div");

              if (headers["name"] && headers["name"] != titleNode.textContent)
                display(mbx, headers["name"], "name", "Names", true);

              if (headers["namespace"])
                  display(mbx, headers["namespace"], "namespace", "Namespaces");
              else
                display(mbx, "userscripts.org", "namespace", "Namespace", true);

              if (headers["description"] && summaryNode
                  && (!summaryNode.textContent.match(/[\r\n](.*)[\r\n]/) || headers["description"] != summaryNode.textContent.match(/[\r\n](.*)[\r\n]/)[1]))
                display(mbx, headers["description"], "description", "Descriptions", true);

              if (headers["require"])
                display(mbx, headers["require"], "require", "Requires");

              if (headers["resource"])
                display(mbx, headers["resource"], "resource", "Resources");

              if (headers["include"])
                display(mbx, headers["include"], "include", "Includes");
              else
                display(mbx, "*", "include", "Includes", true);

              if (headers["match"])
                display(mbx, headers["match"], "match", "Matches");

              if (headers["exclude"])
                display(mbx, headers["exclude"], "exclude", "Excludes");


              if (window.location.pathname.match(/scripts\/show\/.*/i))
                sidebarNode.insertBefore(mbx, sidebarNode.firstChild);
              else
                sidebarNode.appendChild(mbx);
          }
        }
      });
    }

    function getDocument(url, callback) {
      var rex = new RegExp(url + ".*", "i");
      var uri = "http://" + window.location.host + window.location.pathname + window.location.search + window.location.hash;
      if (uri.match(rex)) {
        callback(document);
      }
      else {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          onload: function (xhr) {

            // Attempt(s) to fix XHTML error(s) on USO
            var usoTitle = titleNode.textContent;

            var matches = usoTitle.match(/&/ig);
            if (matches)
              xhr.responseText = xhr.responseText.replace(usoTitle, usoTitle.replace(/&/gi, "&amp;"), "gmi" );

            var d = new DOMParser().parseFromString(xhr.responseText, "text/xml");
            if ( d.documentElement.firstChild == "[object XPCNativeWrapper [object Text]]"
              && d.documentElement.firstChild.textContent.match(/XML Parsing Error:.*/i)
            ) {
              GM_log(d.documentElement.firstChild.textContent);
              callback(null);
                return;
            }
            var h = d.getElementsByTagName("head")[0];
            var hf = document.createDocumentFragment();
            hf.appendChild(h);

            var b = d.getElementsByTagName("body")[0];
            var bf = document.createDocumentFragment();
            bf.appendChild(b);

            var doctype = document.implementation.createDocumentType(d.doctype.name, d.doctype.publicId, d.doctype.systemId);
            var doc = document.implementation.createDocument(d.documentElement.namespaceURI, "html", doctype);

            for (var i = d.documentElement.attributes.length - 1; i >= 0; i--)
              doc.documentElement.setAttribute(d.documentElement.attributes.item(i).nodeName, d.documentElement.attributes.item(i).nodeValue);

            doc.documentElement.appendChild(hf);
            doc.documentElement.appendChild(bf);

            callback(doc);
          }
        });
      }
    }

    getDocument("http://userscripts.org/scripts/issues/" + scriptid, function(doc) {
      if (doc) {
        var votes = {
          "broken":  "broken_votes",
          "copy":    "copy_votes",
          "harmful": "harmful_votes",
          "spam":    "spam_votes",
          "vague":   "vague_votes"
        };

        var thisNode, xpr, matches,
          yesCount = 0,
          noCount = 0;

        for each (var vote in votes) {
          xpr = doc.evaluate(
            "//" + ((doc == document) ? "" : "xhtml:") + "a[contains(@href,'/scripts/issues/" + scriptid + "#" + vote + "')]",
            doc.documentElement,
            nsResolver,
            XPathResult.ANY_UNORDERED_NODE_TYPE,
            null
          );

          if (xpr && xpr.singleNodeValue) {
            thisNode = xpr.singleNodeValue;

            matches = thisNode.textContent.match(/(\d+) of (\d+) voted yes/i);
            if (matches) {
              yesCount += parseInt(matches[1]);
              noCount += parseInt(matches[2]) - parseInt(matches[1]);
            }
          }
        }
      }


      var issuesNode;
      if (doc == document) {
        issuesNode = document.evaluate(
          "//li/text()['Issues']",
          document.documentElement,
          null,
          XPathResult.ANY_UNORDERED_NODE_TYPE,
          null
        );

        if (issuesNode && issuesNode.singleNodeValue) {
          thisNode = issuesNode.singleNodeValue;
          thisNode.textContent += " ";

          thisNode = thisNode.parentNode;
        }
      }
      else {
        issuesNode = document.evaluate(
          "//li/a[contains(@href,'/scripts/issues/" + scriptid + "')]",
          document.documentElement,
          null,
          XPathResult.ANY_UNORDERED_NODE_TYPE,
          null
        );

        if (issuesNode && issuesNode.singleNodeValue) {
          thisNode = issuesNode.singleNodeValue;
          thisNode.textContent += " ";
        }
      }

      var spanNode = document.createElement("span");
      if (!doc || yesCount > noCount)
        spanNode.setAttribute("style", "color: red;");
      if (doc)
        spanNode.textContent = yesCount;
      else
        spanNode.textContent = "0";

      thisNode.appendChild(spanNode);
    });
  }
})();
