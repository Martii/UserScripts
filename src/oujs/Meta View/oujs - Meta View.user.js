(function() {
  'use strict';

// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a script navigation link next to `Source Code` titled `Meta` and opens a phantom url to show the detected metadata block
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       2.2.1
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
    var rLine = /\/\/ @(\S+)(?:\s+(.*))?/;
    var headers = {};
    var name = null;
    var prefix = null;
    var key = null;
    var value = null;
    var line = null;
    var lineMatches = null;
    var lines = {};
    var uniques = {
      'description': true,
      'icon': true,
      'name': true,
      'namespace': true,
      'version': true,
      'oujs:author': true
    };
    var unique = null;
    var one = null;
    var matches = null;

    lines = aString.split(/[\r\n]+/).filter(function (aElement, aIndex, aArray) {
      return (aElement.match(rLine));
    });

    for (line in lines) {
      var header = null;

      lineMatches = lines[line].replace(/\s+$/, '').match(rLine);
      name = lineMatches[1];
      value = lineMatches[2];
      if (aNormalize) {
        // Upmix from...
        switch (name) {
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
            break;
        }
      }
      name = name.split(/:/).reverse();
      key = name[0];
      prefix = name[1];
      if (key) {
        unique = {};
        if (prefix) {
          if (!headers[prefix]) {
            headers[prefix] = {};
          }
          header = headers[prefix];
          if (aNormalize) {
            for (one in uniques) {
              matches = one.match(/(.*):(.*)$/);
              if (uniques[one] && matches && matches[1] === prefix) {
                unique[matches[2]] = true;
              }
            }
          }
        } else {
          header = headers;
          if (aNormalize) {
            for (one in uniques) {
              if (uniques[one] && !/:/.test(one)) {
                unique[one] = true;
              }
            }
          }
        }
        if (!header[key] || aNormalize && unique[key]) {
          header[key] = value || '';
        } else if (!aNormalize || header[key] !== (value || '')
            && !(header[key] instanceof Array && header[key].indexOf(value) > -1)) {
          if (!(header[key] instanceof Array)) {
            header[key] = [header[key]];
          }
          header[key].push(value || '');
        }
      }
    }
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

        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.setRequestHeader('Accept', 'text/x-userscript-meta');

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

                mdbNodePre.textContent = this.responseText;

                hookNode.appendChild(mdbNodePre);

                var objNodePre = document.createElement('pre');
                objNodePre.classList.add('ace_editor');
                objNodePre.classList.add('ace-dawn');
                objNodePre.id = 'obj';

                objNodePre.textContent = JSON.stringify(parseMeta(this.responseText, false), null, ' ');

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
        NodeA.textContent = 'Meta';

        var NodeLi = document.createElement('li');
        NodeLi.appendChild(NodeA);

        hookNode.insertBefore(NodeLi, sourceNode.parentNode.nextSibling.nextSibling);
      }
    }
  }

})();
