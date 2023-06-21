document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    document.getElementById("deviceready").style="display:none";
    document.getElementById("header_logo").style="display:none";
    DiscordLogin();
}