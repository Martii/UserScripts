(function () {
  'use strict';

// ==UserScript==
// @name          oujs - JsBeautify
// @namespace     https://openuserjs.org/users/Marti
// @description   Beautifies the Source Code Page
// @copyright     2014+, Marti Martz (https://openuserjs.org/users/Marti)
// @contributor   Chris Holland (https://github.com/Zren)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       0.3.6eol
// @icon          https://gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?s=48

// @homepageURL  https://github.com/Martii/UserScripts/tree/master/src/oujs/JsBeautify
// @homepageURL  https://openuserjs.org/scripts/Marti/oujs_-_JsBeautify
// @supportURL   https://openuserjs.org/scripts/Marti/oujs_-_JsBeautify/issues

// @updateURL    https://openuserjs.org/meta/Marti/oujs_-_JsBeautify.meta.js
// @downloadURL  https://openuserjs.org/install/Marti/oujs_-_JsBeautify.min.user.js

// @include  https://openuserjs.org/scripts/*/*/source
// @include  https://openuserjs.org/libs/*/*/source
// @include  https://openuserjs.org/user/add/scripts/new
// @include  https://openuserjs.org/user/add/lib/new

// @include  http://openuserjs.org/scripts/*/*/source
// @include  http://openuserjs.org/libs/*/*/source
// @include  http://openuserjs.org/user/add/scripts/new
// @include  http://openuserjs.org/user/add/lib/new

// @include  http://localhost:8080/scripts/*/*/source
// @include  http://localhost:8080/libs/*/*/source
// @include  http://localhost:8080/user/add/scripts/new
// @include  http://localhost:8080/user/add/lib/new

// @require  https://raw.githubusercontent.com/beautify-web/js-beautify/master/js/lib/beautify.js

// @grant  none

// ==/UserScript==

  alert([
    'WHO: That would be you!',
    'WHAT: oujs - JsBeautify is EOL and has been integrated into the site.',
    'WHERE: Somewhere around the globe.',
    'WHEN: Now perhaps to avoid this naggy alert box.',
    'WHY: From what I can tell Greasemonkey 4.x via Firefox 57+ no longer has access to page scripts which is where the Ace editor resides.',
    '',
    'HOW: Please uninstall from your .user.js engine at your earliest convenience.',
    '',
    'Many thanks to all of you that have been using this script and favored it. :)'

  ].join('\n'));

  return;

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

  var
    rawSource = ace.edit('editor').getSession().getValue(),
    isBlocking,
    hasChanged = false
  ;

  ace.edit('editor').getSession().on('change', function (aE) {
    if (isBlocking)
      return;

    if (!hasChanged) {
      hasChanged = true;

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

    var beautifyNodeInput = document.querySelector('#beautify');
    if (beautifyNodeInput) {
      beautifyNodeInput.classList.remove('active');
    }
  });

  var hookNode = document.querySelector('div.container-fluid div.row div.col-md-12, div.container-fluid div.row div.col-sm-8');
  if (hookNode) {
    var beautifyNodeInput = document.createElement('input');
    beautifyNodeInput.classList.add('btn');
    beautifyNodeInput.classList.add('btn-success');
    beautifyNodeInput.id = 'beautify';
    beautifyNodeInput.setAttribute('value', 'Beautify');
    beautifyNodeInput.type = 'button';
    beautifyNodeInput.addEventListener('click', function (aE) {
      var thisNode = document.querySelector('pre#editor');
      if (thisNode) {

        var submit_codeNode = document.querySelector('button#submit_code');
        var ace_gutterLayer = document.querySelector('.ace_gutter-layer');

        if (aE.target.classList.contains('active') && !hasChanged) {
          isBlocking = true;
          ace.edit('editor').getSession().setValue(rawSource);
          aE.target.classList.remove('active');
          isBlocking = false;

          if (submit_codeNode) {
            submit_codeNode.classList.add('btn-success');
            submit_codeNode.classList.remove('btn-warning');
          }

          if (ace_gutterLayer) {
            ace_gutterLayer.classList.remove('btn-warning');
          }

        }
        else {
          isBlocking = true;
          if (!hasChanged)
            aE.target.classList.add('active');

          ace.edit('editor').getSession().setValue(beautify(hasChanged ? ace.edit('editor').getSession().getValue() : rawSource));
          isBlocking = false;

          if (submit_codeNode) {
            submit_codeNode.classList.remove('btn-success');
            submit_codeNode.classList.add('btn-warning');
          }

          if (ace_gutterLayer) {
            ace_gutterLayer.classList.add('btn-warning');
          }
        }

        aE.target.blur();
      }
    });


    var wrappedNodeInput =  document.createElement('input');
    wrappedNodeInput.classList.add('btn');
    wrappedNodeInput.classList.add('btn-success');
    wrappedNodeInput.id = 'wrap';
    wrappedNodeInput.setAttribute('value', 'Wrap');
    wrappedNodeInput.type = 'button';
    wrappedNodeInput.addEventListener('click', function (aE) {
      var thisNode = document.querySelector('pre#editor');
      if (thisNode) {
        if (ace.edit('editor').getSession().getUseWrapMode()) {
          ace.edit('editor').getSession().setUseWrapMode(false);
          aE.target.classList.remove('active');
        }
        else {
          ace.edit('editor').getSession().setUseWrapMode(true);
          aE.target.classList.add('active');
        }

        aE.target.blur();
      }
    });

    var toolbarNodeDiv = document.createElement('div');
    toolbarNodeDiv.classList.add('btn-toolbar');

    toolbarNodeDiv.appendChild(wrappedNodeInput);
    toolbarNodeDiv.appendChild(beautifyNodeInput);

    hookNode.appendChild(toolbarNodeDiv);
  }

})();
