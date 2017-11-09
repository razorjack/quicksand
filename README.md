Quicksand
=========

jQuery plugin for reordering and filtering items with a nice shuffling
animation like the one [in this
video](http://www.viddler.com/explore/37signals/videos/90/8.805/).

Project site: <http://razorjack.net/quicksand>.

Demos & docs
------------

Please visit [the project site](http://razorjack.net/quicksand) for live
demos & documentation.

Usage
-----

The following example would filter items in \#content with shuffling
animation, leaving only CMYK colors.

    $("#content").quicksand($("#data > li"), 
      {
        // all the parameters have sensible defaults
        // and in most cases can be optional
        duration: 1000,
        easing: "swing",
        attribute: "data-id",
      }
    );

The markup could look like this:

    <ol id="content" class="grid">
      <li data-id="red">Red</li>
      <li data-id="green">Green</li>
      <li data-id="blue">Blue</li>
      <li data-id="black">Black</li>
      <li data-id="white">White</li>
      <li data-id="yellow">Yellow</li>
      <li data-id="cyan">Cyan</li>
      <li data-id="magenta">Magenta</li>    
    </ol>

    <ol id="data" style="display: none;">
      <li data-id="cyan">Cyan</li>
      <li data-id="magenta">Magenta</li>
      <li data-id="yellow">Yellow</li>
      <li data-id="black">Black</li>    
    </ol>

Please note that you need to set additional attribute (you can specify
which one in options hash, by default it's data-id) so that the plugin
can identify same elements within source and destination collections.

No additional CSS is required for the plugin to work. However, you
should avoid styling the subject container using id selectors ----
please use class instead.

-   the subject (`#content`) is a container visible for the user
-   the first parameter ( `$("#data > li")` ) should contain a
    collection which will replace contents of the subject
-   `duration` - specifies duration (in milliseconds) of the animation
    effect, default: `750`
-   `easing` - animation easing effect, default: `'swing'`
-   `attribute` - attribute containing unique value able to identify
    same item within source and destination collection, default:
    `'data-id'`
-   `adjustHeight` - `'dynamic'` to animate height of the container
    (when the target collection is larger or smaller than source
    collection), `'auto'` to automatically set height before or after
    the animation, `false` to keep container height constant; default:
    `'auto'`
-   `useScaling` - use CSS3 scaling effect, default: false
-   `enhancement` - function that performs custom visual enhancements
    (e.g. font replacements) on newly created items, default:
    `function() {}`

You can specify a callback function as an optional last argument.

Dependencies
------------

-   jQuery 1.3+
-   Optional: jQuery Easing (http://gsgd.co.uk/sandbox/jquery/easing/)
    for additional easing options
-   Optional: jquery-animate-css-rotate-scale.js (www.zachstronaut.com)
    for additional CSS3 scaling animation; works fine without this
    plugin (utilizes fade effect instead)

Browser compatibility
---------------------

Tested under:

-   Safari 4
-   Chrome 4
-   Firefox 3.5
-   Opera 10.15
-   Internet Explorer 7
-   Internet Explorer 8

No Internet Explorer 6 support is planned. Ever. The plugin, however,
does not break your web application on IE6, it just skips the animation
and replaces the collection immediately.

I recommend using the plugin with HTML5 markup but any other option is
fine.

Custom attribute function
-------------------------

If you don't like HTML5 data-\* attributes, you can specify a function
instead.

    $("#content").quicksand($("#data > li"), 
      {
        // all the parameters have sensible defaults
        // and in most cases can be optional
        duration: 1000,
        easing: "swing",
        attribute: "data-id",
        attribute: function(v) {
          // different src of img means: different object
          return $(v).find('img').attr('src');
        }
      }
    );

Integration with enhancement plugins
------------------------------------

Quicksand works fine with other plugins. Please note that:

-   when your items have functional enhancements (e.g. tooltips),
    remember to use callback to apply them on newly cloned objects:

<!-- -->

    $("#content").quicksand($("#data > li"), 
      {
        duration: 1000,
      }, function() { // callback function
        $('#content a').tooltip();
      }
    );

-   when your items are visually enhanced (e.g. font replacement), use
    `enhancement` function to refresh/apply during the animation

<!-- -->

    $("#content").quicksand($("#data > li"), 
      {
        duration: 1000,
        enhancement: function() {
          Cufon.refresh('#content span');
        }
      }
    );

Licensing
---------

Copyright © 2010 [Jacek Galanciak](http://razorjack.net)
[MIT](http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) and
[GPL version
2](http://github.com/jquery/jquery/blob/master/GPL-LICENSE.txt) license.
