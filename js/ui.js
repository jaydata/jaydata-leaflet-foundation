function initUI() {

    var iScrolls = {
        listScroll: null,
        rightScroll: null
    };

    resizeUI();

    //================================================== FUNCTIONS ==================================================//
    window.toggleMap = function toggleMap() {
        var left = $(".left-column");
        left.toggleClass("open");

        var windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;

        if (windowWidth < 480) {
            if (left.hasClass("open")) {
                document.getElementById("map").style.height = (windowHeight - 250) + "px";
                setTimeout(function () {
                    initListIScroll();
                }, 350);
            } else {
                document.getElementById("map").style.height = windowHeight + "px";
            }
        } else if (windowWidth >= 480 || windowWidth <= 768) {
            if (left.hasClass("open")) {
                setTimeout(function () {
                    document.getElementById("map").style.width = (windowWidth - $(".left-column").width()) + "px";
                    $(".large-9")[0].style.width = (windowWidth - $(".left-column").width() - 1) + "px";
                    document.getElementById("wrapper").style.height = (window.innerHeight - 67) + "px";
                    $(".row-full .left-column")[0].style.height = window.innerHeight  + "px";
                    initListIScroll();
                }, 500);
            } else {
                document.getElementById("map").style.width = windowWidth + "px";
            }
        } else {
            document.getElementById("map").style.width = (windowWidth - $(".left-column").width()) + "px";
        }
        lmap.invalidateSize();
    }

    window.hideRightPanel = function hideRightPanel() {
        $(".right-panel").addClass("hidden");
    }

    window.showRightPanel = function showRightPanel() {
        $(".right-panel").removeClass("hidden");

        setTimeout(function () {
            initRightIScroll();
        }, 100);
    }

    window.toggleRightPanel = function toggleRightPanel() {
        var right = $(".right-column");
        right.toggleClass("hidden");

        if (!right.hasClass("hidden")) {
            setTimeout(function () {
                initRightIScroll();
            }, 100);
        }
    }

    var resizeTrigger;
    window.onresize = function(event) {
        clearTimeout(resizeTrigger);
        resizeTrigger = setTimeout(resizeFunction, 500);
    }
    function resizeFunction() {
        resizeUI();
    }

    function initRightIScroll() {
        if (iScrolls.rightScroll) {
            iScrolls.rightScroll.destroy();
            iScrolls.rightScroll = null;
        }

        iScrolls.rightScroll = new iScroll('wrapper-right', {
            bounce: false,
            lockDirection: true,
            checkDOMChanges: true,
            useTransform: true,
            useTransition: true
        });
    }

    function initListIScroll() {
        if (iScrolls.listScroll) {
            iScrolls.listScroll.destroy();
            iScrolls.listScroll = null;
        }

        iScrolls.listScroll = new iScroll('wrapper', {
            bounce: false,
            lockDirection: true,
            checkDOMChanges: true,
            useTransform: true,
            useTransition: true
        });
    }

    function resizeUI() {
        document.body.style.width = window.innerWidth + "px";

        if (L.Browser.mobile) {
            //document.getElementById("map").style.height = (window.innerHeight - 250) + "px";

            if (window.innerWidth < 480) {
                document.getElementById("map").style.width = window.innerWidth + "px";
            } else if (!$(".left-column").hasClass("open")) {
                document.getElementById("map").style.width = window.innerWidth + "px";
            }
        } else {
            document.getElementById("row-full").style.height = window.innerHeight + "px";
            document.getElementById("wrapper").style.height = (window.innerHeight - 67) + "px";
        }
        document.getElementById("map").style.height = window.innerHeight + "px";
        $(".large-9")[0].style.width = (window.innerWidth - $(".left-column").width() - 1) + "px";

        var maxH = document.querySelectorAll(".max-height-scroll");
        for (var i = 0; i < maxH.length; i++) {
            maxH[i].style.maxHeight = window.innerHeight + "px";
        }
        lmap.invalidateSize();
    }

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    initListIScroll();
    //document.addEventListener('DOMContentLoaded', function () { setTimeout(initListIScroll, 1500); }, false);
};

