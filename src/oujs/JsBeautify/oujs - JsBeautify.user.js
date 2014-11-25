(function () {
  'use strict';

// ==UserScript==
// @name          oujs - JsBeautify
// @namespace     https://openuserjs.org/users/Marti
// @description   Beautifies the Source Code Page
// @copyright     2014+, Marti Martz (https://openuserjs.org/users/Marti)
// @contributor   Chris Holland (https://github.com/Zren)
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       0.1.1b
// @icon          https://gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?s=48

// @include  https://openuserjs.org/scripts/*/*/source
// @include  https://openuserjs.org/libs/*/*/source

// @include  http://localhost:8080/scripts/*/*/source
// @include  http://localhost:8080/libs/*/*/source

// @require  https://raw.githubusercontent.com/einars/js-beautify/master/js/lib/beautify.js

// @grant  none

// ==/UserScript==

  function beautify(aE) {
    return js_beautify(aE.replace(/[“”]/g, '"').replace(/\t/g, '  '), {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      brace_style: 'end-expand',
      unescape_strings: true,
      space_after_anon_function: true
    }) + '\n';
  }

  var hookNode = document.querySelector('div.container-fluid div.row div.col-md-12');
  if (hookNode) {
    var beautifyNodeInput = document.createElement('input');
    beautifyNodeInput.classList.add('btn');
    beautifyNodeInput.classList.add('btn-success');
    beautifyNodeInput.id = 'beautify';
    beautifyNodeInput.value = 'Beautify';
    beautifyNodeInput.type = 'button';
    beautifyNodeInput.addEventListener('click', function (aE) {
      var thisNode = document.querySelector('pre#editor');
      if (thisNode) {
        ace.edit('editor').getSession().setValue(beautify(ace.edit('editor').getSession().getValue()));

        var submit_codeNode = document.querySelector('button#submit_code');
        if (submit_codeNode) {
          submit_codeNode.classList.remove('btn-success');
          submit_codeNode.classList.add('btn-warning');
        }

        var ace_gutterLayer = document.querySelector('.ace_gutter-layer');
        if (ace_gutterLayer) {
          ace_gutterLayer.classList.add('btn-warning');
        }
      }
    });

    hookNode.appendChild(beautifyNodeInput);
  }

})();
