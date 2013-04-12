document.body.style.width = window.innerWidth + "px";

// set map height
if (L.Browser.mobile) {
	document.getElementById("map").style.height = (window.innerHeight - 250) + "px";
} else {
	document.getElementById("row-full").style.height = window.innerHeight + "px";
}
document.getElementById("map").style.height = window.innerHeight + "px";

var maxH =  document.querySelectorAll(".max-height-scroll");
for(var i = 0; i < maxH.length; i++){
	maxH[i].style.maxHeight = window.innerHeight + "px";
}

function toggleRightPanel() {
	$(".right-panel").toggleClass("hidden");
}

function toggleMap() {
	var left = $(".left-column");
	left.toggleClass("open");

	if (left.hasClass("open")) {
		document.getElementById("map").style.height = (window.innerHeight - 250) + "px";
	} else {
		document.getElementById("map").style.height = window.innerHeight + "px";
	}
document.body.style.width = window.innerWidth + "px";

// set map height
if (L.Browser.mobile) {
	document.getElementById("map").style.height = (window.innerHeight - 250) + "px";
} else {
	document.getElementById("row-full").style.height = window.innerHeight + "px";
}
document.getElementById("map").style.height = window.innerHeight + "px";

function showRightPanel() {
    $(".right-panel").removeClass("hidden");
}

function toggleRightPanel() {
	$(".right-panel").toggleClass("hidden");
}

function toggleMap() {
	var left = $(".left-column");
	left.toggleClass("open");

	if (left.hasClass("open")) {
		document.getElementById("map").style.height = (window.innerHeight - 250) + "px";
	} else {
		document.getElementById("map").style.height = window.innerHeight + "px";
	}
}
