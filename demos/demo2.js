$(function() {
	$("#control-panel a").click(function (e) {
		e.preventDefault();	
		$.get($(this).attr('href'), function(data) {
		  	$("#content").quicksand($(data).find(" > li"));
		});	
	});
});