document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    //console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    //setTimeout( () => {
        document.getElementById("deviceready").style="display:none";
        document.getElementById("header_logo").style="display:none";
        
        DiscordLogin();
    //},1000);
}

//setTimeout(onDeviceReady, 2000);
//if (window.usingCordova==false) {
    onDeviceReady();
//}

function handleOpenURL(url) {
    console.log("received url: " + url);
  }