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

        if (left.hasClass("open")) {
            document.getElementById("map").style.height = (window.innerHeight - 250) + "px";
            setTimeout(function () {
                initListIScroll();
            }, 350);
        } else {
            document.getElementById("map").style.height = window.innerHeight + "px";
        }
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
        resizeTrigger = setTimeout(resizeFunction, 100);
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
        } else {
            document.getElementById("row-full").style.height = window.innerHeight + "px";
            document.getElementById("wrapper").style.height = (window.innerHeight - 67) + "px";
        }
        document.getElementById("map").style.height = window.innerHeight + "px";

        var maxH = document.querySelectorAll(".max-height-scroll");
        for (var i = 0; i < maxH.length; i++) {
            maxH[i].style.maxHeight = window.innerHeight + "px";
        }
    }

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    document.addEventListener('DOMContentLoaded', function () { setTimeout(initListIScroll(), 1500); }, false);
};

