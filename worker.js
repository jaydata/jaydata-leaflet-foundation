
includeScripts('js/jaydata/jaydata.js');
includeScripts('js/jaydata/jaydataproviders/sqliteprovider.js');
//postMessage("hello");

//for (var i in self) {
//    postMessage(i);
//}

var window = self;
window.document = {};

var knownPoints = {
};

function doSearch(url) {
    postMessage({
        type: 'search',
        url: url,
        result: []
    });
}

function onresult(data) {
    postMessage({
        type: 'search',
        data: data
    });
}

self.onmessage = function (msg) {
    switch (msg.type) {
        case "search":
            //script
            break;
    }
    //postMessage("w1:msg:rec", arguments);
}

var svcUrl = "http://127.0.0.1:6789/svc";

$data.service(svcUrl, function (args) {
    postMessage("yuhuhu");
});
//self.setInterval(function () {
//    //postMessage("w1:heart", arguments);
//}, 5000);