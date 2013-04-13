/// <reference path="vendor/jquery.js" />
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
            lb_lat: lb.lat,
            lb_lng: lb.lng,
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





$.templates({
    poiTemplate: '#poiTemplate',
    poiListTemplate: '#poiListTemplate',
    poiEditorTemplate: '#poiEditorTemplate',
    mainTemplate: '#mainTemplate',
    addNewDialogTemplate: '#addNewDialogTemplate'
});


var app = {
    pins: visiblePins,
    selectedItem: null,
    selectedPoint: null,
    newAddress: null,
    selectPoint: function (selectedPoint) {
        $.observable(app).setProperty("selectedPoint", selectedPoint);

    },
    selectItem: function(selectedItem) {
        $.observable(app).setProperty("selectedItem", selectedItem);
        app.selectPoint(selectedItem.data);
    },
    items: []
}


var service;

var pointApi = {
    markerIcons : {
        'My Pins': undefined,
        'Food & Drink': L.AwesomeMarkers.icon({
            icon: 'food', color: 'red', spin: false
        }),
        'Manufacturing & Wholesale Goods': L.AwesomeMarkers.icon({
            icon: 'truck', color: 'green', spin: false
        }),
        'Public Place': L.AwesomeMarkers.icon({
            icon: 'camera', color: 'purple', spin: false
        }),
        'Retail Goods': L.AwesomeMarkers.icon({
            icon: 'shopping-cart', color: 'purple', spin: false
        }),
        'Services': L.AwesomeMarkers.icon({
            icon: 'cog', color: 'darkgreen', spin: false
        }),
        'Transportation': L.AwesomeMarkers.icon({
            icon: 'exchange', color: 'cadetblue', spin: false
        }),
        'Other': L.AwesomeMarkers.icon({
            icon: 'exchange', color: 'green', spin: false
        }),
        'NewPoint': L.AwesomeMarkers.icon({
            icon: 'cog', color: 'green', spin: true
        })
    },
    getPointIcon : function getPointIcon(p) {
        return p.isNew ? pointApi.markerIcons['NewPoint'] : pointApi.markerIcons[p.record.type] || pointApi.markerIcons['Other'];
    },
    createMarkerFromPoint: function createMarkerFromPoint(p) {
        var marker = L.marker([p.record.lat, p.record.lon], {
            draggable: true,
            icon: pointApi.getPointIcon(p)
        });

        marker.addTo(visiblePins)
              .on('touchstart', function(e) {
                  console.dir("touch");
              })
              .on('click', function (e) {
                  //toggleRightPanel();
                  $.observable(app).setProperty("selectedPoint", p);
              })
              .on('drag', function (e) {
                  var latlng = e.target.getLatLng();
                  $.observable(app).setProperty("selectedPoint.record.lat", latlng.lat);
                  $.observable(app).setProperty("selectedPoint.record.lon", latlng.lng);
              })
             .on('dragend', function (e) {  
                 //g.latlon.coordinates = [e.target._latlng.lng, e.target._latlng.lat];
                 //g.latlon = g.latlon;
                 //resetProps(g);
                 //g.save()
                 //    .then(function () {
                 //        socket.emit('movePoint', { sender: me, p: JSON.stringify(g) });
                 //    });
             })

        var popup = $('#popupTemplate').render(p);
        marker.bindPopup(popup);

        p.getMarker = function () { return marker };

        p.removeFromMap = function () {
            visiblePins.removeLayer(marker);
        }
    }

}

$([app.items]).bind("arrayChange", function (evt, o) {
    switch (o.change) {
        case "insert":
            o.items.forEach(function (p) {
                p.save = function () {
                    var self = this;
                    if (self.isNew) {
                        return service.create(self.record)
                               .then(function () {
                                   $.observable(self).setProperty("isNew", false);
                                   p.getMarker().setIcon(pointApi.getPointIcon(p));
                                });
                    } else {
                        return service.update(self.record)
                               .then(function () {
                                   p.getMarker().setIcon(pointApi.getPointIcon(p));
                               });
                    }
                }
                pointApi.createMarkerFromPoint(p);
            });
            break;
        default:
            o.items.forEach(function (item) {
                item.removeFromMap();
            });
    };
});



$.views.helpers({
    bgColor: function (selectedPoint) {
        return (selectedPoint && selectedPoint === this.data) ? "#4EC1F7" : (this.getIndex() % 2 ? "#fdfdfe" : "#efeff2");
    },
    app: app
})

var lmap;

