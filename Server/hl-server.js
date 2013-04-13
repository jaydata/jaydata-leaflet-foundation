var connect = require('connect');
require('odata-server');
var app = connect();

var mySvc = $data.Base.extend("NyNs.MySvc", {

    update: function (p) {
        ///<param name="p" type="Object" />
        ///<returns type="string" />
        return function (ok, error) {
            var data = '';
            var http = require('http');
            var resFn = function (res) {
                res.on('data', function (d) {
                    data += d.toString('ascii');
                    console.log('response', d);
                });
                res.on('end', function () {
                    ok(data);
                    console.log('end');
                });
            };

            var errorFn = function (err) {
                error(err);
                console.log('error', err);
            };

            var req = http.request({
                host: 'hyperlocal.redth.info',
                port: 80,
                path: '/update?id=' + p.id,
                method: 'PUT',
            }, resFn);

            console.log('PUT', p);
            req.on('error', errorFn);
            req.end(JSON.stringify(p));

        };

    },
    create: function (p) {
        ///<param name="p" type="Object" />
        ///<returns type="string" />
        return function (ok, error) {
            var data = '';
            var http = require('http');
            var resFn = function (res) {
                res.on('data', function (d) {
                    data += d.toString('ascii');
                    console.log('response', d);
                });
                res.on('end', function () {
                    ok(data);
                    console.log('end');
                });
            };

            var errorFn = function (err) {
                error(err);
                console.log('error', err);
            };

            var req = http.request({
                host: 'hyperlocal.redth.info',
                port: 80,
                path: '/docs',
                method: 'PUT',
            }, resFn);

            console.log('PUT', p);
            req.on('error', errorFn);
            req.end(JSON.stringify(p));

        };

    }
});

app.use('/svc', $data.ODataServer({ type: mySvc, CORS: true }));

app.listen(6789, '192.168.10.100');


