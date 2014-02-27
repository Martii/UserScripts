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
// @version         1.0.11
// @icon            https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @include  http://userscripts.org/posts*
// @include  http://userscripts.org/topics*
// @include  http://userscripts.org/groups/*/topics*
// @include  http://userscripts.org/scripts/discuss/*
// @include  http://userscripts.org/forums/*
// @include  http://userscripts.org/users/*/posts*

// @include  https://userscripts.org/posts*
// @include  https://userscripts.org/topics*
// @include  https://userscripts.org/groups/*/topics*
// @include  https://userscripts.org/scripts/discuss/*
// @include  https://userscripts.org/forums/*
// @include  https://userscripts.org/users/*/posts*

// @updateURL   https://userscripts.org/scripts/source/398715.meta.js
// @installURL  https://userscripts.org/scripts/source/398715.user.js
// @downloadURL https://userscripts.org/scripts/source/398715.user.js

// @grant  GM_addStyle
// @grant  GM_getValue
// @grant  GM_setValue

// ==/UserScript==

  /**
   *
   */
  var
      gDEBUG,
      gRETRIES = 3,
      gLOGGEDIN = document.querySelector("body.loggedin"),
      gPATHNAME = location.pathname,
      gSEARCH = location.search,
      gSPAMQSP = (getQsp(gSEARCH, "spam") == 1)
  ;

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

    var qsps = aQs.split("&");
    for (var i = 0, qsp; qsp = qsps[i++];) {
      var qspnv = qsp.split("=");
      var name = qspnv[0];
      var value = qspnv[1];

      if (name == aName)
        value = aValue;

      newQs.push(name + "=" + value);
    }

    if (newQs.length > 0)
      return ("?" + newQs.join("&"));
    else
      return ("?" + aName + "=" + aValue);
  }

  /**
   *
   */
  function autoPage() {
    var currPage = getQsp(gSEARCH, "page");
    if (!currPage)
      currPage = "1";

    var currPagex = parseInt(currPage);

    if (direction == "prev" && currPagex != 1) {
      var prevpageNode = paginationNode.querySelector('.prev_page');
      if (prevpageNode && !prevpageNode.classList.contains('disabled'))
        location.replace(replaceQsp(gSEARCH, "page", currPagex - 1));
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

            var userspamsNode = document.querySelector("#root #top #userspams");
            if (userspamsNode)
              userspamsNode.textContent = queue.length + ' Spams Queued';

            if (queue.length > 0)
              submitSpams(gRETRIES);
            else
              idle = true;

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
    if (!gSPAMQSP)
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
            if (!gSPAMQSP)
              hidePost(postNode);
            queue.push(postNode);
          }
        }
      }

      var queued = queue.length;
      if (queued > 0) {
        var userspamsNode = document.querySelector("#root #top #userspams");
        if (userspamsNode) {
          var matches = userspamsNode.textContent.match(/(\d+)\s/);
          if (matches)
            userspamsNode.textContent = queued + " Spams Queued";
        }

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

  /**
   *
   */
  var
      postids = JSON.parse(GM_getValue("postids", "{}")),
      authorids = JSON.parse(GM_getValue("authorids", "{}")),
      lastpage = JSON.parse(GM_getValue("lastpage", "{}")),
      queue = [],
      idle = true
  ;

  /**
   *
   */
  GM_addStyle(
    [
      '.post form[action="/spam"] { clear: left; padding-top: 0.25em; }',
      '.actions { float: right; font-size: 0.9em; margin-left: 1em; }',
      '.action { color: #444; margin-left: 0.5em; text-decoration: none; }',
      '.action:hover { color: #444; text-decoration: underline !important; }'

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
      var nodeA = document.createElement("a");
      nodeA.id = "userspams";
      nodeA.href = "#";
      nodeA.textContent = "0 Spams Queued";

      var nodeLi = document.createElement("li");
      nodeLi.appendChild(nodeA);

      login_statusNode.insertBefore(nodeLi, login_statusNode.firstChild);
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

  var countHiddenTopics = 0;

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
            topicNode.classList.add("hide");
            countHiddenTopics++;
            break;
          }
      }
    }
  }

  if (countHiddenTopics == topicNodes.length - 1)
    autoPage();

  var postNodes = document.querySelectorAll('.post');
  for (var i = 0, postNode; postNode = postNodes[i++];) {
    var pid = undefined, aid = undefined;

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
      if (postFound)
        postNode.classList.add("spam");
      else
        postNode.classList.add("bad-ham");

      if (!gSPAMQSP)
        hidePost(postNode);
    }

    if (gLOGGEDIN && authorFound && !postFound)
      queue.push(postNode);
  }

  if (gLOGGEDIN) {
    var queued = queue.length;
    if (queued > 0) {
      var userspamsNode = document.querySelector("#root #top #userspams");
      if (userspamsNode) {
        var matches = userspamsNode.textContent.match(/(\d+)\s/);
        if (matches)
          userspamsNode.textContent = queued + " Spams Queued";
      }

      if (idle)
        submitSpams(gRETRIES);
    }
  }

})();
