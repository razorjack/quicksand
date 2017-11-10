jQuery Quicksand plugin release notes
=====================================

v1.6.0
------

-   added bower.json file
-   *breaking change*: changed the way `adjustWidth` and `adjustHeight`
    settings work. `false` leaves these values alone (useful on responsive
    pages), `'call'` sets it before or after the call (determined
    automatically), `'auto'` sets them to `auto`

v1.5.0
------

-   added package.json file and published the library as npm package
-   the plugin is now exported using Universal Module Definition
-   *potentially breaking*: modernized approach to CSS3 scaling,
    we're now using a different dependency:
    (jquery.transform2d.js)[jquery.transform2d.js]
-   improved jQuery compatibility, we're now compatible with 1.6.1+,
    2.0+, 3.0+
-   Quicksand's cloning now includes all event handlers, making it effortless
    to integrate with other enhancement plugins. `enhancement` parameter should
    no longer be needed in most cases
-   fixed `this` scoping issue in callback function

This release was meda possible by:

- [liamim](https://github.com/liamim)
- [seethroughtrees](https://github.com/seethroughtrees)
- [seanhussey](https://github.com/seanhussey)
- [Connum](https://github.com/Connum)

v1.4.0
------

-   detect IE versions more reliably so that we don't skip animation for
    capable IE versions
-   added support for animating canvas elements
-   replaced browser detection with feature detection for CSS3 scaling
-   improved compatibility so that the plugin works with jQuery 1.3+,
    including 1.10 and 2.0
-   fixed transform animation not animating in

This release was meda possible by:
[`kachkaev":https://github.com/kachkaev, "`awshout](https://github.com/awshout),
[`Shotster":https://github.com/Shotster, "`iblamefish](https://github.com/iblamefish)

v1.3.0
------

-   added `maxWidth` option
-   added `atomic` option
-   added `adjustWidth` option
-   tweaked the plugin for better compatibility with responsive designs
-   made the plugin re-use existing DOM elements instead of replacing
    them with new collection
-   added Internet Explorer 10 and Windows 8 tweaks
-   minor bug fixes and improvements

This release was made possible by:
[`arlm":https://github.com/arlm, "`databyte](https://github.com/databyte),
[`dalyons":https://github.com/dalyons, "`beedesk](https://github.com/beedesk),
[`kiwiupover":https://github.com/kiwiupover and "`JonMcL](https://github.com/JonMcL).

v1.2.2
------

\- fixed Internet Explorer NaN issue\
- fixed blinking in webkit-based browsers caused by callback race
conditions

v1.2.1
------

\- added `enhancement` option, making it possible to easily integrate
Quicksand with visual enhancements such as font replacement

v1.2
----

\- replacing jQuery .css calls with raw JavaScript .style and removing
temporary container improved performance (15--40 faster) when preparing
the animation

\- solved initial animation slowdowns

\- added custom attribute functions: instead of providing HTML attribute
with unique string, you can specify a function to extract the value:
\$('\#source').quicksand('\#dest li', {attribute: function(v) { return
\$(v).find('img').attr('src')} }); please note that although looks
handy, it could be a bit more laggy

\- added useScaling option so that you can disable scaling animation for
performance reasons (helps a lot on slower machines)

\- extended adjustHeight capabilities: from now you can set it to
dynamic, auto or false\
- greatly improved smoothness of the animation

v1.1
----

\- Fixed issues with position: relative

\- Fixed occasional flickering

\- Moderate performance improvements

\- Disabled any animation in IE6 for more safety\
- Added support for jQuery 1.3

v1.0
----

First, feature-complete release of jQuery Quicksand plugin.
