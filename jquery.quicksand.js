/*

Quicksand 1.0

Reorder and filter items with a nice shuffling animation.

Copyright (c) 2010 Jacek Galanciak (razorjack.net) and agilope.com
Big thanks for Piotr Petrus (riddle.pl) for deep code review and wonderful docs & demos.

Dual licensed under the MIT and GPL version 2 licenses.
http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
http://github.com/jquery/jquery/blob/master/GPL-LICENSE.txt

Project site: http://razorjack.net/quicksand
Github site: http://github.com/razorjack/quicksand

*/


(function ($) {
	$.fn.quicksand = function (collection, customOptions) {
		var options = {
			duration: 750,
			easing: 'swing',
			attribute: 'data-id', // attribute to recognize same items within source and dest
			adjustHeight: true // put false if you don't want the plugin to adjust height of container to fit all the items
		};
		$.extend(options, customOptions);
		options.selector = null;
		$.extend(options, {selector: '> *'});
		
		var callbackFunction;
		if (typeof(arguments[1]) == 'function') {
			var callbackFunction = arguments[1];
		} else if (typeof(arguments[2] == 'function')) {
			var callbackFunction = arguments[2];
		}
		
		// get CSS path of the node
		// indentifies the owner of the temporary container
		// helping to clean it up after interrupted animation
		function cssPath(node) {
			var nodes = []
			var name = $(node).get(0).nodeName.toLowerCase();
			if ($(node).attr('id')) {
				name += '#' + $(node).attr('id');
			}
			nodes.push(name);
			$(node).parentsUntil("html").each(function () {
				name = $(this).get(0).nodeName.toLowerCase();
				if ($(this).attr('id')) {
					name += '#' + $(this).attr('id');
				}
				nodes.push(name);
			});
			return nodes.reverse().join(' > ');
		}	
		
		return this.each(function (i) {
			var $collection = $(collection).clone(); // destination (target) collection
			var $sourceParent = $(this); // source, the visible container of source collection
			var sourceHeight = $(this).css('height'); // used to keep height and document flow during the animation
			var offset = $($sourceParent).offset(); // offset of visible container, used in animation calculations
			var offsets = []; // coordinates of every source collection item
			
			// both variables are used to correct positioning within bordered body
			var leftBorderCorrection = parseFloat($('body').css('border-left-width'));
			var topBorderCorrection = parseFloat($('body').css('border-top-width'));
			
			var $source = $(this).find(options.selector); // source collection items
			
			// used to correct coordinates when any container node has position: relative
			var relativeTop = 0;
			var relativeLeft = 0;
			
			// Gets called when any animation is finished
			var postCallbackPerformed = 0; // prevents the function from being called more than one time
			var postCallback = function () {
				if (!postCallbackPerformed) {
					$sourceParent.html($dest.html()); // put target HTML into visible source container				
					$("[data-quicksand-owner=" + cssPath($sourceParent) + "]").remove(); // remove all temporary containers
					if (typeof callbackFunction == 'function') {
						callbackFunction.call(this);
					}
					postCallbackPerformed = 1;
				}
			};

			// keeps nodes after source container, holding their position
			$sourceParent.css('height', $(this).height());
			
			// find first position: relative node and set it as a point of reference compatible with position: absolute	
			$($source.parentsUntil("html").toArray().reverse()).each(function (i) {
				if ($(this).css('position') == 'relative') {
					o = $(this).offset();
					relativeTop = o.top;
					relativeLeft = o.left;
				}
			});

			// get positions of source collections
			$source.each(function (i) {
				offsets[i] = $(this).offset();
			});
			
			// stops previous animations on source container
			$(this).stop();	
			
			$source.each(function (i) {
				$(this).stop(); // stop animation of collection items
				
				// This doesn't move any element at all, just sets position to absolute
				// and adjusts top & left to make them compatible with position: absolute
				$(this)
				  .css('position', 'absolute')
				  .css('margin', 0)
				  .css('top', offsets[i].top - parseFloat($(this).css('margin-top')) + topBorderCorrection - relativeTop)
				  .css('left', offsets[i].left - parseFloat($(this).css('margin-left')) + leftBorderCorrection - relativeLeft);

			});
			
			// cleate temporary container with destination collection
			var $dest = $($sourceParent)
				.clone()
				.html('')
				.attr('id', '')
				.attr("data-quicksand-owner", $sourceParent.selector)
				.css('height', 'auto')
				.css('width', $sourceParent.width() + 'px')
				.append($collection);
				
			// insert node into HTML
			// Note that the node is under visible source container in the exactly same position
			// The browser render all the items without showing them (opacity: 0.0)
			// No offset calculations are needed, the browser just extracts position from underlayered destination items
			// and sets animation to destination positions.
			$dest.insertBefore($sourceParent).css('z-index', -1)
										     .css('opacity', 0.0)
										     .css('margin', 0.0)
										     .css('position', 'absolute')
										     .css('top', offset.top + topBorderCorrection - relativeTop)
										     .css('left', offset.left + leftBorderCorrection - relativeLeft)
											 .attr('data-quicksand-owner', cssPath($sourceParent));		
			
			// If destination container has different height than source container
			// the height can be animated, adjusting it to destination height
			if (options.adjustHeight) {
				$sourceParent.animate({height: $dest.height()}, options.duration, options.easing, function (e) {
					$sourceParent.css('height', 'auto');
				});
			}
			
			
			
			// Now it's time to do shuffling animation
			// First of all, we need to identify same elements within
			
			$source.each(function (i) {
				var destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
				if (destElement.length) {
					// The item is both in source and destination collections
					// It it's under different position, let's move it
					if ($.browser.msie) {
						// Got IE and want gorgeous scaling animation?
						// Kiss my butt
						$(this).animate({top: destElement.offset().top + topBorderCorrection - relativeTop, left: destElement.offset().left + leftBorderCorrection - relativeLeft, opacity: 1.0}, options.duration, options.easing, postCallback);
					} else {
						$(this).animate({top: destElement.offset().top + topBorderCorrection - relativeTop, left: destElement.offset().left + leftBorderCorrection - relativeLeft, opacity: 1.0, scale: '1.0'}, options.duration, options.easing, postCallback);
					}
				} else {
					// The item from source collection is not present in destination collections
					// Let's remove it
					if ($.browser.msie) {
						$(this).animate({opacity: '0.0'}, options.duration, options.easing, postCallback);
					} else {
						$(this).animate({opacity: '0.0', scale: '0.0'}, options.duration, options.easing, postCallback);
					}
				}
			});
			
			$collection.each(function (i) {
				// Grab all items from target collection not present in visible source collection
				var sourceElement = $source.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
				var destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
				var animationOptions;
				if (sourceElement.length === 0) {
					// No such element in source collection...
					if ($.browser.msie) {
						// Are you still using IE? Come on...
						animationOptions = {
							opacity: '1.0'
						};
					} else {
						animationOptions = {
							opacity: '1.0',
							scale: '1.0'
						};
					}
					// Let's create it
					destElement
					  .clone()
						.css('position', 'absolute')
						.css('margin', 0.0)
						.css('top', destElement.offset().top + topBorderCorrection - relativeTop)
						.css('left', destElement.offset().left + leftBorderCorrection - relativeLeft)
						.css('opacity', 0.0)
						.css('transform', 'scale(0.0)')
						.appendTo($sourceParent)
						.animate(animationOptions, options.duration, options.easing, postCallback);
				}
			});
		});
	};
})(jQuery);