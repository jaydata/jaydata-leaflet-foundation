/// <reference path="vendor/jquery.js" />

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
    return new $.Deferred(function (newDefer) {
        $.getJSON(url, newDefer.resolve);
    });
    //function (r) {
    //    console.dir(r);
    //});
}