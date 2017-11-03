// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a script navigation link next to `Source Code` titled `Meta` and opens a phantom url to show the detected metadata
// @copyright     2014+, Marti Martz (https://openuserjs.org/users/Marti)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0; http://www.gnu.org/licenses/gpl-3.0-standalone.html
// @version       4.2.1
// @icon          https://www.gravatar.com/avatar/7ff58eb098c23feafa72e0b4cd13f396?r=G&s=48&default=identicon

// @homepageURL  https://github.com/Martii/UserScripts/tree/master/src/oujs/Meta%20View
// @homepageURL  https://openuserjs.org/scripts/marti/oujs_-_Meta_View
// @supportURL   https://openuserjs.org/scripts/marti/oujs_-_Meta_View/issues

// @updateURL    https://openuserjs.org/meta/Marti/oujs_-_Meta_View.meta.js
// @downloadURL  https://openuserjs.org/install/Marti/oujs_-_Meta_View.min.user.js

// @include  /^https?://openuserjs\.org(?::\d{1,5})?/scripts//
// @include  /^http://localhost(?::\d{1,5})?/scripts//

// @include  https://openuserjs.org/scripts/*/*
// @include  http://localhost:8080/scripts/*/*

// @grant none

// ==/UserScript==

(function() {
  'use strict';

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
          function hasRelative(aPrefix) {
            aPrefix = aPrefix || '';

            var hasCalc = document.createElement('div');
            hasCalc.style.setProperty(aPrefix + 'width', 'calc(1px)', '');

            var hasUnitV = document.createElement("div");
            hasUnitV.style.setProperty(aPrefix + "width", "calc(5vw + 5vw)", "");

            return !!hasCalc.style.length && !!hasUnitV.style.length;
          }

          function hasOurRelative() {
            return hasRelative('-moz-') || hasRelative('-ms-') || hasRelative('-o-') || hasRelative('-webkit-') || hasRelative();
          }

          function calcHeight() {
            return parseInt((window.innerHeight - 306) / 2.004);
          }

          if (this.readyState == this.DONE) {
            console.log(
              [
                'META VIEW REQUEST SUMMARY',
                '',
                'status: ' + this.status,
                'statusText: ' + this.statusText,
                'readyState: ' + this.readyState,
                'getAllResponseHeaders():\n' + this.getAllResponseHeaders().split('\n').map(function (aE, aI, aA) {
                  return '  ' + aE;
                }).join('\n'),
                'responseURL: ' + this.responseURL

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
                        var min_height = 85.2;
                        var offset = 306;
                        var textSVGMetaJS = 'data:image/svg+xml;base64,' +
                          'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTIwMCAxNC40ODIxMDggNTIuMTI0Njgy' +
                          'IiBoZWlnaHQ9IjUyLjEyIj48ZyBmaWxsPSIjY2NjIj48cGF0aCBkPSJtOS42NjgtMTUwLjI0cS0uMzYtLjM2LS4zNi0uODc1IDAt' +
                          'LjUxNS4zNi0uODc1LjM2LS4zNi44NzUtLjM2LjUxNSAwIC44NzUuMzYuMzYuMzYuMzYuODc1IDAgLjUxNS0uMzYuODc1LS4zNi4z' +
                          'Ni0uODc1LjM2LS41MTUgMC0uODc1LS4zNiIvPjxwYXRoIGQ9Im0zLjI0MS0xNjAuODJxMC0yLjEyOCAyLjI2NS0yLjEyOGg2LjI4' +
                          'djIuMjk5aC02LjU1NXEtLjEzNyAwLS4yNC4wOTQtLjEwMy4wOTQtLjEwMy4yMzJ2LjczOHEwIC4xMzcuMTAzLjIzMi4xMDMuMDk0' +
                          'LjI0LjA5NGg2LjU1NXYyLjI5OWgtNi41NTVxLS4xMzcgMC0uMjQuMDk0LS4xMDMuMDk0LS4xMDMuMjMydi43MzhxMCAuMTM3LjEw' +
                          'My4yMzIuMTAzLjA5NC4yNC4wOTRoNi41NTV2Mi4yOTloLTguMzc0di0yLjA5M2guNDI5cS0uNjAxLS41MzItLjYwMS0xLjYxM3Yt' +
                          'LjE1NHEwLTEuMjcuNzg5LTEuNzY3LS43ODktLjUzMi0uNzg5LTEuNzY3di0uMTU0Ii8+PHBhdGggZD0ibTMuMDUxLTE2OC4xMXEw' +
                          'LTIuMTI4IDIuMjY1LTIuMTI4aDIuNzExdjMuODk1aDEuNzVxLjEzNyAwIC4yNC0uMDk0LjEwMy0uMDk0LjEwMy0uMjMydi0uOTQ0' +
                          'cTAtLjEzNy0uMTAzLS4yMzItLjEwMy0uMDk0LS4yNC0uMDk0aC0uOTI3di0yLjI5OWguNjUycTIuMjY1IDAgMi4yNjUgMi4xMjh2' +
                          'MS45MzlxMCAyLjEyOC0yLjI2NSAyLjEyOGgtNC4xODdxLTIuMjY1IDAtMi4yNjUtMi4xMjh2LTEuOTM5bTMuNDY2IDEuNzY3di0x' +
                          'LjU5NmgtMS41NDRxLS4xMzcgMC0uMjQuMDk0LS4xMDMuMDk0LS4xMDMuMjMydi45NDRxMCAuMTM3LjEwMy4yMzIuMTAzLjA5NC4y' +
                          'NC4wOTRoMS41NDQiLz48cGF0aCBkPSJtMTAuMjg4LTE3NC42di0uNjg2aDEuNDkzdjEuNjEzcTAgMi4xMjgtMi4yNjUgMi4xMjho' +
                          'LTguMDk5di0yLjI5OWgxLjgxOXYtMS40NDFoMS42NjR2MS40NDFoNC41NjRxLjQ4IDAgLjY1Mi0uMTg5LjE3Mi0uMTg5LjE3Mi0u' +
                          'NTY2Ii8+PHBhdGggZD0ibTMuMjM2LTE4MC45MXYtMS45MzloOC4zNzR2MS45MzloLS42MThxLjc4OS41MzIuNzg5IDEuNzY3di4z' +
                          'NnEwIDIuMTI4LTIuMjY1IDIuMTI4aC00LjE4N3EtMi4yNjUgMC0yLjI2NS0yLjEyOHYtLjM2cTAtMS4yMzUuNzg5LTEuNzY3aC0u' +
                          'NjE4bTYuNTU1LjM2aC00LjczNnEtLjEzNyAwLS4yNC4wOTQtLjEwMy4wOTQtLjEwMy4yMzJ2Ljk0NHEwIC4xMzcuMTAzLjIzMi4x' +
                          'MDMuMDk0LjI0LjA5NGg0LjczNnEuMTM3IDAgLjI0LS4wOTQuMTAzLS4wOTQuMTAzLS4yMzJ2LS45NDRxMC0uMTM3LS4xMDMtLjIz' +
                          'Mi0uMTAzLS4wOTQtLjI0LS4wOTQiLz48cGF0aCBkPSJtOS42NzItMTg0LjM2cS0uMzYtLjM2LS4zNi0uODc1IDAtLjUxNS4zNi0u' +
                          'ODc1LjM2LS4zNi44NzUtLjM2LjUxNSAwIC44NzUuMzYuMzYuMzYuMzYuODc1IDAgLjUxNS0uMzYuODc1LS4zNi4zNi0uODc1LjM2' +
                          'LS41MTUgMC0uODc1LS4zNiIvPjxwYXRoIGQ9Im0xMS45NzctMTg4LjI2aC04Ljc2OHYtMi4yOTloOS4wMXEyLjI2NSAwIDIuMjY1' +
                          'IDIuMTI4djEuMzloLTEuNjgydi0uNDYzcTAtLjM3Ny0uMTcyLS41NjYtLjE3Mi0uMTg5LS42NTItLjE4OW0tOS40NTUtMS4xNXEw' +
                          'IC41MTUtLjM2OS44OTItLjM2OS4zNzctLjg5Mi4zNzctLjUyMyAwLS44OTItLjM3Ny0uMzY5LS4zNzctLjM2OS0uODkyIDAtLjUx' +
                          'NS4zNjktLjg4NC4zNjktLjM2OS45MDEtLjM2OS41MzIgMCAuODkyLjM2OS4zNi4zNjkuMzYuODg0Ii8+PHBhdGggZD0ibTYuMzI1' +
                          'LTE5NS44N3EwLTIuMTI4IDIuMjY1LTIuMTI4aC44OTJxMi4yNjUgMCAyLjI2NSAyLjEyOHYxLjkwNXEwIDIuMTI4LTIuMjY1IDIu' +
                          'MTI4aC0uNTMydi0yLjEyOGguNzU1cS4xMzcgMCAuMjQtLjA5NC4xMDMtLjA5NC4xMDMtLjIzMnYtMS40MDdxMC0uMTM3LS4xMDMt' +
                          'LjIzMi0uMTAzLS4wOTQtLjI0LS4wOTRoLTEuMDNxLS4xMzcgMC0uMjQuMDk0LS4xMDMuMDk0LS4xMDMuMjMydjEuNzY3cTAgMi4x' +
                          'MjgtMi4yNjUgMi4xMjhoLS43NzJxLTIuMjY1IDAtMi4yNjUtMi4xMjh2LTEuODAycTAtMi4xMjggMi4yNjUtMi4xMjhoLjMwOXYy' +
                          'LjEyOGgtLjUzMnEtLjEzNyAwLS4yNC4wOTQtLjEwMy4wOTQtLjEwMy4yMzJ2MS4zMDRxMCAuMTM3LjEwMy4yMzIuMTAzLjA5NC4y' +
                          'NC4wOTRoLjkwOXEuMTM3IDAgLjI0LS4wOTQuMTAzLS4wOTQuMTAzLS4yMzJ2LTEuNzY3Ii8+PC9nPjwvc3ZnPg==';

                        var textSVGMetaJSON = 'data:image/svg+xml;base64,' +
                          'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTIwMCAxNC40ODIxMSA2Ni4wODUwMzUi' +
                          'IGhlaWdodD0iNjYuMDkiPjxnIGZpbGw9IiNjY2MiPjxwYXRoIGQ9Im05LjY2OC0xMzYuMjhxLS4zNi0uMzYtLjM2LS44NzUgMC0u' +
                          'NTE1LjM2LS44NzUuMzYtLjM2Ljg3NS0uMzYuNTE1IDAgLjg3NS4zNi4zNi4zNi4zNi44NzUgMCAuNTE1LS4zNi44NzUtLjM2LjM2' +
                          'LS44NzUuMzYtLjUxNSAwLS44NzUtLjM2Ii8+PHBhdGggZD0ibTMuMjQxLTE0Ni44NnEwLTIuMTI4IDIuMjY1LTIuMTI4aDYuMjh2' +
                          'Mi4yOTloLTYuNTU1cS0uMTM3IDAtLjI0LjA5NC0uMTAzLjA5NC0uMTAzLjIzMnYuNzM4cTAgLjEzNy4xMDMuMjMyLjEwMy4wOTQu' +
                          'MjQuMDk0aDYuNTU1djIuMjk5aC02LjU1NXEtLjEzNyAwLS4yNC4wOTQtLjEwMy4wOTQtLjEwMy4yMzJ2LjczOHEwIC4xMzcuMTAz' +
                          'LjIzMi4xMDMuMDk0LjI0LjA5NGg2LjU1NXYyLjI5OWgtOC4zNzR2LTIuMDkzaC40MjlxLS42MDEtLjUzMi0uNjAxLTEuNjEzdi0u' +
                          'MTU0cTAtMS4yNy43ODktMS43NjctLjc4OS0uNTMyLS43ODktMS43Njd2LS4xNTQiLz48cGF0aCBkPSJtMy4wNTEtMTU0LjE1cTAt' +
                          'Mi4xMjggMi4yNjUtMi4xMjhoMi43MTF2My44OTVoMS43NXEuMTM3IDAgLjI0LS4wOTQuMTAzLS4wOTQuMTAzLS4yMzJ2LS45NDRx' +
                          'MC0uMTM3LS4xMDMtLjIzMi0uMTAzLS4wOTQtLjI0LS4wOTRoLS45Mjd2LTIuMjk5aC42NTJxMi4yNjUgMCAyLjI2NSAyLjEyOHYx' +
                          'LjkzOXEwIDIuMTI4LTIuMjY1IDIuMTI4aC00LjE4N3EtMi4yNjUgMC0yLjI2NS0yLjEyOHYtMS45MzltMy40NjYgMS43Njd2LTEu' +
                          'NTk2aC0xLjU0NHEtLjEzNyAwLS4yNC4wOTQtLjEwMy4wOTQtLjEwMy4yMzJ2Ljk0NHEwIC4xMzcuMTAzLjIzMi4xMDMuMDk0LjI0' +
                          'LjA5NGgxLjU0NCIvPjxwYXRoIGQ9Im0xMC4yODgtMTYwLjY0di0uNjg2aDEuNDkzdjEuNjEzcTAgMi4xMjgtMi4yNjUgMi4xMjho' +
                          'LTguMDk5di0yLjI5OWgxLjgxOXYtMS40NDFoMS42NjR2MS40NDFoNC41NjRxLjQ4IDAgLjY1Mi0uMTg5LjE3Mi0uMTg5LjE3Mi0u' +
                          'NTY2Ii8+PHBhdGggZD0ibTMuMjM2LTE2Ni45NXYtMS45MzloOC4zNzR2MS45MzloLS42MThxLjc4OS41MzIuNzg5IDEuNzY3di4z' +
                          'NnEwIDIuMTI4LTIuMjY1IDIuMTI4aC00LjE4N3EtMi4yNjUgMC0yLjI2NS0yLjEyOHYtLjM2cTAtMS4yMzUuNzg5LTEuNzY3aC0u' +
                          'NjE4bTYuNTU1LjM2aC00LjczNnEtLjEzNyAwLS4yNC4wOTQtLjEwMy4wOTQtLjEwMy4yMzJ2Ljk0NHEwIC4xMzcuMTAzLjIzMi4x' +
                          'MDMuMDk0LjI0LjA5NGg0LjczNnEuMTM3IDAgLjI0LS4wOTQuMTAzLS4wOTQuMTAzLS4yMzJ2LS45NDRxMC0uMTM3LS4xMDMtLjIz' +
                          'Mi0uMTAzLS4wOTQtLjI0LS4wOTQiLz48cGF0aCBkPSJtOS42NzItMTcwLjRxLS4zNi0uMzYtLjM2LS44NzUgMC0uNTE1LjM2LS44' +
                          'NzUuMzYtLjM2Ljg3NS0uMzYuNTE1IDAgLjg3NS4zNi4zNi4zNi4zNi44NzUgMCAuNTE1LS4zNi44NzUtLjM2LjM2LS44NzUuMzYt' +
                          'LjUxNSAwLS44NzUtLjM2Ii8+PHBhdGggZD0ibTExLjk3Ny0xNzQuM2gtOC43Njh2LTIuMjk5aDkuMDFxMi4yNjUgMCAyLjI2NSAy' +
                          'LjEyOHYxLjM5aC0xLjY4MnYtLjQ2M3EwLS4zNzctLjE3Mi0uNTY2LS4xNzItLjE4OS0uNjUyLS4xODltLTkuNDU1LTEuMTVxMCAu' +
                          'NTE1LS4zNjkuODkyLS4zNjkuMzc3LS44OTIuMzc3LS41MjMgMC0uODkyLS4zNzctLjM2OS0uMzc3LS4zNjktLjg5MiAwLS41MTUu' +
                          'MzY5LS44ODQuMzY5LS4zNjkuOTAxLS4zNjkuNTMyIDAgLjg5Mi4zNjkuMzYuMzY5LjM2Ljg4NCIvPjxwYXRoIGQ9Im02LjMyNS0x' +
                          'ODEuOTFxMC0yLjEyOCAyLjI2NS0yLjEyOGguODkycTIuMjY1IDAgMi4yNjUgMi4xMjh2MS45MDVxMCAyLjEyOC0yLjI2NSAyLjEy' +
                          'OGgtLjUzMnYtMi4xMjhoLjc1NXEuMTM3IDAgLjI0LS4wOTQuMTAzLS4wOTQuMTAzLS4yMzJ2LTEuNDA3cTAtLjEzNy0uMTAzLS4y' +
                          'MzItLjEwMy0uMDk0LS4yNC0uMDk0aC0xLjAzcS0uMTM3IDAtLjI0LjA5NC0uMTAzLjA5NC0uMTAzLjIzMnYxLjc2N3EwIDIuMTI4' +
                          'LTIuMjY1IDIuMTI4aC0uNzcycS0yLjI2NSAwLTIuMjY1LTIuMTI4di0xLjgwMnEwLTIuMTI4IDIuMjY1LTIuMTI4aC4zMDl2Mi4x' +
                          'MjhoLS41MzJxLS4xMzcgMC0uMjQuMDk0LS4xMDMuMDk0LS4xMDMuMjMydjEuMzA0cTAgLjEzNy4xMDMuMjMyLjEwMy4wOTQuMjQu' +
                          'MDk0aC45MDlxLjEzNyAwIC4yNC0uMDk0LjEwMy0uMDk0LjEwMy0uMjMydi0xLjc2NyIvPjxwYXRoIGQ9Im01LjMwNS0xOTAuOTlo' +
                          'NC4xOTdxMi4yNzEgMCAyLjI3MSAyLjEzM3YxLjk0NHEwIDIuMTMzLTIuMjcxIDIuMTMzaC00LjE5N3EtMi4yNzEgMC0yLjI3MS0y' +
                          'LjEzM3YtMS45NDRxMC0yLjEzMyAyLjI3MS0yLjEzM200LjY3OSAyLjMwNWgtNS4xNzhxLS4xMzggMC0uMjQxLjA5NS0uMTAzLjA5' +
                          'NS0uMTAzLjIzMnYuOTQ2cTAgLjEzOC4xMDMuMjMyLjEwMy4wOTUuMjQxLjA5NWg1LjE3OHEuMTM4IDAgLjI0MS0uMDk1LjEwMy0u' +
                          'MDk1LjEwMy0uMjMydi0uOTQ2cTAtLjEzOC0uMTAzLS4yMzItLjEwMy0uMDk1LS4yNDEtLjA5NSIvPjxwYXRoIGQ9Im0xMS43ODYt' +
                          'MTk0djIuMzZoLTguNTk1di0yLjE0OWguNDRxLS42MTYtLjU0Ni0uNjE2LTEuNjU2di0uMzdxMC0yLjE4NCAyLjMyNS0yLjE4NGg2' +
                          'LjQ0NnYyLjM2aC02LjcyOHEtLjE0MSAwLS4yNDcuMDk3LS4xMDYuMDk3LS4xMDYuMjM4di45NjlxMCAuMTQxLjEwNi4yMzguMTA2' +
                          'LjA5Ny4yNDcuMDk3aDYuNzI4Ii8+PC9nPjwvc3ZnPg==';

                        NodeStyle.textContent =
                          [
                            '#mdb { min-height: 115px; }',
                            '#json { min-height: 115px; height: -moz-calc(' + min_height + 'vh - ' + offset + 'px); height: -o-calc(' + min_height + 'vh - ' + offset + 'px); height: -webkit-calc(' + min_height + 'vh - ' + offset + 'px); height: calc(' + min_height + 'vh - ' + offset + 'px); }',
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

                        var issueCount =
                          meta.OpenUserJS &&
                            meta.OpenUserJS.issues &&
                              meta.OpenUserJS.issues[0] &&
                                typeof meta.OpenUserJS.issues[0].value !== 'undefined'
                                  ? meta.OpenUserJS.issues[0].value
                                  : 'n/a';

                        navNodeA4Span4.textContent = issueCount;

                        var installCount =
                          meta.OpenUserJS &&
                            meta.OpenUserJS.installs &&
                              meta.OpenUserJS.installs[0] &&
                                typeof meta.OpenUserJS.installs[0].value !== 'undefined'
                                  ? meta.OpenUserJS.installs[0].value
                                  : 'n/a';

                        navbar1TextNodeP.appendChild(document.createTextNode(' ' + installCount));
                        navbar2TextNodeP.appendChild(document.createTextNode(' ' + installCount));


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
                        if (!hasOurRelative()) {
                          mdbNodePre.style.setProperty('height', calcHeight() + 'px', '');
                          jsonNodePre.style.setProperty('height', calcHeight() + 'px', '');

                          if (window.addEventListener) {
                            window.addEventListener('resize', function () {
                              mdbNodePre.style.setProperty('height', calcHeight() + 'px', '');
                              jsonNodePre.style.setProperty('height', calcHeight() + 'px', '');
                            }, false);
                          }
                          else if (window.attachEvent) {
                            window.addEventListener('resize', function () {
                              mdbNodePre.style.setProperty('height', calcHeight() + 'px', '');
                              jsonNodePre.style.setProperty('height', calcHeight() + 'px', '');
                            });
                          }
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
                        NodeText.textContent = ': Unable to fetch the meta.json with status of: ' + this.status + this.statusText +
                          (this.status === 429 ? '. Try again in ' + (this.getResponseHeader('Retry-After') ? this.getResponseHeader('Retry-After') + ' seconds.' : 'a few.') : '');
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
                NodeText.textContent = ': Unable to fetch the meta.js with status of: ' + this.status + ' ' + this.statusText +
                  (this.status === 429 ? '. Try again in ' + (this.getResponseHeader('Retry-After') ? this.getResponseHeader('Retry-After') + ' seconds.' : 'a few.') : '');

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
