// ==UserScript==
// @name          uso - screen.css
// @namespace     http://userscripts.org/users/37004
// @description   Corrects any discovered issues with screen.css that come into my scope until uso gets around to fixing and sometimes it will do nothing.
// @copyright     2009+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       0.0.2
// @include       http://userscripts.org/*
// @require       http://usocheckup.dune.net/index.php?scriptid=48071
// ==/UserScript==

(function() {

  var CSS = <><![CDATA[

    td { text-align: inherit; }

  ]]></> + "";

  GM_addStyle(CSS);

})();