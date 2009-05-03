/*
uso - screen.css - (c) 2009+ Marti Martz (http://userscripts.org/users/37004)

LICENSE
=======
This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the
Free Software Foundation; version 3 of the License or any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA


CHANGELOG
=========
http://userscripts.org/topics/{}

*/

// ==UserScript==
// @name          uso - screen.css
// @namespace     http://userscripts.org/users/37004
// @description   Corrects any discovered issues with screen.css that come into my scope until uso gets around to fixing and sometimes it will do nothing.
// @copyright     2009+, Marti Martz (http://userscripts.org/users/37004)
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       0.0.1
// @include       http://userscripts.org/*
// ==/UserScript==

(function() {

  var CSS = <><![CDATA[

    td { text-align: inherit; }

  ]]></> + "";

  GM_addStyle(CSS);

})();