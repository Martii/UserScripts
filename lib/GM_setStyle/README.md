## NOTES

* This API library is not frozen yet
* Return values may not be present with `@run-at document-start` in this implementation depending on the status of [upstream#1384](https://github.com/greasemonkey/greasemonkey/issues/1384)... In these situations use the callback object parameter instead.
* Comments are removed from CSS by design during validation. :)

## Overview
Alternative to using [GM_addStyle](http://sf.net/apps/mediawiki/greasemonkey/index.php?title=GM_addStyle) with validation and "pretty" simple formatting

To be used with [@require](http://sf.net/apps/mediawiki/greasemonkey/index.php?title=Metadata_Block#.40require). It won't do any good if installed directly.

**NOTE**: Firefox 3.6.x has some issues so validation and formatting will not occur if the ability is not present.

More details to come as they develop. :)

## Compatibility Matrix
![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clear16.png)![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png)[![Mozilla Firefox](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/firefox16.png "Mozilla Firefox")](https://www.getfirefox.com/)![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png)[![Mozilla Seamonkey](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/seamonkey16.png "Mozilla Seamonkey")](http://www.seamonkey-project.org/)![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png)[![Apple Safari](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/safari16.png "Apple Safari")](http://www.apple.com/safari/)![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png)[![Opera Software Opera](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/opera16.png "Opera Software Opera")](http://www.opera.com/)![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | ![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png)[![Microsoft Internet Explorer](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/iexplorer16.png "Microsoft Internet Explorer")](http://www.microsoft.com/windows/internet-explorer/)![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | [![Chromium Projects Chromium](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/chromium16.png "Chromium Projects Chromium")](http://dev.chromium.org/chromium-projects)[![Google Chrome](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/chrome16.png "Google Chrome")](http://www.google.com/chrome/)
:-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----:
![Linux](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/linux16.png "Linux")![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | [![Greasemonkey](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/greasemonkey16.png "Greasemonkey")](https://addons.mozilla.org/firefox/addon/748) | [![Greasemonkey Port](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/gmport16.png "Greasemonkey Port")](https://sf.net/projects/gmport/files/) | &ndash; | &ndash; | &ndash; | &ndash;
![Macintosh](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/macintosh16.png "Macintosh")![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | [![Greasemonkey](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/greasemonkey16.png "Greasemonkey")](https://addons.mozilla.org/firefox/addon/748) | [![Greasemonkey Port](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/gmport16.png "Greasemonkey Port")](https://sf.net/projects/gmport/files/) | &ndash; | &ndash; | &ndash; | &ndash;
![Windows](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/windows16.png "Windows")![](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/clearhalf16.png) | [![Greasemonkey](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/greasemonkey16.png "Greasemonkey")](https://addons.mozilla.org/firefox/addon/748) | [![Greasemonkey Port](https://raw.githubusercontent.com/Martii/UserScripts/master/res/compatibilityMatrix/gmport16.png "Greasemonkey Port")](https://sf.net/projects/gmport/files/) | &ndash; | &ndash; | &ndash; | &ndash;

## Syntax

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
