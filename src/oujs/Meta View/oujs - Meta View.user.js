// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @author        Marti Martz <martii@users.noreply.github.com> (https://openuserjs.org/scripts/Marti)
// @description   Adds a script navigation link next to `Source Code` titled `Meta` and opens a phantom url to show the detected metadata
// @copyright     2014+, Marti Martz (https://openuserjs.org/users/Marti)
// @license       CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license       GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       4.4.10
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

// ==OpenUserJS==
// @author Marti
// ==/OpenUserJS==

/* jshint esversion: 5 */
/* globals ace */

/* eslint dot-notation: off */
/* eslint curly: off */

(function() {
  'use strict';

  /**
   *
   */

  var FQDN = window.location.protocol + '//' + window.location.host;

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
        navNodeA3.classList.add('notranslate');
        navNodeA3.setAttribute('translate', 'no');

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

        var url = FQDN + '/src/scripts/' + userName + '/' + scriptName + '.user.js';

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

                url = FQDN + '/meta/' + userName + '/' + scriptName + '.meta.json';

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
                        var offset = 292;
                        var textSVGMetaJS = 'data:image/svg+xml;base64,' + window.btoa([
                          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -200 14.482108 52.124682" height="52.12">',
                            '<g fill="#ccc">',
                              '<path d="m9.668-150.24q-.36-.36-.36-.875 0-.515.36-.875.36-.36.875-.36.515 0 .875.36.36.36.36.875 0 .515-.36.875-.36.36-.875.36-.515 0-.875-.36"/>',
                              '<path d="m3.241-160.82q0-2.128 2.265-2.128h6.28v2.299h-6.555q-.137 0-.24.094-.103.094-.103.232v.738q0 .137.103.232.103.094.24.094h6.555v2.299h-6.555q-.137 0-.24.094-.103.094-.103.232v.738q0 .137.103.232.103.094.24.094h6.555v2.299h-8.374v-2.093h.429q-.601-.532-.601-1.613v-.154q0-1.27.789-1.767-.789-.532-.789-1.767v-.154"/>',
                              '<path d="m3.051-168.11q0-2.128 2.265-2.128h2.711v3.895h1.75q.137 0 .24-.094.103-.094.103-.232v-.944q0-.137-.103-.232-.103-.094-.24-.094h-.927v-2.299h.652q2.265 0 2.265 2.128v1.939q0 2.128-2.265 2.128h-4.187q-2.265 0-2.265-2.128v-1.939m3.466 1.767v-1.596h-1.544q-.137 0-.24.094-.103.094-.103.232v.944q0 .137.103.232.103.094.24.094h1.544"/>',
                              '<path d="m10.288-174.6v-.686h1.493v1.613q0 2.128-2.265 2.128h-8.099v-2.299h1.819v-1.441h1.664v1.441h4.564q.48 0 .652-.189.172-.189.172-.566"/>',
                              '<path d="m3.236-180.91v-1.939h8.374v1.939h-.618q.789.532.789 1.767v.36q0 2.128-2.265 2.128h-4.187q-2.265 0-2.265-2.128v-.36q0-1.235.789-1.767h-.618m6.555.36h-4.736q-.137 0-.24.094-.103.094-.103.232v.944q0 .137.103.232.103.094.24.094h4.736q.137 0 .24-.094.103-.094.103-.232v-.944q0-.137-.103-.232-.103-.094-.24-.094"/>',
                              '<path d="m9.672-184.36q-.36-.36-.36-.875 0-.515.36-.875.36-.36.875-.36.515 0 .875.36.36.36.36.875 0 .515-.36.875-.36.36-.875.36-.515 0-.875-.36"/>',
                              '<path d="m11.977-188.26h-8.768v-2.299h9.01q2.265 0 2.265 2.128v1.39h-1.682v-.463q0-.377-.172-.566-.172-.189-.652-.189m-9.455-1.15q0 .515-.369.892-.369.377-.892.377-.523 0-.892-.377-.369-.377-.369-.892 0-.515.369-.884.369-.369.901-.369.532 0 .892.369.36.369.36.884"/>',
                              '<path d="m6.325-195.87q0-2.128 2.265-2.128h.892q2.265 0 2.265 2.128v1.905q0 2.128-2.265 2.128h-.532v-2.128h.755q.137 0 .24-.094.103-.094.103-.232v-1.407q0-.137-.103-.232-.103-.094-.24-.094h-1.03q-.137 0-.24.094-.103.094-.103.232v1.767q0 2.128-2.265 2.128h-.772q-2.265 0-2.265-2.128v-1.802q0-2.128 2.265-2.128h.309v2.128h-.532q-.137 0-.24.094-.103.094-.103.232v1.304q0 .137.103.232.103.094.24.094h.909q.137 0 .24-.094.103-.094.103-.232v-1.767"/>',
                            '</g>',
                          '</svg>'
                        ].join(''));

                        var textSVGMetaJSON = 'data:image/svg+xml;base64,' + window.btoa([
                          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -200 14.48211 66.085035" height="66.09">',
                            '<g fill="#ccc">',
                              '<path d="m9.668-136.28q-.36-.36-.36-.875 0-.515.36-.875.36-.36.875-.36.515 0 .875.36.36.36.36.875 0 .515-.36.875-.36.36-.875.36-.515 0-.875-.36"/>',
                              '<path d="m3.241-146.86q0-2.128 2.265-2.128h6.28v2.299h-6.555q-.137 0-.24.094-.103.094-.103.232v.738q0 .137.103.232.103.094.24.094h6.555v2.299h-6.555q-.137 0-.24.094-.103.094-.103.232v.738q0 .137.103.232.103.094.24.094h6.555v2.299h-8.374v-2.093h.429q-.601-.532-.601-1.613v-.154q0-1.27.789-1.767-.789-.532-.789-1.767v-.154"/>',
                              '<path d="m3.051-154.15q0-2.128 2.265-2.128h2.711v3.895h1.75q.137 0 .24-.094.103-.094.103-.232v-.944q0-.137-.103-.232-.103-.094-.24-.094h-.927v-2.299h.652q2.265 0 2.265 2.128v1.939q0 2.128-2.265 2.128h-4.187q-2.265 0-2.265-2.128v-1.939m3.466 1.767v-1.596h-1.544q-.137 0-.24.094-.103.094-.103.232v.944q0 .137.103.232.103.094.24.094h1.544"/>',
                              '<path d="m10.288-160.64v-.686h1.493v1.613q0 2.128-2.265 2.128h-8.099v-2.299h1.819v-1.441h1.664v1.441h4.564q.48 0 .652-.189.172-.189.172-.566"/>',
                              '<path d="m3.236-166.95v-1.939h8.374v1.939h-.618q.789.532.789 1.767v.36q0 2.128-2.265 2.128h-4.187q-2.265 0-2.265-2.128v-.36q0-1.235.789-1.767h-.618m6.555.36h-4.736q-.137 0-.24.094-.103.094-.103.232v.944q0 .137.103.232.103.094.24.094h4.736q.137 0 .24-.094.103-.094.103-.232v-.944q0-.137-.103-.232-.103-.094-.24-.094"/>',
                              '<path d="m9.672-170.4q-.36-.36-.36-.875 0-.515.36-.875.36-.36.875-.36.515 0 .875.36.36.36.36.875 0 .515-.36.875-.36.36-.875.36-.515 0-.875-.36"/>',
                              '<path d="m11.977-174.3h-8.768v-2.299h9.01q2.265 0 2.265 2.128v1.39h-1.682v-.463q0-.377-.172-.566-.172-.189-.652-.189m-9.455-1.15q0 .515-.369.892-.369.377-.892.377-.523 0-.892-.377-.369-.377-.369-.892 0-.515.369-.884.369-.369.901-.369.532 0 .892.369.36.369.36.884"/>',
                              '<path d="m6.325-181.91q0-2.128 2.265-2.128h.892q2.265 0 2.265 2.128v1.905q0 2.128-2.265 2.128h-.532v-2.128h.755q.137 0 .24-.094.103-.094.103-.232v-1.407q0-.137-.103-.232-.103-.094-.24-.094h-1.03q-.137 0-.24.094-.103.094-.103.232v1.767q0 2.128-2.265 2.128h-.772q-2.265 0-2.265-2.128v-1.802q0-2.128 2.265-2.128h.309v2.128h-.532q-.137 0-.24.094-.103.094-.103.232v1.304q0 .137.103.232.103.094.24.094h.909q.137 0 .24-.094.103-.094.103-.232v-1.767"/>',
                              '<path d="m5.305-190.99h4.197q2.271 0 2.271 2.133v1.944q0 2.133-2.271 2.133h-4.197q-2.271 0-2.271-2.133v-1.944q0-2.133 2.271-2.133m4.679 2.305h-5.178q-.138 0-.241.095-.103.095-.103.232v.946q0 .138.103.232.103.095.241.095h5.178q.138 0 .241-.095.103-.095.103-.232v-.946q0-.138-.103-.232-.103-.095-.241-.095"/>',
                              '<path d="m11.786-194v2.36h-8.595v-2.149h.44q-.616-.546-.616-1.656v-.37q0-2.184 2.325-2.184h6.446v2.36h-6.728q-.141 0-.247.097-.106.097-.106.238v.969q0 .141.106.238.106.097.247.097h6.728"/>',
                            '</g>',
                          '</svg>'
                        ].join(''));

                        NodeStyle.textContent =
                          [
                            '#mdb { min-height: 115px; overflow: auto; }',
                            '#json { min-height: 115px; height: -moz-calc(' + min_height + 'vh - ' + offset + 'px); height: -o-calc(' + min_height + 'vh - ' + offset + 'px); height: -webkit-calc(' + min_height + 'vh - ' + offset + 'px); height: calc(' + min_height + 'vh - ' + offset + 'px); overflow: auto; }',
                            '.path-divider { color: #666; margin: 0 0.25em; }',
                            '#mdb .ace_gutter { background: #ebebeb url(' + textSVGMetaJS + ') repeat-y scroll left top !important; }',
                            '#json .ace_gutter { background: #ebebeb url(' + textSVGMetaJSON + ') repeat-y scroll left top !important; }',


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

                        var wrappedNodeInput = document.createElement('input');
                        wrappedNodeInput.classList.add('btn');
                        wrappedNodeInput.classList.add('btn-sm');
                        wrappedNodeInput.classList.add('btn-success');
                        wrappedNodeInput.id = 'wrap';
                        wrappedNodeInput.setAttribute('value', 'Wrap');
                        wrappedNodeInput.type = 'button';

                        var thisAce = (typeof ace !== 'undefined' ? ace : (window.wrappedJSObject ? window.wrappedJSObject.ace : null));

                        if (!thisAce) {
                          wrappedNodeInput.setAttribute('disabled', 'disabled');
                        }

                        wrappedNodeInput.addEventListener('click', function (aE) {
                          var active = false;

                          if (document.querySelector('pre#mdb')) {
                            if (thisAce.edit('mdb').getSession().getUseWrapMode()) {
                              thisAce.edit('mdb').getSession().setUseWrapMode(false);
                            }
                            else {
                              thisAce.edit('mdb').getSession().setUseWrapMode(true);
                              active = true;
                            }
                          }

                          if (document.querySelector('pre#json')) {
                            if (thisAce.edit('json').getSession().getUseWrapMode()) {
                              thisAce.edit('json').getSession().setUseWrapMode(false);
                            }
                            else {
                              thisAce.edit('json').getSession().setUseWrapMode(true);
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
                        if (thisAce) {
                          var mdb = thisAce.edit('mdb');
                          mdb.setTheme('ace/theme/dawn');
                          mdb.getSession().setMode('ace/mode/javascript');
                          mdb.container.style.fontFamily = "monospace";
                          mdb.setReadOnly(true);

                          var mdj = thisAce.edit('json');
                          mdj.setTheme('ace/theme/dawn');
                          mdj.getSession().setMode('ace/mode/javascript');
                          mdj.container.style.fontFamily = "monospace";
                          mdj.setReadOnly(true);
                        }

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
        NodeA.classList.add('notranslate');
        NodeA.setAttribute('translate', 'no');

        var NodeLi = document.createElement('li');
        NodeLi.appendChild(NodeA);

        hookNode.insertBefore(NodeLi, sourceNode.parentNode.nextSibling.nextSibling);
      }
    }
  }

})();
