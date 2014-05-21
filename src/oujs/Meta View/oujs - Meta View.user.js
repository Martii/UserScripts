(function() {
  'use strict'

// ==UserScript==
// @name          oujs - Meta View
// @namespace     https://openuserjs.org/users/Marti
// @description   Adds a button next to the View Source titled View Meta and opens a phantom url to show the detected metadata block
// @copyright     2014+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version       1.0.0rc2pre
// @icon          https://www.gravatar.com/avatar/e615596ec6d7191ab628a1f0cec0006d?r=PG&s=48&default=identicon

// @include  /^https?://openuserjs\.org(?::\d{1,5})?/scripts//

// @include  https://openuserjs.org/scripts/*/*/*

// @grant  GM_addStyle
// @grant  GM_deleteValue
// @grant  GM_getValue
// @grant  GM_setValue
// @grant  GM_xmlhttpRequest

// ==/UserScript==

  GM_addStyle(
    [
      '.sr-meta-button { font-size: 1.6em; height: 25px; position: relative; top: -16px; width: 130px; }',
      '.lib-meta-button { margin: 25px 0 0 !important; }'

    ].join('\n')
  );


  if (/\/meta$/.test(location.pathname)) { // NOTE: Currently a 404 page
    var pNode = document.querySelector('.content-box p');
    if (pNode && /The\sfile\sor\sfolder\swas\snot\sfound/.test(pNode.textContent)) {
        var hookNode = pNode.parentNode;

        // Reset div
        hookNode.removeAttribute('class');
        hookNode.id = 'main';

        // Remove p node
        hookNode.removeChild(pNode);

        // Simulate a View Source page
        var ace_text_inputNodeTextarea = document.createElement('textarea');
        ace_text_inputNodeTextarea.classList.add('ace_text_input');
        ace_text_inputNodeTextarea.wrap = 'off';
        ace_text_inputNodeTextarea.setAttribute('spellcheck', 'false');
        ace_text_inputNodeTextarea.style = 'opacity: 1; height: 15px; width: 99.4%; min-width: 99.4%; max-width: 99.4%; height: 400px; right: 1108px; bottom: 535px;';
        ace_text_inputNodeTextarea.setAttribute('readonly', '');

        ace_text_inputNodeTextarea.value = GM_getValue('responseText', 'no data found in storage');

        var editorNodePre = document.createElement('pre');
        editorNodePre.classList.add('ace_editor');
        editorNodePre.classList.add('ace_dawn');
        editorNodePre.id = 'editor';

        editorNodePre.appendChild(ace_text_inputNodeTextarea);
        hookNode.appendChild(editorNodePre);


        GM_addStyle(
          [
            '#editor { height: 550px; margin-left: auto; margin-right: auto; position: relative; width: 70%; }',
            '.ace-dawn { background-color: #F9F9F9; color: #080808; }',
            '.ace_editor { direction: ltr; font-family: "Monaco","Menlo","Ubuntu Mono","Consolas","source-code-pro",monospace; font-size: 12px; line-height: normal; overflow: hidden; position: relative;}'

          ].join('\n')
        );

        var titleNode = document.head.querySelector('title');
        if (titleNode) {
          var title = GM_getValue('scriptTitle', '');
          titleNode.textContent = 'Meta View ' + (title ? ' ' + title : '');
        }
    }

    // Erase keys
    GM_deleteValue('scriptTitle');
    GM_deleteValue('responseText');
  }
  else {
    var sr_source_buttonNode = document.querySelector('.sr-source-button');
    if (sr_source_buttonNode) {
      var hookNode = sr_source_buttonNode.parentNode;

      var sr_install_buttonNode = document.querySelector('.sr-install-button');
      if (sr_install_buttonNode) {
        var installURL = sr_install_buttonNode.parentNode.href;

        var sr_meta_buttonNode = document.createElement('button');
        sr_meta_buttonNode.classList.add('sr-button');
        sr_meta_buttonNode.classList.add('sr-meta-button');
        sr_meta_buttonNode.classList.add('lib-meta-button');
        sr_meta_buttonNode.type = 'button';
        sr_meta_buttonNode.title = 'View Meta';
        sr_meta_buttonNode.textContent = ' View Meta ';

        sr_meta_buttonNode.addEventListener('click', function (ev) {
          ev.preventDefault();

          GM_xmlhttpRequest({
            method: 'GET',
            url: installURL,
            headers: {
              'Accept': 'text/x-userscript-meta'
            },
            onload: function(xhr) {
              console.log('META VIEW REQUEST SUMMARY');

              console.group();

              console.log(
                [
                  '',
                  'method: ' + this.method,
                  'url: ' + this.url,
                  'headers: ' + JSON.stringify(this.headers, null, ''),
                  ''

                ].join('\n')
              );

              console.group();

              console.log(
                [
                  '',
                  xhr.status,
                  xhr.statusText,
                  xhr.readyState,
                  xhr.responseHeaders,
                  xhr.finalUrl,
                  ''

                ].join('\n')
              );
              console.groupEnd();

              console.groupEnd();

              GM_setValue('responseText', xhr.responseText);

              var sr_script_title = document.querySelector('.sr-script-title');
              if (sr_script_title)
                GM_setValue('scriptTitle', sr_script_title.firstChild.textContent.replace(/\-\s$/, '').trim());
              else
                GM_setValue('scriptTitle', '');

              location.pathname = location.pathname + '/meta';
            }
          });

          var thisNode = ev.target;
        });

        hookNode.appendChild(sr_meta_buttonNode);
      }
    }
  }

})();
