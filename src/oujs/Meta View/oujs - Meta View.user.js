(function() {
  'use strict'

// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a script navigation link next to Source Code titled `Meta` and opens a phantom url to show the detected metadata block
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version       2.0.0rc3pre
// @icon          https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @homepageURL  https://openuserjs.org/scripts/marti/httpsopenuserjs.orgusersMarti/oujs_-_Meta_View
// @supportURL   https://openuserjs.org/scripts/marti/httpsopenuserjs.orgusersMarti/oujs_-_Meta_View/issues

// @include  /^https?://openuserjs\.org(?::\d{1,5})?/scripts//

// @include  https://openuserjs.org/scripts/*/*/*

// @grant  GM_deleteValue
// @grant  GM_getValue
// @grant  GM_setValue
// @grant  GM_xmlhttpRequest

// ==/UserScript==

  if (/\/meta$/.test(location.pathname)) { // NOTE: Currently a 404 page
    var panelBodyNode = document.querySelector('div.panel-body');
    if (panelBodyNode && panelBodyNode.firstChild.nextSibling.textContent == "404") {
      var titleNode = document.head.querySelector('title');
      if (titleNode) {
        var title = GM_getValue('scriptTitle', '');
        titleNode.textContent = 'Meta ' + (title ? ' ' + title : '');
      }

      var hookNode = panelBodyNode;

      // Reset content
      while (hookNode.hasChildNodes())
        hookNode.removeChild(hookNode.firstChild);

      // Simulate a View Source page
      var ace_text_inputNodeTextarea = document.createElement('textarea');
      ace_text_inputNodeTextarea.classList.add('ace_text-input');
      ace_text_inputNodeTextarea.wrap = 'off';
      ace_text_inputNodeTextarea.setAttribute('spellcheck', 'false');
      ace_text_inputNodeTextarea.style = 'opacity: 1; height: 550px; width: 100%; min-width: 100%; max-width: 100%; right: 1605px; bottom: 350px;';
      ace_text_inputNodeTextarea.setAttribute('readonly', '');

      ace_text_inputNodeTextarea.value = GM_getValue('responseText', 'no data found in storage');

      var editorNodePre = document.createElement('pre');
      editorNodePre.classList.add('ace_editor');
      editorNodePre.classList.add('ace-dawn');
      editorNodePre.id = 'editor';

      editorNodePre.appendChild(ace_text_inputNodeTextarea);
      hookNode.appendChild(editorNodePre);
    }

    // Erase keys
    GM_deleteValue('scriptTitle');
    GM_deleteValue('responseText');
  }
  else {

    var sourceNode = document.querySelector('#content-navbar ul.nav li a[href$="/source"]');
    if (sourceNode) {
      var hookNode = sourceNode.parentNode.parentNode;

      var installNode = document.querySelector('h2.page-heading a[href$=".user.js"]');
      if (installNode) {
        var installURL = installNode.pathname;

        var NodeA = document.createElement('a');
        NodeA.href = sourceNode.pathname.replace(/\/source$/, '/meta'); // NOTE: Watchpoint
        NodeA.textContent = "Meta";


        NodeA.addEventListener('click', function (ev) {
          ev.preventDefault();

          GM_xmlhttpRequest({
            method: 'GET',
            url: installURL,
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

              GM_setValue('responseText', xhr.responseText);

              var scriptTitleNode = document.querySelector('h2.page-heading a.script-name');
              if (scriptTitleNode)
                GM_setValue('scriptTitle', scriptTitleNode.textContent.trim());
              else
                GM_setValue('scriptTitle', '');

              location.pathname += '/meta';
            }
          });
        });


        var NodeLi = document.createElement('li');
        NodeLi.appendChild(NodeA);

        hookNode.insertBefore(NodeLi, sourceNode.parentNode.nextSibling.nextSibling);
      }
    }
  }

})();
