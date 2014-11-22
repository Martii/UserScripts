(function() {
  'use strict';

// ==UserScript==
// @name          oujs - JsBeautify
// @namespace     https://openuserjs.org/users/Marti
// @description   Beautifies the Source Code Page
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       0.0.0
// @icon          https://gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?s=48

// @include  https://openuserjs.org/scripts/*/*/source
// @include  https://openuserjs.org/libs/*/*/source

// @include  http://localhost:8080/scripts/*/*/source
// @include  http://localhost:8080/libs/*/*/source

// @require  https://raw.githubusercontent.com/einars/js-beautify/master/js/lib/beautify.js
// @require  https://openuserjs.org/redist/npm/ace-builds/src/ace.js
// @require  https://openuserjs.org/redist/npm/ace-builds/src/theme-dawn.js
// @require  https://openuserjs.org/redist/npm/ace-builds/src/mode-javascript.js
// @require  https://openuserjs.org/redist/npm/ace-builds/src/ext-searchbox.js

// @grant  GM_xmlhttpRequest

// ==/UserScript==


  function beautify(aE) {
    return js_beautify(aE.replace(/[“”]/g, '"').replace(/\t/g, '  '), {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      brace_style: 'end-expand',
      unescape_strings: true
    }) + '\n';
  }

  let hookNode = document.querySelector('div.container-fluid div.row div.col-md-12');
  if (hookNode) {
    let beautifyNodeInput = document.createElement('input');
    beautifyNodeInput.classList.add('btn');
    beautifyNodeInput.classList.add('btn-success');
    beautifyNodeInput.id = 'beautify';
    beautifyNodeInput.value = 'Beautify';
    beautifyNodeInput.type = 'button';
    beautifyNodeInput.addEventListener('click', function (aE) {
      let thisNode = document.querySelector('pre#editor');
      if (thisNode) {
        let textareaNode = thisNode.querySelector('textarea');
        if (textareaNode) {
          let matches = location.pathname.match(/^\/(scripts|libs)\/(.*)\/(.*)\/source$/);
          if (matches) {
            let scriptType, userName, scriptName;
            [, scriptType, userName, scriptName] = matches;
            let url = '/src/' + scriptType + '/' + userName + '/' + scriptName + (scriptType == 'scripts' ? '.user' : '') + '.js';
            GM_xmlhttpRequest({
              method: 'GET',
              url: url,
              onload: function (xhr) {
                switch (xhr.status) {
                  case 200:
                    thisNode.textContent = beautify(xhr.responseText);

                    let editor = ace.edit('editor');
                    editor.setTheme('ace/theme/dawn');
                    editor.getSession().setMode('ace/mode/javascript');

                    aE.target.disabled = 'disabled';

                    let submit_codeNode = document.querySelector('button#submit_code');
                    if (submit_codeNode) {
                      submit_codeNode.classList.remove('btn-success');
                      submit_codeNode.classList.add('btn-warning');
                    }

                    let ace_gutterLayer = document.querySelector('.ace_gutter-layer');
                    if (ace_gutterLayer) {
                      ace_gutterLayer.classList.add('btn-warning');
                    }

                    break;
                }
              }
            });
          }
        }
        else {  // NOTE: No Ace executed on site... probably lag on cloudflare... use local copy
          thisNode.textContent = beautify(thisNode.textContent);

          let editor = ace.edit('editor');
          editor.setTheme('ace/theme/dawn');
          editor.getSession().setMode('ace/mode/javascript');

          aE.target.disabled = 'disabled';

          let submit_codeNode = document.querySelector('input#submit_code');
          if (submit_codeNode) {
            submit_codeNode.classList.remove('btn-success');
            submit_codeNode.classList.add('btn-warning');
          }

        }
      }
    });

    hookNode.appendChild(beautifyNodeInput);
  }

})();
