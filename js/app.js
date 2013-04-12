﻿/// <reference path="vendor/jquery.js" />
/// <reference path="vendor/jsrender.js" />
/// <reference path="vendor/jquery.observable.js" />
/// <reference path="vendor/jquery.views.js" />

function getAsQueryString(o) {
    var qryStr = '';

    Object.keys(o).forEach(function (key) {
        if (qryStr) {
            qryStr += "&";
        }
        qryStr += key + "=" + encodeURIComponent(o[key]);
    });
    qryStr += "&callback=?"
    return qryStr;
};

function search(options) {
    var query;

    if (options.bounds) {
        var lb = options.bounds.getSouthWest();
        var rt = options.bounds.getNorthEast();
        query = {
            lb_lat : lb.lat,
            lb_lng : lb.lng,
            rt_lat: rt.lat,
            rt_lng: rt.lng
        }
    } else {
        var center = options.center;
        query = {
            ct_lat: center.lat,
            ct_lng: center.lng,
            radius: options.radius
        }
    }

    $.extend(query, {
        q: options.q,
        limit: options.limit || 20,
        fuzzy: options.fuzzy || 0,
        offset: options.offset || 0
    });

    
    url = "http://hyperlocal.redth.info/search?" + getAsQueryString(query);
    //url = "http://omniplaces.com/query_rewriter_m1?" + getAsQueryString(query);
    return new $.Deferred(function (newDefer) {
        $.getJSON(url, newDefer.resolve);
    });

}


//http://omniplaces.com/query_rewriter_m1?&lb_lng=19.004367656103568&lb_lat=47.502074825082246&rt_lng=19.139980143896537&rt_lat=47.52810322204093&q=star&limit=10&confirmed=false&callback=YUI.Env.JSONP.yui_3_4_0_4_1365747286608_6
var bingKey = 'AmpN66zZQqp8WpszBYibPXrGky0EiHLPT75WtuA2Tmj7bS4jgba1Wu23LJH1ymqy';

lmap = new L.Map('map', { center: new L.LatLng(40.72121341440144, -74.00126159191132), maxZoom: 19, zoom: 15 });
var bing = new L.BingLayer(bingKey, { maxZoom: 19 });

lmap.addLayer(bing);

navigator.geolocation.getCurrentPosition(function (o) {
    //lmap.setView([o.coords.latitude, o.coords.longitude], 19);
    lmap.setView([40.72121341440144, -74.00126159191132], 15);
    console.log("position:", o);
});


$.templates({
    poiTemplate: '#poiTemplate',
    poiEditorTemplate: '#poiEditorTemplate'
});


$('#searchInput').keyup(function () {
    if (!(window.event.altKey || window.event.shiftKey || window.event.ctrlKey)) {
        var search = this.value;
        if (search.length > 2) {
            doSearch(search);
        };
    }
});

var visiblePins = L.layerGroup().addTo(lmap);

var results = [];
$([results]).bind("arrayChange", function (evt, o) {
    switch (o.change) {
        case "insert":
            o.items.forEach(function (p) {
                var marker = L.marker([p.record.lat, p.record.lon]);

                marker.addTo(visiblePins).on('click', function (e) {
                    toggleRightPanel();
                });

                var popup = $('#popupTemplate').render(p);
                marker.bindPopup(popup);

                p.getMarker = function () { return marker };

                p.removeFromMap = function () {
                    visiblePins.removeLayer(marker);
                }
            });
            break;
        default:
            o.items.forEach(function (item) {
                item.removeFromMap();
            });
    };
});

$.link.poiTemplate('#list', results)
     .on("click", "li", function () {
         var marker = $.view(this).data.getMarker();
         marker.openPopup();
         lmap.panTo(marker.getLatLng());
     })
    .on("click", ".edit-command", function () {
        $.link.poiEditorTemplate('#poiEditor', $.view(this).data)
              .on("click", ".save-command", function () {
                  toggleRightPanel();
               });
        showRightPanel();
    });


$.views.helpers({
    f: function () { return "f" }
});

function doSearch(q) {
    search({
        bounds: lmap.getBounds(),
        limit: 20,
        offset: 20,
        fuzzy: 1,
        q: q,
    }).then(function (x) {
        console.log(x.results);
        $.observable(results).remove(0, results.length);
        $.observable(results).insert(0, x.results);
    })
}

doSearch('Burg');
//$data
//    .initService('http://dev-open.jaystack.net/a11d6738-0e23-4e04-957b-f14e149a9de8/1162e5ee-49ca-4afd-87be-4e17c491140b/api/mydatabase')
//    .then(function (mydatabase, factory, type) {

//	var resultPins;


//});