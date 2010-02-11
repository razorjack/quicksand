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

		$.extend(options, customOptions);
		
		return this.each(function (i) {
			var $collection = $(collection).clone();
			var $sourceParent = $(this);
			var sourceHeight = $(this).css('height');
			var offset = $($sourceParent).offset();
			var offsets = [];
			var horizCorrection = parseFloat($('body').css('border-left-width'));
			var vertCorrection = parseFloat($('body').css('border-top-width'));
			var relativeTop = 0;
			var relativeLeft = 0;

			$sourceParent.css('height', $(this).height());
			var $source = $(this).find(options.selector);
			
			$($source.parentsUntil("html").toArray().reverse()).each(function (i) {
				if ($(this).css('position') == 'relative') {
					o = $(this).offset();
					relativeTop = o.top;
					relativeLeft = o.left;
				}
			});

			$source.each(function (i) {
				offsets[i] = $(this).offset();
			});
			
			$(this).stop();	
			$source.each(function (i) {
				$(this).stop();
				$(this)
				  .css('position', 'absolute')
				  .css('margin', 0)
				  .css('top', offsets[i].top - parseFloat($(this).css('margin-top')) + vertCorrection - relativeTop)
				  .css('left', offsets[i].left - parseFloat($(this).css('margin-left')) + horizCorrection - relativeLeft);

			});
				
			var $dest = $($sourceParent).clone().html('').attr('id', '').attr("data-quicksand-owner", $sourceParent.selector).css('height', 'auto').append($collection);
			var postCallbackPerformed = 0;	
			var postCallback = function () {
				if (!postCallbackPerformed) {
					$sourceParent.html($dest.html());				
					$("[data-quicksand-owner=" + cssPath($sourceParent) + "]").remove();
					postCallbackPerformed = 1;
				}
			};

			$dest.insertBefore($sourceParent).css('z-index', 1)
										     .css('opacity', 0.0)
										     .css('margin', 0.0)
										     .css('position', 'absolute')
										     .css('top', offset.top + vertCorrection - relativeTop)
										     .css('left', offset.left + horizCorrection - relativeLeft)
											 .attr('data-quicksand-owner', cssPath($sourceParent));
			
			$dest.offset(offset);
			if (options.adjustHeight) {
				$sourceParent.animate({height: $dest.height()}, options.duration, options.easing, function (e) {
					$sourceParent.css('height', 'auto');
				});
			}
			
			$source.each(function (i) {
				var destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
				if (destElement.length) {
					if ($.browser.msie) {
						$(this).animate({top: destElement.offset().top + vertCorrection - relativeTop, left: destElement.offset().left + horizCorrection - relativeLeft, opacity: 1.0}, options.duration, options.easing, postCallback);
					} else {
						$(this).animate({top: destElement.offset().top + vertCorrection - relativeTop, left: destElement.offset().left + horizCorrection - relativeLeft, opacity: 1.0, scale: '1.0'}, options.duration, options.easing, postCallback);
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
						.css('top', destElement.offset().top + vertCorrection - relativeTop)
						.css('left', destElement.offset().left + horizCorrection - relativeLeft)
						.css('opacity', 0.0)
						.css('transform', 'scale(0.0)')
						.appendTo($sourceParent)
						.animate(animationOptions, options.duration, options.easing, postCallback);
				}
			});
			

		});
	};
})(jQuery);