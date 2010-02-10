(function($) {
	$.fn.sorted = function(customOptions) {
		var options = {
			reversed: false,
			by: function(a) {
				return a.text();
			}
		};
		$.extend(options, customOptions);
	
		$data = $(this);
		arr = $data.get();
		arr.sort(function(a, b) {
			
		   	var valA = options.by($(a));
		   	var valB = options.by($(b));
			if (options.reversed) {
				return (valA < valB) ? 1 : (valA > valB) ? -1 : 0;				
			} else {		
				return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;	
			}
		});
		return $(arr);
	};

})(jQuery);

$(function() {
	// bind radiobuttons in the form
	var $filter_type = $('#grid-filter input[name="type"]');
	var $filter_sort = $('#grid-filter input[name="sort"]');
	
	$filter_type.add($filter_sort).change(function(e) {
		if ($($filter_type+":checked").val() == 'all') {
			$filteredData = $("#data li")
		} else {
			$filteredData = $('#data li[data-type= ' + $($filter_type+":checked").val() + ']');
		}
		
		if ($('#grid-filter input[name="sort"]:checked').val() == "size") {
			var $sortedData = $filteredData.sorted({
				by: function(v) {
					return parseFloat($(v).find("span[data-type=size]").text());
				}
			});
		} else {
			var $sortedData = $filteredData.sorted({
				by: function(v) {
					return $(v).find("strong").text().toLowerCase();
				}
			});
		}   
	  	$('#list').quicksand($sortedData, {
	  	  duration: 800,
	  	  easing: 'easeInOutQuad'
	  	});
	
	});
});