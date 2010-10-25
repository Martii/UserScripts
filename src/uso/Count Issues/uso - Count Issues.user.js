(function() {

// ==UserScript==
// @name          uso - Count Issues
// @namespace     http://userscripts.org/users/37004
// @description   Counts issues on USO
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.6.5
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
// @require http://usocheckup.dune.net/69307.js?method=install&open=window&maxage=1&custom=yes&topicid=46434&id=usoCheckup
// @require http://userscripts.org/scripts/source/61794.user.js
//
// @require http://github.com/sizzlemctwizzle/GM_config/raw/7064fbe963061eb1843863579ec7476eea859b8a/gm_config.js
// @require http://github.com/einars/js-beautify/raw/master/beautify.js
// @require http://userscripts.org/scripts/source/87269.user.js
//
// ==/UserScript==

  let throbber = "data:image/gif;base64,"
    + 'R0lGODlhAQABAOMKAMTExMnJyc3NzdLS0tfX19vb2+Dg4OXl5enp6e7u7v//////////////////'
    + '/////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQICgD/ACwAAAAAAQABAAAEAjBFACH5BAgKAP8ALAAA'
    + 'AAABAAEAAAQCEEUAIfkECAoA/wAsAAAAAAEAAQAABALwRAAh+QQICgD/ACwAAAAAAQABAAAEAtBE'
    + 'ACH5BAgKAP8ALAAAAAABAAEAAAQCsEQAIfkECAoA/wAsAAAAAAEAAQAABAKQRAAh+QQICgD/ACwA'
    + 'AAAAAQABAAAEAnBEACH5BAgKAP8ALAAAAAABAAEAAAQCUEQAIfkECAoA/wAsAAAAAAEAAQAABAIw'
    + 'RAAh+QQICgD/ACwAAAAAAQABAAAEAhBEACH5BAgKAP8ALAAAAAABAAEAAAQCMEQAIfkECAoA/wAs'
    + 'AAAAAAEAAQAABAJQRAAh+QQICgD/ACwAAAAAAQABAAAEAnBEACH5BAgKAP8ALAAAAAABAAEAAAQC'
    + 'kEQAIfkECAoA/wAsAAAAAAEAAQAABAKwRAAh+QQICgD/ACwAAAAAAQABAAAEAtBEACH5BAgKAP8A'
    + 'LAAAAAABAAEAAAQC8EQAIfkEAAoA/wAsAAAAAAEAAQAABAIQRQA7'
  ;

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
      let write = false;
      let open = false;

        if (gmc.get("limitMaxHeight"))
          GM_addStyle(<><![CDATA[ div.metadata { max-height: ]]></> + gmc.get("maxHeightList") + <><![CDATA[em; } ]]></> + "");
        else
          GM_addStyle(<><![CDATA[ div.metadata { max-height: none; } ]]></> + "");

        GM_addStyle(<><![CDATA[ li.metadata, li.count { font-size: ]]></> + gmc.get("fontSize") + <><![CDATA[em ; } ]]></>);

        let keys = gmc.get("showKeysString").split(",");
        for (let i = 0, len = keys.length; i < len; ++i) {
          keys[i] = keys[i].replace(/^\s*/, "").replace(/\s*$/, "");
        }
        keys = keys.join(",");

        if (keys != gmc.get("showKeysString")) {
          gmc.set("showKeysString", keys);
          write = open = true;
        }

      let height;
      GM_addStyle(<><![CDATA[ textarea#gmc69307_field_showStringsString { height: ]]></> + gmc.get("showStringsStringHeight") + <><![CDATA[; } ]]></>);
      height = gmc.fields["showStringsString"].node.clientHeight + "px";
        if (height != gmc.get("showStringsStringHeight")) {
          gmc.set("showStringsStringHeight", height);
          write = true;
        }

      GM_addStyle(<><![CDATA[ textarea#gmc69307_field_showKeysString { height: ]]></> + gmc.get("showKeysStringHeight") + <><![CDATA[; } ]]></>);
      height = gmc.fields["showKeysString"].node.clientHeight + "px";
        if (height != gmc.get("showKeysStringHeight")) {
          gmc.set("showKeysStringHeight", height);
          write = true;
        }

      if (write) gmc.write();
      if (open) { gmc.close(); gmc.open(); }
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
            max-width: 100% !important;
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

          #gmc69307_field_showStringsString,
          #gmc69307_field_showKeysString
          {
            font-size: 1.0em;
            margin-left: 1.7em;
            min-width: 95.1%;
            max-width: 95.1%;
          }

          #gmc69307_field_showStringsString
          {
            min-height: 4em;
            height: 4em;
          }

          #gmc69307_field_showKeysString
          {
            min-height: 1.2em;
            height: 1.2em;
            max-height: 5em;
          }

          #gmc69307_field_showStrings,
          #gmc69307_field_checkDeobfuscate,
          #gmc69307_field_checkShowSize,
          #gmc69307_field_checkTrimSourceCode,
          #gmc69307_field_showKeys,
          #gmc69307_field_limitMaxHeight,
          #gmc69307_field_checkAgainstHomepageUSO,
          #gmc69307_field_enableHEAD
          {
            top: 0.075em;
          }

          #gmc69307_field_showStrings,
          #gmc69307_field_showKeys,
          #gmc69307_field_limitMaxHeight,
          #gmc69307_field_checkAgainstHomepageUSO
          {
            margin-left: 0;
          }

          #gmc69307_field_fontSize,
          #gmc69307_field_maxHeightList
          {
            min-width: 2em;
            max-width: 4em;
            width: 2em;
            min-height: 0.8em;
            max-height: 1em;
            height: 0.8em;
            text-align: right;
          }

          #gmc69307_field_checkDeobfuscate,
          #gmc69307_field_checkShowSize,
          #gmc69307_field_maxHeightList,
          #gmc69307_field_enableHEAD
          {
            margin-left: 1.5em;
          }

          #gmc69307_field_checkTrimSourceCode,
          #gmc69307_field_deobMethod
          {
            margin-left: 3.0em;
          }

          #gmc69307 input[type="radio"]
          {
            top: 0.1em;
          }

          #gmc69307_showKeys_var,
          #gmc69307_fontSize_var
          {
            margin-top: 0.5em !important;
          }

          #gmc69307_buttons_holder { margin: 0.5em 1em; }
          #gmc69307_saveBtn { margin: 0.25em 0 !important; padding: 0 3.0em !important; }
          #gmc69307_resetLink { margin: 0.25em 1.25em 0.25em 0; }
          #gmc69307_closeBtn { display: none; }

        ]]></>.toString(),

        /* Settings object */
        {
          'showStrings': {
              "type": 'checkbox',
              "label": 'Show "Lost and Found" strings if present in sidebar (use newlines to separate)',
              "default": false
          },
          'showStringsString': {
              "type": 'textarea',
              "label": '',
              "default": "cookie\nGM_xmlhttpRequest\nXMLHttpRequest"
          },
          'checkDeobfuscate': {
              "type": 'checkbox',
              "label": 'Deobfuscate',
              "default": true
          },
          'deobMethod': {
              'type': 'radio',
              'options': ['Simple Transcode', 'JsCode'],
              'default': 'Simple Transcode'
          },
          'checkShowSize': {
              "type": 'checkbox',
              "label": 'Show approximate file size in script navigation bar',
              "default": false
          },
          'checkTrimSourceCode': {
              "type": 'checkbox',
              "label": 'Trim " Code" from "Source Code" tab (useful for more real estate)',
              "default": false
          },
          'showKeys': {
              "type": 'checkbox',
              "label": 'Show metadata block keys if present or different then USO in sidebar (use commas to separate)',
              "default": true
          },
          'showKeysString': {
              "type": 'textarea',
              "label": '',
              "default": "name,description,version,copyright,license,namespace,require,resource,include,match,exclude"
          },
          'fontSize': {
              "type": 'unsigned number',
              "label": 'em font size for all items found under the specified item type',
              "default": 1
          },
          'limitMaxHeight': {
              "type": 'checkbox',
              "label": 'Limit maximum height of all shown item types',
              "default": false
          },
          'maxHeightList': {
              "type": 'unsigned number',
              "label": 'em maximum height of all shown item types',
              "default": 10
          },
          'checkAgainstHomepageUSO': {
              "type": 'checkbox',
              "label": 'Check USO require and resource urls against USO script homepage (Rate and Limiting may limit accuracy)',
              "default": false
          },
          'enableHEAD': {
            "type": 'checkbox',
            "label": 'Check urls with a HTTP HEAD request (Not currently recommended)',
            "default": false
          },
          'showStringsStringHeight': {
            "type": 'hidden',
            "default": "4em"
          },
          'showKeysStringHeight': {
              "type": 'hidden',
              "default": "1em"
          }
        }
    );
    if (window.location.pathname == "/scripts/show/69307"
        || window.location.href == "http://userscripts.org/scripts/show/69307/") {
      GM_addStyle(<><![CDATA[ textarea#gmc69307_field_showStringsString { height: ]]></> + gmc.get("showStringsStringHeight") + <><![CDATA[; } ]]></>);
      GM_addStyle(<><![CDATA[ textarea#gmc69307_field_showKeysString { height: ]]></> + gmc.get("showKeysStringHeight") + <><![CDATA[; } ]]></>);

      gmc.open();
    }
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
        retry: 5,
        url: "http://userscripts.org/scripts/source/" + scriptid + ((gmc && gmc.get("showStrings")) ? ".user.js?" : ".meta.js"),
        method: "GET",
        onload: function(xhr) {
          switch (xhr.status) {
            case 503:
              if (--this.retry > 0)
                setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
              break;
            case 200:
              var metadataBlock = xhr.responseText.toString();
              var headers = {};
              var line, name, prefix, header, key, value;
                var lines = metadataBlock.split(/\n/).filter(/\/\/ @\S+/);
                for each (line in lines) {
                  [, name, value] = line.match(/\/\/ @(\S*)\s*(.*)/);
                  value = value.replace(/\s*$/, "");
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

                  .metadataforced, .alert { color: red !important; }
                  .metadataforced:hover { color: orangered !important; }
                  .metadataunknown { color: black; }
                  .metadataunknown:hover { color: gray; }
                  .metadatachecked { color: darkgreen; }
                  .metadatachecked:hover { color: green; }
                  span.metadataforced { color: red; }
                  div.metadata { overflow: auto; }
                  ul.metadata { font-size: x-small; width: 100%; border-width: 0; margin: 0; padding: 0 !important; }
                  li.metadata { color: grey; white-space: nowrap; }
                  span.metadata { color: #666; font-size: 0.7em; }
                  ul.count { font-size: x-small; width: 100%; border-width: 0; margin: 0; padding: 0 !important; }
                  li.count { color: #666; padding-left: 0.5em; }
                  span.count { color: grey; font-size: 0.9em; float: right; margin-right: 0.5em; }
                  li.bar { background-color: #EEE; }
                  .nameMismatch { color: red !important; }
                  .resourceName { margin-right: 0.5em; }
                  ]]></> + "");


                if (gmc) {
                  if (gmc.get("limitMaxHeight"))
                    GM_addStyle(<><![CDATA[ div.metadata { max-height: ]]></> + gmc.get("maxHeightList") + <><![CDATA[em; } ]]></> + "");
                  else
                    GM_addStyle(<><![CDATA[ div.metadata { max-height: none; } ]]></> + "");

                  GM_addStyle(<><![CDATA[ li.metadata, li.count { font-size: ]]></> + gmc.get("fontSize") + <><![CDATA[em ; } ]]></>);
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

                function display2(el, obj, filter, title, forced) {
                  let headerNode = document.createElement("h6");
                  headerNode.textContent = title + ' ';
                  el.appendChild(headerNode);

                  let spanNodeSection = document.createElement("span");
                  spanNodeSection.setAttribute("class", "metadata" + ((forced) ? " metadataforced" : ""));
                  headerNode.appendChild(spanNodeSection);

                  let divNode = document.createElement("div");
                  divNode.setAttribute("class", "metadata");
                  el.appendChild(divNode);

                  let ulNode = document.createElement("ul");
                  ulNode.setAttribute("class", "count");
                  divNode.appendChild(ulNode);

                  let objCount = 0;
                  for (let [name, value] in Iterator(obj)) {
                    let liNode = document.createElement("li");
                    liNode.setAttribute("class", "count" + ((objCount % 2) ? " bar" : ""));
                    liNode.setAttribute("title", name);
                    liNode.textContent = name;

                    let spanNode = document.createElement("span");
                    spanNode.setAttribute("class", "count");
                    spanNode.textContent = " " + value;

                    liNode.appendChild(spanNode);
                    ulNode.appendChild(liNode);

                    objCount++;
                  }
                  spanNodeSection.textContent = objCount;
                }

                function display(el, keys, filter, title, forced) {
                  if (typeof keys == "string")
                    keys = new Array(keys);

                  let headerNode = document.createElement("h6");
                  headerNode.textContent = title + ' ';
                  el.appendChild(headerNode);

                  let spanNodeSection = document.createElement("span");
                  spanNodeSection.setAttribute("class", "metadata" + ((forced) ? " metadataforced" : ""));
                  spanNodeSection.textContent = (keys[0] == "") ? "0" : keys.length;
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
                      case "include":
                        if (key.match(/^\/.*/) || key.match(/ /)) {
                          spanNodeSection.setAttribute("class", "metadata metadataforced");
                          liNode.setAttribute("class", "metadata metadataforced");
                        }
                        liNode.setAttribute("title", key);
                        liNode.textContent = key;
                        ulNode.appendChild(liNode);
                        break;
                      case "require":
                        var matches = key.match(/^https?:\/\/.*/i);
                        if (matches) {
                          let showUrl;
                          matches = key.match(/https?:\/\/userscripts\.org\/scripts\/source\/(\d+)\.user\.js/i);
                          if (matches)
                            showUrl = window.location.protocol + "//userscripts.org/scripts/show/" + matches[1];
                          else {
                            matches = key.match(/https?:\/\/userscripts\.org\/scripts\/version\/(\d+)\/\d+\.user\.js/i);
                            if (matches)
                              showUrl = window.location.protocol + "//userscripts.org/scripts/show/" + matches[1];
                          }

                          let anchorNode = document.createElement("a");
                          anchorNode.setAttribute("href", (showUrl) ? showUrl : key);
                          anchorNode.textContent = key;
                          if (gmc && gmc.get("checkAgainstHomepageUSO") && showUrl)
                            GM_xmlhttpRequest({
                              retry: 5,
                              method: (gmc && gmc.get("enableHEAD") ) ? "HEAD" : "GET",
                              url: showUrl,
                              onload: function(xhr) {
                                switch (xhr.status) {
                                  case 503:
                                    if (--this.retry > 0)
                                      setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                                    else
                                      anchorNode.setAttribute("class", "metadataunknown");
                                    break;
                                  case 200:
                                    anchorNode.setAttribute("class", "metadatachecked");
                                    break;
                                  default:
                                    anchorNode.setAttribute("class", "metadataforced");
                                    break;
                                }
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

                              liNode.setAttribute("title", url[1] + key);
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
                          let showUrl;
                          let matches2 = key.match(/https?:\/\/userscripts\.org\/scripts\/source\/(\d+)\.user\.js/i);
                          if (matches2)
                            showUrl = window.location.protocol + "//userscripts.org/scripts/show/" + matches2[1];
                          else {
                            matches2 = key.match(/https?:\/\/userscripts\.org\/scripts\/version\/(\d+)\/\d+\.user\.js/i);
                            if (matches2)
                              showUrl = window.location.protocol + "//userscripts.org/scripts/show/" + matches2[1];
                          }

                          let spanNode = document.createElement("span");
                          spanNode.setAttribute("class", "resourceName");
                          spanNode.textContent = matches[1];
                          liNode.appendChild(spanNode);

                          let anchorNode = document.createElement("a");
                          anchorNode.setAttribute("href", (showUrl) ? showUrl : matches[2]);
                          anchorNode.textContent = matches[2];

                          if (gmc && gmc.get("checkAgainstHomepageUSO") && showUrl)
                            GM_xmlhttpRequest({
                              retry: 5,
                              method: (gmc && gmc.get("enableHEAD") ) ? "HEAD" : "GET",
                              url: showUrl,
                              onload: function(xhr) {
                                switch (xhr.status) {
                                  case 503:
                                    if (--this.retry > 0)
                                      setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                                    else
                                      anchorNode.setAttribute("class", "metadataunknown");
                                    break;
                                  case 200:
                                    anchorNode.setAttribute("class", "metadatachecked");
                                    break;
                                  default:
                                    anchorNode.setAttribute("class", "metadataforced");
                                    break;
                                }
                            }});

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

                var mbx = document.createElement("div");

                function simpleTranscodeHex(source, counter) {
                  let matched = source.match(/\\x([0-9(?:A-F|a-f)][0-9(?:A-F|a-f)])/m);
                  if (matched)
                    [source, counter] = simpleTranscodeHex(source.replace(matched[0], String.fromCharCode(parseInt("0x" + matched[1], 16)), "m"), counter + 1);

                  return [source, counter];
                }

                if (gmc && gmc.get("showStrings")) {
                  let finds = {}, responseText, hexCount;

                  if (gmc.get("checkDeobfuscate")) {
                    switch (gmc.get("deobMethod")) {
                      case 'Simple Transcode':
                        [responseText, hexCount] = simpleTranscodeHex(xhr.responseText, 0);
                        break;
                      case 'JsCode':
                        responseText = JsCode.deobfuscate(xhr.responseText);
                        break;
                    }
                  }
                  else
                    responseText = xhr.responseText;

                  if (gmc.get("showStringsString")) {
                    for each (rex in gmc.get("showStringsString").split("\n"))
                      for each (let match in responseText.match(new RegExp(rex, "gm")))
                        finds[match] = (match in finds) ? finds[match] + 1 : 1;

                    if (finds.toSource() != "({})")
                      display2(mbx, finds, "", "Lost and Found");
                  }

                  if (gmc.get("checkDeobfuscate") && hexCount)
                    display2(mbx, { "Hex": hexCount }, "", "Encoding");

                  if (gmc.get("checkShowSize")) {
                    let sourceNode = document.evaluate(
                    "//li/a[contains(., 'Source Code')]",
                      document.body,
                      null,
                      XPathResult.FIRST_ORDERED_NODE_TYPE,
                      null
                    );
                    if (sourceNode && sourceNode.singleNodeValue) {
                      let thisNode = sourceNode.singleNodeValue;

                      if (gmc.get("checkTrimSourceCode"))
                        thisNode.textContent = thisNode.textContent.replace(" Code", "");
                      thisNode.textContent += " ";
                      let spanNode = document.createElement("span");
                      spanNode.textContent = (xhr.responseText.length > 1024)
                        ? parseInt(xhr.responseText.length / 1024 * 10) / 10 + "K"
                        : xhr.responseText.length;
                      thisNode.appendChild(spanNode);
                    }
                  }
                }

                if (gmc && gmc.get("showKeys")) {
                  var keys = gmc.get("showKeysString").split(",");
                  for (let i = 0, len = keys.length; i < len; ++i) {
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
                          display(mbx, "", key, "@namespace");
                        break;
                    case "description":
                      if (headers[key]) {
                        if (summaryNode) {
                          let summary = summaryNode.textContent.replace(/^\s*/, "").replace(/\s*$/, "");
                          if (!summary.match(/[\r\n](.*)[\r\n]/) && summary != headers[key]) {
                            display(mbx, headers[key], key, "@description", true);
                            break;
                          }
                        }
                        if (!window.location.pathname.match(/\/scripts\/show\/.+/i))
                          display(mbx, headers[key], key, "@description");
                      }
                        break;
                      case "include":
                        if (headers[key])
                          display(mbx, headers[key], key, "@include");
                        else
                          display(mbx, "", key, "@include", true);
                        break;
                      default:
                        if (window.location.pathname.match(/\/scripts\/show\/.+/i) &&
                            typeof headers[key] == "string" && (key == "version" || key == "copyright" || key == "license" || key == "licence"))
                          break;

                        [key, prefix] = key.split(/:/).reverse();
                        if (!prefix && headers[key])
                          display(mbx, headers[key], key, "@" + key);
                        else if (prefix && headers[prefix][key])
                          display(mbx, headers[prefix][key], key, "@" + prefix + ":" + key);
                        break;
                    }
                  }
                }

                if (window.location.pathname.match(/scripts\/show\/.*/i)) {
                  let fansNode = document.getElementById("fans");
                  if (fansNode) {
                    mbx.style.setProperty("margin-bottom", "0.75em", "");
                    sidebarNode.insertBefore(mbx, fansNode);
                  }
                  else
                    sidebarNode.appendChild(mbx);
                }
                else
                  sidebarNode.appendChild(mbx);
              break;
          }
        }
      });
    }
    else {
      if (gmc.get("checkShowSize")) {
        let sourceNode = document.evaluate(
        "//li[contains(@class, 'current')][contains(., 'Source Code')] | //li/a[contains(., 'Source Code')]",
          document.body,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        if (sourceNode && sourceNode.singleNodeValue) {
          let thisNode = sourceNode.singleNodeValue;

          if (gmc.get("checkTrimSourceCode"))
            thisNode.textContent = thisNode.textContent.replace(" Code", "");
          thisNode.textContent += " ";
          let spanNode = document.createElement("span");
          spanNode.style.setProperty("color", "red", "");

          GM_xmlhttpRequest({
            retry: 5,
            url: "http://userscripts.org/scripts/source/" + scriptid + ".user.js?",
            method: "GET",
            onload: function(xhr) {
              switch (xhr.status) {
                case 503:
                  if (--this.retry > 0)
                    setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                  break;
                case 200:
                  spanNode.style.setProperty("color", "#666", "");
                  spanNode.textContent = (xhr.responseText.length > 1024)
                    ? parseInt(xhr.responseText.length / 1024 * 10) / 10 + "K"
                    : xhr.responseText.length;
                  break;
              }
            }
          });
          spanNode.textContent = "0";
          thisNode.appendChild(spanNode);
        }
      }
    }


    let xpr = document.evaluate(
      "//ul[@id='script-nav']/li[contains(., 'Issues')]",
      document.body,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    if (xpr && xpr.singleNodeValue) {
      let issuesNode = xpr.singleNodeValue;

      let spanNode = document.createElement("span");
      spanNode.textContent = "?";

      function countIssues(doc) {
        if (issuesNode.firstChild.nodeType == 1)
          issuesNode.firstChild.textContent += " ";
        else
          issuesNode.textContent += " ";

          if (doc) {

            let
              yesCount = 0,
              noCount = 0,
              votes = [
                "broken_votes",
                "copy_votes",
                "harmful_votes",
                "spam_votes",
                "vague_votes"
              ]
            ;

            for (let i = 0, vote; vote = votes[i++];) {
              let xpr = doc.evaluate(
                "//a[contains(@href,'/scripts/issues/" + scriptid + "#" + vote + "')]",
                doc.body,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              );
              if (xpr && xpr.singleNodeValue) {
                let thisNode = xpr.singleNodeValue;

                let matches = thisNode.textContent.match(/(\d+) of (\d+) voted yes/i);
                if (matches) {
                  yesCount += parseInt(matches[1]);
                  noCount += parseInt(matches[2]) - parseInt(matches[1]);
                }
              }
            }

            spanNode.textContent = yesCount;
            if (yesCount > noCount)
              spanNode.setAttribute("class", "alert");
          }

        if (issuesNode.firstChild.nodeType == 1)
          issuesNode.firstChild.appendChild(spanNode);
        else
          issuesNode.appendChild(spanNode);
      }

      if (window.location.pathname == ("/scripts/issues/" + scriptid))
        countIssues(document);
      else {
        issuesNode.style.setProperty("background-image", "url(" + throbber + ")", "");

        GM_xmlhttpRequest({
          retry: 5,
          method: "GET",
          url: "http://userscripts.org/scripts/issues/" + scriptid,
          onload: function (xhr) {
            switch (xhr.status) {
              case 503:
                if (--this.retry > 0)
                  setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                else {
                  issuesNode.style.removeProperty("background-image");
                  spanNode.setAttribute("class", "alert");
                  countIssues();
                }
                break;
              case 200:
                issuesNode.style.removeProperty("background-image");

                let
                  dt = document.implementation.createDocumentType(
                    "html",
                    "-//W3C//DTD HTML 4.01 Transitional//EN",
                    "http://www.w3.org/TR/html4/loose.dtd"
                  ),
                  doc = document.implementation.createDocument("", "", dt),
                  documentElement = doc.createElement("html")
                ;

                documentElement.innerHTML = xhr.responseText;
                doc.appendChild(documentElement);

                let html = doc.documentElement.innerHTML;
                doc.documentElement.innerHTML = "";

                let body = doc.createElement("body");
                body.innerHTML = html;
                doc.documentElement.insertBefore(body, doc.documentElement.firstChild);

                let head = doc.createElement("head");
                doc.documentElement.insertBefore(head, doc.documentElement.firstChild);

                countIssues(doc);
                break;
              default:
                issuesNode.style.removeProperty("background-image");
                countIssues();
                break;
            }
          }
        });
      }
    }

  }

})();
