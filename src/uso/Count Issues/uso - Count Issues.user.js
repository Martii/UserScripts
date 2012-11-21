(function() {

// ==UserScript==
//
// @name          uso - Count Issues
// @namespace     http://userscripts.org/users/37004
// @description   Counts issues on USO
// @copyright     2010+, Marti Martz (http://userscripts.org/users/37004)
// @contributor   sizzlemctwizzle (http://userscripts.org/users/27715)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       0.20.0
// @icon          https://s3.amazonaws.com/uso_ss/icon/69307/large.png
//
// @include   /https?:\/\/userscripts\.org\/scripts\/.*/
// @include   /https?:\/\/userscripts\.org\/topics\/.*/
// @include   /https?:\/\/userscripts\.org\/reviews\/.*/
// @exclude   /https?:\/\/userscripts\.org\/scripts\/diff\/.*/
// @exclude   /https?:\/\/userscripts\.org\/scripts\/version\/.*/
//
// @include   http://userscripts.org/scripts/*/*
// @include   https://userscripts.org/scripts/*/*
// @include   http://userscripts.org/topics/*
// @include   https://userscripts.org/topics/*
// @include   http://userscripts.org/reviews/*
// @include   https://userscripts.org/reviews/*
// @exclude http://userscripts.org/scripts/diff/*
// @exclude https://userscripts.org/scripts/diff/*
// @exclude http://userscripts.org/scripts/version/*
// @exclude https://userscripts.org/scripts/version/*
//
// @updateURL  file:
// @installURL file:
// @downloadURL file:
//
// @require https://secure.dune.net/usocheckup/69307.js?maxage=1&topicid=46434
//@require https://secure.dune.net/usocheckup/69307.js?method=update&open=window&maxage=1&custom=yes&topicid=46434&id=usoCheckup
//@require https://userscripts.org/scripts/source/61794.user.js
//
// @require https://userscripts.org/scripts/source/115323.user.js
// @require https://raw.github.com/sizzlemctwizzle/GM_config/7e5dfecf8759719053e1dac71a1a8ee929eb6c8c/gm_config.js
// @require https://raw.github.com/einars/js-beautify/master/beautify.js
// @require https://userscripts.org/scripts/version/87269/525804.user.js
//
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_log
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_xmlhttpRequest
//
// ==/UserScript==


  let protocol = "http" + (/^https:$/i.test(location.protocol) ? "s" : "") + ":";
  let nodeStyle = GM_setStyle({
      media: "screen, projection",
      data:
        [

          ".hid { display: none; }",
          ".HID { display: none !important }"

        ].join("\n")
  });

  function simpleTranscodeDotNotation(line, counter, loop) { // NOTE: Fuzzy
    let matched =  line.match(/\[\"(\w+)\"\]/);
    if (matched) {
      line = line.replace(matched[0], "." + matched[1]);
      ++counter;
      return [line, counter, true];
    }
    else
      return [line, counter, false];
  }

  function simpleTranscodeURLdecode(line, counter, loop) { // NOTE: Fuzzy
    let matched = line.match(/\%([\d(?:A-F|a-f)]{2})/);
    if (matched) {
      line = line.replace(matched[0], String.fromCharCode(parseInt("0x" + matched[1], 16)), "");
      ++counter;
      return [line, counter, true];
    }
    else
      return [line, counter, false];
  }

  function simpleTranscodeHex(line, counter, loop) { // NOTE: Fuzzy
    let matched = line.match(/\\x([\d(?:A-F|a-f)]{2})/);
    if (matched) {
      line = line.replace(matched[0], String.fromCharCode(parseInt("0x" + matched[1], 16)), "");
      ++counter;
      return [line, counter, true];
    }
    else
      return [line, counter, false];
  }

  function simpleTranscode(source, counter) {
    source = js_beautify(source.replace(/[“”]/g, '"'), {indent_size: 1, indent_char: '\t'});

    let dummy = 0;

    let lines = source.split(/[\r\n]/);
    for (let i = 0, loop; i < lines.length; i++) {
      loop = true;
      while (loop)
        [lines[i], counter, loop] = simpleTranscodeHex(lines[i], counter, loop);

      loop = true;
      while (loop)
        [lines[i], dummy, loop] = simpleTranscodeDotNotation(lines[i], dummy, loop);

      loop = true;
      while (loop)
        [lines[i], dummy, loop] = simpleTranscodeURLdecode(lines[i], dummy, loop);
    }
    source = lines.join("\n");

    return [source, counter];
  }

  function enableCTTS() {
    let xpr = document.evaluate(
      "//button[.='Change Tabs to Spaces']",
      document.body,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    if (xpr && xpr.singleNodeValue) {
      let thisNode = xpr.singleNodeValue;

      thisNode.removeAttribute("disabled");
      thisNode = thisNode.nextSibling;
      thisNode.removeAttribute("disabled");
    }
  }

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

    let divNode = document.getElementById("full_description");

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

    /* Nearest fix for a glitch on USO */
    let scriptNav = document.getElementById("script-nav");
    if (scriptNav && divNode && scriptNav.clientWidth != divNode.clientWidth)
      GM_setStyle({
        node: nodeStyle,
        data:
          [
            "div #full_description { width: 98.1%; }"

          ].join("\n")
      });

    let screenShots = document.getElementById("screenshots");
    if (screenShots)
      GM_setStyle({
        node: nodeStyle,
        data:
          [
            "#full_description { clear: left; }"

          ].join("\n")
      });

    /* Nearest fix for userscripts.org Alternate CSS */
    let fullDescription = document.getElementById("full_description");
    if (fullDescription && screenShots && fullDescription.clientWidth > parseInt(screenShots.clientWidth * 1.0275))
      GM_setStyle({
        node: nodeStyle,
        data:
          [
            "#screenshots { width: 97.5% !important; }"

          ].join("\n")
      });

    gmc.init(
      divNode,
      [
          '<img alt="uso &ndash; Count Issues" title="uso &ndash; Count Issues" src="' + protocol + '//s3.amazonaws.com/uso_ss/11760/medium.png" />',
          '<p>Preferences</p>',
          '<a href="' + protocol + '//github.com/sizzlemctwizzle/GM_config/wiki/">',
              '<img alt="Powered in part by GM_config" title="Powered in part by GM_config" src="' + protocol + '//s3.amazonaws.com/uso_ss/9849/large.png" />',
          '</a>',
      ].join(""),

        /* Custom CSS */
        GM_setStyle({
          node: null,
          data:
            [
              "/* Homepage */",
              "@media screen, projection {",
                  "/* GM_config USO styling fixups */",
                  "#gmc69307 { border: 1px solid #ddd; clear: right; margin: 0 0 0.5em; }",
                  "#gmc69307_header > img { height: 32px; margin-right: 0.25em; vertical-align: middle; width: 43px; }",
                  "#gmc69307_header > p { display: inline; }",
                  "#gmc69307_header > a { float: right; margin: 0.4em 0.5em; }",
                  "#gmc69307_wrapper { background-color: #eee; padding-bottom: 0.25em; }",
                  "#gmc69307 .config_header { background-color: #333; color: #fff; font-size: 1.55em; margin: 0; padding: 0 0 0 0.5em; text-align: left; }",
                  "#gmc69307 .config_var { clear: both; margin: 0 1em; padding: 0; }",
                  "#gmc69307 .field_label { color: #333; font-size: 100%; font-weight: normal; }",
                  ".section_desc { margin: 0.25em 1em !important; }",
                  ".gmc-yellownote { background-color: #ffd; font-size: 0.66em; }",

                  "/* Preferences panel */",
                  "#gmc69307_field_showStringsString,",
                  "#gmc69307_field_showKeysString,",
                  "#gmc69307_field_hideH6String,",
                  "#gmc69307_field_hideNavTabString,",
                  "#gmc69307_field_insertH6String",
                  "{ font-size: 1.0em; margin-left: 1.7em; min-width: 95.1%; max-width: 95.1%; }",

                  "#gmc69307_field_showStringsString",
                  "{ height: 8em; min-height: 8em; }",

                  "#gmc69307_field_showKeysString,",
                  "#gmc69307_field_hideH6String,",
                  "#gmc69307_field_hideNavTabString,",
                  "#gmc69307_field_insertH6String",
                  "{ height: 1.2em; max-height: 6em; min-height: 1.2em; }",

                  "#gmc69307_field_useGreasefireUrl,",
                  "#gmc69307_field_showStrings,",
                  "#gmc69307_field_checkDeobfuscate,",
                  "#gmc69307_field_checkShowSize,",
                  "#gmc69307_field_checkTrimSourceCode,",
                  "#gmc69307_field_showKeys,",
                  "#gmc69307_field_limitMaxHeight,",
                  "#gmc69307_field_showOnAboutOnly,",
                  "#gmc69307_field_checkAgainstHomepageUSO,",
                  "#gmc69307_field_enableHEAD,",
                  "#gmc69307_field_checkShowVersionsSource,",
                  "#gmc69307_field_checkShowVersionsLocale,",
                  "#gmc69307_field_checkShowLineNumbers,",
                  "#gmc69307_field_enableQuickReviewsMenu,",
                  "#gmc69307_field_hideH6,",
                  "#gmc69307_field_hideH6Reinforce,",
                  "#gmc69307_field_hideNavTab,",
                  "#gmc69307_field_insertH6",
                  "{ top: 0.075em; }",

                  "#gmc69307_field_useGreasefireUrl,",
                  "#gmc69307_field_showStrings,",
                  "#gmc69307_field_showKeys,",
                  "#gmc69307_field_limitMaxHeight,",
                  "#gmc69307_field_showOnAboutOnly,",
                  "#gmc69307_field_checkShowVersionsSource,",
                  "#gmc69307_field_checkShowLineNumbers,",
                  "#gmc69307_field_enableQuickReviewsMenu,",
                  "#gmc69307_field_hideH6,",
                  "#gmc69307_field_hideNavTab,",
                  "#gmc69307_field_insertH6",
                  "{ margin-left: 0; }",

                  "#gmc69307_field_fontSize,",
                  "#gmc69307_field_maxHeightList",
                  "{ height: 1em; max-height: 2em; min-height: 0.8em; max-width: 4em; min-width: 2em; text-align: right; width: 2em; }",

                  "#gmc69307_field_checkDeobfuscate,",
                  "#gmc69307_field_checkShowSize,",
                  "#gmc69307_field_maxHeightList,",
                  "#gmc69307_field_checkAgainstHomepageUSO,",
                  "#gmc69307_field_checkShowVersionsLocale",
                  "{ margin-left: 1.5em; }",

                  "#gmc69307_field_hideH6Reinforce,",
                  "#gmc69307_field_checkTrimSourceCode,",
                  "#gmc69307_field_deobMethod,",
                  "#gmc69307_field_enableHEAD",
                  "{ margin-left: 3.0em; }",

                  "#gmc69307 input[type='radio']",
                  "{ top: 0.1em; }",

                  "#gmc69307_hideNavTab_var,",
                  "#gmc69307_enableQuickReviewsMenu_var,",
                  "#gmc69307_showStrings_var,",
                  "#gmc69307_showKeys_var,",
                  "#gmc69307_fontSize_var",
                  "{ margin-top: 0.5em !important; }",


                  "#gmc69307_showStringsString_field_label,",
                  "#gmc69307_showKeysString_field_label,",
                  "#gmc69307_field_hideH6Reinforce_field_label,",
                  "#gmc69307_hideH6String_field_label,",
                  "#gmc69307_hideNavTabString_field_label,",
                  "#gmc69307_insertH6String_field_label",
                  "{ margin: 0 0 0 1.75em; }",

                  "#gmc69307_buttons_holder { margin-right: 1.0em; }",
                  "#gmc69307_saveBtn { margin: 0.25em 0 !important; padding: 0 3.0em !important; }",
                  "#gmc69307_resetLink { margin: 0.25em 1.25em 0.25em 0; }",
                  "#gmc69307_closeBtn { display: none; }",
              "}",

              "@media print {",
                  ".hid, #gmc69307 { display: none; }",
              "}"

            ].join("\n")
        }),
        /* Settings object */
        {
          'enableQuickReviewsMenu': {
              "type": 'checkbox',
              "label": 'Enable quick reviews menu',
              "default": true
          },
          'hideNavTab': {
              "type": 'checkbox',
              "label": 'Hide navigation tab(s) if present',
              "default": false
          },
          'hideNavTabString': {
              "type": 'textarea',
              "label": '<em class="gmc-yellownote">use commas to separate tabs</em>',
              "default": "Share"
          },
          'hideH6': {
              "type": 'checkbox',
              "label": 'Hide header(s) if present in sidebar',
              "default": false
          },
          'hideH6String': {
              "type": 'textarea',
              "label": '<em class="gmc-yellownote">use commas to separate headers</em>',
              "default": "Share"
          },
          'hideH6Reinforce': {
              "type": 'checkbox',
              "label": 'Reinforce hidden status',
              "default": true
          },
          'showStrings': {
              "type": 'checkbox',
              "label": 'Show "Lost and Found" string(s) if present in sidebar',
              "default": false
          },
          'showStringsString': {
              "type": 'textarea',
              "label": '<em class="gmc-yellownote">use newlines to separate regular expression strings</em>',
              "default": "cookie\nGM_xmlhttpRequest\nXMLHttpRequest\nlocation\nexport\n\\b(?:un)?eval\\b\n(?:https?:\\/\\/.*?\\.google\\.com)?\\/?blank\\.html?"
          },
          'checkDeobfuscate': {
              "type": 'checkbox',
              "label": 'Deobfuscate',
              "default": true
          },
          'deobMethod': {
              "type": 'radio',
              "options": ['Simple Transcode', 'JsCode'],
              "default": 'Simple Transcode'
          },
          'checkShowSize': {
              "type": 'checkbox',
              "label": 'Show approximate file size in script navigation bar',
              "default": false
          },
          'checkTrimSourceCode': {
              "type": 'checkbox',
              "label": 'Trim " Code" from "Source Code" tab <em class="gmc-yellownote">useful for more screen real estate</em>',
              "default": false
          },
          'showKeys': {
              "type": 'checkbox',
              "label": 'Show metadata block key(s) if present or different than USO in sidebar',
              "default": true
          },
          'showKeysString': {
              "type": 'textarea',
              "label": '<em class="gmc-yellownote">use commas to separate keys</em>',
              "default": "name,icon,description,version,copyright,license,namespace,updateURL,downloadURL,installURL,grant,require,resource,run-at,include,match,exclude"
          },
          'checkAgainstHomepageUSO': {
              "type": 'checkbox',
              "label": 'Check USO require and resource urls against USO script homepage <em class="gmc-yellownote">Rate and Limiting may limit accuracy</em>',
              "default": false
          },
          'enableHEAD': {
            "type": 'checkbox',
            "label": 'Check urls with a HTTP HEAD request</em>',
            "default": true
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
          'showOnAboutOnly': {
              "type": 'checkbox',
              "label": 'Show sidebar on script homepage only <em class="gmc-yellownote">useful for CPU conservation when examining large scripts</em>',
              "default": true
          },
          'insertH6': {
              "type": 'checkbox',
              "label": 'Insert item types before these headers if present <em class="gmc-yellownote">leave blank for first - disable for last</em>',
              "default": false
          },
          'insertH6String': {
              "type": 'textarea',
              "label": '<em class="gmc-yellownote">use commas to separate headers</em>',
              "default": ""
          },
          'useGreasefireUrl': {
              "section": [, ""],
              "type": 'checkbox',
              "label": 'Use greasefire USO urls whenever possible <em class="gmc-yellownote">useful for bandwidth conservation but not properly secured nor always available</em>',
              "default": false
          },
          'showStringsStringHeight': {
            "type": 'hidden',
            "default": "8em"
          },
          'showKeysStringHeight': {
              "type": 'hidden',
              "default": "1.2em"
          },
          'hideH6StringHeight': {
              "type": 'hidden',
              "default": "1.2em"
          },
          'hideNavTabStringHeight': {
              "type": 'hidden',
              "default": "1.2em"
          },
          'insertH6StringHeight': {
              "type": 'hidden',
              "default": "1.2em"
          },
          'checkShowVersionsSource': {
              "type": 'checkbox',
              "label": 'Show inline Versions and Diffs on Source Code page',
              "default": true
          },
          'checkShowVersionsLocale': {
              "type": 'checkbox',
              "label": 'Use Locale instead of UTC when logged out',
              "default": true
          },
          'checkShowLineNumbers': {
              "type": 'checkbox',
              "label": 'Show line numbers on Source Code page <em class="gmc-yellownote">BETA</em>',
              "default": false
          }
        }
    );

    gmc.onReset = function () {
      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "textarea#gmc69307_field_hideNavTabString { height: " + gmc.fields["hideNavTabStringHeight"].settings.default + "; }",
              "textarea#gmc69307_field_hideH6String { height: " + gmc.fields["hideH6StringHeight"].settings.default + "; }",
              "textarea#gmc69307_field_showStringsString { height: " + gmc.fields["showStringsStringHeight"].settings.default + "; }",
              "textarea#gmc69307_field_showKeysString { height: " + gmc.fields["showKeysStringHeight"].settings.default + "; }",
              "textarea#gmc69307_field_insertH6String { height: " + gmc.fields["insertH6StringHeight"].settings.default + "; }"

            ].join("\n")
      });
    }

    gmc.onSave = function () {
      let write = false;
      let open = false;

        if (gmc.get("limitMaxHeight"))
          GM_setStyle({
              node: nodeStyle,
              data:
                [
                  "div.metadata { max-height: " + gmc.get("maxHeightList") + "em; }"

                ].join("\n")
          });
        else
          GM_setStyle({
              node: nodeStyle,
              data:
                [
                  "div.metadata { max-height: none; }"

                ].join("\n")
          });

        GM_setStyle({
            node: nodeStyle,
            data:
              [
                "li.metadata, li.count { font-size: " + gmc.get("fontSize") + "em ; }"

              ].join("\n")
        });

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
      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "textarea#gmc69307_field_showStringsString { height: " + gmc.get("showStringsStringHeight") + "; }"

            ].join("\n")
      });

      height = gmc.fields["showStringsString"].node.clientHeight + "px";
        if (height != gmc.get("showStringsStringHeight")) {
          gmc.set("showStringsStringHeight", height);
          write = true;
        }

      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "textarea#gmc69307_field_showKeysString { height: " + gmc.get("showKeysStringHeight") + "; }"

            ].join("\n")
      });
      height = gmc.fields["showKeysString"].node.clientHeight + "px";
        if (height != gmc.get("showKeysStringHeight")) {
          gmc.set("showKeysStringHeight", height);
          write = true;
        }

      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "textarea#gmc69307_field_hideH6String { height: " + gmc.get("hideH6StringHeight") + "; }"

            ].join("\n")
      });
      height = gmc.fields["hideH6String"].node.clientHeight + "px";
        if (height != gmc.get("hideH6StringHeight")) {
          gmc.set("hideH6StringHeight", height);
          write = true;
        }

      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "textarea#gmc69307_field_hideNavTabString { height: " + gmc.get("hideNavTabStringHeight") + "; }"

            ].join("\n")
      });
      height = gmc.fields["hideNavTabString"].node.clientHeight + "px";
        if (height != gmc.get("hideNavTabStringHeight")) {
          gmc.set("hideNavTabStringHeight", height);
          write = true;
        }

      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "textarea#gmc69307_field_insertH6String { height: " + gmc.get("insertH6StringHeight") + "; }"

            ].join("\n")
      });
      height = gmc.fields["insertH6String"].node.clientHeight + "px";
        if (height != gmc.get("insertH6StringHeight")) {
          gmc.set("insertH6StringHeight", height);
          write = true;
        }

      if (write) gmc.write();
      if (open) { gmc.close(); gmc.open(); }
    }

    if (window.location.href.match(/^(?:https?:\/\/userscripts\.org)?\/scripts\/show\/69307\/?/i)) {
      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "textarea#gmc69307_field_showStringsString { height: " + gmc.get("showStringsStringHeight") + "; }",
              "textarea#gmc69307_field_showKeysString { height: " + gmc.get("showKeysStringHeight") + "; }",
              "textarea#gmc69307_field_hideH6String { height: " + gmc.get("hideH6StringHeight") + "; }",
              "textarea#gmc69307_field_hideNavTabString { height: " + gmc.get("hideNavTabStringHeight") + "; }",
              "textarea#gmc69307_field_insertH6String { height: " + gmc.get("insertH6StringHeight") + "; }"

            ].join("\n")
      });

      gmc.open();
      document.getElementById("gmc69307").removeAttribute("style");

      gmc.fields["showStringsString"].node.setAttribute("spellcheck", "false");
      gmc.fields["showKeysString"].node.setAttribute("spellcheck", "false");
    }
  }
  else
    GM_log('Something may have gone wrong in uso - Count Issues. Please let me know steps to reproduce');

  function nsResolver(prefix) {
    let ns = {
      "xhtml": "http://www.w3.org/1999/xhtml"
    };
    return ns[prefix] || null;
  }

  let xpr = document.evaluate(
   "//h2[@class='title']/a|//h2[@class='title']",
    document.body,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  let titleNode = xpr.snapshotItem((xpr.snapshotLength > 1) ? 1 : 0);

  let summaryNode;
  document.evaluate(
   "//div[@id='summary']",
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    xpr
  );
  if (xpr && xpr.singleNodeValue)
    summaryNode = xpr.singleNodeValue;

  function getScriptid() {
    let scriptid = window.location.pathname.match(/\/scripts\/.+\/(\d+)/i);
    if (!scriptid) {
      if (titleNode)
        scriptid = titleNode.pathname.match(/\/scripts\/show\/(\d+)/i);
    }
    return (scriptid) ? scriptid[1] : undefined;
  }

  let scriptid = getScriptid();
  if (scriptid) {

    let insNode = document.evaluate(
      "//div[@id='section']//ins",
      document.body,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    if (insNode && !insNode.singleNodeValue)
      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "body.scripts.anon #right { margin-top: 0; }"

            ].join("\n")
      });

    if (gmc.get("enableQuickReviewsMenu")) {
      let xpr = document.evaluate(
        "//ul[@id='script-nav']//a[starts-with(.,'Reviews')]",
        document.body,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      if (xpr && xpr.singleNodeValue) {
        let thisNode = xpr.singleNodeValue.parentNode;

        function onmouseover(ev) {
          this.firstChild.nextSibling.classList.remove("hid");
        }

        function onmouseout(ev) {
          this.firstChild.nextSibling.classList.add("hid");
        }

        thisNode.addEventListener("mouseover", onmouseover, false);
        thisNode.addEventListener("mouseout", onmouseout, false);

        GM_setStyle({
            node: nodeStyle,
            data:
              [
                ".menu-reviews { background-color: #eee; position: absolute; z-index: 1; }",
                ".menu-reviews, #divQuickAdmin { border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; border-left: 1px solid #ccc; }",

                ".menu-reviews ul { list-style: none outside none; margin: 0; padding: 0.6em 0; }",
                ".menu-reviews ul li { float: none !important; line-height: 1.4em !important; !important; height: auto !important; }",
                ".menu-reviews ul li a { text-decoration: underline !important; }"

              ].join("\n")
        });

        if (parseFloat(window.getComputedStyle(thisNode, null).getPropertyValue("font-size").replace(/px$/, "")) > 12)
          GM_setStyle({
              node: nodeStyle,
              data:
                [
                  ".menu-reviews { font-size: 0.9em; }"

                ].join("\n")
          });

        let owned = false;
        document.evaluate(
          "//ul[@id='script-nav']//a[starts-with(.,'Admin')]",
          document.body,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          xpr
        );
        if (xpr && xpr.singleNodeValue) {
          owned = true;
        }

        let authenticated = false;
        document.evaluate(
          "//ul[@class='login_status']//a[@href='/logout']",
          document.body,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          xpr
        );
        if (xpr && xpr.singleNodeValue) {
          authenticated = true;
        }

        let menu = {
          "Sort by highest": "/scripts/reviews/" + scriptid + "?sort=highest",
          "Sort by lowest": "/scripts/reviews/" + scriptid + "?sort=lowest",
          "Sort by comments": "/scripts/reviews/" + scriptid + "?sort=comments",
          "Sort by helpful": "/scripts/reviews/" + scriptid + "?sort=helpful"
        };

        if (!owned && authenticated)
          menu["Add your review"] = "/reviews/new?script_id=" + scriptid;

        let ulNode = document.createElement("ul");

        for (let item in menu) {
          let aNode = document.createElement("a");
          aNode.textContent = item;
          aNode.href = menu[item];

          let liNode = document.createElement("li");
          liNode.appendChild(aNode);
          ulNode.appendChild(liNode);
        }

        let divNode = document.createElement("div");
        divNode.className = "menu-reviews";
        divNode.classList.add("hid");

        divNode.appendChild(ulNode);
        thisNode.appendChild(divNode);
      }
    }

    if (gmc.get("hideNavTab")) {
      let tabNodes = document.evaluate(
      "//ul[@id='script-nav']/li",
        document.documentElement,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      if (tabNodes)
        for (let i = 0, thisNode; thisNode = tabNodes.snapshotItem(i++);) {
          let tabs = gmc.get("hideNavTabString").split(",");
          for each (let tab in tabs) {
            let rex = "\\s*" + tab;
            if (thisNode.textContent.match(new RegExp(rex, "")))
              thisNode.classList.add("hid");
          }
        }
    }

    if (gmc.get("hideH6")) {
      let headerNodes = document.evaluate(
      "//h6",
        document.documentElement,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      if (headerNodes)
        for (let i = 0, thisNode; thisNode = headerNodes.snapshotItem(i++);) {
          let headers = gmc.get("hideH6String").split(",");
          for each (let header in headers) {
            let rex = "\\s*" + header;
            if (thisNode.textContent.match(new RegExp(rex, ""))) {
              thisNode.classList.add("hid");

              let thatNode = thisNode.nextSibling;
              let loop = true;
              while(loop) {
                if (thatNode.tagName)
                  if (thatNode.tagName.toLowerCase() != "h6")
                    switch (thatNode.tagName.toLowerCase()) {
                      case "script":
                        break;
                      default:
                        if (thatNode.id != "fans")
                          if (gmc.get("hideH6Reinforce"))
                            thatNode.classList.add("HID");
                          else
                            thatNode.classList.add("hid");
                        break;
                    }
                  else
                    loop = false;
               thatNode = thatNode.nextSibling;
               if (!thatNode)
                 loop = false;
              }

            }
          }
        }
    }

    if (gmc.get("showOnAboutOnly") && !window.location.pathname.match(/\/show\//i))
      ;
    else {
      let hookNode = document.getElementById("right");
      if (hookNode) {
        GM_xmlhttpRequest({
          retry: 5,
          url: protocol + "//userscripts.org/scripts/source/" + scriptid + ".meta.js",
          method: "GET",
          onload: function(xhr) {
            switch (xhr.status) {
              case 404:
              case 500:
              case 502:
              case 503:
                if (this.retry-- > 0)
                  setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                break;
              case 200:
                let metadataBlock = xhr.responseText.toString();
                let headers = {};
                let line, name, prefix, header, key, value;
                  function isKey(e, i, a) { return (e.match(/^\s*\/\/ @\S+/)); }
                  let lines = metadataBlock.split(/[\r\n]+/).filter(isKey);
                  for each (line in lines) {
                    [, name, value] = line.match(/^\s*\/\/ @(\S*)\s*(.*)/);
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

                  let sidebarNode = document.getElementById("script_sidebar");
                  if (!sidebarNode) {
                    sidebarNode = document.createElement("div");
                    sidebarNode.setAttribute("id", "script_sidebar");
                    hookNode.appendChild(sidebarNode);
                  }

                  GM_setStyle({
                      node: nodeStyle,
                      data:
                        [
                          ".metadataforced, .alert { color: red !important; }",
                          ".metadataforced:hover { color: orangered !important; }",
                          ".metadataunknown { color: black; }",
                          ".metadataunknown:hover { color: gray; }",
                          ".metadatachecked { color: darkgreen; }",
                          ".metadatachecked:hover { color: green; }",
                          "span.metadataforced { color: red; }",
                          "div.metadata { overflow: auto; }",
                          "ul.metadata { font-size: x-small; width: 100%; border-width: 0; margin: 0; padding: 0 !important; }",
                          "li.metadata { color: grey; white-space: nowrap; }",
                          "span.metadata { color: #666; font-size: 0.7em; }",
                          "ul.count { font-size: x-small; width: 100%; border-width: 0; margin: 0; padding: 0 !important; }",
                          "li.count { text-align: left; color: #666; padding-left: 0.5em; }",
                          "span.count { text-align: right; float: right; color: #fff; font-size: 0.9em; font-weight: bold; margin-left: 0.25em; margin-right: 0.5em; -moz-border-radius: 1.3em 0 0 1.3em; border-radius: 1.3em 0 0 1.3em; background-color: #f80; padding-left: 0.7em; padding-right: 0.5em; font-family: serif; }",
                          "li.bar { background-color: #EEE; }",
                          ".nameMismatch { color: red !important; }",
                          ".resourceName { margin-right: 0.5em; }"

                        ].join("\n")
                  });


                  if (gmc.get("showStrings")) {
                    let currentVersion = (typeof headers["uso"]["version"] == "string") ? headers["uso"]["version"] : headers["uso"]["version"][headers["uso"]["version"].length -1];
                    GM_xmlhttpRequest({
                      retry: 5,
                      url: protocol + "//userscripts.org/scripts/version/" + scriptid + "/" + currentVersion + ".user.js",
                      method: "GET",
                      onload: function(xhr) {
                        switch (xhr.status) {
                          case 404:
                          case 500:
                          case 502:
                          case 503:
                            if (this.retry-- > 0)
                              setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                            break;
                          case 200:
                            function display2(el, obj, filter, title, forced) {
                              let headerNode = document.createElement("h6");
                              headerNode.textContent = title + ' ';
                              el.parentNode.insertBefore(headerNode, el);

                              let spanNodeSection = document.createElement("span");
                              spanNodeSection.setAttribute("class", "metadata" + ((forced) ? " metadataforced" : ""));
                              headerNode.appendChild(spanNodeSection);

                              let divNode = document.createElement("div");
                              divNode.setAttribute("class", "metadata");
                              el.parentNode.insertBefore(divNode, el);

                              let ulNode = document.createElement("ul");
                              ulNode.setAttribute("class", "count");
                              divNode.appendChild(ulNode);

                              let objCount = 0;
                              for (let [name, value] in Iterator(obj)) {
                                let liNode = document.createElement("li");
                                liNode.setAttribute("class", "count" + ((objCount % 2) ? " bar" : ""));
                                liNode.setAttribute("title", name);

                                let textNode = document.createTextNode(name);

                                let spanNode = document.createElement("span");
                                spanNode.setAttribute("class", "count");
                                spanNode.textContent = value;

                                liNode.appendChild(spanNode);
                                liNode.appendChild(textNode);
                                ulNode.appendChild(liNode);

                                objCount++;
                              }
                              spanNodeSection.textContent = objCount;
                            }

                            let finds = {}, responseText, hexCount;

                            if (gmc.get("checkDeobfuscate")) {
                              switch (gmc.get("deobMethod")) {
                                case 'Simple Transcode':
                                  try {
                                    [responseText, hexCount] = simpleTranscode(xhr.responseText, 0);
                                  }
                                  catch(e) {
                                    GM_log('Too much recursion error encountered. Aborting Transcode');
                                    responseText = xhr.responseText;
                                  }
                                  break;
                                case 'JsCode':
                                  try {
                                    responseText = JsCode.deobfuscate(xhr.responseText);
                                  }
                                  catch(e) {
                                    GM_log('Too much recursion error encountered. Aborting JsCode...fallback to Transcode');
                                    try {
                                      [responseText, hexCount] = simpleTranscode(xhr.responseText, 0);
                                    }
                                    catch(e) {
                                      GM_log('Too much recursion error encountered. Aborting Transcode');
                                      responseText = xhr.responseText;
                                    }
                                  }
                                  break;
                              }
                            }
                            else
                              responseText = xhr.responseText;

                            if (gmc.get("showStringsString")) {
                              for each (let rex in gmc.get("showStringsString").split("\n"))
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
                            break;
                          default:
                            break;
                        }
                      }
                    });
                  }

                  if (gmc.get("limitMaxHeight"))
                    GM_setStyle({
                        node: nodeStyle,
                        data:
                          [
                            "div.metadata { max-height: " + gmc.get("maxHeightList") + "em; }"

                          ].join("\n")
                    });
                  else
                    GM_setStyle({
                        node: nodeStyle,
                        data:
                          [
                            "div.metadata { max-height: none; }"

                          ].join("\n")
                    });

                  GM_setStyle({
                      node: nodeStyle,
                      data:
                        [
                          "li.metadata, li.count { font-size: " + gmc.get("fontSize") + "em ; }"

                        ].join("\n")
                  });

                  // Pick last name entry and compare it to current Title if derived copy
                  let nameKey;
                  if (typeof headers["name"] == "object")
                    nameKey = headers["name"][headers["name"].length - 1];
                  else
                    nameKey = headers["name"];

                    if (nameKey != titleNode.textContent) {
                      titleNode.setAttribute("class", titleNode.getAttribute("class") + " titleWarn");

                      if (name.toLowerCase() != titleNode.textContent.toLowerCase()) {
                        titleNode.setAttribute("class", titleNode.getAttribute("class") + " nameMismatch");
                        titleNode.setAttribute("title", "@name " + nameKey);
                      }
                      else
                        titleNode.setAttribute("title", "@uso:name " + nameKey);
                    }

                  function display(el, keys, filter, title, forced) {
                    if (typeof keys == "string")
                      keys = new Array(keys);

                    let textNode = document.createTextNode(" ");

                    let aNode = document.createElement("a");
                    aNode.style.setProperty("text-decoration", "none", "");
                    aNode.style.setProperty("color", "#000", "");
                    aNode.href = protocol + "//sourceforge.net/apps/mediawiki/greasemonkey/index.php?title=Metadata_Block#.40" + title.replace("@", "");
                    aNode.textContent = title;

                    let headerNode = document.createElement("h6");
                    headerNode.appendChild(aNode);
                    headerNode.appendChild(textNode);

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

                    let keyCount = 0;
                    for each (let key in keys) {
                      let liNode = document.createElement("li");
                      liNode.setAttribute("class", "metadata");

                      let matches;
                      switch(filter) {
                        case "namespace":
                        case "icon":
                          if (++keyCount > 1)
                            spanNodeSection.setAttribute("class", "metadata metadataforced");

                          matches = key.match(/^(https?:\/\/.*)/i);
                          if (matches) {
                            let anchorNode = document.createElement("a");
                            anchorNode.setAttribute("href", matches[1]);
                            anchorNode.setAttribute("rel", "nofollow");
                            anchorNode.textContent = matches[1];

                            liNode.setAttribute("title", matches[1]);
                            liNode.appendChild(anchorNode);

                            ulNode.appendChild(liNode);
                          }
                          else {
                            matches = key.match(/^(data:image\/.*)/i);
                            if (matches) {
                              let imgNode = document.createElement("img");
                              imgNode.setAttribute("src", matches[1]);
                              imgNode.style.setProperty("width", "32px", "");
                              imgNode.style.setProperty("width", "32px", "");
                              imgNode.setAttribute("title", "~" + parseInt(matches[1].length / 1024 * 10) / 10 + "K " + matches[1].match(/^data:(?:\w*\/.*?[;,])?/i) + "\u2026");
                              liNode.appendChild(imgNode);

                              ulNode.appendChild(liNode);
                            }
                            else {
                              liNode.setAttribute("title", key);
                              liNode.textContent = key;
                              ulNode.appendChild(liNode);
                            }
                          }
                          break;
                        case "include":
                        case "exclude":
                        case "userInclude":
                        case "userExclude":
                          if (key.match(/\s/)) {
                            spanNodeSection.setAttribute("class", "metadata metadataforced");
                            liNode.setAttribute("class", "metadata metadataforced");
                          }
                          liNode.setAttribute("title", key);
                          liNode.textContent = key;
                          ulNode.appendChild(liNode);
                          break;
                        case "require":
                          matches = key.match(/^https?:\/\/.*/i);
                          if (matches) {
                            let showUrl;
                            matches = key.match(/https?:\/\/userscripts\.org\/scripts\/source\/(\d+)\.user\.js/i);
                            if (matches)
                              showUrl = protocol + "//userscripts.org/scripts/show/" + matches[1];
                            else {
                              matches = key.match(/https?:\/\/userscripts\.org\/scripts\/version\/(\d+)\/\d+\.user\.js/i);
                              if (matches)
                                showUrl = protocol + "//userscripts.org/scripts/show/" + matches[1];
                            }

                            let anchorNode = document.createElement("a");
                            anchorNode.setAttribute("href", (showUrl) ? showUrl : key);
                            anchorNode.setAttribute("rel", "nofollow");
                            anchorNode.textContent = key;
                            if (gmc.get("checkAgainstHomepageUSO") && showUrl)
                              GM_xmlhttpRequest({
                                retry: 5,
                                method: (gmc && gmc.get("enableHEAD") ) ? "HEAD" : "GET",
                                url: showUrl,
                                onload: function(xhr) {
                                  switch (xhr.status) {
                                    case 404:
                                    case 500:
                                    case 502:
                                    case 503:
                                      if (this.retry-- > 0)
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
                            let xpr = document.evaluate(
                              "//div[@id='summary']/p/a[.='Remotely hosted version']",
                              document.documentElement,
                              null,
                              XPathResult.FIRST_ORDERED_NODE_TYPE,
                              null
                            );
                            if (xpr && xpr.singleNodeValue) {
                              let thisNode = xpr.singleNodeValue;
                              let baseUrl = thisNode.href.match(/(.*\/).*\.user\.js$/i);
                              if (baseUrl) {
                                spanNodeSection.setAttribute("class", "metadata metadataforced");

                                let anchorNode = document.createElement("a");
                                anchorNode.setAttribute("href", baseUrl[1] + key);
                                anchorNode.setAttribute("rel", "nofollow");
                                anchorNode.style.setProperty("color", "red", "");
                                anchorNode.textContent = key;

                                liNode.setAttribute("title", baseUrl[1] + key);
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
                          matches = key.match(/^([\w\.\_\-]+)\s*(https?:\/\/.*)/i);
                          if (matches) {
                            let showUrl;
                            let matches2 = key.match(/https?:\/\/userscripts\.org\/scripts\/source\/(\d+)\.user\.js/i);
                            if (matches2)
                              showUrl = protocol + "//userscripts.org/scripts/show/" + matches2[1];
                            else {
                              matches2 = key.match(/https?:\/\/userscripts\.org\/scripts\/version\/(\d+)\/\d+\.user\.js/i);
                              if (matches2)
                                showUrl = protocol + "//userscripts.org/scripts/show/" + matches2[1];
                            }

                            let spanNode = document.createElement("span");
                            spanNode.setAttribute("class", "resourceName");
                            spanNode.textContent = matches[1];
                            liNode.appendChild(spanNode);

                            let anchorNode = document.createElement("a");
                            anchorNode.setAttribute("href", (showUrl) ? showUrl : matches[2]);
                            anchorNode.setAttribute("rel", "nofollow");
                            anchorNode.textContent = matches[2];

                            if (gmc.get("checkAgainstHomepageUSO") && showUrl)
                              GM_xmlhttpRequest({
                                retry: 5,
                                method: (gmc && gmc.get("enableHEAD") ) ? "HEAD" : "GET",
                                url: showUrl,
                                onload: function(xhr) {
                                  switch (xhr.status) {
                                    case 404:
                                    case 500:
                                    case 502:
                                    case 503:
                                      if (this.retry-- > 0)
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
                            let xpr = document.evaluate(
                              "//div[@id='summary']/p/a[.='Remotely hosted version']",
                              document.documentElement,
                              null,
                              XPathResult.FIRST_ORDERED_NODE_TYPE,
                              null
                            );
                            if (xpr && xpr.singleNodeValue) {
                              let thisNode = xpr.singleNodeValue;
                              let baseUrl = thisNode.href.match(/(.*\/).*\.user\.js$/i);
                              if (baseUrl) {
                                spanNodeSection.setAttribute("class", "metadata metadataforced");

                                let resourceName = key.match(/(.*)[\s\t]/i)[1];
                                let targetUrl = key.match(/[\s\t](.*)$/i)[1];

                                let spanNode = document.createElement("span");
                                spanNode.setAttribute("class", "resourceName");
                                spanNode.textContent = resourceName;
                                liNode.appendChild(spanNode);

                                let anchorNode = document.createElement("a");
                                anchorNode.setAttribute("href", baseUrl[1] + targetUrl);
                                anchorNode.setAttribute("rel", "nofollow");
                                anchorNode.style.setProperty("color", "red", "");
                                anchorNode.textContent = targetUrl;

                                liNode.setAttribute("title", baseUrl[1] + targetUrl);
                                liNode.appendChild(anchorNode);

                                ulNode.appendChild(liNode);
                                break;
                              }
                            }
                          }
                        case 'updateURL':
                        case 'installURL':
                        case 'downloadURL':
                          let rex = new RegExp("^https?:\\/\\/userscripts\\.org\\/scripts\\/source\\/(\\d+)\\.(meta|user)\\.js", "i");
                          matches = key.match(rex);
                          if (matches) {
                            if (matches[1] != scriptid || (matches[2] == "user" && filter == "updateURL") || ++keyCount > 1)
                              spanNodeSection.setAttribute("class", "metadata metadataforced");

                            let anchorNode = document.createElement("a");
                            anchorNode.setAttribute("href", "/scripts/show/" + matches[1]);
                            anchorNode.setAttribute("rel", "nofollow");
                            anchorNode.textContent = key;

                            liNode.setAttribute("title", key);
                            liNode.appendChild(anchorNode);

                            ulNode.appendChild(liNode);
                            break;
                          }
                          else {
                            if (key.match(/^https?:\/\/.*/)) {  // NOTE: Offsite
                              spanNodeSection.setAttribute("class", "metadata metadataforced");

                              let anchorNode = document.createElement("a");
                              anchorNode.setAttribute("href", key);
                              anchorNode.setAttribute("rel", "nofollow");
                              anchorNode.textContent = key;

                              liNode.setAttribute("title", key);
                              liNode.appendChild(anchorNode);

                              ulNode.appendChild(liNode);
                              break;
                            }
                            else { // NOTE: Any other protocol or relative (which may not be supported yet)
                              let xpr = document.evaluate(
                                "//div[@id='summary']/p/a[.='Remotely hosted version']",
                                document.documentElement,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                              );
                              if (xpr && xpr.singleNodeValue) {
                                let thisNode = xpr.singleNodeValue;

                                spanNodeSection.setAttribute("class", "metadata metadataforced");

                                let baseUrl = thisNode.href.match(/(.*\/).*\.user\.js$/i);
                                if (baseUrl) {
                                  let anchorNode = document.createElement("a");
                                  anchorNode.setAttribute("href", baseUrl[1] + key);
                                  anchorNode.setAttribute("rel", "nofollow");
                                  anchorNode.style.setProperty("color", "red", "");
                                  anchorNode.textContent = key;

                                  liNode.setAttribute("title", baseUrl[1] + key);
                                  liNode.appendChild(anchorNode);

                                  ulNode.appendChild(liNode);
                                  break;
                                }
                              }
                            }
                          }
                        default:
                          if (key == "")
                            spanNodeSection.textContent = parseInt(spanNodeSection.textContent) + 1;
                          liNode.setAttribute("title", key);
                          liNode.textContent = key;
                          ulNode.appendChild(liNode);
                          break;
                      }
                    }
                  }

                  let mbx = document.createElement("div");

                  if (gmc.get("showKeys")) {
                    let keys = gmc.get("showKeysString").split(",");
                    for (let i = 0, len = keys.length; i < len; ++i) {
                      let key = keys[i];

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
                              let xpr = document.evaluate(
                              "./p/b[.='Script Summary:']/following-sibling::text()",
                                summaryNode,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                              );
                              if (xpr && xpr.singleNodeValue) {
                                let thisNode = xpr.singleNodeValue;

                                let currentSummary = (headers[key] && typeof headers[key] == "string") ? headers[key] : headers[key][0];
                                if (currentSummary.trim() != thisNode.textContent.trim()) {
                                  display(mbx, headers[key], key, "@description", true);
                                  break;
                                }
                              }
                              else
                                GM_log('Possible DOM change detected or no Script Summary');
                            }
                            if (!window.location.pathname.match(/\/scripts\/show\/.+/i))
                              display(mbx, headers[key], key, "@description");
                          }
                          break;
                        case "version":
                          if (headers[key]) {
                            if (summaryNode) {
                              let xpr = document.evaluate(
                              "./p/b[.='Version:']/following-sibling::text()",
                                summaryNode,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                              );
                              if (xpr && xpr.singleNodeValue) {
                                let thisNode = xpr.singleNodeValue;

                                let currentVersion = (headers[key] && typeof headers[key] == "string") ? headers[key] : headers[key][0];
                                if (currentVersion.trim() != thisNode.textContent.trim()) {
                                  display(mbx, headers[key], key, "@version", true);
                                  break;
                                }
                              }
                              else
                                GM_log('Possible DOM change detected');
                            }
                            if (!window.location.pathname.match(/\/scripts\/show\/.+/i))
                              display(mbx, headers[key], key, "@version");
                          }
                          break;
                        case "include":
                          let notify = true;
                          if (headers["exclude"])
                            for each (let exclude in (typeof headers["exclude"] == "string") ? [headers["exclude"]] : headers["exclude"])
                              if (exclude == "*") {
                                notify = false;
                                break;
                              }

                          if (headers[key])
                            display(mbx, headers[key], key, "@include");
                          else
                            display(mbx, "", key, "@include", notify);
                          break;
                        default:
                          if (window.location.pathname.match(/\/scripts\/show\/.+/i) &&
                              typeof headers[key] == "string" && (key == "version" || key == "copyright" || key == "license" || key == "licence"))
                            break;

                          [key, prefix] = key.split(/:/).reverse();

                          if (!prefix && typeof headers[key] != "undefined")
                            display(mbx, headers[key], key, "@" + key);
                          else if (prefix && headers[prefix][key])
                            display(mbx, headers[prefix][key], key, "@" + prefix + ":" + key);
                          break;
                      }
                    }
                  }

                  if (window.location.pathname.match(/scripts\/show\/.*/i) && gmc.get("insertH6")) {
                    let items = gmc.get("insertH6String").split(","), xpe;
                    for (let i = 0, len = items.length; i < len; ++i) {
                      if (i == 0)
                        xpe = "//div[@id='script_sidebar']//h6[contains(., '" + items[i]+ "')]";
                      else
                        xpe += "|//div[@id='script_sidebar']//h6[contains(., '" + items[i]+ "')]";
                    }

                    let hookmbxNode = document.evaluate(
                      xpe,
                      document.body,
                      null,
                      XPathResult.FIRST_ORDERED_NODE_TYPE,
                      null
                    );
                    if (hookmbxNode && hookmbxNode.singleNodeValue) {
                      let thisNode = hookmbxNode.singleNodeValue;

                      mbx.style.setProperty("margin-bottom", "0.75em", "");

                      if (thisNode.parentNode.id == "script_sidebar")
                        sidebarNode.insertBefore(mbx, thisNode);
                      else
                        sidebarNode.insertBefore(mbx, thisNode.parentNode);
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
          "//li[contains(@class, 'current')][contains(., 'Source Code')]",
            document.body,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          if (sourceNode && sourceNode.singleNodeValue) {
            let thisNode = sourceNode.singleNodeValue;

            if (gmc.get("checkTrimSourceCode"))
              thisNode.textContent = thisNode.textContent.replace(" Code", "");

            if (typeof headers != "undefined") {
              thisNode.textContent += " ";
              let spanNode = document.createElement("span");
              spanNode.style.setProperty("color", "red", "");

              let currentVersion = (typeof headers["uso"]["version"] == "string") ? headers["uso"]["version"] : headers["uso"]["version"][headers["uso"]["version"].length -1];
              GM_xmlhttpRequest({
                retry: 5,
                url: protocol + "//userscripts.org/scripts/version/" + scriptid + "/" + currentVersion + ".user.js",
                method: "GET",
                onload: function(xhr) {
                  switch (xhr.status) {
                    case 404:
                    case 500:
                    case 502:
                    case 503:
                      if (this.retry-- > 0)
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
      }
    }


    // Count Issues
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
            GM_setStyle({
                node: nodeStyle,
                data:
                  [
                    ".alert { color: red !important; }"

                  ].join("\n")
            });

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
        issuesNode.style.setProperty("background-image", "url(" + throbber + ")", ""); // TODO: CSS this

        GM_xmlhttpRequest({
          retry: 5,
          method: "GET",
          url: protocol + "//" + (gmc.get("useGreasefireUrl") ? "greasefire." : "") + "userscripts.org/scripts/issues/" + scriptid,  // NOTE: Greasefire not SSLd properly... recheck periodically
          onload: function (xhr) {
            switch (xhr.status) {
              case 404:
              case 500:
              case 502:
              case 503:
                if (this.retry-- > 0)
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

  if (gmc.get("checkShowVersionsSource")) {
    if (location.pathname.match(/\/scripts\/review\//)) {

      GM_setStyle({
          node: nodeStyle,
          data:
            [
              "div.toolbar_menu li, div.toolbar_menu li div { display: inline; margin-right: 0.25em; }"

            ].join("\n")
      });

      let xpr = document.evaluate(
        "//pre[@id='source']",
        document.body,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      if (xpr && xpr.singleNodeValue) {
        let hookNode = xpr.singleNodeValue;

        if (!hookNode.hasChildNodes()) // NOTE: Caching issue on USO so reload until it is present
          window.location.reload();

        // Create standardized div framing
        let toolbarBottomNode = document.createElement("div");
        toolbarBottomNode.classList.add("toolbar_menu");

        let toolbarTopNode = document.createElement("div");
        toolbarTopNode.classList.add("toolbar_menu");

        let rightNode = document.createElement("div");
        rightNode.classList.add("right");

        let leftNode = document.createElement("div");
        leftNode.id = "left";
        GM_setStyle({
            node: nodeStyle,
            data:
              [
                  "#left { float: left; }"

              ].join("\n")
        });

        let topNode = document.createElement("div");

        let subcontentNode = document.createElement("div");

        subcontentNode.appendChild(topNode);
        subcontentNode.appendChild(leftNode);
        subcontentNode.appendChild(rightNode);

        hookNode.parentNode.insertBefore(subcontentNode, hookNode);

        rightNode.appendChild(toolbarTopNode);
        rightNode.appendChild(hookNode);
        rightNode.appendChild(toolbarBottomNode);

        // Check for GIJoes buttons and modify them
        let wrap2;
        document.evaluate(
          "//button[@id='wrap-button2']",
          document.body,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          xpr
        );
        if (xpr && xpr.singleNodeValue) {
          wrap2 = xpr.singleNodeValue;

          GM_setStyle({
              node: nodeStyle,
              data:
                [
                  ".wrap-button { width: 11.5em; }"

                ].join("\n")
          });

          wrap2.removeAttribute("style");
          wrap2.classList.add("wrap-button");

          let wrap2DIV = document.createElement("div");
          let wrap2LI = document.createElement("li");

          wrap2DIV.appendChild(wrap2);
          wrap2LI.appendChild(wrap2DIV);
          wrap2 = wrap2LI;
        }

        let wrap1;
        document.evaluate(
          "//button[@id='wrap-button1']",
          document.body,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          xpr
        );
        if (xpr && xpr.singleNodeValue) {
          wrap1 = xpr.singleNodeValue;

          wrap1.removeAttribute("style");
          wrap1.classList.add("wrap-button");

          let wrap1DIV = document.createElement("div");
          let wrap1LI = document.createElement("li");

          wrap1DIV.appendChild(wrap1);
          wrap1LI.appendChild(wrap1DIV);
          wrap1 = wrap1LI;
        }

        let ctts;
        document.evaluate(
          "//button[.='Change Tabs to Spaces']",
          document.body,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          xpr
        );
        if (xpr && xpr.singleNodeValue) {
          let cttsBUTTON = xpr.singleNodeValue;

          GM_setStyle({
              node: nodeStyle,
              data:
                [
                  ".changetabs-button { width: 13.5em; }",
                  ".changetabs-input { position: relative; top: 0; width: 1.5em; height: 1.3em; padding: 0 !important; margin: 0 0 !important; margin-left: 0.3em !important; }"

                ].join("\n")
          });

          cttsBUTTON.removeAttribute("style");
          cttsBUTTON.classList.add("changetabs-button");


          let cttsINPUT = cttsBUTTON.nextSibling;
          cttsINPUT.removeAttribute("style");
          cttsINPUT.classList.add("changetabs-input");

          let cttsDIV = document.createElement("div");

          let cttsLI = document.createElement("li");

          cttsDIV.appendChild(cttsBUTTON);
          cttsDIV.appendChild(cttsINPUT);
          cttsLI.appendChild(cttsDIV);

          ctts = cttsLI;
        }

        // Create beautify
        let beautifyBUTTON = document.createElement("button");
        beautifyBUTTON.type = "button";
        beautifyBUTTON.textContent = "Beautify";
        beautifyBUTTON.addEventListener("click", function(ev) {
          hookNode.textContent = js_beautify(hookNode.textContent.replace(/[“”]/g, '"'), {indent_size: 1, indent_char: '\t'});

          if (gmc.get("checkShowLineNumbers")) {
            renumber(hookNode);
            GM_setStyle({
                node: nodeStyle,
                data:
                  [
                    ".number { background-color: #fcc; }"

                  ].join("\n")
            });
          }

          // If source is < 20KB then autohighlight just like USO does
          if (hookNode.textContent.length < 20480) {
            let win = window.wrappedJSObject || window;
            win.sh_highlightDocument();
          }

          enableCTTS();
          ev.target.blur();
        }, false);

        let beautifyDIV = document.createElement("div");

        let beautifyLI = document.createElement("li");

        beautifyDIV.appendChild(beautifyBUTTON);
        beautifyLI.appendChild(beautifyDIV);


        // Create deobfuscate
        let deobfuscateBUTTON = document.createElement("button");
        deobfuscateBUTTON.type = "button";
        deobfuscateBUTTON.textContent = "Deobfuscate";
        deobfuscateBUTTON.addEventListener("click", function(ev) {
          switch (gmc.get("deobMethod")) {
            case 'Simple Transcode':
              try {
                [hookNode.textContent] = simpleTranscode(hookNode.textContent, 0);

                if (gmc.get("checkShowLineNumbers")) {
                  renumber(hookNode);
                  GM_setStyle({
                      node: nodeStyle,
                      data:
                        [
                          ".number { background-color: #fcc; }"

                        ].join("\n")
                  });
                }

                // If source is < 20KB then autohighlight just like USO does
                if (hookNode.textContent.length < 20480) {
                  let win = window.wrappedJSObject || window;
                  win.sh_highlightDocument();
                }
              }
              catch(e) {
                GM_log('Too much recursion error encountered. Aborting transcode');
              }
              break;
            case 'JsCode':
              try {
                hookNode.textContent = JsCode.deobfuscate(hookNode.textContent);

                if (gmc.get("checkShowLineNumbers")) {
                  renumber(hookNode);
                  GM_setStyle({
                      node: nodeStyle,
                      data:
                        [
                          ".number { background-color: #fcc; }"

                        ].join("\n")
                  });
                }

                // If source is < 20KB then autohighlight just like USO does
                if (hookNode.textContent.length < 20480) {
                  let win = window.wrappedJSObject || window;
                  win.sh_highlightDocument();
                }
              }
              catch(e) {
                GM_log('Too much recursion error encountered. Aborting JsCode');
              }
              break;
          }
          enableCTTS();
          ev.target.blur();
        }, false);

        let deobfuscateDIV = document.createElement("div");

        let deobfuscateLI = document.createElement("li");

        deobfuscateDIV.appendChild(deobfuscateBUTTON);
        deobfuscateLI.appendChild(deobfuscateDIV);


        // Add buttons
        if (wrap1) toolbarTopNode.appendChild(wrap1);
        if (ctts) toolbarTopNode.appendChild(ctts);
        toolbarTopNode.appendChild(beautifyLI);
        toolbarTopNode.appendChild(deobfuscateLI);

        if (wrap2)
          toolbarBottomNode.appendChild(wrap2);

        // Virtual link versions if present
        document.evaluate(
          "//a[@href='/scripts/versions/" + scriptid + "']",
          document.body,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          xpr
        );
        if (xpr && xpr.singleNodeValue) {
          let thisNode = xpr.singleNodeValue;

          let previousVersions = thisNode.textContent;

          function onclickVersions(ev) {
            ev.preventDefault();

            thisNode.removeEventListener("click", onclickVersions, false);

            GM_setStyle({
                node: nodeStyle,
                data:
                  [
                    ".notice { background-image: url(" + throbber + "); }"

                  ].join("\n")
            });

            getVersions(protocol + "//userscripts.org/scripts/versions/" + scriptid);

            thisNode.parentNode.parentNode.removeChild(thisNode.parentNode);
          }

          function getVersions(url) {

            GM_xmlhttpRequest({
              retry: 5,
              method: "GET",
              url: url,
              onload: function(xhr) {
                switch (xhr.status) {
                  case 404:
                  case 500:
                  case 502:
                  case 503:
                    if (this.retry-- > 0)
                      setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                    break;
                  case 200:
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

                    // doc has been created... start twiddling

                    // Nab pagination
                    let pagination;
                    let xpr = doc.evaluate(
                      "//div[@class='pagination']",
                      doc.body,
                      null,
                      XPathResult.FIRST_ORDERED_NODE_TYPE,
                      null
                    );
                    if (xpr && xpr.singleNodeValue) {
                      let thisNode = xpr.singleNodeValue;

                      pagination = thisNode.cloneNode(true);
                    }

                    // Nab versions
                    let versions;
                    doc.evaluate(
                      "//div[@id='root']/div[@class='container']/div[@id='content']/ul[not(@id)]/li",
                      doc.body,
                      null,
                      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                      xpr
                    );

                    let ulNode = document.createElement("ul");

                    if (xpr)
                      for (let i = 0, thisNode; thisNode = xpr.snapshotItem(i++);) {
                        let dateNode = thisNode.firstChild;
                        let diffNode = thisNode.firstChild.nextSibling;

                        let dateid = dateNode.textContent.replace(/\n\[/, "").trim();

                        if (gmc.get("checkShowVersionsLocale")) {
                          // Adjust if logged out
                          let xpr = doc.evaluate(
                            "//ul[@class='login_status']//a[starts-with(@href, '/login')]",
                            doc.body,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                          );
                          if (xpr && xpr.singleNodeValue) {
                            let utc = new Date(dateid + " UTC");
                            dateid = utc.toLocaleFormat("%b %d, %Y %H:%M %Z");
                          }
                        }

                        let diffid = diffNode.getAttribute("href").match(/\/scripts\/version\/\d+\/(\d+)\.user\.js/)[1]; // TODO: Don't leave it this way

                        let aInstallNode = document.createElement("a");
                        aInstallNode.setAttribute("href", "/scripts/version/" + scriptid + "/" + diffid + ".user.js");
                        aInstallNode.textContent = dateid;

                        let leftText = document.createTextNode("[")

                        let aViewNode = document.createElement("a");
                        aViewNode.setAttribute("href", "/scripts/version/" + scriptid + "/" + diffid + ".user.js#");
                        aViewNode.textContent = "view";
                        aViewNode.title = "\u2229 (intersection) view";
                        aViewNode.addEventListener("click", function(ev) {
                            ev.preventDefault();

                            ev.target.parentNode.classList.add("retrieving");

                            let aNode = ev.target, ulNode, thisNode;
                            GM_xmlhttpRequest({
                              retry: 5,
                              method: "GET",
                              url: aNode.protocol + "//" + aNode.hostname + aNode.pathname,
                              onload: function(xhr) {
                                switch (xhr.status) {
                                  case 404:
                                  case 500:
                                  case 502:
                                  case 503:
                                    if (this.retry-- > 0)
                                      setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                                    else {
                                      // Clear retrieving Selection markers
                                      ulNode = aNode.parentNode.parentNode;

                                      thisNode = ulNode.firstChild;
                                      while(thisNode) {
                                        thisNode.classList.remove("retrieving");
                                        thisNode = thisNode.nextSibling;
                                      }
                                    }
                                    break;
                                  case 200:
                                    let responseText = xhr.responseText;

                                    if (responseText.match(/[\r\n]$/))
                                      responseText = responseText.replace(/[\r\n]*$/, "");

                                    let preNode = document.getElementById("source");
                                    preNode.textContent = responseText;

                                    // Clear all Selection markers
                                    ulNode = aNode.parentNode.parentNode;

                                    thisNode = ulNode.firstChild;
                                    while(thisNode) {
                                      thisNode.classList.remove("current");
                                      thisNode.classList.remove("retrieving");
                                      thisNode = thisNode.nextSibling;
                                    }

                                    // Set current selection marker
                                    let liNode = aNode.parentNode;
                                    liNode.classList.add("current");

                                    // Remove GIJoes disabling
                                    enableCTTS();

                                    // If source is < 20KB then autohighlight just like USO does
                                    if (xhr.responseText.length < 20480) {
                                      let win = window.wrappedJSObject || window;
                                      win.sh_highlightDocument();
                                    }

                                    if (gmc.get("checkShowLineNumbers"))
                                      renumber(preNode);

                                    break;
                                }
                              }
                            });
                          }, false);

                        let middleText = document.createTextNode("|")

                        let aDiffNode = document.createElement("a");
                        aDiffNode.setAttribute("href", "/scripts/diff/" + scriptid + "/" + diffid);
                        aDiffNode.textContent = "changes";
                        aDiffNode.title = "\u2206 (symmetric difference) changes";
                        aDiffNode.addEventListener("click", function(ev) {
                          ev.preventDefault();

                          ev.target.parentNode.classList.add("retrieving");

                          let aNode = ev.target, ulNode, thisNode;
                          GM_xmlhttpRequest({
                            retry: 5,
                            method: "GET",
                            url: aNode.protocol + "//" + aNode.hostname + aNode.pathname,
                            onload: function(xhr) {
                              switch (xhr.status) {
                                case 404:
                                case 500:
                                case 502:
                                case 503:
                                  if (this.retry-- > 0)
                                    setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                                  else {
                                    // Clear retrieving Selection markers
                                    ulNode = aNode.parentNode.parentNode;

                                    thisNode = ulNode.firstChild;
                                    while(thisNode) {
                                      thisNode.classList.remove("retrieving");
                                      thisNode = thisNode.nextSibling;
                                    }
                                  }
                                  break;
                                case 200:

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


                                  let xpr = doc.evaluate(
                                    "//pre",
                                    doc.body,
                                    null,
                                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                                    null
                                  );
                                  if (xpr && xpr.singleNodeValue) {
                                    let preNode = document.getElementById("source");
                                    preNode.innerHTML = xpr.singleNodeValue.innerHTML;


                                    // Clear all Selection markers
                                    ulNode = aNode.parentNode.parentNode;

                                    thisNode = ulNode.firstChild;
                                    while(thisNode) {
                                      thisNode.classList.remove("current");
                                      thisNode.classList.remove("retrieving");
                                      thisNode = thisNode.nextSibling;
                                    }

                                    // Set current selection marker
                                    let liNode = aNode.parentNode;
                                    liNode.classList.add("current");

                                    // Remove GIJoes disabling
                                    enableCTTS();

                                    // Remove numbering for now if present
                                    let number = document.getElementById("number");
                                    if (number) {
                                      GM_setStyle({
                                          node: nodeStyle,
                                          data:
                                            [
                                              "#source { margin-left: 0 }"

                                            ].join("\n")
                                      });
                                      number.parentNode.removeChild(number);
                                    }
                                  }
                                  break;
                              }
                            }
                          });
                        }, false);

                        let rightText = document.createTextNode("]")

                        let liNode = document.createElement("li");

                        liNode.appendChild(leftText);
                        liNode.appendChild(aViewNode);
                        liNode.appendChild(middleText);
                        liNode.appendChild(aDiffNode);
                        liNode.appendChild(rightText);
                        liNode.appendChild(aInstallNode);

                        ulNode.appendChild(liNode);
                      }


                    let versionsContainerNode;
                    document.evaluate(
                      "//div[@id='section']/div[@class='container']",
                      document.body,
                      null,
                      XPathResult.FIRST_ORDERED_NODE_TYPE,
                      xpr
                    );
                    if (xpr && xpr.singleNodeValue) {
                      versionsContainerNode = xpr.singleNodeValue;
                    }


                    let versionsDIV = document.getElementById("versions");

                    if (versionsDIV) {
                      while (versionsDIV.hasChildNodes())
                        versionsDIV.removeChild(versionsDIV.firstChild);
                    }
                    else {
                      versionsDIV = document.createElement("div");
                      versionsDIV.id = "versions";

                      GM_setStyle({
                          node: nodeStyle,
                          data:
                            [
                              "#fans_content { border-bottom-style: dotted !important; margin-bottom: 0 !important; }",

                              "#versions { background-color: #fff; border-bottom: 1px dotted #ccc; font-size: 13px; margin-bottom: 0.9em; padding: 10px; }",
                              "#versions p  { margin: 0; }",
                              "#versions p > a { color: #000; font-weight: bold; margin-right: 0.25em; text-decoration: none; }",
                              "#versions p > span { color: #666; font-size: 0.8em; }",
                              "#versions ul { -moz-column-width: 19em; column-width: 19em; list-style: none; }",
                              "#versions ul a { margin-left: 0.25em; margin-right: 0.25em; }",
                              "#versions ul a:last-child { color: #000; text-decoration: none; margin-left: 0.5em; }",
                              "#versions ul li.current { background-color: #ddd; }",
                              "#versions ul li.retrieving { background-image: url(" + throbber + "); }"

                            ].join("\n")
                      });
                    }

                    versionsContainerNode.appendChild(versionsDIV);

                    // Replace pagination NOTE: Scope referenced variable nodes
                    if (pagination) {
                      GM_setStyle({
                          node: nodeStyle,
                          data:
                            [
                              ".pagination a.retrieving { background-image: url(" + throbber + "); }"

                            ].join("\n")
                      });

                      while (versionsDIV.hasChildNodes())
                        versionsDIV.removeChild(versionsDIV.firstChild);

                      versionsDIV.appendChild(pagination);

                      document.evaluate(
                        "//div[@class='pagination']/a",
                        document.body,
                        null,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                        xpr
                      );
                      if (xpr)
                        for (let i = 0, thisNode; thisNode = xpr.snapshotItem(i++);) {
                          thisNode.addEventListener("click", function(ev) {
                            ev.preventDefault();

                            ev.target.classList.add("retrieving");
                            getVersions(protocol + "//" + (gmc && gmc.get("useGreasefireUrl") ? "greasefire." : "") + "userscripts.org" + ev.target.pathname + ev.target.search); // NOTE: Greasfire URI not currently SSLd properly
                          }, false);
                        }
                    }

                    let spanNode = document.createElement("span");
                    spanNode.textContent = parseInt(previousVersions.match(/(\d+)\s/)[1]) + 1;

                    let aNode = document.createElement("a");
                    aNode.href = "/scripts/versions/" + scriptid;
                    aNode.textContent = "Source versions and diffs:";

                    let pNode = document.createElement("p");

                    pNode.appendChild(aNode);
                    pNode.appendChild(spanNode);

                    if (pagination)
                      versionsDIV.insertBefore(pNode, pagination);
                    else
                      versionsDIV.appendChild(pNode);

                    versionsDIV.appendChild(ulNode);

                      GM_setStyle({
                          node: nodeStyle,
                          data:
                            [
                              ".notice { background-image: none; }",
                              ".pagination a.retrieving { background-image: url(" + throbber + "); }"

                            ].join("\n")
                      });

                    // Compute left margin of pre and add width
                    document.evaluate(
                      "//div[@id='left']",
                      document.body,
                      null,
                      XPathResult.FIRST_ORDERED_NODE_TYPE,
                      xpr
                    );
                    if (xpr && xpr.singleNodeValue) {
                      let hookNode = xpr.singleNodeValue;

                      let marginLeft = window.getComputedStyle(hookNode, null).getPropertyValue("width").replace(/px$/, "");

                      GM_setStyle({
                          node: nodeStyle,
                          data:
                            [
                              ".right { margin-left: " + marginLeft + "px; }",
                              "#left { padding: 1px; }"  // NOTE: Strange first run fix for CSS

                            ].join("\n")
                      });
                    }
                }
              }
            });

          }
          thisNode.addEventListener("click", onclickVersions, false);
        }

      }
    }
  }

  function renumber(hookNode) {
    let newlines = hookNode.textContent.match(/\n/g);
    if (newlines)
      newlines = newlines.length;
    else
      newlines = 0;

    let digits = (parseInt(newlines) + 1).toString().length;

    let css = ".number { ";
    let properties = window.getComputedStyle(hookNode, null);
    for each (let property in properties)
      css += (property + ":" + properties.getPropertyValue(property) + "; ");
    css += " }"
    GM_setStyle({
        node: nodeStyle,
        data: css
    });

    GM_setStyle({
        node: nodeStyle,
        data:
          [
            "pre#source { white-space: pre !important; overflow: scroll; width: auto; }",

            ".number { height: auto; overflow: hidden !important; display: inline; padding-right: 2px; padding-left: 2px; text-align: right; float: left; margin-top: 0 !important; margin: 0 0 !important; border-right-style: none !important; background-color: #eee; }",
            ".number a { text-decoration: none; color: #888; font-size: 0.8em; padding-right: 2px; }",
            ".number a.sharpen { font-size: 1em; color: #000; }"

          ].join("\n")
    });

    let textWidth = parseInt(window.getComputedStyle(hookNode, null).getPropertyValue("font-size").replace(/px/, "") / 1.5); // NOTE: Fuzzy
    GM_setStyle({
        node: nodeStyle,
        data:
          [
            ".number { width: " + (textWidth * digits) + "px; }"

          ].join("\n")
    });

    let preNode = document.getElementById("number") || document.createElement("pre");

    if (preNode.hasChildNodes()) {
      while (preNode.hasChildNodes())
        preNode.removeChild(preNode.firstChild);
    }
    else {
      preNode.setAttribute("id", "number");
      preNode.classList.add("number");
    }

    let line = 1;
    do {
      let aNode = document.createElement("a");
      aNode.setAttribute("id", "line-" + line);
      aNode.setAttribute("href", "#line-" + line);
      aNode.textContent = line;
      if (line % 10 == 0 || line == 1)
        aNode.classList.add("sharpen");

      let divNode = document.createElement("div");

      divNode.appendChild(aNode);
      preNode.appendChild(divNode);
    } while (line++ <= newlines);

    hookNode.parentNode.insertBefore(preNode, hookNode);
    GM_setStyle({
        node: nodeStyle,
        data:
          [
            "#source { margin-left: " + preNode.offsetWidth + "px; }"

          ].join("\n")
    });
  }

  if (gmc.get("checkShowLineNumbers")) {
    if (location.pathname.match(/\/scripts\/review\//)) {
      let xpr = document.evaluate(
        "//pre[@id='source']",
        document.body,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      if (xpr && xpr.singleNodeValue) {
        let hookNode = xpr.singleNodeValue;

        if (!hookNode.hasChildNodes()) // NOTE: Caching issue on USO so reload until it is present
          window.location.reload();

        let preNode = document.createElement("pre");
        preNode.setAttribute("id", "number");
        preNode.classList.add("number");
        GM_setStyle({
            node: nodeStyle,
            data:
              [
                ".number { display: none; }"

              ].join("\n")
        });

        let divNode = document.createElement("div");

        divNode.appendChild(preNode);

        hookNode.parentNode.insertBefore(divNode, hookNode);
        divNode.appendChild(hookNode);

        function loadNumber() {
          window.removeEventListener("load", loadNumber, false);
          renumber(hookNode);

          let hash = window.location.hash.match(/^#(line-\d+)/);
          if (hash) {
            let anchorNode = document.evaluate(
              "//a[@id='" + hash[1] + "']",
              document.body,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            );
            if (anchorNode && anchorNode.singleNodeValue)
              anchorNode.singleNodeValue.scrollIntoView();
          }
        }
        window.addEventListener("load", loadNumber, false);
      }
    }
  }

})();
