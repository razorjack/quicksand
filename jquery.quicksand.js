/*

Quicksand - reorder and filter items with a nice shuffling animation.

Copyright (c) 2010 Jack Galanciak (razorjack.net)

Dual licensed under the MIT and GPL version 2 licenses.
http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
http://github.com/jquery/jquery/blob/master/GPL-LICENSE.txt

Project site: http://razorjack.net/quicksand
Github site: http://github.com/RazorJack/Quicksand

*/

(function ($) {
	$.fn.quicksand = function (collection, customOptions) {
		var options = {
			duration: 750,
			easing: 'swing',
			attribute: 'data-id', // attribute to recognize same items within source and dest
			selector: '> li', // selector for content items in container
			adjustHeight: true // put false if you don't want the plugin to adjust height of container to fit all the items
		};

		$.extend(options, customOptions);
		var $collection = $(collection).clone();	
		return this.each(function (i) {
			var $sourceParent = $(this);
			$sourceParent.css('height', $(this).height());
			var $source = $(this).find(options.selector);
			
			var offsets = [];
			$source.each(function (i) {
				offsets[i] = $(this).offset();
			});
				
			$source.each(function (i) {
				$(this).stop();
				$(this)
				  .css('position', 'absolute')
				  .css('margin', 0)
				  .css('top', offsets[i].top - parseFloat($(this).css('margin-top')))
				  .css('left', offsets[i].left - parseFloat($(this).css('margin-left')));
			});
				
			var $dest = $($sourceParent).clone().html("").attr('id', "").css('height', 'auto').append($collection);
			var postCallbackPerformed = 0;	
			var postCallback = function () {
				if (!postCallbackPerformed) {
					$sourceParent.html($dest.html());
					$dest.remove();
					postCallbackPerformed = 1;
				}
			};
			
			var offset = $($sourceParent).offset();
			$dest.insertBefore($sourceParent).css('z-index', -1)
										     .css('opacity', 0.0)
										     .css('margin', 0.0)
										     .css('position', 'absolute')
										     .css('top', offset.top)
										     .css('left', offset.left);
			
			
			if (options.adjustHeight) {
				$sourceParent.animate({height: $dest.height()}, options.duration, options.easing);
			}

			$source.each(function (i) {
				var destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
				if (destElement.length) {
					if ($.browser.msie) {
						$(this).animate({top: destElement.offset().top, left: destElement.offset().left, opacity: 1.0}, options.duration, options.easing, postCallback);
					} else {
						$(this).animate({top: destElement.offset().top, left: destElement.offset().left, opacity: 1.0, scale: '1.0'}, options.duration, options.easing, postCallback);
					}
				} else {
					if ($.browser.msie) {
						$(this).animate({opacity: '0.0'}, options.duration, options.easing, postCallback);
					} else {
						$(this).animate({opacity: '0.0', scale: '0.0'}, options.duration, options.easing, postCallback);
					}
				}
			});
			$collection.each(function (i) {
				var sourceElement = $source.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
				var destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
				var animationOptions;
				if (sourceElement.length === 0) {
					if ($.browser.msie) {
						animationOptions = {
							opacity: '1.0'
						};
					} else {
						animationOptions = {
							opacity: '1.0',
							scale: '1.0'
						};
					}
					
					destElement
					  .clone()
						.css('position', 'absolute')
						.css('margin', 0.0)
						.css('top', destElement.offset().top)
						.css('left', destElement.offset().left)
						.css('opacity', 0.0)
						.css('transform', 'scale(0.0)')
						.appendTo($sourceParent)
						.animate(animationOptions, options.duration, options.easing, postCallback);
				}
			});
			

		});
	};
})(jQuery);