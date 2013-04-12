function initAuth() {
    hello.init({
        facebook: '439026716191124',
        google: '449285537332-jkcc38anllj53up1frq2cjjockgpct5i.apps.googleusercontent.com'
    });
    hello.subscribe('auth.login', function (auth) {
        // call user information, for the given network
        hello.api(auth.network + '/me', function (r) {
            if (!r.id || !!document.getElementById(r.id)) {
                return;
            }
            //var target = document.getElementById("profile_"+ auth.network );
            //target.innerHTML = '<img src="'+ r.picture +'" /> Hey '+r.name;
            window.logedInUser = r;
            console.log(r);
        });
    });
    hello.subscribe('auth.logout', function (auth) {
        window.logedInUser = null;
    });
}
function logedIn() {
    return window.logedInUser != null;
}
function doLogin(network) {
    hello.login(network);
    $('#login').foundation('reveal', 'close');
}