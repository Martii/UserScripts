// ==UserScript==
// @name         OUJS-1
// @namespace    https://openuserjs.org/users/Marti
// @description  Small changes to OUJS that may or may not make it upstream
// @copyright    2016+, Marti Martz, (https://openuserjs.org/users/Marti)
// @copyright    2014-2016, TimidScript
// @copyright    2013+, OpenUserJS Group (https://github.com/OpenUserJs)
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      2.0.0a.10
// @icon         https://gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?s=48

// @author        Marti
// @contributor   jerone
// @contributor   sizzle
// @contributor   TimidScript

// @homepageURL  https://github.com/Martii/UserScripts/tree/master/src/oujs/OUJS-1
// @homepageURL  https://openuserjs.org/scripts/Marti/OUJS-1
// @supportURL   https://openuserjs.org/scripts/Marti/OUJS-1/issues

// @updateURL    https://openuserjs.org/meta/Marti/OUJS-1.meta.js
// @downloadURL  https://openuserjs.org/install/Marti/OUJS-1.user.js

// @include  https://openuserjs.org/*
// @include  http://openuserjs.org/*
// @include  http://localhost:8080/*

// @grant  GM_getValue
// @grant  GM_setValue

// @noframes

// @require https://openuserjs.org/src/libs/sizzle/GM_config.js

// ==/UserScript==

/* jshint esversion: 5 */
/* globals GM_config: true, GM_configStruct */

