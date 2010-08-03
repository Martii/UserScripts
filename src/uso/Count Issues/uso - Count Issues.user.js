(function() {

// ==UserScript==
// @name          uso - Count Issues
// @namespace     http://userscripts.org/users/37004
// @description   Counts issues on USO
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.4.5
//
// @include   http://userscripts.org/scripts/*/*
// @include   https://userscripts.org/scripts/*/*
// @include   http://userscripts.org/topics/*
// @include   https://userscripts.org/topics/*
// @include   http://userscripts.org/reviews/*
// @include   https://userscripts.org/reviews/*
//
// @exclude http://userscripts.org/scripts/source/*.meta.js
// @exclude https://userscripts.org/scripts/source/*.meta.js
// @exclude http://userscripts.org/scripts/diff/*
// @exclude https://userscripts.org/scripts/diff/*
// @exclude http://userscripts.org/scripts/version/*
// @exclude https://userscripts.org/scripts/version/*
//
// @require http://usocheckup.dune.net/69307.js?method=install&open=window&maxage=7&custom=yes&topicid=46434&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
//
// @require http://github.com/sizzlemctwizzle/GM_config/raw/fa194bc0ffdd65dfd7bbda0beea2832cf32e021e/gm_config.js
// ==/UserScript==

  if (typeof GM_configStruct != "undefined") {
      // Save some memory
      delete GM_config;

      var gmc = new GM_configStruct();
      gmc.id = "gmc69307";

      // Migrate preferences for a while
      if (GM_getValue("GM_config")) {
        GM_setValue("gmc69307", GM_getValue("GM_config", ""));
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

      if (gmc.get("limitMaxHeight"))
        GM_addStyle(<><![CDATA[ div.metadata { max-height: ]]></> + gmc.get("maxHeightList") + <><![CDATA[em; } ]]></> + "");
      else
        GM_addStyle(<><![CDATA[ div.metadata { max-height: none; } ]]></> + "");

      GM_addStyle(<><![CDATA[ li.metadata { font-size: ]]></> + gmc.get("fontSize") + <><![CDATA[em ; } ]]></>);

      var keys = gmc.get("showKeysString").split(",");
      for (let i = 0; i < keys.length; ++i) {
        keys[i] = keys[i].replace(/^\s*/, "").replace(/\s*$/, "");
      }
      keys = keys.join(",");

      if (keys != gmc.get("showKeysString")) {
        gmc.set("showKeysString", keys);
        write = true;
      }

      if (write) { gmc.write(); gmc.close(); gmc.open(); }
    }
    gmc.init('Options' /* Script title */,
        divNode,
        /* Custom CSS */
        <><![CDATA[

          /* GM_config specific fixups */
          #gmc69307 {
            position: static !important;
            z-index: 0 !important;
            width: auto !important;
            height: auto !important;
            max-height: none !important;
            max-width: none !important;
            margin: 0 0 0.6em 0 !important;
            border: 1px solid #ddd !important;
            clear: right !important;
          }

          #gmc69307 .config_header {
            color: white;
            background-color: #333;
            text-align: left;
            margin: 0 0 0.5em 0;
            padding: 0 0 0 0.5em;
            font-size: 1.57em;
          }

          #gmc69307 .config_var {
            margin: 0 1em;
            padding: 0;
            clear: both;
          }

          #gmc69307 .field_label {
            color: #333;
            font-weight: normal;
            font-size: 100%;
          }

          #gmc69307_field_showKeys { float: left; top: 0; margin-right: 0.5em; }
          #gmc69307_field_showKeysString { margin: 0 0 0.25em 0.3em; width: 96%; }
          #gmc69307_field_fontSize { width: 2.0em; height: 0.8em; margin: 0 0.25em 0.25em 0.3em; float: left; text-align: right; }
          #gmc69307_field_limitMaxHeight { float: left; top: 0; margin-right: 0.5em; margin-bottom: 0.7em; }
          #gmc69307_field_maxHeightList { width: 2.0em; height: 0.8em; margin: -0.35em 0.25em 0.25em 1.75em; float: left; text-align: right; }

          #gmc69307_field_checkAgainstHomepageUSO,
          #gmc69307_field_enableHEAD
          {
            float: left; top: 0; margin-right: 0.5em;
          }

          #gmc69307_field_enableHEAD { margin-left: 1.5em; }

          #gmc69307_buttons_holder, #gmc69307 .saveclose_buttons { margin-bottom: 0.25em; }
          #gmc69307_saveBtn { margin: 0.4em 1.2em !important; padding: 0 3.0em !important; }
          #gmc69307_resetLink { margin-right: 2.5em; }
          #gmc69307_closeBtn { display: none; }

        ]]></>.toString(),

        /* Settings object */
        {
          'showKeys': {
              "label": 'Show these keys when present or different then USO in the sidebar (use commas to separate keys)',
              "type": 'checkbox',
              "default": true
          },
          'showKeysString': {
              "label": '',
              "type": 'text',
              "default": "name,namespace,description,require,resource,include,match,exclude"
          },
          'fontSize': {
              "label": 'em font size for all keys found under the specified key type',
              "type": 'float',
              "default": 1
          },
          'limitMaxHeight': {
              "label": 'Limit maximum height of all shown key types',
              "type": 'checkbox',
              "default": false
          },
          'maxHeightList': {
              "label": 'em maximum height of all shown key types',
              "type": 'float',
              "default": 10
          },
          'checkAgainstHomepageUSO': {
              "label": 'Check USO script require urls against the USO script homepage (Rate and Limiting on USO may prevent accuracy)',
              "type": 'checkbox',
              "default": true
          },
          'enableHEAD': {
            "label": 'Check urls with a HTTP HEAD request (Not currently recommended due to a bug with USO)',
            "type": 'checkbox',
            "default": false
          }
        }
    );
    if (window.location.pathname == "/scripts/show/69307"
        || window.location.href == "http://userscripts.org/scripts/show/69307/")
      gmc.open();
  }
  else {
    if (!window.location.pathname == "/scripts/show/69307"
        || window.location.href == "http://userscripts.org/scripts/show/69307/")
      GM_log('Something may have gone wrong in uso - Count Issues. Please let me know how to reproduce');
  }

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
                .metadataforced { color: red; }
                .metadataforced:hover { color: orangered; }
                .metadataunknown { color: black; }
                .metadataunknown:hover { color: gray; }
                .metadatachecked { color: darkgreen; }
                .metadatachecked:hover { color: green; }
                span.metadataforced { color: red; }
                div.metadata { overflow: auto; }
                ul.metadata { font-size: x-small; width: 100%; border-width: 0; margin: 0; padding: 0 !important; }
                li.metadata { color: grey; white-space: nowrap; }
                .nameMismatch { color: red !important; }
                .resourceName { margin-right: 0.5em; }
                ]]></> + "");


              if (gmc) {
                if (gmc.get("limitMaxHeight"))
                  GM_addStyle(<><![CDATA[ div.metadata { max-height: ]]></> + gmc.get("maxHeightList") + <><![CDATA[em; } ]]></> + "");
                else
                  GM_addStyle(<><![CDATA[ div.metadata { max-height: none; } ]]></> + "");

                GM_addStyle(<><![CDATA[ li.metadata { font-size: ]]></> + gmc.get("fontSize") + <><![CDATA[em ; } ]]></>);
              }

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

                let headerNode = document.createElement("h6");
                headerNode.textContent = title + ' ';
                el.appendChild(headerNode);

                let spanNodeSection = document.createElement("span");
                spanNodeSection.setAttribute("class", "metadata" + ((forced) ? " metadataforced" : ""));
                spanNodeSection.textContent = keys.length;
                headerNode.appendChild(spanNodeSection);

                let divNode = document.createElement("div");
                divNode.setAttribute("class", "metadata");
                el.appendChild(divNode);

                let ulNode = document.createElement("ul");
                ulNode.setAttribute("class", "metadata");
                divNode.appendChild(ulNode);

                let namespaceCount = 0;
                for each (let key in keys) {
                  let liNode = document.createElement("li");
                  liNode.setAttribute("class", "metadata");

                  switch(filter) {
                    case "namespace":
                      if (++namespaceCount > 1)
                        spanNodeSection.setAttribute("class", "metadata metadataforced");

                      var matches = key.match(/^(https?:\/\/.*)/i);
                      if (matches) {
                        let anchorNode = document.createElement("a");
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
                        let showUrl;
                        if (matches)
                          showUrl = window.location.protocol + "//userscripts.org/scripts/show/" + matches[1];

                        let anchorNode = document.createElement("a");
                        anchorNode.setAttribute("href", (showUrl) ? showUrl : key);
                        anchorNode.textContent = key;
                        if (gmc && gmc.get("checkAgainstHomepageUSO") && showUrl)
                          GM_xmlhttpRequest({
                            method: (gmc && gmc.get("enableHEAD") ) ? "HEAD" : "GET",
                            url: showUrl,
                            onload: function(xhr) {
                              if (xhr.status != 200) {
                                if (xhr.status == 503)
                                  anchorNode.setAttribute("class", "metadataunknown");
                                else
                                  anchorNode.setAttribute("class", "metadataforced");
                              }
                              else
                                anchorNode.setAttribute("class", "metadatachecked");
                          }});

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
                          let thisNode = xpr.singleNodeValue;
                          let url = thisNode.href.match(/(.*\/).*\.user\.js$/i);
                          if (url) {
                            spanNodeSection.setAttribute("class", "metadata metadataforced");

                            let anchorNode = document.createElement("a");
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
                        let spanNode = document.createElement("span");
                        spanNode.setAttribute("class", "resourceName");
                        spanNode.textContent = matches[1];
                        liNode.appendChild(spanNode);

                        let anchorNode = document.createElement("a");
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
                          let thisNode = xpr.singleNodeValue;
                          let url = thisNode.href.match(/(.*\/).*\.user\.js$/i);
                          if (url) {
                            spanNodeSection.setAttribute("class", "metadata metadataforced");

                            let anchorNode = document.createElement("a");
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

              if (gmc && gmc.get("showKeys")) {
                var mbx = document.createElement("div");

                var keys = gmc.get("showKeysString").split(",");
                for (let i = 0; i < keys.length; ++i) {
                  var key = keys[i];
                  
                  switch (key) {
                    case "name":
                      if (headers[key] && headers[key] != titleNode.textContent)
                        display(mbx, headers[key], key, "@name", true);
                      break;
                    case "namespace":
                      if (headers[key])
                        display(mbx, headers[key], key, "@namespace");
                      else
                        display(mbx, "userscripts.org", key, "@namespace", true);
                      break;
                    case "description":
                      if (headers[key] && summaryNode
                          && (!summaryNode.textContent.match(/[\r\n](.*)[\r\n]/)
                              || headers[key] != summaryNode.textContent.match(/[\r\n](.*)[\r\n]/)[1]))
                        display(mbx, headers[key], key, "@description", true);
                      break;
                    case "include":
                      if (headers[key])
                        display(mbx, headers[key], key, "@include");
                      else
                        display(mbx, "*", key, key, true);
                      break;
                    default:
                      [key, prefix] = key.split(/:/).reverse();
                      if (!prefix && headers[key])
                        display(mbx, headers[key], key, "@" + key);
                      else if (prefix && headers[prefix][key])
                        display(mbx, headers[prefix][key], key, "@" + prefix + ":" + key);
                      break;
                  }
                }

                if (window.location.pathname.match(/scripts\/show\/.*/i))
                  sidebarNode.insertBefore(mbx, sidebarNode.firstChild);
                else
                  sidebarNode.appendChild(mbx);
              }
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
        spanNode.style.setProperty("color", "red", "");
      if (doc)
        spanNode.textContent = yesCount;
      else
        spanNode.textContent = "0";

      thisNode.appendChild(spanNode);
    });
  }
})();
