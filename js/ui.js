//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
var ISCROLL_MOVE;

var ISCROLL_MOVE_LIMIT = 10;


/*var iScrolls = {
    iScrollOptions: {
        bounce: false,
        lockDirection: true,
        checkDOMChanges: true,
        useTransform: true,
        useTransition: true,
        onScrollStart: function (e) {
            ISCROLL_MOVE = 0;
        },
        onScrollMove: function (e) {
            ISCROLL_MOVE_LIMIT++;
        }
    },
    listScroll: null,
    listScrollInit: function () {
        //console.count("listScrollInit");

        if (iScrolls.listScroll) {
            //iScrolls.listScroll.destroy();
            //iScrolls.listScroll = null;
            iScrolls.listScroll.refresh();
        } else {
            iScrolls.listScroll = new iScroll('wrapper', iScrolls.iScrollOptions);
        }
    },
    rightScroll: null,
    rightScrollInit: function () {
        //console.count("rightScrollInit");

        if (iScrolls.rightScroll) {
            //iScrolls.rightScroll.destroy();
            //iScrolls.rightScroll = null;
            iScrolls.rightScroll.refresh();
        } else {
            iScrolls.rightScroll = new iScroll('wrapper-right', iScrolls.iScrollOptions);
        }
    }
};*/

function initUI() {
    var resizeTrigger;
    if (window.orientation === undefined) {
        window.onresize = function (event) {
            clearTimeout(resizeTrigger);
            resizeTrigger = setTimeout(function () { resizeUI(); }, 100);
        }
    } else {
        window.onorientationchange = function (event) {
            clearTimeout(resizeTrigger);
            resizeTrigger = setTimeout(function () { resizeUI(); }, 100);
        }
    }
};

window.hideRightPanel = function hideRightPanel() {
    $(".right-panel").addClass("hidden");
}

window.showRightPanel = function showRightPanel() {
    $(".right-panel").removeClass("hidden");

    /*setTimeout(function () {
        iScrolls.rightScrollInit();
    }, 100);*/
}

window.toggleRightPanel = function toggleRightPanel() {
    var right = $(".right-column");
    right.toggleClass("hidden");

    /*if (!right.hasClass("hidden")) {
        setTimeout(function () {
            iScrolls.rightScrollInit();
        }, 100);
    }*/
}

window.resizeUI = function resizeUI() {
    //console.count("resize UI");

    var mapHtml = document.getElementById("map"),
        left = $('.left-column'),
        large9 = $(".large-9")[0],
        windowWidth = window.innerWidth,
        windowHeight = window.innerHeight

    if (windowWidth < 480) {
        if (left.hasClass("open")) {
            mapHtml.style.height = (windowHeight - 250) + "px";
            large9.style.height = (windowHeight - 250) + "px";
        } else {
            mapHtml.style.height = windowHeight + "px";
            large9.style.height = windowHeight + "px";
        }
        mapHtml.style.width = windowWidth + "px";
        large9.style.width = windowWidth + "px";
        left[0].removeAttribute("style");
    }
    else if (windowWidth >= 480 && windowWidth <= 768) {
        if (left.hasClass("open")) {
            mapHtml.style.width = (windowWidth - $(".left-column").width()) + "px";
            large9.style.width = (windowWidth - $(".left-column").width() - 1) + "px";
            left[0].style.height = windowHeight + "px";
            document.getElementById("wrapper").style.height = (windowHeight - 67) + "px";
        } else {
            mapHtml.style.width = windowWidth + "px";
            large9.style.width = windowWidth + "px";
        }
        mapHtml.style.height = windowHeight + "px";
    }
    else {
        //console.log("desktop");

        mapHtml.style.width = (windowWidth - left.width()) + "px";
        mapHtml.style.height = windowHeight + "px";
        left[0].style.height = windowHeight + "px";
        document.querySelectorAll(".row.collapse.relative")[0].style.height = (windowHeight - 67) + "px";
    }

    //iScrolls.listScrollInit();
    lmap.invalidateSize();
}

window.toggleMap = function toggleMap() {
    $(".left-column").toggleClass("open");
    $(".map").toggleClass("open");

    resizeUI();
}