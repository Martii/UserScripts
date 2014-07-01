[toTop]: #body "Top"
[toBottom]: #footer "Bottom"
[toUserContent]: #user-content "Top of User Content"

[&#x2B06;][toTop] [&#x2B07;][toBottom] [&#x21EA;][toUserContent]

## ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/info16.png) [CHANGELOG](https://github.com/Martii/UserScripts/commits/master/lib/GM_setStyle)

* *No miscellaneous notes at this time*

[&#x2B06;][toTop] [&#x2B07;][toBottom] [&#x21EA;][toUserContent]

## ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/info16.png) NOTES

* This API library is not frozen yet
* Return values may not be present with `@run-at document-start` in this implementation depending on the status of [upstream#1384](https://github.com/greasemonkey/greasemonkey/issues/1384)... In these situations use the callback object parameter instead.
* Comments are removed from CSS by design during validation. :)

[&#x2B06;][toTop] [&#x2B07;][toBottom] [&#x21EA;][toUserContent]

## ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/info16.png) Overview
Alternative to using [GM_addStyle](http://sourceforge.net/p/greasemonkey/wiki/GM_addStyle/) with validation and "pretty" simple formatting

To be used with [@require](http://sourceforge.net/p/greasemonkey/wiki/Metadata_Block/#require). It won't do any good if installed directly.

**NOTE**: Firefox 3.6.x has some issues so validation and formatting will not occur if the ability is not present.

More details to come as they develop. :)

[&#x2B06;][toTop] [&#x2B07;][toBottom] [&#x21EA;][toUserContent]

## ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/info16.png) Compatibility Matrix

![][c]![][ch] | ![][ch][![Mozilla Firefox][imgfx]][urlfx]![][ch] | ![][ch][![Mozilla Seamonkey][imgsm]][urlsm]![][ch] | ![][ch][![Apple Safari][imgsi]][urlsi]![][ch] | ![][ch][![Opera Software Opera][imgoa]][urloa]![][ch] | ![][ch][![Microsoft Internet Explorer][imgie]][urlie]![][ch] | [![Chromium Projects Chromium][imgcm]][urlcm][![Google Chrome][imgce]][urlce] | &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
:-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----:
![Linux][imgtux]![][ch]     | [![Greasemonkey][imggmao]][urlgmao] [![Greasemonkey prc][imggmsf]][urlgmsf] | [![Greasemonkey Port][imggpsf]][urlgpsf]  | &ndash; | &ndash; | &ndash; | &ndash;
![Macintosh][imgmac]![][ch] | [![Greasemonkey][imggmao]][urlgmao] [![Greasemonkey prc][imggmsf]][urlgmsf] | [![Greasemonkey Port][imggpsf]][urlgpsf]  | &ndash; | &ndash; | &ndash; | &ndash;
![Windows][imgwin]![][ch]   | [![Greasemonkey][imggmao]][urlgmao] [![Greasemonkey prc][imggmsf]][urlgmsf] | [![Greasemonkey Port][imggpsf]][urlgpsf] | &ndash; | &ndash; | &ndash; | &ndash;

* Use this compatibility matrix to determine if this script is right for your system. Find the platform on the left and find your browser on the top. Where they intersect is the compatibility.

[c]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clear16.png
[ch]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png
[imgwin]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/windows60x24.png "Windows"
[imgtux]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/linux60x24.png "Linux"
[imgmac]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/macintosh60x24.png "Macintosh"
[imgfx]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/firefox60x24.png "Mozilla Firefox"
[imgsm]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/seamonkey60x24.png "Mozilla Seamonkey"
[imgsi]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/safari60x24.png "Apple Safari"
[imgoa]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/opera60x24.png "Opera Software Opera"
[imgie]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/iexplorer60x24.png "Microsoft Internet Explorer"
[imgcm]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/chromiumx30x24.png "Chromium Projects Chromium"
[imgce]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/chromex30x24.png "Google Chrome"
[imggmao]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/amogreasemonkey16.png "Greasemonkey on Moz"
[imggmsf]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/sfgreasemonkey16.png "Greasemonkey on SF"
[imggpsf]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/gmport16.png "Greasemonkey Port"
[imgtmgo]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/tampermonkey16.png "TamperMonkey"
[imgvmoa]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/violentmonkey16.png "Violent monkey"
[imgiwi]: https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/iw16.png "uso - installWith"
[imggmc]: https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/master/gm_config_icon.png "GM_config"
[urlfx]: https://www.getfirefox.com/
[urlsm]: http://www.seamonkey-project.org/
[urlsi]: http://www.apple.com/safari/
[urloa]: http://www.opera.com/
[urlie]: http://www.microsoft.com/windows/internet-explorer/
[urlcm]: http://dev.chromium.org/chromium-projects
[urlce]: http://www.google.com/chrome/
[urlgmao]: https://addons.mozilla.org/firefox/addon/748
[urlgmsf]: https://sf.net/projects/greasemonkey/files/
[urlgpsf]: https://sf.net/projects/gmport/files/
[urltmgo]: http://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo
[urlvmop]: http://addons.opera.com/extensions/details/violent-monkey/?hidemessage=1
[urliwi]: https://openuserjs.org/scripts/marti/httpuserscripts.orgusers37004/uso_-_installWith
[urlgmc]: https://github.com/sizzlemctwizzle/GM_config/wiki/

[&#x2B06;][toTop] [&#x2B07;][toBottom] [&#x21EA;][toUserContent]

## ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/info16.png) Syntax

Quick example until full API listing can be created *(possibly some more features too)*

``` javascript
let styleNode = GM_setStyle({

  // OPTIONAL: Set the node to reuse... use null to return cssText instead of styleNode
  node: styleNode,

  // OPTIONAL: Set the media attribute
  media: "screen, projection",

  // OPTIONAL: The CSS to use... supports CDATA Multi-line XMLLists DIRECTLY!
  data: ".selectorA { rule: value; } #selectorB { position: fixed }",

  // OPTIONAL: How to reassemble the rules... default is newline character
  space: "\n",

  // OPTIONAL: Callback usually for use with @run-at document-start
  callback: function () {
    console.log([
      this.node,
      this.data
    ].join('\n'));
  }

});
```

[&#x2B06;][toTop] [&#x2B07;][toBottom] [&#x21EA;][toUserContent]