$.link.mainTemplate('#row-full', app)
     .on("click", "li", function () {
         var selectedItem = $.view(this);
         app.selectItem(selectedItem);
         var marker = $.view(this).data.getMarker();
         marker.openPopup();
         lmap.panTo(marker.getLatLng());
     })
     .on("click", ".edit-command", function () {
         showRightPanel();
     })
     .on("keyup", "#searchInput", function () {
         if (!(window.event.altKey || window.event.shiftKey || window.event.ctrlKey)) {
             var search = this.value;
             if (search.length > 2) {
                 doSearch(search);
             };
         }
     })
    .on("click", ".save-command", function () {
        ensureAuthenticate();
        if (app.selectedPoint.save) {
            app.selectedPoint.save().then(function() {
                hideRightPanel();
            });
        }
        //ensureAuthenticate().then(function () {
        //    alert("!");
        //});
    })
    .on("click", ".cancel-command", function () {
        $('#addNewPoint').foundation('reveal', 'close');
        //console.log(
        $.observable(app.items).remove(app.items.indexOf(app.selectedPoint));
        hideRightPanel();
        app.selectPoint(null);
    })
    .on("click", ".ok-command", function () {
        $('#addNewPoint').foundation('reveal', 'close');
        showRightPanel();
    });

initUI();

//http://omniplaces.com/query_rewriter_m1?&lb_lng=19.004367656103568&lb_lat=47.502074825082246&rt_lng=19.139980143896537&rt_lat=47.52810322204093&q=star&limit=10&confirmed=false&callback=YUI.Env.JSONP.yui_3_4_0_4_1365747286608_6
var bingKey = 'AmpN66zZQqp8WpszBYibPXrGky0EiHLPT75WtuA2Tmj7bS4jgba1Wu23LJH1ymqy';
lmap = new L.Map('map', { center: new L.LatLng(40.72121341440144, -74.00126159191132), maxZoom: 19, zoom: 15 });
var bing = new L.BingLayer(bingKey, { maxZoom: 19 });
var visiblePins = L.layerGroup().addTo(lmap);
lmap.addLayer(bing);




function doSearch(q) {
    search({
        bounds: lmap.getBounds(),
        limit: 20,
        offset: 0,
        fuzzy: 0,
        q: q,
    }).then(function (x) {
        console.log(x.results);
        $.observable(app.items).remove(0, app.items.length);
        $.observable(app.items).insert(0, x.results);
    });
}
navigator.geolocation.getCurrentPosition(function (o) {
    lmap.setView([o.coords.latitude, o.coords.longitude], 15);
    ///lmap.setView([40.72121341440144, -74.00126159191132], 15);
    console.log("position:", o);
    doSearch('alma');
});


//initAuth();
//setTimeout(function () {
//    if (!logedIn()) {
//        $('#login').foundation('reveal', 'open');
//    }
//}, 2000);
//$data.initService("http://192.168.10.100:6789/svc").then(function (svc, f, t) {
//    service = svc;
//});

$data
    .initService('http://dev-open.jaystack.net/a11d6738-0e23-4e04-957b-f14e149a9de8/1162e5ee-49ca-4afd-87be-4e17c491140b/api/mydatabase')
    .then(function (mydatabase, factory, type) {
        var timer;
        service = mydatabase;
        lmap.on('click', function (e) {
            //window.clearTimeout(timer);
            //timer = window.setTimeout(function () {
            //var g = new mydatabase.HyperLocal.elementType();
            var r = {
                lon : e.latlng.lng,
                lat : e.latlng.lat,
                attribution : "Created by MapPointEditor, (c) JayStack inc.",
                z: "HYP3RL0C4LZZZ",
                id:$data.createGuid().toString()
            };

            var p = {
                isNew: true,
                record: r
            };

            $.observable(app.items).insert(0, p);
            app.selectPoint(p);
            $.observable(app).setProperty("newAddress", null);
            hideRightPanel();
            $('#addNewPoint').foundation('reveal', 'open');
            mydatabase.reverse(e.latlng).then(function (r) {
                console.dir(r.Results[0]);
                var theAddress = r.Results[0].Address;
                $.observable(app).setProperty("newAddress", r.Results[0]);
                $.observable(app).setProperty({
                    "selectedPoint.record.addr": theAddress.AddressLine,
                    "selectedPoint.record.city": theAddress.Locality,
                    "selectedPoint.record.province": theAddress.AdminDistrict,
                    "selectedPoint.record.country": theAddress.CountryRegion,
                    "selectedPoint.record.postal": theAddress.PostalCode
                });
            });
        });

        lmap.on('dblclick', function (e) {
            window.clearTimeout(timer);
        });

    });
//	var resultPins;


//});