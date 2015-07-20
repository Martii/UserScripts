(function() {
  'use strict';

// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a script navigation link next to `Source Code` titled `Meta` and opens a phantom url to show the detected metadata
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       3.0.0.0rc4
// @icon          https://www.gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?r=G&s=48&default=identicon

// @homepageURL  https://github.com/Martii/UserScripts/tree/master/src/oujs/Meta%20View
// @homepageURL  https://openuserjs.org/scripts/marti/oujs_-_Meta_View
// @supportURL   https://openuserjs.org/scripts/marti/oujs_-_Meta_View/issues

// @include  /^https?://openuserjs\.org(?::\d{1,5})?/scripts//
// @include  /^http://localhost(?::\d{1,5})?/scripts//

// @include  https://openuserjs.org/scripts/*/*
// @include  http://localhost:8080/scripts/*/*

// @grant none

// Note some older browsers can't handle this dependency in a .user.js
// @require https://github.com/pegjs/pegjs/releases/download/v0.8.0/peg-0.8.0.min.js

// ==/UserScript==

  /*
   * PREFERENCES
   */
  var useFullScriptSource = false;

  /*
   *
   */
  function parserMeta(aParser, aString) {
    var rLine = /\/\/ @(\S+)(?:\s+(.*))?/;
    var line = null;
    var lines = {};
    var header = null;
    var key = null;
    var keyword = null;
    var unique = null;
    var headers = {};
    var i = null;
    var thisHeader = null;

    lines = aString.split(/[\r\n]+/).filter(function (aElement, aIndex, aArray) {
      return (aElement.match(rLine));
    });

    for (line in lines) {
      try {
        header = aParser.parse(lines[line], { startRule: 'line' });
      } catch (aE) {
        // Ignore anything not understood
        header = null;
      }

      if (header) {
        key = header.key;
        keyword = header.keyword;
        unique = header.unique;

        delete header.key;
        delete header.unique;

        // Create if doesn't exist
        if (!headers[key])
          headers[key] = [];

        // Check for unique
        if (unique)
          for (i = 0; thisHeader = headers[key][i]; ++i)
            if ((thisHeader.keyword || thisHeader.key) === (header.keyword || header.key))
              headers[key].splice(i, 1);

        headers[key].push(header);
      }
    }

    return headers;
  }

  /**
   *
   */

  var matches = location.pathname.match(/^\/scripts\/(.*?)\/(.*?)(?:$|\/)/);
  if (matches) {
    var
        userName = matches[1],
        scriptName = matches[2]
    ;

    var hookNode;
    if (/\/meta$/.test(location.pathname)) { // NOTE: Currently a 404 page
      var NodeScript = document.createElement('script'); // Watchpoint
      NodeScript.setAttribute('src', '/redist/npm/ace-builds/src/ace.js');
      NodeScript.setAttribute('type', 'text/javascript');
      NodeScript.setAttribute('charset', 'UTF-8');

      var bodyNode = document.querySelector('body');
      bodyNode.appendChild(NodeScript);

      var panelBodyNode = document.querySelector('div.panel-body');
      if (panelBodyNode && panelBodyNode.firstChild.nextSibling.textContent == '404') {

        var titleNode = document.head.querySelector('title');
        if (titleNode)
          titleNode.textContent = 'Meta ' + scriptName + '| OpenUserJS';

        hookNode = panelBodyNode.parentNode;

        // Reset content
        while (hookNode.hasChildNodes())
          hookNode.removeChild(hookNode.firstChild);

        hookNode.classList.remove('panel-default');
        hookNode.classList.remove('panel');
        hookNode.classList.add('panel-group');

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

        // Simulate the page-heading
        var scriptNameNodeA = document.createElement('a');
        scriptNameNodeA.classList.add('script-name');
        scriptNameNodeA.href = '/scripts/' + userName + '/' + scriptName;
        scriptNameNodeA.textContent = '\u2003';

        var pathDividerNodeSpan = document.createElement('span');
        pathDividerNodeSpan.classList.add('path-divider');
        pathDividerNodeSpan.textContent = '\u2003';

        var scriptAuthorNodeA = document.createElement('a');
        scriptAuthorNodeA.classList.add('script-author');
        scriptAuthorNodeA.href = '/users/' + userName;
        scriptAuthorNodeA.textContent = '\u2003';

        var pageHeadingNodeH2 = document.createElement('h2');
        pageHeadingNodeH2.classList.add('page-heading');

        // Piece elements together
        pageHeadingNodeH2.appendChild(document.createTextNode(' '));
        pageHeadingNodeH2.appendChild(scriptAuthorNodeA);
        pageHeadingNodeH2.appendChild(document.createTextNode(' '));
        pageHeadingNodeH2.appendChild(pathDividerNodeSpan);
        pageHeadingNodeH2.appendChild(document.createTextNode(' '));
        pageHeadingNodeH2.appendChild(scriptNameNodeA);

        // Place parts into the DOM
        hookNode.parentNode.insertBefore(navbarNodeNav, hookNode.parentNode.firstChild);
        hookNode.parentNode.insertBefore(pageHeadingNodeH2, hookNode.parentNode.firstChild);

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
        if (!useFullScriptSource) {
          req.setRequestHeader('Accept', 'text/x-userscript-meta');
        }

        req.onreadystatechange = function () {
          function hasCalc(aPrefix) {
            aPrefix = aPrefix || '';
            var el = document.createElement('div');
            el.style.setProperty(aPrefix + 'width', 'calc(1px)', '');
            return !!el.style.length;
          }

          function hasAnyCalc() {
            return hasCalc('-moz-') || hasCalc('-ms-') || hasCalc('-o-') || hasCalc('-webkit-') || hasCalc();
          }

          function calcHeight() {
            return parseInt((window.innerHeight - 303) / 2.004);
          }

          if (this.readyState == this.DONE) {
            console.log(
              [
                'META VIEW REQUEST SUMMARY',
                '',
                'status: ' + this.status,
                'statusText: ' + this.statusText,
                'readyState: ' + this.readyState,
                'responseHeaders: ' + this.responseHeaders,
                'finalUrl: ' + this.finalUrl

              ].join('\n')
            );

            switch (this.status) {
              case 200:
                if (!this.responseText) {
                  NodeDiv.classList.remove('alert-warning');
                  NodeDiv.classList.add('alert-danger');
                  NodeStrong.textContent = "FAILURE: ";
                  NodeText.textContent = "Unable to retrieve the metadata block. `responseText` is absent.";
                  return;
                }

                var responseTextUserScript = this.responseText.match(/^(\/\/ ==UserScript==[\s\S]*?^\/\/ ==\/UserScript==)/m)[1].trim();
                var responseTextOpenUserJS = null;
                if (this.responseText.match(/^(\/\/ ==OpenUserJS==[\s\S]*?^\/\/ ==\/OpenUserJS==)/m)) {
                  responseTextOpenUserJS = this.responseText.match(/^(\/\/ ==OpenUserJS==[\s\S]*?^\/\/ ==\/OpenUserJS==)/m)[1].trim();
                } else {
                  responseTextOpenUserJS = '// ==OpenUserJS==\n// ==/OpenUserJS==';
                }


                NodeText.textContent = ": Fetching the grammar files";

                var req = new XMLHttpRequest();
                req.open('GET', '/pegjs/blockUserScript.pegjs');

                req.onreadystatechange = function () {
                  if (this.readyState == this.DONE) {
                    switch (this.status) {
                      case 200:
                        if (!this.responseText) {
                          NodeDiv.classList.remove('alert-warning');
                          NodeDiv.classList.add('alert-danger');
                          NodeStrong.textContent = "FAILURE: ";
                          NodeText.textContent = "Unable to parse the metadata blocks. `responseText` is absent for UserScript.";
                          return;
                        }

                      var pegUserScriptGrammar = this.responseText;

                      var req = new XMLHttpRequest();
                      req.open('GET', '/pegjs/blockOpenUserJS.pegjs');

                      req.onreadystatechange = function () {
                        if (this.readyState == this.DONE) {
                          switch (this.status) {
                            case 200:
                              if (!this.responseText) {
                                NodeDiv.classList.remove('alert-warning');
                                NodeDiv.classList.add('alert-danger');
                                NodeStrong.textContent = "FAILURE: ";
                                NodeText.textContent = "Unable to parse the metadata blocks. `responseText` is absent for OpenUserJS.";
                                return;
                              }

                            var pegOpenUserJSGrammar = this.responseText;

                            NodeText.textContent = ": Parsing Objects";

                            // Parse peg grammar to standard
                            var parserUserScript = PEG.buildParser(pegUserScriptGrammar, { allowedStartRules: ['line'] });
                            var parserOpenUserJS = PEG.buildParser(pegOpenUserJSGrammar, { allowedStartRules: ['line'] });

                            // Reparse the respective responseText
                            var UserScript = parserMeta(parserUserScript, responseTextUserScript);
                            var OpenUserJS = {};
                            if (responseTextOpenUserJS) {
                              OpenUserJS = parserMeta(parserOpenUserJS, responseTextOpenUserJS);
                            }


                            NodeText.textContent = ": Simulating Source Code page";

                            // Simulate a Source Code page
                            var NodeStyle = document.createElement('style');
                            NodeStyle.setAttribute('type', 'text/css');
                            var min_height = 52;
                            NodeStyle.textContent =
                              [
                                '#mdb { min-height: 115px; }',
                                '#peg { min-height: 200px; min-height: -moz-calc(' + min_height + 'vh); min-height: -o-calc(' + min_height + 'vh); min-height: -webkit-calc(' + min_height + 'vh); min-height: calc(' + min_height + 'vh); }',
                                '.path-divider { color: #666; margin: 0 0.25em; }'

                              ].join('\n')
                            ;
                            document.head.appendChild(NodeStyle);

                            // Fix title to be native
                            var scriptNameX = null;
                            UserScript['name'].forEach(function (e, i, a) {
                              if (!e.locale) { // Default to absent locale... requirement of OUJS to have `@name`
                                scriptNameX = e.value;
                              }
                            });

                            titleNode.textContent = 'Meta ' + scriptNameX + '| OpenUserJS';

                            // Create meta views
                            var pegNodePre = document.createElement('pre');
                            pegNodePre.classList.add('ace_editor');
                            pegNodePre.classList.add('ace-dawn');
                            pegNodePre.id = 'peg';
                            pegNodePre.textContent = JSON.stringify({ UserScript, OpenUserJS }, null, ' ');

                            var mdbNodePre = document.createElement('pre');
                            mdbNodePre.classList.add('ace_editor');
                            mdbNodePre.classList.add('ace-dawn');
                            mdbNodePre.id = 'mdb';
                            mdbNodePre.textContent = responseTextUserScript + (responseTextOpenUserJS ? '\n\n' + responseTextOpenUserJS : '');

                            var atIcon = UserScript['icon'];
                            if (atIcon) {
                              atIcon = UserScript['icon'][0].value;

                              var pageHeadingIconNodeSpan = document.createElement('span');
                              pageHeadingIconNodeSpan.classList.add('page-heading-icon');
                              pageHeadingIconNodeSpan.setAttribute('data-icon-src', atIcon);

                              var pageHeadingIconNodeI = document.createElement('i');
                              pageHeadingIconNodeI.classList.add('fa');
                              pageHeadingIconNodeI.classList.add('fa-fw');
                              pageHeadingIconNodeI.classList.add('fa-file-code-o');

                              pageHeadingNodeH2.insertBefore(pageHeadingIconNodeSpan, pageHeadingNodeH2.firstChild);
                              pageHeadingIconNodeSpan.appendChild(pageHeadingIconNodeI);

                              var scriptIconNodeImg = document.createElement('img');
                              scriptIconNodeImg.addEventListener('load', function () {
                                pageHeadingIconNodeSpan.removeChild(pageHeadingIconNodeI);
                                pageHeadingIconNodeSpan.appendChild(scriptIconNodeImg);
                              });
                              scriptIconNodeImg.src = atIcon;
                            }

                            scriptAuthorNodeA.textContent = userName;
                            pathDividerNodeSpan.textContent = "/";
                            scriptNameNodeA.textContent = scriptNameX;

                            navNodeA4Span4.textContent = 'n/a';
                            navbar1TextNodeP.appendChild(document.createTextNode(' n/a'));
                            navbar2TextNodeP.appendChild(document.createTextNode(' n/a'));


                            hookNode.appendChild(mdbNodePre);
                            hookNode.appendChild(pegNodePre);

                            // Clean up
                            hookNode.removeChild(NodeDiv);

                            // Resize for older browsers
                            if (!hasAnyCalc()) {
                              mdbNodePre.style.setProperty('height', calcHeight() + 'px', '');
                              pegNodePre.style.setProperty('height', calcHeight() + 'px', '');
                              document.addEventListener('resize', function () {
                                mdbNodePre.style.setProperty('height', calcHeight() + 'px', '');
                                pegNodePre.style.setProperty('height', calcHeight() + 'px', '');
                              });
                            }

                            // Activate Ace
                            var mdb = ace.edit('mdb');
                            mdb.setTheme('ace/theme/dawn');
                            mdb.getSession().setMode('ace/mode/javascript');
                            mdb.setReadOnly(true);

                            var peg = ace.edit('peg');
                            peg.setTheme('ace/theme/dawn');
                            peg.getSession().setMode('ace/mode/javascript');
                            peg.setReadOnly(true);

                            if (useFullScriptSource) {
                              var ace_gutterLayer = document.querySelector('.ace_gutter-layer');
                              if (ace_gutterLayer)
                                ace_gutterLayer.classList.add('btn-warning');
                            }

                          }
                        }
                      };
                      req.send();
                    }
                  }
                };
                req.send();

                break;
              default:
                NodeDiv.classList.remove('alert-warning');
                NodeDiv.classList.add('alert-danger');

                NodeStrong.textContent = 'ERROR';
                NodeText.textContent = ': Unable to fetch the metadata blocks with status of: ' + this.status;

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
