(function() {
  'use strict';

// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a script navigation link next to `Source Code` titled `Meta` and opens a phantom url to show the detected metadata
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       4.0.3.0
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

        var NodeText = document.createTextNode(': Fetching the meta.js');

        NodeDiv.appendChild(NodeStrong);
        NodeDiv.appendChild(NodeText);

        hookNode.appendChild(NodeDiv);

        var url = '/src/scripts/' + userName + '/' + scriptName + '.user.js';

        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.setRequestHeader('Accept', 'text/x-userscript-meta');

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
                  NodeText.textContent = "Unable to retrieve the meta text. `responseText` is absent.";
                  return;
                }

                var responseTextMetaJS = this.responseText.trim();

                NodeText.textContent = ": Fetching the meta.json";

                url = '/meta/' + userName + '/' + scriptName + '.meta.json';

                var req = new XMLHttpRequest();
                req.open('GET', url);

                req.onreadystatechange = function () {
                  if (this.readyState == this.DONE) {
                    switch (this.status) {
                      case 200:
                        if (!this.responseText) {
                          NodeDiv.classList.remove('alert-warning');
                          NodeDiv.classList.add('alert-danger');
                          NodeStrong.textContent = "FAILURE: ";
                          NodeText.textContent = "Unable to retrieve the meta JSON. `responseText` is absent.";
                          return;
                        }

                        var responseTextMetaJSON = this.responseText;

                        var meta = JSON.parse(responseTextMetaJSON);

                        NodeText.textContent = ": Simulating Source Code page";

                        // Simulate a Source Code page
                        var NodeStyle = document.createElement('style');
                        NodeStyle.setAttribute('type', 'text/css');
                        var min_height = 32.30;
                        var textSVGMetaJS = 'data:image/svg+xml;base64,' +
                          'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0' +
                          'dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMj' +
                          'IgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0i' +
                          'aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmlld0Jv' +
                          'eD0iMCAtMjAwIDE0LjQ4MjEwOCA1Mi4xMjQ2ODIiCiAgIHZlcnNpb249IjEuMSIKICAgaGVpZ2h0PSI1Mi4xMjQ2ODMiCiAgIHdp' +
                          'ZHRoPSIxNC40ODIxMDgiPgogIDxnPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2MiCiAgICAgICBkPSJtIDku' +
                          'NjY4MjM0NiwtMTUwLjIzNTY1IHEgLTAuMzYwMzM2NCwtMC4zNjAzNCAtMC4zNjAzMzY0LC0wLjg3NTEgMCwtMC41MTQ3NyAwLjM2' +
                          'MDMzNjQsLTAuODc1MTEgMC4zNjAzMzY0LC0wLjM2MDM0IDAuODc1MTA0NCwtMC4zNjAzNCAwLjUxNDc2NiwwIDAuODc1MTAyLDAu' +
                          'MzYwMzQgMC4zNjAzMzgsMC4zNjAzNCAwLjM2MDMzOCwwLjg3NTExIDAsMC41MTQ3NiAtMC4zNjAzMzgsMC44NzUxIC0wLjM2MDMz' +
                          'NiwwLjM2MDM0IC0wLjg3NTEwMiwwLjM2MDM0IC0wLjUxNDc2OCwwIC0wLjg3NTEwNDQsLTAuMzYwMzQgeiIgLz4KICAgIDxwYXRo' +
                          'CiAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjIgogICAgICAgZD0ibSAzLjI0MDczNSwtMTYwLjgxNzc1IHEgMCwtMi4xMjc3IDIu' +
                          'MjY0OTc0NSwtMi4xMjc3IGwgNi4yODAxNTQ1LDAgMCwyLjI5OTI5IC02LjU1NDY5NzQsMCBxIC0wLjEzNzI3MDksMCAtMC4yNDAy' +
                          'MjQ3LDAuMDk0NCAtMC4xMDI5NTI2LDAuMDk0NCAtMC4xMDI5NTI2LDAuMjMxNjUgbCAwLDAuNzM3ODMgcSAwLDAuMTM3MjcgMC4x' +
                          'MDI5NTI2LDAuMjMxNjUgMC4xMDI5NTM4LDAuMDk0NCAwLjI0MDIyNDcsMC4wOTQ0IGwgNi41NTQ2OTc0LDAgMCwyLjI5OTI5IC02' +
                          'LjU1NDY5NzQsMCBxIC0wLjEzNzI3MDksMCAtMC4yNDAyMjQ3LDAuMDk0NCAtMC4xMDI5NTI2LDAuMDk0NCAtMC4xMDI5NTI2LDAu' +
                          'MjMxNjQgbCAwLDAuNzM3ODMgcSAwLDAuMTM3MjggMC4xMDI5NTI2LDAuMjMxNjUgMC4xMDI5NTM4LDAuMDk0NCAwLjI0MDIyNDcs' +
                          'MC4wOTQ0IGwgNi41NTQ2OTc0LDAgMCwyLjI5OTI5IC04LjM3MzUzOTgsMCAwLC0yLjA5MzM4IDAuNDI4OTcxOSwwIHEgLTAuNjAw' +
                          'NTYxMSwtMC41MzE5MyAtMC42MDA1NjExLC0xLjYxMjk0IGwgMCwtMC4xNTQ0MyBxIDAsLTEuMjY5NzUgMC43ODkzMDk1LC0xLjc2' +
                          'NzM2IC0wLjc4OTMwOTUsLTAuNTMxOTMgLTAuNzg5MzA5NSwtMS43NjczNyBsIDAsLTAuMTU0NDMgeiIgLz4KICAgIDxwYXRoCiAg' +
                          'ICAgICBzdHlsZT0iZmlsbDojY2NjY2NjIgogICAgICAgZD0ibSAzLjA1MDg4NDcsLTE2OC4xMDY5NiBxIDAsLTIuMTI3NyAyLjI2' +
                          'NDk3NDUsLTIuMTI3NyBsIDIuNzExMTA1NSwwIDAsMy44OTUwNyAxLjc1MDIwNjgsMCBxIDAuMTM3MjcwOSwwIDAuMjQwMjI0NSwt' +
                          'MC4wOTQ0IDAuMTAyOTUzLC0wLjA5NDQgMC4xMDI5NTMsLTAuMjMxNjUgbCAwLC0wLjk0Mzc0IHEgMCwtMC4xMzcyNyAtMC4xMDI5' +
                          'NTMsLTAuMjMxNjQgLTAuMTAyOTUzNiwtMC4wOTQ0IC0wLjI0MDIyNDUsLTAuMDk0NCBsIC0wLjkyNjU4MDMsMCAwLC0yLjI5OTI5' +
                          'IDAuNjUyMDM3NCwwIHEgMi4yNjQ5NzQ0LDAgMi4yNjQ5NzQ0LDIuMTI3NyBsIDAsMS45Mzg5NiBxIDAsMi4xMjc3IC0yLjI2NDk3' +
                          'NDQsMi4xMjc3IGwgLTQuMTg2NzY5NCwwIHEgLTIuMjY0OTc0NSwwIC0yLjI2NDk3NDUsLTIuMTI3NyBsIDAsLTEuOTM4OTYgeiBt' +
                          'IDMuNDY2MDk2NiwxLjc2NzM3IDAsLTEuNTk1NzggLTEuNTQ0MzAwNiwwIHEgLTAuMTM3MjcwOSwwIC0wLjI0MDIyNDYsMC4wOTQ0' +
                          'IC0wLjEwMjk1MzgsMC4wOTQ0IC0wLjEwMjk1MzgsMC4yMzE2NCBsIDAsMC45NDM3NCBxIDAsMC4xMzcyNyAwLjEwMjk1MzgsMC4y' +
                          'MzE2NSAwLjEwMjk1MzcsMC4wOTQ0IDAuMjQwMjI0NiwwLjA5NDQgbCAxLjU0NDMwMDYsMCB6IiAvPgogICAgPHBhdGgKICAgICAg' +
                          'IHN0eWxlPSJmaWxsOiNjY2NjY2MiCiAgICAgICBkPSJtIDEwLjI4Nzg5MywtMTc0LjU5NjM2IDAsLTAuNjg2MzYgMS40OTI4MjMs' +
                          'MCAwLDEuNjEyOTQgcSAwLDIuMTI3NyAtMi4yNjQ5NzMzLDIuMTI3NyBsIC04LjA5ODk5OTQsMCAwLC0yLjI5OTI5IDEuODE4ODQz' +
                          'NSwwIDAsLTEuNDQxMzUgMS42NjQ0MTIzLDAgMCwxLjQ0MTM1IDQuNTY0MjY2MSwwIHEgMC40ODA0NDkzLDAgMC42NTIwMzg4LC0w' +
                          'LjE4ODc1IDAuMTcxNTg5LC0wLjE4ODc1IDAuMTcxNTg5LC0wLjU2NjI0IHoiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImZp' +
                          'bGw6I2NjY2NjYyIKICAgICAgIGQ9Im0gMy4yMzYyMzIxLC0xODAuOTA2NDcgMCwtMS45Mzg5NSA4LjM3MzU0MDksMCAwLDEuOTM4' +
                          'OTUgLTAuNjE3NzIsMCBxIDAuNzg5MzA5LDAuNTMxOTMgMC43ODkzMDksMS43NjczNyBsIDAsMC4zNjAzNCBxIDAsMi4xMjc3IC0y' +
                          'LjI2NDk3NCwyLjEyNzcgbCAtNC4xODY3NzA2LDAgcSAtMi4yNjQ5NzQ1LDAgLTIuMjY0OTc0NSwtMi4xMjc3IGwgMCwtMC4zNjAz' +
                          'NCBxIDAsLTEuMjM1NDQgMC43ODkzMDk0LC0xLjc2NzM3IGwgLTAuNjE3NzIwMiwwIHogbSA2LjU1NDY5NzcsMC4zNjAzNCAtNC43' +
                          'MzU4NTU0LDAgcSAtMC4xMzcyNzA5LDAgLTAuMjQwMjI0NiwwLjA5NDQgLTAuMTAyOTUyNiwwLjA5NDQgLTAuMTAyOTUyNiwwLjIz' +
                          'MTY1IGwgMCwwLjk0Mzc0IHEgMCwwLjEzNzI3IDAuMTAyOTUyNiwwLjIzMTY0IDAuMTAyOTUzNywwLjA5NDQgMC4yNDAyMjQ2LDAu' +
                          'MDk0NCBsIDQuNzM1ODU1NCwwIHEgMC4xMzcyNzIsMCAwLjI0MDIyNDIsLTAuMDk0NCAwLjEwMjk1NCwtMC4wOTQ0IDAuMTAyOTU0' +
                          'LC0wLjIzMTY0IGwgMCwtMC45NDM3NCBxIDAsLTAuMTM3MjcgLTAuMTAyOTU0LC0wLjIzMTY1IC0wLjEwMjk1MjIsLTAuMDk0NCAt' +
                          'MC4yNDAyMjQyLC0wLjA5NDQgeiIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjIgogICAgICAgZD0ibSA5' +
                          'LjY3MjEwOTgsLTE4NC4zNTg2NiBxIC0wLjM2MDMzNzYsLTAuMzYwMzMgLTAuMzYwMzM3NiwtMC44NzUxIDAsLTAuNTE0NzcgMC4z' +
                          'NjAzMzc2LC0wLjg3NTEgMC4zNjAzMzYyLC0wLjM2MDM0IDAuODc1MTA0MiwtMC4zNjAzNCAwLjUxNDc2NiwwIDAuODc1MTAzLDAu' +
                          'MzYwMzQgMC4zNjAzMzcsMC4zNjAzMyAwLjM2MDMzNywwLjg3NTEgMCwwLjUxNDc3IC0wLjM2MDMzNywwLjg3NTEgLTAuMzYwMzM3' +
                          'LDAuMzYwMzQgLTAuODc1MTAzLDAuMzYwMzQgLTAuNTE0NzY4LDAgLTAuODc1MTA0MiwtMC4zNjAzNCB6IiAvPgogICAgPHBhdGgK' +
                          'ICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2MiCiAgICAgICBkPSJtIDExLjk3NjkwOSwtMTg4LjI1ODA0IC04Ljc2ODE5NDUsMCAw' +
                          'LC0yLjI5OTI5IDkuMDA4NDE5NSwwIHEgMi4yNjQ5NzQsMCAyLjI2NDk3NCwyLjEyNzcgbCAwLDEuMzg5ODcgLTEuNjgxNTcxLDAg' +
                          'MCwtMC40NjMyOSBxIDAsLTAuMzc3NSAtMC4xNzE1ODksLTAuNTY2MjQgLTAuMTcxNTksLTAuMTg4NzUgLTAuNjUyMDM5LC0wLjE4' +
                          'ODc1IHogbSAtOS40NTQ1NTE0LC0xLjE0OTY1IHEgMCwwLjUxNDc3IC0wLjM2ODkxNiwwLjg5MjI2IC0wLjM2ODkxNTksMC4zNzc1' +
                          'IC0wLjg5MjI2MiwwLjM3NzUgLTAuNTIzMzQ3MTYsMCAtMC44OTIyNjMxNCwtMC4zNzc1IFEgNC44MTE4ODVlLTcsLTE4OC44OTI5' +
                          'MiA0LjgxMTg4NWUtNywtMTg5LjQwNzY5IHEgMCwtMC41MTQ3NyAwLjM2ODkxNTk3ODgxMTUsLTAuODgzNjggMC4zNjg5MTU5OCwt' +
                          'MC4zNjg5MiAwLjkwMDg0Mjc0LC0wLjM2ODkyIDAuNTMxOTI1NiwwIDAuODkyMjYyLDAuMzY4OTIgMC4zNjAzMzY0LDAuMzY4OTEg' +
                          'MC4zNjAzMzY0LDAuODgzNjggeiIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjIgogICAgICAgZD0ibSA2' +
                          'LjMyNDc1MTIsLTE5NS44NzIzIHEgMCwtMi4xMjc3IDIuMjY0OTc0NSwtMi4xMjc3IGwgMC44OTIyNjMyLDAgcSAyLjI2NDk3NDEs' +
                          'MCAyLjI2NDk3NDEsMi4xMjc3IGwgMCwxLjkwNDY0IHEgMCwyLjEyNzcxIC0yLjI2NDk3NDEsMi4xMjc3MSBsIC0wLjUzMTkyNTYs' +
                          'MCAwLC0yLjEyNzcxIDAuNzU0OTkxMSwwIHEgMC4xMzcyNzA5LDAgMC4yNDAyMjQ2LC0wLjA5NDQgMC4xMDI5NTQsLTAuMDk0NCAw' +
                          'LjEwMjk1NCwtMC4yMzE2NSBsIDAsLTEuNDA3MDMgcSAwLC0wLjEzNzI3IC0wLjEwMjk1NCwtMC4yMzE2NCAtMC4xMDI5NTM3LC0w' +
                          'LjA5NDQgLTAuMjQwMjI0NiwtMC4wOTQ0IGwgLTEuMDI5NTM0MSwwIHEgLTAuMTM3MjcwOSwwIC0wLjI0MDIyNDcsMC4wOTQ0IC0w' +
                          'LjEwMjk1MzcsMC4wOTQ0IC0wLjEwMjk1MzcsMC4yMzE2NCBsIDAsMS43NjczNyBxIDAsMi4xMjc3IC0yLjI2NDk3MzQsMi4xMjc3' +
                          'IGwgLTAuNzcyMTUwMiwwIHEgLTIuMjY0OTc0NSwwIC0yLjI2NDk3NDUsLTIuMTI3NyBsIDAsLTEuODAxNjggcSAwLC0yLjEyNzcx' +
                          'IDIuMjY0OTc0NSwtMi4xMjc3MSBsIDAuMzA4ODYwMSwwIDAsMi4xMjc3MSAtMC41MzE5MjY4LDAgcSAtMC4xMzcyNzA5LDAgLTAu' +
                          'MjQwMjIzNSwwLjA5NDQgLTAuMTAyOTUzNywwLjA5NDQgLTAuMTAyOTUzNywwLjIzMTY1IGwgMCwxLjMwNDA3IHEgMCwwLjEzNzI3' +
                          'IDAuMTAyOTUzNywwLjIzMTY1IDAuMTAyOTUyNiwwLjA5NDQgMC4yNDAyMjM1LDAuMDk0NCBsIDAuOTA5NDIyMywwIHEgMC4xMzcy' +
                          'NzA5LDAgMC4yNDAyMjQ3LC0wLjA5NDQgMC4xMDI5NTI2LC0wLjA5NDQgMC4xMDI5NTI2LC0wLjIzMTY1IGwgMCwtMS43NjczNyB6' +
                          'IiAvPgogIDwvZz4KPC9zdmc+Cg==';

                        var textSVGMetaJSON = 'data:image/svg+xml;base64,' +
                          'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0' +
                          'dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMj' +
                          'IgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0i' +
                          'aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmlld0Jv' +
                          'eD0iMCAtMjAwIDE0LjQ4MjExIDY2LjA4NTAzNSIKICAgdmVyc2lvbj0iMS4xIgogICBoZWlnaHQ9IjY2LjA4NTAzNyIKICAgd2lk' +
                          'dGg9IjE0LjQ4MjExIj4KICA8Zz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjIgogICAgICAgZD0ibSA5LjY2' +
                          'ODIzLC0xMzYuMjc1MyBxIC0wLjM2MDMzLC0wLjM2MDM0IC0wLjM2MDMzLC0wLjg3NTEgMCwtMC41MTQ3NyAwLjM2MDMzLC0wLjg3' +
                          'NTExIDAuMzYwMzQsLTAuMzYwMzQgMC44NzUxMSwtMC4zNjAzNCAwLjUxNDc2LDAgMC44NzUxLDAuMzYwMzQgMC4zNjAzNCwwLjM2' +
                          'MDM0IDAuMzYwMzQsMC44NzUxMSAwLDAuNTE0NzYgLTAuMzYwMzQsMC44NzUxIC0wLjM2MDM0LDAuMzYwMzQgLTAuODc1MSwwLjM2' +
                          'MDM0IC0wLjUxNDc3LDAgLTAuODc1MTEsLTAuMzYwMzQgeiIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojY2NjY2Nj' +
                          'IgogICAgICAgZD0ibSAzLjI0MDczLC0xNDYuODU3NCBxIDAsLTIuMTI3NyAyLjI2NDk4LC0yLjEyNzcgbCA2LjI4MDE1LDAgMCwy' +
                          'LjI5OTI5IC02LjU1NDcsMCBxIC0wLjEzNzI3LDAgLTAuMjQwMjIsMC4wOTQ0IC0wLjEwMjk1LDAuMDk0NCAtMC4xMDI5NSwwLjIz' +
                          'MTY1IGwgMCwwLjczNzgzIHEgMCwwLjEzNzI3IDAuMTAyOTUsMC4yMzE2NSAwLjEwMjk1LDAuMDk0NCAwLjI0MDIyLDAuMDk0NCBs' +
                          'IDYuNTU0NywwIDAsMi4yOTkyOSAtNi41NTQ3LDAgcSAtMC4xMzcyNywwIC0wLjI0MDIyLDAuMDk0NCAtMC4xMDI5NSwwLjA5NDQg' +
                          'LTAuMTAyOTUsMC4yMzE2NCBsIDAsMC43Mzc4MyBxIDAsMC4xMzcyOCAwLjEwMjk1LDAuMjMxNjUgMC4xMDI5NSwwLjA5NDQgMC4y' +
                          'NDAyMiwwLjA5NDQgbCA2LjU1NDcsMCAwLDIuMjk5MjkgLTguMzczNTQsMCAwLC0yLjA5MzM4IDAuNDI4OTcsMCBxIC0wLjYwMDU2' +
                          'LC0wLjUzMTkzIC0wLjYwMDU2LC0xLjYxMjk0IGwgMCwtMC4xNTQ0MyBxIDAsLTEuMjY5NzUgMC43ODkzMSwtMS43NjczNiAtMC43' +
                          'ODkzMSwtMC41MzE5MyAtMC43ODkzMSwtMS43NjczNyBsIDAsLTAuMTU0NDMgeiIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0i' +
                          'ZmlsbDojY2NjY2NjIgogICAgICAgZD0ibSAzLjA1MDg4LC0xNTQuMTQ2NiBxIDAsLTIuMTI3NzEgMi4yNjQ5OCwtMi4xMjc3MSBs' +
                          'IDIuNzExMSwwIDAsMy44OTUwNyAxLjc1MDIxLDAgcSAwLjEzNzI3LDAgMC4yNDAyMiwtMC4wOTQ0IDAuMTAyOTYsLTAuMDk0NCAw' +
                          'LjEwMjk2LC0wLjIzMTY0IGwgMCwtMC45NDM3NCBxIDAsLTAuMTM3MjcgLTAuMTAyOTYsLTAuMjMxNjUgLTAuMTAyOTUsLTAuMDk0' +
                          'NCAtMC4yNDAyMiwtMC4wOTQ0IGwgLTAuOTI2NTgsMCAwLC0yLjI5OTI5IDAuNjUyMDQsMCBxIDIuMjY0OTcsMCAyLjI2NDk3LDIu' +
                          'MTI3NyBsIDAsMS45Mzg5NiBxIDAsMi4xMjc3IC0yLjI2NDk3LDIuMTI3NyBsIC00LjE4Njc3LDAgcSAtMi4yNjQ5OCwwIC0yLjI2' +
                          'NDk4LC0yLjEyNzcgbCAwLC0xLjkzODk2IHogbSAzLjQ2NjEsMS43NjczNiAwLC0xLjU5NTc4IC0xLjU0NDMsMCBxIC0wLjEzNzI3' +
                          'LDAgLTAuMjQwMjMsMC4wOTQ0IC0wLjEwMjk1LDAuMDk0NCAtMC4xMDI5NSwwLjIzMTY1IGwgMCwwLjk0Mzc0IHEgMCwwLjEzNzI3' +
                          'IDAuMTAyOTUsMC4yMzE2NSAwLjEwMjk2LDAuMDk0NCAwLjI0MDIzLDAuMDk0NCBsIDEuNTQ0MywwIHoiIC8+CiAgICA8cGF0aAog' +
                          'ICAgICAgc3R5bGU9ImZpbGw6I2NjY2NjYyIKICAgICAgIGQ9Im0gMTAuMjg3ODksLTE2MC42MzYwMSAwLC0wLjY4NjM2IDEuNDky' +
                          'ODIsMCAwLDEuNjEyOTQgcSAwLDIuMTI3NyAtMi4yNjQ5NywyLjEyNzcgbCAtOC4wOTksMCAwLC0yLjI5OTI5IDEuODE4ODQsMCAw' +
                          'LC0xLjQ0MTM1IDEuNjY0NDIsMCAwLDEuNDQxMzUgNC41NjQyNiwwIHEgMC40ODA0NSwwIDAuNjUyMDQsLTAuMTg4NzUgMC4xNzE1' +
                          'OSwtMC4xODg3NSAwLjE3MTU5LC0wLjU2NjI0IHoiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9ImZpbGw6I2NjY2NjYyIKICAg' +
                          'ICAgIGQ9Im0gMy4yMzYyMywtMTY2Ljk0NjEyIDAsLTEuOTM4OTUgOC4zNzM1NCwwIDAsMS45Mzg5NSAtMC42MTc3MiwwIHEgMC43' +
                          'ODkzMSwwLjUzMTkzIDAuNzg5MzEsMS43NjczNyBsIDAsMC4zNjAzNCBxIDAsMi4xMjc3IC0yLjI2NDk4LDIuMTI3NyBsIC00LjE4' +
                          'Njc3LDAgcSAtMi4yNjQ5NywwIC0yLjI2NDk3LC0yLjEyNzcgbCAwLC0wLjM2MDM0IHEgMCwtMS4yMzU0NCAwLjc4OTMxLC0xLjc2' +
                          'NzM3IGwgLTAuNjE3NzIsMCB6IG0gNi41NTQ3LDAuMzYwMzQgLTQuNzM1ODYsMCBxIC0wLjEzNzI3LDAgLTAuMjQwMjIsMC4wOTQ0' +
                          'IC0wLjEwMjk2LDAuMDk0NCAtMC4xMDI5NiwwLjIzMTY1IGwgMCwwLjk0Mzc0IHEgMCwwLjEzNzI3IDAuMTAyOTYsMC4yMzE2NCAw' +
                          'LjEwMjk1LDAuMDk0NCAwLjI0MDIyLDAuMDk0NCBsIDQuNzM1ODYsMCBxIDAuMTM3MjcsMCAwLjI0MDIyLC0wLjA5NDQgMC4xMDI5' +
                          'NiwtMC4wOTQ0IDAuMTAyOTYsLTAuMjMxNjQgbCAwLC0wLjk0Mzc0IHEgMCwtMC4xMzcyOCAtMC4xMDI5NiwtMC4yMzE2NSAtMC4x' +
                          'MDI5NSwtMC4wOTQ0IC0wLjI0MDIyLC0wLjA5NDQgeiIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjIgog' +
                          'ICAgICAgZD0ibSA5LjY3MjExLC0xNzAuMzk4MyBxIC0wLjM2MDM0LC0wLjM2MDM0IC0wLjM2MDM0LC0wLjg3NTExIDAsLTAuNTE0' +
                          'NzcgMC4zNjAzNCwtMC44NzUxIDAuMzYwMzMsLTAuMzYwMzQgMC44NzUxLC0wLjM2MDM0IDAuNTE0NzcsMCAwLjg3NTEsMC4zNjAz' +
                          'NCAwLjM2MDM0LDAuMzYwMzMgMC4zNjAzNCwwLjg3NTEgMCwwLjUxNDc3IC0wLjM2MDM0LDAuODc1MTEgLTAuMzYwMzMsMC4zNjAz' +
                          'MyAtMC44NzUxLDAuMzYwMzMgLTAuNTE0NzcsMCAtMC44NzUxLC0wLjM2MDMzIHoiIC8+CiAgICA8cGF0aAogICAgICAgc3R5bGU9' +
                          'ImZpbGw6I2NjY2NjYyIKICAgICAgIGQ9Im0gMTEuOTc2OTEsLTE3NC4yOTc2OSAtOC43NjgyLDAgMCwtMi4yOTkyOSA5LjAwODQy' +
                          'LDAgcSAyLjI2NDk4LDAgMi4yNjQ5OCwyLjEyNzcgbCAwLDEuMzg5ODcgLTEuNjgxNTgsMCAwLC0wLjQ2MzI5IHEgMCwtMC4zNzc0' +
                          'OSAtMC4xNzE1OSwtMC41NjYyNCAtMC4xNzE1OCwtMC4xODg3NSAtMC42NTIwMywtMC4xODg3NSB6IG0gLTkuNDU0NTYsLTEuMTQ5' +
                          'NjUgcSAwLDAuNTE0NzcgLTAuMzY4OTEsMC44OTIyNyAtMC4zNjg5MiwwLjM3NzQ5IC0wLjg5MjI2LDAuMzc3NDkgLTAuNTIzMzUs' +
                          'MCAtMC44OTIyNywtMC4zNzc0OSBRIDAsLTE3NC45MzI1NyAwLC0xNzUuNDQ3MzQgcSAwLC0wLjUxNDc2IDAuMzY4OTEsLTAuODgz' +
                          'NjggMC4zNjg5MiwtMC4zNjg5MiAwLjkwMDg1LC0wLjM2ODkyIDAuNTMxOTIsMCAwLjg5MjI2LDAuMzY4OTIgMC4zNjAzMywwLjM2' +
                          'ODkyIDAuMzYwMzMsMC44ODM2OCB6IiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2MiCiAgICAgICBkPSJt' +
                          'IDYuMzI0NzUsLTE4MS45MTE5NCBxIDAsLTIuMTI3NzEgMi4yNjQ5NywtMi4xMjc3MSBsIDAuODkyMjcsMCBxIDIuMjY0OTcsMCAy' +
                          'LjI2NDk3LDIuMTI3NzEgbCAwLDEuOTA0NjMgcSAwLDIuMTI3NzEgLTIuMjY0OTcsMi4xMjc3MSBsIC0wLjUzMTkzLDAgMCwtMi4x' +
                          'Mjc3MSAwLjc1NDk5LDAgcSAwLjEzNzI3LDAgMC4yNDAyMywtMC4wOTQ0IDAuMTAyOTUsLTAuMDk0NCAwLjEwMjk1LC0wLjIzMTY0' +
                          'IGwgMCwtMS40MDcwMyBxIDAsLTAuMTM3MjcgLTAuMTAyOTUsLTAuMjMxNjUgLTAuMTAyOTYsLTAuMDk0NCAtMC4yNDAyMywtMC4w' +
                          'OTQ0IGwgLTEuMDI5NTMsMCBxIC0wLjEzNzI3LDAgLTAuMjQwMjMsMC4wOTQ0IC0wLjEwMjk1LDAuMDk0NCAtMC4xMDI5NSwwLjIz' +
                          'MTY1IGwgMCwxLjc2NzM3IHEgMCwyLjEyNzcgLTIuMjY0OTcsMi4xMjc3IGwgLTAuNzcyMTUsMCBxIC0yLjI2NDk4LDAgLTIuMjY0' +
                          'OTgsLTIuMTI3NyBsIDAsLTEuODAxNjkgcSAwLC0yLjEyNzcgMi4yNjQ5OCwtMi4xMjc3IGwgMC4zMDg4NiwwIDAsMi4xMjc3IC0w' +
                          'LjUzMTkzLDAgcSAtMC4xMzcyNywwIC0wLjI0MDIyLDAuMDk0NCAtMC4xMDI5NiwwLjA5NDQgLTAuMTAyOTYsMC4yMzE2NSBsIDAs' +
                          'MS4zMDQwNyBxIDAsMC4xMzcyOCAwLjEwMjk2LDAuMjMxNjUgMC4xMDI5NSwwLjA5NDQgMC4yNDAyMiwwLjA5NDQgbCAwLjkwOTQy' +
                          'LDAgcSAwLjEzNzI3LDAgMC4yNDAyMywtMC4wOTQ0IDAuMTAyOTUsLTAuMDk0NCAwLjEwMjk1LC0wLjIzMTY1IGwgMCwtMS43Njcz' +
                          'NiB6IiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2MiCiAgICAgICBkPSJtIDUuMzA0OTY1OCwtMTkwLjk5' +
                          'MDg4IDQuMTk3MjI5NSwwIHEgMi4yNzA2MzI3LDAgMi4yNzA2MzI3LDIuMTMzMDEgbCAwLDEuOTQzOCBxIDAsMi4xMzMwMiAtMi4y' +
                          'NzA2MzI3LDIuMTMzMDIgbCAtNC4xOTcyMjk1LDAgcSAtMi4yNzA2MzIzLDAgLTIuMjcwNjMyMywtMi4xMzMwMiBsIDAsLTEuOTQz' +
                          'OCBxIDAsLTIuMTMzMDEgMi4yNzA2MzIzLC0yLjEzMzAxIHogbSA0LjY3ODg3ODgsMi4zMDUwMyAtNS4xNzc3Mjk4LDAgcSAtMC4x' +
                          'Mzc2MTQxLDAgLTAuMjQwODI0NiwwLjA5NDYgLTAuMTAzMjEwNiwwLjA5NDYgLTAuMTAzMjEwNiwwLjIzMjIyIGwgMCwwLjk0NjEg' +
                          'cSAwLDAuMTM3NjIgMC4xMDMyMTA2LDAuMjMyMjMgMC4xMDMyMTA1LDAuMDk0NiAwLjI0MDgyNDYsMC4wOTQ2IGwgNS4xNzc3Mjk4' +
                          'LDAgcSAwLjEzNzYxNDQsMCAwLjI0MDgyNDQsLTAuMDk0NiAwLjEwMzIxMSwtMC4wOTQ2IDAuMTAzMjExLC0wLjIzMjIzIGwgMCwt' +
                          'MC45NDYxIHEgMCwtMC4xMzc2MSAtMC4xMDMyMTEsLTAuMjMyMjIgLTAuMTAzMjEsLTAuMDk0NiAtMC4yNDA4MjQ0LC0wLjA5NDYg' +
                          'eiIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjIgogICAgICAgZD0ibSAxMS43ODU5OSwtMTk0LjAwMTg5' +
                          'IDAsMi4zNjAxMiAtOC41OTUwNywwIDAsLTIuMTQ4NzYgMC40NDAzMywwIHEgLTAuNjE2NDUsLTAuNTQ2IC0wLjYxNjQ1LC0xLjY1' +
                          'NTYxIGwgMCwtMC4zNjk4NyBRIDMuMDE0OCwtMTk4IDUuMzM5NjksLTE5OCBsIDYuNDQ2MywwIDAsMi4zNjAxMiAtNi43MjgxLDAg' +
                          'cSAtMC4xNDA5MSwwIC0wLjI0NjU4LDAuMDk2OSAtMC4xMDU2OCwwLjA5NjkgLTAuMTA1NjgsMC4yMzc3NyBsIDAsMC45Njg3MSBx' +
                          'IDAsMC4xNDA5IDAuMTA1NjgsMC4yMzc3NyAwLjEwNTY3LDAuMDk2OSAwLjI0NjU4LDAuMDk2OSBsIDYuNzI4MSwwIHoiIC8+CiAg' +
                          'PC9nPgo8L3N2Zz4K';

                        NodeStyle.textContent =
                          [
                            '#mdb, #json { min-height: 200px; min-height: -moz-calc(' + min_height + 'vh); min-height: -o-calc(' + min_height + 'vh); min-height: -webkit-calc(' + min_height + 'vh); min-height: calc(' + min_height + 'vh); }',
                            '.path-divider { color: #666; margin: 0 0.25em; }',
                            '#mdb .ace_gutter { background: #ebebeb url(' + textSVGMetaJS + ') repeat-y scroll left top !important; }',
                            '#json .ace_gutter { background: #ebebeb url(' + textSVGMetaJSON + ') repeat-y scroll left top !important; }'
                          ].join('\n')
                        ;
                        document.head.appendChild(NodeStyle);

                        // Fix title to be native
                        var scriptNameX = null;
                        meta.UserScript['name'].forEach(function (e, i, a) {
                          if (!e.locale) { // Default to absent locale... requirement of OUJS to have `@name`
                            scriptNameX = e.value;
                          }
                        });

                        titleNode.textContent = 'Meta ' + scriptNameX + ' | OpenUserJS';

                        // Create meta views
                        var jsonNodePre = document.createElement('pre');
                        jsonNodePre.classList.add('ace_editor');
                        jsonNodePre.classList.add('ace-dawn');
                        jsonNodePre.id = 'json';
                        jsonNodePre.textContent = JSON.stringify(meta, null, ' ');

                        var mdbNodePre = document.createElement('pre');
                        mdbNodePre.classList.add('ace_editor');
                        mdbNodePre.classList.add('ace-dawn');
                        mdbNodePre.id = 'mdb';
                        mdbNodePre.textContent = responseTextMetaJS;

                        var atIcon = meta.UserScript['icon'];
                        if (atIcon) {
                          atIcon = meta.UserScript['icon'][0].value;

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

                        scriptAuthorNodeA.textContent = decodeURI(userName);
                        pathDividerNodeSpan.textContent = "/";
                        scriptNameNodeA.textContent = scriptNameX;

                        navNodeA4Span4.textContent = 'n/a';
                        navbar1TextNodeP.appendChild(document.createTextNode(' n/a'));
                        navbar2TextNodeP.appendChild(document.createTextNode(' n/a'));


                        hookNode.appendChild(mdbNodePre);
                        hookNode.appendChild(jsonNodePre);

                        var wrappedNodeInput =  document.createElement('input');
                        wrappedNodeInput.classList.add('btn');
                        wrappedNodeInput.classList.add('btn-success');
                        wrappedNodeInput.id = 'wrap';
                        wrappedNodeInput.setAttribute('value', 'Wrap');
                        wrappedNodeInput.type = 'button';
                        wrappedNodeInput.addEventListener('click', function (aE) {
                          var active = false;

                          if (document.querySelector('pre#mdb')) {
                            if (ace.edit('mdb').getSession().getUseWrapMode()) {
                              ace.edit('mdb').getSession().setUseWrapMode(false);
                            }
                            else {
                              ace.edit('mdb').getSession().setUseWrapMode(true);
                              active = true;
                            }
                          }

                          if (document.querySelector('pre#json')) {
                            if (ace.edit('json').getSession().getUseWrapMode()) {
                              ace.edit('json').getSession().setUseWrapMode(false);
                            }
                            else {
                              ace.edit('json').getSession().setUseWrapMode(true);
                              active = true;
                            }
                          }

                          if (active) {
                            aE.target.classList.add('active');
                          } else {
                            aE.target.classList.remove('active');
                          }

                          aE.target.blur();
                        });

                        var toolbarNodeDiv = document.createElement('div');
                        toolbarNodeDiv.classList.add('btn-toolbar');

                        toolbarNodeDiv.appendChild(wrappedNodeInput);

                        hookNode.appendChild(toolbarNodeDiv);


                        // Clean up
                        hookNode.removeChild(NodeDiv);

                        // Resize for older browsers
                        if (!hasAnyCalc()) {
                          mdbNodePre.style.setProperty('height', calcHeight() + 'px', '');
                          jsonNodePre.style.setProperty('height', calcHeight() + 'px', '');
                          document.addEventListener('resize', function () {
                            mdbNodePre.style.setProperty('height', calcHeight() + 'px', '');
                            jsonNodePre.style.setProperty('height', calcHeight() + 'px', '');
                          });
                        }

                        // Activate Ace
                        var mdb = ace.edit('mdb');
                        mdb.setTheme('ace/theme/dawn');
                        mdb.getSession().setMode('ace/mode/javascript');
                        mdb.setReadOnly(true);

                        var mdj = ace.edit('json');
                        mdj.setTheme('ace/theme/dawn');
                        mdj.getSession().setMode('ace/mode/javascript');
                        mdj.setReadOnly(true);

                        break;
                      default:
                        NodeDiv.classList.remove('alert-warning');
                        NodeDiv.classList.add('alert-danger');

                        NodeStrong.textContent = 'ERROR';
                        NodeText.textContent = ': Unable to fetch the meta.json with status of: ' + this.status;

                        break;
                    }
                  }
                };
                req.send();

                break;
              default:
                NodeDiv.classList.remove('alert-warning');
                NodeDiv.classList.add('alert-danger');

                NodeStrong.textContent = 'ERROR';
                NodeText.textContent = ': Unable to fetch the meta.js with status of: ' + this.status;

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
