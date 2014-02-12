(function () {
  "use strict";

// ==UserScript==
// @name          uso - Sticky Topics
// @namespace     http://userscripts.org/users/37004
// @description   Moves a formatted table from the main script homepage description area to the Forum Activity sidebar header
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       Creative Commons; http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       1.0.1
// @icon          https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @include       http://userscripts.org/scripts/show/*
// @include       https://userscripts.org/scripts/show/*

// @grant  none

// ==/UserScript==

  /**
   *
   */
  var abort = false;

  var full_descriptionNode = document.getElementById("full_description");
  if (full_descriptionNode) {

    // Validate table
    var tableNodes = document.querySelectorAll("table");
    for (var i = 0, tableNode; tableNode = tableNodes[i++];) {

      var thNodes = tableNode.querySelectorAll("th");
      if (thNodes && thNodes.length == 2 && thNodes[0].textContent == "Sticky Topics" && thNodes[1].textContent == "Posts") {


        var trNodes = tableNode.querySelectorAll("tr");
        if (trNodes) {
          for (var j = 0, trNode; trNode = trNodes[j++];) {
            var tid = null;

            var tdNodes = trNode.querySelectorAll("td");
            for (var k = 0, tdNode; tdNode = tdNodes[k]; k++) {
              switch (k) {
                case 0:
                  var aNodes = tdNode.querySelectorAll("a");
                  if (aNodes && aNodes.length == 1) {
                    for (var l = 0, aNode; aNode = aNodes[l++];) {
                      var matches = aNode.href.match(/^(?:https?:\/\/userscripts\.org)\/topics\/(\d+)/i);
                      if (matches) {
                        tid = matches[1];
                        aNode.href = "/topics/" + tid + aNode.hash;

                        var textContent = aNode.textContent;
                        if (textContent.length > 30)
                          aNode.textContent = textContent.substr(0, 27) + "...";
                      }
                      else
                        abort = true;
                    }
                  }
                  else
                    abort = true;
                  break;

                case 1:
                  var aNodes = tdNode.querySelectorAll("a");
                  if (aNodes && aNodes.length > 0) {
                    if (aNodes.length == 1) {
                      aNode = aNodes[0];

                      aNode.href = "/topics/" + tid + "#posts-last";
                      aNode.textContent = "\u00BB";
                    }
                    else
                      abort = true;
                  }
                  else {
                    tdNode.textContent = "\u2013";
                  }

                  break;
                default:
                  abort = true;
              }

            }

            if (!abort) {
              /**
              * Add styling
              */
              var css = [
                  '#right #stickytopics { font-size: 0.9em; }',
                  '#right #stickytopics td:last-child { text-align: right; }'

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

              nodeDiv.appendChild(tableNode);

              var topicsNode = document.getElementById("topics");
              var script_sidebarNode = document.getElementById("script_sidebar");
              if (script_sidebarNode && topicsNode) {
                script_sidebarNode.insertBefore(nodeDiv, topicsNode);
              }

              abort = false;
            }

          }
        }
      }
    }
  }
})();
