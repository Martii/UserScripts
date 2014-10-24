(function() {
  'use strict';

// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a script navigation link next to `Source Code` titled `Meta` and opens a phantom url to show the detected metadata block
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       2.2.6
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

  /**
   *
   */
  function lastValueOf(aMb, aKey, aPrefix) {
    if (aPrefix) {
      if (aMb[aPrefix] && aMb[aPrefix][aKey])
        return ((typeof aMb[aPrefix][aKey] == "string") ? aMb[aPrefix][aKey] : aMb[aPrefix][aKey][aMb[aPrefix][aKey].length - 1]);
    }
    else {
      if (aMb[aKey])
        return ((typeof aMb[aKey] == "string") ? aMb[aKey] : aMb[aKey][aMb[aKey].length - 1]);
    }

    return undefined;
  }

  var matches = location.pathname.match(/^\/scripts\/(.*?)\/(.*?)(?:$|\/)/);
  if (matches) {
    var
        userName = matches[1],
        scriptName = matches[2]
    ;

    var hookNode;
    if (/\/meta$/.test(location.pathname)) { // NOTE: Currently a 404 page
      var NodeScript = document.createElement('script');
      NodeScript.setAttribute('src', '/js/ace/ace.js'); // Watchpoint
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

        hookNode = panelBodyNode;

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
                var responseText = this.responseText.match(/^(\/\/ ==UserScript==[\s\S]*?^\/\/ ==\/UserScript==)/m)[1].trim();

                // Simulate a Source Code page
                var NodeStyle = document.createElement('style');
                NodeStyle.setAttribute('type', 'text/css');
                var min_height = 33;
                NodeStyle.textContent =
                  [
                    '#mdb, #obj { min-height: 200px; min-height: -moz-calc(' + min_height + 'vh); min-height: -o-calc(' + min_height + 'vh); min-height: -webkit-calc(' + min_height + 'vh); min-height: calc(' + min_height + 'vh); }',
                    '.path-divider { color: #666; margin: 0 0.25em; }'

                  ].join('\n')
                ;
                document.head.appendChild(NodeStyle);

                // Parse metadata block to standard
                var mb = parseMeta(responseText, false);


                // Fix title to be native
                var scriptNameX = lastValueOf(mb, "name");

                titleNode.textContent = 'Meta ' + scriptNameX + '| OpenUserJS';

                // Create meta views
                var objNodePre = document.createElement('pre');
                objNodePre.classList.add('ace_editor');
                objNodePre.classList.add('ace-dawn');
                objNodePre.id = 'obj';
                objNodePre.textContent = JSON.stringify(mb, null, ' ');

                var mdbNodePre = document.createElement('pre');
                mdbNodePre.classList.add('ace_editor');
                mdbNodePre.classList.add('ace-dawn');
                mdbNodePre.id = 'mdb';
                mdbNodePre.textContent = responseText;

                // Simulate navbar
                var navbar2TextStrongNodeB = document.createElement('b');
                navbar2TextStrongNodeB.textContent = 'Installs:';

                var navbar2TextIconNodeI = document.createElement('i');
                navbar2TextIconNodeI.classList.add('fa');
                navbar2TextIconNodeI.classList.add('fa-fw');
                navbar2TextIconNodeI.classList.add('fa-signal');

                var navbar2TextNodeP = document.createElement('p');
                navbar2TextNodeP.classList.add('navbar-text');
                navbar2TextNodeP.classList.add('pull-right');
                navbar2TextNodeP.classList.add('hidden-xs');

                var navNodeUl = document.createElement('ul');
                navNodeUl.classList.add('nav');
                navNodeUl.classList.add('navbar-nav');

                var navNodeA4Span4 = document.createElement('span');
                navNodeA4Span4.classList.add('badge');
                navNodeA4Span4.textContent = 'n/a';

                var navNodeA4 = document.createElement('a');
                navNodeA4.textContent = 'Issues ';
                navNodeA4.href = '/scripts/' + userName + '/' + scriptName + '/issues';

                var navNodeLi4 = document.createElement('li');

                var navNodeA3 = document.createElement('a');
                navNodeA3.textContent = 'Meta';
                navNodeA3.href = '/scripts/' + userName + '/' + scriptName + '/meta';

                var navNodeLi3 = document.createElement('li');
                navNodeLi3.classList.add('active');

                var navNodeA2 = document.createElement('a');
                navNodeA2.textContent = 'Source Code';
                navNodeA2.href = '/scripts/' + userName + '/' + scriptName + '/source';

                var navNodeLi2 = document.createElement('li');

                var navNodeA1 = document.createElement('a');
                navNodeA1.textContent = 'About';
                navNodeA1.href = '/scripts/' + userName + '/' + scriptName;

                var navNodeLi1 = document.createElement('li');

                var navbarCollapseNodeDiv = document.createElement('div');
                navbarCollapseNodeDiv.classList.add('navbar-collapse');
                navbarCollapseNodeDiv.classList.add('collapse');
                navbarCollapseNodeDiv.classList.add('in');
                navbarCollapseNodeDiv.id = 'content-navbar';

                var navbar1TextStrongNodeB = document.createElement('b');
                navbar1TextStrongNodeB.textContent = 'Installs:';

                var navbar1TextIconNodeI = document.createElement('i');
                navbar1TextIconNodeI.classList.add('fa');
                navbar1TextIconNodeI.classList.add('fa-fw');
                navbar1TextIconNodeI.classList.add('fa-signal');

                var navbar1TextNodeP = document.createElement('p');
                navbar1TextNodeP.classList.add('navbar-text');
                navbar1TextNodeP.classList.add('visible-xs');

                var navbarBrandNodeDiv = document.createElement('div');
                navbarBrandNodeDiv.classList.add('navbar-brand');
                navbarBrandNodeDiv.classList.add('visible-xs');

                var navbarToggleIconNodeI = document.createElement('i');
                navbarToggleIconNodeI.classList.add('fa');
                navbarToggleIconNodeI.classList.add('fa-bars');

                var navbarToggleNodeButton = document.createElement('button');
                navbarToggleNodeButton.type = 'button';
                navbarToggleNodeButton.setAttribute('data-toggle', 'collapse');
                navbarToggleNodeButton.setAttribute('data-target', '#content-navbar');
                navbarToggleNodeButton.classList.add('navbar-toggle');

                var navbarHeaderNodeDiv = document.createElement('div');
                navbarHeaderNodeDiv.classList.add('navbar-header');

                var navbarNodeNav = document.createElement('nav');
                navbarNodeNav.classList.add('navbar');
                navbarNodeNav.classList.add('navbar-default');
                navbarNodeNav.classList.add('navbar-static-top');
                navbarNodeNav.setAttribute('role', 'navigation'); // Watchpoint

                // Piece elements together
                navbarNodeNav.appendChild(navbarHeaderNodeDiv);
                navbarHeaderNodeDiv.appendChild(navbarToggleNodeButton);
                navbarToggleNodeButton.appendChild(navbarToggleIconNodeI);
                navbarHeaderNodeDiv.appendChild(navbarBrandNodeDiv);
                navbarHeaderNodeDiv.appendChild(navbar1TextNodeP);
                navbar1TextNodeP.appendChild(navbar1TextIconNodeI);
                navbar1TextNodeP.appendChild(navbar1TextStrongNodeB);
                navbar1TextNodeP.appendChild(document.createTextNode(' n/a'));

                navbarNodeNav.appendChild(navbarCollapseNodeDiv);
                navbarCollapseNodeDiv.appendChild(navNodeUl);
                navNodeUl.appendChild(navNodeLi1);
                navNodeLi1.appendChild(navNodeA1);
                navNodeUl.appendChild(navNodeLi2);
                navNodeLi2.appendChild(navNodeA2);
                navNodeUl.appendChild(navNodeLi3);
                navNodeLi3.appendChild(navNodeA3);
                navNodeUl.appendChild(navNodeLi4);
                navNodeLi4.appendChild(navNodeA4);
                navNodeA4.appendChild(navNodeA4Span4);

                navbarCollapseNodeDiv.appendChild(navbar2TextNodeP);

                navbar2TextNodeP.appendChild(navbar2TextIconNodeI);
                navbar2TextNodeP.appendChild(navbar2TextStrongNodeB);
                navbar2TextNodeP.appendChild(document.createTextNode(' n/a'));

                // Simulate the page-heading
                var scriptNameNodeA = document.createElement('a');
                scriptNameNodeA.classList.add('script-name');
                scriptNameNodeA.href = '/scripts/' + userName + '/' + scriptName;
                scriptNameNodeA.textContent = scriptNameX;

                var pathDividerNodeSpan = document.createElement('span');
                pathDividerNodeSpan.classList.add('path-divider');
                pathDividerNodeSpan.textContent = "/";

                var scriptAuthorNodeA = document.createElement('a');
                scriptAuthorNodeA.classList.add('script-author');
                scriptAuthorNodeA.href = '/users/' + userName;
                scriptAuthorNodeA.textContent = userName;

                var atIcon = lastValueOf(mb, "icon");

                if (atIcon) {
                  var scriptIconNodeImg = document.createElement('img');
                  scriptIconNodeImg.src = atIcon;
                  scriptIconNodeImg.alt = '';
                }

                var pageHeadingIconNodeSpan = document.createElement('span');
                pageHeadingIconNodeSpan.classList.add('page-heading-icon');

                var pageHeadingNodeH2 = document.createElement('h2');
                pageHeadingNodeH2.classList.add('page-heading');

                // Piece elements together
                if (atIcon) {
                  pageHeadingIconNodeSpan.appendChild(scriptIconNodeImg);
                  pageHeadingNodeH2.appendChild(pageHeadingIconNodeSpan)
                }
                pageHeadingNodeH2.appendChild(document.createTextNode(' '));
                pageHeadingNodeH2.appendChild(scriptAuthorNodeA);
                pageHeadingNodeH2.appendChild(document.createTextNode(' '));
                pageHeadingNodeH2.appendChild(pathDividerNodeSpan);
                pageHeadingNodeH2.appendChild(document.createTextNode(' '));
                pageHeadingNodeH2.appendChild(scriptNameNodeA);

                // Place parts into the DOM
                panelBodyNode.parentNode.parentNode.insertBefore(pageHeadingNodeH2, panelBodyNode.parentNode);
                panelBodyNode.parentNode.parentNode.insertBefore(navbarNodeNav, panelBodyNode.parentNode);

                hookNode.appendChild(mdbNodePre);
                hookNode.appendChild(objNodePre);

                // Clean up
                hookNode.removeChild(NodeDiv);

                // Activate Ace
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
        };
        req.send();
      }
    }
    else {
      var sourceNode = document.querySelector('#content-navbar ul.nav li a[href$="/source"]');
      if (sourceNode) {
        hookNode = sourceNode.parentNode.parentNode;

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