(function() {
  'use strict';

  // Let the GC know to remove some preallocated memory
  GM_config = undefined;

  var gmc = new GM_configStruct();

  // Find node on location of /user/preferences
  var hookNode = document.querySelector('.edit-authentication-box');
  if (hookNode) {
    hookNode = hookNode.parentNode;
  } else {
    hookNode = document.body;
  }

  var prefNode = document.createElement('div');
  hookNode = hookNode.appendChild(prefNode);

  gmc.init(
    {
      frame: hookNode,
      id: 'gmc',
      title: 'OUJS-1',
      fields: {
        'showScriptListLineNumbers': {
          "type": 'checkbox',
          "label": 'Show script list line numbers',
          "default": false
        },
        'clipScriptListLineNumbers': {
          "type": 'checkbox',
          "label": 'Clip script list line numbers',
          "default": false
        },
        'borderImages': {
          "type": 'checkbox',
          "label": 'Border images',
          "default": false
        },
        'emphasizeTableHeaderSorts': {
          "type": 'checkbox',
          "label": 'More emphasis on sortBy with table headers',
          "default": false
        },
        'emphasizeCurrentUsername': {
          "type": 'checkbox',
          "label": 'More emphasis on current username',
          "default": false
        },
        'stickMainNav': {
          "type": 'checkbox',
          "label": 'Main navigation to sticky',
          "default": false
        }
      },
      css:
        [
          '#gmc { position: static !important; width: auto !important; height: auto !important; max-height: none !important; max-width: none !important; margin: 0 !important; border: none !important; margin-top: 20px !important; margin-bottom: 10px !important; }',
          '#gmc_header { text-align: left !important; font-family: "Squada One","Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 30px; font-weight: 500; line-height: 1.1; }',
          '#gmc .field_label { font-size: inherit; font-weight: inherit; line-height: inherit; margin-left: 5px; }',

          '#gmc_resetLink { display: none; }',
          '#gmc_closeBtn { display: none; }'

        ].join(''),
      events: {
        open: function (aDoc) {
          var saveNode = aDoc.querySelector('#gmc_saveBtn');
          saveNode.classList.remove('saveclose_buttons');
          saveNode.classList.add('btn');
          saveNode.classList.add('btn-success');
        }
      }
    }
  );

  if (document.location.pathname === '/user/preferences') {
    gmc.open();
  }

  if (gmc.get('showScriptListLineNumbers')) {
    var count = null;

    if (document.querySelector('.pagination')) {
      var req = new XMLHttpRequest();
      req.responseType = 'document';
      req.open('GET', '/?limit=1');
      req.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
          switch (this.status) {
            case 200:
              var doc = this.responseXML;

              var paginationNode = doc.querySelector('.pagination li:last-child');
              count = parseInt(paginationNode.textContent);

              var limit = document.location.search.match(/limit\=(\d+)/);
              limit = limit ? parseInt(limit[1]) : 25;

              var page = document.location.search.match(/p\=(\d+)/);
              page = page ? parseInt(page[1]): 1;

              var nodes = document.querySelectorAll('.col-sm-8 table .tr-link');
              count = nodes.length;

              for (var i = 0; i < count; ++i) {
                var nodeSpan = document.createElement('span');
                nodeSpan.classList.add('badge');
                if (gmc.get('clipScriptListLineNumbers')) {
                  nodeSpan.textContent = (i + 1 + ((page - 1) * limit)) % 100;
                  if (nodeSpan.textContent.length === 1) {
                    nodeSpan.textContent = '0' + nodeSpan.textContent;
                  }
                }
                else {
                  nodeSpan.textContent = i + 1 + ((page - 1) * limit);
                }

                nodes[i].firstChild.nextSibling.insertBefore(nodeSpan, nodes[i].firstChild.nextSibling.firstChild);
              }
              break;
          }
        }
      };
      req.send();
    }
    else {
      var nodes = document.querySelectorAll('.col-sm-8 table .tr-link');
      count = nodes.length;

      for (var i = 0; i < count; ++i) {
        var nodeSpan = document.createElement('span');
        nodeSpan.classList.add('badge');
        if (gmc.get('clipScriptListLineNumbers')) {
          nodeSpan.textContent = (i + 1) % 100;
        }
        else {
          nodeSpan.textContent = i + 1;
        }

        nodes[i].firstChild.nextSibling.insertBefore(nodeSpan, nodes[i].firstChild.nextSibling.firstChild);
      }
    }
  }

  if (gmc.get('borderImages')) {
    var nodeStyle = document.createElement('style');
    nodeStyle.setAttribute("type", "text/css");
    nodeStyle.textContent = '.user-content img, .topic-post-contents img { max-width: 98%; border: 1px solid blue; padding: 2px; color: yellow; margin: 5px 0; box-shadow: 5px 5px 2px #888; }';

    document.head.appendChild(nodeStyle);
  }

  if (gmc.get('emphasizeTableHeaderSorts')) {
    var nodeStyle = document.createElement('style');
    nodeStyle.setAttribute("type", "text/css");
    nodeStyle.textContent = '.table th.active { background-color: rgba(44, 62, 80, 0.6) !important; } .table th.active a { color: white !important; }';

    document.head.appendChild(nodeStyle);
  }

  if (gmc.get('emphasizeCurrentUsername')) {

    var nodeStyle = document.createElement('style');
    nodeStyle.setAttribute("type", "text/css");
    nodeStyle.textContent = '.label-primary a { color: white !important; }';

    document.head.appendChild(nodeStyle);

    // Get current username
    var thatNode = document.querySelector('.navbar-right li:last-child');
    var usernameNode = thatNode.previousSibling.previousSibling.firstChild;

    var ownerNodes = document.querySelectorAll('span.label');
    for (var i = 0; i < ownerNodes.length; ++i) {
      if (ownerNodes[i].firstChild && ownerNodes[i].firstChild.textContent === usernameNode.textContent) {
        ownerNodes[i].classList.remove('label-info');
        ownerNodes[i].classList.add('label-primary');
      }
    }
  }

  if (gmc.get('stickMainNav')) {

    var nodeStyle = document.createElement('style');
    nodeStyle.setAttribute("type", "text/css");
    nodeStyle.textContent = '.sticky { position: sticky; top: 0; }';

    document.head.appendChild(nodeStyle);

    var bodynavNode = document.querySelector('body nav');
    if (bodynavNode) {
      bodynavNode.classList.add('sticky');
    }
  }

})();
