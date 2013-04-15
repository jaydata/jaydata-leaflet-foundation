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
        limit: options.limit || 100,
        fuzzy: options.fuzzy || 0,
        start: options.start || 0
    });


    url = "http://hyperlocal.redth.info/search?" + getAsQueryString(query);

    if (options.app) {
        var app = options.app;
        $.getJSON(url, function (x) {
            //console.log(x);
            console.log("result for: " + options.q);
            if ($('#searchInput').val() != options.q) {
                console.log("@@@@", "query outdated");
                return;
            }
            if (options.type === "new") {
                app.removeAllPoints();
            } else {
                app.removeInvisiblePoints();
            }
            
            x.results.forEach(function (p) {
                if (!app.pointIndex[p.record_id]) {
                    $.observable(app.items).insert(app.items.length, p);
                } else {
                    //console.log("not adding:" + p.record_id);
                }
            });

            //console.log(x.limit, x.results_found);
            if (!options.keepItems && (options.app.items.length < x.results_found) &&
                (options.maxItems > options.app.items.length) && (options.app.items.length < 1000)) {
                var newOpts = $.extend({}, options);
                newOpts.limit = 100;
                newOpts.type = "followup";
                newOpts.start = options.app.items.length;
                newOpts.keepItems = true;
                search(newOpts);
            }
        });
    } else {
        return new $.Deferred(function (newDefer) {
            $.getJSON(url, newDefer.resolve);
        });
    }
}


var searchQ = [];


search.enqueue = function (s, timeout) {
    if (!timeout) {

    } else {

    }
}

$.templates({
    poiTemplate: '#poiTemplate',
    poiListTemplate: '#poiListTemplate',
    poiEditorTemplate: '#poiEditorTemplate',
    mainTemplate: '#mainTemplate',
    addNewDialogTemplate: '#addNewDialogTemplate',
    popupTemplate: '#popupTemplate'
});


var app = {
    pins: null,
    removeInvisiblePoints: function () {
        var bounds = lmap.getBounds();
        var itemsToRemove = [];
        app.items.forEach(function (item, idx) {
            if (!bounds.contains([item.record.lat, item.record.lon])) {
                itemsToRemove.push(idx);
            }
        });
        itemsToRemove.reverse();
        itemsToRemove.forEach(function (idx) {
            //console.log("removing", idx);
            $.observable(app.items).remove(idx);
        });
    },
    removeAllPoints: function() {
        $.observable(app.items).remove(0, app.items.length);
    },
    pointIndex: {},
    query: "Burg",
    selectedItem: null,
    selectedPoint: null,
    newAddress: null,
    selectPoint: function (selectedPoint) {
        if (selectedPoint !== app.selectedPoint) {
            $.observable(app).setProperty("selectedPoint", selectedPoint);
        } else if (selectedPoint) {
            app.showEditor();
        }

    },
    selectItem: function(selectedItem) {
        $.observable(app).setProperty("selectedItem", selectedItem);
        app.selectPoint(selectedItem.data);
    },
    items: [],
    showEditor: function () {
        showRightPanel();
    },
    hideEditor: function () {
        hideRightPanel();
    }

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
                  app.selectPoint(p);
              })
              .on('drag', function (e) {
                  var latlng = e.target.getLatLng();
                  $.observable(app).setProperty({
                      "selectedPoint.record.lat": latlng.lat,
                      "selectedPoint.record.lon": latlng.lng
                  });
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

        var d = $('<div></div>');
        $.link.popupTemplate(d, p).on("click", "div", function() {
            app.showEditor();
        });
        //var popup = $('#popupTemplate').render(p);
        marker.bindPopup(d[0]);

        //$.observable(p).observe("record.name", function () {
        //    marker.bindPopup($('#popupTemplate').render(p));
        //});
        p.getMarker = function () { return marker };

        p.removeFromMap = function () {
            visiblePins.removeLayer(marker);
        }

        p.remove = function () {
            var self = this;
            return service.delete(self.record).then(function () {
                var idx = app.items.indexOf(self);
                $.observable(app.items).remove(idx);
            });
        }

        p.save = function () {
            var self = this;
            var data = {};
            Object.keys(self.record).forEach(function (key) {
                if (key == 'lat' || key == 'lon') {
                    data[key] = self.record[key];
                } else {
                    data[key] = encodeURIComponent(self.record[key]);
                }
            })
            if (self.isNew) {
                return service.create(data)
                       .then(function () {
                           $.observable(self).setProperty("isNew", false);
                           p.getMarker().setIcon(pointApi.getPointIcon(p));
                       });
            } else {
                return service.update(data)
                       .then(function () {
                           p.getMarker().setIcon(pointApi.getPointIcon(p));
                       });
            }
        }
    }

}


