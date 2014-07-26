(function() {
  'use strict';

// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a script navigation link next to `Source Code` titled `Meta` and opens a phantom url to show the detected metadata block
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       2.1.0
// @icon          https://www.gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?r=G&s=48&default=identicon

// @homepageURL  https://github.com/Martii/UserScripts/tree/master/src/oujs/Meta%20View
// @homepageURL  https://openuserjs.org/scripts/marti/oujs_-_Meta_View
// @supportURL   https://openuserjs.org/scripts/marti/oujs_-_Meta_View/issues

// @include  /^https?://openuserjs\.org(?::\d{1,5})?/scripts//
// @include  /^http://localhost(?::\d{1,5})?/scripts//

// @include  https://openuserjs.org/scripts/*/*
// @include  http://localhost:8080/scripts/*/*

// @require  https://openuserjs.org/js/ace/ace.js
// @require  https://openuserjs.org/js/ace/theme-dawn.js
// @require  https://openuserjs.org/js/ace/mode-javascript.js
// @require  https://openuserjs.org/js/ace/ext-searchbox.js

// @grant  GM_xmlhttpRequest
// @grant  GM_addStyle

// ==/UserScript==

  var matches = location.pathname.match(/^\/scripts\/(.*?)\/(.*?)(?:$|\/)/);
  if (matches) {
    var
        userName = matches[1],
        scriptName = matches[2]
    ;

    if (/\/meta$/.test(location.pathname)) { // NOTE: Currently a 404 page
      var panelBodyNode = document.querySelector('div.panel-body');
      if (panelBodyNode && panelBodyNode.firstChild.nextSibling.textContent == '404') {

        var titleNode = document.head.querySelector('title');
        if (titleNode) {
          titleNode.textContent = 'Meta ' + scriptName + '| OpenUserJS';
        }

        var hookNode = panelBodyNode;

        // Reset content
        while (hookNode.hasChildNodes())
          hookNode.removeChild(hookNode.firstChild);

        var NodeDiv = document.createElement('div');
        NodeDiv.classList.add('alert');
        NodeDiv.classList.add('alert-warning');

        var NodeStrong = document.createElement('strong');
        NodeStrong.textContent = 'PLEASE WAIT';

        var NodeText = document.createTextNode(': Fetching the metadata block');

        NodeDiv.appendChild(NodeStrong);
        NodeDiv.appendChild(NodeText);

        hookNode.appendChild(NodeDiv);

        var url = '/install/' + userName + '/' + scriptName + '.user.js';
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          headers: {
            'Accept': 'text/x-userscript-meta'
          },
          onload: function(xhr) {
            console.log('META VIEW REQUEST SUMMARY');

            console.group();
              console.log(
                [
                  '',
                  xhr.status,
                  xhr.statusText,
                  xhr.readyState,
                  xhr.responseHeaders,
                  xhr.finalUrl,
                  ''

                ].join('\n')
              );
            console.groupEnd();

            switch (xhr.status) {
              case 200:
                // Simulate a View Source page
                GM_addStyle(
                  [
                    '#editor { height: calc(100vh - 210px); }'

                  ].join('\n')
                );

                var editorNodePre = document.createElement('pre');
                editorNodePre.classList.add('ace_editor');
                editorNodePre.classList.add('ace-dawn');
                editorNodePre.id = 'editor';

                editorNodePre.textContent = xhr.responseText;

                hookNode.removeChild(NodeDiv);

                hookNode.appendChild(editorNodePre);

                var editor = ace.edit('editor');
                editor.setTheme('ace/theme/dawn');
                editor.getSession().setMode('ace/mode/javascript');
                editor.setReadOnly(true);

                break;
              default:
                NodeDiv.classList.remove('alert-warning');
                NodeDiv.classList.add('alert-danger');

                NodeStrong.textContent = 'ERROR';
                NodeText.textContent = ': Unable to fetch the metadata block with status of: ' + xhr.status;

                break;
            }
          }
        });
      }
    }
    else {
      var sourceNode = document.querySelector('#content-navbar ul.nav li a[href$="/source"]');
      if (sourceNode) {
        var hookNode = sourceNode.parentNode.parentNode;

        var NodeA = document.createElement('a');
        NodeA.href = '/scripts/' + userName + '/' + scriptName + '/meta';
        NodeA.textContent = 'Meta';

        var NodeLi = document.createElement('li');
        NodeLi.appendChild(NodeA);

        hookNode.insertBefore(NodeLi, sourceNode.parentNode.nextSibling.nextSibling);
      }
    }
  }

})();
