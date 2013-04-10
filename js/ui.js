$(function(){
	var mapHtml 	= document.getElementById("map"),
	 	rowHtml 	= document.getElementById("row-full");

	// set map height
	if (L.Browser.mobile) {
		mapHtml.style.height = (window.innerHeight - 250) + "px";
	} else {
		mapHtml.style.height = window.innerHeight + "px";
		rowHtml.style.height = window.innerHeight + "px";
	}
});

function toggleRightPanel() {
	$(".right-panel").toggleClass("hidden");
}

function toggleMap() {
	var left = $(".left-column");
	left.toggleClass('open');

	if (left.is(":visible")) {
		document.getElementById("map").style.height = (window.innerHeight - 250) + "px";
	} else {
		document.getElementById("map").style.height = window.innerHeight + "px";
	}
}