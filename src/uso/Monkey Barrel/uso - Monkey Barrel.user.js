(function() {

// ==UserScript==
// @run-at        document-start
// @name          uso - Monkey Barrel
// @namespace     http://userscripts.org/users/37004
// @description   Enhanced menu system for Userscripts.org
// @copyright     2011+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license       (CC); http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version       0.0.21
// @icon          http://s3.amazonaws.com/uso_ss/icon/114843/large.png
//
// @include   /^https?:\/\/userscripts\.org\/.*/
// @include   http://userscripts.org/*
// @include   https://userscripts.org/*
//
// @require   https://userscripts.org/scripts/source/115323.user.js
// @require   https://raw.github.com/sizzlemctwizzle/GM_config/165a1f15d907c21d389cb037c24824885d278693/gm_config.js
//
// ==/UserScript==

/*

CHANGELOG
=========
http://userscripts.org/topics/89961

Please note this script uses native JSON and native classList which requires Firefox 3.6.x+ and Greasemonkey 0.9.8+

*/

  function findlastPost(aTopicid) {
    if (document && document.body)
      window.document.body.style.cursor = "progress";

    GM_xmlhttpRequest({
      retry: 5,
      url: window.location.protocol + "//" + window.location.host + "/topics/" + aTopicid + ".rss",
      method: "GET",
      onload: function (xhr) {
        switch (xhr.status) {
          case 502:
          case 503:
            if (--this.retry > 0)
              setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
            else {
              if (document && document.body)
                window.document.body.style.cursor = "auto";
            }
            break;
          case 200:
            let doc = new DOMParser().parseFromString(xhr.responseText, "text/xml"),
                xpr = doc.evaluate(
                    "//channel/item/link",
                    doc.documentElement,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                );

            if (xpr && xpr.singleNodeValue) {
              let thisNode = xpr.singleNodeValue;

              if (/^https?:\/\/userscripts\.org\/posts\/\d+\/?/i.test(thisNode.textContent)) {
                let url = thisNode.textContent.replace(/http:/i, window.location.protocol);
                GM_xmlhttpRequest({
                  retry: 5,
                  url: thisNode.textContent.replace(/http:/i, window.location.protocol),
                  method: "HEAD",
                  onload: function (xhr) {
                    // NOTE: Secure xhr is prevented currently on USO and GM_xhr currently has an issue with onreadystatechange in FF 7.0.1,
                    //       so rely upon finalUrl in unsecure mode but redirect to secure
                    switch (xhr.status) {
                      case 502:
                      case 503:
                        if (--this.retry > 0)
                          setTimeout(GM_xmlhttpRequest, 3000 + Math.round(Math.random() * 5000), this);
                        else {
                          if (document && document.body)
                            window.document.body.style.cursor = "auto";
                        }
                        break;
                      case 200:
                        if (document && document.body)
                          window.document.body.style.cursor = "auto";

                        window.location.assign(xhr.finalUrl.replace(/^http:/i, window.location.protocol));
                        break;
                      default:
                        if (document && document.body)
                          window.document.body.style.cursor = "auto";
                        break;
                    }
                  }
                });
              }
            }
            break;
          default:
            if (document && document.body)
              window.document.body.style.cursor = "auto";
          break;
        }
      }
    });
  }

  // ** "load into view" e.g. use accelerator if #posts-last
  if (window.location.hash == "#posts-last") {
    let topicid = window.location.pathname.match(/\/topics\/(\d+)/i);
    if (topicid)
      findlastPost(topicid[1]);
  }

  function onDOMContentLoaded() {
    document.removeEventListener("DOMContentLoaded", onDOMContentLoaded, true);

    if (window.location.hash == "#posts-last")
      window.document.body.style.cursor = "progress";

    let gCSS = GM_setStyle({
        media: "screen, projection"
    });

    if (typeof GM_configStruct != "undefined") {
      // Save some memory
      delete GM_config;

      var gmc = new GM_configStruct();
      gmc.id = "gmc114843";

      var divNode = document.getElementById("full_description");

      if (divNode && !divNode.firstChild) {
        var newdivNode = document.createElement("div");
        divNode = divNode.appendChild(newdivNode);
      }
      else {
        var newdivNode = document.createElement("div");
        if (divNode)
          divNode = divNode.insertBefore(newdivNode, divNode.firstChild);
        else
          divNode = document.body.appendChild(newdivNode);
      }

      /* Nearest fix for a glitch on USO */
      let scriptNav = document.getElementById("script-nav");
      if (scriptNav && divNode && scriptNav.clientWidth != divNode.clientWidth)
        GM_setStyle({
            node: gCSS,
            data: <><![CDATA[

                div #full_description { width: 98.1%; }

            ]]></>
        });

      let screenShots = document.getElementById("screenshots");
      if (screenShots)
        GM_setStyle({
            node: gCSS,
            data: <><![CDATA[

                #full_description { clear: left; }

            ]]></>
        });

      /* Nearest fix for userscripts.org Alternate CSS */
      let fullDescription = document.getElementById("full_description");
      if (fullDescription && screenShots && fullDescription.clientWidth > parseInt(screenShots.clientWidth * 1.0275))
        GM_setStyle({
            node: gCSS,
            data: <><![CDATA[

                #screenshots { width: 97.5% !important; }

            ]]></>
        });

      GM_setStyle({
          media: "print",
          data: <><![CDATA[

              #gmc114843 { display: none !important; }

          ]]></>
      });

      gmc.init(
          divNode,
          <><![CDATA[

              <img src="http://s3.amazonaws.com/uso_ss/icon/114843/large.png" alt="uso - Monkey Barrel" title="uso - Monkey Barrel" /> Preferences
              <span><a href="http://gmconfig.sizzlemctwizzle.com/"><img src="http://s3.amazonaws.com/uso_ss/9849/large.png" title="Powered in part by GM_config" /></a></span>

          ]]></> + '',
          /* Custom CSS */
          GM_setStyle({
              node: null,
              data: <><![CDATA[

                  /* GM_config specific fixups */
                  #gmc114843 { border: 1px solid #ddd !important; clear: right !important; height: auto !important; max-height: none !important; max-width: 100% !important; margin: 0 0 0.6em 0 !important; position: static !important; width: auto !important; z-index: 0 !important; }
                  #gmc114843_wrapper { background-color: #eee; padding-bottom: 0.25em; }
                  #gmc114843 .config_header { background-color: #333; color: white; font-size: 1.57em; margin: 0; padding: 0 0 0 0.5em; text-align: left; }
                  #gmc114843 .config_var { clear: both; margin: 0 1em; padding: 0; }
                  #gmc114843 .field_label { color: #333; font-size: 100%; font-weight: normal; }
                  .section_desc { margin: 0.25em 1em !important; }

                  .gmc114843-yellownote { background-color: #ffd; font-size: 0.66em !important; }

                  #gmc114843_header > img { vertical-align: middle; width: 32px; height: 32px; }
                  #gmc114843_header > span { float: right; margin: 0.4em 0.5em; }

                  #gmc114843_section_header_0 { color: inherit !important; background-color: inherit !important; font-size: inherit !important; border-style: none !important; text-align: left !important; }
                  #gmc114843_section_0 { margin: 0 1em; }
                  #gmc114843_jsonMenus_var { margin: -1.0em 0 -1em 0 !important; }

                  #gmc114843_field_jsonMenus { font-size: 1em; min-width: 98.28%; max-width: 98.28%; margin-top: 1em; min-height: 15.2em; height: 15.2em; }

                  #gmc114843_field_importGroups,
                  #gmc114843_field_enableUnstick
                  { top: 0.07em; }

                  #gmc114843_importGroups_field_label p { margin-left: 1.5em; }

                  #gmc114843_saveBtn { margin: 0.4em 1.2em !important; padding: 0 3.0em !important; }
                  #gmc114843_resetLink { margin-right: 2.5em; }
                  #gmc114843_closeBtn { display: none; }

              ]]></>
          }),

          /* Settings object */
          {
            'jsonMenus': {
                "section": ["Main menus"],
                "type": 'textarea',
                "label": "<p><em class='gmc114843-yellownote'>use <a href='http://json.org/'>JSON</a> data-interchange format.</em></p>",
                "default": JSON.stringify(JSON.parse(<><![CDATA[

                    {
                    "Monkey Barrel": [
                      "/scripts/show/114843",
                      {
                      "recent comments": "/comments",
                      "recent posts": "/posts",
                      "recent reviews": "/reviews",
                      "recent spam votes": "/spam",
                      "recent images": "/images",
                      "spam and malware \u00bb": "/topics/9#posts-last",
                      "cookie stealing scripts \u00bb": "/topics/704#posts-last",
                      "custom search": "/search"
                      }
                     ]
                    }

                ]]></> + ''), null, " ")
            },
            'enableUnstick': {
                "type": 'checkbox',
                "label": 'Unstick submenus',
                "default": true
            },
            'importGroups': {
                "type": 'checkbox',
                "label": 'Enable automatic import for subscribed Groups when clicked',
                "default": true
            }
          }
      );

      gmc.onOpen = function () {
        gmc.fields["jsonMenus"].node.setAttribute("spellcheck", "false");
      }

      gmc.onSave = function () {
        try {
          gmc.set("jsonMenus", JSON.stringify(JSON.parse(gmc.get("jsonMenus")), null, " "));
          gmc.write();
          gmc.close();
          gmc.open();
        }
        catch (e) {
          alert('ERROR: Invalid JSON for main menu.\n\nPlease correct or reset to defaults');
        }
      }

      if (window.location.pathname.match(/\/scripts\/show\/114843/i)) {
        gmc.open();
      }

      // -------------------------------------------------------------------------------------------------------------------------------------------------
      GM_setStyle({
        node: gCSS,
        data: <><![CDATA[

            #header #mainmenu { padding-top: 0; } /* Fix USO */

            .hid { display: none; }
            .mainmenu- { position: fixed; z-index: 1; margin: 0; list-style: none outside none; }
            .mainmenu- li { -moz-border-radius: 0 !important; border-radius: 0 !important; margin: 0 !important; float: none !important; background: #000 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAZCAQAAABamYz0AAAAAXNSR0IArs4c6QAAAB5JREFUCNdjuOfAxPCPieEvDP1D4v5DIv/iEEcIAgClTRkR4R/Z1AAAAABJRU5ErkJggg==) repeat-x scroll left top !important; }
            .mainmenu- li a { color: #fff !important; }

          ]]></>
      });

      function onresize(ev) {
        let xpr = document.evaluate(
          "//div[@id='top']/div[@class='container']",
          document.body,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        if (xpr && xpr.singleNodeValue) {
          let thisNode = xpr.singleNodeValue;

          let width = parseFloat(window.getComputedStyle(thisNode, null).getPropertyValue("width").replace(/px$/i, "")); // NOTE: Returns normalized used instead of computed
          if (width <= 950) {
            let mainmenu = document.getElementById("mainmenu");
            if (mainmenu)
              mainmenu.style.setProperty("margin-right", (document.body.clientWidth - width) / 2 + "px", "");
          }
          else
            return true;

        }
        if (!ev)
          return false;
      }

      if (gmc.get("enableUnstick")) {
        GM_setStyle({
          node: gCSS,
          data: <><![CDATA[

              #header > .container { position: static; }
              .mainmenu- { position: absolute; }

          ]]></>
        });

      if (!onresize())
        window.addEventListener("resize", onresize, false);
      }

      // ** Event listeners
      function onmouseover(ev) {
        this.firstChild.nextSibling.classList.remove("hid");
      };

      function onmouseout(ev) {
        this.firstChild.nextSibling.classList.add("hid");
      };

      // ** Generator functions
      function createMenuItem(aTextContent, aHref) {
        let aNode = document.createElement("a");
        aNode.href = aHref;
        aNode.textContent = aTextContent;

        if (aNode.href.match(/\/topics\/\d+\#posts\-last$/i))
          aNode.addEventListener("click", lastPost, false);

        let liNode = document.createElement("li");

        return liNode.appendChild(aNode).parentNode;
      }

      function createMenuItems(aList, aItems) {
        for (let item in aItems)
          aList.appendChild(createMenuItem(item,aItems[item]));

        return aList;
      }

      function createMenu(aMenu) {
        let ulNode = document.createElement("ul");
        ulNode.className = "mainmenu-";
        ulNode.classList.add("hid");

        return createMenuItems(ulNode, aMenu[1]);
      }

      // ** Accelerator function
      function lastPost(ev) {
        let topicid = ev.target.href.match(/\/topics\/(\d+)\#posts\-last/i);
        if (!topicid)
          return;

        ev.preventDefault();

        findlastPost(topicid[1]);
      };

      // ** Retrieve the stored menus
      let mainmenu;
      try {
        mainmenu = JSON.parse(gmc.get("jsonMenus"));
      }
      catch (e) {
        if (window.location.pathname != "/scripts/show/114843") {
          alert('ERROR: Invalid JSON for main menu found in uso - Monkey Barrel.\n\nPlease correct or reset to defaults');

          window.location.pathname = "/scripts/show/114843";
        }
        return;
      }

      // If on /groups and allowed then read in values from sidebar
      if (gmc.get("importGroups") && window.location.pathname == "/groups") {
        let xpr = document.evaluate(
              "//div[@id='right']/h3[starts-with(.,'Groups you created')]/following-sibling::ul[1]/li/a"
            + "|//div[@id='right']/h3[starts-with(.,'Groups you joined')]/following-sibling::ul[1]/li/a",
            document.body,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        if (xpr.snapshotLength > 0) {
          if (!mainmenu["Groups"])
            mainmenu["Groups"] = [ "/groups", {} ];

          for (let i = 0, thisNode; thisNode = xpr.snapshotItem(i++);) {
            mainmenu["Groups"][1][thisNode.textContent] = thisNode.pathname;
          }

          // Resave the JSON menus silently
          gmc.set("jsonMenus", JSON.stringify(mainmenu, null, " "));
          gmc.write();
        }
      }

      // ** Paint the menus
      let mm = document.getElementById("mainmenu");
      if (mm) {
        let xpr = document.evaluate(
            "./li/a[.='Monkey Barrel']",
            mm,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        if (xpr && xpr.singleNodeValue)
          return;

        mm.appendChild(createMenuItem("Monkey Barrel", "/scripts/show/114843"));

        // Get existing menu items and then send off to functions
        document.evaluate(
            "./li",
            mm,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            xpr
        );

        for (let i = 0, thisNode; thisNode = xpr.snapshotItem(i++);) {
          let aNode = thisNode.firstChild;

          if (mainmenu[aNode.textContent]) {
            thisNode.appendChild(createMenu(mainmenu[aNode.textContent]));
            thisNode.addEventListener("mouseover", onmouseover, false);
            thisNode.addEventListener("mouseout", onmouseout, false);
          }
        }
      }

    }
  }

  document.addEventListener("DOMContentLoaded", onDOMContentLoaded, true);

})();
