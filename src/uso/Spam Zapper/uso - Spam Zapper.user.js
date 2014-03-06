(function () {
  "use strict";

// ==UserScript==
// @name            uso - Spam Zapper
// @namespace       http://userscripts.org/users/37004
// @description     Background requests for spam buttons and native USO alteration to the post when marked as spam.
// @copyright       2013+, Marti Martz (http://userscripts.org/users/37004)
// @contributor     Jesse Andrews (http://userscripts.org/users/2)
// @contributor     Ryan Chatham (http://userscripts.org/users/220970)
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license         Creative Commons; http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version         1.1.3
// @icon            https://s3.amazonaws.com/uso_ss/icon/398715/large.png

// @include  http://userscripts.org/posts*
// @include  http://userscripts.org/topics*
// @include  http://userscripts.org/groups/*/topics*
// @include  http://userscripts.org/scripts/discuss/*
// @include  http://userscripts.org/forums/*
// @include  http://userscripts.org/users/*/posts*
// @include  http://userscripts.org/scripts/show/398715

// @include  https://userscripts.org/posts*
// @include  https://userscripts.org/topics*
// @include  https://userscripts.org/groups/*/topics*
// @include  https://userscripts.org/scripts/discuss/*
// @include  https://userscripts.org/forums/*
// @include  https://userscripts.org/users/*/posts*
// @include  https://userscripts.org/scripts/show/398715

// @updateURL   https://userscripts.org/scripts/source/398715.meta.js
// @installURL  https://userscripts.org/scripts/source/398715.user.js
// @downloadURL https://userscripts.org/scripts/source/398715.user.js

// @resource icon  https://s3.amazonaws.com/uso_ss/icon/398715/large.png
// @resource gmc   https://s3.amazonaws.com/uso_ss/24274/large.png

// @require https://raw.github.com/sizzlemctwizzle/GM_config/de36fb6f8ddcd727389f2d8841c31749686d9e61/gm_config.js

// @grant  GM_addStyle
// @grant  GM_getResourceURL
// @grant  GM_getValue
// @grant  GM_log
// @grant  GM_setClipboard
// @grant  GM_setValue
// @grant  GM_xmlhttpRequest

// ==/UserScript==

  /**
   *
   */
  var
      gDEBUG,
      gRETRIES = 3,
      gLOGGEDIN = document.querySelector("body.loggedin"),
      gPROTOCOL = location.protocol,
      gPATHNAME = location.pathname,
      gSEARCH = location.search,
      gSPAMQSP = (getQsp(gSEARCH, "spam") == 1),
      gUSERPOSTS = /^\/users\/\d+\/posts/.test(gPATHNAME),
      gISHOMEPAGE = /^\/scripts\/show\//.test(gPATHNAME),
      gISFRAMELESS = false
  ;

  try {
    gISFRAMELESS = (window == window.top);
  }
  catch (e) {}

  /**
   *
   */
  function getQsp(aQs, aName) {
    aQs = aQs.replace(/^\?/, "");

    var qsps = aQs.split("&");
    for (var i = 0, qsp; qsp = qsps[i++];) {
      var qspnv = qsp.split("=");
      var name = qspnv[0];
      var value = qspnv[1];

      if (name == aName)
        return value;
    }

    return null;
  }

  /**
   *
   */
  function replaceQsp(aQs, aName, aValue) {
    aQs = aQs.replace(/^\?/, "");

    var newQs = [];

    var found;

    var qsps = aQs.split("&");
    for (var i = 0, qsp; qsp = qsps[i++];) {
      var qspnv = qsp.split("=");
      var name = qspnv[0];
      var value = qspnv[1];

      if (name == aName) {
        value = aValue;
        found = true;
      }

      newQs.push(name + "=" + value);
    }

    if (!found)
      newQs.push(aName + "=" + aValue);

    if (newQs.length > 0)
      return ("?" + newQs.join("&"));
  }

  /**
   *
   */
  function autoPage() {
    var currPage = getQsp(gSEARCH, "page");
    if (!currPage) {
      currPage = "1";
      direction = "next";
    }


    var currPagex = parseInt(currPage);

    if (direction == "prev") {
      if (currPage != 1) {
        var prevpageNode = paginationNode.querySelector('.prev_page');
        if (prevpageNode && !prevpageNode.classList.contains('disabled'))
          location.replace(replaceQsp(gSEARCH, "page", currPagex - 1));
      }
    }
    else { // NOTE: Assume ascending as default
      var nextpageNode = paginationNode.querySelector('.next_page');
      if (nextpageNode && !nextpageNode.classList.contains('disabled'))
        location.replace(replaceQsp(gSEARCH, "page", currPagex + 1));
    }
  }

  /**
   *
   */
  function hidePost(aNode) {
    aNode.classList.add("hide");
    if (aNode.nextSibling && aNode.nextSibling.nextSibling)
      aNode.nextSibling.nextSibling.classList.add("hide");
  }

  /**
   *
   */
  function submitSpam(aRetries, aNode) {
    var data;

    var formNode = aNode.querySelector('form[method="post"][action="/spam"]');
    if (formNode) {
      var authenticity_tokenNode = formNode.querySelector('input[name="authenticity_token"]'),
          target_idNode = formNode.querySelector('input#target_id'),
          target_typeNode = formNode.querySelector('input#target_type')
      ;

      if (authenticity_tokenNode && target_idNode && target_typeNode) {
        var authenticity_token = authenticity_tokenNode.getAttribute("value"),
            target_id = target_idNode.getAttribute("value"),
            target_type = target_typeNode.getAttribute("value")
        ;

        data = (
              "authenticity_token=" + encodeURIComponent(authenticity_token)
            + "&target_id=" + target_id
            + "&target_type=" + target_type
            + "&spam=true&commit=SPAM"
        );
      }
    }

    if (gDEBUG)
      console.log('SPAM: ' + data);

    var req = new XMLHttpRequest();
    req.open('POST', "/spam");
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", data.length);
    req.onreadystatechange = function () {
      if (this.readyState == this.DONE) {
        switch (this.status) {
          case 502:
            if (aRetries-- > 0)
              setTimeout(submitSpam, 500, aRetries, aNode);
            break;
          case 200:
            if (gSPAMQSP && !aNode.classList.contains("spam")) {
              var countNode = aNode.querySelector(".body p.topic em");
              var matches = countNode.textContent.match(/(\d+)/);
              if (matches) {
                var count = parseInt(matches[1]);
                countNode.textContent = "(" + ++count + ")";
              }
            }
            aNode.classList.add("spam");
            aNode.classList.remove("bad-ham");
            postids[target_id] = new Date().getTime();
            GM_setValue("postids", JSON.stringify(postids, null, ""));

            break;
          default:
            console.log('ERROR: Untrapped status code: ' + this.status);
            break;
        }
      }
    }
    req.send(data);
  }

  /**
   *
   */
  function submitSpams(aRetries) {
    idle = false;

    var
        node = queue[0],
        data
    ;

    var formNode = node.querySelector('form[method="post"][action="/spam"]');
    if (formNode) {
      var authenticity_tokenNode = formNode.querySelector('input[name="authenticity_token"]'),
          target_idNode = formNode.querySelector('input#target_id'),
          target_typeNode = formNode.querySelector('input#target_type')
      ;

      if (authenticity_tokenNode && target_idNode && target_typeNode) {
        var authenticity_token = authenticity_tokenNode.getAttribute("value"),
            target_id = target_idNode.getAttribute("value"),
            target_type = target_typeNode.getAttribute("value")
        ;

        data = (
              "authenticity_token=" + encodeURIComponent(authenticity_token)
            + "&target_id=" + target_id
            + "&target_type=" + target_type
            + "&spam=true&commit=SPAM"
        );
      }
    }

    if (gDEBUG)
      console.log('SPAMS: ' + data);

    var req = new XMLHttpRequest();
    req.open('POST', "/spam");
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", data.length);
    req.onreadystatechange = function () {
      if (this.readyState == this.DONE) {
        switch (this.status) {
          case 502:
            if (aRetries-- > 0)
              setTimeout(submitSpams, 500, aRetries);
            break;
          case 200:
            if (gSPAMQSP && !node.classList.contains("spam")) {
              var countNode = node.querySelector(".body p.topic em");
              var matches = countNode.textContent.match(/^\((\d+)\)$/);
              if (matches) {
                var count = parseInt(matches[1]);
                countNode.textContent = "(" + ++count + ")";
              }
            }
            node.classList.add("spam");
            node.classList.remove("bad-ham");
            postids[target_id] = new Date().getTime();
            GM_setValue("postids", JSON.stringify(postids, null, ""));

            queue.shift();

            var spamsNodes = document.querySelectorAll(".spams");
            for (var i = 0, spamsNode; spamsNode = spamsNodes[i++];)
              spamsNode.textContent = queue.length + ' Spams Queued';

            if (queue.length > 0)
              submitSpams(gRETRIES);
            else {
              idle = true;

              var tbodyNode = node.parentNode,
                  postedNodes =  document.querySelectorAll("tr.post"),
                  spammedNodes = document.querySelectorAll("tr.spam")
              ;

              if (!gSPAMQSP && postedNodes.length > 0 && postedNodes.length == spammedNodes.length && gmcHome.get('autoPageSpams'))
                autoPage();
            }

            break;
          default:
            console.log('ERROR: Untrapped status code: ' + this.status);
            break;
        }
      }
    }
    req.send(data);
  }

  /**
   *
   */
  function submitHam(aRetries, aNode) {
    var data;

    var formNode = aNode.querySelector('form[method="post"][action="/spam"]');
    if (formNode) {
      var authenticity_tokenNode = formNode.querySelector('input[name="authenticity_token"]'),
          target_idNode = formNode.querySelector('input#target_id'),
          target_typeNode = formNode.querySelector('input#target_type')
      ;

      if (authenticity_tokenNode && target_idNode && target_typeNode) {
        var authenticity_token = authenticity_tokenNode.getAttribute("value"),
            target_id = target_idNode.getAttribute("value"),
            target_type = target_typeNode.getAttribute("value")
        ;

        data = (
              "authenticity_token=" + encodeURIComponent(authenticity_token)
            + "&target_id=" + target_id
            + "&target_type=" + target_type
            + "&spam=false&commit=NOT+SPAM"
        );
      }
    }

    if (gDEBUG)
      console.log('HAM: ' + data);

    var req = new XMLHttpRequest();
    req.open('POST', "/spam");
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", data.length);
    req.onreadystatechange = function () {
      if (this.readyState == this.DONE) {
        switch (this.status) {
          case 502:
            if (aRetries-- > 0)
              setTimeout(submitHam, 500, aRetries, aNode);
            break;
          case 200:
            if (gSPAMQSP && aNode.classList.contains("spam")) {
              var countNode = aNode.querySelector(".body p.topic em");
              var matches = countNode.textContent.match(/^\((\d+)\)$/);
              if (matches) {
                var count = parseInt(matches[1]);
                countNode.textContent = "(" + --count + ")";
              }
            }
            aNode.classList.remove("spam");
            aNode.classList.remove("bad-ham");

            var spampollNode = aNode.querySelector(".spam_poll");
            if (spampollNode)
              spampollNode.classList.add("hide");

            delete postids[target_id];
            GM_setValue("postids", JSON.stringify(postids, null, ""));

            break;
          default:
            console.log('ERROR: Untrapped status code: ' + this.status);
            break;
        }
      }
    }
    req.send(data);
  }

  /**
   *
   */
  function spamClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var thisNode = ev.target;

    var trNode;
    if (thisNode.parentNode.parentNode.classList.contains("spam_poll"))
      trNode = thisNode.parentNode.parentNode.parentNode.parentNode;
    else
      trNode = thisNode.parentNode.parentNode.parentNode;

    trNode.classList.add("bad-ham");
    if (gUSERPOSTS)
      trNode.classList.add("clip");

    if (!gSPAMQSP && !gUSERPOSTS && gmcHome.get('hideTaggedSpams'))
      hidePost(trNode);

    submitSpam(gRETRIES, trNode);
  }

  /**
   *
   */
  function spamsClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var thisNode = ev.target;

    var trNode = thisNode.parentNode.parentNode;
    var authoridNode = trNode.querySelector('.author a[user_id]') || trNode.querySelector('.author a[href^="/users/"]') || document.querySelector('#root #section h2 a[href^="/users/"]');

    if (confirm('Are you absolutely sure you want to permanently mark user\n\n\t' + authoridNode.textContent + '\n\nas a spammer?\n\u00A0')) {
      var authorid = authoridNode.getAttribute("user_id") || authoridNode.getAttribute("href").match(/(\d+)$/)[1];

      authorids[authorid] = new Date().getTime();
      GM_setValue("authorids", JSON.stringify(authorids, null, ""));

      var postNodes = document.querySelectorAll('.post');
      for (var i = 0, postNode; postNode = postNodes[i]; ++i) {
        var authorNode = postNode.querySelector('.author a[user_id]') || postNode.querySelector('.author a[href^="/users/"]') || document.querySelector('#root #section h2 a[href^="/users/"]');
        if (authorNode) {
          var id = authorNode.getAttribute("user_id") || authorNode.getAttribute("href").match(/(\d+)$/)[1];
          if (id == authorid) {
            postNode.classList.add("bad-ham");
            if (gUSERPOSTS)
              postNode.classList.add("clip");

            if (!gSPAMQSP && !gUSERPOSTS && gmcHome.get('hideTaggedSpams'))
              hidePost(postNode);

            queue.push(postNode);
          }
        }
      }

      var queued = queue.length;
      if (queued > 0) {
        var spamsNodes = document.querySelectorAll(".spams");
        for (var i = 0, spamsNode; spamsNode = spamsNodes[i++];)
          spamsNode.textContent = queue.length + ' Spams Queued';

        if (idle)
          submitSpams(gRETRIES);
      }
    }
  }

  /**
   *
   */
  function hamClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var thisNode = ev.target;

    var trNode;
    if (thisNode.parentNode.parentNode.classList.contains("spam_poll"))
      trNode = thisNode.parentNode.parentNode.parentNode.parentNode;
    else
      trNode = thisNode.parentNode.parentNode;

    submitHam(gRETRIES, trNode);
  }

  function insertHook() {
    var hookNode = document.getElementById("full_description");

    if (hookNode && !hookNode.firstChild)
      return hookNode.appendChild(document.createElement("div"));
    else if (hookNode)
      return (hookNode.insertBefore(document.createElement("div"), hookNode.firstChild));
    else {
      hookNode = document.getElementById("content");

      if (hookNode) {
        var nodeDiv = document.createElement("div");

        var full_descriptionNodeDiv = document.createElement("div");
        full_descriptionNodeDiv.id = "full_description";

        full_descriptionNodeDiv.appendChild(nodeDiv);

        return hookNode.appendChild(full_descriptionNodeDiv);
      }
      else {
        if (gmcHome.get("enableDebugging"))
          console.log("ERROR: USO DOM change detected... appending GMC remote to EoD");
        return document.body.appendChild(document.createElement("div"));
      }
    }
  }

  /**
   * Init
   */

  /** **/
  if (typeof GM_configStruct == "undefined") {
    if (gDEBUG)
      console.error('Fatal error. GM_config not found');
    return;
  }

  GM_config = null;

  var gWriteSpammers = false,
      gWriteSpams = false
  ;

  var gmcHome = new GM_configStruct();
  gmcHome.init({
    id: "gmc398715home",
    frame: (gISHOMEPAGE ? insertHook() : ""),
    title:
      [
        '<img alt="Spam Zapper" title="uso &ndash; Spam Zapper" src="' + GM_getResourceURL("icon") + '" />',
        '<p>Preferences</p>',
        '<span>',
          '<a href="' + gPROTOCOL + '//github.com/sizzlemctwizzle/GM_config/wiki/">',
              '<img alt="GM_config" title="Powered in part by GM_config" src="' + GM_getResourceURL("gmc") + '" />',
          '</a>',
        '</span>'

      ].join(""),
    css:
        [
          "@media screen, projection {",
                "#gmc398715home { position: static !important; z-index: 0 !important; width: auto !important; height: auto !important; max-height: none !important; max-width: none !important; margin: 0 0 0.5em 0 !important; border: 1px solid #ddd !important; clear: right !important; }",

                "#gmc398715home_header a { display: inline; }",
                "#gmc398715home_header img { max-height: 32px; margin-right: 0.125em; vertical-align: middle; }",
                "#gmc398715home_header > p { display: inline; margin: 0; vertical-align: middle; }",
                "#gmc398715home_header span { float: right; }",
                "#gmc398715home_header span > a { display: inline; margin-left: 0.25em; }",
                "#gmc398715home_wrapper { background-color: #eee; padding-bottom: 0.25em; }",
                "#gmc398715home .config_header { background-color: #333; color: #fff; font-size: 1.57em; margin: 0; padding: 0 0.5em; text-align: left; }",
                "#gmc398715home .config_var { clear: both; margin: 0.33em; padding: 0; }",
                "#gmc398715home .field_label { color: #333; font-size: 100%; font-weight: normal; margin: 0 0.25em; position: relative; top: -0.2em; }",
                "#gmc398715home .section_header_holder { margin: 0.25em 0.5em !important; }",
                "#gmc398715home .section_desc { margin: 0.25em 1.5em !important; }",

                    ".gmc-yellownote { background-color: #ffd; font-size: 0.66em !important; }",
                    ".gmc398715home-invisilink { text-decoration: none; color: #000; }",
                    ".gmc398715home-invisilink:hover { color: #000; }",

                    "#gmc398715home_copySpammers_var,",
                    "#gmc398715home_mergeSpammers_var",
                    "{ display: inline; }",

                "#gmc398715home .reset, #gmc398715home .reset a, #gmc398715home_buttons_holder { text-align: inherit; }",
                "#gmc398715home_buttons_holder { margin: 2em 0.5em 0.5em; }",
                "#gmc398715home_saveBtn { margin: 0.5em !important; padding: 0 3.0em !important; }",
                "#gmc398715home_resetLink { margin-right: 1.5em; }",
                "#gmc398715home_closeBtn { display: none; }",
          "}",

          "@media print {",
              "#gmc398715home { display: none !important; }",
          "}"

        ].join("\n")
    ,
    fields: {
      'hideTaggedSpams': {
        "section": ["Manage Spams List", "This section handles posts"],
        "type": "checkbox",
        "label": 'Hide tagged in mixed User areas',
        "default": false
      },
      'autoPageSpams': {
        "type": "checkbox",
        "label": 'Automatically page if current page is all spammers in select areas',
        "default": false
      },
      'clearSpams': {
        "type": "button",
        "label": 'Clear',
        "click": function () {
          postids = {};
          gWriteSpams = true;
        }
      },
      'copySpams': {
        "type": "button",
        "label": 'Copy to Clipboard',
        "click": function () {
          var ids = { spams: [] },
              spams = ids["spams"];

          for (var postid in postids)
            spams.push(postid);

          if (spams.length > 0) {
            spams.sort(function (a, b) { return a - b });
            GM_setClipboard(JSON.stringify(ids, null, " "), "text");
          }
        }
      },
      'hideTaggedSpammers': {
        "section": ["Manage Spammers List", "This section handles authors"],
        "type": "checkbox",
        "label": 'Hide tagged in mixed User areas',
        "default": false
      },
      'autoPageSpammers': {
        "type": "checkbox",
        "label": 'Automatically page if current page is all spammers in select areas',
        "default": false
      },
      'clearSpammers': {
        "type": "button",
        "label": 'Clear',
        "click": function () {
          authorids = {};
          gWriteSpammers = true;
        }
      },
      'copySpammers': {
        "type": "button",
        "label": 'Copy to Clipboard',
        "click": function () {
          var ids = { spammers: [] },
              spammers = ids["spammers"];

          for (var authorid in authorids)
            spammers.push(authorid);

          if (spammers.length > 0) {
            spammers.sort(function (a, b) { return a - b });
            GM_setClipboard(JSON.stringify(ids, null, " "), "text");
          }
        }
      },
      'mergeSpammers': {
        "type": "button",
        "label": 'Merge Upstream List',
        "click": function () {
          if (confirm(
            [
              'NETWORK OF TRUST CONFIRMATION',
              '',
              'Do you wish to proceed merging the upstream spammers list into your own?',
              '',
              '\u00A0'

            ].join('\n')
          ))
            GM_xmlhttpRequest({
              method: "GET",
              url: "http://beta.usocheckup.dune.net/spammers.json",
              onload: function(aR) {
                var write = false,
                    ids = JSON.parse(aR.responseText),
                    spammers = ids["spammers"]
                ;

                for (var i = 0, spammer; spammer = spammers[i++];)
                  if (!authorids[spammer]) {
                    authorids[spammer] = new Date().getTime();
                    write = true;
                  }

                if (write)
                  gWriteSpammers = true;
              }
            });
        }
      }
    },
    events: {
      open: function () {
        if (typeof GM_setClipboard == "undefined") {
          gmcHome.fields["copySpams"].node.setAttribute("disabled", "disabled");
          gmcHome.fields["copySpammers"].node.setAttribute("disabled", "disabled");
        }
      },
      save: function () {
        if (gWriteSpammers) {
          GM_setValue("authorids", JSON.stringify(authorids, null, ""));
          gWriteSpammers = false;
        }

        if (gWriteSpams) {
          GM_setValue("postids", JSON.stringify(postids, null, ""));
          gWriteSpams = false;
        }
      },
      reset: function () {
        authorids = {};
        gWriteSpammers = true;

        postids = {};
        gWriteSpams = true;
      }
    }
  });

  /** **/
  var
      postids = JSON.parse(GM_getValue("postids", "{}")),
      authorids = JSON.parse(GM_getValue("authorids", "{}")),
      lastpage = JSON.parse(GM_getValue("lastpage", "{}")),
      queue = [],
      idle = true
  ;

  if (gISFRAMELESS && /\/scripts\/show\/398715\/?$/.test(gPATHNAME)) {
    gmcHome.open();
  }

  /**
   *
   */
  GM_addStyle(
      [
        '.post form[action="/spam"] { clear: left; padding-top: 0.25em; }',
        '.actions { float: right; font-size: 0.9em; margin-left: 1em; }',
        '.action { color: #444; margin-left: 0.5em; text-decoration: none; }',
        '.action:hover { color: #444; text-decoration: underline !important; }',

        '.clip .body { display: block; max-height: 12em; overflow: auto !important; }',

        '#footer-content .footer_status { margin-bottom: 1.5em; }'

      ].join('\n')
  );

  if (!gLOGGEDIN) {
    var spampollNodes = document.querySelectorAll(".spam_poll");
    for (var i = 0, spampollNode; spampollNode = spampollNodes[i++];) {
      spampollNode.textContent = spampollNode.textContent.replace(/\s+Do\s+you\s+or\s+$/, "");
    }
  }

  if (gSPAMQSP) {
    GM_addStyle(
        [
          '.post .body { display: block; max-height: 12em; overflow: auto; }'

        ].join('\n')
    );
  }

  if (gLOGGEDIN) {
    var login_statusNode = document.querySelector("#root #top .login_status");
    if (login_statusNode) {
      var topNodeA = document.createElement("a");
      topNodeA.classList.add("spams");
      topNodeA.href = "/scripts/show/398715";
      topNodeA.textContent = "0 Spams Queued";

      var nodeLi = document.createElement("li");
      nodeLi.appendChild(topNodeA);

      login_statusNode.insertBefore(nodeLi, login_statusNode.firstChild);
    }

    var footer_contentNode = document.querySelector("#footer #footer-content");
    if (footer_contentNode) {
      var thisNode = footer_contentNode.firstChild.nextSibling;
      if (thisNode) {
        var bottomNodeA = document.createElement("a");
        bottomNodeA.classList.add("spams");
        bottomNodeA.href = "/scripts/show/398715";
        bottomNodeA.textContent = "0 Spams Queued";

        var footer_statusNode = document.createElement("div");
        footer_statusNode.classList.add("footer_status");

        footer_statusNode.appendChild(bottomNodeA);

        thisNode.insertBefore(footer_statusNode, thisNode.firstChild);
      }
    }
  }

  var direction;

  var paginationNode = document.querySelector('.pagination');
  if (paginationNode) {
    var oldpage = (lastpage[gPATHNAME] ? parseInt(lastpage[gPATHNAME]) : 1);

    var newpage = getQsp(gSEARCH, "page");
    lastpage[gPATHNAME] = (newpage ? newpage : "1");

    newpage = parseInt(lastpage[gPATHNAME]);

    if (newpage < oldpage)
      direction = "prev";
    else // NOTE: Assume ascending as default
      direction = "next";

    GM_setValue("lastpage", JSON.stringify(lastpage, null, ""));
  }

    var countSpammersTopics = 0;
    var topicNodes = document.querySelectorAll('#topics-index #content table tr, #content table.topics tr');

    for (var i = 0, topicNode; topicNode = topicNodes[i++];) {
      var authorNode = topicNode.querySelector('td:nth-child(2) .author');
      if (authorNode) {
        var matches = authorNode.href.match(/(\d+)$/);
        if (matches) {
          var aid = matches[1];

          var thisColumn = authorNode.parentNode.parentNode;
          if (thisColumn) {
            var nodeA = document.createElement("a");
            nodeA.classList.add("action");
            nodeA.textContent = "posts";
            nodeA.href = "/users/" + aid + "/posts";

            var nodeDiv = document.createElement("div");
            nodeDiv.classList.add("actions");

            nodeDiv.appendChild(nodeA);
            thisColumn.insertBefore(nodeDiv, thisColumn.firstChild);
          }

          for (var authorid in authorids)
            if (aid == authorid) {
              topicNode.classList.add("spam");

              if (gmcHome.get('hideTaggedSpammers'))
                topicNode.classList.add("hide");

              countSpammersTopics++;
              break;
            }
        }
      }
    }

    if (topicNodes.length > 0 && countSpammersTopics == topicNodes.length - 1 && gmcHome.get('autoPageSpammers'))
      autoPage();


  var countSpamsPosts = 0;

  var postNodes = document.querySelectorAll('.post');
  for (var i = 0, postNode; postNode = postNodes[i++];) {
    var pid = null, aid = null;

    var matches = postNode.id.match(/\-(\d+)$/);
    if (matches)
      pid = matches[1];

    var authorNode = postNode.querySelector('.author a[user_id]')
        || postNode.querySelector('.author a[href^="/users/"]')
            || document.querySelector('#root #section h2 a[href^="/users/"]');
    if (authorNode)
      aid = authorNode.getAttribute("user_id")
          || authorNode.getAttribute("href").match(/(\d+)$/)[1]
              || document.querySelector('#root #section h2 a[href^="/users/"]').match(/(\d+)$/)[1];

    if (gLOGGEDIN) {
      var spampollNode = postNode.querySelector('.body .spam_poll form input[value="SPAM"]');
      if (spampollNode)
        spampollNode.addEventListener("click", spamClick, true);

      var hampollNode = postNode.querySelector('.body .spam_poll form input[value="NOT SPAM"]');
      if (hampollNode) {
        hampollNode.value = "HAM";
        hampollNode.addEventListener("click", hamClick, true);
      }

      var spamNode = postNode.querySelector('form input[value="SPAM"]');
      if (spamNode) {
        spamNode.addEventListener("click", spamClick, true);

        var anchorNode = spamNode.parentNode.parentNode;

        var spamsNodeInput = document.createElement("input");
        spamsNodeInput.type = "button";
        spamsNodeInput.value = "SPAMS";
        spamsNodeInput.addEventListener("click", spamsClick, true);

        anchorNode.appendChild(spamsNodeInput);
        anchorNode.appendChild(document.createElement("p"));

        if (gSPAMQSP) {
          var hamNodeInput = document.createElement("input");
          hamNodeInput.type = "button";
          hamNodeInput.value = "HAM";
          hamNodeInput.addEventListener("click", hamClick, true);

          anchorNode.appendChild(hamNodeInput);
          anchorNode.appendChild(document.createElement("p"));
        }
      }
    }

    var authorFound = false, postFound = false;

    for (var postid in postids)
      if (pid == postid) {
        postFound = true;
        postids[postid] = new Date().getTime();
        GM_setValue("postids", JSON.stringify(postids, null, ""));
        break;
      }

    for (var authorid in authorids)
      if (aid == authorid) {
        authorFound = true;
        authorids[authorid] = new Date().getTime();
        GM_setValue("authorids", JSON.stringify(authorids, null, ""));
        break;
      }

    if (authorFound || postFound) {
      if (!gSPAMQSP)
        postNode.classList.add("clip");

      if (postFound) {
        postNode.classList.add("spam");
        countSpamsPosts++;
      }
      else
        postNode.classList.add("bad-ham");

      if (!gSPAMQSP && !gUSERPOSTS && gmcHome.get('hideTaggedSpams'))
        hidePost(postNode);
    }

    if (gLOGGEDIN && authorFound && !postFound)
      queue.push(postNode);
  }

  if (gLOGGEDIN) {
    var queued = queue.length;
    if (queued > 0) {
      var spamsNodes = document.querySelectorAll(".spams");
      for (var i = 0, spamsNode; spamsNode = spamsNodes[i++];)
        spamsNode.textContent = queue.length + ' Spams Queued';

      if (idle)
        submitSpams(gRETRIES);
    }

    if (!gSPAMQSP && postNodes.length > 0 && countSpamsPosts == postNodes.length && gmcHome.get('autoPageSpams'))
      autoPage();
  }
  else {
    if (!gSPAMQSP && postNodes.length > 0 && countSpamsPosts == postNodes.length && gmcHome.get('autoPageSpams'))
      autoPage();
  }

})();
