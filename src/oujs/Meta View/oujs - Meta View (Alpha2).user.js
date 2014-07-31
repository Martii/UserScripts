(function() {
  'use strict';

// ==UserScript==
// @name          oujs - Meta View (Alpha 2)
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a script navigation link next to `Source Code` titled `Meta` and opens a phantom url to show the detected metadata block
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       2.2.3a2.3
// @icon          https://www.gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?r=G&s=48&default=identicon

// @homepageURL  https://github.com/Martii/UserScripts/tree/master/src/oujs/Meta%20View
// @homepageURL  https://openuserjs.org/scripts/marti/oujs_-_Meta_View
// @supportURL   https://openuserjs.org/scripts/marti/oujs_-_Meta_View/issues

// @include  /^https?://openuserjs\.org(?::\d{1,5})?/scripts//
// @include  /^http://localhost(?::\d{1,5})?/scripts//

// @include  https://openuserjs.org/scripts/*/*
// @include  http://localhost:8080/scripts/*/*

// @grant none

// ==/UserScript==

  function parseMeta(aString, aNormalize) {
    var headers = {};

    var blocks = aString.match(/^\/\/ ==[^\/\s]+==\s*$/mg);
    blocks.forEach(function (aElement, aIndex, aArray) {
      var matches = null;
      var block = aElement.trim().match(/^\/\/ ==(.*)==$/)[1];
      var rBlock = new RegExp('^// ==' + block + '==([\\s\\S]*?)^// ==/' + block + '==', 'm');
      var unique = {};
      var lines = {};
      var rLine = /\/\/ @(\S+)(?:\s+(.*))?/;
      var line = null;
      var head = null;
      var name = null;
      var value = null;
      var key = null;
      var locale = null;

      matches = aString.match(rBlock);
      if (matches) {
        if (aNormalize) {
          switch (block) {
            case 'UserScript':
              unique = {
                'description': true,
                'icon': true,
                'name': true,
                'namespace': true,
                'version': true
              }
              break;
            case 'OpenUserJS':
              unique = {
                'author': true
              }
          }
        }

        lines = matches[1].split(/[\r\n]+/).filter(function (aElement, aIndex, aArray) {
          return (aElement.match(rLine));
        });

        for (line in lines) {
          head = headers;
          matches = lines[line].replace(/\s+$/, '').match(rLine);

          name = matches[1];
          value = matches[2];

          name = name.split(/:/);
          key = name[0];
          locale = name[1] || '';

          if (key) {
            if (aNormalize) {
              // Upmix from...
              switch (block) {
                case 'UserScript':
                  switch (key) {
                    case 'homepage':
                    case 'source':
                    case 'website':
                      name = 'homepageURL';
                      break;
                    case 'defaulticon':
                    case 'iconURL':
                      name = 'icon';
                      break;
                    case 'licence':
                      name = 'license';
                  }
              }
            }

            if (!head[block]) {
              head[block] = {};
            }
            head = head[block];

            if (!head[locale]) {
              head[locale] = {};
            }
            head = head[locale];

            if (!head[key] || aNormalize && unique[key]) {
              head[key] = value || '';
            } else if (!aNormalize || head[key] !== (value || '')
                && !(head[key] instanceof Array && head[key].indexOf(value) > -1)) {
              if (!(head[key] instanceof Array)) {
                head[key] = [head[key]];
              }
              head[key].push(value || '');
            }
          }
        }
      }
    });

    return headers;
  }

  var matches = location.pathname.match(/^\/scripts\/(.*?)\/(.*?)(?:$|\/)/);
  if (matches) {
    var
        userName = matches[1],
        scriptName = matches[2]
    ;

    if (/\/meta$/.test(location.pathname)) { // NOTE: Currently a 404 page
      var NodeScript = document.createElement('script');
      NodeScript.setAttribute('src', '//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js');
      NodeScript.setAttribute('type', 'text/javascript');
      NodeScript.setAttribute('charset', 'UTF-8');

      var bodyNode = document.querySelector('body');
      bodyNode.appendChild(NodeScript);

      var panelBodyNode = document.querySelector('div.panel-body');
      if (panelBodyNode && panelBodyNode.firstChild.nextSibling.textContent == '404') {

        var titleNode = document.head.querySelector('title');
        if (titleNode) {
          titleNode.textContent = 'Meta Alpha ' + scriptName + '| OpenUserJS';
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

        var url = '/src/scripts/' + userName + '/' + scriptName + '.user.js';

        var req = new XMLHttpRequest();
        req.open('GET', url);
//         req.setRequestHeader('Accept', 'text/x-userscript-meta');

        req.onreadystatechange = function () {
          if (this.readyState == this.DONE) {
            console.log('META VIEW REQUEST SUMMARY');

            console.group();
              console.log(
                [
                  '',
                  this.status,
                  this.statusText,
                  this.readyState,
                  this.responseHeaders,
                  this.finalUrl,
                  ''

                ].join('\n')
              );
            console.groupEnd();

            switch (this.status) {
              case 200:
                var responseText = this.responseText;
                var blocks = null;

                var matches = responseText.match(new RegExp(['UserScript', 'OpenUserJS']
                  .map(function (aElement) {
                    return '^(// ==' + aElement + '==[\\s\\S]*?^// ==/' + aElement + '==)';
                  }).join('|'), 'mg'));
                if (matches) {
                  blocks = matches.join('\n\n');
                }

                // Simulate a Source Code page
                var NodeStyle = document.createElement('style');
                NodeStyle.setAttribute('type', 'text/css');
                NodeStyle.textContent =
                  [
                    '#mdb, #obj { min-height: 200px; min-height: -moz-calc(39vh); min-height: -o-calc(39vh); min-height: -webkit-calc(39vh); min-height: calc(39vh); }'

                  ].join('\n')
                ;
                document.head.appendChild(NodeStyle);

                var mdbNodePre = document.createElement('pre');
                mdbNodePre.classList.add('ace_editor');
                mdbNodePre.classList.add('ace-dawn');
                mdbNodePre.id = 'mdb';

                mdbNodePre.textContent = blocks;

                hookNode.appendChild(mdbNodePre);

                var objNodePre = document.createElement('pre');
                objNodePre.classList.add('ace_editor');
                objNodePre.classList.add('ace-dawn');
                objNodePre.id = 'obj';

                objNodePre.textContent = JSON.stringify(
                  parseMeta(blocks, true),
                  null,
                  ' '
                );

                hookNode.appendChild(objNodePre);

                hookNode.removeChild(NodeDiv);


                var mdb = ace.edit('mdb');
                mdb.setTheme('ace/theme/dawn');
                mdb.getSession().setMode('ace/mode/javascript');
                mdb.setReadOnly(true);

                var obj = ace.edit('obj');
                obj.setTheme('ace/theme/dawn');
                obj.getSession().setMode('ace/mode/json');
                obj.setReadOnly(true);


                break;
              default:
                NodeDiv.classList.remove('alert-warning');
                NodeDiv.classList.add('alert-danger');

                NodeStrong.textContent = 'ERROR';
                NodeText.textContent = ': Unable to fetch the metadata block with status of: ' + this.status;

                break;
            }
          }
        }
        req.send();
      }
    }
    else {
      var sourceNode = document.querySelector('#content-navbar ul.nav li a[href$="/source"]');
      if (sourceNode) {
        var hookNode = sourceNode.parentNode.parentNode;

        var NodeA = document.createElement('a');
        NodeA.href = '/scripts/' + userName + '/' + scriptName + '/meta';
        NodeA.textContent = 'Meta Alpha';

        var NodeLi = document.createElement('li');
        NodeLi.appendChild(NodeA);

        hookNode.insertBefore(NodeLi, sourceNode.parentNode.nextSibling.nextSibling);
      }
    }
  }

})();
