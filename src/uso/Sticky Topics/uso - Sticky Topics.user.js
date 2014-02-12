(function () {
  "use strict";

// ==UserScript==
// @name          uso - Sticky Topics
// @namespace     http://userscripts.org/users/37004
// @description   Moves a formatted table from the main script homepage description area to the Forum Activity sidebar header
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       1.0.5
// @icon          https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @include       http://userscripts.org/scripts/show/*
// @include       https://userscripts.org/scripts/show/*

// @updateURL   https://userscripts.org/scripts/source/378796.meta.js
// @installURL  https://userscripts.org/scripts/source/378796.user.js
// @downloadURL https://userscripts.org/scripts/source/378796.user.js

// @grant  none

// ==/UserScript==

  /**
   *
   */

  function moveTable(aTable) {
    /**
    * Add styling
    */
    var css = [
        '#right #stickytopics { font-size: 0.9em; }',
        '#right #stickytopics td:last-child { text-align: right; }',
        '#right #stickytopics thead th { background: none repeat scroll 0 0 #333; color: #fff; }'

    ].join('');

    var nodeStyle = document.createElement("style");
    nodeStyle.type = "text/css";
    nodeStyle.textContent = css;

    document.head.appendChild(nodeStyle);

    /**
    * Symmetry with USO
    */
    tableNode.width = "100%";


    /**
    * Move the table
    */
    var nodeDiv = document.createElement("div");
    nodeDiv.id = "stickytopics";

    nodeDiv.appendChild(aTable);

    var topicsNode = document.getElementById("topics");
    var script_sidebarNode = document.getElementById("script_sidebar");
    if (script_sidebarNode && topicsNode)
      script_sidebarNode.insertBefore(nodeDiv, topicsNode);
  }

  /**
   *
   */
  var abort;

  var full_descriptionNode = document.getElementById("full_description");
  if (full_descriptionNode) {

    var thNodes = full_descriptionNode.querySelectorAll("table tr > th:first-child");
    for (var i = 0, thNode; thNode = thNodes[i]; i++) {
      if (/^Sticky\sTopics\s?$/.test(thNode.textContent)) {
        var tableNode = thNode.parentNode.parentNode.parentNode;
        abort = false;

        var trNodes = tableNode.querySelectorAll("tbody tr");
        for (var j = 0, trNode; trNode = trNodes[j]; j++) {

          var tid = null;

          var tdNodes = trNode.querySelectorAll("td");
          if (tdNodes.length == 2) {
            for (var k = 0, tdNode; tdNode = tdNodes[k]; k++) {
              switch (k) {
                case 0:
                  var aNodes = tdNode.querySelectorAll("a");
                  if (aNodes.length == 1) {
                    var aNode = aNodes[0];

                    var matches = aNode.href.match(/^(?:https?:\/\/userscripts\.org)\/topics\/(\d+)/i);
                    if (matches) {
                      tid = matches[1];
                      aNode.href = "/topics/" + tid + aNode.hash;

                      var textContent = aNode.textContent;
                      if (textContent.length > 30)
                        aNode.textContent = textContent.substr(0, 27) + "...";
                    }
                  }
                  else {
                    console.info('ABORT: Too many links');
                    abort = true;
                  }
                  break;

                case 1:
                  var aNodes = tdNode.querySelectorAll("a");
                  if (aNodes.length > 0) {
                    if (aNodes.length == 1) {
                      aNode = aNodes[0];

                      aNode.href = "/topics/" + tid + "#posts-last";
                      aNode.textContent = "\u00BB";
                    }
                    else {
                      console.info('ABORT: Too many links');
                      abort = true;
                    }
                  }
                  else
                    tdNode.textContent = "\u2013";
                  break;
              }
            }
          }
        }

        if (!abort)
          moveTable(tableNode);
      }
    }

  }
})();