$([app.items]).bind("arrayChange", function (evt, o) {
    switch (o.change) {
        case "insert":
            o.items.forEach(function (p) {
                //if (!app.pointIndex[p.record_id]) {
                    app.pointIndex[p.record_id] = p;
                    pointApi.createMarkerFromPoint(p);
                //}
            });
            break;
        case "remove":
            o.items.forEach(function (item) {
                delete app.pointIndex[item.record_id];
                if (item.removeFromMap) {
                    item.removeFromMap();
                } else {
                    console.dir("!!!");
                }
                if (item === app.selectedPoint) {
                    app.selectPoint(null);
                    app.hideEditor();
                }
            });
            break;
        default:
            alert("!");
            throw "unknown";
    };
});



$.views.helpers({
    bgColor: function (selectedPoint) {
        return (selectedPoint && selectedPoint === this.data) ? "#4EC1F7" : "#ffffff";
    },
    app: app
})

var lmap;
var visiblePins = new L.MarkerClusterGroup();
var previousValue = '';

$.link.mainTemplate('#row-full', app)
     .on("click", "li", function () {
         var selectedItem = $.view(this);
         app.selectItem(selectedItem);
         var marker = $.view(this).data.getMarker();
         marker.openPopup();
         lmap.panTo(marker.getLatLng());
     })
     .on("click", ".edit-command", function () {
         app.showEditor();
         var marker = $.view(this).data.getMarker();
         marker.openPopup();
         visiblePins.zoomToShowLayer($.view(this).data.getMarker(), function () {
             app.showEditor();
         });
     })
     .on("keyup", "#searchInput", function () {
         if (previousValue != this.value) {
             previousValue = this.value;
             var search = this.value;
             if (search.length > 2) {
                 doSearch("new");
             };
         }
     })
     .on("click", ".save-command", function () {
         ensureAuthenticate()
             .then(function (n) {
                 app.selectedPoint.save().then(function () {
                     app.hideEditor();
                 });
             })
             .fail(function () { alert('error') });
        //ensureAuthenticate().then(function () {
        //    alert("!");
        //});
     })
    .on("click", ".remove-command", function () {
        ensureAuthenticate()
            .then(function (n) {
                app.selectedPoint.remove().then(function () {
                    app.hideEditor();
                });
            })
            .fail(function () { alert('error') });
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
         var self = this;
         ensureAuthenticate()
             .then(function (n) {
                 $('#addNewPoint').foundation('reveal', 'close');
                 showRightPanel();
             })
             .fail(function () {
                 $.observable(app.items).remove(app.items.indexOf(app.selectedPoint));
                 hideRightPanel();
                 app.selectPoint(null);
             });

         //window.setTimeout(function () {
         //    ensureAuthenticate()
         //        .then(function (n) {
         //            $('#addNewPoint').foundation('reveal', 'close');
         //            showRightPanel();
         //        })
         //        .fail(function () {
         //            $.observable(app.items).remove(app.items.indexOf(app.selectedPoint));
         //            hideRightPanel();
         //            app.selectPoint(null);
         //        });

         //}, 500);
         
    });


//http://omniplaces.com/query_rewriter_m1?&lb_lng=19.004367656103568&lb_lat=47.502074825082246&rt_lng=19.139980143896537&rt_lat=47.52810322204093&q=star&limit=10&confirmed=false&callback=YUI.Env.JSONP.yui_3_4_0_4_1365747286608_6
var bingKey = 'AmpN66zZQqp8WpszBYibPXrGky0EiHLPT75WtuA2Tmj7bS4jgba1Wu23LJH1ymqy';
lmap = new L.Map('map', { center: new L.LatLng(40.72121341440144, -74.00126159191132), maxZoom: 19, zoom: 15 });
var bing = new L.BingLayer(bingKey, { maxZoom: 19 });
app.pins = visiblePins;
visiblePins.addTo(lmap);
lmap.addLayer(bing);


initUI();

function defaultSearch(type) {
    return {
        bounds: lmap.getBounds(),
        limit: 20,
        type: type || 'new',
        offset: 0,
        fuzzy: 0,
        q: $('#searchInput').val(),
        app: app,
        map: lmap,
        maxItems: 120
    };
}

function doSearch(type, wait) {
    search(defaultSearch(type));
}
navigator.geolocation.getCurrentPosition(function (o) {
    //lmap.setView([o.coords.latitude, o.coords.longitude], 15);
    lmap.setView([40.72121341440144, -74.00126159191132], 15);
    console.log("position:", o);
    doSearch();
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
initAuth();
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
                //console.dir(r.Results[0]);
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
        lmap.on('dragend', function (e) {
            doSearch("reposition");
        });
        lmap.on('zoomend', function (e) {
            doSearch("reposition");
        });

    });
//	var resultPins;

$(document).on("click", ".popup-bubble", function (e) {
    alert("!");
});

//});